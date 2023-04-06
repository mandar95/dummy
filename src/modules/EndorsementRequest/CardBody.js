import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { ContentBox, CardContent, AnchorTag, ButtonContainer } from "./style";
import { AttachFile } from "../core/attachFile/AttachFile";
import { Button } from "components/button/Button";
import { getFirstError } from 'utils';
import {
  postMemberDetails,
  selectPostResponse,
  selectSampleFileResponse,
  postICMemberDetails,
  sampleFileDetails,
  selectPolicyNumber,
  // sumInsuredCleanUp,
  getErrorSheetData
} from "./EndorsementRequest.slice";
import { downloadFile } from "../../utils";
import { ProgressBar } from './progressbar';
import { Col, Row } from "react-bootstrap";
import { Head } from "../../components";
import { CustomControl } from 'modules/user-management/AssignRole/option/style';

const CardBody = (props) => {
  //selectors
  const dispatch = useDispatch();
  const PostResponse = useSelector(selectPostResponse);
  const SampleResponse = useSelector(selectSampleFileResponse);
  const PolicyNumberResponse = useSelector(selectPolicyNumber);
  const { currentUser } = useSelector((state) => state.login);
  const { globalTheme } = useSelector(state => state.theme)

  const { loading1 } = useSelector((state) =>
    state?.endorsementRequest)
  //states
  const [file, setFile] = useState([]);
  const [is_inception, setIs_inception] = useState('0');
  const [getStatus, setStatus] = useState(0);

  const getFile = (file) => {
    setFile(file);
  };

  //api call ------
  const Save = () => {

    if (file.length && props?.policyNumberData) {

      const is_new_endorsement_add = [3].includes(props?.new_type);
      const is_new_endorsement_update = [5].includes(props?.new_type);
      const is_new_endorsement_delete = [4].includes(props?.new_type);


      const data = {
        policy_id: props?.policyNumberData,
        policy_number: PolicyNumberResponse?.data?.data?.find(({ id }) => id === Number(props?.policyNumberData))?.number || props?.policyNumberData,
        type: (is_new_endorsement_add || is_new_endorsement_update || is_new_endorsement_delete) ? props?.new_type : props?.type,
        employer_id: props.employerId,
        file: file,
      };

      const formData = new FormData();
      formData.append("member_sheet", data?.file[0]);
      formData.append("employer_id", data.employer_id);
      formData.append("policy_id", data.policy_id);
      formData.append("policy_number", data.policy_number);
      formData.append("type", data.type);
      props.type === "Add" && formData.append("is_inception", is_inception);
      if (file) {
        if (props.Header === "IC Endorsement") {
          dispatch(postICMemberDetails(formData))
        } else {
          dispatch(postMemberDetails(formData, (is_new_endorsement_add || is_new_endorsement_update || is_new_endorsement_delete)));
        }
        setStatus(1);
      }
    } else {

      if (!file.length &&
        !props?.policyNumberData) {
        swal("Validation", "Select Policy & Upload File", "warning");
        return null;
      }
      if (!props?.policyNumberData) {
        swal("Validation", "Select Policy", "warning");
        return null;
      }
      if (!file.length) {
        swal("Validation", "Upload File", "warning");
        return null;
      }
    }
  };
  //--------

  //alert for post response--------------------
  useEffect(() => {
    if (getStatus === 1) {
      if (PostResponse?.data?.status === true) {
        swal(PostResponse?.data?.message, "", "success").then(() => {
          props.reset({
            broker: '',
            employer: '',
            policytype: '',
            policyno: '',
          });
          setFile([])
          dispatch(getErrorSheetData({ broker_id: currentUser?.broker_id }))
        }
        );
      } else {
        let error = PostResponse?.data?.errors && getFirstError(PostResponse?.data?.errors);
        error = error ? error : PostResponse?.data?.message;
        swal("", error === "Cannot read properties of undefined (reading 'status')" ? "Unable to connect to the server, please check your internet connection." : error, "warning");
        setFile([])
      }
    }
    setStatus(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [PostResponse]);
  //------------------------------------------

  useEffect(() => {
    if (SampleResponse?.data) {
      downloadFile(SampleResponse?.data)
    }
    return () => { dispatch(sampleFileDetails('')) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [SampleResponse])

  return (
    <ContentBox>
      <div>
        <h5>
          <span>{props.Header}</span>
        </h5>
      </div>
      <CardContent>
        {props.type === "Add" && <Row className="justify-content-center">
          <Col md={8} lg={6} xl={6} sm={12}>
            <Head className='text-center'>Type of Data?</Head>
            <div className="d-flex justify-content-around flex-wrap mt-2" style={{ margin: '0 39px 40px -12px' }}>
              <CustomControl className="d-flex mt-4 mr-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Endorsement"}</p>
                <input onChange={(e) => e.target.checked && setIs_inception('0')} type={'radio'} checked={is_inception === '0'} value={'0'} />
                <span></span>
              </CustomControl>
              <CustomControl className="d-flex mt-4 ml-0">
                <p style={{ fontWeight: "600", paddingLeft: "27px", marginBottom: "0px" }}>{"Inception"}</p>
                <input onChange={(e) => e.target.checked && setIs_inception('1')} type={'radio'} checked={is_inception === '1'} value={'1'} />
                <span></span>
              </CustomControl>
            </div>
          </Col>
        </Row>}

        <AttachFile
          accept={".xlsx, .xls"}
          key="member_sheet"
          onUpload={getFile}
          description="File Formats: (.xlsx .xls)"
          nameBox
          resetValue={loading1}
        />
        {props?.policyNumberData &&
          <AnchorTag onClick={props.downloadSampleFile}>
            <i
              className="ti-cloud-down attach-i"
              style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px', marginRight: "5px" }}
            ></i>
            <span style={{ fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px', fontWeight: "600" }}>
              Download Sample Format
            </span>
          </AnchorTag>
        }

      </CardContent>
      <ButtonContainer>
        <Button onClick={Save}>Submit</Button>
      </ButtonContainer>
      {loading1 && <ProgressBar />}
    </ContentBox>
  );
};

CardBody.defaultProps = {
  Header: "N/A",
};
export default CardBody;
