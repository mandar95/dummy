import React, { useState, useEffect, Fragment } from "react";
import styled from "styled-components";
// import { useParams } from 'react-router-dom';
import { DataTable } from "../../user-management";
import { QueryComplaintEmployee } from "../helper";
import swal from "sweetalert";

import { CustomAccordion } from "../../../components/accordion";
import AccordionHeader from "../../../components/accordion/accordion-header";
import AccordionContent from "../../../components/accordion/accordion-content";
import {
  CardBlue,
  IconlessCard,
  Select,
  Button,
  TabWrapper,
  Tab,
  Loader,
} from "../../../components";
import securels from "secure-ls";
import TextArea from "react-textarea-autosize";

import { useDispatch, useSelector } from "react-redux";
import {
  // getPolicySubTypeAcronym,
  getFAQByPolicyId,
  getQueryType,
  getQuerySubType,
  getQueries,
  createQueries,
  submitFeedback,
  setEmployeeRatings,
  setEmployeeFeedback,
  resetEmployeeFeedback,
  setEmployeeQuery,
  setEmployeeSubQuery,
  setEmployeeComments,
  resetEmployeeQuery,
  help,
  loadSubPolicies,
} from "../help.slice";
import { DateFormate } from "../../../utils";
import { Img } from "../../../components/inputs/input/style";
import classes from "../../contact-us/index.module.css";
import { AttachFile } from "../../core";
const ls = new securels();

