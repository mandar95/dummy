import React from "react";
import metadata from '../../generate-build-no/metadata.json';
import { FooterWrapper } from "./style";

const envType = () => {
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'development') return 'LOCAL'
  return metadata.buildTag
}


const Footer = ({ noLogin }) => {
  const todayDate = new Date();
  const presentYear = todayDate.getFullYear();
  return (
    <FooterWrapper noLogin={noLogin} className='custom-footer'>
      <p>© Copyright {presentYear}. All right reserved FynTune Solutions.</p>

      <span>{`Version ${metadata.buildMajor}.${metadata.buildMonth}.${metadata.buildDay}.${metadata.buildRevision} ${envType()}`}</span>
    </FooterWrapper>
  );
};

export default Footer;
