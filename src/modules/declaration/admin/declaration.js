import React, { useEffect, useState } from "react";
import swal from "sweetalert";
import Table from "../table"
import { CardBlue, Loader } from "components";

import { Button as Btn } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { clear, getAllIcList } from "modules/documents/documents.slice";

import { useParams } from 'react-router-dom';

import ADDDeclrationConfig from "./add-declaration";

const DeclrationConfig = ({ IC_id }) => {
    const [modalShow, setModalShow] = useState(false);
    const dispatch = useDispatch();
    const { success, error, loading, AllICListData } = useSelector((state) => state.documents);
    const { globalTheme } = useSelector(state => state.theme)
    const { id } = useParams();

    useEffect(() => {
        dispatch(getAllIcList())
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])


    useEffect(() => {
        if (success) {
            swal(success, "", "success")
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])


    //card title------------------
    const title = (
        <div style={{ display: "flex", width: "100%", marginTop: "4px" }}>
            <span style={{ width: "100%" }}>Declaration Configurator</span>
            <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <Btn size="sm" varient="primary" onClick={() => setModalShow(true)}>
                    <span style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "600" }}>+Add</span>
                </Btn>
            </div>
        </div>
    );
    //-----------------------

    if (id) return (
        <>
            <ADDDeclrationConfig onHide={() => setModalShow(false)} />
            {loading && <Loader />}
        </>
    )


    return (
        <>
            {modalShow ? (
                <>
                    <ADDDeclrationConfig onHide={() => setModalShow(false)} />
                </>
            ) : (
                <CardBlue
                    title={title}>
                    <Table data={AllICListData}
                    //  onEdit={getEditData} 
                    />
                </CardBlue>
            )}
            {loading && <Loader />}
        </>
    );
}

export default DeclrationConfig;
