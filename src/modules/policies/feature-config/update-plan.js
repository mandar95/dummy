import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import * as yup from "yup";
import { Modal, Row, Col, Button as Btn } from "react-bootstrap";
import { Button } from "components";
import { Head } from "modules/RFQ/plan-configuration/style";
import swal from "sweetalert";
import { Controller, useForm } from "react-hook-form";
import {
  updateFeature,
  getSI,
  FetchSumInsured
} from "modules/policies/policy-config.slice";
import UpdatePlanForm from "./Forms/update-plan-form";
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
const EditModal = ({
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
  // const [SIData, setSIData] = useState([]);

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
    if (["member", "base", "flat", "family_contruct", "salary"].includes(SIType) && typeof (Data) === "object") {
      let a = [];
      if (SIType !== "salary") {
        a = SI?.filter(data => Number(data.name) === Number(Data.suminsured));
      } else {
        a = SI?.filter(data => Number(data.name) === Number(Data.no_of_times_of_salary));
      }
      setValue("relation_id", a[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SIType, is_policy_level]);
  useEffect(() => {
    if (si_type) {
      if (SIValue.length > 0) {
        setSIValue([]);
      }
      FetchSumInsured({
        value: si_type || type,
        policy_id: policyId,
        rater_type_id: Rater.length > 0 ? rater_type_id : RaterType
      }, setSumInsuredDataTwo);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [si_type]);
  useEffect(() => {
    if (Rater.length && typeof (Data) === "object") {
      setValue("rater_type_id", 1 + Number(Data.is_opd));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Rater, is_policy_level])
  useEffect(() => {
    if (Boolean(suminsuredDataTwo) && typeof (Data) === "object") {
      let a = suminsuredDataTwo.filter(data => data.name === Data.suminsured);
      setValue("relation_id", a[0]?.id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [suminsuredDataTwo])
  useEffect(() => {
    setValue("is_policy_level", Data?.is_policy_level);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const onSubmit = ({ features }) => {
    if (SIValue.length > 0 || Boolean(is_policy_level)) {
      if (!["salary", "flat", "base", "family_contruct", "member", null].includes(SIType) && !Boolean(si_type) && !Boolean(is_policy_level)) {
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
      } else {
        formdata.append("value", '');
      }
      response.construct.forEach((data) => {
        if (!Boolean(is_policy_level)) {
          if (SIType !== "salary") {
            formdata.append("suminsured", data.name);
          } else {
            formdata.append("no_of_times_of_salary", data.name);
          }
        }
      });
      response.features.forEach((data, index) => {
        formdata.append(`title`, data.name);
        formdata.append(`content`, data.description);
        if (typeof data.image[0] !== "undefined") {
          formdata.append(`image`, data.image[0]);
        }
      });
      formdata.append(`rater_type_id`, Rater.length > 0 ? rater_type_id || Rater[0].id : RaterType);

      formdata.append("_method", "PATCH");
      formdata.append(`is_policy_level`, is_policy_level);
      dispatch(updateFeature(Data?.id, formdata));
      onHide();
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
      if (flag && !flag2) setSIValue((prev) => [flag]);
      setValue("relation_id", "");
    } else {

      const flag = suminsuredDataTwo?.find((value) => Number(value?.id) === Number(relation_id));
      const flag2 = SIValue.some((elem) => Number(elem.id) === Number(relation_id));
      if (flag && !flag2) setSIValue((prev) => [flag]);
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
          <Head>Update Feature</Head>
        </Modal.Title>
      </Modal.Header>
      {/* <form onSubmit={handleSubmit(onSubmit)}> */}
      <Modal.Body className="text-center mr-5 ml-5">
        <UpdatePlanForm
          Controller={Controller} control={control} Rater={Rater} RaterType={RaterType} rater_type_id={rater_type_id}
          SIType={SIType} is_policy_level={is_policy_level} SI={SI} suminsuredDataTwo={suminsuredDataTwo} AddSIValue={AddSIValue}
          SIValue={SIValue} RemoveSIValue={RemoveSIValue} FetchSumInsured={FetchSumInsured} Data={Data} si_type={si_type}
          policyId={policyId} setSumInsuredDataTwo={setSumInsuredDataTwo}
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
            errors={errors} removeBill={removeBill} addForm={addForm} Data={Data}
          />
        )}
      </Modal.Body>
      <Modal.Footer>
        <Button type="button" onClick={handleSubmit(onSubmit)}>
          Update
        </Button>
      </Modal.Footer>
      {/* </form> */}
    </Modal>
  );
};
export default EditModal;
