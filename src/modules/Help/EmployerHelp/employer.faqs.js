import React from 'react';
import { DataTable } from '../../user-management';
import { Card } from '../../../components'

export const FAQs = (props) => {
    return (
        <>
            <Card title={<div>Frequently Asked Questions</div>}>
                <DataTable
                    columns={EmployerFAQsModel}
                    data={props.data}
                    noStatus={true}
                    pageState={{ pageIndex: 0, pageSize: 5 }}
                    pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                    rowStyle
                />
            </Card>
        </>
    )
}

const EmployerFAQsModel = [
    //     {
    //     Header: "Company Name",
    //     accessor: "employer_name",
    // },
    {
        Header: "Policy Type",
        accessor: "policy_sub_type",
    },
    {
        Header: "Question",
        accessor: "question"
    },
    {
        Header: "Answer",
        accessor: "answer"
    }
]

