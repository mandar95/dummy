import React, { useState, useEffect, useReducer } from "react";
import { differenceInYears, subYears } from "date-fns";
import * as yup from "yup";
import _ from "lodash";
import swal from "sweetalert";
import styled from "styled-components";

import classesone from "../index.module.css";
import Avatar from "./subComponent/Avatar";
import { Row/* , Button as Btn  */, OverlayTrigger } from "react-bootstrap";
import classes from "../../contact-us/index.module.css";
import { Accordion } from "react-bootstrap";
import { Input, Button, Error, Marker, Typography, Select, Loader } from "components";

import { Controller, useForm } from "react-hook-form";
import { ContextAwareToggle, formatDate, renderTooltip } from "../enrollment.help";
import {
  enrollment, loadAllNomineeSummary, loadNomineeDeclarationFormHandler/* , nextStep */
} from "../enrollment.slice";
import { /* useDispatch, */ useDispatch, useSelector } from "react-redux";
import {
  initialState, reducer,
  loadNominees, loadMember,
  addNominee
} from "./enrolment.action";
import { GetNomineeConfig } from "modules/policies/Nominee-Config/nominee.actions";

const validationSchema = (dob) =>
  yup.object().shape({
    // nominee_gender: yup.string().required("Gender required"),
    nominee_relation: yup.string().required("Please select employee relation"),
    nominee_fname: yup
      .string()
      .required("Nominee First Name required")
      .test("alphabets", "Name must contain only alphabets", (value) => {
        return /^([A-Za-z\s])+$/.test(value?.trim());
      }),
    nominee_lname: yup
      .string()
      .matches(/^([A-Za-z\s])+$/, {
        message: "Name must contain only alphabets",
        excludeEmptyString: true,
      })
      .notRequired()
      .nullable(),
    nominee_dob: yup.string().required("Nominee DOB required"),
    ...(differenceInYears(new Date(), new Date(dob)) <= 18 && {
      guardian_relation: yup
        .string()
        .required("Please select nominee relation"),
      guardian_fname: yup
        .string()
        .required("Guardian First Name required")
        .test("alphabets", "Name must contain only alphabets", (value) => {
          return /^([A-Za-z\s])+$/.test(value?.trim());
        }),
      guardian_lname: yup
        .string()
        .matches(/^([A-Za-z\s])+$/, {
          message: "Name must contain only alphabets",
          excludeEmptyString: true,
        })
        .notRequired()
        .nullable(),
      guardian_dob: yup.string().required("Guardian DOB required"),
    }),
    share_per: yup
      .number()
      .required('Share required')
      .nullable()
      .typeError("must be a number")
      .min(0)
      .max(100, "max limit is 100")
  });

