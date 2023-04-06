import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';

import { AttachFileDiv, FlexContainer } from '../core/attachFile/style';
import { DataTable } from "../user-management";
import { RoundColor } from './style';
import { NoDataFound, sortType } from '../../components';
import { Button } from 'react-bootstrap';

import {
  loadPolicyWise, sampleFile, submitInsurerCdStatement,
  submitInsurerEndorsementReport, loadInsurerCrossCheck, loadInsurerCdStatement
} from './service';
import { downloadFile } from 'utils';
import { DateFormate, serializeError } from '../../utils';
import { useSelector } from 'react-redux';
import { InsurerCDModal } from './InsurerCDModal';
import validation from 'config/validations/common.js'

const ApiCalls = async (dispatch, data, userTypeName) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: true } });
    const { data: policWise } = await loadPolicyWise(data, userTypeName);
    const { data: sampleFormat } = await sampleFile(data.type === 1 ?
      { policy_id: data.policy_id } :
      undefined);

    let policyWiseData = [];
    policWise.data?.length && policWise.data.forEach(({ member_addition, member_correction, member_deleted }) => {
      member_addition && policyWiseData.push(member_addition);
      member_correction && policyWiseData.push(member_correction);
      member_deleted && policyWiseData.push(member_deleted);
    })

    dispatch({
      type: 'GENERIC_UPDATE',
      payload: {
        policWise: policyWiseData || [],
        sampleUrl: sampleFormat?.data || '',
        loading2: false
      }
    })

  } catch (error) {
    console.error(error);
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
    swal('', 'Data Not Found!', "warning");
  }
}

export const UploadFileApi = async (data, type, payload, dispatch) => {
  try {
    const { success, message, errors } = await (type === 'insurer_cd_statement' ? submitInsurerCdStatement : submitInsurerEndorsementReport)(data);
    if (success) {
      swal('Success', message, 'success')
      type === 'insurer_cd_statement' && InsurerCdStatement(dispatch, payload);
    } else {
      swal('Failed', serializeError(message || errors), "warning");
    }
  } catch (error) {
    console.error(error);
    swal('Failed', 'Server error!', "warning");
  }
}

export const InsurerCdStatement = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: true } });
    const { data } = await loadInsurerCdStatement(payload);
    if (data.data) {
      dispatch({
        type: 'GENERIC_UPDATE', payload: {
          loading2: false,
          insurerCdDocument: data.data || []
        }
      });
    }
    else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
  }
}

const DownloadFileApi = async (payload) => {
  try {
    const { data, success, message, errors } = await loadInsurerCrossCheck(payload);
    if (success && data.data) {
      downloadFile(data.data?.url)
    }
    else
      swal('Failed', serializeError(message || errors), "warning")
  } catch (error) {
    console.error(error);
    swal('Failed', 'Server error!', "warning");
  }
}

const extractChild = (childs, employer_child_companies_id) => {

  const result = childs?.find((item) => item.id === employer_child_companies_id);
  if (result) {
    return ({
      entity_id: (result.id).replace('c-', '').replace('e-', ''),
      is_child: result.is_child
    })
  } else {
    return ({})
  }
}

