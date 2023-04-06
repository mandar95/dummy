import React, { useState, useEffect } from 'react';
import { useForm, Controller } from "react-hook-form";
import swal from 'sweetalert';
import * as yup from 'yup';
import { useHistory, useParams } from 'react-router-dom';

import { Input, Card, Button, Error, Loader } from "components";
import Select from "./Select/Select";
import { Row, Col, Form } from 'react-bootstrap';
import { InputBorder, CustomControl, CustomLabel, FormLabel, SpanLabel } from "../AssignRole/switch/style";

import { useDispatch, useSelector } from 'react-redux';
import { selectParentModules, getParentModules, editModule, selectModuleData, getModule, selectLoading, selectError, selectSuccess, clear } from '../user.slice';
import { numOnly, noSpecial } from "utils";
import { common_module } from 'config/validations'
import { Decrypt } from '../../../utils';

const validation = common_module.module


const validationSchema = (isChild, isAdmin) => yup.object().shape({
  ...isAdmin && {
    module_name: yup.string().required('Module Name required')
      .min(validation.name.min, `Minimum ${validation.name.min} character required`)
      .max(validation.name.max, `Maximum ${validation.name.max} character available`)
    // .matches(validation.name.regex, "Name must contain only alphabets & hyphen(-)")
    ,
    module_url: yup.string().required('URL required')
      .min(validation.url.min, `Minimum ${validation.url.min} character required`)
      .max(validation.url.max, `Maximum ${validation.url.max} character available`)
      .matches(validation.url.regex, "URL must contain only alphabets, hyphen(-) & slash(/)"),
    module_icon_class: yup.string().required('Icon required')
      .min(validation.icon.min, `Minimum ${validation.icon.min} character required`)
      .max(validation.icon.max, `Maximum ${validation.icon.max} character available`)
      .matches(validation.icon.regex, "Icon must contain only alphabets & hyphen(-)"),
    module_sequence: yup.string().required('Sequence required')
      .min(validation.sequence.min, `Minimum ${validation.sequence.min}`)
      .max(validation.sequence.max, `Maximum ${validation.sequence.max}`)
      .matches(/^\d+$/, "Not a valid number"),
    ...isChild && {
      parent_menu_id: yup.string().required('Parent Module required')
    }
  },
  ...!isAdmin && { module_content: yup.string().required('Module Content required').max(100, 'Max 100 characters available') },
});


