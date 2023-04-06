import React, { useState } from "react";
import {  TabWrapper, Tab } from "../../../components"
import BrokerFlex from './broker.flexbenefit0';
import BrokerCreateFlex from './broker.createflexbenefit';

const BorkerFlex = () => {
    const [tab, setTab] = useState("create");
    return (
        <>
            <TabWrapper width='max-content'>
                <Tab isActive={Boolean(tab === "create")} onClick={() => setTab("create")} className="d-block">Create Flex Benefit</Tab>
                <Tab isActive={Boolean(tab === "allocate")} onClick={() => setTab("allocate")} className="d-block">Allocate Flex Benefit</Tab>
            </TabWrapper>
            {tab === "create" &&
                <BrokerCreateFlex />
            }
            {tab === "allocate" &&
                <BrokerFlex />
            }
        </>
    )
}
export default BorkerFlex;
