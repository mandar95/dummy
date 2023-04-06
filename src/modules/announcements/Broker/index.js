import React, { useEffect, useState } from 'react';
import { TabWrapper, Tab } from "../../../components";

import { Config } from "./broker-config";
import { Notification } from "./notification-config";
import { useLocation, useParams } from "react-router";

export const NotificationConfig = ({ myModule }) => {
    const [trigger, setTrigger] = useState(true);
    const { userType } = useParams();
    const location = useLocation();
    const query = new URLSearchParams(location.search);
    const type = query.get("type")

    useEffect(()=>{
        if(type === 'notification'){
            setTrigger(false)   
        }
    },[type])

    return (
        <>
            {(['admin', 'broker'].includes(userType)) &&
                <TabWrapper width={'max-content'}>
                    <Tab isActive={trigger} onClick={() => setTrigger(true)}>
                        Announcement Configurator
                    </Tab>
                    <Tab isActive={!trigger} onClick={() => setTrigger(false)}>
                        Notification
                    </Tab>
                </TabWrapper>
            }
            {trigger &&
                <Config myModule={myModule} />
            }
            {!trigger &&
                <Notification myModule={myModule} />
            }
        </>
    )
}
