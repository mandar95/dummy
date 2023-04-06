import React, { useEffect } from 'react';
import Modal from "react-bootstrap/Modal";
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Button } from 'react-bootstrap';
import swal from 'sweetalert';
import { employeeWiseStatus, set_pagination_update } from '../user.slice';
import { DataTable } from "modules/user-management";
import { CardBlue } from 'components';
import { updateMembersEnrollmentConfirmaton, approvePolicy, clear } from 'modules/policies/approve-policy/approve-policy.slice';



const ModalComponent = ({ show, onHide, Data }) => {

    const dispatch = useDispatch();
    const { globalTheme } = useSelector(state => state.theme)

    const { success } = useSelector(approvePolicy);

    useEffect(() => {
        if (success) {
            dispatch(set_pagination_update(true))
            onHide()
        }
        return () => {
            dispatch(clear())
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success])

    const _EnrolmentStatusAllPolicy = () => {
        if (Data.Value === 1) {
            swal({
                title: "Open Enrolment?",
                text: 'Open Enrolment for All Policy of this Employee',
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
                .then((willVerify) => {
                    if (willVerify) {
                        dispatch(employeeWiseStatus({ user_id: Data.Row.id, enrollment_confirmation_status: 0 }))
                        onHide()
                    }
                });
        }
        if (Data.Value === 0) {
            swal({
                title: "Close/Confirmed Enrolment?",
                text: 'Close/Confirmed Enrolment for All Policy of this Employee',
                icon: "info",
                buttons: true,
                dangerMode: true,
            })
                .then((willVerify) => {
                    if (willVerify) {
                        dispatch(employeeWiseStatus({ user_id: Data.Row.id, enrollment_confirmation_status: 1 }))
                        onHide()
                    }
                });
        }
        if (Data.Value === 2) {
            swal({
                title: "Open/Close Enrolment?",
                text: 'Open/Close Enrolment for All Policy of this Employee',
                icon: "info",
                buttons: {
                    cancel: "Cancel",
                    'Open': 'Open Enrolment',
                    'Close': 'Close Enrolment',
                },
                dangerMode: true,
            })
                .then((willVerify) => {
                    switch (willVerify) {
                        case "Open":
                            dispatch(employeeWiseStatus({ user_id: Data.Row.id, enrollment_confirmation_status: 0 }))
                            onHide()
                            break;
                        case "Close":
                            dispatch(employeeWiseStatus({ user_id: Data.Row.id, enrollment_confirmation_status: 1 }))
                            onHide()
                            break;
                        default:
                    }
                });
        }
    }

    const _EnrolmentStatusPolicyWise = (data) => {

        const onClick = () => {
            swal(
                {
                    title: "Change Confirmation?",
                    text: "Change the status of confirmation",
                    icon: "warning",
                    buttons: true,
                    dangerMode: true,
                }).then((changeStatus) => {
                    if (changeStatus) {
                        dispatch(updateMembersEnrollmentConfirmaton({
                            employee_policy_mapping_id: data.row.original.employee_policy_mapping_id,
                            confirmation: data.row.original.enrollement_status === 2 ? 0 : 1
                        }))

                    }
                })
        }

        return data.row.original.enrollement_status === 2 ?
            <Button type="button" variant="success" size="sm" className='shadow m-1' onClick={onClick}>
                Confirmed
            </Button> :
            <Button type="button" variant="secondary" size="sm" className='shadow m-1' onClick={onClick}>
                Pending
            </Button>
    }

    const structure = () => [
        {
            Header: "Policy Name",
            accessor: "policy_name",
        },
        {
            Header: "Enrolment Status",
            accessor: "enrollment_confirmation_status",
            disableFilters: true,
            Cell: _EnrolmentStatusPolicyWise
        }
    ];

    return (
        <Modal
            show={show}
            onHide={onHide}
            animation={true}
            size="lg"
            aria-labelledby="contained-modal-title-vcenter"
            dialogClassName="my-modal"
        >
            <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span>Change Enrolment Status</span>
                </Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Row>
                    <Col xl={12} lg={12} md={12} sm={12} style={{
                        display: 'flex',
                        justifyContent: 'center',
                        borderBottom: '1px solid #b1a9a9',
                        paddingBottom: '10px'
                    }}>
                        <span style={{
                            fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px',
                            fontWeight: '500',
                            marginRight: '17px',
                            letterSpacing: '1px'
                        }}>Change enrolment status for all policy : </span>
                        <Button
                            onClick={_EnrolmentStatusAllPolicy}
                            size="sm" className="strong">
                            Change Enrolment Status
                        </Button>
                    </Col>
                    <Col xl={12} lg={12} md={12} sm={12} style={{}}>
                        <CardBlue title='Change enrolment status policy wise'>
                            <DataTable
                                className="border rounded"
                                columns={structure()}
                                data={Data?.Row?.employee_policy_status}
                                noStatus={"true"}
                                pageState={{ pageIndex: 0, pageSize: 5 }}
                                pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                                rowStyle={"true"}
                                autoResetPage={false}

                            />
                        </CardBlue>

                    </Col>
                </Row>
            </Modal.Body>
        </Modal>
    );
};

export default ModalComponent;
