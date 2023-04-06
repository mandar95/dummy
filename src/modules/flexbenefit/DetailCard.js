import React from "react";
import { useSelector } from "react-redux";
import IconlessCard from "./IconlessCard";
import { CardInfo, ImageBox, InfoBlock, InfoBlock1, Box, Box1 } from "./style";

const DetailCard = (props) => {
  const widgetData = props?.widgetData;
  const { globalTheme } = useSelector(state => state.theme);
  return (
    <IconlessCard>
      <CardInfo>
        <Box1>
          <InfoBlock1>
            <ImageBox>
              <img
                src="/assets/images/total-employee.png"
                alt="img"
                width="50"
                style={{ padding: "5px" }}
              />
            </ImageBox>
          </InfoBlock1>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <label style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', marginTop: '-7px', fontWeight: '500' }}>Total Employee</label>
            <label style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px', color: '#D4E157', marginTop: '-7px', fontWeight: '500' }}>{widgetData?.totalEmployee || 0}</label>
          </div>
        </Box1>
        <Box>
          <InfoBlock>
            <ImageBox>
              <img
                src="/assets/images/total-employee.png"
                alt="img"
                width="50"
                style={{ padding: "5px" }}
              />
            </ImageBox>
          </InfoBlock>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <label style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', marginTop: '-7px', fontWeight: '500' }}>Flexi Benefit Allocated</label>
            <label style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px', color: '#D4E157', marginTop: '-7px', fontWeight: '500' }}>{widgetData?.totalFlexAllocated || '0'}</label>
          </div>
        </Box>
        <Box>
          <InfoBlock>
            <ImageBox>
              <img
                src="/assets/images/total-employee.png"
                alt="img"
                width="50"
                style={{ padding: "5px" }}
              />
            </ImageBox>
          </InfoBlock>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <label style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', marginTop: '-7px', fontWeight: '500' }}>Flexi Utilized</label>
            <label style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px', color: '#D4E157', marginTop: '-7px', fontWeight: '500' }}>{widgetData?.totalFlexUtilized || '0'}</label>
          </div>
        </Box>
        <Box>
          <InfoBlock>
            <ImageBox>
              <img
                src="/assets/images/total-employee.png"
                alt="img"
                width="50"
                style={{ padding: "5px" }}
              />
            </ImageBox>
          </InfoBlock>
          <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'center' }}>
            <label style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', marginTop: '-7px', fontWeight: '500' }}>Salary Deduction</label>
            <label style={{ fontSize: globalTheme.fontSize ? `calc(20px + ${globalTheme.fontSize - 92}%)` : '20px', color: '#D4E157', marginTop: '-7px', fontWeight: '500' }}>{widgetData.totalPayRollUtilized || '0'}</label>
          </div>
        </Box>
      </CardInfo>
    </IconlessCard>
  );
};

DetailCard.defaultProps = {
  widgetData: {
    totalEmployee: 0,
    totalPayRollUtilized: '0',
    totalFlexUtilized: '0',
    totalFlexAllocated: '0'
  }
}

export default DetailCard;
