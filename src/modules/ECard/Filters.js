import React from "react";
import Card from "../../components/GlobalCard/Card";
import { Row, Col } from 'react-bootstrap';
import {
  SelectComponent,
  // Input, Button
} from "../../components";
import { Controller } from "react-hook-form";

const Filters = (props) => {


  return props?.userType === 'employee' ? (
    <Card title="E-Card" round>
      <Row>

        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
          <Controller
            as={<SelectComponent
              name='policy_name'
              label="Policy Name"
              placeholder="Select Policy Name"
              required
              options={props.PolicyType?.filter(({ policy_sub_type_id }) => [1, 4].includes(policy_sub_type_id))?.map(item => (
                {
                  id: item.policy_id,
                  label: `${item.policy_name}:${item.policy_number}`,
                  value: item.policy_id
                }
              )) || []}
            />}
            onChange={props.getEmployeeId}
            name="policy_id"
            control={props.control}
            defaultValue={""}
          />
        </Col>
        <Col xs={12} sm={12} md={12} lg={4} xl={4}>
          {!!(props.MemberData?.length > 1) &&
            <Controller
              as={<SelectComponent
                label="Member Name"
                placeholder="Select Member Name"
                required={false}
                options={props.MemberData?.map(item => (
                  {
                    id: item.member_id,
                    label: item.name,
                    value: item.member_id
                  }
                )) || []}
              />}
              onChange={props.getMemberDetails}
              name="member_id"
              control={props.control}
              defaultValue={""}
              isClearable
            />}
        </Col>
      </Row>
    </Card >
  ) :
    (
      <Card title="E-Card" round>
        <Row>
          {(props?.userType === "admin") &&
            <Col xs={12} sm={12} md={12} lg={4} xl={4}>
              <Controller
                as={
                  <SelectComponent
                    label="Broker"
                    placeholder="Select Broker"
                    required
                    options={props?.broker?.map(item => (
                      {
                        id: item.id,
                        label: item.name,
                        value: item.id
                      }
                    )) || []}
                  />}
                onChange={props?.getAdminEmployer}
                name="broker_id"
                control={props.control}
                defaultValue={""}
              />
            </Col>
          }
          {['admin', 'broker'].includes(props?.userType) && <Col xs={12} sm={12} md={12} lg={4} xl={4}>
            <Controller
              as={
                <SelectComponent
                  name='employer'
                  label="Employer"
                  placeholder="Select Employer"
                  required
                  options={props?.Employerdata?.map(item => (
                    {
                      id: item.id,
                      label: item.name,
                      value: item.id
                    }
                  )) || []}
                />}
              // onChange={props?.getEmployerId}
              name="employer_id"
              control={props.control}
              defaultValue={""}
            />
          </Col>}
          {!!(props.currentUser.is_super_hr && props.currentUser.child_entities.length) &&
            <Col xs={12} sm={12} md={12} lg={4} xl={4}>
              <Controller
                as={
                  <SelectComponent
                    name='employer'
                    label="Employer"
                    placeholder="Select Employer"
                    required
                    options={props.currentUser.child_entities.map(item => (
                      {
                        id: item.id,
                        label: item.name,
                        value: item.id
                      }
                    )) || []}
                  />}
                defaultValue={{ id: props.currentUser.employer_id, value: props.currentUser.employer_id, label: props.currentUser.employer_name }}
                // onChange={props?.getEmployerId}
                name="employer_id"
                control={props.control}
              />
            </Col>}
          {/* {(['admin', 'broker'].includes(props?.userType) || !!(props.currentUser.is_super_hr && props.currentUser.child_entities.length)) &&
            <Col xs={12} sm={12} md={12} lg={1} xl={1} className='text-center'></Col>} */}
          <Col xs={12} sm={12} md={12} lg={4} xl={4}>
            <Controller
              as={<SelectComponent
                name='policy_name'
                label="Policy Name"
                placeholder="Select Policy Name"
                required
                options={props.PolicyType?.map(item => (
                  {
                    id: item.policy_id,
                    label: item.policy_no,
                    value: item.policy_id
                  }
                )) || []}
              />}
              // onChange={props.getPolicyTypeId}
              name="policy_id"
              control={props.control}
              defaultValue={""}
            />
          </Col>
          {/* </Row>

        <Row> */}
          <Col xs={12} sm={12} md={12} lg={4} xl={4}>
            <Controller
              as={<SelectComponent
                label="Employee Name : Code"
                placeholder="Select Employee"
                required={false}
                options={props.EmployeeData?.map(item => (
                  {
                    id: item.employee_id,
                    label: item.employee_name + ' : ' + item.employee_code,
                    value: item.employee_id
                  }
                )) || []}
              />}
              // onChange={props.getEmployeeId}
              name="employee_id"
              control={props.control}
              defaultValue={""}
            />
          </Col>

          {/* <Col xs={12} sm={12} md={12} lg={1} xl={1} className='d-flex justify-content-center align-items-center'> OR</Col>
          <Col xs={12} sm={12} md={12} lg={4} xl={4}>
            <Input name="employee_code" label="Employee Code" value={props.employee_code} onChange={(e) => {
              props.setEmployee_code(e.target.value);
              props.setValue('employee_id', '');
            }} placeholder="Employee Code" />
          </Col>
          <Col xs={12} sm={12} md={12} lg={3} xl={3} className="d-flex justify-content-center align-items-center mb-3">
            <Button type="button" onClick={props.getFromEmployeeCode}>Submit</Button>
          </Col> */}
          {/* </Row>
        <Row> */}
          <Col xs={12} sm={12} md={12} lg={4} xl={4}>
            {!!(props.MemberData?.length > 1) &&
              <Controller
                as={<SelectComponent
                  label="Member Name"
                  placeholder="Select Member Name"
                  required={false}
                  options={props.MemberData?.map(item => (
                    {
                      id: item.member_id,
                      label: item.name,
                      value: item.member_id
                    }
                  )) || []}
                />}
                onChange={props.getMemberDetails}
                name="member_id"
                control={props.control}
                defaultValue={""}
                isClearable
              />}
          </Col>
        </Row>
      </Card >
    );
};

export default Filters;
