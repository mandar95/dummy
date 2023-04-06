import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { DataTable } from "../../user-management";
import swal from "sweetalert";
import _ from "lodash";
import { Button } from 'react-bootstrap';
import {
  getAnnouncement,
  selectAnnouncement,
  selectdeleteResp,
  deleteAlertCleanUp,
  deleteAnnouncement,
} from "../announcement.slice";
import { DateFormate } from "../../../utils";

const TableData = (remove, write) => [
  {
    Header: "Employers",
    accessor: "employer",
    Cell: (data) => {
      return data.value.map(({ name }, index) =>
        <Button key={name + index} disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
          {name}
        </Button>)
    },
    disableSortBy: true,
    filter: (rows, id, filterValue) => {
      return rows.filter(row => {
        const keywords = row.values[id];
        return keywords.some(({ name }) => String(name)
          .toLowerCase()
          .includes(String(filterValue).trimStart().toLowerCase()))
      });
    }
  },
  {
    Header: "Modules",
    accessor: "module",
    Cell: (data) => {
      return data.value.map(({ module_name }, index) =>
        <Button key={module_name + index} disabled size="sm" className="shadow m-1 rounded-lg" variant='light' style={{ opacity: '1' }}>
          {module_name}
        </Button>)
    },
    disableSortBy: true,
    filter: (rows, id, filterValue) => {
      return rows.filter(row => {
        const keywords = row.values[id];
        return keywords.some(({ module_name }) => String(module_name)
          .toLowerCase()
          .includes(String(filterValue).trimStart().toLowerCase()))
      });
    }
  },
  {
    Header: "Type Name",
    accessor: "type_name",
  },
  {
    Header: "Title",
    accessor: "title",
  },
  {
    Header: "Size",
    accessor: "size_name",
  },
  {
    Header: "Position",
    accessor: "position",
  },
  {
    Header: "Alignment",
    accessor: "alignment",
  },
  {
    Header: "Color",
    accessor: "color",
  },
  {
    Header: "Background Colour",
    accessor: "bg_color",
  },
  {
    Header: "Start Date",
    accessor: "start_date",
    disableSortBy: true,
  },
  {
    Header: "End Date",
    accessor: "end_date",
    disableSortBy: true,
  },
  {
    Header: "Link",
    accessor: "link",
  },
  {
    Header: "Status",
    disableFilters: true,
    disableSortBy: true,
    accessor: "status",
    Cell: _renderStatusAction
  },
  ...((remove || write) ? [{
    Header: "Operations",
    accessor: "operations",
  }] : []),
];

const _renderStatusAction = (cell) => {
  return (
    <Button disabled size="sm" className="shadow m-1 rounded-lg" variant={cell?.value === 'Active' ? "success" : "secondary"}>
      {cell?.value}
    </Button>
  );
}

const Table = ({ candelete, canwrite }) => {
  const dispatch = useDispatch();
  const deleteResp = useSelector(selectdeleteResp);

  //selectors
  const announcementResp = useSelector(selectAnnouncement);
  // const deleteFlag = "removeAnnouncement";

  //api calls ------------------------------------------
  useEffect(() => {
    dispatch(getAnnouncement());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  //----------------------------------------------------

  useEffect(() => {
    if (!_.isEmpty(deleteResp)) {
      if (deleteResp?.data?.status) {
        swal(deleteResp?.data?.message, "", "success").then(() => {
          dispatch(getAnnouncement());
          dispatch(deleteAlertCleanUp());
        });
      } else {
        swal("Something went wrong", "", "warning").then(() =>
          dispatch(deleteAlertCleanUp())
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deleteResp]);

  return (
    <DataTable
      columns={TableData(candelete, canwrite)}
      data={announcementResp?.data?.data ? announcementResp?.data?.data.map((elem) => ({
        ...elem,
        start_date: DateFormate(elem.start_date, { type: 'withTime' }),
        end_date: DateFormate(elem.end_date, { type: 'withTime' })
      })) : []}
      noStatus={true}
      pageState={{ pageIndex: 0, pageSize: 5 }}
      pageSizeOptions={[5, 10]}
      editLink={canwrite && '/announcement/edit'}
      deleteFlag={candelete && 'custom_delete'}
      removeAction={deleteAnnouncement}
      rowStyle
    />
  );
};

export default Table;
