import React, { useState, useEffect, useReducer } from 'react';
import { initialState, reducer, getALLEmailTemplate, deleteTemplate, clear/* , getTemplateView */ } from './template.action';
import { NoDataFound, CardBlue, Loader } from 'components';
import { DataTable } from "modules/user-management";
import { structure } from './helper';
import ViewModal from './viewModal';
import _ from 'lodash';
import swal from "sweetalert";
import { useSelector } from "react-redux";

export const ViewTemplate = ({ setModal, myModule }) => {
    const [{ allEmailTemplate, loading, success }, dispatch] = useReducer(reducer, initialState);
    const [viewModal, setViewModal] = useState(false);
    const { /* userType: userTypeName, */ currentUser } = useSelector(state => state.login);

    useEffect(() => {
        if (!_.isEmpty(currentUser)) {
            getALLEmailTemplate(dispatch, { broker_id: currentUser?.broker_id })
        }
    }, [currentUser])

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                getALLEmailTemplate(dispatch, { broker_id: currentUser?.broker_id })
                // clear(dispatch)
            })
        }
        return () => {
            clear(dispatch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success])

    const deleteAction = (id) => {
        deleteTemplate(dispatch, id)
    }
    const onEdit = (id, data) => {
        setModal(data)
    };

    const viewTemplate = (rowData) => {
        setViewModal(rowData)
    }

    return (
        <>
            <CardBlue title='Template Detail'>
                {(!_.isEmpty(allEmailTemplate)) ? (
                    <DataTable
                        className="border rounded"
                        columns={structure(!!(myModule?.candelete || myModule?.canwrite), viewTemplate)}
                        data={allEmailTemplate}
                        noStatus={"true"}
                        pageState={{ pageIndex: 0, pageSize: 5 }}
                        pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                        rowStyle={"true"}
                        autoResetPage={false}
                        deleteFlag={!!myModule?.candelete && 'custom_delete_action'}
                        removeAction={deleteAction}
                        EditFlag={!!myModule?.canwrite}
                        EditFunc={onEdit}

                    />
                )
                    :
                    (
                        <>
                            {<NoDataFound text='No Data Found' />}
                        </>
                    )
                }
                {!!viewModal && <ViewModal
                    show={!!viewModal}
                    onHide={() => setViewModal(false)}
                    HtmlArray={viewModal}
                />}
            </CardBlue>
            {loading && <Loader />}
        </>
    )
}
