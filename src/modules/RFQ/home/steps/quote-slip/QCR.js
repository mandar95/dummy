import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { useParams } from 'react-router';
import swal from "sweetalert";

import { QuoteSlip, AddFeature, Summary } from "modules/RFQ/home/steps/index";
import { clear } from 'modules/RFQ/home/home.slice';


const QCR = () => {
    const dispatch = useDispatch();

    const { error } = useSelector(state => state.RFQHome);
    const { currentUser } = useSelector(state => state.login);
    const [step, setStep] = useState(1);

    const { id, steppage } = useParams();

    const BrokerID = currentUser.broker_id

    useEffect(() => {
        if (id && steppage) {
            setStep(Number(steppage))
        }
    }, [id, steppage])

    useEffect(() => {
        if (error) {
            swal(error, "", "warning");
        }
        return () => {
            dispatch(clear());
        };
        //eslint-disable-next-line
    }, [error]);

    return (
        <>
            {step === 1 && <QuoteSlip onNextStep={() => setStep(2)} Broker_id={BrokerID} />}
            {step === 2 && <AddFeature onNextStep={() => setStep(3)} onPrevStep={() => setStep(1)} Broker_id={BrokerID} />}
            {step === 3 && <Summary onPrevStep={() => setStep(2)} Broker_id={BrokerID} />}
        </>
    )
}

export default QCR;