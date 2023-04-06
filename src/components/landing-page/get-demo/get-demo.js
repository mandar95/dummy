//used employer l-p 's slice for api calls'

import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { DropdownButton, Row, Col, Collapse } from "react-bootstrap";
import { Input, Button } from "../../";
import styled from "styled-components";
import { useForm, Controller } from "react-hook-form";
import Fade from "react-reveal/Fade";
import {
  getdemo,
  clearDemoMessage,
} from "../../../modules/landing-page/employerLanding.slice";
import _ from "lodash";
import swal from "sweetalert";
import { getFirstError } from "../../../utils";

const GetDemo = () => {
  const dispatch = useDispatch();
  const response = useSelector((state) => state.employerHome);
  const { globalTheme } = useSelector(state => state.theme)
  const [open, setOpen] = useState(false);
  const { handleSubmit, control } = useForm();

  //onSubmit
  const onSubmit = (data) => {
    dispatch(getdemo(data));
  };

  //alert
  useEffect(() => {
    if (!_.isEmpty(response?.demoResp)) {
      if (response?.demoResp?.data?.status) {
        swal(response?.demoResp?.data?.message, "", "success");
      } else {
        let error =
          response?.demoResp?.data?.errors &&
          getFirstError(response?.demoResp?.data?.errors);
        error = error
          ? error
          : response?.demoResp?.data?.message
            ? response?.demoResp?.data?.message
            : "Something went wrong";
        swal("", error, "warning");
      }
    }
  }, [response.demoResp]);

  useEffect(() => {
    return () => {
      dispatch(clearDemoMessage());
    };
    //eslint-disable-next-line
  }, []);

  return (
    <DropdownButton
      alignRight
      title="Get Demo"
      id="dropdown-menu-align-right"
      aria-controls="example-collapse-text"
      aria-expanded={open}
      onClick={() => setOpen(!open)}
    >
      <Collapse in={open} style={{ transition: "height 0.2s " }}>
        <Fade delay={200}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            style={{
              margin: "0 15px 0 15px",
            }}
          >
            <Container>
              <Row
                className="w-100"
                style={{ display: "flex", justifyContent: "center" }}
              >
                <ColDiv xs={12} sm={12} md={12} lg={12} xl={12} className="p-1">
                  <Controller
                    as={<Input label="First Name" placeholder="First Name" />}
                    name="first_name"
                    control={control}
                  />
                </ColDiv>
                <ColDiv xs={12} sm={12} md={12} lg={12} xl={12} className="p-1">
                  <Controller
                    as={<Input label="Last Name" placeholder="Last Name" />}
                    name="last_name"
                    control={control}
                  />
                </ColDiv>
                <ColDiv xs={12} sm={12} md={12} lg={12} xl={12} className="p-1">
                  <Controller
                    as={<Input label="Email id" placeholder="Email id" />}
                    name="email"
                    control={control}
                  />
                </ColDiv>
                <ColDiv xs={12} sm={12} md={12} lg={12} xl={12} className="p-1">
                  <Controller
                    as={
                      <Input
                        label="Mobile Number"
                        placeholder="Mobile Number"
                      />
                    }
                    name="mobile_no"
                    control={control}
                  />
                </ColDiv>
                <ColDiv
                  xs={12}
                  sm={12}
                  md={12}
                  lg={12}
                  xl={12}
                  className="p-1 my-1"
                >
                  <Button
                    buttonStyle="outline-solid"
                    style={{ fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px', fontWeight: "600" }}
                  >
                    Get Your Free Demo Now
                  </Button>
                </ColDiv>
              </Row>
            </Container>
          </form>
        </Fade>
      </Collapse>
    </DropdownButton>
  );
};

const Container = styled.div`
  display: flex;
  justify-content: center;
  padding: 20px;
  margin: 20px 0px 20px 0px;
`;

const ColDiv = styled(Col)`
  display: flex;
  justify-content: center;
`;

export default GetDemo;
