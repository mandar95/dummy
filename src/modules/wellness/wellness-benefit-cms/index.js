import React, { useState } from 'react';
import { useParams } from 'react-router';
import { TabWrapper, Tab } from "../../../components";

import WellnessCMS from "./wellness-benefit-cms";
import WellnessStaticContent from "./wellness-static-content";


export const WellnessCMSConfig = ({ myModule }) => {
    const [trigger, setTrigger] = useState(true);
    const { userType } = useParams();


    return (
        <>
            {(userType === "admin" || userType === "broker") &&
                <TabWrapper width={'max-content'}>
                    <Tab isActive={trigger} onClick={() => setTrigger(true)}>
                        Wellness Benefit CMS
                   </Tab>
                    <Tab isActive={!trigger} onClick={() => setTrigger(false)}>
                        Wellness Benefit Seasonal Content
                    </Tab>
                </TabWrapper>
            }
            {trigger &&
                <WellnessCMS
                    userType={userType}
                    myModule={myModule} />
            }
            {!trigger &&
                <WellnessStaticContent
                    userType={userType}
                    myModule={myModule} />
            }
        </>
    )
}
