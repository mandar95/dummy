import React, { useEffect, useState } from 'react'
import { Button } from 'react-bootstrap';
import swal from 'sweetalert';

import { TabWrapper, Tab, Card, Loader } from '../../../components'
import Table from './Table';

import { useDispatch, useSelector } from "react-redux";
import { loadTemplates, clearState, loadDynamicKeys } from '../EndorsementRequest.slice';
import { useHistory, useParams } from 'react-router';

export const link = {
  'Endorsement Member Addition': 'add',
  'Endorsement Member Removal': 'remove',
  'Endorsement Member Correction': 'correct',
  'TPA Member': 'member-sheet',
  'TPA Claim': 'claim',
  'Intimate Claim': 'intimate-claim-sheet',
  'Submit Claim': 'submit-claim-sheet',
  'Network Hospital': 'netwrok-hospital-sheet',
  'Enrolment Export': 'report-enrolment',
  'TPA Claim Export': 'tpa-claim-export',
  'GPA Claim': 'gpa-claim',
  'GPA Claim Export': 'gpa-claim-export',
  'Employee Addition': 'employee-addition',
  'Employee Removal': 'employee-removal',
  'Employee Correction': 'employee-correction',
  'GTL Claim Import': 'gtl-import',
  'GTL Claim Export': 'gtl-export',
}
const reverseLink = {
  'add': 'Endorsement Member Addition',
  'remove': 'Endorsement Member Removal',
  'correct': 'Endorsement Member Correction',
  'member-sheet': 'TPA Member',
  'claim': 'TPA Claim',
  'intimate-claim-sheet': 'Intimate Claim',
  'submit-claim-sheet': 'Submit Claim',
  'netwrok-hospital-sheet': 'Network Hospital',
  'report-enrolment': 'Enrolment Export',
  'tpa-claim-export': 'TPA Claim Export',
  'gpa-claim': 'GPA Claim',
  'gpa-claim-export': "GPA Claim Export",
  'employee-addition': "Employee Addition",
  'employee-removal': "Employee Removal",
  'employee-correction': "Employee Correction",
  'gtl-import': 'GTL Claim Import',
  'gtl-export': 'GTL Claim Export'
}

const types = {
  'Endorsement Member Addition': 1,
  'Endorsement Member Removal': 2,
  'Endorsement Member Correction': 3,
  'TPA Member': 4,
  'TPA Claim': 5,
  'Intimate Claim': 6,
  'Submit Claim': 7,
  'Network Hospital': 8,
  'Enrolment Export': 9,
  'TPA Claim Export': 10,
  'GPA Claim': 14,
  "GPA Claim Export": 15,
  "Employee Addition": 21,
  "Employee Removal": 22,
  "Employee Correction": 23,
  "GTL Claim Import": 25,
  "GTL Claim Export": 26
}

