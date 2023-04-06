/* eslint-disable eqeqeq */
import React from "react";
import { Modal, Table } from 'react-bootstrap';
// import { CoverType, PremiumType } from 'modules/policies/steps/additional-details/additional-cover';
import "modules/RFQ/home/OTPModal/modal.css";

const cardStyle = { zoom: '0.8' }
const PlanBenefits = ({ show, onHide, features }) => {
    return (
        <Modal
            show={show}
            onHide={onHide}
            size="xl"
            aria-labelledby="contained-modal-title-vcenter"
            centered
            dialogClassName="my-featuremodal"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    {`Plan Features`}
                </Modal.Title>
            </Modal.Header>
            <Modal.Body className="text-center mx-auto col-md-9 col-sm-12">
                <Table style={{ cardStyle }} striped={false} responsive>
                    <tr>
                        {features.some(({ name }) => name) && <th className='align-top'>Name</th>}
                        {features.some(({ description }) => description) && <th className='align-top'>Description</th>}
                    </tr>

                    {features?.map(({ name, description }, index) =>
                        <tr key={index + 'sum-pre'}>
                            {features.some(({ name }) => name) && <td>{name}</td>}
                            {features.some(({ description }) => description) && <td>{description || '-'}</td>}
                        </tr>
                    )}
                </Table>
            </Modal.Body>
        </Modal>
    );
};

export default PlanBenefits;

