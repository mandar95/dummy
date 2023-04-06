import React from "react";

import { Button } from "react-bootstrap";
import { DataTable } from "modules/user-management";
import { link } from "./CustomiseSheet";
import { SwitchInput, CustomControl, SwitchContainer } from "./components";

import { randomString } from "utils";
import {
  deleteTemplate,
  updateSheetTemplate,
} from "../EndorsementRequest.slice";
import { Encrypt } from "../../../utils";
import { NoDataFound, sortTypeWithTime } from "../../../components";

const TableData = (dispatchCall, myModule) => [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Keys",
    accessor: "feilds",
    Cell: (data) => {
      return data.value.map(({ label }, index) => (
        <Button
          key={index + "key-fields"}
          disabled
          size="sm"
          className="shadow m-1 rounded-lg"
          variant="light"
          style={{ opacity: "1" }}
        >
          {label}
        </Button>
      ));
    },
    disableSortBy: true,
    filter: (rows, id, filterValue) => {
      return rows.filter((row) => {
        const keywords = row.values[id];
        return keywords.some(({ label }) =>
          String(label)
            .toLowerCase()
            .includes(String(filterValue).trimStart().toLowerCase())
        );
      });
    },
  },
  {
    Header: "Created At",
    accessor: "created_at",
  },
  {
    Header: "Template Status",
    accessor: "status",
    disableFilters: true,
    disableSortBy: true,
    Cell: (data) => {
      // const [isChecked, setIsChecked] = useState(data.value);

      const handleChange = (e) => {
        dispatchCall({
          template_id: data.row.original.id,
          status: !data.value,
        });
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
                checked={data.value}
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
    },
  },
  ...(myModule?.canwrite || myModule?.candelete
    ? [
        {
          Header: "Operations",
          accessor: "operations",
        },
      ]
    : []),
];
const TableData2 = (dispatchCall, myModule) => [
  {
    Header: "Name",
    accessor: "name",
  },
  {
    Header: "Keys",
    accessor: "feilds",
    Cell: (data) => {
      return data.value.map(({ label }, index) => (
        <Button
          key={index + "key-fields"}
          disabled
          size="sm"
          className="shadow m-1 rounded-lg"
          variant="light"
          style={{ opacity: "1" }}
        >
          {label}
        </Button>
      ));
    },
    disableSortBy: true,
    filter: (rows, id, filterValue) => {
      return rows.filter((row) => {
        const keywords = row.values[id];
        return keywords.some(({ label }) =>
          String(label)
            .toLowerCase()
            .includes(String(filterValue).trimStart().toLowerCase())
        );
      });
    },
  },
  {
    Header: "Created At",
    accessor: "created_at",
    sortType: sortTypeWithTime
  },
  {
    Header: "TPA Name",
    accessor: "tpa_name",
  },
  {
    Header: "Template Status",
    accessor: "status",
    disableFilters: true,
    disableSortBy: true,
    Cell: (data) => {
      // const [isChecked, setIsChecked] = useState(data.value);

      const handleChange = (e) => {
        dispatchCall({
          template_id: data.row.original.id,
          status: !data.value,
        });
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
                checked={data.value}
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
    },
  },
  ...(myModule?.canwrite || myModule?.candelete
    ? [
        {
          Header: "Operations",
          accessor: "operations",
        },
      ]
    : []),
];

const Table = ({ data = [], history, tab, dispatch, userType, myModule }) => {
  // const deleteFlag = "insurance";

  // const [editModal, setEditModal] = useState();

  const onEdit = (id) => {
    history.push(
      `/${userType}/endorsement-sheet-update/${
        link[tab]
      }/${randomString()}/${Encrypt(id)}/${randomString()}`
    );
  };

  const dispatchCall = (payload) => {
    dispatch(updateSheetTemplate(payload));
  };
  return data.length ? (
    <DataTable
      columns={
        link[tab] !== "tpa-claim-export"
          ? TableData(dispatchCall, myModule)
          : TableData2(dispatchCall, myModule)
      }
      // data={data || []}
      data={data}
      noStatus={true}
      pageState={{ pageIndex: 0, pageSize: 5 }}
      pageSizeOptions={[5, 10]}
      rowStyle={true}
      deleteFlag={!!myModule?.candelete && "custom_delete"}
      removeAction={deleteTemplate}
      EditFlag={!!myModule?.canwrite}
      EditFunc={onEdit}
    />
  ) : (
    <NoDataFound />
  );
};

export default Table;
