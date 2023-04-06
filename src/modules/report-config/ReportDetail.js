import React, { useEffect } from 'react';

import { NoDataFound, Loader } from '../../components';
import { DataTable } from '../user-management';
import { SwitchInput, CustomControl, SwitchContainer } from "modules/EndorsementRequest/custom-sheet/components.js";

import { useDispatch, useSelector } from 'react-redux';
import {
  downloadReportTemplate, loadTemplatesData, clear,
  report_url as setReport_url, updateTemplateStatus
} from './report-config.slice';
import swal from 'sweetalert';
import { downloadFile } from '../../utils';

export default function ReportDetail() {

  const dispatch = useDispatch();
  const { templates, report_url, success, error, loading } = useSelector(state => state.reportConfig);
  const { userType } = useSelector((state) => state.login);

  useEffect(() => {
    if (userType) {
      dispatch(loadTemplatesData(true, userType))

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType])

  useEffect(() => {
    if (report_url)
      downloadFile(report_url, undefined, true);

    return () => { dispatch(setReport_url('')) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [report_url])

  useEffect(() => {
    if (success) {
      dispatch(loadTemplatesData(false, userType))
    }
    if (error) {
      swal("Alert", error, 'warning')
    }

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success,error])

  return !loading ? templates.length ? (
    <DataTable
      columns={TableData || []}
      data={templates || []}
      noStatus={true}
      pageState={{ pageIndex: 0, pageSize: 5 }}
      pageSizeOptions={[5, 10, 20, 50]}
      rowStyle
      deleteFlag={'custom_delete'}
    // removeAction={removeNominee}
    />
  ) :
    <NoDataFound />
    :
    <Loader />
}

const DownloadReport = (cell) => {
  const dispatch = useDispatch();

  return (<span
    role='button'
    onClick={() => (cell.value)
      ? dispatch(downloadReportTemplate({ template_id: cell.value }))
      : swal("Document not available", "", "info")}>
    <i className={(cell.value) ? "ti ti-download" : "ti ti-close"}></i>
  </span >)
}

const TableData = [
  {
    Header: "Report Template",
    accessor: "name",
  },
  {
    Header: "Created By",
    accessor: "created_by",
  },
  {
    Header: "Download Report",
    accessor: "id",
    Cell: DownloadReport,
    disableFilters: true,
    disableSortBy: true,
  },
  {
    Header: "Status",
    accessor: "status_to_display",
    disableFilters: true,
    disableSortBy: true,
    Cell: (data) => {
      const dispatch = useDispatch();

      const handleChange = (e) => {
        dispatch(updateTemplateStatus({
          template_id: data.row.original.id,
          status: data.row.original.status ? 0 : 1
        }))
        // setIsChecked(!isChecked);
      };
      return (
        // <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={data?.value ? "success" : "secondary"}>
        //   {data.value ? "Active" : "Disable"}
        // </Button>
        <CustomControl>
          <SwitchContainer>
            <label>
              <SwitchInput
                // dark={dark}
                checked={data.row.original.status}
                onChange={handleChange}
                type="checkbox"
              />
              <div>
                <div></div>
              </div>
            </label>
          </SwitchContainer>
        </CustomControl>
      );
    }
  }
]
