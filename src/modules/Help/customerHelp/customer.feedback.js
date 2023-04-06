import React, { useState, useEffect } from 'react';
import { CardBlue, Button } from '../../../components'
import styled from 'styled-components';
import swal from "sweetalert";
import { SubmitCustomerFeedback, clear } from '../help.slice'
import TextArea from "react-textarea-autosize";
import { useDispatch, useSelector } from "react-redux";
import { ImageWrapper, ratingImages } from '../EmployeeHelp';


export const Feedback = ({ validation }) => {
    const dispatch = useDispatch();
    const { success, error } = useSelector((state) => state.help);
    const [feedback, setFeedback] = useState("");
    const [ratings, setRatings] = useState(null);
    const { globalTheme } = useSelector(state => state.theme)

    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                resetValues();
            });
        }
        if (error) {
            swal("Alert", error, "warning");
        }
        return () => { dispatch(clear()) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success, error])

    const resetValues = () => {
        setFeedback("");
        setRatings(null);
    };

    const submitFeedbackDetails = () => {
        const data = {
            ratings,
            feedback
        }
        if (!!ratings && !!feedback) {
            dispatch(SubmitCustomerFeedback(data))
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
                    <Input className="form-control" minLength={2} maxLength={validation.text.length}
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
                {ratingImages.map((v, i) => <ImageWrapper isRated={Boolean(ratings === Number(i + 1))} color={v.color} key={'feed' + i} className="col-lg-2 col-md-12">
                    <img src={v.image} alt="" width="50" className="d-lg-block ml-1 mr-lg-0 mr-2 my-lg-0 my-2 d-inline" onClick={() => setRatings(i + 1)} />
                    <div className="text-center small d-lg-block d-inline">{v.name}</div>
                </ImageWrapper>)
                }
            </div>
            <div className="d-flex justify-content-end mt-5">
                <Button onClick={() => { submitFeedbackDetails() }} type="submit">
                    Submit
                </Button>
            </div>
        </CardBlue>
    )
}

const Input = styled(TextArea)`
overflow: hidden;
min-height: 80px;
`
