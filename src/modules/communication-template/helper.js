import React from 'react';
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap';
import styled from 'styled-components';
import { sortTypeWithTime } from '../../components';

const TolTipDiv = styled(Tooltip)`
& .tooltip-inner {
    text-align: left;
    background-color: #3c3c3c !important;
}
`
const ChildDiv = styled.div`
background: #f8f8f8;
    color: black;
    line-height: 19px;
    padding: 5px 5px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
    border-radius: 3px;
    margin-top: 4px;
`

export const EventsObj = {
    welcomeMailer: {
        header: [{ id: 8 }],
        content: [{ id: 8 }, {
            id: 1, style: {
                row: 1, css: {
                    letterSpacing: '1px',
                    fontSize: '30px',
                    color: '#5427dd',
                    fontFamily: "'Lato', Tahoma, Verdana, Segoe, sans-serif",
                    textAlign: 'left'
                }
            },
            placeholder: 'Dear xyz',
        }, {
            id: 7, style: {
                row: 3, css: {
                    color: '#808389',
                    fontSize: '15px',
                    textAlign: 'left'
                }
            },
            isAdd: true,
            placeholder: 'content'
        }],
        footer: [{ id: 8 }, {
            id: 7, style: {
                row: 2, css: {
                    backgroundColor: '#d6d6d6',
                    color: '#95979c',
                    fontSize: '12px',
                    textAlign: 'left',
                    width: '90%',
                    margin: 'auto'
                }
            },
            placeholder: 'address'
        },
        { id: 10 },
        {
            id: 7, style: {
                row: 1, css: {
                    backgroundColor: '#d6d6d6',
                    color: '#95979c',
                    fontSize: '12px',
                    textAlign: 'left',
                    width: '90%',
                    margin: 'auto'
                }
            },
            placeholder: 'copyright ©'
        },
        ]
    },
    brokerOnboard: {
        header: [{ id: 8 }],
        content: [{ id: 8 }, {
            id: 1, style: {
                row: 1, css: {
                    letterSpacing: '1px',
                    fontSize: '30px',
                    color: '#5427dd',
                    fontFamily: "'Lato', Tahoma, Verdana, Segoe, sans-serif",
                }
            },
            placeholder: 'Welecome xyz'
        }, {
            id: 7, style: {
                row: 3, css: {
                    color: '#808389',
                    fontSize: '15px'
                }
            },
            placeholder: 'content'
        }],
        footer: [{ id: 8 }, {
            id: 7, style: {
                row: 2, css: {
                    backgroundColor: '#d6d6d6',
                    color: '#95979c',
                    fontSize: '12px',
                    textAlign: 'left',
                    width: '90%',
                    margin: 'auto'
                }
            },
            placeholder: 'address'
        },
        { id: 10 },
        {
            id: 7, style: {
                row: 1, css: {
                    backgroundColor: '#d6d6d6',
                    color: '#95979c',
                    fontSize: '12px',
                    textAlign: 'left',
                    width: '90%',
                    margin: 'auto'
                }
            },
            placeholder: 'copyright ©'
        },
        ]
    },
    hrRole: {
        header: [{ id: 8 }],
        content: [{ id: 8 }, {
            id: 1, style: {
                row: 1, css: {
                    letterSpacing: '1px',
                    fontSize: '30px',
                    color: '#5427dd',
                    fontFamily: "'Lato', Tahoma, Verdana, Segoe, sans-serif",
                    textAlign: 'left'
                }
            },
            placeholder: 'Dear xyz',
        },
        { id: 19 }
            //  {
            //     id: 7, style: {
            //         row: 3, css: {
            //             color: '#808389',
            //             fontSize: '15px',
            //             textAlign: 'left'
            //         }
            //     },
            //     isAdd: true,
            //     placeholder: 'content'
            // }
        ],
        footer: [{ id: 8 }, {
            id: 7, style: {
                row: 2, css: {
                    backgroundColor: '#d6d6d6',
                    color: '#95979c',
                    fontSize: '12px',
                    textAlign: 'left',
                    width: '90%',
                    margin: 'auto'
                }
            },
            placeholder: 'address'
        },
        { id: 10 },
        {
            id: 7, style: {
                row: 1, css: {
                    backgroundColor: '#d6d6d6',
                    color: '#95979c',
                    fontSize: '12px',
                    textAlign: 'left',
                    width: '90%',
                    margin: 'auto'
                }
            },
            placeholder: 'copyright ©'
        },
        ]
    },
    forgetPassword: {
        header: [{ id: 8 }],
        content: [{ id: 8 },
        {
            id: 1, style: {
                row: 1, css: {
                    letterSpacing: '1px',
                    fontSize: '30px',
                    color: '#5427dd',
                    fontFamily: "'Lato', Tahoma, Verdana, Segoe, sans-serif",
                    textAlign: 'center'
                }
            },
            placeholder: 'Reset Your Password',
        },
        { id: 19, style: { css: { textAlign: 'center' } } }
        ],
        footer: [{ id: 8 }, {
            id: 7, style: {
                row: 2, css: {
                    backgroundColor: '#d6d6d6',
                    color: '#95979c',
                    fontSize: '12px',
                    textAlign: 'left',
                    width: '90%',
                    margin: 'auto'
                }
            },
            placeholder: 'address'
        },
        { id: 10 },
        {
            id: 7, style: {
                row: 1, css: {
                    backgroundColor: '#d6d6d6',
                    color: '#95979c',
                    fontSize: '12px',
                    textAlign: 'left',
                    width: '90%',
                    margin: 'auto'
                }
            },
            placeholder: 'copyright ©'
        },
        ]
    },
}

