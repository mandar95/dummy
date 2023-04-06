import React, { Fragment } from "react";
import { ContactCard } from "./card";
import styled from "styled-components";
import _ from "lodash";
import classes from "./index.module.css";
const Typography = styled.div`
  margin: 2em 0.5em 0em 0.5em;
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.2em + ${fontSize - 92}%)` : '1.2em'};
  
  display: inline-block;
`;
const Marker = styled.div`
  display: inline-block;
  height: 10px;
  width: 10px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || '#d757f6'} ;
  opacity: 0.9;
`;
const Heading = styled.div`
  margin: 0em 2em;
`;

export const ContactComponent = ({ data = {}, onlyPALM_WSP }) => (
  <>
    {!_.isEmpty(data.admin_details) && (
      <>
        <Heading>
          <Marker />
          <Typography>
            {"\u00A0"}Admin - {data.admin_details.admin_name}
          </Typography>
        </Heading>
        <div className={`${classes.autoscroll}`}>
          <div className="d-flex justify-content-start flex-nowrap">
            <ContactCard
              {...{
                address_line_1: data.admin_details.admin_add_1,
                address_line_2: data.admin_details.admin_add_2,
                address_line_3: data.admin_details.admin_add_3,
                contact_1: data.admin_details.admin_contact_1,
                contact_2: data.admin_details.admin_contact_2,
                contact_3: data.admin_details.admin_contact_3,
                email_1: data.admin_details.admin_email_1,
                email_2: data.admin_details.admin_email_2,
                email_3: data.admin_details.admin_email_3,
                name_1: data.admin_details.name_1,
                name_2: data.admin_details.name_2,
                name_3: data.admin_details.name_3,
                name: data.admin_details.admin_name,
              }}
            />
          </div>
        </div>
      </>
    )}
    {!!data.broker_details?.length &&
      data.broker_details.map((broker, index) => (
        <Fragment key={"broker" + index}>
          <Heading>
            <Marker />
            {/* abhi changes */}
            <Typography>
              {"\u00A0"}
              {"Broker - " + broker.name}
            </Typography>
          </Heading>
          <div className={`${classes.autoscroll}`}>
            <div className="d-flex justify-content-start flex-nowrap">
              {!!data.broker_details?.length &&
                data.broker_details.map(
                  (broker, i) =>
                    Boolean(Number(index) === Number(i)) && (
                      <Fragment key={"b" + i}>
                        <ContactCard
                          {...(onlyPALM_WSP
                            ? {
                              address_line_1: "-",
                              address_line_2: "-",
                              address_line_3: "-",
                              contact_1: "8860005963",
                              contact_2: "9811989207",
                              contact_3: "8587875785",
                              email_1: "vikas.chauhan@palminsurance.in",
                              email_2: "neha.gulati@palminsurance.in",
                              email_3: "amit.singh@palminsurance.in",
                              name_1: "Vikas Chauhan",
                              name_2: "Neha Gulati",
                              name_3: "Amit Singh",
                            }
                            : broker)}
                        />
                      </Fragment>
                    )
                )}
            </div>
          </div>
        </Fragment>
      ))}
    {!!data.employer_details?.length &&
      data.employer_details.map((employer, index) => (
        <Fragment key={"employer" + index}>
          <Heading>
            <Marker />
            <Typography>
              {"\u00A0"}Employer - {employer.name}
            </Typography>
          </Heading>
          <div className={`${classes.autoscroll}`}>
            <div className="d-flex justify-content-start flex-nowrap">
              {!!data.employer_details?.length &&
                data.employer_details.map(
                  (employer, i) =>
                    Boolean(Number(index) === Number(i)) && (
                      <Fragment key={"e" + i}>
                        <ContactCard {...employer} />
                      </Fragment>
                    )
                )}
            </div>
          </div>
        </Fragment>
      ))}
    {!!data.tpa_details?.length &&
      data.tpa_details.map((tpa, index) => (
        <Fragment key={"tpa" + index}>
          <Heading>
            <Marker />
            <Typography>
              {"\u00A0"}TPA - {tpa.name}
            </Typography>
          </Heading>
          <div className={`${classes.autoscroll}`}>
            <div className="d-flex justify-content-start flex-nowrap">
              {!!data.tpa_details?.length &&
                data.tpa_details.map(
                  (tpa, i) =>
                    Boolean(Number(index) === Number(i)) && (
                      <Fragment key={"tpa" + i}>
                        <ContactCard
                          {...(onlyPALM_WSP
                            ? {
                              address_line_1: "-",
                              address_line_2: "-",
                              address_line_3: "-",
                              contact_1: "9599433812",
                              contact_2: "9205593457",
                              contact_3: "7042479062",
                              email_1: "corpservices2@vipulmedcorp.com",
                              email_2: "lokeshthakur@vipulmedcorp.com",
                              email_3: "khushboo@vipulmedcorp.com",
                              name_1: "Mr. Himanshu",
                              name_2: "Mr. Lokesh Thakur",
                              name_3: "Ms. Khushboo Goel",
                            }
                            : tpa)}
                        />
                      </Fragment>
                    )
                )}
            </div>
          </div>
        </Fragment>
      ))}
  </>
);
