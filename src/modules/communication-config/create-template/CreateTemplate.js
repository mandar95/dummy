import React, { useState, useEffect } from 'react';

import { Email } from './Email';
// import { Email } from './Email2';
import { Sms } from './Sms';
import { TabWrapper, Tab } from "components";

import { useDispatch } from 'react-redux';
import { reset_template } from '../communication-config.slice';

export const Template = ({ _setTab }) => {

  const [tab, setTab] = useState("Email");
  const [files, setFiles] = useState([]);
  const dispatch = useDispatch();

  useEffect(() => {
    return () => { dispatch(reset_template()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (<>
    <TabWrapper width='max-content' className='mx-auto'>
      <Tab secondary isActive={Boolean(tab === "Email")} onClick={() => setTab("Email")}>Email Template</Tab>
      <Tab secondary isActive={Boolean(tab === "Sms")} onClick={() => setTab("Sms")}>SMS Template</Tab>
    </TabWrapper>

    {(tab === "Email") && <Email
      files={files}
      setFiles={setFiles} 
      _setTab={_setTab}
      />}
    {(tab === "Sms") && <Sms _setTab={_setTab}/>}
  </>)
}
