import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { ContentBox, CardContent, AnchorTag, ButtonContainer } from "modules/addmember2/style"
import { AttachFile } from "../core/attachFile/AttachFile";
import { Button } from "components/button/Button";
import { getFirstError } from 'utils';
import {
    postMemberDetailsTPA,
    selectPostResponse,
    selectSampleFileResponse,
    sampleFileDetails,
    selectPolicyNumber
} from "../EndorsementRequest/EndorsementRequest.slice";
import { downloadFile } from "../../utils";

const CardBody = (props) => {
    //selectors
    const dispatch = useDispatch();
    const { globalTheme } = useSelector(state => state.theme)
    const PostResponse = useSelector(selectPostResponse);
    const SampleResponse = useSelector(selectSampleFileResponse);
    const PolicyNumberResponse = useSelector(selectPolicyNumber);
    //states
    const [file, setFile] = useState([]);
    const [getStatus, setStatus] = useState(0);

    const getFile = (file) => {
        setFile(file);
    };

    //api call ------
    const Save = () => {
        if (file.length &&
            props?.policyNumberData?.id) {
            const data = {
                policy_id: props?.policyNumberData?.id,
                policy_number: PolicyNumberResponse?.data?.data?.find(({ id }) => id === Number(props?.policyNumberData?.id))?.number || props?.policyNumberData?.id,
                // type: props?.type,
                employer_id: props.employerId,
                file: file,
            };

            const formData = new FormData();
            formData.append("tpa_member_sheet", data?.file[0]);
            formData.append("employer_id", data.employer_id);
            formData.append("policy_id", data.policy_id);
            formData.append("policy_number", data.policy_number);
            formData.append("to_override", props.to_override);
            // formData.append("type", data.type);
            if (file) {
                dispatch(postMemberDetailsTPA(formData));
                setStatus(1);
            }
        } else {

            if (!file.length &&
                !props?.policyNumberData?.id) {
                swal("Validation", "Select Policy & Upload File", "warning");
                return null;
            }
            if (!props?.policyNumberData?.id) {
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
                swal(PostResponse?.data?.message, "", "success").then(() => window.location.reload());
            } else {
                let error = PostResponse?.data?.errors && getFirstError(PostResponse?.data?.errors);
                error = error ? error : PostResponse?.data?.message;
                swal("", error, "warning");
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
        // if (SampleResponse?.data?.data && SampleResponse?.data?.data && SampleResponse?.data?.data[0]?.upload_path) {
        //   downloadFile(SampleResponse?.data?.data && SampleResponse?.data?.data[0]?.upload_path)
        // }
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
                <AttachFile
                    accept={".xlsx, .xls"}
                    key="member_sheet"
                    onUpload={getFile}
                    description="File Formats: (.xlsx .xls)"
                    nameBox
                />
                {props?.policyNumberData.id &&
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
        </ContentBox>
    );
};

CardBody.defaultProps = {
    Header: "N/A",
};
export default CardBody;
