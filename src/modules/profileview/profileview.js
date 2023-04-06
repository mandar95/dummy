import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Spinner, Row, Col } from "react-bootstrap";
// import { useMediaPredicate } from "react-media-hook";

import AddBankDetails from "./bankdetails/AddBankDetails0";
import ShowBankDetails from "./bankdetails/ShowBankDetails";
import ShowPersonalDetails from "./personaldetails/ShowPersonalDetails";
import AddMemberDetails from "./memberdetails/addmemberdetails";
import { TabWrapper, Tab, Loader } from "../../components";

import { useDispatch, useSelector } from "react-redux";
import { getProfileDetails, profileDetails } from "./profileview.slice";
import { ModuleControl } from "../../config/module-control";

const Profileview = () => {
  let [addBank, setaddBank] = useState(false);
  let [personDetails, setSDetails] = useState({});
  let [tab, setTab] = useState(true);
  // const smallerThan420 = useMediaPredicate("(max-width: 420px)");
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.profile);
  const profile = useSelector(profileDetails);
  const { userType, currentUser } = useSelector(state => state.login);

  useEffect(() => {
    if (currentUser.id)
      dispatch(getProfileDetails({ id: currentUser.id, master_id: 5 }));
    //eslint-disable-next-line
  }, [currentUser]);

  useEffect(() => {
    if (!!profile) {
      setSDetails({ personDetails: profile });
    }
  }, [profile]);

  // if data send props to component - fix  , sent all state to parent
  let bankdetailsExists;
  if (personDetails.personDetails) {
    bankdetailsExists = personDetails.personDetails.employee_account_no;
  }

  // control add bank details input component
  let closeAddBankComponent = () => {
    setaddBank(() => !addBank);
    //
  };

  return (
    <ProfileviewBox>
      {userType === 'Employee' &&
        <TabWrapper width='max-content'>
          <Tab isActive={tab} onClick={() => setTab(true)}>
            View Profile
          </Tab>

          {/* <Tab isActive={!tab} onClick={() => setTab(false)}>
              Add Member
            </Tab> */}
        </TabWrapper>}
      <Container>
        {/* presonal details */}
        {tab &&
          (personDetails.personDetails ? (
            <ShowPersonalDetails
              personDetails={personDetails}
              onClickAddBD={closeAddBankComponent}
              addBank={addBank}
              userType={userType}
            />
          ) : (
            <Spinner animation="border" variant="primary" />
          ))}

        {/* bank detailes */}
        {(tab && !ModuleControl.isTATA /* No Bank Detail */) ? (
          <>
            {bankdetailsExists && !addBank ? (
              <ShowBankDetails personDetails={personDetails} />
            ) : addBank ? (
              <Row>
                <Col className="col-md-12 d-flex justify-content-center">
                  <AddBankDetails
                    personDetails={personDetails}
                    closeAddBankComponent={closeAddBankComponent}
                  />
                </Col>
              </Row>
            ) : null}
          </>
        ) : (
          <noscript />
        )}

        {!tab && <AddMemberDetails />}
      </Container>
      {loading && <Loader />}
    </ProfileviewBox>
  );
};

export default Profileview;

let ProfileviewBox = styled.div`
  background-color: #f3f8fb;
  min-height: 100vh;
  background: url("/assets/images/bg-4.png") no-repeat bottom right;
`;

let Container = styled.div`
  padding: 1rem;
  min-width: 200px;
`;

// useEffect(async () => {
//   // const getData = await httpClient('/admin/user');
//   // (getData);
//   dispatch(getProfileDetails())
//   if (getData) {
//     setSDetails({ personDetails: getData.data.data[0] });
//   }
//   return true;
// }, []);

// axios.defaults.headers.common["Authorization"] =
//   "Bearer NAS8SloVgzlR7pnqXc9vjx3QYEKn7ZiTCjkR38GbE1jFR3Nusr13BeoRt8Gw";
