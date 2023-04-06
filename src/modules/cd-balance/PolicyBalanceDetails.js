import React, { useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import ModalContent from "./ModalContent";
import { loadCdBalanceData, loadPolicyDetailsData } from "./service";

const LoadCdDetail = async (dispatch, payload) => {
  try {
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: true } });
    const [{ data: balanceDetails }, { data: policyDetails }] =
      await Promise.all([
        loadCdBalanceData(payload),
        loadPolicyDetailsData(payload)]);

    dispatch({
      type: 'INITIAL_FETCH', payload: {
        balanceDetails: balanceDetails.data || {},
        policyDetails: policyDetails.data || {},
        loading2: false
      }
    })
  } catch (error) {
    console.error(error)
    dispatch({ type: 'GENERIC_UPDATE', payload: { loading2: true } });
  }
}


export const PolicyBalanceDetailsModal = ({ show, onHide, payload, dispatch, balanceDetails, policyDetails }) => {

  useEffect(() => {
    payload.policy_id &&
      LoadCdDetail(dispatch, payload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal">
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <span >Add CD Balance</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ overflow: "auto" }}>
        <ModalContent
          policyDetails={policyDetails}
          balanceDetails={balanceDetails}
          dispatch={dispatch}
          policy_id={payload.policy_id}
          onHide={onHide} />
      </Modal.Body>
    </Modal>
  );
};