export const ratingImages = [
  {
    name: "Un Happy",
    color: '#DE2224',
    image: "/assets/images/unhappy.png",
  },
  {
    name: "Fair",
    color: '#E96F0E',
    image: "/assets/images/fair.png",
  },
  {
    name: "Good",
    color: '#EFE015',
    image: "/assets/images/good.png",
  },
  {
    name: "Very Good",
    color: '#AFDE1E',
    image: "/assets/images/verygood.png",
  },
  {
    name: "Excellent",
    color: '#69D51B',
    image: "/assets/images/excellent.jpg",
  },
];
export const HelpEmployee = ({ validation }) => {
  const [tab, setTab] = useState("FAQs");
  const userType = ls.get("userType");
  const [policyId, setPolicyId] = useState(1);
  const { globalTheme } = useSelector(state => state.theme)
  const dispatch = useDispatch();
  const {
    policySubTypeAcronym,
    employee_faqs,
    employee_queries,
    employee_query_type,
    employee_query_subtype,
    employee_query,
    employee_subQuery,
    employee_comments,
    employee_ratings,
    employee_feedback,
    loading,
  } = useSelector(help);

  const { currentUser } = useSelector((state) => state.login);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // dispatch(getPolicySubTypeAcronym());
    dispatch(getQueryType());
    dispatch(getQueries());
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!!policyId) {
      dispatch(getFAQByPolicyId(policyId));
    }
    // eslint-disable-next-line
  }, [policyId]);

  useEffect(() => {
    if (!!employee_query) {
      // let query_id = employee_query_type.find(v => v.name === employee_query)?.id;
      dispatch(getQuerySubType({ query_id: employee_query }));
    }
    // eslint-disable-next-line
  }, [employee_query]);

  useEffect(() => {
    if (currentUser.employee_id || currentUser.employer_id)
      dispatch(
        loadSubPolicies(currentUser.employee_id, currentUser.employer_id)
      );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const submitQueries = () => {
    if (!employee_query && !employee_subQuery && !employee_comments) {
      swal("Required", "All inputs required", "info");
      return;
    }
    if (!employee_query || !employee_subQuery) {
      swal("Required", "Query & Query Subtype required", "info");
      return;
    } else if (!employee_comments || employee_comments?.length < 3) {
      swal("Required", "Comment required atleast 3 character", "info");
      return;
    } else {
      const formData = new FormData();

      formData.append('query_type_id', employee_query)
      formData.append('query_sub_type_id', employee_subQuery)
      formData.append('comments', employee_comments)
      file?.length && formData.append('document', file[0])
      setFile(null)
      dispatch(createQueries(formData));
    }
  };

  const submitFeedbackDetails = () => {
    const data = {
      ratings: employee_ratings,
      feedback: employee_feedback,
    };
    if (!!data.ratings && !!data.feedback) {
      dispatch(submitFeedback(data));
    } else if (!data.ratings && !data.feedback) {
      swal("Feedback & rating required", "", "info");
    } else if (!data.ratings) {
      swal("Rating required", "", "info");
    } else if (!data.feedback) {
      swal("Feedback required", "", "info");
    } else {
      swal("Required", "", "info");
    }
  };

  if (userType !== "Employee") {
    return <div></div>;
  } else {
    return loading ? (
      <Loader />
    ) : (
      <div>
        <TabWrapper width="max-content">
          <Tab
            isActive={Boolean(tab === "FAQs")}
            onClick={() => setTab("FAQs")}
            className="d-block"
          >
            FAQs
          </Tab>
          {/* <Tab isActive={Boolean(tab === "FAQs")} onClick={() => setTab("FAQs")} className="d-md-none d-sm-block">1</Tab> */}
          <Tab
            isActive={Boolean(tab === "Queries & Complaints")}
            onClick={() => setTab("Queries & Complaints")}
            className="d-block"
          >
            Queries & Complaints
          </Tab>
          {/* <Tab isActive={Boolean(tab === "Queries & Complaints")} onClick={() => setTab("Queries & Complaints")} className="d-md-none d-sm-block">2</Tab> */}
          <Tab
            isActive={Boolean(tab === "Feedback")}
            onClick={() => setTab("Feedback")}
            className="d-block"
          >
            Feedback
          </Tab>
          {/* <Tab isActive={Boolean(tab === "Feedback")} onClick={() => setTab("Feedback")} className="d-md-none d-sm-block">3</Tab> */}
        </TabWrapper>

        {tab === "FAQs" && (
          <Fragment>
            <div className={`${classes.autoscroll} mb-2`}>
              <div className="d-flex flex-nowrap">
                {policySubTypeAcronym.map((v, i) => (
                  <div
                    style={{
                      position: "relative",
                      minWidth: "150px",
                      maxWidth: "150px",
                      backgroundColor: "white",
                      color: "#272727",
                      padding: "2em",
                      margin: "1em",
                      borderRadius: "2em",
                      boxShadow: "2px 1px 10px lightgray",
                      cursor: "pointer",
                    }}
                    onClick={() => setPolicyId(v.id)}
                    key={`${v.name}--${v.id}`}
                  >
                    <div className="d-flex justify-content-between">
                      <input
                        type="radio"
                        style={{ width: "15px", position: "absolute" }}
                        checked={v.id === policyId}
                        onChange={() => setPolicyId(v.id)}
                      />
                      <img
                        className="mx-auto"
                        src={`${v.image}`}
                        alt=""
                        style={{ width: "auto", height: "50px" }}
                      />
                    </div>
                    <div className="d-flex justify-content-center mt-2">
                      <span className="text-center">{v.name}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="mb-5">
              {policySubTypeAcronym.length > 0 &&
                employee_faqs?.length > 0 &&
                employee_faqs.map((v, i) => (
                  <CustomAccordion key={"asdewsawq" + i} id={"1"}>
                    <AccordionHeader>{v.question}</AccordionHeader>
                    <AccordionContent>
                      <span className="text-primary">{v.answer}</span>
                    </AccordionContent>
                  </CustomAccordion>
                ))}
            </div>{" "}
          </Fragment>
        )}

        {tab === "Queries & Complaints" && (
          <CardBlue
            title={
              <div style={{ fontWeight: "500", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em' }}>
                Queries & Complaints
              </div>
            }
            round={true}
            styles={{
              maxWidth: "600px",
              minWidth: "300px",
            }}
            marginTop={"1em"}
            clickHandler={() => { }}
          >
            <div className="row">
              <div className="col-lg-6 col-md-12 ">
                <Select
                  label="Query Type"
                  id={"1"}
                  options={employee_query_type}
                  name={"queryType"}
                  value={employee_query}
                  placeholder={"Select Query Type"}
                  onChange={(e) => {
                    dispatch(setEmployeeQuery(e.target.value));
                  }}
                />
              </div>
              <div className="col-lg-6 col-md-12">
                <Select
                  label="Sub Type"
                  id={"2"}
                  options={employee_query_subtype}
                  name={"subType"}
                  value={employee_subQuery}
                  placeholder={"Select Sub Type"}
                  onChange={(e) => {
                    dispatch(setEmployeeSubQuery(e.target.value));
                  }}
                />
              </div>

            </div>
            <div className="row pt-4 pb-4">
              <div className="col-12 mt-3">
                <div style={
                  {
                    position: 'absolute',
                    right: '15px',
                    top: '-20px',
                    background: '#e2e2e2',
                    padding: '0px 5px',
                    borderRadius: '3px'
                  }
                }>
                  {`${employee_comments.length} / ${validation.text.length}`}
                </div>
                <Input
                  className="form-control"
                  minLength={3}
                  maxLength={validation.text.length}
                  value={employee_comments}
                  onChange={(e) => {
                    dispatch(setEmployeeComments(e.target.value));
                  }}
                />

                <label className="form-label">
                  <span className="span-label">Comments</span>
                  <sup>
                    {" "}
                    <Img
                      alt="important"
                      src="/assets/images/inputs/important.png"
                    />{" "}
                  </sup>
                </label>
              </div>
              <div className="mt-4 col-lg-12 col-md-12">
                <AttachFile
                  accept={".pdf,.png,.jpeg,.jpg"}
                  key="file"
                  onUpload={(file) => setFile(file)}
                  description="File Formats: (.png .jpeg .jpg .pdf)"
                  nameBox
                  required={false}
                  resetValue={loading}
                />
              </div>
            </div>
            <div className="d-flex justify-content-end mt-4">
              <Button
                buttonStyle={"danger"}
                onClick={() => dispatch(resetEmployeeQuery())}
              >
                Cancel
              </Button>
              <Button buttonStyle={"success"} onClick={() => submitQueries()}>
                Submit
              </Button>
            </div>
          </CardBlue>
        )}
        {tab === "Queries & Complaints" &&
          (employee_queries.length > 0 ? (
            // <TableWrapper>
            <IconlessCard removeBottomHeader={true} marginTop={"0.5em"}>
              <div style={{ fontWeight: "500", fontSize: globalTheme.fontSize ? `calc(1.6em + ${globalTheme.fontSize - 92}%)` : '1.6em' }}>
                Queries
              </div>
              <DataTable
                columns={QueryComplaintEmployee}
                data={
                  employee_queries
                    ? employee_queries.map((elem) => ({
                      ...elem,
                      raised_on: DateFormate(elem.raised_on),
                      resolved_on: DateFormate(elem.resolved_on),
                    }))
                    : []
                }
                noStatus={true}
                // queryStatus
                pageState={{ pageIndex: 0, pageSize: 5 }}
                pageSizeOptions={[5, 10, 20, 25, 50, 100]}
                rowStyle
              />
            </IconlessCard>
          ) : (
            // </TableWrapper>
            ""
          ))}

        {tab === "Feedback" && (
          <CardBlue
            title={
              <div style={{ fontWeight: "500", fontSize: globalTheme.fontSize ? `calc(1em + ${globalTheme.fontSize - 92}%)` : '1em' }}>
                Feedback
              </div>
            }
            round={true}
            styles={{
              maxWidth: "600px",
              // minWidth: '320px',
              margin: "3em",
            }}
            marginTop={"1em"}
            clickHandler={() => { }}
          >
            <div className="row pt-4 pb-4">
              <div className="col-12 mt-3">
                <div style={
                  {
                    position: 'absolute',
                    right: '15px',
                    top: '-20px',
                    background: '#e2e2e2',
                    padding: '0px 5px',
                    borderRadius: '3px'
                  }
                }>
                  {`${employee_feedback.length} / ${validation.text.length}`}
                </div>
                <Input
                  className="form-control"
                  value={employee_feedback}
                  minLength={2}
                  maxLength={validation.text.length}
                  onChange={(e) =>
                    dispatch(setEmployeeFeedback(e.target.value))
                  }
                />

                <label className="form-label">
                  <span className="span-label">
                    Feedback
                    <sup>
                      <img
                        alt="important"
                        src="/assets/images/inputs/important.png"
                      />
                    </sup>
                  </span>
                </label>
              </div>
            </div>
            <p className="h5">Ratings</p>
            <div className="row my-3">
              {ratingImages.map((v, i) => (
                <ImageWrapper color={v.color} onClick={() => dispatch(setEmployeeRatings(i + 1))} isRated={Boolean(employee_ratings === Number(i + 1))} key={i + "rating-1"} className="col-lg-2 col-md-12">
                  <img
                    src={v.image}
                    alt=""
                    width="50"
                    className="d-lg-block ml-1 mr-lg-0 mr-2 my-lg-0 my-2 d-inline"
                  />
                  <div className="text-center small d-lg-block d-inline">
                    {v.name}
                  </div>
                </ImageWrapper>
              ))}
            </div>
            <div className="d-flex justify-content-end mt-5">
              <Button
                buttonStyle={"danger"}
                onClick={() => dispatch(resetEmployeeFeedback())}
              >
                Cancel
              </Button>
              <Button
                buttonStyle={"success"}
                onClick={() => {
                  submitFeedbackDetails();
                }}
              >
                Submit
              </Button>
            </div>
          </CardBlue>
        )}
      </div>
    );
  }
};
// const Paper = styled.div`
//   min-width: ${(props) => props.minWidth || "320px"};
//   max-width: ${(props) => props.maxWidth || "800px"};
//   background-color: ${({ backgroundColor, theme }) =>
//     theme.dark ? "#2a2a2a" : backgroundColor || "#f2c9fb"};
//   border-radius: ${(props) => props.radius || "2.6em"};
//   box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1),
//     0 10px 10px -5px rgba(0, 0, 0, 0.04);
//   margin: ${(props) => props.margin || "2em"};
//   padding: ${(props) => props.padding || "2em 4em"};
//   color: ${({ theme, color }) => (theme.dark ? "#FAFAFA" : color || "#6334e3")};
//   cursor: pointer;
// `;

export const ImageWrapper = styled.div`
transition: all 0.2s linear;
cursor: pointer;
padding-top: 15px;
    padding-bottom: 15px;
    margin: 0 5px;
    border-radius : 15px;
    border: 2px solid transparent;
    
&:hover {
    box-shadow: ${({ theme }) =>
    theme.dark
      ? "0 10px 15px 11px rgba(255, 255, 255, 0.27), 0 4px 6px -2px rgba(168, 168, 168, 0.05)"
      : "0 10px 15px 11px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)"};
  }
  ${({ isRated, theme, color }) =>
    !!isRated
      ? `
border: 2px solid ${color};
box-shadow:` +
      (theme.dark
        ? "0 10px 15px 11px rgba(255, 255, 255, 0.27), 0 4px 6px -2px rgba(168, 168, 168, 0.05)"
        : "0 10px 15px 11px rgba(0, 0, 0, 0.1),0 4px 6px -2px rgba(0, 0, 0, 0.05)")
      : ""}
`

const Input = styled(TextArea)`
  overflow: hidden;
  min-height: 80px;
`;
