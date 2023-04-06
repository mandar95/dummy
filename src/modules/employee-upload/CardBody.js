import React, { useState } from "react";
import swal from "sweetalert";
import { ContentBox, CardContent, AnchorTag, ButtonContainer } from "./style";

import { Row, Col } from "react-bootstrap";
import { AttachFile } from 'modules/core';
import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { Button } from "components/button/Button";
import { uploadEmployeeUpload } from "./employee-upload.action";
import { useSelector } from "react-redux";

const CardBody = ({ set_employer_id,
  Header,
  employer_id,
  type,
  downloadSampleFile,
  dispatch,
  uploadLoading, note }) => {
  const [file, setFile] = useState([]);
  const { globalTheme } = useSelector(state => state.theme)

  const getFile = (file) => {
    setFile(file);
  };


  const Save = () => {
    if (file.length && employer_id) {

      const formData = new FormData();
      formData.append("employee_sheet", file[0]);
      formData.append("employer_id", employer_id);
      formData.append("type", type);

      uploadEmployeeUpload(dispatch, formData, { set_employer_id, setFile })

    } else {

      if (!file.length &&
        !employer_id) {
        swal("Validation", "Select Employer & Upload File", "warning");
        return null;
      }
      if (!employer_id) {
        swal("Validation", "Select Employer", "warning");
        return null;
      }
      if (!file.length) {
        swal("Validation", "Upload File", "warning");
        return null;
      }
    }
  };
  //--------

  return (
    <ContentBox>
      <div>
        <h5>
          <span>{Header}</span>
        </h5>
      </div>
      <Row>
        <Col md={12} lg={12} xl={12} sm={12}>
          <TextCard width='auto' className="pl-3 pr-3 my-2" noShadow bgColor="#f2f2f2">
            <Title fontSize="0.9rem" color="#706af9">
              Note: {note} are Mandatory Fields
            </Title>
          </TextCard>
        </Col>
      </Row>
      <CardContent>
        <AttachFile
          accept={".xlsx, .xls"}
          key="member_sheet"
          onUpload={getFile}
          description="File Formats: (.xlsx .xls)"
          nameBox
          resetValue={uploadLoading}
        />

        <AnchorTag onClick={downloadSampleFile}>
          <i
            className="ti-cloud-down attach-i"
            style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
          ></i>
          <span style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
            Download Sample Format
          </span>
        </AnchorTag>

      </CardContent>
      <ButtonContainer>
        <Button onClick={Save}>Submit</Button>
      </ButtonContainer>

    </ContentBox>
  );
};

CardBody.defaultProps = {
  Header: "N/A",
};
export default CardBody;
