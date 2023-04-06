import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import styled from "styled-components";
import { makeStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import { Row, Col, Form } from "react-bootstrap";
import { Button } from "../../";
import { Controller, useForm } from "react-hook-form";
import {
  getEmail,
  clearEmailDetails,
} from "../../../modules/landing-page/employerLanding.slice";
import swal from "sweetalert";
import { getFirstError } from "../../../utils";
import _ from "lodash";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(1),
      width: theme.spacing(16),
      height: theme.spacing(14),
    },
  },
}));

const Subscribe = () => {
  const classes = useStyles();
  const dispatch = useDispatch();
  const resp = useSelector((state) => state.employerHome);
  const { globalTheme } = useSelector(state => state.theme)
  const { handleSubmit, reset, control } = useForm();

  //onSubmit
  const onSubmit = (data) => {
    dispatch(getEmail(data));
  };

  // alert
  useEffect(() => {
    if (!_.isEmpty(resp?.emailResp)) {
      if (resp?.emailResp?.data?.status) {
        swal("Subscribed succesfully", "", "success").then(() =>
          reset({ email_id: "" })
        );
      } else {
        let error =
          resp?.emailResp?.data?.errors &&
          getFirstError(resp?.emailResp?.data?.errors);
        error = error
          ? error
          : resp?.emailResp?.data?.message
          ? resp?.emailResp?.data?.message
          : "Something went wrong";
        swal("", error, "warning").then(() => reset({ email_id: "" }));
      }
    }
    //eslint-disable-next-line
  }, [resp]);

  useEffect(() => {
    return () => {
      dispatch(clearEmailDetails());
    };
    //eslint-disable-next-line
  }, []);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className={classes.root}>
        <Paper
          elevation={4}
          style={{
            display: "flex",
            width: "max-content",
            justifyContent: "center",
            alignItems: "center",
            alignSelf: "center",
            borderRadius: "12px",
            flexWrap: "wrap",
            height: "max-content",
            padding: "30px",
          }}
        >
          <Row
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              width: "100%",
              flexWrap: "wrap",
            }}
          >
            <ColDiv xs={12} sm={12} md={5} lg={5} xl={5}>
              <span
                style={{
                  fontWeight: 700,
                  fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px',
                  textAlign: "center",
                }}
              >
                Have any questions? Ask us anything,we'd love to answer!
              </span>
            </ColDiv>
            <ColDiv xs={12} sm={12} md={4} lg={4} xl={4}>
              <Controller
                as={<Form.Control type="email" placeholder="Email" required />}
                name="email_id"
                control={control}
              />
            </ColDiv>
            <ColDiv xs={12} sm={12} md={3} lg={3} xl={3}>
              <Button
                buttonStyle="outline-solid"
                hex1={"#009933"}
                hex2={"#99ff99"}
                style={{ paddingTop: "12px", paddingBottom: "12px" }}
              >
                <span style={{ fontWeight: 700 }}>Subscribe</span>
              </Button>
            </ColDiv>
          </Row>
        </Paper>
      </div>
    </form>
  );
};

const ColDiv = styled(Col)`
  @media (max-width: 767px) {
    padding: 10px;
    display: flex;
    justify-content: center;
  }
`;

export default Subscribe;
