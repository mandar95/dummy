import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Row, Col } from "react-bootstrap";
import {
  cdUpdate,
  selectCdBalanceDetails,
  cdBalanceDetails,
  selectCdUpdateDetails,
} from "./CDB.Slice.js";
import { getFirstError } from "../../utils";
import swal from "sweetalert";
import styled from 'styled-components';

import {
  ModalTopContainer,
  // ModalContentBox,
  // ModalImageBox,
  // ModalTextBox,
  Modalbuttonstyle,
  // InputFeild,
  SpanFloatRight,
  FloatHeader,
} from "./style";
import { useHistory } from "react-router-dom";

import Input from "../../components/inputs/input/input";
import Modal from "react-bootstrap/Modal";
import { Button } from "../../components/button/Button";

const ModalContent = (props) => {
  const { control, handleSubmit } = useForm();

  //Selectors
  const dispatch = useDispatch();
  const BalanceDetails = useSelector(selectCdBalanceDetails);
  const UpdateDetails = useSelector(selectCdUpdateDetails);
  const Balance_Details = BalanceDetails?.data?.data;
  const { modules } = useSelector((state) => state.login);
  const history = useHistory();
  //using state for alert trigger
  const [getCardData, setCardData] = useState(1);
  const [getStatus, setStatus] = useState("");
  const [getColor, setColor] = useState({});
  const [myModule, setMyModule] = useState(null);
  const { globalTheme } = useSelector(state => state.theme)

  const onSubmit = (data) => {
    const formdata = Object.assign(
      {
        policy_id: props.policynoId,
        threshold_value: Balance_Details?.thresholdAmt,
        current_balance: Balance_Details?.opening_balance,
        status: 1,
      },
      data
    );
    dispatch(cdUpdate(formdata));
    setCardData(0);
  };

  // check the Status logic later
  useEffect(() => {
    if (getCardData === 0) {
      if (UpdateDetails?.data?.status === true) {
        setStatus("successful");
        setColor({
          color: "green",
          display: "flex",
          flexWrap: "wrap",
          fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px',
        });
        swal("successful", "", "success").then(() => {
          props.onHide();
          dispatch(cdBalanceDetails({ policy_id: props.policynoId }));
        });
        setCardData(1);
      } else {
        setColor({
          color: "red",
          display: "flex",
          flexWrap: "wrap",
          fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px',
        });
        setCardData(1);
        let error =
          UpdateDetails?.data?.errors &&
          getFirstError(UpdateDetails?.data?.errors);
        error = error
          ? error
          : UpdateDetails?.data?.message
            ? UpdateDetails?.data?.message
            : "Something went wrong";
        setStatus(error);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [UpdateDetails]);

  // //secondary alert--
  // useEffect(() => {
  //   dispatch(updateMessage());
  //   return () => {
  //     dispatch(clearUpdateMessage());
  //   };
  // }, []);
  //
  // useEffect(() => {
  //   if (updateresp) {
  //     swal(updateresp, "", "warning");
  //   }
  // }, [updateresp]);
  // //--------------------

  // module access 
  useEffect(() => {
    if (modules) {
      const thisModule = modules?.find(
        (elem) => elem.url === history?.location?.pathname
      );
      setMyModule(thisModule);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules]);

  return (
    <ModalTopContainer>
      <Row style={{ margin: '4px', borderBottom: '1px dashed #d0ff37', marginBottom: '15px' }}>
        <Col sm={12} md={12} lg={6} xl={6}>
          <img src="/assets/images/balance.png" alt="balance" width="80%" />
        </Col>
        <Col sm={12} md={12} lg={6} xl={6}>
          <ul>
            <li style={styles.list}>
              <Label>
                Total Deposit
                <SpanFloatRight>
                  {Balance_Details?.opening_balance || "N/A"}
                </SpanFloatRight>
              </Label>
              <Label>
                Members Covered
                <SpanFloatRight>{props?.TotalMembers}</SpanFloatRight>
              </Label>
              <Label>
                Balance Amount
                <SpanFloatRight>
                  {Balance_Details?.balance_amt || "N/A"}
                </SpanFloatRight>
              </Label>
              {!!getStatus && <Label>
                Status
                <SpanFloatRight style={getColor}>
                  {getStatus || "N/A"}
                </SpanFloatRight>
              </Label>}
            </li>
          </ul>
        </Col>
      </Row>
      {!!myModule?.canwrite && (
        <>
          <FloatHeader>
            <h5>Float Details</h5>
          </FloatHeader>
          <div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <Row>
                {/* <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={
                      <Input
                        name="float_id"
                        label="Float Id"
                        placeholder="Float Id"
                      />
                    }
                    name="float_id"
                    control={control}
                  />
                </Col> */}
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={
                      <Input
                        name="deposite_date"
                        type="date"
                        label="Deposit Date"
                        placeholder="Deposit Date"
                      />
                    }
                    name="deposite_date"
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={
                      <Input
                        name="opening_balance"
                        label="Amount"
                        placeholder="Amount"
                      />
                    }
                    name="opening_balance"
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={
                      <Input
                        name="transaction_no"
                        label="Chq/DD/Trans no"
                        placeholder="Chq/DD/Trans no"
                      />
                    }
                    name="transaction_no"
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={
                      <Input
                        name="bank_name"
                        label="Bank Name"
                        placeholder="Bank Name"
                      />
                    }
                    name="bank_name"
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={
                      <Input
                        name="branch_name"
                        label="Bank Branch"
                        placeholder="Bank Branch"
                      />
                    }
                    name="branch_name"
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={
                      <Input
                        label="Payment Mode"
                        name="payment_mode"
                        placeholder="Payment Mode"
                      />
                    }
                    name="payment_mode"
                    control={control}
                  />
                </Col>
              </Row>
              <Modal.Footer>
                <Modalbuttonstyle>
                  <Button type='button' buttonStyle="danger" onClick={props.onHide}>
                    Close
                  </Button>
                  <Button type="submit">Save</Button>
                </Modalbuttonstyle>
              </Modal.Footer>
            </form>
          </div>
        </>
      )}
    </ModalTopContainer>
  );
};

const styles = {
  ul: {
    margin: "0",
    listStyleType: "none",
  },
  fLoatLeft: {
    float: "left",
  },
  list: {
    display: "flex",
    flexDirection: "column",
  },
};

const Label = styled.label`
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(14px + ${fontSize - 92}%)` : '14px'};
  
  margin: 8px 0px 8px 0px;
`;

ModalContent.defaultProps = {
  TotalMembers: "N/A",
  Balance_Details: {
    members_covered: 0,
  },
};

export default ModalContent;
