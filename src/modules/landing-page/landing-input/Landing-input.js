import React, { useState } from 'react';

import { TabWrapper, Tab } from "../../../components";

import { BrokerInput } from "./Broker-input";
import { EmployerInput } from "./Employer-input";

export const LandingPageInput = () => {
  const [trigger, setTrigger] = useState(true);
  return (
    <>
      <TabWrapper width={'max-content'}>
        <Tab isActive={trigger} onClick={() => setTrigger(true)}>
          Broker
          </Tab>
        <Tab isActive={!trigger} onClick={() => setTrigger(false)}>
          Employer
          </Tab>
      </TabWrapper>
      {trigger &&
        <BrokerInput />
      }
      {!trigger &&
        <EmployerInput />
      }
    </>
  )
}