export default function UpdateModule() {
  const dispatch = useDispatch();
  const history = useHistory();
  const parentModules = useSelector(selectParentModules);
  const [isChild, setIsChild] = useState(null);
  const { userType } = useSelector(state => state.login);
  const isAdmin = userType === 'Super Admin'
  const { control, errors, handleSubmit } = useForm({ validationSchema: validationSchema(isChild, isAdmin) });
  const ModuleData = useSelector(selectModuleData);
  const loading = useSelector(selectLoading);
  const error = useSelector(selectError);
  const success = useSelector(selectSuccess);
  let { id: moduleId } = useParams();
  moduleId = Decrypt(moduleId);

  useEffect(() => {
    if (userType) {
      dispatch(getParentModules(userType));
      dispatch(getModule(moduleId));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [moduleId, userType]);

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success");
      history.goBack();
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);


  const onSubmit = ({ module_content, ...data }) => {
    if ((!data.parent_menu_id || data.is_child === "0") && isAdmin) data.parent_menu_id = 0
    dispatch(editModule({ _method: "PATCH", ...data, ...module_content && { module_content }, status: 1 }, moduleId));
  };

  const isChildForm = (e) => {
    if (e.target.value === "1") setIsChild(true)
    else if (e.target.value === "0") setIsChild(false)
  }

  const ResetContent = () => {
    dispatch(editModule({ _method: "PATCH", module_name: ModuleData.moduleName, status: 1 }, moduleId));
  }

  return (
    <Card title="Update Module">
      {(ModuleData?.id === Number(moduleId)) &&
        <Form onSubmit={handleSubmit(onSubmit)}>
          {/* {setIsChild(ModuleData.isChild)} */}
          <Row className="d-flex flex-wrap">
            <Col md={6} lg={6} xl={3} sm={12}>
              <Controller
                as={<Input label="Module Name" name="module_name" maxLength={validation.name.max}
                  required={false} isRequired={isAdmin} labelProps={isAdmin ? undefined : { background: 'linear-gradient(#ffffff, #dadada)' }} disabled={!isAdmin} />}
                name="module_name"
                error={errors && errors.module_name}
                control={control}
                defaultValue={ModuleData.moduleName}
              />
              {!!errors.module_name &&
                <Error>
                  {errors.module_name.message}
                </Error>}
            </Col>
            {isAdmin && <><Col md={6} lg={6} xl={3} sm={12}>
              <Controller
                as={<Input label="Module URL" name="module_url" maxLength={validation.url.max}
                  placeholder="Enter Module URL " required={false} isRequired={true} />}
                name="module_url"
                control={control}
                defaultValue={ModuleData.moduleUrl}
              />
              {!!errors.module_url &&
                <Error>
                  {errors.module_url.message}
                </Error>}
            </Col>
              <Col md={6} lg={6} xl={3} sm={12}>
                <Controller
                  as={<Input label="Module Icon" name="module_icon_class" maxLength={validation.icon.max}
                    placeholder="Enter Themify Icon Class" required={false} isRequired={true} />}
                  name="module_icon_class"
                  error={errors && errors.module_icon_class}
                  control={control}
                  defaultValue={ModuleData?.moduleIcon}
                />
                {!!errors.module_icon_class &&
                  <Error>
                    {errors.module_icon_class.message}
                  </Error>}
              </Col>
              {/* <Col md={6} lg={6} xl={3} sm={12}>
                <Controller
                  as={<Switch />}
                  name="status"
                  control={control}
                  defaultValue={1}
                />
              </Col> */}
              <Col md={6} lg={6} xl={3} sm={12}>
                {/* <span>Is Module is Child?</span> */}
                <Controller
                  as={
                    <InputBorder>
                      <CustomControl className="d-flex flex-grow-1 pt-2 justify-content-around ">
                        <CustomLabel>
                          <p>Yes</p>
                          <input type="radio" name="is_child" checked={(isChild === null) ? ModuleData.isChild : isChild} value={1} />
                          <span></span>
                        </CustomLabel>
                        <CustomLabel>
                          <p>No</p>
                          <input type="radio" name="is_child" checked={(isChild === null) ? !ModuleData.isChild : !isChild} value={0} />
                          <span></span>
                        </CustomLabel>
                      </CustomControl>
                      <FormLabel htmlFor="name">
                        <SpanLabel>
                          Module Is Child?
                        </SpanLabel>
                      </FormLabel>
                    </InputBorder>
                  }
                  name="is_child"
                  control={control}
                  onClick={isChildForm}
                  defaultValue={(isChild === null) ? ModuleData.isChild : isChild}
                />
              </Col>
              {((isChild === null) ? ModuleData.isChild : isChild) ?
                <Col md={6} lg={6} xl={3} sm={12}>
                  <Controller
                    as={<Select
                      label="Its Parent Module"
                      option={parentModules || []}
                      name="parent_menu_id"
                      required={true}
                      id="parent-module"
                      selected={ModuleData?.parentId}

                    />}
                    name="parent_menu_id"
                    control={control}
                    error={errors && errors.parent_menu_id}
                    defaultValue={ModuleData?.parentId}
                  />
                  {!!errors.parent_menu_id &&
                    <Error>
                      {errors.parent_menu_id.message}
                    </Error>}
                </Col>
                : ""}
              <Col md={6} lg={6} xl={3} sm={12}>
                <Controller
                  as={<Input label="Module Sequence" name="module_sequence" placeholder="Enter Module Sequence"
                    maxLength={validation.sequence.length} onKeyDown={numOnly} onKeyPress={noSpecial} type='tel' required={false} isRequired={true} />}
                  name="module_sequence"
                  error={errors && errors.module_sequence}
                  defaultValue={ModuleData?.sequence}
                  control={control}
                />
                {!!errors.module_sequence &&
                  <Error>
                    {errors.module_sequence.message}
                  </Error>}
              </Col>
            </>}
            <Col md={12} lg={12} xl={9} sm={12}>
              <Controller
                as={<Input label="Module Content" name="module_content"
                  placeholder="Enter Module Content " required={false} isRequired={!isAdmin} />}
                name="module_content"
                maxLength='100'
                defaultValue={ModuleData.moduleContent}
                error={errors && errors.module_content}
                control={control}
              />
              {!!errors.module_content &&
                <Error>
                  {errors.module_content.message}
                </Error>}
            </Col>
          </Row>
          <Row >
            <Col md={12} className="d-flex justify-content-end mt-4">
              {!isAdmin && <Button buttonStyle='danger' type="button" onClick={ResetContent}>
                Remove Content
              </Button>}
              <Button type="submit">
                Submit
              </Button>
            </Col>
          </Row>
        </Form>
      }
      {loading && <Loader />}
    </Card>
  )
}
