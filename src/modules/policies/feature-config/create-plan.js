import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { Modal, Row, Col, Button as Btn } from "react-bootstrap";
import { Button } from "components";
import { Head } from "modules/RFQ/plan-configuration/style";
import swal from "sweetalert";
import { Controller, useForm } from "react-hook-form";
import {
  postFeatureData,
  getSI,
  FetchSumInsured
} from "modules/policies/policy-config.slice";
import _ from "lodash";
import CreatePlanForm from "./Forms/create-plan-form";
import ContentTableForm from "./Forms/ContentTableForm";

const validationSchema = () =>
  yup.object().shape({
    features: yup.array().of(
      yup.object().shape({
        name: yup
          .string()
          .required("Please Enter Feature")
          .min(2, "Minimum 2 Characters Required")
          .max(100, "Maximum 100 Characters Allowed"),
        description: yup.string().required("Please Enter Content")
      })
    ),
  });

const style = {
  minWidth: "110px",
};

export const CreatePlan = ({
  show,
  onHide,
  Data = {},
  configs,
  setPlanData,
  type,
  savedConfig,
  policyId,
  dispatch,
}) => {
  const [additionalCount, setAdditionalCount] = useState(
    Data.features?.length || 1
  );
  const { SI, SIType/* , suminsuredData */, Rater, RaterType } = useSelector(
    (state) => state.policyConfig
  );
  const [SIValue, setSIValue] = useState(Data?.construct || []);

  const { control, handleSubmit, errors, watch, setValue, register } = useForm({
    validationSchema: validationSchema(),
    defaultValues: {
      ...Data,
      features: Data?.features?.map((elem1) => ({
        ...elem1,
        cover_by: String(elem1?.cover_by),
        premium_by: String(elem1?.premium_by),
      })),
    },
  });
  const relation_id = watch("relation_id");
  const si_type = watch("si_type");
  const rater_type_id = watch('rater_type_id');
  const is_policy_level = watch('is_policy_level');
  const [suminsuredDataTwo, setSumInsuredDataTwo] = useState(null);
  useEffect(() => {

    if (rater_type_id) {
      if (SIValue.length > 0) {
        setSIValue([]);
      }
      dispatch(getSI({
        policy_id: policyId,
        rater_type_id: rater_type_id
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rater_type_id])
  useEffect(() => {
    if (si_type) {
      if (SIValue.length > 0) {
        setSIValue([]);
      }
      FetchSumInsured({
        value: si_type,
        policy_id: policyId,
        rater_type_id: Rater.length > 0 ? rater_type_id : RaterType
      }, setSumInsuredDataTwo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [si_type]);
  const onSubmit = ({ features }) => {
    if (SIValue.length > 0 || Boolean(is_policy_level)) {
      if (!["salary", "flat", "base", "family_contruct", "member", null].includes(SIType) && _.isEmpty(si_type) && !Boolean(is_policy_level)) {
        swal("Validation", "Please Select SI Type", "info");
        return
      }
      const response = {
        features:
          features?.map(({ name, description, image }) => ({
            ...(name && { name }),
            ...(description && { description }),
            ...(image && { image }),
          })) || [],
        construct: SIValue,
      };

      const formdata = new FormData();
      formdata.append("policy_id", policyId);
      if (!Boolean(is_policy_level)) {

        if (SIType === "age") {

          const age = SI.filter((item) => item.id === si_type);
          formdata.append("value", age[0].name);
        } else {
          if (SIType !== "salary" && SIType !== "flat" && SIType !== "base" && SIType !== "family_contruct") {
            formdata.append("value", si_type);
          }
        }
      }else{
        formdata.append("value", '');
      }
      response.construct.forEach((data) => {
        if (!Boolean(is_policy_level)) {
          if (SIType !== "salary") {
            formdata.append("suminsured[]", data.name);
          } else {
            formdata.append("no_of_times_of_salary[]", data.name);
          }
        }
      });
      response.features.forEach((data, index) => {
        formdata.append(`feature[${index}][title]`, data.name);
        formdata.append(`feature[${index}][content]`, data.description);
        if (typeof data.image[0] !== "undefined") {
          formdata.append(`feature[${index}][image]`, data.image[0]);
        }
      });
      formdata.append(`rater_type_id`, Rater.length > 0 ? rater_type_id || Rater[0].id : RaterType);
      formdata.append(`is_policy_level`, is_policy_level);
      dispatch(postFeatureData(formdata));
      onHide();
      // } else {
      //   swal("Validation", "Image Not Selected Or Size Greater then 2 Mb", "info");
      // }
    } else {
      if (SIType === "salary") {
        swal("Validation", "No of time salary Empty", "info");
      } else {
        swal("Validation", "Sum Insured Empty", "info");
      }
    }
  };

  const AddSIValue = () => {
    if (relation_id && (SIType === "salary" || SIType === "flat" || SIType === "base" || SIType === "member" || SIType === "family_contruct")) {
      const flag = SI?.find(
        (value) => value?.id === Number(relation_id)
      );
      const flag2 = SIValue.some(
        (elem) => elem.id === Number(relation_id)
      );
      if (flag && !flag2) setSIValue((prev) => [...prev, flag]);
      setValue("relation_id", "");
    } else {

      const flag = suminsuredDataTwo?.find((value) => Number(value?.id) === Number(relation_id));
      const flag2 = SIValue.some((elem) => Number(elem.id) === Number(relation_id));
      if (flag && !flag2) setSIValue((prev) => [...prev, flag]);
      setValue("relation_id", "");
    }
  };

  const RemoveSIValue = (member_id) => {
    const filteredMembers = SIValue.filter(
      (item) => item.id !== Number(member_id)
    );
    setSIValue([...filteredMembers]);
  };

  const addForm = () => {
    setAdditionalCount((prev) => prev + 1);
  };

  const removeBill = (id) => {
    setAdditionalCount((prev) => (prev ? prev - 1 : prev));
  };

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      fullscreen={"yes"}
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="fullscreen-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          <Head>Create Feature</Head>
        </Modal.Title>
      </Modal.Header>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <Modal.Body className="text-center mr-5 ml-5">
        <CreatePlanForm
          Controller={Controller} control={control} Rater={Rater} RaterType={RaterType}
          rater_type_id={rater_type_id} SIType={SIType} is_policy_level={is_policy_level}
          SI={SI} suminsuredDataTwo={suminsuredDataTwo} AddSIValue={AddSIValue} SIValue={SIValue}
          RemoveSIValue={RemoveSIValue}
        />
        {additionalCount < 1 ? (
          <Row>
            <Col
              md={6}
              lg={5}
              xl={4}
              sm={12}
              className="d-flex align-items-center"
            >
              <Btn type="button" onClick={addForm}>
                Add Benefits +
              </Btn>
            </Col>
          </Row>
        ) : (
          <ContentTableForm
            style={style} additionalCount={additionalCount} register={register}
            errors={errors} removeBill={removeBill} addForm={addForm}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={handleSubmit(onSubmit)}>
          {Data.benefit_name ? "Update" : "Submit"}
        </Button>
      </Modal.Footer>
      {/* </form> */}
    </Modal>
  );
};
