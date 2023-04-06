import React, { useState, useEffect, Fragment } from "react";
import { Row, Col } from "react-bootstrap";
import Input from "../../../components/inputs/input/input";
import Select from "../../../components/inputs/Select/Select";
import Checkbox from "../../../components/inputs/checkbox/checkbox";
import { Button, CardBlue } from "../../../components/index";
import fields from "./inputfields.json";
import { useForm, Controller } from "react-hook-form";
import { getRelations, addMemberDetails } from "./addmemberdetails.service";
import swal from "sweetalert";
import { resetFields } from './reset.fields';
// import { useYupValidationResolver } from './validation.schema'
// import { yupResolver } from '@hookform/resolvers';

import * as yup from 'yup';
import { serializeError } from "../../../utils";
import { common_module } from 'config/validations';
const validation = common_module.user;

const AddMemberDetails = (props) => {
  const inputFields = JSON.parse(JSON.stringify(fields));
  const [options, setOptions] = useState([]);
  const [isChecked, setIsChecked] = useState(false);

  const validationSchema = yup.object().shape({
    first_name: yup.string().matches(/[a-zA-Z]+/, { message: "uppercase and lowercase alphabets allowed" }).required({ message: 'first name is missing' }),
    last_name: yup.string().matches(/[a-zA-Z]+/, { message: "uppercase and lowercase alphabets allowed" }).required({ message: 'last name is missing' }),
    //eslint-disable-next-line
    member_email: yup.string().matches(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, { message: 'Email format is incorrect' }).required({ message: 'email id is missing' }),
    member_mob_no: yup.string()
      .required('Mobile No. is required')
      .min(10, "Mobile No. should be 10 digits")
      .max(10, "Mobile No. should be 10 digits")
      .matches(validation.contact.regex, 'Not valid number'),
    dob: yup.string().required('location is missing'),
    ...(!isChecked && {
      buildingflat: yup.string().required({ message: 'building detail is missing' }),
      location: yup.string().required({ message: 'location is missing' }),
      street: yup.string().required({ message: 'street is missing' }),
      pincode: yup.number().typeError('must be number').required({ message: 'pincode is missing' }),
      city: yup.string().required({ message: 'city is missing' }),
      state: yup.string().required({ message: 'state is missing' }),
    })
  })
  const { handleSubmit, control, reset, watch, errors } = useForm({
    // resolver: yupResolver(validationSchema),
    validationSchema
  });

  const isSpouse = watch("relation") === "2";


  useEffect(() => {
    (async () => {
      if (!options?.length) {
        let value = await getRelations();
        setOptions(value.data.data);
      }
    })();
  }, [options]);
  const onSubmit = async (payload) => {
    let { relation, dom, ...rest } = payload;
    rest['marriage_date'] = dom;
    rest['relation_id'] = relation;
    let { data, message, errors } = await addMemberDetails(rest);
    if (data.status) {
      swal("Success", message, "success");
      reset(resetFields())
    }
    else swal("Alert", serializeError(message || errors), "warning");
  };

  return (
    <CardBlue title="Add Family Member Details" round={true}>
      <form onSubmit={handleSubmit(onSubmit)}>
        <Row className="mt-3 d-flex flex-wrap">


          <Col xs={12} sm={12} md={12} lg={4} xl={3} >
            <Controller
              as={
                <Select
                  name={"relation"}
                  placeholder={"Select Relation"}
                  label={"Relation"}
                  options={options}
                />
              }
              rules={{ required: true }}
              name={"relation"}
              control={control}
              defaultValue=""
            />
          </Col>



          {inputFields.slice(0, 6).map((v, i) => (
            <Fragment key={i + 'marriage'}>{
              v.label === "Date of Marriage" ? (isSpouse ? <Col
                xs={12}
                sm={12}
                md={12}
                lg={4} xl={3}

                key={`${v}--${i}`}
              >
                <Controller
                  as={
                    <Input
                      label={v.label}
                      {...(!!v.placeholder ? { placeholder: v.placeholder } : {})}
                      type={v.type}
                      name={v.name}
                      required={v.required}
                      isRequired={true}
                    />
                  }
                  rules={{ required: true }}
                  name={v.name}
                  control={control}
                  defaultValue=""
                />

              </Col> : "") :
                <Col
                  xs={12}
                  sm={12}
                  md={12}
                  lg={4} xl={3}

                  key={`${v}--${i}`}
                >
                  <Controller
                    as={
                      <Input
                        label={v.label}
                        {...(!!v.placeholder ? { placeholder: v.placeholder } : {})}
                        type={v.type}
                        name={v.name}
                        error={!!errors[v.name]?.message}
                        required={v.required}
                        isRequired={true}
                      />
                    }
                    // rules={{ required: true }}
                    name={v.name}
                    control={control}
                    defaultValue=""
                  />
                  {/* <small>{errors[v.name]?.message}</small> */}
                </Col>}</Fragment>
          ))}
        </Row>




        {/* --------------------checkbox ------------------- */}
        <Row className="mt-2">
          <Col xs={5}>
            <Checkbox
              placeholder="Same Address As Employee"
              noWrapper={true}
              onChange={() => setIsChecked(!isChecked)}
              checked={isChecked}
              placeholderSize={"1.4em"}
            />
          </Col>
        </Row>
        {/* ------------------------------------------------*/}




        {!isChecked &&

          <Row className="mt-2">
            {inputFields.slice(6, 12).map((v, i) => (
              <Col
                xs={12}
                sm={12}
                md={12}
                lg={4} xl={3}

                key={`${v}--${i}`}
              >
                <Controller
                  as={
                    <Input
                      label={v.label}
                      {...(!!v.placeholder ? { placeholder: v.placeholder } : {})}
                      type={v.type}
                      name={v.name}
                      error={!!errors[v.name]?.message}
                      required={v.required}
                    />
                  }
                  // rules={{ required: true }}
                  name={v.name}
                  control={control}
                  defaultValue=""
                />
                {/* <small>{errors[v.name]?.message?.message || errors[v.name]?.message}</small> */}
              </Col>
            ))}
          </Row>

        }



        {/* ---------------button------------------------ */}

        <Row className="mt-2">
          <Col xs={12} className="d-flex justify-content-end">
            <Button
              buttonStyle="danger"
              type="button"
              onClick={() =>
                reset(resetFields())
              }
            >
              Reset
            </Button>
            <Button type="submit">Save</Button>
          </Col>
        </Row>

        {/* -------------------------------------------- */}



      </form>
    </CardBlue>
  );
};

export default AddMemberDetails;