export const getTemplateCSS = (id) => {
    if (id) {
        return commonObj
    }
}

export const _Events = [
    { id: 1, name: 'Welcome Mailer' },
    { id: 2, name: 'Broker User' },
    { id: 3, name: 'HR User' },
    { id: 4, name: 'Enrolment Reminder' },
    { id: 5, name: 'Enrolment Confirmation' },
    { id: 6, name: 'Submit Claim' },
    { id: 7, name: 'Claim Status Change' },
    { id: 8, name: 'Intimate Claim' },
    { id: 9, name: 'Policy approval' },
    { id: 10, name: 'Network Hospital' },
    { id: 11, name: 'Forgot Password' },
    { id: 12, name: 'Health E-Card' }

]

export const _Frequency = [
    { id: 1, name: 'Daily' },
    { id: 2, name: 'Alternate Day' },
    { id: 3, name: 'One a week' },
    { id: 4, name: 'Fort Night' },
    { id: 5, name: 'Last day of enrolment' },
]

let commonObj = {
    content: [{ id: 8 }, { id: 19 }, { id: 18 }],
}

const style = { fontSize: '0.7rem' }

const CellViewTemplate = (cell, viewTemplate) => {
    return (<Button size="sm" className="shadow rounded-lg align-items-center" variant='light' onClick={() => { viewTemplate(cell.row.original.id) }}>
        View &nbsp;<i style={style} className={'ti-angle-up text-primary'} />
    </Button>)
}
const CellMappingType = (cell) => {
    return (<OverlayTrigger trigger="hover" placement="right"
        overlay={<TolTipDiv>
            <strong>{cell?.value === 1 ? `Policy Wise Mapping Details` : `Entity Wise Mapping Details`}</strong>.
            {cell?.value === 1 ?
                <ChildDiv>
                    <div>policy Type : <span style={{ fontWeight: 500 }}>{cell.row.original.poliyc_sub_type}</span></div>
                    <div>policy Name : <span style={{ fontWeight: 500 }}>{cell.row.original.policy_name}</span></div>
                    <div>policy Number : <span style={{ fontWeight: 500 }}>{cell.row.original.policy_number}</span></div>
                </ChildDiv>
                :
                <ChildDiv>Entity Name : <span style={{ fontWeight: 500 }}>{cell.row.original.employer_name}</span></ChildDiv>
            }

        </TolTipDiv>}

    >
        <Button size="sm" className="shadow m-1 rounded-lg" variant={cell?.value === 1 ? "primary" : "warning"}>
            {cell?.value === 1 ? `Policy Wise` : `Entity Wise`}
        </Button>
    </OverlayTrigger>)
}
export const structure = (isOperation, viewTemplate, access) => [

    {
        Header: "Template Name",
        accessor: "name",
    },
    {
        Header: "Created at",
        accessor: "created_at",
        sortType: sortTypeWithTime
    },
    {
        Header: "Updated at",
        accessor: "updated_at",
        sortType: sortTypeWithTime
    },
    {
        Header: "View Content",
        accessor: "template_value",
        Cell: (cell) => CellViewTemplate(cell, viewTemplate)
    },
    // {
    //     Header: "Operations",
    //     accessor: "operations",
    // },
    ...(isOperation ? [{
        Header: "Operations",
        accessor: "operations",
    }] : []),

];
export const Mappingstructure = (isOperation) => [

    {
        Header: "Template Name",
        accessor: "template_name",
    },
    // {
    //     Header: "Employer Name",
    //     accessor: "employer_name"
    // },
    // {
    //     Header: "Policy Sub Type",
    //     accessor: "poliyc_sub_type"
    // },
    // {
    //     Header: "Policy Number",
    //     accessor: "policy_number"
    // },
    // {
    //     Header: "Policy Name",
    //     accessor: "policy_name"
    // },
    {
        Header: "Template Mapping Type",
        accessor: "type",
        Cell: (cell) => CellMappingType(cell)
    },
    {
        Header: "Created at",
        accessor: "created_at",
    },
    {
        Header: "Updated at",
        accessor: "updated_at",
    },
    ...(isOperation ? [{
        Header: "Operations",
        accessor: "operations",
    }] : []),

];
export const _resetPasswordStyle = [{ name: 'fontWeight', value: '500' },
{ name: 'width', value: 'auto' },
{ name: 'padding', value: '10px' },
{ name: 'background', value: '#3fd49f' },
{ name: 'color', value: 'white' },
{ name: 'borderRadius', value: '28px' },
{ name: 'border', value: '1px dashed #078C6C' },
{ name: 'lineHeight', value: '51px' },
{ name: 'userSelect', value: 'none' },

]
