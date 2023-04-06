import React, { useState } from "react";

import { DataTable } from "../user-management";
import { columnHeader, deleteMaster } from './master.helper';
import { EditMaster } from './EditModal';


const Table = ({ Data, masterId,
  queries, announcement, tpa, policytype,
  dispatch }) => {

  const [masterEdit, setEditMaster] = useState(null);

  const onEdit = (id, data) => {
    setEditMaster(data);
  };

  const onDelete = (id) => {
    deleteMaster(dispatch, masterId, id);
  };


  return (
    <>
      <DataTable
        columns={columnHeader(masterId)}
        data={Data || []}
        noStatus={true}
        pageState={{ pageIndex: 0, pageSize: 10 }}
        pageSizeOptions={[5, 10, 20, 50]}
        // editMaster

        EditFlag
        EditFunc={onEdit}
        deleteFlag={'custom_delete_action'}
        removeAction={onDelete}
        deleteLimit={Master.find(({ id }) => id === masterId)?.limit || 0}
        // masterId={masterId}
        // queries={queries}
        // announcement={announcement}
        // tpa={tpa}
        // policytype={policytype}
        rowStyle
      />

      {!!masterEdit &&
        <EditMaster
          masterId={masterId}
          queries={queries}
          announcement={announcement}
          tpa={tpa}
          policytype={policytype}
          data={masterEdit}
          show={!!masterEdit}
          onHide={() => setEditMaster(false)}
        />
      }
    </>
  );
};

const Master = [
  { id: 1, name: "Position", limit: 2 },
  { id: 2, name: "Size", limit: 3 },
  { id: 3, name: "Alignment", limit: 3 },
  { id: 4, name: "Designation", limit: 0 },
  { id: 6, name: "Insurer Type", limit: 0 },
  { id: 7, name: "Announcement Type", limit: 2 },
  { id: 11, name: "Master Countires", limit: 1 },
  { id: 13, name: "Family Construct", limit: 0 },
  { id: 16, name: "Grades", limit: 0 },
  { id: 17, name: "Insurer", limit: 0 },
  { id: 21, name: "Policy Types", limit: 2 },
  { id: 22, name: "Queries", limit: 0 },
  { id: 24, name: "TPA services", limit: 0 },
  { id: 28, name: "Policy Contents", limit: 6 },
  { id: 29, name: "Policy sub type", limit: 6 },
  { id: 30, name: "Query Sub Type", limit: 0 },
  { id: 31, name: "Relation Master", limit: 9 },
  { id: 34, name: "Sum insured Types", limit: 2 },
  { id: 35, name: "Sum insured Sub Types", limit: 6 },
  { id: 36, name: "TPA", limit: 0 },
  { id: 37, name: "Premium", limit: 9 },
  { id: 38, name: "Announcement Sub Type", limit: 3 },
  { id: 39, name: "Dashboard Icons", limit: 3 },
  { id: 40, name: "Sample Format", limit: 3 },
  { id: 41, name: "Notification Action", limit: 3 }]


export default Table;
