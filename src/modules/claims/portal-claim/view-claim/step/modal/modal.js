import _ from "lodash";
import React from "react";
import { Modal, Form, Table } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useSelector } from "react-redux";
import { DateFormate } from "utils";

import { claim } from "../../../../claims.slice";
const ReimbursementModal = ({ show, onHide }) => {
  const { claimDataBox: props } = useSelector(claim);
  const { register } = useForm({});

  return (
    <Modal show={show} onHide={onHide} size="xl">
      <Modal.Header closeButton>
        <Modal.Title>{<h5>Reimbursement Expenses</h5>}</Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center mr-1 ml-1 mr-sm-5 ml-sm-5">
        <Table
          className="text-center rounded text-nowrap"
          style={{ border: "solid 1px #e6e6e6" }}
          responsive>
          <thead className="text-center">
            <tr>
              <th scope="col">Bill No</th>
              <th scope="col">Reimbursement Type</th>
              <th scope="col">Bill Date</th>
              <th scope="col">Claim Amount</th>
              <th scope="col">Comment</th>
            </tr>
          </thead>
          <tbody>
            {!_.isEmpty(props?.tableBill?.bill_amt) &&
              props?.tableBill?.bill_amt?.map((_, index) => {
                return (
                  <tr className="w-100" key={"zxcasdgfhdfgs" + index}>
                    <td className="text-center">
                      <Form.Control
                        style={{
                          background: "white",
                        }}
                        disabled={true}
                        className="rounded-lg"
                        size="sm"
                        type="text"
                        maxLength={1000}
                        minLength={2}
                        name={`document[${index}].name`}
                        ref={register}
                        placeholder={`Bill No`}
                        defaultValue={props?.tableBill?.bill_no[index]}
                      />
                    </td>
                    <td className="text-center">
                      <Form.Control
                        style={{
                          background: "white",
                        }}
                        disabled={true}
                        className="rounded-lg"
                        size="sm"
                        type="text"
                        maxLength={1000}
                        minLength={2}
                        name={`document[${index}].name`}
                        ref={register}
                        placeholder={`Reimbursement Type`}
                        defaultValue={props?.tableBill?.reimburment_type[index]}
                      />

                      {/* <Form.Control as="select" name={`features[${index}].premium_type`} ref={register}>
                        {props?.claim_hospitalization_type.map(({ label }) => <option key={label + 'cover_type'} value={label}>{label}</option>)}
                      </Form.Control> */}
                    </td>
                    <td className="text-center">
                      <Form.Control
                        style={{
                          background: "white",
                        }}
                        disabled={true}
                        className="rounded-lg"
                        size="sm"
                        type="text"
                        maxLength={1000}
                        minLength={2}
                        name={`document[${index}].name`}
                        ref={register}
                        placeholder={`Bill Date`}
                        defaultValue={DateFormate(
                          props?.tableBill?.bill_date[index]
                        )}
                      />
                    </td>
                    <td className="text-center">
                      <Form.Control
                        style={{
                          background: "white",
                        }}
                        disabled={true}
                        className="rounded-lg"
                        size="sm"
                        type="text"
                        maxLength={1000}
                        minLength={2}
                        name={`document[${index}].name`}
                        ref={register}
                        placeholder={`Claim Amount`}
                        defaultValue={props?.tableBill?.bill_amt[index]}
                      />
                    </td>
                    <td className="text-center">
                      <Form.Control
                        style={{
                          background: "white",
                        }}
                        disabled={true}
                        className="rounded-lg"
                        size="sm"
                        type="text"
                        maxLength={1000}
                        minLength={2}
                        name={`document[${index}].name`}
                        ref={register}
                        placeholder={`Comment`}
                        defaultValue={props?.tableBill?.comment[index]}
                      />
                    </td>

                  </tr>
                );
              })}

          </tbody>
        </Table>
      </Modal.Body>
      <Modal.Footer></Modal.Footer>
    </Modal>
  );
};

export default ReimbursementModal;
