import React, { useEffect } from 'react';
import styled from "styled-components";
import { CardBlue, Loader } from "components";
import { CustomAccordion } from "../../../components/accordion";
import AccordionHeader from "../../../components/accordion/accordion-header";
import AccordionContent from "../../../components/accordion/accordion-content";

import { useDispatch, useSelector } from "react-redux";
import { getCustomerFAQ } from "../help.slice";
import { giveProperId } from '../../RFQ/home/home';

export const FAQs = () => {
    const dispatch = useDispatch();
    const { customerFAQData, loading } = useSelector((state) => state.help);

    useEffect(() => {
        dispatch(getCustomerFAQ(giveProperId({})))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <>
            <CardBlue title="FAQs">
                <div className="mb-5">
                    {(customerFAQData.length > 0) ? customerFAQData.map((v, i) => <CustomAccordion key={i + 'customerFAQData'} id={v.id}>
                        <AccordionHeader>
                            {v.question}
                        </AccordionHeader>
                        <AccordionContent>
                            {v.answer}
                        </AccordionContent>
                    </CustomAccordion>)
                        : !loading && <NoFAQFound>Sorry! No FAQs found :</NoFAQFound>
                    }
                </div>
            </CardBlue>
            {loading && <Loader />}
        </>
    )
}

const NoFAQFound = styled.div`
    display: flex;
    justify-content: center;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(20px + ${fontSize - 92}%)` : '20px'};
    
    background: #ffdfdf;
    padding: 10px;
    border-radius: 27px;
    color: #626262;
`
