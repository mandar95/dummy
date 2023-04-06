import React, { useState, useEffect, useReducer } from 'react';
import { CardBlue, NoDataFound, Loader } from 'components';
import { DataTable } from "modules/user-management";
import _ from 'lodash';
import { Mappingstructure } from './helper';
import { initialState, reducer, getTemplateMapping, deleteTemplateMapping, clear } from './template.action';
import ViewModal from './mappingModal';
import swal from "sweetalert";
import { useDispatch, useSelector } from "react-redux";
import { Button } from 'react-bootstrap';
import { getEmployereData, loadBroker, setPageData } from "modules/EndorsementRequest/EndorsementRequest.slice";
import { useParams } from 'react-router';

export const TemplateMapping = ({ myModule }) => {

    const [{ templateMappingData, allEmailTemplate,
        success, loading }, dispatch] = useReducer(reducer, initialState);
    const [show, setShow] = useState({
        isShow: false,
        isEditData: false
    });
    const [editData, setEditData] = useState(null)
    const { currentUser, userType: userTypeName } = useSelector(state => state.login);
    const _dispatch = useDispatch();
    const { userType } = useParams();

    const { lastPage, firstPage } = useSelector((state) => state.endorsementRequest);


    useEffect(() => {
        _dispatch(setPageData({
            firstPage: 1,
            lastPage: 1,
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    useEffect(() => {
        if (userType === 'admin' && userTypeName) {
            _dispatch(loadBroker(userTypeName))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [userTypeName])

    useEffect(() => {
        if (currentUser?.broker_id) {
            if (lastPage >= firstPage) {
                var _TimeOut = setTimeout(_callback, 250);
            }
            function _callback() {
                _dispatch(getEmployereData({ broker_id: currentUser?.broker_id }, firstPage, undefined, false));
            }
            return () => {
                clearTimeout(_TimeOut)
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser, firstPage]);

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                getTemplateMapping(dispatch, { broker_id: currentUser?.broker_id })
            })
        }
        return () => {
            clear(dispatch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success])

    useEffect(() => {
        if (!_.isEmpty(currentUser)) {
            getTemplateMapping(dispatch, { broker_id: currentUser?.broker_id })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentUser])
    //api call for broker data -----

    const deleteAction = (id) => {
        deleteTemplateMapping(dispatch, id)
    }
    const onEdit = (id, data) => {
        setEditData(data);
        setShow({
            isShow: true,
            isBulkUpload: false,
            isEditData: true
        });
    };

    return (
        <>
            <CardBlue title={
                <div className="d-flex justify-content-between">
                    <span>Template Mapping</span>
                    {!!myModule?.canwrite && <div>
                        <Button
                            size="sm"
                            onClick={() => {
                                setShow({
                                    isShow: true,
                                    isEditData: false
                                });
                                setEditData(null)
                            }}
                            className="shadow-sm m-1 rounded-lg"
                        >
                            <strong>Create Template Mapping</strong>
                        </Button>
                    </div>}
                </div>
            }>
                <>
                    {(!_.isEmpty(templateMappingData)) ? (
                        <DataTable
                            className="border rounded"
                            columns={Mappingstructure(!!(myModule?.candelete || myModule?.canwrite))}
                            data={templateMappingData}
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
                        : (<NoDataFound text='No Data Found' />)
                    }

                    {show.isShow &&
                        <ViewModal
                            show={show}
                            onHide={() => setShow({
                                isShow: false
                            })}
                            _editData={editData}
                            _clear={() => setEditData(null)}
                            dispatch={dispatch}
                            allEmailTemplate={allEmailTemplate}
                        />
                    }
                </>
            </CardBlue>
            {loading && <Loader />}
        </>
    )
}
