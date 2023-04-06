import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col } from "react-bootstrap";
import { Controller, useForm } from "react-hook-form";
import { Select, Input, Button, Error } from "components";
import { FieldContainer } from "./style";
import {
  getPoliciesData,
  selectPolicyData,
  getEmployerData,
  selectEmployerData,
} from "./dashboard_admin.slice";
import * as yup from "yup";

/*----------validation schema----------*/
const validationSchema = yup.object().shape({
	till_date: yup.string().required("Please enter End Date"),
	from_date: yup.string().required("Please enter Start Date"),
	employer_id: yup.string().required("Please select Employer"),
	policy_id: yup.string().required("Please select Policy"),
});
/*----x-----validation schema-----x----*/

const Filters = (props) => {
  //Selectors
  const dispatch = useDispatch();
  const { handleSubmit, control, errors } = useForm({ validationSchema });
  const PolicyData = useSelector(selectPolicyData);
  const EmployerData = useSelector(selectEmployerData);
  const [empId, setEmpId] = useState(null);

  //Api calls  --------
  useEffect(() => {
    dispatch(getEmployerData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const data = { employer_id: empId };
    dispatch(getPoliciesData(data));
  }, [empId, dispatch]);
  //---------------------------------

  return (
    <FieldContainer>
      <form onSubmit={handleSubmit(props.getData)}>
        <Row className={'d-flex flex-wrap'}>
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Controller
              as={
                <Select
                  label="Employer"
                  placeholder="Select Employer"
                  required={false}
									isRequired={true}
                  options={EmployerData?.data?.data?.map((item) => ({
                    id: item?.id,
                    name: item?.company_name,
                    value: item?.id,
                  }))}
                />
              }
              onChange={([selected]) => {
                setEmpId(selected.target.value);
                return selected;
              }}
              name="employer_id"
              control={control}
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Controller
              as={
                <Select
                  label="Policy Name"
                  placeholder=" Select Policy Name"
                  required={false}
									isRequired={true}
                  options={PolicyData?.data?.data?.map((item) => ({
                    id: item?.id,
                    name: `${item.policy_number}`,
                    value: item?.id,
                  })) || []}
                />
              }
              onChange={([selected]) => {
                props.getTypeId(selected);
                return selected;
              }}
              name="policy_id"
              control={control}
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Controller
              as={<Input type="date" label="Date Range From" />}
              name="from_date"
              control={control}
            />
          </Col>
          <Col xs={12} sm={12} md={6} lg={4} xl={3}>
            <Controller
              as={<Input type="date" label="Date Range To" />}
              name="till_date"
              control={control}
            />
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
    </FieldContainer>
  );
};
export default Filters;
