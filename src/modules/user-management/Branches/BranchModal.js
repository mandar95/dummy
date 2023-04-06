import React, { useEffect } from 'react';
import * as yup from "yup";

import { Modal, Row, Col, Button as Btn } from 'react-bootstrap';
import { Error, SelectComponent } from '../../../components';
import { DataTable } from '../'

import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { createEmployerBranch, deleteChildCompany, selectdropdownData, selectSuccess } from '../user.slice';


const validationSchema = yup.object().shape({
  child_employer_id: yup.object().shape({
    id: yup.string().required('Required'),
  }),
  // employer_code: yup.string().required().label('Employee Code Initial'),
})

export const BranchModal = ({ Data, onHide, show, employer_id, employer }) => {

  const dispatch = useDispatch();
  const { userType } = useSelector(state => state.login);
  const { control, handleSubmit, errors } = useForm({
    validationSchema
  });
  const dropDown = useSelector(selectdropdownData);

  // const [editMode, setEditMode] = useState((editData?.name && editData) || null);
  const success = useSelector(selectSuccess);

  // useEffect(() => {
  //   if (editMode && editMode.name) {
  //     reset({
  //       name: editMode.name,
  //       employer_code: editMode.employer_code
  //     })
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [editMode])


  useEffect(() => {
    if (success) {
      onHide()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])

  const onSubmit = ({ child_employer_id, employer_code }) => {
    // if (editMode) {
    //   dispatch(updateChildCompany({
    //     employer_child_company_id: editMode.id,
    //     name, employer_code
    //   }, employer && employer_id,
    //     userType))
    //   // setEditMode(null)
    //   // reset({ name: '' })
    // }
    // else {
    dispatch(createEmployerBranch({ child_employer_id: child_employer_id?.value, employer_id }, employer && employer_id, userType, onHide))
    // }
  };

  // const onEdit = (id, data) => {
  //   setEditMode(data);
  // };

  const onDelete = (id) => {
    dispatch(deleteChildCompany({ employer_child_company_id: id }, false, userType, onHide))
  };

  return (
    <Modal
      onHide={onHide}
      show={show}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Employer Sub Entities
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <form onSubmit={handleSubmit(onSubmit)}>
          <Row className='d-flex justify-content-center m-1 p-2 border'>
            <Col md={6} lg={6} xl={4} sm={12}>
              <Controller
                as={<SelectComponent
                  label={"Child Entity"}
                  placeholder={"Select Child Entity"}
                  options={dropDown.filter(({ id, name }) => !(employer_id === id || Data.some((elem) => elem.name === name))).map(({ name, id }) => ({ label: name, id, value: id }))}
                  id="drop"
                // valueName="name"
                // onChange={(data) => { if (data) setGetId(data) }}
                />}
                error={errors['child_employer_id']}
                control={control}
                name='child_employer_id'
              />
              {!!errors['child_employer_id'] && <Error>{errors['child_employer_id']?.message}</Error>}
            </Col>
            {/* <Col xl={4} lg={4} md={12} sm={12}>
              <Controller
                as={
                  <Input
                    label="Sub Entities Name"
                    placeholder="Select Sub Entities Name"
                    required={false}
                    isRequired={true}
                  />
                }
                error={errors['name']}
                control={control}
                name="name"
              />
              {!!errors['name'] && <Error>{errors['name']?.message}</Error>}
            </Col>
            <Col xl={4} lg={4} md={12} sm={12}>
              <Controller
                as={
                  <Input
                    label="Sub Entities Code Initials"
                    placeholder="Select Sub Entities Code Initials"
                    required={false}
                    isRequired={true}
                  />
                }
                error={errors['employer_code']}
                control={control}
                name="employer_code"
              />
              {!!errors['employer_code'] && <Error>{errors['employer_code']?.message}</Error>}
            </Col> */}
            <Col xl={4} lg={4} md={12} sm={12} className='d-flex justify-content-center align-items-center'>
              <Btn
                className="m-3"
                type="submit">
                Add +
              </Btn>
            </Col>
          </Row>
          {!!(Data.length) && <div style={{ margin: '0 27px' }}>
            <DataTable
              columns={Column()}
              data={Data}
              noStatus
              rowStyle
              // EditFlag
              // EditFunc={onEdit}
              deleteFlag={'custom_delete_action'}
              removeAction={onDelete}

              pageState={{ pageIndex: 0, pageSize: 3 }}
              pageSizeOptions={[3, 5, 10]}
            />
          </div>}

        </form>
      </Modal.Body>
    </Modal>
  );
}

const Column = () => [
  {
    Header: "Sub Entities Name",
    accessor: "name",
  },
  // {
  //   Header: "Sub Entities Initials",
  //   accessor: "employer_code",
  // },
  {
    Header: "Operations",
    accessor: "operations",
    // Cell: _renderEdit
  }
]

