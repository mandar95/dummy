import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';

import { CreateTemplate } from 'modules/communication-template/template';
import { ViewTemplate } from './viewTemplate';
import { TemplateMapping } from './templateMapping';
import _ from 'lodash';

import {
    clear, reset_template
} from 'modules/communication-config/communication-config.slice';
import { useDispatch, useSelector } from 'react-redux';

import { TabWrapper, Tab } from 'components';
import { TriggerEmailUpload } from './TriggerEmailUpload';


export const CommunicationTemplate = ({ myModule }) => {
    const [tab, setTab] = useState("Detail");
    const [Modal, setModal] = useState(null);

    const dispatch = useDispatch();

    const { success, error, loading } = useSelector(state => state.commConfig);

    useEffect(() => {
        if (!_.isEmpty(Modal)) {
            setTab('Template')
        }
    }, [Modal])

    useEffect(() => {
        if (tab === "Detail") {
            setModal(null)
        }
    }, [tab])

    useEffect(() => {
        if (!loading && error) {
            swal("Alert", error, "warning");
        };
        if (!loading && success) {
            swal('Success', success, "success");
            dispatch(reset_template())
        };

        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error, loading]);


    return (
        <>
            <TabWrapper width={'max-content'}>
                <Tab isActive={Boolean(tab === "Detail")} onClick={() => setTab("Detail")}>E-mail Template Details</Tab>
                <Tab isActive={Boolean(tab === "Mapping")} onClick={() => setTab("Mapping")}>E-mail Template Mapping</Tab>
                {!!myModule?.canwrite && <Tab isActive={Boolean(tab === "Template")} onClick={() => setTab("Template")}>{_.isEmpty(Modal) ? 'Create Template' : 'Update Template'}</Tab>}
                {!!myModule?.canwrite && <Tab isActive={Boolean(tab === "Trigger")} onClick={() => setTab("Trigger")}>Trigger E-mail Upload</Tab>}
            </TabWrapper>
            {(tab === "Detail") && <ViewTemplate myModule={myModule} setModal={(data) => setModal(data)} />}
            {(tab === "Mapping") && <TemplateMapping myModule={myModule} emailData={Modal} />}
            {(tab === "Template") && <CreateTemplate emailData={Modal} setTab={() => setTab("Detail")} />}
            {(tab === "Trigger") && <TriggerEmailUpload />}
        </>
    )
}