export default function PolicyWise({
  policy_id, type, employer_child_companies_id,
  policWise, sampleUrl, childs, dispatch,
  myModule, insurerCdDocument }) {

  const { currentUser, userType } = useSelector(state => state.login);
  const [modal, setModal] = useState(false)

  useEffect(() => {
    if (userType) {
      ((type === 1 && policy_id) || ([2, 3].includes(type) && employer_child_companies_id)) ?
        ApiCalls(dispatch, {
          type,
          ...(type === 1 && { policy_id }),
          ...(type === 2 && extractChild(childs, employer_child_companies_id)),
          ...(type === 3 && { policy_id: employer_child_companies_id })
        }, userType, { sampleUrl }) :
        dispatch({ type: 'GENERIC_UPDATE', payload: { policWise: [] } })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policy_id, type, employer_child_companies_id, userType])


  const _renderExportPolicyAction = ({ value, column, row }) => {
    return (
      <FlexContainer className='justify-content-center' onClick={() =>
        column.id === 'endorsement_url' ? downloadFile(value) :
          DownloadFileApi({ broker_id: currentUser.broker_id, policy_id: row.original.policy_id })}>
        <RoundColor>
          <i className="ti ti-download"></i>
        </RoundColor>
        <p className="my-auto ml-2">{'Download'}</p>
      </FlexContainer>
    );
  };

  const DownloadSample = (cell) => {
    const { globalTheme } = useSelector(state => state.theme)
    return sampleUrl ? <Button variant='outline-secondary' size='sm' onClick={() => downloadFile(sampleUrl)}>
      <i
        className="ti-cloud-down attach-i"
        style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
      />
      {'Download Sample Format'}
    </Button> : null
  }

  return <>{policWise.length ? (
    <DataTable
      columns={ColumnStructure(_renderExportPolicyAction, DownloadSample, myModule, setModal)}
      data={policWise?.map((elem) => ({
        ...elem,
        endorsement_date: DateFormate(elem.endorsement_date)
      }))}
      noStatus={true}
      pageState={{ pageIndex: 0, pageSize: 5 }}
      pageSizeOptions={[5, 10, 20, 50]}
      rowStyle
      showFilter
      autoResetPage={false}
    />
  ) : <NoDataFound />}
    {!!modal && <InsurerCDModal
      show={!!modal}
      payload={modal}
      onHide={() => setModal(false)}
      insurerCdDocument={insurerCdDocument}
      dispatch={dispatch}
    />}
  </>
}

const UploadType = {
  'insurer_cd_statement': 'Upload Insurer CD Statement?',
  'upload_insurer_endorsement_report': 'Upload Insurer Endorsement Report?'
}

const UploadCell = ({ column, row }) => {

  const returnFile = (e) => {
    e.persist();
    if (validation.fileType.some((fileType) => (e.target?.files[0]?.name || '').toLowerCase().endsWith(fileType))
    ) {
      swal({
        title: "Upload Document?",
        text: UploadType[column.id],
        icon: "warning",
        buttons: {
          cancel: "Cancel",
          'upload': true
        },
        dangerMode: true,
      })
        .then(function (caseValue) {
          switch (caseValue) {
            case "upload":
              const formData = new FormData();
              formData.append('policy_id', row.original.policy_id);
              if (column.id === 'insurer_cd_statement') {
                formData.append('document_name', e.target.files[0].name);
                formData.append('documents', e.target.files[0]);
                UploadFileApi(formData, column.id);
              }
              if (column.id === 'upload_insurer_endorsement_report') {
                formData.append('policy_number', row.original.policy_id);
                formData.append('employer_id', row.original.employer_id);
                formData.append('member_sheet', e.target.files[0]);
                UploadFileApi(formData, column.id);
              }
              break;
            default:
          }
          e.target.value = null;
        })
    }
    else {
      swal('File Extension Not Supported', '', 'warning')
      e.target.value = null;
    }

  }

  return (
    <FlexContainer className='justify-content-center'>
      <AttachFileDiv style={{ position: 'relative', marginRight: '0' }}>
        <i className="ti-clip attach-i"></i>
        <input
          type="file"
          onClick={(event) => {
            event.target.value = null;
          }}
          id={column.id}
          name={column.id}
          onInput={returnFile}
          accept=".xls, .xlsx, .jpg, .png, .jpeg, .tiff, .eml, .msg, .pdf, .gif, .doc, .docx, .csv, .ppt, .pptx"
          // required={required}
          style={{ opacity: -2.3 }}
        />
      </AttachFileDiv>
      <p className="my-auto ml-2">{'Upload'}</p>
    </FlexContainer>
  )
}


export const RenderView = ({ row }, setModal, other) => {
  const { globalTheme } = useSelector(state => state.theme)
  return (
    <Button size="sm" className="shadow rounded-lg align-items-center" variant='light' onClick={() =>
      setModal({ policy_id: row.original.policy_id, other: other })}>
      View&nbsp;<i style={{ fontSize: globalTheme.fontSize ? `calc(0.7rem + ${globalTheme.fontSize - 92}%)` : '0.7rem' }} className='ti-angle-up text-primary' />
    </Button>)
};

const ColumnStructure = (_renderExportPolicyAction, DownloadSample, myModule, setModal) => [
  {
    Header: "Policy Name",
    accessor: "policy_name",
  },
  {
    Header: "Upload Type",
    accessor: "endorsement_inception",
  },
  {
    Header: "Endorsement Type",
    accessor: "endorsement_type",
  },
  {
    Header: "Employer",
    accessor: "employer_name",
  },

  {
    Header: "Member Count",
    accessor: "members_count",
  },
  {
    Header: "Endorsement Date",
    accessor: "endorsement_date",
    sortType: sortType
  },
  {
    Header: "IPD Premium Amount",
    accessor: "ipd_premium",
  },
  {
    Header: "OPD Premium Amount",
    accessor: "opd_premium",
  },
  {
    Header: "Transaction Type",
    accessor: "deduction_type",
  },
  {
    Header: "Endorsement Report",
    accessor: "endorsement_url",
    disableFilters: true,
    disableSortBy: true,
    Cell: _renderExportPolicyAction
  },
  ...(myModule?.canwrite ? [{
    Header: "Upload Insurer Endorsement Report",
    accessor: "upload_insurer_endorsement_report",
    disableSortBy: true,
    Cell: UploadCell,
    Filter: DownloadSample,
  }] : []),
  {
    Header: "Insurer Endorsement Report",
    accessor: "insurer_url",
    disableFilters: true,
    disableSortBy: true,
    Cell: _renderExportPolicyAction
  },
  ...(myModule?.canwrite ? [{
    Header: "Insurer CD Statement",
    accessor: "insurer_cd_statement",
    disableFilters: true,
    disableSortBy: true,
    // Cell: UploadCell
    Cell: (e) => RenderView(e, setModal, 0)
  }] : []),
  ...(myModule?.canwrite ? [{
    Header: "Other Documents",
    accessor: "other_document",
    disableFilters: true,
    disableSortBy: true,
    // Cell: UploadCell
    Cell: (e) => RenderView(e, setModal, 1)
  }] : []),
  {
    Header: "Cover Type",
    accessor: "cover_type",
  }
]