const ThirdStep = ({ policy_id, policy_ids, policy_name, setNomineeConfigs, parentIndex, description, baseEnrolmentStatus }) => {
  const [nomineeRelation, setNomineeRelation] = useState([]);
  const { currentUser } = useSelector((state) => state.login);
  const { userData: savedConfig/* , nomineeText */ } = useSelector(enrollment);
  const dispatchRedux = useDispatch();
  const { globalTheme } = useSelector(state => state.theme)

  const [{ nominees: members,
    loading,
    error,
    success,
    member_option = [],
    /* relations: insuredRelations  */ }, dispatch] = useReducer(reducer, initialState);

  const { familyLabels: relations } = useSelector(
    (state) => state.policyConfig
  );
  const [dob, setDob] = useState("");

  // nomineeconfig code
  const [gate, setGate] = useState(true);
  const [nomineeConfig, setNomineeConfig] = useState(null);
  const ShowNominee = Number(nomineeConfig?.nominee_requirement) !== 3;
  const allowed_relations = nomineeConfig?.allowed_relations?.map((data) =>
    Number(data)
  );

  useEffect(() => {
    if (_.isEmpty(nomineeConfig) && gate) {
      setGate(false);
      GetNomineeConfig({
        configurable_type: "policy",
        configurable_id: policy_id,
      }, setNomineeConfig);
    } else if (_.isEmpty(nomineeConfig) && !gate) {
      GetNomineeConfig({
        configurable_type: "employer",
        configurable_id: currentUser.employer_id,
      }, setNomineeConfig);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nomineeConfig]);

  useEffect(() => {
    // if (nomineeConfig?.id) {
    setNomineeConfigs(prev => {
      const prevCopy = [...prev];
      prevCopy[parentIndex] = {
        nominee_requirement: nomineeConfig?.nominee_requirement ?? 1,
        members: members || []
      }
      return prevCopy;
    })
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parentIndex, nomineeConfig, members])

  const { control, errors, reset, handleSubmit, watch, setValue } = useForm({
    validationSchema: validationSchema(dob),
    defaultValues: {
      nominee_relation: "",
      nominee_fname: "",
      nominee_lname: "",
      nominee_dob: "",
      // nominee_gender: "",
      share_per: "",
      guardian_fname: "",
      guardian_lname: "",
      guardian_dob: "",
    },
  });

  const relationID = watch("nominee_relation");

  function RelationDropDownHandler() {
    let b = [];
    if (relations?.length && _.isEmpty(nomineeConfig)) {
      setNomineeRelation(relations);
    }
    if (
      relations?.length &&
      Number(nomineeConfig?.allowed_relations_type) === 2
    ) {
      b = relations?.filter((data, i) =>
        allowed_relations.includes(Number(data?.id))
      );
      setNomineeRelation(b);
    } else if (
      relations?.length &&
      Number(nomineeConfig?.allowed_relations_type) === 1
    ) {
      // b =
      // member_option?.filter(value => Number(value?.relation_id) !== 1)?.map((item) => ({
      //     id: item?.relation_id,
      //     name: `${item?.relation_name} - ${item?.first_name}`,
      //     value: item?.relation_id,
      //   })) || [];
      // setNomineeRelation(b);
    }
  }

  useEffect(() => {
    loadNominees(dispatch, { policy_id: policy_id });
    loadMember(dispatch, policy_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // commented by salman
  // useEffect(() => {
  //   if (Number(nomineeConfig?.allowed_relations_type) !== 1) {
  //     RelationDropDownHandler();
  //   } else if (Number(nomineeConfig?.allowed_relations_type) === 1) {
  //     let b =
  //       member_option
  //         ?.filter((value) => Number(value?.relation_id) !== 1)
  //         ?.map((item) => ({
  //           id: item?.relation_id,
  //           name: `${item?.relation_name} - ${item?.first_name}`,
  //           value: item?.relation_id,
  //         })) || [];
  //     setNomineeRelation(b);
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [relations, member_option]);

  useEffect(() => {
    if (relationID) {
      const _data = member_option.find(
        ({ relation_id }) => relation_id === Number(relationID)
      );
      if (!_.isEmpty(_data)) {
        setValue("nominee_fname", _data.first_name || '');
        setValue("nominee_lname", _data.last_name || '');
        setValue("nominee_dob", _data.dob || '');
        setDob(_data.dob);
        // let a = _data?.gender === "Male"? 1: _data.gender === "Female"? 2: 3;
        // setValue("nominee_gender",a)
      } else {
        setValue("nominee_fname", "");
        setValue("nominee_lname", "");
        setValue("nominee_dob", "");
        // setValue('nominee_gender', "")
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [relationID]);


  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    }
    if (!loading && success) {
      swal('Success', success, "success");
      loadNominees(dispatch, { policy_id: policy_id });
      dispatchRedux(loadAllNomineeSummary(policy_ids));
      reset();
      setDob("");
    }

    return () => {
      dispatch({ type: 'CLEAR' });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);


  useEffect(() => {
    if (!_.isEmpty(members)) {
      let a = members
        ?.filter((value) => [5, 6, 7, 8].includes(value?.nominee_relation_id))
        ?.map((data) => data?.nominee_relation_id);
      if (
        Number(nomineeConfig?.allowed_relations_type) === 2 &&
        !_.isEmpty(nomineeConfig)
      ) {
        a = relations?.filter((value) => !a?.includes(value?.id));
        let b = a?.filter((data, i) =>
          allowed_relations?.includes(Number(data?.id))
        );
        setNomineeRelation(b);
      } else if (
        Number(nomineeConfig?.allowed_relations_type) === 1 &&
        !_.isEmpty(nomineeConfig)
      ) {
        // let b =
        //   member_option
        //     ?.filter((value) => Number(value?.relation_id) !== 1)
        //     ?.map((item) => ({
        //       id: item?.relation_id,
        //       name: `${item?.relation_name} - ${item?.first_name}`,
        //       value: item?.relation_id,
        //     })) || [];
        let b = member_option
          ?.filter((value) => Number(value?.relation_id) !== 1 &&
            (members?.every(({ nominee_fname, nominee_dob }) =>
              (value.first_name !== nominee_fname && value.dob !== nominee_dob))))
          ?.map((item) => ({
            id: item?.relation_id,
            name: `${item?.relation_name} - ${item?.first_name}`,
            value: item?.relation_id,
          })) || [];
        // b = b?.filter((data, i) => !a?.includes(Number(data?.id)));
        setNomineeRelation(b);
      } else if (_.isEmpty(nomineeConfig)) {
        // let b = members
        //   ?.filter((value) => [5, 6, 7, 8].includes(value?.nominee_relation_id))
        //   ?.map((data) => data?.nominee_relation_id);
        if (!_.isEmpty(a)) {
          a = relations?.filter((value) => !a?.includes(value?.id));
          setNomineeRelation(a);
        }
      }
    } else {
      if (Number(nomineeConfig?.allowed_relations_type) !== 1) {
        RelationDropDownHandler();
      }
      if (Number(nomineeConfig?.allowed_relations_type) === 1) {
        let b =
          member_option
            ?.filter((value) => Number(value?.relation_id) !== 1)
            ?.map((item) => ({
              id: item?.relation_id,
              name: `${item?.relation_name} - ${item?.first_name}`,
              value: item?.relation_id,
            })) || [];
        setNomineeRelation(b);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members, nomineeConfig]);

  const onSubmit = (data) => {
    addNominee(dispatch, {
      nominee_fname: [data.nominee_fname],
      ...(data.nominee_lname && { nominee_lname: [data.nominee_lname] }),
      nominee_relation_id: [data.nominee_relation],
      nominee_dob: [data.nominee_dob],
      // nominee_gender: [data.nominee_gender],
      ...(data.guardian_fname &&
        data.guardian_dob &&
        data.guardian_relation && {
        guardian_fname: [data.guardian_fname],
        ...(data.guardian_lname && {
          guardian_lname: [data.guardian_lname],
        }),
        guardian_dob: [data.guardian_dob],
        guardian_relation_id: data.guardian_relation,
      }),
      share_per: [data.share_per],
      employee_id: savedConfig?.employee_id,
      emp_id: savedConfig?.employer_id,
      policy_id: policy_id,
    })
  };

  // const handleNext = (step) => {
  //   if ((Number(nomineeConfig?.nominee_requirement) === 1 ||
  //     _.isEmpty(nomineeConfig))) {
  //     if (
  //       members.reduce(
  //         (total, { share_per }) => total + Number(share_per),
  //         0
  //       ) !== 100
  //     ) {
  //       swal("Total share for nominees should be 100%");
  //     } else {
  //       dispatchRedux(nextStep());
  //     }
  //   } else {
  //     dispatchRedux(nextStep());
  //   }
  // };
  // const isTextAvailable = !!(nomineeText.gmc || nomineeText.gpa || nomineeText.gtl);

  const nomineeDeclarationFormHandler = () => {
    dispatchRedux(loadNomineeDeclarationFormHandler({
      policy_id: policy_id,
      employee_id: savedConfig?.employee_id || currentUser?.employee_id
    }));
  }

  return (
    <>
      {ShowNominee && <Accordion defaultActiveKey={/* packageIndex + */ 1} style={{
        boxShadow: '1px 1px 16px 0px #e7e7e7',
        borderRadius: '15px',
        width: '100%',
        marginBottom: '15px',
        border: '1px solid #e8e8e8',
        outline: 'none'
      }}>
        <Accordion.Toggle
          eventKey={/* packageIndex + */ 1} style={{
            width: '100%',
            border: 'none',
            borderTopLeftRadius: '20px',
            borderTopRightRadius: '20px',
            background: 'white',
            padding: '10px',
            outline: 'none'

          }} className='d-flex justify-content-between align-items-center'>
          <div className='text-left mr-3' style={{
            fontWeight: '500',
            fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
            letterSpacing: '1px',
            color: 'black'
          }}>
            {/* <img
              src={GetSrc(v.policy_sub_type_id)}
              alt={'policy_image_404'}
              style={{
                // border: '1px dashed #b6b6b6',
                borderRadius: "5px",
                // padding: "10px",
                textAlign: "center",
                marginRight: '10px',
                height: '40px'
              }} /> */}
            {policy_name}
            {Boolean(description) && Boolean(description?.length > 40) && <OverlayTrigger
              placement="top"
              overlay={(e) =>
                renderTooltip(e, description)
              }
            >
              <span className={classesone.textOverFlow}>{`${description/* ?.slice(0, 40) */}...`}</span>
            </OverlayTrigger>
            }
            {Boolean(description) && Boolean(description?.length <= 40) &&
              <span className={classesone.textOverFlow}>{`${description}`}</span>
            }
          </div>
          <ContextAwareToggle eventKey={/* packageIndex + */ 1} />
        </Accordion.Toggle>
        {true &&
          <Accordion.Collapse eventKey={/* packageIndex + */ 1} style={{
            width: '100%',
            // paddingTop: '50px',
            paddingTop: '15px',
            background: 'white',
            borderTop: '2px solid #FFDF00',
            borderBottomLeftRadius: '20px',
            borderBottomRightRadius: '20px'
          }}>
            <div className="row m-0 justify-content-center justify-content-sm-start mx-2">
              {baseEnrolmentStatus && <div className="row m-0 justify-content-center justify-content-sm-start">
                {/* <div
          style={{
            justifyContent: isTextAvailable ? 'space-between' : 'flex-end',
            display: 'flex'
          }}>
          {isTextAvailable && < div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            background: '#fff3f4',
            padding: '0px 10px',
            fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
            borderRadius: '12px',
            color: '#3d3c3c',
            fontWeight: '500',
            boxShadow: '2px 6px 9px 1px #ececec'
          }}>Note : Nomination for {!!nomineeText.gmc && 'GMC'}
            {(nomineeText.gpa && nomineeText.gtl) ? ', ' : ((nomineeText.gpa && !nomineeText.gtl) ? ' & ' : '')}
            {!!nomineeText.gpa && 'GPA'}
            {!!nomineeText.gtl && ' & '}
            {!!nomineeText.gtl && 'GTL'} polic{(nomineeText.gpa || nomineeText.gtl) ? 'ies' : 'y'}</div>}
        </div> */}

                <form
                  className="row m-0 justify-content-center mb-2 justify-content-sm-center justify-content-md-start"
                  onSubmit={handleSubmit(onSubmit)}
                >
                  <div className="row m-0 w-100">
                    <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                      <Controller
                        as={
                          <Select
                            label="Relation With Employee"
                            options={nomineeRelation}
                            valueName="name"
                            placeholder='Select Relation With Employee'
                            id="employee_relation"
                            isRequired={true}
                            required={false}
                          />
                        }
                        onChange={([e]) => {
                          !e.target.value && reset();
                          return e
                        }}
                        error={errors && errors.nominee_relation}
                        name="nominee_relation"
                        control={control}
                      />
                      {!!errors.nominee_relation && (
                        <Error>{errors.nominee_relation.message}</Error>
                      )}
                    </div>

                    <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                      <Controller
                        as={
                          <Input
                            style={{
                              background: "white",
                            }}
                            label="First Name"
                            placeholder="Enter First Name"
                            isRequired={true}
                            required={false}
                            maxLength={50}
                            disabled={
                              relations?.length &&
                              Number(nomineeConfig?.allowed_relations_type) === 1
                            }
                          />
                        }
                        error={errors && errors.nominee_fname}
                        control={control}
                        name="nominee_fname"
                      />
                      {!!errors.nominee_fname && (
                        <Error>{errors.nominee_fname.message}</Error>
                      )}
                    </div>

                    <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                      <Controller
                        as={
                          <Input
                            style={{
                              background: "white",
                            }}
                            label="Last Name"
                            placeholder="Enter Last Name"
                            required={false}
                            maxLength={50}
                            disabled={
                              relations?.length &&
                              Number(nomineeConfig?.allowed_relations_type) === 1
                            }
                          />
                        }
                        error={errors && errors.nominee_lname}
                        control={control}
                        name="nominee_lname"
                      />
                      {!!errors.nominee_lname && (
                        <Error>{errors.nominee_lname.message}</Error>
                      )}
                    </div>

                    <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                      <Controller
                        as={
                          <Input
                            style={{ background: "white" }}
                            label="Date of Birth"
                            type="date"
                            disabled={
                              relations?.length &&
                              Number(nomineeConfig?.allowed_relations_type) === 1 && member_option.find(
                                ({ relation_id }) => relation_id === Number(relationID)
                              )?.dob
                            }
                            isRequired={true}
                            required={false}
                          />
                        }
                        error={errors && errors.nominee_dob}
                        name="nominee_dob"
                        max={formatDate(new Date())}
                        onChange={([e]) => {
                          setDob(e.target.value);
                          return e;
                        }}
                        control={control}
                      />
                      {!!errors.nominee_dob && (
                        <Error>{errors.nominee_dob.message}</Error>
                      )}
                    </div>

                    <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                      <Controller
                        as={
                          <Input
                            label="Share %"
                            placeholder="Enter Share %"
                            min={1}
                            type="number"
                            isRequired={true}
                            required={false}
                          />
                        }
                        error={errors && errors.share_per}
                        control={control}
                        name="share_per"
                      />
                      {!!errors.share_per && <Error>{errors.share_per.message}</Error>}
                    </div>
                    {/* <div className="col-12 col-md-12 col-lg-6 col-xl-4">
              <Controller
                as={
                  <Selecta
                    label="Gender"
                    placeholder="Select Gender"
                    required
                    options={
                      gender?.map((item) => ({
                        id: item.id,
                        name: item.name,
                        value: item.id,
                      }))
                    }
                    error={errors && errors.nominee_gender}
                  />
                }
                control={control}
                name="nominee_gender"
              />
              {!!errors.nominee_gender && (
                <Error>{errors.nominee_gender.message}</Error>
              )}
            </div> */}
                  </div>
                  {differenceInYears(new Date(), new Date(dob)) <= 18 && (
                    <>
                      <div className="col-12">
                        <Marker />
                        <Typography>{"\u00A0"}Guardian</Typography>
                      </div>
                      <Row className="d-flex flex-wrap w-100">
                        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                          <Controller
                            as={
                              <Input
                                label="First Name"
                                placeholder="Enter First Name"
                                maxLength={50}
                                isRequired={true}
                                required={false}
                              />
                            }
                            error={errors && errors.guardian_fname}
                            control={control}
                            name="guardian_fname"
                          />
                          {!!errors.guardian_fname && (
                            <Error>{errors.guardian_fname.message}</Error>
                          )}
                        </div>

                        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                          <Controller
                            as={
                              <Input
                                label="Last Name"
                                placeholder="Enter Last Name"
                                maxLength={50}
                                required={false}
                              />
                            }
                            error={errors && errors.guardian_lname}
                            control={control}
                            name="guardian_lname"
                          />
                          {!!errors.guardian_lname && (
                            <Error>{errors.guardian_lname.message}</Error>
                          )}
                        </div>

                        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                          <Controller
                            as={<Input label="Date of Birth" type="date"
                              isRequired={true}
                              required={false} />}
                            error={errors && errors.guardian_dob}
                            name="guardian_dob"
                            max={formatDate(subYears(new Date(), 18))}
                            control={control}
                          />
                          {!!errors.guardian_dob && (
                            <Error>{errors.guardian_dob.message}</Error>
                          )}
                        </div>

                        <div className="col-12 col-md-12 col-lg-6 col-xl-4">
                          <Controller
                            as={
                              <Select
                                label="Relation With Nominee"
                                options={relations.filter(({ id }) => [5, 6, 9].includes(id)).map(({ id, name }) => ({
                                  id, name,
                                  value: id
                                }))}
                                id="guardian_relation"
                                placeholder="Select Relation With Nominee"
                                isRequired={true}
                                required={false}
                              />
                            }
                            error={errors && errors.guardian_relation}
                            name="guardian_relation"
                            control={control}
                          />
                          {!!errors.guardian_relation && (
                            <Error>{errors.guardian_relation.message}</Error>
                          )}
                        </div>
                      </Row>
                    </>
                  )}

                  <div className="col-12">
                    <div className="d-flex justify-content-end align-items-center flex-wrap ">
                      <div className="d-flex justify-content-center mr-3">
                        <Button
                          buttonStyle={"outline"}
                          className={`${classesone.bigButton2}`}
                        >
                          Save Nominee Details +
                        </Button>
                      </div>
                    </div>
                  </div>
                </form>

                {/* <form id={formId} onSubmit={handleSubmit2(onNext)}></form> */}
              </div>}
              {!!members.length && (
                <div className="d-flex flex-wrap mt-2 mt-0">
                  <h5 className="mr-3">
                    Nominees Enrolled Into Policy
                  </h5>
                  {(!!policy_id && (!!savedConfig?.employee_id || !!currentUser?.employee_id)) && <div className="d-flex justify-content-center">
                    <DeclarationButton
                      type="button"
                      onClick={nomineeDeclarationFormHandler}
                      buttonStyle={"outline"}
                    >
                      Declaration Form
                    </DeclarationButton>
                  </div>}
                </div>
              )}
              <div className={`${classes.autoscroll}`}>
                <div className="d-flex flex-nowrap flex-sm-wrap w-100">
                  {members?.map((val, index) => {
                    return (
                      <Avatar
                        type="nominee"
                        data={val}
                        relations={nomineeRelation}
                        relations2={relations}
                        name={val?.nominee_relation}
                        gender={val?.gender}
                        key={index + '-members'}
                        policy_id={policy_id}
                        isInsuredRelation={
                          relations?.length &&
                          Number(nomineeConfig?.allowed_relations_type) === 1
                        }
                        baseEnrolmentStatus={baseEnrolmentStatus}
                        success={success}
                        dispatch={dispatch}
                      />
                    );
                  })}
                </div>
              </div>
            </div>
          </Accordion.Collapse>
        }
      </Accordion>}
      {loading && <Loader />}</>
  );
};

export default ThirdStep;


export const DeclarationButton = styled.button`
  background: ${({ theme }) => theme.Tab?.color || "#ff3c46"};
  border: 0px;
  border-radius: 4px;
  font-size: 12px;
  color: white;
`;
