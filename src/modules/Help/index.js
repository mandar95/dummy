import React from 'react';
import { useParams } from 'react-router-dom';
import { HelpBroker } from './broker-help/Help'
import { HelpEmployee } from './EmployeeHelp'
import { HelpEmployer } from './EmployerHelp';
import { HelpCustomer } from './customerHelp';
import { HelpInsurer } from './insurerHelp';
import { FeedBack } from './broker-help/FeedBack/FeedBack';
import { common_module } from 'config/validations'

const validation = common_module.help


export default function HelperExchange({ myModule }) {

    let { userType } = useParams();
    switch (userType) {
        case "admin":
            return <FeedBack userType={userType} />
        case "broker":
            return <HelpBroker userType={userType} myModule={myModule} validation={validation} />
        case "employer":
            return <HelpEmployer myModule={myModule} validation={validation} />
        case "employee":
            return <HelpEmployee validation={validation} />
        case "customer":
            return <HelpCustomer validation={validation} />
        case "insurer":
            return <HelpInsurer myModule={myModule} validation={validation} />
        default:
            return <div>404 Page Not Found</div>
    }
}
