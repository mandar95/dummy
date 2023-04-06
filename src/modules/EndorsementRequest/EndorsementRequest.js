import React from "react";
import { useSelector } from "react-redux";
import BulkMember from "./bulkMember";
import AddMember2 from '../addmember2/addmember'
import { useParams } from 'react-router-dom';

const EndorsementRequest = ({ myModule }) => {
  const { userType } = useParams();

  const { currentUser } = useSelector((state) => state.login);

  // temp change
  return ['admin', 'broker'].includes(userType) ? <BulkMember
    brokerId={currentUser?.broker_id}
    // history={history}
    userType={userType}
    myModule={myModule} />
    : <AddMember2 myModule={myModule} />;
};

export default EndorsementRequest;
