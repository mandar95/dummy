import React, { useState, useEffect } from "react";

import { TabWrapper, Tab } from "components";
import User from "./User";
import Organization from "./Organization";

import { useDispatch, useSelector } from "react-redux";
import { getProfileDetails, profileDetails } from "../profileview.slice";

export default function ProfileviewOrganisation({ userType }) {

  const dispatch = useDispatch();
  let [tab, setTab] = useState('user');
  const profileData = useSelector(profileDetails);
  const { userType: userTypeName, currentUser } = useSelector(state => state.login);

  useEffect(() => {
    if (userTypeName)
      dispatch(getProfileDetails(Number(currentUser.profile_master) ? { id: currentUser.id, master_id: userTypeName === 'Broker' ? 3 : 4 } : {}));
    //eslint-disable-next-line
  }, [userTypeName]);


  return (
    <>
      {['Broker', 'Employer'].includes(userType) &&
        <TabWrapper width='max-content'>
          <Tab isActive={tab === 'user'} onClick={() => setTab('user')}>
            Personal
          </Tab>

          <Tab isActive={tab === 'organization'} onClick={() => setTab('organization')}>
            Organization
          </Tab>
        </TabWrapper>
      }

      {/* presonal details */}
      {tab === 'user' &&
        <User userData={profileData} userType={userType} currentUser={currentUser} userTypeName={userTypeName} />}

      {/* organization details */}
      {tab === 'organization' &&
        <Organization userData={profileData} userType={userType} currentUser={currentUser} userTypeName={userTypeName} />}

    </>
  );
};
