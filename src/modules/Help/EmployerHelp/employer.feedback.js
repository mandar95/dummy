import React, { useState } from 'react';
import { DataTable } from '../../user-management';
import { Card, CardBlue, Button, _renderRatings } from '../../../components'
import styled from 'styled-components';
import swal from "sweetalert";
import { submitFeedback } from '../help.service'
import TextArea from "react-textarea-autosize";
import { ImageWrapper, ratingImages } from '../EmployeeHelp';
import { useSelector } from 'react-redux';


export const Feedback = ({ Data, validation }) => {
    const [feedback, setFeedback] = useState("");
    const [ratings, setRatings] = useState(null);
    const { globalTheme } = useSelector(state => state.theme)

    const submitFeedbackDetails = () => {
        const data = {
            ratings,
            feedback
        }
        if (!!ratings && !!feedback) {
            submitFeedback(data).then(res => {
                if (res.success) {
                    swal(res.data.message, "", "success");
                }
                // else {
                //     res.errors.feedback.forEach(v => { toast.error(`${ v } `) });
                //     res.errors.ratings.forEach(v => { toast.error(`${ v } `) });
                // }
            }).catch(err => {
                swal(err.message, "", "warning");
            })
        }
        else if (!data.ratings && !data.feedback) {
            swal('Feedback & rating required', "", "info");
        }
        else if (!data.ratings) {
            swal('Rating required', "", "info");
        }
        else if (!data.feedback) {
            swal('Feedback required', "", "info");
        }
        else {
            swal('Required', "", "info");
        }
    }

    return (
        <>
            <CardBlue
                title={<div style={{ fontWeight: "500", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em' }}>Feedback</div>}
                round={true}
                styles={{
                    maxWidth: "600px",
                    // minWidth: '320px',
                    margin: "3em"
                }}
                marginTop={"1em"}
                clickHandler={() => { }}>
                <div className="row pt-4 pb-4">
                    <div className="col-12">
                        <div style={
                            {
                                position: 'absolute',
                                right: '15px',
                                top: '-20px',
                                background: '#e2e2e2',
                                padding: '0px 5px',
                                borderRadius: '3px'
                            }
                        }>
                            {`${feedback.length} / ${validation.text.length}`}
                        </div>
                        <Input className="form-control"
                            minLength={2}
                            maxLength={validation.text.length}
                            value={feedback} onChange={(e) => setFeedback(e.target.value)} />

                        <label className="form-label">
                            <span className="span-label">Feedback
                                <sup><img alt="important" src='/assets/images/inputs/important.png' /></sup>
                            </span>
                        </label>
                    </div>
                </div>
                <p className="h5">Ratings</p>
                <div className="row my-3">
                    {ratingImages.map((v, i) => <ImageWrapper isRated={Boolean(ratings === Number(i + 1))} color={v.color} key={i + 'rating2'} className="col-lg-2 col-md-12">
                        <img src={v.image} alt="" width="50" className="d-lg-block ml-1 mr-lg-0 mr-2 my-lg-0 my-2 d-inline" onClick={() => setRatings(i + 1)} />
                        <div className="text-center small d-lg-block d-inline">{v.name}</div>
                    </ImageWrapper>)
                    }
                </div>
                <div className="d-flex justify-content-end mt-5">
                    <Button buttonStyle={"danger"}>Cancel</Button>
                    <Button buttonStyle={"success"} onClick={() => { submitFeedbackDetails() }}>Submit</Button>
                </div>
            </CardBlue>
            <Card title={<div>Feedback</div>}>
                <DataTable
                    columns={EmployerFeedbackModel}
                    data={Data}
                    noStatus={true}
                    pageState={{ pageIndex: 0, pageSize: 5 }}
                    pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                    rowStyle
                />
            </Card>
        </>
    )
}

const EmployerFeedbackModel = [{
    Header: "Employee Name",
    accessor: "name",
},
{
    Header: "Feedback",
    accessor: "feedback",
},
{
    Header: "Ratings",
    accessor: "ratings",
    Cell: _renderRatings,
    disableFilters: true,
    disableSortBy: true,
}
]

const Input = styled(TextArea)`
overflow: hidden;
min-height: 80px;
`
