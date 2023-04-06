import React from 'react';
import { useParams } from 'react-router-dom';
import { EmployeeFlexBenefit } from './Employee/employee.flexbenefit';
import { EmployerFlexBenefit } from './flexbenefit';
import { BrokerFlexBenefit } from './Broker/broker.flexbenefit';
export const SwitchExchange = () => {
    const { userType } = useParams();
    switch (userType) {
        case "employee":
            return <EmployeeFlexBenefit />
        case "employer":
            return <EmployerFlexBenefit />
        case "broker":
            return <BrokerFlexBenefit />
        default:
            return <div>404 PAGE NOT FOUND</div>;
    }
}