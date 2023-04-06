import React, { useState, useEffect } from 'react';
import swal from "sweetalert";
import { clear } from '../help.slice'
import { useDispatch, useSelector } from 'react-redux';
import { FAQs } from './customer.faq';
import { Feedback } from './customer.feedback';
import { Queries } from './customer.queries';
import { TabWrapper, Tab } from '../../../components'

export const HelpCustomer = ({ myModule, validation }) => {
    const [tab, setTab] = useState("FAQs");
    const dispatch = useDispatch();
    const { error } = useSelector((state) => state.help);


    useEffect(() => {
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [error])

    return <>
        <TabWrapper width='max-content'>
            <Tab isActive={Boolean(tab === "FAQs")} onClick={() => setTab("FAQs")} className="d-block">FAQs</Tab>
            <Tab isActive={Boolean(tab === "Queries & Complaints")} onClick={() => setTab("Queries & Complaints")} className="d-block">Queries & Complaints</Tab>
            <Tab isActive={Boolean(tab === "Feedback")} onClick={() => setTab("Feedback")} className="d-block">Feedback</Tab>
        </TabWrapper>

        {tab === "FAQs" && <FAQs />}
        {tab === "Queries & Complaints" && <Queries data={[]} myModule={myModule} />}
        {tab === "Feedback" && <Feedback validation={validation} data={[]} />}
    </>
}
