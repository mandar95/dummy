import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Button, Error, DatePicker, SelectComponent } from "components";
import {
  getPoliciesData,
  selectPolicyData,
} from "../dashboard_broker/dashboard_broker.slice";
import * as yup from "yup";
import { DateFormate } from 'utils'
import { format } from 'date-fns'
import { Prefill } from "../../../custom-hooks/prefill";

/*----------validation schema----------*/
const validationSchema = yup.object().shape({
  till_date: yup.string().required("Please enter End Date"),
  from_date: yup.string().required("Please enter Start Date"),
  policy_id: yup.object().shape({
    id: yup.string().required('Please select Policy'),
  }).nullable(),
});
/*----x-----validation schema-----x----*/

const Filters = (props) => {
  //Selectors
  const dispatch = useDispatch();
  const { handleSubmit, control, errors, setValue, watch } = useForm({ validationSchema });
  const PolicyData = useSelector(selectPolicyData);
  const { userType } = useSelector((state) => state.login);
  const [empId, setEmpId] = useState(null);

  const policyId = watch('policy_id')?.value;
  const from_date = watch('from_date') || '';

  //state for responses

  const [policyresp, setPolicyResp] = useState([]);
  //Api calls  --------

  useEffect(() => {
    if (props.employerId) {
      setEmpId(props.employerId);
    }
  }, [props.employerId]);

  useEffect(() => {
    if (props.employerId) {
      const data = { employer_id: empId, user_type_name: userType };
      dispatch(getPoliciesData(data));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [empId]);

  useEffect(() => {
    if (PolicyData?.data?.status === true) {
      setPolicyResp(PolicyData?.data?.data);
      setValue([
        { policy_id: undefined },
        { till_date: "" },
        { from_date: "" }
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PolicyData]);

  useEffect(() => {
    if (policyId) {
      const policy = PolicyData?.data?.data?.find(({ id }) => id === Number(policyId));
      props.setPolicyType(policyId);
      setValue([
        { till_date: DateFormate(policy?.policy_end_date || '', { dateFormate: true }) || "" },
        { from_date: DateFormate(policy?.policy_start_date || '', { dateFormate: true }) || "" }
      ])
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyId])

  //---------------------------------

  // Prefill 
  Prefill(policyresp, setValue, 'policy_id', 'policy_number')


  return (
    <form onSubmit={handleSubmit(props.getData)}>
      <Row className={'d-flex flex-wrap'}>
        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
          <Controller
            as={
              <SelectComponent
                label="Policy Name"
                placeholder="Select Policy Name"
                required={false}
                isRequired={true}
                options={policyresp?.map((item) => ({
                  id: item?.id,
                  label: item?.policy_number,
                  value: item?.id,
                })) || []}
                error={errors?.policy_id?.id}
              />
            }
            name="policy_id"
            control={control}
          />
          {!!errors?.policy_id?.id && <Error>{errors?.policy_id?.id?.message}</Error>}
        </Col>
        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
          <Controller
            as={
              <DatePicker
                minDate={new Date(DateFormate(/* policy.start_date ||  */'01-01-1900', { dateFormate: true }))}
                maxDate={new Date(DateFormate(/*till_date  || policy.end_date  ||*/ '01-01-2200', { dateFormate: true }))}
                name={'from_date'}
                label={'Date Range From'}
                required={false}
                isRequired
                error={errors && errors?.from_date}
              />
            }
            onChange={([selected]) => {
              setValue('till_date', '')
              return selected ? format(selected, 'dd-MM-yyyy') : '';
            }}
            name="from_date"
            control={control}
          />
          {!!errors?.from_date && <Error>{errors?.from_date?.message}</Error>}
        </Col>
        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
          <Controller
            as={
              <DatePicker
                minDate={new Date(DateFormate(from_date /* || policy.start_date */ || '01-01-1900', { dateFormate: true }))}
                maxDate={new Date(DateFormate(/* policy.end_date || */ '01-01-2200', { dateFormate: true }))}
                name={'till_date'}
                label={'Date Range To'}
                required={false}
                isRequired
                error={errors && errors?.till_date}
              />
            }
            onChange={([selected]) => {
              return selected ? format(selected, 'dd-MM-yyyy') : '';
            }}
            name="till_date"
            control={control}
          />
          {!!errors?.till_date && <Error>{errors?.till_date?.message}</Error>}
        </Col>
      </Row>
      <div
        style={{
          display: "flex",
          justifyContent: "flex-end",
        }}
      >
        <Button type="submit">Next</Button>
      </div>
    </form>
  );
};
export default Filters;
