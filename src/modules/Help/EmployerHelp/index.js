import React, { useState, useEffect } from 'react';
import { EmployerFAQs, EmployerQueries, EmployerFeedback, help } from '../help.slice'
import { useDispatch, useSelector } from 'react-redux';
import { FAQs } from './employer.faqs';
import { Feedback } from './employer.feedback';
import { Queries } from './employer.queries';
import { TabWrapper, Tab } from '../../../components'

export const HelpEmployer = ({ myModule, validation }) => {
  const [tab, setTab] = useState("FAQs");
  const dispatch = useDispatch();
  const { employerFAQs, employerQueries, employerFeedback } = useSelector(help);
  const { currentUser } = useSelector(state => state.login);

  useEffect(() => {
    if(currentUser.employer_id){
      dispatch(EmployerFAQs(currentUser.is_super_hr));
      dispatch(EmployerQueries(currentUser.is_super_hr));
      dispatch(EmployerFeedback(currentUser.is_super_hr));
    }
    // eslint-disable-next-line
  }, [currentUser])

  return <>
    {/* <Paper>
            <div className="row">
                <div className="col-lg-10 mt-2>
                    Lorem Ipsum Lorem Ipsum,
                    Lorem Sipum Lorem Ipsum,
                    You Can Enter Your Retail Policy Details,
                    This Help You To Manage All Your Insurance Cover Under One Roof.
            </div>
                <div className="col-lg-2">
                    <img src="/assets/images/bal-policy.png" width={100} alt="" />
                </div>
            </div>
        </Paper> */}
    <TabWrapper width='max-content'>
      <Tab isActive={Boolean(tab === "FAQs")} onClick={() => setTab("FAQs")} className="d-block">FAQs</Tab>
      {/* <Tab isActive={Boolean(tab === "FAQs")} onClick={() => setTab("FAQs")} className="d-md-none d-sm-block">1</Tab> */}
      <Tab isActive={Boolean(tab === "Queries & Complaints")} onClick={() => setTab("Queries & Complaints")} className="d-block">Queries & Complaints</Tab>
      {/* <Tab isActive={Boolean(tab === "Queries & Complaints")} onClick={() => setTab("Queries & Complaints")} className="d-md-none d-sm-block">2</Tab> */}
      <Tab isActive={Boolean(tab === "Feedback")} onClick={() => setTab("Feedback")} className="d-block">Feedback</Tab>
      {/* <Tab isActive={Boolean(tab === "Feedback")} onClick={() => setTab("Feedback")} className="d-md-none d-sm-block">3</Tab> */}
    </TabWrapper>
    {tab === "FAQs" && <FAQs data={employerFAQs} />}
    {tab === "Queries & Complaints" && <Queries data={employerQueries} myModule={myModule} />}
    {tab === "Feedback" && <Feedback Data={employerFeedback} validation={validation} />}
  </>
}
