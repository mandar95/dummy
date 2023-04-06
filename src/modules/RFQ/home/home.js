import React, { useEffect, useState, useRef } from "react";
import swal from "sweetalert";

import { NavBar, Footer, Loader } from 'components';

import { Container, FormContainer } from './style';
import Popup from "modules/RFQ/home/steps/customize-plan/Popup/Popup.js";


import {
    CompanyDetails,
    PolicyRenewal,
    PreviousPolicyDetail,
    // FamilyType,
    FamilyCount,
    AboutTeam,
    TopupCover,
    // CustomizeBenefit,
    CustomizePlan,
    Declaration,
    Checkout,
    FamilyConstruct,
    NoPlanFound,
    UploadPreviousPolicyDetail,
    UploadDemography,

    // QuoteSlip,
    // AddFeature,
    // Summary
} from "./steps";
import { useHistory, useLocation } from "react-router";
import { useDispatch, useSelector } from 'react-redux';
import {
    getIndustry, clear, loadCompanyData,
    getConfigData, isVerifiedSource, utm_approved as set_utm_approved
} from './home.slice';
import { UTMContent } from "./steps/customize-plan/Popup/SendQuotes";


const RFQHome = () => {
    const location = useLocation();
    const history = useHistory();
    const dispatch = useDispatch();
    const [showUtm, setShowUtm] = useState(false);
    const query = new URLSearchParams(location.search);
    const enquiryId = decodeURIComponent(query.get("enquiry_id") || '');
    const brokerId = query.get("broker_id");
    const insurerId = query.get("insurer_id");
    const utm_source = query.get("utm_source");
    const childRef = useRef();

    const { error, ageGroupData, configDataload,
        configuredDataload, customerDataLoad, logo,
        utm_approved } = useSelector(state => state.RFQHome);

    // load rfq config data
    useEffect(() => {
        dispatch(getIndustry())
        dispatch(getConfigData(giveProperId({ brokerId, insurerId })))

        return () => { dispatch(set_utm_approved(null)) }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    //load userdata
    useEffect(() => {
        // if (enquiryId && !enquiry_id) {
        if (enquiryId) {
            if (ageGroupData.length > 0) {
                dispatch(loadCompanyData({
                    enquiry_id: enquiryId
                }));
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [enquiryId, ageGroupData])

    useEffect(() => {
        if (utm_source)
            dispatch(isVerifiedSource({ campaign_code: utm_source }))

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [utm_source])

    useEffect(() => {
        if (utm_approved === false) {
            history.replace('/')
        }
        if (utm_approved === true) {
            location.pathname === '/company-details' && setShowUtm(true)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [utm_approved])

    useEffect(() => {
        if (error) {
            if(location.pathname === '/upload-data-demography') {
                childRef.current.unSetFile();
            }
            swal(error, "", "warning");
        }
        return () => {
            dispatch(clear());
        };
        //eslint-disable-next-line
    }, [error]);

    if (utm_source) {
        if (utm_approved === null) return <Loader />
    }

    // const { id } = useParams();
    return (
        <>
            <NavBar noLink logo={logo} />
            <Container>
                <FormContainer>
                    {location.pathname === '/company-details' && <CompanyDetails utm_source={utm_source} />}
                    {location.pathname === '/policy-renewal' && <PolicyRenewal utm_source={utm_source} />}
                    {location.pathname === '/upload-policy-claim-detail' && <UploadPreviousPolicyDetail utm_source={utm_source} />}
                    {location.pathname === '/previous-policy-detail' && <PreviousPolicyDetail utm_source={utm_source} />}
                    {location.pathname === '/about-team' && <AboutTeam utm_source={utm_source} />}
                    {/* {location.pathname === '/family-construct' && <FamilyType />} */}
                    {location.pathname === '/family-construct' && <FamilyConstruct utm_source={utm_source} />}
                    {location.pathname === "/family-count" && <FamilyCount utm_source={utm_source} />}
                    {location.pathname === '/topup' && <TopupCover utm_source={utm_source} />}
                    {/* {location.pathname === '/customize-benefit' && <CustomizeBenefit />} */}

                    {/* {location.pathname === '/quote-slip' && <QuoteSlip />}
                    {location.pathname === '/add-feature' && <AddFeature />}
                    {location.pathname === '/summary' && <Summary />} */}
                    {location.pathname === '/customize-plan' && <CustomizePlan utm_source={utm_source} />}
                    {location.pathname === '/declaration' && <Declaration utm_source={utm_source} />}
                    {location.pathname === '/checkout' && <Checkout utm_source={utm_source} />}
                    {location.pathname === '/rfq-callback-done' && <NoPlanFound utm_source={utm_source} />}
                    {location.pathname === '/upload-data-demography' && <UploadDemography childRef={childRef} utm_source={utm_source} />}
                </FormContainer>
            </Container>
            <Footer noLogin />
            {(configDataload || configuredDataload || customerDataLoad) && <Loader />}

            <Popup
                height={"auto"}
                width="640px"
                show={showUtm}
                onClose={() => setShowUtm(false)}
                position="middle">
                <UTMContent utm_source={utm_source} />
            </Popup>
        </>
    )
}
export default RFQHome;

export const giveProperId = ({ brokerId, insurerId }) => {
    if (brokerId) {
        return ({ broker_id: brokerId })
    }
    else if (insurerId) {
        return ({ ic_id: insurerId })
    }
    else if (process.env.REACT_APP_BROKER_ID) {
        return ({ broker_id: process.env.REACT_APP_BROKER_ID })
    }
    else {
        return ({ ic_id: process.env.REACT_APP_IC_ID })
    }
}

export const doesHasIdParam = ({ brokerId, insurerId }, hasEnquiryId) => {
    let append = hasEnquiryId ? '&' : ''
    if (brokerId) {
        return append + `&broker_id=${brokerId}`
    }
    else if (insurerId) {
        return append + `&insurer_id=${insurerId}`
    }
    else if (process.env.REACT_APP_BROKER_ID) {
        return append + `&broker_id=${process.env.REACT_APP_BROKER_ID}`
    }
    else {
        return append + `&insurer_id=${process.env.REACT_APP_IC_ID}`
    }
}

