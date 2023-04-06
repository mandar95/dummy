/* eslint-disable no-unused-vars */
/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { IconlessCard } from "components";
import { useDispatch, useSelector } from "react-redux";
import httpClient from "api/httpClient";
import { useForm, Controller } from "react-hook-form";
import { Error, SelectComponent, Button } from "components";
import {
  fetchEmployers,
  fetchPolicies,
  setPageData,
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import {
  selectPolicySubType,
  getPolicySubTypeData,
} from "modules/EndorsementRequest/EndorsementRequest.slice";
import * as yup from "yup";
import { Col } from "react-bootstrap";
import swal from "sweetalert";
// import Typeahead from "modules/policies/steps/TypeSelect.js";
import { Switch } from "../../user-management/AssignRole/switch/switch";
import classes from "./index.module.css";
import _ from "lodash";
import { serializeError } from "utils";
import { GetNomineeConfig, GetRelation, Post } from "./nominee.actions";
import CreateNominee from "./Forms/CreateNominee";
import { HeaderDiv } from "./style";
export default function NomineeConfig() {
  const {
    userType: userTypeName,
    currentUser
  } = useSelector((state) => state.login);
  const [relations, setRelations] = useState([]);
  const [outerTab, setOuterTab] = useState(false);
  const [mostOuterTab, setMostOuterTab] = useState(false);
  const [check, setCheck] = useState(false);
  const [table, setTable] = useState(false);
  const [nominee_requirement, setNomineeRequirement] = useState(3);
  const [allowed_relation_type, setAllowedRelationType] = useState(1);
  const [configurableType, setConfigurableType] = useState({});
  const [nomineeConfig, setNomineeConfig] = useState(null);
  const [employerNomineeConfig, setEmployerNomineeConfig] = useState(false);
  const dispatch = useDispatch();
  let PolicyTypeResponse = useSelector(selectPolicySubType);
  const { employers, policies,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );
  const { control, errors, handleSubmit, watch, setValue } = useForm({
    validationSchema: yup.object().shape({
      employer_id: yup.string().required().label("Employer"),
      policy_sub_type_id: yup.string().label("Policy Type"),
      policy_id: yup.string().label("Policy Id"),
    }),
    mode: "onBlur",
  });

  const employerId = watch("employer_id")?.value || currentUser?.employer_id;
  const policyTypeID = watch("policy_sub_type_id")?.value;
  const policyID = watch("policy_id")?.value;
  const nomineeRequirement = watch("nominee_requirement");
  const nomineeMandatory = watch("nomineeMandatory");
  const _policySubType = PolicyTypeResponse?.data?.data;
  //get employer
  useEffect(() => {
    GetRelation(setRelations);
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if ((currentUser?.broker_id) && userTypeName !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, currentUser?.broker_id, currentUser]);
  //get policy type id
  useEffect(() => {
    if (currentUser?.employer_id || employerId)
      dispatch(
        getPolicySubTypeData({
          employer_id: currentUser?.employer_id || employerId,
        })
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, employerId]);
  //get policy id
  useEffect(() => {
    if (policyTypeID && (currentUser?.employer_id || employerId))
      dispatch(
        fetchPolicies({
          user_type_name: userTypeName,
          employer_id: currentUser?.employer_id || employerId,
          policy_sub_type_id: policyTypeID,
          ...(currentUser.broker_id && { broker_id: currentUser.broker_id }),
        }, true)
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyTypeID, employerId]);
  useEffect(() => {
    setValue("policy_id", "");
    setCheck((check) => false);
    setAllowedRelationType(1);
    setValue("nominee_requirement", 0);
    if (Number(nomineeConfig?.nominee_requirement) === 3) {
      setNomineeRequirement(3);
    }
    if (employerId) {
      setMostOuterTab(true);
      setConfigurableType({
        configurable_type: "employer",
        configurable_id: employerId,
      });
    }
  }, [employerId]);
  useEffect(() => {
    setCheck((check) => false);
    setAllowedRelationType(1);
    setValue("nominee_requirement", 0);
    if (Number(nomineeConfig?.nominee_requirement) === 3) {
      setNomineeRequirement(3);
    }
    if (policyID) {
      setConfigurableType({
        configurable_type: "policy",
        configurable_id: policyID,
      });
      setMostOuterTab(true);
    }
  }, [policyID]);
  useEffect(() => {
    if (nomineeRequirement === 1) {
      setNomineeRequirement(2);
      setOuterTab(true);
    } else {
      setOuterTab(false);
      setNomineeRequirement(3);
      setTable(false);
    }
  }, [nomineeRequirement]);
  useEffect(() => {
    if (nomineeMandatory === 1) {
      setNomineeRequirement(1);
    } else {
      setNomineeRequirement(2);
    }
  }, [nomineeMandatory]);
  useEffect(() => {
    if (check) {
      setTable(true);
      setAllowedRelationType(2);
    } else {
      setTable(false);
      setAllowedRelationType(1);
    }
  }, [check]);
  useEffect(() => {
    if (!_.isEmpty(configurableType)) {
      GetNomineeConfig(configurableType, setNomineeConfig);
    }
  }, [configurableType]);
  useEffect(() => {
    if (configurableType?.configurable_type === "employer") {
      if (_.isEmpty(nomineeConfig)) {
        setEmployerNomineeConfig(false);
      } else {
        setEmployerNomineeConfig(true);
      }
    }
    if (Number(nomineeConfig?.nominee_requirement) === 1) {
      setValue("nominee_requirement", 1);
      // setValue("nomineeMandatory",1);
    } else if (Number(nomineeConfig?.nominee_requirement) === 2) {
      setValue("nominee_requirement", 1);
    } else if (Number(nomineeConfig?.nominee_requirement) === 3) {
      setValue("nominee_requirement", 0);
      setCheck(false);
    } else {
      setValue("nominee_requirement", 0);
    }
  }, [nomineeConfig]);
  useEffect(() => {
    if (outerTab && Number(nomineeConfig?.nominee_requirement) === 1) {
      setValue("nomineeMandatory", 1);
      if (nomineeConfig?.allowed_relations_type === 2) {
        setCheck(true);
      } else {
        setCheck(false);
      }
    } else if (outerTab && Number(nomineeConfig?.nominee_requirement) === 2) {
      setValue("nomineeMandatory", 0);
      if (nomineeConfig?.allowed_relations_type === 2) {
        setCheck(true);
      } else {
        setCheck(false);
      }
    }
  }, [outerTab, employerId]);
  useEffect(() => {
    if (table) {
      if (nomineeConfig?.allowed_relations?.length) {
        let a = nomineeConfig?.allowed_relations?.forEach((data) => {
          setValue(`triggers[${Number(data)}].to_trigger`, true);
        });
      }
    }
  }, [table]);
  const onSubmit = (data) => {
    // working on this going on
    if (employerNomineeConfig && configurableType?.configurable_type === "policy") {
      swal("Found saved configuration at corporate level, do you want to overwrite the configuration?", {
        buttons: {
          yes: 'Yes',
          no: "No"
        },
        closeOnClickOutside: false,
      }).then((value) => {
        if (value === 'yes') {
          let a = [];
          let b = [];
          let _data = {};
          if (nominee_requirement !== 3 && allowed_relation_type === 2) {
            if (
              _.isEmpty(data?.triggers?.filter((data) => data.to_trigger === true))
            ) {
              swal("warning", "Please Select Any Relation", "warning");
              return;
            }
            a = data?.triggers?.forEach((data, i) => {
              if (data.to_trigger) {
                b.push(i);
              }
            });
            _data = {
              allowed_relations: b,
            };
          }
          if (nominee_requirement !== 3) {
            _data = {
              ..._data,
              allowed_relations_type: allowed_relation_type,
            };
          }
          _data = {
            ..._data,
            configurable_type: configurableType?.configurable_type,
            configurable_id: configurableType?.configurable_id,
            nominee_requirement: nominee_requirement,
          };
          Post(_data, configurableType, setNomineeConfig);
        } else {
          return;
        }
      });
    }
    if (!employerNomineeConfig && configurableType?.configurable_type === "policy") {
      let a = [];
      let b = [];
      let _data = {};
      if (nominee_requirement !== 3 && allowed_relation_type === 2) {
        if (
          _.isEmpty(data?.triggers?.filter((data) => data.to_trigger === true))
        ) {
          swal("warning", "Please Select Any Relation", "warning");
          return;
        }
        a = data?.triggers?.forEach((data, i) => {
          if (data.to_trigger) {
            b.push(i);
          }
        });
        _data = {
          allowed_relations: b,
        };
      }
      if (nominee_requirement !== 3) {
        _data = {
          ..._data,
          allowed_relations_type: allowed_relation_type,
        };
      }
      _data = {
        ..._data,
        configurable_type: configurableType?.configurable_type,
        configurable_id: configurableType?.configurable_id,
        nominee_requirement: nominee_requirement,
      };
      Post(_data, configurableType, setNomineeConfig);
    }
    if (configurableType?.configurable_type === "employer") {
      let a = [];
      let b = [];
      let _data = {};
      if (nominee_requirement !== 3 && allowed_relation_type === 2) {
        if (
          _.isEmpty(data?.triggers?.filter((data) => data.to_trigger === true))
        ) {
          swal("warning", "Please Select Any Relation", "warning");
          return;
        }
        a = data?.triggers?.forEach((data, i) => {
          if (data.to_trigger) {
            b.push(i);
          }
        });
        _data = {
          allowed_relations: b,
        };
      }
      if (nominee_requirement !== 3) {
        _data = {
          ..._data,
          allowed_relations_type: allowed_relation_type,
        };
      }
      _data = {
        ..._data,
        configurable_type: configurableType?.configurable_type,
        configurable_id: configurableType?.configurable_id,
        nominee_requirement: nominee_requirement,
      };
      Post(_data, configurableType, setNomineeConfig);
    }
  };
  return (
    <IconlessCard isHeder={false} marginTop={"0"}>
      <HeaderDiv>
        <div className="icon">
          <i className="far fa-file-alt"></i>
        </div>
        <div>
          <p className="title">Nominee Configurator</p>
        </div>
      </HeaderDiv>
      <hr />
      <CreateNominee
        handleSubmit={handleSubmit} onSubmit={onSubmit} userTypeName={userTypeName} control={control} errors={errors}
        _policySubType={_policySubType} policies={policies} mostOuterTab={mostOuterTab} employers={employers}
        outerTab={outerTab} classes={classes} check={check} setCheck={setCheck} table={table} relations={relations}
      />
    </IconlessCard>
  );
}


