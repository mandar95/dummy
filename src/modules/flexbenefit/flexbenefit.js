import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import DetailCard from "./DetailCard";
import { Container, TabContainer } from "./style";
import ControlledTabs from "./tabs";
import { Row } from "react-bootstrap";
import {
  getWidgetData,
  selectWidgetResponse,
  getUtilizationData,
  selectUtilizationResponse,
} from "./flexbenefit.slice";

import {
  downloadExcelData,
  cleardownloadResponse
} from 'modules/flexbenefit/broker_view_flex/flexbenefit.slice'

import styled from 'styled-components';
import { downloadFile } from 'utils';

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


export const EmployerFlexBenefit = () => {
  const dispatch = useDispatch();
  const WidgetResponse = useSelector(selectWidgetResponse);
  const { currentUser } = useSelector(state => state.login);
  const { getDownloadExcelData } = useSelector(state => state.flexbenefitBroker);
  const UtilizationResponse = useSelector(selectUtilizationResponse);
  useEffect(() => {
    dispatch(getWidgetData());
    dispatch(getUtilizationData());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (getDownloadExcelData) {
      downloadFile(getDownloadExcelData, '', false)
    }
    return () => { dispatch(cleardownloadResponse()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [getDownloadExcelData])

  const downloadAction = () => {
    dispatch(downloadExcelData({ employer_id: currentUser?.employer_id }))
  }

  return (
    <Container>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <DetailCard widgetData={WidgetResponse?.data?.data} />
        {(currentUser?.employer_id && (UtilizationResponse?.data?.data?.length)) &&
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
        <TabContainer>
          <ControlledTabs FlexData={UtilizationResponse?.data?.data} />
        </TabContainer>
      </div>
    </Container>
  );
};
