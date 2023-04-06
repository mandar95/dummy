import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import { clear } from '../Help/help.slice'
import { useDispatch, useSelector } from 'react-redux';
import { QueryType } from '../Help/insurerHelp/insurer.queryType'
import { QuerySubType } from '../Help/insurerHelp/insurer.querySubType';
import { useParams } from 'react-router-dom';
import { TabWrapper, Tab } from '../../components'

export default function Queryconfig({myModule}) {
    // const [tab, setTab] = useState("FAQs");
    const [tab, setTab] = useState("Queries Type");
    const dispatch = useDispatch();
    const { userType } = useParams()
    const { error } = useSelector((state) => state.help);
    const { currentUser } = useSelector((state) => state.login);

    /* ** If "error" state will change then this component will re-rendered. */
    useEffect(() => {
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    return <>
        {/* ===Select Tab from here=== */}
        <TabWrapper width='max-content'>
            {/* <Tab isActive={Boolean(tab === "FAQs")} onClick={() => setTab("FAQs")} className="d-block">FAQs</Tab> */}
            <Tab isActive={Boolean(tab === "Queries Type")} onClick={() => setTab("Queries Type")} className="d-block">Query Type</Tab>
            <Tab isActive={Boolean(tab === "Queries Sub Type")} onClick={() => setTab("Queries Sub Type")} className="d-block">Query Sub Type</Tab>
        </TabWrapper>

        {/* ===Here Rendered of Selected Tab Component=== */}
        {tab === "Queries Type" && <QueryType myModule={myModule} currentUser={currentUser} userType={userType} />}
        {tab === "Queries Sub Type" && <QuerySubType myModule={myModule} currentUser={currentUser} userType={userType} />}
    </>
}

