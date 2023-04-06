import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import { clear } from '../help.slice'
import { useDispatch, useSelector } from 'react-redux';
// import { FAQs } from './insurer.faqs';
import { InsurerFeedback } from './insurer.feedback';
// import { QueryType } from './insurer.queryType';
// import { QuerySubType } from './insurer.querySubType';
import { Queries } from './insurer.queries';
import { useParams } from 'react-router-dom';
import { TabWrapper, Tab } from '../../../components'
// import Feedback from 'react-bootstrap/esm/Feedback';

import FAQ from './faq/faq';
export const HelpInsurer = ({ myModule }) => {
    // const [tab, setTab] = useState("FAQs");
    const [tab, setTab] = useState("faq");
    const dispatch = useDispatch();
    const { userType } = useParams()
    const { error } = useSelector((state) => state.help);
    const { currentUser } = useSelector((state) => state.login);


    useEffect(() => {
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    return <>
        <TabWrapper width='max-content'>
            {/* <Tab isActive={Boolean(tab === "Queries Type")} onClick={() => setTab("Queries Type")} className="d-block">Query Type</Tab>
            <Tab isActive={Boolean(tab === "Queries Sub Type")} onClick={() => setTab("Queries Sub Type")} className="d-block">Query Sub Type</Tab> */}
            <Tab isActive={Boolean(tab === "faq")} onClick={() => setTab("faq")} className="d-block">FAQ's</Tab>
            <Tab isActive={Boolean(tab === "Queries & Complaints")} onClick={() => setTab("Queries & Complaints")} className="d-block">Queries & Complaints</Tab>
            <Tab isActive={Boolean(tab === "Feedback")} onClick={() => setTab("Feedback")} className="d-block">Feedback</Tab>
        </TabWrapper>

        {/* {tab === "Queries Type" && <QueryType />}
        {tab === "Queries Sub Type" && <QuerySubType />} */}
        {tab === "Queries & Complaints" && <Queries myModule={myModule} currentUser={currentUser} userType={userType} />}
        {tab === "Feedback" && <InsurerFeedback myModule={myModule} currentUser={currentUser} userType={userType} />}
        {tab === "faq" && <FAQ myModule={myModule} currentUser={currentUser} userType={userType} />}
    </>
}
