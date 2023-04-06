import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm, Controller } from "react-hook-form";
import { Row, Col } from "react-bootstrap";
import { serializeError } from "../../utils";
import swal from "sweetalert";
import styled from 'styled-components';

import {
  ModalTopContainer,
  Modalbuttonstyle,
  SpanFloatRight,
  FloatHeader,
} from "./style";
import { useHistory } from "react-router-dom";

import { Input } from "components";
import Modal from "react-bootstrap/Modal";
import { Button } from "../../components/button/Button";
import { /* loadSummary, */ updateCdBalance } from "./service";
import { set_pagination_update } from "../user-management/user.slice";

const UpdateCdBalance = async (dispatch, payload, onHide, userType, reduxDispatch) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: true } });
    const { data, message, errors } = await updateCdBalance(payload);
    if (data.status) {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
      swal('Success', message, 'success');

      reduxDispatch(set_pagination_update(true))

      // const { data: summary } = await loadSummary(userType);

      // dispatch({
      //   type: 'GENERIC_UPDATE', payload: {
      //     summary: summary?.data ? Object.values(summary?.data).filter(value => value) : [],
      //     loading3: false,
      //   }
      // })
      onHide();
    }
    else {
      dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
      swal("Alert", serializeError(message || errors), 'info')
    }
  } catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: false } });
  }
}

const ModalContent = ({ policyDetails, balanceDetails, dispatch, policy_id, onHide }) => {
  const { control, handleSubmit } = useForm();

  // const UpdateDetails = {};
  const { modules, userType: userTypeName } = useSelector((state) => state.login);
  const history = useHistory();
  const reduxDispatch = useDispatch()

  // const [getCardData, setCardData] = useState(1);
  // const [getStatus, setStatus] = useState("");
  // const [getColor, setColor] = useState({});
  const [myModule, setMyModule] = useState(null);

  const onSubmit = (data) => {

    let result = Object.assign(
      {
        policy_id: policy_id,
        threshold_value: balanceDetails?.thresholdAmt,
        current_balance: balanceDetails?.opening_balance,
        status: 1,
      },
      data
    );
    UpdateCdBalance(dispatch, result, onHide, userTypeName, reduxDispatch)
    // dispatch(cdUpdate(result));
    // setCardData(0);
  };

  // check the Status logic later
  // useEffect(() => {
  //   if (getCardData === 0) {
  //     if (UpdateDetails?.data?.status === true) {
  //       setStatus("successful");
  //       setColor({
  //         color: "green",
  //         display: "flex",
  //         flexWrap: "wrap",
  //       });
  //       swal("successful", "", "success").then(() => {
  //         onHide();
  //         // dispatch(cdBalanceDetails({ policy_id: policy_id }));
  //       });
  //       setCardData(1);
  //     } else {
  //       setColor({
  //         color: "red",
  //         display: "flex",
  //         flexWrap: "wrap",
  //       });
  //       setCardData(1);
  //       let error =
  //         UpdateDetails?.data?.errors &&
  //         getFirstError(UpdateDetails?.data?.errors);
  //       error = error
  //         ? error
  //         : UpdateDetails?.data?.message
  //           ? UpdateDetails?.data?.message
  //           : "Something went wrong";
  //       setStatus(error);
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [UpdateDetails]);

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
                  {balanceDetails?.opening_balance || "-"}
                </SpanFloatRight>
              </Label>
              <Label>
                Members Covered
                <SpanFloatRight>{policyDetails?.total_members ?? 0}</SpanFloatRight>
              </Label>
              <Label>
                Balance Amount
                <SpanFloatRight>
                  {balanceDetails?.balance_amt || "-"}
                </SpanFloatRight>
              </Label>
              {/* {!!getStatus && <Label>
                Status
                <SpanFloatRight style={getColor}>
                  {getStatus || "-"}
                </SpanFloatRight>
              </Label>} */}
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
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={<Input
                      name="deposite_date"
                      type="date"
                      label="Deposit Date"
                      placeholder="Deposit Date" />}
                    name="deposite_date"
                    isRequired
                    required
                    control={control} />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={<Input
                      name="opening_balance"
                      label="Amount"
                      placeholder="Amount" />}
                    name="opening_balance"
                    isRequired
                    required
                    control={control} />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={<Input
                      name="transaction_no"
                      label="Chq/DD/Trans no"
                      placeholder="Chq/DD/Trans no" />}
                    name="transaction_no"
                    isRequired
                    required
                    control={control} />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={<Input
                      name="bank_name"
                      label="Bank Name"
                      placeholder="Bank Name" />}
                    name="bank_name"
                    isRequired
                    required
                    control={control} />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={<Input
                      name="branch_name"
                      label="Bank Branch"
                      placeholder="Bank Branch" />}
                    name="branch_name"
                    isRequired
                    required
                    control={control} />
                </Col>
                <Col xs={12} sm={12} md={6} lg={4} xl={4}>
                  <Controller
                    as={<Input
                      label="Payment Mode"
                      name="payment_mode"
                      placeholder="Payment Mode" />}
                    name="payment_mode"
                    isRequired
                    required
                    control={control} />
                </Col>
              </Row>
              <Modal.Footer>
                <Modalbuttonstyle>
                  <Button type='button' buttonStyle="danger" onClick={onHide}>
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
  balanceDetails: {
    members_covered: 0,
  },
};

export default ModalContent;
