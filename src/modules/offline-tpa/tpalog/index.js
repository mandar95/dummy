import React, { useState } from "react";
import { Card } from "components";
import ModalComponent from "./ViewModal";
import DataTablePagination from "../../user-management/DataTablePagination/DataTablePagination";

const TpaWellnessUI = ({ FetchAPI, cardTitle, module, nofoundData }) => {
  const [viewModal, setViewModal] = useState(false);

  const viewTemplate = (rowData) => {
    setViewModal(rowData);
  };
  let _commonObject = {
    viewTemplate,
    viewModal,
    setViewModal,
  };
  return (
    <Card title={cardTitle}>
      <DataTablePagination
        columns={module(_commonObject.viewTemplate)}
        // data={state.details}
        noStatus={"true"}
        pageState={{ pageIndex: 0, pageSize: 5 }}
        pageSizeOptions={[5, 10, 20, 25, 50, 100]}
        rowStyle={"true"}
        autoResetPage={false}
        API={FetchAPI}
        disableFilter
      />
      {!!_commonObject.viewModal && (
        <ModalComponent
          show={!!_commonObject.viewModal}
          onHide={() => _commonObject.setViewModal(false)}
          HtmlArray={_commonObject.viewModal}
        />
      )}
    </Card>
  );
};

export default TpaWellnessUI;
