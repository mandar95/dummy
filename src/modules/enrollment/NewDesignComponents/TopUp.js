import React, { useState, useEffect } from "react";
import swal from "sweetalert";
import styled from "styled-components";

import { Row, Col } from "react-bootstrap";
import { TabWrapper, Tab, Marker, Typography, Button } from "components";
import { Head, OptionInput, Div } from "modules/enrollment/style";
import { CardContentConatiner } from "modules/Insurance/style";

import { Controller, useForm } from "react-hook-form";
import Avatar from "./subComponent/Avatar2";
import { comma } from "./ForthStep";
import classesa from "../../contact-us/index.module.css";
import {
  validatePremium,
  addTopup,
  resetTopup,
  // initialState
} from './enrolment.action';
import { ModuleControl } from "../../../config/module-control";
import { useSelector } from "react-redux";
import { differenceInMonths } from "date-fns";
import { set_installments } from "../enrollment.slice";

const NotTATA = !ModuleControl.isTATA


export const TopUp = ({ elem, policy_id, flex_balance, dispatch, resetOptional, setResetOptional, dispatchRedux }) => {
  const { control, handleSubmit, register, setValue } = useForm();
  const [tab, setTab] = useState(
    (!!elem.has_flex && "F") || (!!elem.has_payroll && "S") || ""
  );
  const [choosed, setChoosed] = useState("");
  const [validate_premium, set_validate_premium] = useState(null);
  const [topup_premium, set_topup_premium] = useState(null);
  const { currentUser } = useSelector(state => state.login);
  const [installment, setInstallment] = useState([]);

  let premiums = elem?.premium?.split(",");
  let suminsureds = elem?.suminsured?.split(",");
  const { globalTheme } = useSelector(state => state.theme)

  if (elem?.old_suminsured && suminsureds) {
    let premiumsCopy = [];
    let suminsuredsCopy = [];
    [...suminsureds].forEach((suminsured, index) => {
      if (Number(suminsured) >= Number(elem?.old_suminsured)) {
        premiumsCopy.push(premiums[index]);
        suminsuredsCopy.push(suminsureds[index]);
      }
    });
    premiums = premiumsCopy;
    suminsureds = suminsuredsCopy;
  }

  useEffect(() => {
    if (resetOptional && +elem?.policy_id !== +resetOptional) {
      setChoosed("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resetOptional])

  const monthDifference = differenceInMonths(new Date(elem.policy_end_date || ''), new Date());

  useEffect(() => {
    if (elem?.installment) {
      const filterInstalment = elem.policy_end_date ? elem?.installment.filter(({ installment }) => monthDifference >= +installment) : elem?.installment;
      (elem?.installment_level === 1 || elem?.installment_level === undefined) ?
        dispatchRedux(set_installments(filterInstalment)) :
        setInstallment(filterInstalment);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elem])


  useEffect(() => {
    if (Number(elem?.top_up_added) === 1) {
      let premium = premiums[suminsureds.indexOf(String(elem?.top_up_suminsured))];
      addTopup(
        dispatch,
        {
          sum_insured: elem?.top_up_suminsured,
          final_amount: premium,
          flex_amount: 0,
          pay_amount: premium,
          deduction_type: elem?.deduction_type || "S",
          policy_id: elem?.policy_id,
          flexi_benefit_id: elem?.flexi_benefit_id,
          ...(Boolean(elem?.selected_installment_id) && {
            installment_id: elem?.selected_installment_id,
          }),
        },
        policy_id,
        false
      )
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [elem?.top_up_added])
  useEffect(() => {
    if (
      (elem.premium_type_id === 5 ||
        elem.premium_type_id === 6 ||
        elem.premium_type_id === 7) &&
      choosed &&
      !premiums
    ) {
      validatePremium(set_validate_premium, set_topup_premium, {
        suminsured_amt: suminsureds[choosed],
        premium_type_id: elem.premium_type_id,
        policy_id: elem?.policy_id,
      })
    }

    return () => {
      set_validate_premium(null)
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [choosed]);

  const onSubmit = (data) => {
    if (!choosed) {
      swal("Validation", "Not selected any sum-insured", "info");
      return;
    }

    if (installment?.length && !data.installment_id && elem.installment_level !== 1) {
      swal("Validation", "Not selected any installment", "info");
      return;
    }

    if (tab === "F" && Number(flex_balance?.remaining_flex_bal) === 0) {
      swal("Not enough money", "0 balance in your flex wallet", "info");
    } else if (
      tab === "F" &&
      flex_balance?.remaining_flex_bal -
      ((premiums?.length && premiums[choosed]) || topup_premium) <
      0
    ) {
      swal({
        title: "Not Enough Amount?",
        text: `You can choose ${flex_balance?.remaining_flex_bal
          } amount to be deducted from Flex Wallet and ${((premiums?.length && premiums[choosed]) || topup_premium) -
          flex_balance?.remaining_flex_bal
          } amount to be deducted from Payroll !`,
        icon: "info",
        buttons: true,
        dangerMode: true,
      }).then((submit) => {
        if (submit) {
          addTopup(
            dispatch,
            {
              sum_insured: suminsureds[choosed],
              final_amount:
                (premiums?.length && premiums[choosed]) || topup_premium,
              flex_amount: flex_balance?.remaining_flex_bal || 0,
              pay_amount:
                ((premiums?.length && premiums[choosed]) || topup_premium) -
                flex_balance?.remaining_flex_bal || 0,
              deduction_type: "F,S",
              policy_id: elem?.policy_id,
              flexi_benefit_id: elem.flexi_benefit_id,
              ...(data.installment_id && {
                installment_id: data.installment_id,
              }),
            },
            policy_id
          )
        }
      });
    } else {
      addTopup(
        dispatch,
        {
          sum_insured: suminsureds[choosed],
          final_amount:
            (premiums?.length && premiums[choosed]) || topup_premium,
          flex_amount:
            (tab === "F" &&
              ((premiums?.length && premiums[choosed]) || topup_premium)) ||
            0,
          pay_amount:
            (tab !== "F" &&
              ((premiums?.length && premiums[choosed]) || topup_premium)) ||
            0,
          deduction_type: tab || "S",
          policy_id: elem?.policy_id,
          flexi_benefit_id: elem.flexi_benefit_id,
          ...(data.installment_id && { installment_id: data.installment_id }),
        },
        policy_id
      )
    }
  };

  const removeTopup = () => {
    setChoosed("");
    resetTopup(
      dispatch,
      {
        policy_id: elem?.policy_id,
        flexi_benefit_id: elem.flexi_benefit_id,
      },
      policy_id
    );
  };

  const SelectPremium = (installment || [])?.map(
    ({ installment, id }, index) => (
      <Col md={6} lg={4} xl={3} sm={12} key={installment + id} className="p-3">
        <div
          className="card"
          style={{
            borderRadius: "18px",
            boxShadow: "rgb(179 179 179 / 35%) 1px 1px 12px 0px",
            cursor: "pointer",
          }}
          onClick={() => {
            setValue("installment_id", String(id));
          }}
        >
          <div className="card-body card-flex-em">
            <OptionInput className="d-flex">
              <input
                name={"installment_id"}
                type={"radio"}
                ref={register}
                value={id}
              //defaultChecked={index === 0 && true}
              />
              <span></span>
            </OptionInput>
            <div
              className="row rowButton2"
              style={{
                marginRight: "-15px !important",
                marginLeft: "-15px !important",
              }}
            >
              <CardContentConatiner height={"auto"}>
                <div className="col-md-12 text-center">
                  <Head>
                    {installment} month <br />{" "}
                    {!!choosed && NotTATA &&
                      `Premium ₹${calculatePremiumInstallment(
                        premiums[choosed] / installment
                      )}/month`}
                  </Head>
                </div>
              </CardContentConatiner>
            </div>
          </div>
        </div>
      </Col>
    )
  );
  return (
    <>
      <p className="pl-2" style={{ whiteSpace: 'pre-line' }}>{elem.policy_description}</p>
      <form onSubmit={handleSubmit(onSubmit)}>

        <div className="p-3 w-100">
          {!elem.top_up_added ? (
            <>
              <Marker />
              <Typography>{"\u00A0"} Select SumInsured</Typography>
              <div className="row mt-2 w-100">
                {suminsureds?.map((amount, index) => {
                  return (
                    <div key={"indextopup" + index} className={`col-12 col-lg-4`}>
                      <InputWrapper
                        style={{
                          cursor: "pointer",
                        }}
                        key={index + "sum-insured"}
                        className="custom-control custom-radio"
                        onClick={(e) => {
                          setResetOptional && setResetOptional(elem?.policy_id)
                          setChoosed(
                            Number(choosed) === index && choosed !== ""
                              ? ""
                              : String(index)
                          );
                          return e;
                        }}
                      >
                        <Controller
                          as={
                            <input
                              id={amount}
                              value={index}
                              className="custom-control-input"
                              type="radio"
                              checked={
                                Number(choosed) === index && choosed !== ""
                              }
                            />
                          }
                          name={`premium`}
                          control={control}
                        />

                        <label
                          className="custom-control-label"
                          style={{
                            fontSize: globalTheme.fontSize ? `calc(15px + ${globalTheme.fontSize - 92}%)` : '15px',
                            color: "#000000 !important",
                            fontWeight: "600",
                          }}
                          htmlFor={amount}
                        >
                        </label>

                        <div className="d-flex w-100 justify-content-around align-items-center">
                          <div>
                            <span
                              style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', fontWeight: "600" }}
                            >
                              Suminsured
                            </span>
                            <br></br>
                            <h5 className="text-danger">{`${Boolean(Number(amount))
                              ? "₹" + comma(amount)
                              : "-"
                              }`}</h5>
                          </div>
                          {!!elem?.premium && !topup_premium && (
                            <div>
                              <span
                                style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', fontWeight: "600" }}
                              >
                                Premium
                              </span>
                              <br></br>
                              <h5 className="text-danger">{`${Boolean(
                                Number(premiums[index]) ||
                                Number(topup_premium)
                              )
                                ? "₹" +
                                comma(premiums[index] || topup_premium)
                                : "-"
                                }`}</h5>
                            </div>
                          )}
                        </div>
                        {!!topup_premium &&
                          !elem?.premium &&
                          Number(choosed) === index && (
                            <div>
                              <span
                                style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px', fontWeight: "600" }}
                              >
                                Premium
                              </span>
                              <br></br>
                              <h5 className="text-danger">{`${Boolean(Number(topup_premium))
                                ? "₹" + comma(topup_premium)
                                : "-"
                                }`}</h5>
                            </div>
                          )}
                      </InputWrapper>
                    </div>
                  );
                })}
              </div>

              {!!(elem?.has_flex || elem?.has_payroll) && (
                <>
                  <Marker />
                  <Typography>
                    {"\u00A0"}
                    {elem?.has_flex && elem?.has_payroll ? "Select" : ""}{" "}
                    Insurance Premium Deduction From
                  </Typography>

                  <TabWrapper
                    style={{ zoom: "0.85" }}
                    width={'max-content'}
                  >
                    {!!elem?.has_flex && (
                      <Tab
                        isActive={Boolean(tab === "F")}
                        onClick={() => setTab("F")}
                      >
                        Wallet
                      </Tab>
                    )}
                    {!!elem?.has_payroll && (
                      <Tab
                        isActive={Boolean(tab === "S")}
                        onClick={() => setTab("S")}
                      >
                        Payroll
                      </Tab>
                    )}
                  </TabWrapper>
                  {elem?.installment_level !== 1 && !!(installment || [])?.length && (
                    <>
                      <Marker />
                      <Typography>{"\u00A0"}Premium installment</Typography>
                      <Row>{SelectPremium}</Row>
                    </>
                  )}
                </>
              )}
            </>
          ) : (
            <>
              <Marker />
              <Typography>
                {"\u00A0"} Suminsured ₹{comma(elem.top_up_suminsured)} - Premium
                ₹{comma(elem.top_up_premium)}
              </Typography>{" "}
              {ModuleControl.isUIB ? currentUser.employer_id !== 13 : true && <small>(Incl GST)</small>}
              {!!elem.selected_installment_id && (
                <>
                  <br />
                  <Marker />
                  <Typography>
                    {"\u00A0"} Premium installment -{" "}
                    {
                      installment?.find(
                        ({ id }) => id === elem.selected_installment_id
                      )?.installment
                    }{" "}
                    month
                  </Typography>
                </>
              )}
              {!!elem.memberData?.length && (
                <>
                  <br />

                  <div className="d-flex justify-content-between flex-wrap mt-4">
                    <div>
                      <Marker />
                      <Typography>
                        {"\u00A0"}Member Enrolled Into Policy
                      </Typography>
                    </div>
                  </div>
                  <Div width="92.8%" className="text-center">
                    <div className={`${classesa.autoscroll}`}>
                      <div className="d-flex flex-nowrap flex-sm-wrap w-100">
                        {elem.memberData?.map((val, index) => {
                          return (
                            <div className="d-flex flex-column" key={"topup2s" + index}>
                              <Avatar
                                name={val?.relation_name || "-"}
                                gender={val?.gender}
                                val={val}
                                elem={elem}
                                premiuma={premiums[index]}
                                premiumb={topup_premium}
                              />
                              {!!Number(val?.employee_premium) && (
                                <div
                                  className="text-center"
                                  style={{ marginTop: "-8px" }}
                                >
                                  {
                                    <>
                                      <small
                                        style={{
                                          display: "block",
                                          fontWeight: "600",
                                          fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px',
                                        }}
                                      >
                                        Annual Premium
                                      </small>
                                      <small
                                        style={{
                                          display: "block",
                                          fontWeight: "600",
                                          fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px',
                                        }}
                                      >
                                        ₹{" "}
                                        {comma(
                                          Number(val?.employee_premium)
                                        )}{" "}
                                        /-
                                      </small>
                                    </>
                                  }
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </Div>
                </>
              )}
            </>
          )}
          <br />

          <Row>
            {elem.premium_type_id === 5 ||
              elem.premium_type_id === 6 ||
              elem.premium_type_id === 7 ? (
              <Col md={12} className="d-flex justify-content-end mt-4">
                {Boolean(elem.top_up_added) && (
                  <Button
                    type="button"
                    onClick={removeTopup}
                    buttonStyle={"outline"}
                  >
                    Remove -
                  </Button>
                )}
                {!elem.top_up_added && (validate_premium || premiums) && (
                  <Button type="submit" buttonStyle={"outline"}>
                    Add Top Up +
                  </Button>
                )}
              </Col>
            ) : (
              <Col md={12} className="d-flex justify-content-end mt-4">
                {Boolean(elem.top_up_added) && (
                  <Button
                    type="button"
                    onClick={removeTopup}
                    buttonStyle={"outline"}
                  >
                    Remove -
                  </Button>
                )}
                {!elem.top_up_added && (
                  <Button type="submit" buttonStyle={"outline"}>
                    Add Top Up +
                  </Button>
                )}
              </Col>
            )}
          </Row>
        </div>
      </form>
    </>
  );
};

export function calculatePremiumInstallment(premium) {
  return String(premium).includes(".") ? premium.toFixed(2) : premium;
}

const InputWrapper = styled.div`
  position: relative;
  max-width: none;
  text-align: center;
  display: flex;
  background: #fff2e1;
  // flex-direction:column;
  padding-left: 5px;
  padding-right: 5px;
  margin-bottom: 12px;
  margin-top: 0;

  height: 80px;

  justify-content: space-around;
  border-radius: 16px;

  //  border: 1px solid #d6d6d6;
  align-items: center;

  .custom-control-input {
    position: absolute;
    top: 0;
  }

  .custom-control-label {
    &:before {
      border-radius: 100%;
      height: 20px;
      width: 20px;
      background-color: #ffc6cc;
      border: 1px solid #ff6d6d;
      margin-top: -18px;
      margin-left: 22px;
    }
  }
  .custom-control-label {
    &:after {
      left: 0px;
      top: -10px;
    }
  }

  .custom-control-label {
    &:before {
      top: -1.7rem;
      left: -1.9rem;
    }
  }

  .custom-control-input:checked ~ .custom-control-label::before {
    border-color: #ff6d6d;
    background-color: #dc3545;
    height: 20px;
    width: 20px;
  }

  .custom-control-input:checked ~ .custom-control-label::after {
    // height: 20px;
    // width: 20px;

    background-image: none !important;

    left: 0px;
    top: -33px;

    width: 6px;
    height: 10px;
    // -webkit-transition: all 1s;
    // transition: all 1s;
    border: solid rgb(255 255 255);
    border-width: 0 2px 2px 0;
    //     -webkit-transform: rotate(
    // 45deg);
    //     -ms-transform: rotate(45deg);
    //     -webkit-transform: rotate(
    // 45deg);
    //     -ms-transform: rotate(45deg);
    transform: rotate(45deg);
    zoom: 1.2;
  }

  .custom-control-label {
    padding-left: 5px;
    padding-top: 2px;
    letter-spacing: 0.3px;
    margin-top: 4px;
    color: ${({ theme }) => (theme.dark ? "#FAFAFA" : "#606060")} !important;
    

    padding-left: 8px;
    padding-top: 3px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
  }
`;
