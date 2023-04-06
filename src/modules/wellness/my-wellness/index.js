import React, { useState } from 'react';
import { Tab, TabWrapper } from '../../../components';
import { ModuleControl } from '../../../config/module-control';
import WellnessHeaps from '../../wellness-heaps/wellness-heaps';
// import Visit from '../visit';
import MyWellness from './my-wellness';

const isHero = ModuleControl.Heaps;

export const MyWellNess = () => {
  const [tab, setTab] = useState(isHero ? 'heaps' : "mywellness");
  return (
    <>
      {(isHero) && <TabWrapper width={"max-content"}>
        {isHero && <Tab
          isActive={Boolean(tab === "heaps")}
          onClick={() => setTab("heaps")}
        >
          Wellness Dashboard
        </Tab>}
        <Tab
          isActive={Boolean(tab === "mywellness")}
          onClick={() => setTab("mywellness")}
        >
          Other Value-Added Wellness Service
        </Tab>
      </TabWrapper>}
      {tab === "heaps" && <WellnessHeaps />}
      {tab === "mywellness" && <MyWellness />}
      {/* {tab === "visit" && <Visit />} */}

    </>
  )
}
