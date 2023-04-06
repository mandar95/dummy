import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Button from "react-bootstrap/Button";
import { Col } from "react-bootstrap";
import swal from "sweetalert";
import { getFirstError } from "../../utils";
import {
  getContactData,
  selectContactData,
  hospitaloc,
  selectLoc,
  getLocData,
  location,
} from "./networkhospitalbroker.slice.js";
import { Row1, InfoHeader } from "./style";
import _ from "lodash";
import Geocode from "react-geocode";
import { ModuleControl } from "../../config/module-control";

const ShouldAddComma = (data) => {
  return (data && data[data?.length - 1] !== ',') ? ',' : ''
}

const InfoCard = (props) => {
  //selectors
  const dispatch = useDispatch();
  const ContactDataResponse = useSelector(selectContactData);
  const LocationResponse = useSelector(selectLoc);
  const { currentUser } = useSelector((state) => state.login);
  const { userLocation } = useSelector((state) => state.networkhospitalbroker);

  //states
  const [getAlert, setAlert] = useState(0);

  //Api call for communication feilds -------
  //email
  const sendEmail = () => {
    const data = { hospital_id: props?.data.id, type: "email" };
    dispatch(getContactData(data));
    setAlert(1);
  };

  //SMS
  const sendSMS = () => {
    const data = { hospital_id: props?.data.id, type: "sms" };
    dispatch(getContactData(data));
    setAlert(1);
  };

  //Location
  const locate = () => {
    const data = `${props.title}`;
    if (ModuleControl.GoogleMapIntegration || (['FYNTUNE_PRODUCTION'].includes(process.env.REACT_APP_SERVER) && currentUser.email === 'doodleone@fyntune.com') || 'SALMAN' === process.env.REACT_APP_DEVELOPER || currentUser.broker_id === 146) {

      _.isEmpty(userLocation) && props.getLocation(dispatch)

      // Get latitude & longitude from address.
      Geocode.fromAddress(`${props.title}${ShouldAddComma(props?.data?.address1)} ${props?.data?.address1 || ""}${ShouldAddComma(props?.data?.city_name)} ${props?.data?.city_name || ""}${ShouldAddComma(props?.data?.pin_code)} ${props?.data?.pin_code || ""}`).then(
        (response) => {
          const { lat, lng } = response.results[0].geometry.location;
          dispatch(location({ lat, lng }));
        },
        (error) => {
          console.error(error);
        }
      );
    } else {
      dispatch(hospitaloc(data));
      setAlert(1);
    }
  };
  //----------------------------------------

  //Lat & Long------------------------------
  useEffect(() => {
    if (!_.isEmpty(LocationResponse?.data)) {
      const data = LocationResponse?.data;
      dispatch(getLocData(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [LocationResponse]);
  //----------------------------------------

  // alert for the contact api response -----
  useEffect(() => {
    if (getAlert === 1) {
      if (ContactDataResponse?.data?.status === true) {
        swal(ContactDataResponse?.data?.message, "", "success");
        setAlert(0);
      } else {
        let error =
          ContactDataResponse?.data?.errors &&
          getFirstError(ContactDataResponse?.data?.errors);
        error = error
          ? error
          : ContactDataResponse?.data?.message
            ? ContactDataResponse?.data?.message
            : "Something went wrong";
        swal("", error, "warning");
        setAlert(0);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ContactDataResponse]);
  //-----------------------------------------

  return (
    <Row1 style={{ margin: "10px", width: "100%" }}>
      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
        <InfoHeader>
          <span className="icon"></span>
          <p>{props.title}</p>
        </InfoHeader>
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} xl={12} className="mt-3">
        <p>
          {props?.data?.address1 || ""}{ShouldAddComma(props?.data?.address1)}{props?.data?.address2 || ""}{ShouldAddComma(props?.data?.address2)}<br />
          {props?.data?.city_name || ""}{ShouldAddComma(props?.data?.city_name)}{props?.data?.state_name || ""}{ShouldAddComma(props?.data?.state_name)}<br />
          {props?.data?.pin_code || ""}
        </p>
      </Col>
      <Col xs={12} sm={12} md={12} lg={12} xl={12}>
        {!!props?.data?.phone_no && <p style={{ fontWeight: "600" }}>
          Phone-no: {props?.data?.phone_no || ""}
        </p>}
      </Col>
      <Col
        xs={12}
        sm={12}
        md={12}
        lg={12}
        xl={12}
        style={{ paddingTop: "5px", display: "flex" }}
      >
        <Button
          variant="primary"
          size="sm"
          onClick={sendEmail}
          style={{
            marginRight: "5px",
            display: "inline-block",
            alignSelf: "flex-end",
          }}
        >
          Email
        </Button>
        {false && <Button
          variant="secondary"
          size="sm"
          onClick={sendSMS}
          style={{
            marginRight: "5px",
            display: "inline-block",
            alignSelf: "flex-end",
          }}
        >
          SMS
        </Button>}
        <Button
          variant="success"
          size="sm"
          onClick={locate}
          style={{ display: "inline-block", alignSelf: "flex-end" }}
        >
          Locate
        </Button>
      </Col>
    </Row1>
  );
};

InfoCard.defaultProps = {
  title: "N/A",
  children: "N/A",
};
export default InfoCard;
