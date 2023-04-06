import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Loader } from 'components';
import Bounce from 'react-reveal/Bounce';
import DetailCard from "./DetailCard";
import DetailCard2 from "modules/flexbenefit/DetailCard.js";

import { Container, TabContainer } from "./style";
import ControlledTabs from './tabs';
import { Row } from "react-bootstrap";
import {
  getWidgetData, selectWidgetResponse, getUtilizationData, selectUtilizationResponse, selectEmployerFB, selectEmployerWidget, filterStatus,
  loadingStatus, disableloading,
  downloadExcelData,
  cleardownloadResponse
} from './flexbenefit.slice'
import { EmployerFilter } from "./Employer.filter"
// import swal from "sweetalert";
import styled from 'styled-components';
import { downloadFile } from 'utils';
import { useParams } from "react-router";


export const BrokerFlexBenefit = () => {
  const dispatch = useDispatch();
  const { getDownloadExcelData } = useSelector(state => state.flexbenefitBroker);
  const WidgetResponse = useSelector(selectWidgetResponse)
  const UtilizationResponse = useSelector(selectUtilizationResponse)
  const EmployerFB = useSelector(selectEmployerFB)
  const EmployerWidget = useSelector(selectEmployerWidget);
  const filterstatus = useSelector(filterStatus);
  const loadingstatus = useSelector(loadingStatus);
  const { userType } = useParams();
  const [empID, setEmpID] = useState(null);
  const { currentUser } = useSelector(state => state.login);


  useEffect(() => {
    dispatch(getWidgetData())
    dispatch(getUtilizationData())
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    let timer_id;
    if (EmployerFB.length > 0 && filterstatus) {
      timer_id = setTimeout(() => {
        dispatch(disableloading())
      }, 200)
    }

    if (EmployerFB.length <= 0 && filterstatus) {
      timer_id = setTimeout(() => {
        dispatch(disableloading())
        // swal("No flex utilisation found.", "", "warning").then((value) => {

        // window.location.reload();

        // });
      }, 400)
    }
    return () => clearTimeout(timer_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [EmployerFB, filterStatus])

  useEffect(() => {
    if (getDownloadExcelData) {
      downloadFile(getDownloadExcelData, '', false)
    }
    return () => { dispatch(cleardownloadResponse()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDownloadExcelData])

  const downloadAction = () => {
    dispatch(downloadExcelData({ employer_id: empID || currentUser.employer_id }))
  }

  return (
    <Container>
      {loadingstatus && <BlurContainer />}

      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <Flex>
          <Bounce right>
            {userType !== 'employer' ?
              <DetailCard widgetData={filterstatus ? EmployerWidget : WidgetResponse?.data?.data} /> :
              <DetailCard2 widgetData={filterstatus ? EmployerWidget : WidgetResponse?.data?.data} />
            }
          </Bounce>
          <Bounce right>
            <EmployerFilter userType={userType} setEmpID={setEmpID} />
          </Bounce>
        </Flex>
        {((empID && (filterstatus ? EmployerFB.length : UtilizationResponse?.data?.data?.length)) || userType === 'employer') &&
          < Row style={{
            borderTop: '1px solid #dadada',
            padding: '5px 0px',
            display: 'flex',
            justifyContent: 'center'
          }}>
            <div>
              <DownloadBtn
                onClick={downloadAction}
              ><i className="fa fa-file-download" style={{ marginRight: '8px' }}></i>Download Excel</DownloadBtn>
            </div>
          </Row>
        }
        {!!(filterstatus ? EmployerFB?.length : UtilizationResponse?.data?.data?.length) && <TabContainer>

          {!loadingstatus && <ControlledTabs FlexData={filterstatus ? EmployerFB : UtilizationResponse?.data?.data} />}
        </TabContainer>}
      </div>
      {
        loadingstatus &&
        <Loader />
      }
    </Container >
  );
};
const Flex = styled.div`
display : flex;
width : 100%;
  flex-wrap : wrap-reverse;
`;


const BlurContainer = styled.div`
position : fixed;
width : 100%;
height : 100vh;
z-index : 500;
opacity : 0.1;
background-color : #272727;
`
const DownloadBtn = styled.div`
color: white;
padding: 5px 20px;
border-radius: 3px;
cursor: pointer;

margin-right: 16px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
height: 29px;
background: ${({ theme }) => theme.Tab?.color || "#e11a22"};
`;
