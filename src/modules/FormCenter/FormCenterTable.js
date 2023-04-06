import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Card,
  Select,
  _renderDocument,
} from "../../components";
import { DataTable } from "../user-management";
import { BrokerModal } from "./broker.modal";
import {
  getDocument,
  deleteDetails,
  formcenter,
  adminGetEmployer
} from "./form.center.slice";
const FormCenterTable = ({ myModule, admin, broker, broker_employers, ...rest }) => {
  const [show, setShow] = useState(false);

  const {
    broker_details,
    broker_post_policyNumbers,
    broker_policyType,
    broker_documents,
  } = useSelector(formcenter);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDocument());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const onEdit = (id, data) => {
    setShow(data);
  };

  const getAdminData = (e) => {
    if (e.target.value) {
      dispatch(getDocument(e.target.value));
      dispatch(adminGetEmployer(e.target.value));
    }
    return e;
  };

  return (
    <>
      {show && (
        <BrokerModal
          documents={broker_documents}
          policyTypes={broker_policyType}
          policyNumbers={broker_post_policyNumbers}
          show={show}
          setshow={setShow}
        />
      )}

      <Card title="Form Data">
        {admin && (
          <div className="row d-flex flex-wrap">
            <div className="col-md-6 col-sm-12">
              <Select
                label={"Brokers"}
                placeholder="Select Broker"
                options={broker.map((item) => ({
                  id: item?.id,
                  name: item?.name,
                  value: item?.id,
                }))}
                id="drop"
                valueName="name"
                onChange={getAdminData}
              />
            </div>
          </div>
        )}
        {!!broker_details.length && (
          <DataTable
            columns={brokerFormCenterModel(
              !myModule?.canwrite && !myModule?.candelete ? false : true
            )}
            data={broker_details}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10, 20, 25, 50, 100]}
            rowStyle
            deleteFlag={!!myModule?.candelete && "custom_delete"}
            removeAction={deleteDetails}
            EditFlag={!!myModule?.canwrite ? true : false}
            EditFunc={myModule?.canwrite && onEdit}
            autoResetPage={false}
          />
        )}
      </Card>
    </>
  );
};

export default FormCenterTable;
const brokerFormCenterModel = (write) => [
  {
    Header: "Company Name",
    accessor: "company_name",
  },
  {
    Header: "Document Type",
    accessor: "master_document_type_name",
  },
  {
    Header: "Policy Number",
    accessor: "policy_number",
  },
  {
    Header: "Document Name",
    accessor: "document_name",
  },
  {
    Header: "Document",
    accessor: "document",
    disableFilters: true,
    disableSortBy: true,
    Cell: _renderDocument,
  },
  ...(write
    ? [
      {
        Header: "Operations",
        accessor: "operations",
      },
    ]
    : []),
];
