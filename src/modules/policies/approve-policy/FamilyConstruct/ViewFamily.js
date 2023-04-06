import React from "react";

import { Button, Head, Text, Marker, Typography } from "components";
import { Row, Col, Table } from "react-bootstrap";
import { downloadFile } from "../../../../utils";
import swal from "sweetalert";
import { Card as TextCard } from "modules/RFQ/select-plan/style.js";
import { Title } from "../../../RFQ/select-plan/style";
import { MidtermEnrollment } from "../../steps/member-details/family-details";
import { mergeRelation } from "../../../RFQ/plan-configuration/helper";
import { useSelector } from "react-redux";
import { ContributionTypeRater } from "../../steps/premium-details/premium-details";
const sortRelation = (relations) => {
  let storeRelation = [];
  for (let relation of relations) {
    if ([4, 6, 8].includes(relation.relation_id)) {
    } else if ([3, 5, 7].includes(relation.relation_id)) {
      storeRelation.push({
        ...relation,
        relation: mergeRelation[relation.relation_id],
      });
    } else {
      storeRelation.push(relation);
    }
  }
  return storeRelation;
};
export const ViewFamily = ({ policyData, style, nextPage }) => {
  const { familyLabels } = useSelector((state) => state.policyConfig);
  const filteredRelation = sortRelation(policyData?.ageDetails);
  const memberRelation =
    policyData?.ageDetails?.map((elem) => String(elem.relation_id)) || [];
  const is_opd = policyData.policy_rater_type_id === 3;
  const min_max_age = policyData?.ageDetails?.some(
    (person) => person.max_age || person.min_age
  );
  const noParentCont = [11, 12].includes(policyData?.premium_type_id);
  const noParentCont_opd = [11, 12].includes(policyData?.opd_premium_type_id);

  const noIpdContRater = !(ContributionTypeRater.includes(policyData.premium_type_id));
  const noOpdContRater = !(ContributionTypeRater.includes(policyData.opd_premium_type_id));


  return (
    <>
      <Row className="d-flex flex-wrap">
        <Col md={6} lg={3} xl={3} sm={12}>
          <Head>No. of Allowed Members</Head>
          <Text>{policyData?.no_of_member || "-"}</Text>
        </Col>
      </Row>

      {/* Table */}
      <Table className="text-center" style={style.Table} responsive>
        <thead>
          <tr style={style.HeadRow}>
            <th style={style.TableHead} scope="col">
              Family Relation{" "}
            </th>
            {min_max_age && (
              <>
                <th scope="col">Min Age</th>
                <th scope="col">Max Age</th>
              </>
            )}
            <th scope="col">Age Limit</th>
            {noIpdContRater && <>
              <th scope="col">Employee Contribution%{is_opd && '(IPD)'}</th>
              <th scope="col">Employer Contribution%{is_opd && '(IPD)'}</th>
              <th scope="col">Additional Premium{is_opd && '(IPD)'}</th>
            </>}
            {noOpdContRater && is_opd &&
              <>
                <th scope="col">Employee Contribution%(OPD)</th>
                <th scope="col">Employer Contribution%(OPD)</th>
                <th scope="col">Additional Premium(OPD)</th>
              </>
            }
            {/* {policyData?.ageDetails?.some(e => e.is_special_member_allowed === 1) &&
              <> */}
            {/* {!isAllSpecialMember &&
              <>
                <th scope="col">Special Member</th>
                <th scope="col">Special Member Employee Contribution%</th>
                <th scope="col">Special Member Employer Contribution%</th>
                <th scope="col">Special Member Additional Premium</th>
              </>
            } */}
            {/* </>
            } */}
            <th scope="col">Age Depend</th>
            <th scope="col">Age Difference</th>
            <th scope="col">Allowed For</th>
          </tr>
        </thead>
        <tbody>
          {filteredRelation?.map((person, index) =>
            ((index === 0 && !!Number(policyData?.is_employee_included)) || index !== 0) &&
            (
              <tr key={index + 'age-detail'}>
                <th scope="row">{person.relation}</th>
                {min_max_age &&
                  <>
                    <td>{(person.min_age || person.min_age === 0) ? `${person.min_age} Yrs` : "-"}</td>
                    <td>{person.max_age ? `${person.max_age} Yrs` : "-"}</td>
                  </>}
                <td>{person.max_age ? "Yes" : "No"}</td>
                {noIpdContRater && <>
                  <td>{(noParentCont && [5, 6, 7, 8].includes(person.relation_id)) ? <span
                    role='button'
                    onClick={() => (policyData?.premium_file)
                      ? downloadFile(policyData?.premium_file, undefined, true)
                      : swal("Document not available", "", "info")}>
                    <i className={(policyData?.premium_file) ? "ti ti-download" : "ti ti-close"}></i>
                  </span > : (person.employee_contribution || "-")}</td>
                  <td>{(noParentCont && [5, 6, 7, 8].includes(person.relation_id)) ? <span
                    role='button'
                    onClick={() => (policyData?.premium_file)
                      ? downloadFile(policyData?.premium_file, undefined, true)
                      : swal("Document not available", "", "info")}>
                    <i className={(policyData?.premium_file) ? "ti ti-download" : "ti ti-close"}></i>
                  </span > : (person.employer_contribution || "-")}</td>
                  <td>{policyData.has_additional_premium ? person.additional_premium || '-' : "No"}</td>
                </>}
                {noOpdContRater && is_opd &&
                  <>
                    <td>{(noParentCont_opd && [5, 6, 7, 8].includes(person.relation_id)) ? <span
                      role='button'
                      onClick={() => (policyData?.opd_premium_file)
                        ? downloadFile(policyData?.opd_premium_file, undefined, true)
                        : swal("Document not available", "", "info")}>
                      <i className={(policyData?.opd_premium_file) ? "ti ti-download" : "ti ti-close"}></i>
                    </span > : (person.employee_contribution_opd || "-")}</td>
                    <td>{(noParentCont_opd && [5, 6, 7, 8].includes(person.relation_id)) ? <span
                      role='button'
                      onClick={() => (policyData?.opd_premium_file)
                        ? downloadFile(policyData?.opd_premium_file, undefined, true)
                        : swal("Document not available", "", "info")}>
                      <i className={(policyData?.opd_premium_file) ? "ti ti-download" : "ti ti-close"}></i>
                    </span > : (person.employer_contribution_opd || "-")}</td>
                    <td>{person.additional_premium_opd || "No"}</td>
                  </>
                }
                {/* {policyData?.ageDetails?.some(e => e.is_special_member_allowed === 1) &&
                  <> */}
                {/* {!isAllSpecialMember &&
                  <>
                    <td>{person?.is_special_member_allowed ? "Yes" : "No"}</td>
                    <td>{person.special_member_employee_contribution || "-"}</td>
                    <td>{person.special_member_employer_contribution || "-"}</td>
                    <td>{person.special_member_additional_premium || "-"}</td>
                  </>
                } */}
                {/* </>
                } */}
                <td>
                  {[{ id: 1, name: "Self", value: 1 }, ...familyLabels]
                    ?.filter(
                      (item) =>
                        Number(item.id) ===
                        Number(person?.difference_from_relation)
                    )
                    .map((data) => data.name) || "-"}
                </td>
                <td>{person?.age_difference || "-"}</td>
                <td>
                  {[5, 7].includes(Number(person.relation_id))
                    ? Number(person?.is_allowed_for_gender) === 0
                      ? "Male"
                      : Number(person?.is_allowed_for_gender) === 1
                        ? "Female"
                        : "Both"
                    : "-"}
                </td>
              </tr>
            )
          )}
        </tbody>
      </Table>
      {(memberRelation.includes("2") ||
        memberRelation.includes("10") ||
        memberRelation.includes("3") ||
        memberRelation.includes("4") ||
        memberRelation.includes("5")) && (
          <>
            <Marker />
            <Typography>{"\u00A0"}Relation Count</Typography>
            <Row className="d-flex flex-wrap">
              {memberRelation.includes("2") && (
                <Col md={6} lg={4} xl={3} sm={12}>
                  {/* <Marker />
            <Typography>{'\u00A0'}Max Twin</Typography> */}
                  <Head>No. of Spouse</Head>
                  <Text>
                    {policyData?.ageDetails.find((elem) => elem.relation_id === 2)
                      ?.no_of_relation || "1"}
                  </Text>
                </Col>
              )}
              {memberRelation.includes("2") && (
                <Col md={6} lg={4} xl={3} sm={12}>
                  {/* <Marker />
            <Typography>{'\u00A0'}Max Twin</Typography> */}
                  <Head>No. of Partner</Head>
                  <Text>
                    {policyData?.ageDetails.find((elem) => elem.relation_id === 10)
                      ?.no_of_relation || "1"}
                  </Text>
                </Col>
              )}
              {(memberRelation.includes("3") || memberRelation.includes("4")) && (
                <Col md={6} lg={4} xl={3} sm={12}>
                  {/* <Marker />
            <Typography>{'\u00A0'}Max Twin</Typography> */}
                  <Head>No. of Child</Head>
                  <Text>{policyData?.no_of_childs || "1"}</Text>
                </Col>
              )}
              {(memberRelation.includes("5") || memberRelation.includes("7")) && (
                <Col md={6} lg={4} xl={3} sm={12}>
                  {/* <Marker />
            <Typography>{'\u00A0'}Max Twin</Typography> */}
                  <Head>{`No. of ${memberRelation.includes("5") ? "Parents" : ""
                    } ${memberRelation.includes("5") && memberRelation.includes("7")
                      ? "&"
                      : ""
                    } ${memberRelation.includes("7") ? "Parents in Law" : ""
                    }`}</Head>
                  <Text>{policyData?.max_parents || "0"}</Text>
                </Col>
              )}
              {(memberRelation.includes("9")) && (
                <Col md={6} lg={4} xl={3} sm={12}>
                  <Head>No. of Sibling</Head>
                  <Text>{policyData?.no_of_siblings || "1"}</Text>
                </Col>
              )}
              {/* {memberRelation.includes('4') &&
            <Col md={6} lg={4} xl={3} sm={12}>
              <Head>No. of Son</Head>
              <Text>{policyData?.ageDetails.find((elem) => elem.relation_id === 4)?.no_of_relation || '1'}</Text>
            </Col>
          } */}
            </Row>
          </>
        )}
      {(memberRelation.includes("2") ||
        memberRelation.includes("10") ||
        memberRelation.includes("3") ||
        memberRelation.includes("4")) &&
        !!(policyData?.is_midterm_enrollement_allowed_for_spouse ||
          policyData?.is_midterm_enrollement_allowed_for_partner ||
          policyData?.is_midterm_enrollement_allowed_for_kids) && (
          <Row>
            <Col md={12} lg={12} xl={12} sm={12}>
              <TextCard
                className="pl-3 pt-3 pr-3 mb-4 mt-4"
                borderRadius="10px"
                noShadow
                border="1px dashed #929292"
                bgColor="#f8f8f8"
              >
                {!!policyData.is_midterm_enrollement_allowed_for_spouse && <>
                  <Marker />
                  <Typography>
                    {"\u00A0"} Midterm Allowed for Spouse{" "}
                  </Typography>
                  <br />
                  {!!policyData.default_midterm_enrollement_days_for_spouse && (
                    <Title fontSize="0.9rem" color="#4da2ff">
                      <i className="ti-arrow-circle-right mr-2" />
                      Spouse Midterm Enrolment Days{" "}
                      {policyData.default_midterm_enrollement_days_for_spouse}
                    </Title>
                  )}
                  <br />
                  {!!policyData.midterm_premium_calculation_from_for_spouse && (
                    <Title fontSize="0.9rem" color="#4da2ff">
                      <i className="ti-arrow-circle-right mr-2" />
                      Spouse Midterm Premium Calculation From{" "}
                      {
                        MidtermEnrollment(true)[
                          policyData.midterm_premium_calculation_from_for_spouse - 1
                        ]?.name
                      }
                    </Title>
                  )}
                  <br />
                </>}
                {!!policyData.is_midterm_enrollement_allowed_for_partner && <>
                  <Marker />
                  <Typography>
                    {"\u00A0"} Midterm Allowed for Partner{" "}
                  </Typography>
                  <br />
                  {/* {!!policyData.default_midterm_enrollement_days_for_partner && (
                    <Title fontSize="0.9rem" color="#4da2ff">
                      <i className="ti-arrow-circle-right mr-2" />
                      Partner Midterm Enrolment Days{" "}
                      {policyData.default_midterm_enrollement_days_for_partner}
                    </Title>
                  )}
                  <br /> */}
                  {!!policyData.midterm_premium_calculation_from_for_partner && (
                    <Title fontSize="0.9rem" color="#4da2ff">
                      <i className="ti-arrow-circle-right mr-2" />
                      Partner Midterm Premium Calculation From{" "}
                      {
                        MidtermEnrollment(false, true)[
                          policyData.midterm_premium_calculation_from_for_partner - 1
                        ]?.name
                      }
                    </Title>
                  )}
                  <br />
                </>}
                {!!policyData.is_midterm_enrollement_allowed_for_kids && <>
                  <Marker />
                  <Typography>
                    {"\u00A0"} Midterm Allowed for Children{" "}
                  </Typography>
                  <br />
                  {!!policyData.default_midterm_enrollement_days_for_kids && (
                    <Title fontSize="0.9rem" color="#4da2ff">
                      <i className="ti-arrow-circle-right mr-2" />
                      Children Midterm Enrolment Days{" "}
                      {policyData.default_midterm_enrollement_days_for_kids}
                    </Title>
                  )}
                  <br />
                  {!!policyData.midterm_premium_calculation_from_for_kids && (
                    <Title fontSize="0.9rem" color="#4da2ff">
                      <i className="ti-arrow-circle-right mr-2" />
                      Children Midterm Premium Calculation From{" "}
                      {
                        MidtermEnrollment(false)[
                          policyData.midterm_premium_calculation_from_for_kids - 1
                        ]?.name
                      }
                    </Title>
                  )}
                </>}
              </TextCard>
            </Col>
          </Row>
        )}
      {!!(
        policyData?.has_special_child &&
        (memberRelation.includes("3") || memberRelation.includes("4"))
      ) && (
          <>
            <Marker />
            <Typography>{"\u00A0"}Special Child</Typography>
            <Row className="d-flex flex-wrap">
              <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Premium</Head>
                <Text>{policyData?.special_child_additional_premium ?? "-"}</Text>
              </Col>
              <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Employee Contribution</Head>
                <Text>
                  {policyData?.special_child_employee_contribution ?? "-"}
                </Text>
              </Col>
              <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Employer Contribution</Head>
                <Text>
                  {policyData?.special_child_employer_contribution ?? "-"}
                </Text>
              </Col>
            </Row>
          </>
        )}

      {!!(
        policyData?.has_unmarried_child &&
        (memberRelation.includes("3") || memberRelation.includes("4"))
      ) && (
          <>
            <Marker />
            <Typography>{"\u00A0"}Unmarried Child</Typography>
            <Row className="d-flex flex-wrap">
              <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Premium</Head>
                <Text>{policyData?.unmarried_child_premium ?? "-"}</Text>
              </Col>
              <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Employee Contribution</Head>
                <Text>
                  {policyData?.unmarried_child_employee_contribution ?? "-"}
                </Text>
              </Col>
              <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Employer Contribution</Head>
                <Text>
                  {policyData?.unmarried_child_employer_contribution ?? "-"}
                </Text>
              </Col>
              <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Unmarried Child Max Age</Head>
                <Text>{policyData?.unmarried_min_age ?? "-"}</Text>
              </Col>
            </Row>
          </>
        )}

      {memberRelation.filter((elem) => ["3", "4"].includes(elem)).length >=
        1 && (
          <>
            <Marker />
            <Typography>{"\u00A0"}Max Twin</Typography>
            <Row className="d-flex flex-wrap">
              <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Max Twin Allowed</Head>
                <Text>{policyData?.ageDetails[0].max_twins ?? "0"}</Text>
              </Col>
            </Row>
            <Marker />
            <Typography>{"\u00A0"}Adopted Kids</Typography>
            <Row className="d-flex flex-wrap">
              <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Adopted Kids Allowed ?</Head>
                <Text>{policyData?.has_adopted_child ? "Yes" : "No"}</Text>
              </Col>
            </Row>
          </>
        )}

      {memberRelation.includes("5") &&
        // memberRelation.includes('6') &&
        memberRelation.includes("7") && (
          // &&memberRelation.includes('8')
          <>
            <Marker />
            <Typography>{"\u00A0"}Parent Cross Selection</Typography>
            <Row className="d-flex flex-wrap">
              <Col md={6} lg={3} xl={3} sm={12}>
                <Head>Has Parent Cross Selection</Head>
                <Text>
                  {policyData?.has_parent_cross_selection ? "Yes" : "No"}
                </Text>
              </Col>
            </Row>
          </>
        )}
      <Row>
        <Col md={12} className="d-flex justify-content-end mt-4">
          <Button type="button" onClick={nextPage}>
            Next
          </Button>
        </Col>
      </Row>
    </>
  );
};
