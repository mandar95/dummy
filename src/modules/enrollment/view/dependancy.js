import React from "react";
import { DataTable } from "modules/user-management";
import _ from 'lodash';
import { DateFormate } from "../../../utils";

const TableData = (member_option, policy_sub_type_id) => [
    {
        Header: "First Name",
        accessor: "first_name",
    },
    ...member_option?.some((elem) => !!elem.last_name) ? [{
        Header: "Last Name",
        accessor: "last_name",
    }] : [],
    {
        Header: "Gender",
        accessor: "gender",
    },
    {
        Header: "Age",
        accessor: "age",
    },
    {
        Header: "Date of birth",
        accessor: "dob",
    },
    ...member_option?.some((elem) => !!elem.marriage_date) ? [{
        Header: "Marriage Date",
        accessor: "marriage_date",
    }] : [],
    {
        Header: "Relation Name",
        accessor: "relation_name",
    },
    ...member_option?.some((elem) => !!elem.email) ? [{
        Header: "Email",
        accessor: "email",
    }] : [],
    ...member_option?.some((elem) => !!elem.mobile_no) ? [{
        Header: "Mobile No.",
        accessor: "mobile_no",

    }] : [],
    ...member_option?.some((elem) => !!elem.suminsured) ? [{
        Header: (member_option?.some((elem) => !!elem.opd_suminsured) ? "IPD Sum" : "Sum") + (policy_sub_type_id === 3 ? ' Assured' : ' Insured'),
        accessor: "suminsured",
    }] : [],
    ...member_option?.some((elem) => !!elem.opd_suminsured) ? [{
        Header: "OPD Sum " + (policy_sub_type_id === 3 ? ' Assured' : ' Insured'),
        accessor: "opd_suminsured",
    }] : [],
];

const Dependancy = ({ member_option, policy_sub_type_id }) => {

    return (
        <DataTable
            columns={TableData(member_option, policy_sub_type_id)}
            data={!_.isEmpty(member_option) ? member_option.map(val => ({
                ...val,
                suminsured: Number(val.suminsured) ? val.suminsured : '-',
                opd_suminsured: Number(val.opd_suminsured) ? val.opd_suminsured : '-',
                age: val.age + ' ' + val.age_type,
                dob: DateFormate(val.dob),
                marriage_date: DateFormate(val.marriage_date)
            })) : []}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            rowStyle={true}
        />
    );
};

export default Dependancy;
