import React, { useEffect, useState } from 'react';
import swal from 'sweetalert';

import { Row, Col, Button } from 'react-bootstrap';
import { Card, Loader, NoDataFound, SelectComponent } from '../../../../components'
import { DataTable } from "../../../user-management";

import { useDispatch, useSelector } from 'react-redux';
import {
  // loadEmployer, clearEmployer,
  help, clear, loadQueriesComplaint, getOrganizationQuery, fetchQueryMasterTypes, setEmployeeQuery, setEmployeeSubQuery, setEmployeeComments
  // clear_queries_complaint
} from '../../help.slice';
import { QueryComplaintBroker, QueryComplaintBrokerOrg } from '../../helper';
import { AddQuery } from "./Modal";
import { DateFormate } from '../../../../utils';
import { useForm, Controller } from "react-hook-form";
import ExportModal from './ExportModal';


export const QueryComplaint = ({ myModule, employer }) => {
  const dispatch = useDispatch();
  const { loading, error, success, queries_complaint, allQueryMasterType, org_queries_complaint } = useSelector(help);

  // const [employeeId, setEmployeeId] = useState();
  const [show, setShow] = useState(false);
  const [showExportModal, setShowExportModal] = useState(false)
  const { control, watch/* , setValue */ } = useForm();
  const employeeId = watch('employer_id')?.value;

  useEffect(() => {
    dispatch(getOrganizationQuery())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success").then(() => {
        // setValue('employer_id', undefined)
        dispatch(loadQueriesComplaint(employeeId));
      });

    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);



  useEffect(() => {
    dispatch(fetchQueryMasterTypes())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);


  const getData = ([e]) => {
    if (e?.value) {
      dispatch(loadQueriesComplaint(e.value));

    }
    return e;
  }

  return (
    <>

      <Card title={<>
        <div className="d-flex justify-content-between">
          <span>Organization Queries & Complaints</span>
          <div>
            <Button size="sm" onClick={() => { setShow(true) }} className="shadow-sm m-1 rounded-lg">
              <strong>Register Query +</strong>
            </Button>
          </div>
        </div>
      </>
      }
      >
        {org_queries_complaint.length ?
          <DataTable
            columns={QueryComplaintBrokerOrg(myModule?.canwrite ? true : false, true, false)}
            data={org_queries_complaint ? org_queries_complaint.map((elem) => ({
              ...elem,
              raised_on: DateFormate(elem.raised_on),
              resolved_on: DateFormate(elem.resolved_on)
            })) : []}
            noStatus={true}
            // queryStatus
            // type={employeeId}
            rowStyle
          // isReply
          /> :
          <NoDataFound text={'No Queries or Complaint Found'} />}
      </Card>


      <Card title={<>
        <div className="d-flex justify-content-between">
          <span>Employees Queries & Complaints </span>
          <div>
            <Button size="sm" className="shadow m-1 rounded-lg" variant="dark"
              onClick={() => { setShowExportModal(true) }}
            >
              <strong><i className="ti-cloud-down"></i> Export</strong>
            </Button>
          </div>
        </div>
      </>
      }
      >
        <Row className="d-flex flex-wrap">
          <Col md={6} lg={6} xl={4} sm={12}>
            <Controller
              as={<SelectComponent
                label="Employer"
                placeholder='Select Employer'
                options={employer.map((item) => ({
                  id: item?.id,
                  label: item?.name,
                  value: item?.id,
                }))}
                id="employer_id"
                required
              />}
              onChange={getData}
              name="employer_id"
              control={control}
            />
          </Col>
        </Row>
        {queries_complaint.length ?
          <DataTable
            columns={QueryComplaintBroker(myModule?.canwrite ? true : false, false, employeeId)}
            data={queries_complaint ? queries_complaint.map((elem) => ({
              ...elem,
              raised_on: DateFormate(elem.raised_on),
              resolved_on: DateFormate(elem.resolved_on)
            })) : []}
            noStatus={true}
            // queryStatus
            // type={employeeId}
            rowStyle
          /> : !!employeeId &&
          <NoDataFound text='No Queries or Complaint Found' />}
      </Card>

      {!!show && <AddQuery
        show={show}
        onHide={() => {
          setShow(false);
          dispatch(setEmployeeQuery(''));
          dispatch(setEmployeeSubQuery(''));
          dispatch(setEmployeeComments(''));
        }}
      />}

      {!!showExportModal && <ExportModal
        show={showExportModal}
        employers={employer}
        allQueryMasterType={allQueryMasterType}
        onHide={() => {
          setShowExportModal(false);
        }}
        loading={loading}
        type={"query"}
        title={"Download Master Type Report"}
      />}

      {loading && <Loader />}
    </>
  )
}
