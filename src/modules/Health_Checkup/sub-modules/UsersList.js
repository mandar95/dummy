import React from "react";
import { IconlessCard, NoDataFound } from "components";
import _ from "lodash";
import { DataTable } from "modules/user-management";
import { structure } from "../helper";
import HealthCheckUpModal from "../HealthCheckUpModal";
import UploadExcelModal from "../UploadExcelModal";
import AppointmentModal from "../AppointmentModal";
import UploadHealthReportModal from "../UploadHealthReportModal";
import CheckupTypeModal from "../CheckupTypeModal";
import AppointmentStatusModal from "../AppointmentStatusModal";
import ReportDownloadModal from "../ReportDownloadModal";
import UpdatePlan from "../updateHelathCheckup";
const UsersList = ({ classes, userTypeName, urlData, isMobile, setUploadExcelModal, healthCheckupData, dispatch,
    createHealthCheckup, setOpenAppointmentModal, setOpenHealthReportModal, setOpenCheckupTypeModal, setAppointmentStatusModal,
    setOpenReportDownloadModal, deleteHealthCheckup, onEdit, modal, setModal, uploadExcelModal, ErrorSheetHandler, getRecallAfterExcelUpload,
    setErrorSheetData, openAppointmentModal, openHealthReportModal, setLoader, openCheckupTypeModal, openAppointmentStatusModal,
    openReportDownloadModal, UpdatePlanModal, setUpdatePlanModal, myModule }) => {
    return (
        <IconlessCard
            title={
                <div className="d-flex justify-content-between align-items-baseline">
                    <div>
                        <h5 className={classes.redColor}>Health Check Up Details</h5>
                    </div>
                    {userTypeName === "Broker" && !!myModule?.canwrite && (
                        <div>
                            <a
                                className={`btn btn-warning btn-sm text-dark`}
                                href={urlData}
                                download
                            >
                                Download {isMobile ? "" : "Excel"}
                            </a>
                            <button
                                onClick={() => setUploadExcelModal(true)}
                                className={`btn btn-primary btn-sm text-light ml-2`}
                            >
                                Upload {isMobile ? "" : "Excel"}
                            </button>
                        </div>
                    )}
                </div>
            }
        >
            {!_.isEmpty(healthCheckupData) ? (
                <DataTable
                    className="border rounded"
                    columns={structure(
                        myModule,
                        dispatch,
                        { createHealthCheckup },
                        userTypeName,
                        setOpenAppointmentModal,
                        setOpenHealthReportModal,
                        setOpenCheckupTypeModal,
                        setAppointmentStatusModal,
                        setOpenReportDownloadModal
                    )}
                    data={healthCheckupData}
                    noStatus={"true"}
                    pageState={{ pageIndex: 0, pageSize: 5 }}
                    pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                    rowStyle={"true"}
                    autoResetPage={false}
                    deleteFlag={!!myModule?.candelete && "custom_delete"}
                    removeAction={deleteHealthCheckup}
                    EditFlag={!!myModule?.canwrite}
                    EditFunc={onEdit}
                />
            ) : (
                <NoDataFound text="No Data Found" />
            )}
            {modal && (
                <HealthCheckUpModal
                    healthCheckupData={healthCheckupData}
                    show={modal}
                    onHide={() => setModal(false)}
                />
            )}
            {uploadExcelModal && (
                <UploadExcelModal
                    show={uploadExcelModal}
                    onHide={() => setUploadExcelModal(false)}
                    ErrorSheetHandler={ErrorSheetHandler}
                    getRecallAfterExcelUpload={getRecallAfterExcelUpload}
                    setErrorSheetData={setErrorSheetData}
                />
            )}
            {openAppointmentModal.flag && (
                <AppointmentModal
                    show={openAppointmentModal.flag}
                    id={openAppointmentModal.id}
                    onHide={() => setOpenAppointmentModal({ flag: false, id: null })}
                    healthCheckupData={healthCheckupData}
                    userTypeName={userTypeName}
                />
            )}
            {openHealthReportModal.flag && (
                <UploadHealthReportModal
                    show={openHealthReportModal.flag}
                    id={openHealthReportModal.id}
                    onHide={() => setOpenHealthReportModal({ flag: false, id: null })}
                    healthCheckupData={healthCheckupData}
                    userTypeName={userTypeName}
                    loader={setLoader}
                />
            )}
            {openCheckupTypeModal.flag && (
                <CheckupTypeModal
                    show={openCheckupTypeModal.flag}
                    id={openCheckupTypeModal.id}
                    onHide={() => setOpenCheckupTypeModal({ flag: false, id: null })}
                    healthCheckupData={healthCheckupData}
                    userTypeName={userTypeName}
                />
            )}
            {openAppointmentStatusModal.flag && (
                <AppointmentStatusModal
                    show={openAppointmentStatusModal.flag}
                    id={openAppointmentStatusModal.id}
                    onHide={() => setAppointmentStatusModal({ flag: false, id: null })}
                    healthCheckupData={healthCheckupData}
                    userTypeName={userTypeName}
                />
            )}
            {openReportDownloadModal.flag && (
                <ReportDownloadModal
                    show={openReportDownloadModal.flag}
                    id={openReportDownloadModal.id}
                    onHide={() => setOpenReportDownloadModal({ flag: false, id: null })}
                    healthCheckupData={healthCheckupData}
                    userTypeName={userTypeName}
                />
            )}
            {!!UpdatePlanModal && (
                <UpdatePlan
                    show={!!UpdatePlanModal}
                    id={UpdatePlanModal.id}
                    onHide={() => setUpdatePlanModal(false)}
                    healthcheckupdata={healthCheckupData}
                    usertypename={userTypeName}
                />
            )}
        </IconlessCard>
    );
}

export default UsersList;
