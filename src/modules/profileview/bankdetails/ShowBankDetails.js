import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import swal from "sweetalert";
import { Row, Col, Button as Btn } from "react-bootstrap";
import { getBankDetails, selectBankDetails } from "./bankDetails.slice";
import { CardBlue } from "../../../components/index.js";

const ShowBankDetails = (props) => {
  const dispatch = useDispatch();
  const response = useSelector(selectBankDetails);
  //states
  const [getData, setData] = useState(null);

  useEffect(() => {
    dispatch(getBankDetails());
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (response?.data?.data) {
      setData(response?.data?.data);
    }
  }, [response]);
  return (
    <CardBlue title="Bank Details" round={true}>
      <div style={{ marginTop: "-40px" }}>
        <Row className="mt-4 flex-wrap ">
          <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
            <Head>Account Holder Name</Head>
            <Text>{getData?.account_holder_name || "-"}</Text>
          </Col>
          <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
            <Head>Account Number</Head>
            <Text>{getData?.account_no || "-"}</Text>
          </Col>
          <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
            <Head>IFSC Code</Head>
            <Text>{getData?.ifsc_code || "-"}</Text>
          </Col>

          <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
            <Head> Bank Name</Head>
            <Text>{getData?.bank_name || "-"}</Text>
          </Col>
          <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
            <Head>Branch Name</Head>
            <Text>{getData?.bank_branch || "-"}</Text>
          </Col>
          <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
            <Head>City</Head>
            <Text>{getData?.bank_city || "-"}</Text>
          </Col>
          <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
            <Head>Passbook</Head>
            <Btn
              size="sm"
              variant={getData?.image ? "primary" : "secondary"}
              onClick={() => {
                getData?.image
                  ? window.open(getData?.image)
                  : swal("Passbook not available", "", "warning");
              }}
            >
              View Passbook
            </Btn>
          </Col>
          <Col xs={12} md={6} lg={3} className="mt-2" sm={12}>
            <Head>Bank Statement</Head>
            <Btn
              size="sm"
              variant={getData?.document ? "primary" : "secondary"}
              onClick={() => {
                getData?.document
                  ? window.open(getData?.document)
                  : swal("Bank statement not svailable", "", "warning");
              }}
            >
              View Statement
            </Btn>
          </Col>
        </Row>
      </div>
    </CardBlue>
  );
};

let Head = styled.p`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
  line-height: 26px;
  color: #444 !important;
  margin-bottom: 0;
  text-align: left;
  letter-spacing: 1px;
`;

let Text = styled.p`
  color: #606060;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  color: rgb(96, 96, 96);
  
  line-height: 18px;
  margin-bottom: 12px;
  letter-spacing: 1px;
  overflow-wrap: break-word;
`;

export default ShowBankDetails;

// employee_account_holder_name: null
// employee_account_no: null
// employee_bank_branch_name: null
// employee_bank_ifsc_code: null
// employee_bank_name: null