export default function CustomiseSheet() {

  const { modules } = useSelector(state => state.login);
  const history = useHistory();
  const [myModule, setMyModule] = useState([]);
  useEffect(() => {
    if (modules) {
      const thisModule = modules?.find((elem) => elem.url.includes('/endorsement-sheets/'))
      if (!thisModule?.canread
      ) {
        history.replace('/home')
      } else {
        setMyModule(thisModule)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules])


  const dispatch = useDispatch()
  const { type, userType } = useParams();
  const [tab, setTab] = useState('Endorsement Member Addition');
  const [data, setData] = useState([]);
  const { templates, loading, success, error, dynamicKeys } = useSelector((state) => state.endorsementRequest);

  // NOTE: on load api call
  useEffect(() => {
    dispatch(loadTemplates());
    dispatch(loadDynamicKeys());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (tab !== reverseLink[type])
      setTab(reverseLink[type])
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type])

  useEffect(() => {
    if (templates.length) {
      setData(templates.filter(({ default_format_id }) => types[tab] === default_format_id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [templates, tab])

  useEffect(() => {
    if (success) {
      swal('Success', success, "success");
      dispatch(loadTemplates())
    }
    if (error) {
      swal("Alert", error, "warning")
    }

    return () => {
      dispatch(clearState())
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error])


  return (
    <>
      <TabWrapper width="max-content">
        <Tab
          isActive={Boolean(tab === "Endorsement Member Addition")}
          onClick={() => {
            setTab("Endorsement Member Addition")
            history.replace(link["Endorsement Member Addition"])
          }}>
          Addition
        </Tab>
        {dynamicKeys.some(({ id }) => id === 2) && <Tab
          isActive={Boolean(tab === "Endorsement Member Removal")}
          onClick={() => {
            setTab("Endorsement Member Removal")
            history.replace(link["Endorsement Member Removal"])
          }}>
          Removal
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 3) && <Tab
          isActive={Boolean(tab === "Endorsement Member Correction")}
          onClick={() => {
            setTab("Endorsement Member Correction")
            history.replace(link["Endorsement Member Correction"])
          }}>
          Correction
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 4) && <Tab
          isActive={Boolean(tab === "TPA Member")}
          onClick={() => {
            setTab("TPA Member")
            history.replace(link["TPA Member"])
          }}>
          TPA Member
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 5) && <Tab
          isActive={Boolean(tab === "TPA Claim")}
          onClick={() => {
            setTab("TPA Claim")
            history.replace(link["TPA Claim"])
          }}>
          TPA Claim
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 6) && <Tab
          isActive={Boolean(tab === "Intimate Claim")}
          onClick={() => {
            setTab("Intimate Claim")
            history.replace(link["Intimate Claim"])
          }}>
          Intimate Claim
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 7) && <Tab
          isActive={Boolean(tab === "Submit Claim")}
          onClick={() => {
            setTab("Submit Claim")
            history.replace(link["Submit Claim"])
          }}>
          Submit Claim
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 8) && <Tab
          isActive={Boolean(tab === "Network Hospital")}
          onClick={() => {
            setTab("Network Hospital")
            history.replace(link["Network Hospital"])
          }}>
          Network Hospital
        </Tab>}
        {/* </TabWrapper>

      <TabWrapper width="max-content"> */}
        {dynamicKeys.some(({ id }) => id === 9) && <Tab
          isActive={Boolean(tab === "Enrolment Export")}
          onClick={() => {
            setTab("Enrolment Export")
            history.replace(link["Enrolment Export"])
          }}>
          Enrolment Export
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 10) && <Tab
          isActive={Boolean(tab === "TPA Claim Export")}
          onClick={() => {
            setTab("TPA Claim Export")
            history.replace(link["TPA Claim Export"])
          }}>
          TPA Claim Export
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 14) && <Tab
          isActive={Boolean(tab === "GPA Claim")}
          onClick={() => {
            setTab("GPA Claim")
            history.replace(link["GPA Claim"])
          }}>
          GPA Claim
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 15) && <Tab
          isActive={Boolean(tab === "GPA Claim Export")}
          onClick={() => {
            setTab("GPA Claim Export")
            history.replace(link["GPA Claim Export"])
          }}>
          GPA Claim Export
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 21) && <Tab
          isActive={Boolean(tab === "Employee Addition")}
          onClick={() => {
            setTab("Employee Addition")
            history.replace(link["Employee Addition"])
          }}>
          Employee Addition
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 22) && <Tab
          isActive={Boolean(tab === "Employee Removal")}
          onClick={() => {
            setTab("Employee Removal")
            history.replace(link["Employee Removal"])
          }}>
          Employee Removal
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 23) && <Tab
          isActive={Boolean(tab === "Employee Correction")}
          onClick={() => {
            setTab("Employee Correction")
            history.replace(link["Employee Correction"])
          }}>
          Employee Correction
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 25) && <Tab
          isActive={Boolean(tab === "GTL Claim Import")}
          onClick={() => {
            setTab("GTL Claim Import")
            history.replace(link["GTL Claim Import"])
          }}>
          GTL Claim Import
        </Tab>}
        {dynamicKeys.some(({ id }) => id === 26) && <Tab
          isActive={Boolean(tab === "GTL Claim Export")}
          onClick={() => {
            setTab("GTL Claim Export")
            history.replace(link["GTL Claim Export"])
          }}>
          GTL Claim Export
        </Tab>}
      </TabWrapper>


      <Card title={
        <div className="d-flex justify-content-between">
          <span>{tab}</span>
          {!!myModule?.canwrite && <div>
            <Button type="button" size='sm' onClick={() => { history.push('/broker/endorsement-sheet-create/' + link[tab]) }}>
              Create New +
            </Button>
            {/* <Button type="button" size='sm' onClick={() => { history.push('/broker/report-enrolment') }}>
              Create New +
            </Button> */}
          </div>}
        </div>
      }>
        <Table myModule={myModule} data={data} history={history} dispatch={dispatch} tab={tab} userType={userType} />
      </Card>
      {loading && <Loader />}
    </>
  )
}
