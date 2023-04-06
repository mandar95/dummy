import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { useHistory, useParams } from "react-router";

import { useForm, Controller } from "react-hook-form";
import { TabWrapper, Tab, Loader } from "components";
import { useMediaPredicate } from "react-media-hook";

import { useDispatch, useSelector } from 'react-redux';
import { loadOptions, approvePolicy, clearPolicyData, loadPolicy, clear, policyApproved, clearApproved, clear_broker_id } from './approve-policy.slice';
import { loadRelationMaster, getEmployerUserForContactDetails, checkEmployerInstallment, employerInstallment, loadBrokerBranch } from '../policy-config.slice';
import { PolicyDetail } from './PolicyDetail/PolicyDetail';
import { FamilyConstruct } from './FamilyConstruct/FamilyConstruct';
import { Rater } from './Rater/Rater';
import { CDBalance } from './CdBalance/CDBalance';
import { ClaimDocument } from './ClaimDocument/ClaimDocument';
import { Decrypt } from '../../../utils';
import { getUserDataDropdown } from "modules/user-management/user.slice";
import _ from 'lodash';



const ApprovePolicy = () => {

  const history = useHistory();
  const { userType, id } = useParams();
  const policy_id = Decrypt(id)
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("Policy");
  const [myModule, setMyModule] = useState({});
  const { options, loading, error, success, policyData, approved, broker_id } = useSelector(approvePolicy);
  const { familyLabels } = useSelector(state => state.policyConfig);
  const { userType: userTypeName, currentUser, modules } = useSelector(state => state.login);
  const Max767 = useMediaPredicate("(max-width: 767px)");

  const { control, errors, reset } = useForm({
    // validationSchema
  });

  useEffect(() => {
    if (modules) {
      const thisModule = modules?.find((elem) => ['/broker/policies', '/employer/policies'].includes(elem.url))
      if (!thisModule?.canread &&
        !history?.location?.pathname.includes('/policy-renew/') &&
        !history?.location?.pathname.includes('/policy-create/')) {
        history.replace('/home')
      }
      setMyModule(thisModule)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modules])


  useEffect(() => {
    if (!_.isEmpty(policyData)) {
      dispatch(getEmployerUserForContactDetails(policyData?.employer_id));
      dispatch(checkEmployerInstallment({ employer_id: policyData.employer_id }, policyData.id));
    }
    return () => dispatch(employerInstallment([]));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyData])

  useEffect(() => {
    if (currentUser?.broker_id) {
      dispatch(loadBrokerBranch(currentUser?.broker_id))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  useEffect(() => {
    if (userTypeName) {
      if ((userType === "broker" || (userType === "admin" && broker_id)) && ['Super Admin', 'Broker'].includes(userTypeName)) {
        dispatch(loadOptions(broker_id));
        dispatch(loadPolicy(policy_id));
        dispatch(loadRelationMaster());
        dispatch(
          getUserDataDropdown({
            status: 1,
            type: "users",
            currentUser: userTypeName,
            per_page: 10000,
            is_super_hr: currentUser.is_super_hr
          }))
      }
      else if (userType === "employer" && userTypeName === 'Employer') {
        dispatch(loadOptions(currentUser.broker_id));
        dispatch(loadPolicy(policy_id));
        dispatch(loadRelationMaster());

      } else {
        history.replace(`/${userType}/policies`);
      }

    }

    return () => {
      dispatch(clearPolicyData());
      dispatch(clear_broker_id());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType, broker_id, userTypeName])


  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success");
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);

  useEffect(() => {
    if (approved) {
      history.replace(`/${userType}/policies`);
    }

    return () => { dispatch(clearApproved()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [approved])

  const formatDate = (date) => {
    var d = new Date(date),
      month = '' + (d.getMonth() + 1),
      day = '' + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2)
      month = '0' + month;
    if (day.length < 2)
      day = '0' + day;

    return [year, month, day].join('-');
  }

  const noGMPolicy = [2, 3, 5, 6].includes(policyData.policy_sub_type_id)

  const onLastSubmit = () => {
    return swal({
      title: "Go Live?",
      text: "Make this policy live!",
      icon: "warning",
      buttons: {
        cancel: "Cancel",
        catch: {
          text: "Approved Only!",
          value: "approve",
        },
        live: 'Approved & Live'
      },
      dangerMode: true,
    })
      .then((caseValue) => {
        switch (caseValue) {
          case "live":
            dispatch(policyApproved(policyData.id || policy_id, 1));
            break;
          case "approve":
            dispatch(policyApproved(policyData.id || policy_id, 3));
            break;
          default:
        }
      })
  }

  const nextPage = () => {
    switch (filter) {
      case 'Policy': setFilter('Family');
        break;
      case 'Family': setFilter('Rater');
        break;
      case 'Rater': setFilter('CD');
        break;
      case 'CD': noGMPolicy ? onLastSubmit() : setFilter('Claim');
        break;
      case 'Claim':
        onLastSubmit();
        break;
      default: setFilter('Policy');
    }
  }

  return (
    <>
      <TabWrapper width={'max-content'}>
        <Tab isActive={Boolean(filter === "Policy")} onClick={() => setFilter("Policy")}>
          {Max767 ? '1' : 'Policy Detail'}
        </Tab>
        <Tab isActive={Boolean(filter === "Family")} onClick={() => setFilter("Family")}>
          {Max767 ? '2' : 'Family Construct'}
        </Tab>
        <Tab isActive={Boolean(filter === "Rater")} onClick={() => setFilter("Rater")}>
          {Max767 ? '3' : 'Rater (SI & Premium)'}
        </Tab>
        <Tab isActive={Boolean(filter === "CD")} onClick={() => setFilter("CD")}>
          {Max767 ? '4' : 'CD Balance & Contact Details'}
        </Tab>
        {!noGMPolicy && <Tab isActive={Boolean(filter === "Claim")} onClick={() => setFilter("Claim")}>
          {Max767 ? '5' : 'Claim Document'}
        </Tab>}
      </TabWrapper>
      {(filter === "Policy") &&
        <PolicyDetail
          control={control}
          errors={errors}
          Controller={Controller}
          formatDate={formatDate}
          userType={userType}
          options={options}
          nextPage={nextPage}
          reset={reset} />}
      {(filter === "Family") &&
        <FamilyConstruct
          control={control}
          errors={errors}
          Controller={Controller}
          formatDate={formatDate}
          userType={userType}
          options={{ ...options, familyLabels }}
          nextPage={nextPage}
          reset={reset} />
      }
      {(filter === "Rater") &&
        <Rater
          control={control}
          errors={errors}
          Controller={Controller}
          formatDate={formatDate}
          userType={userType}
          options={options}
          nextPage={nextPage}
          reset={reset} />
      }
      {(filter === "CD") &&
        <CDBalance
          myModule={myModule}
          control={control}
          errors={errors}
          Controller={Controller}
          formatDate={formatDate}
          userType={userType}
          options={options}
          nextPage={nextPage}
          reset={reset} />
      }
      {(filter === "Claim") &&
        <ClaimDocument
          myModule={myModule}
          control={control}
          errors={errors}
          Controller={Controller}
          formatDate={formatDate}
          userType={userType}
          options={options}
          nextPage={nextPage}
          reset={reset} />
      }
      {
        loading && <Loader />
      }
    </>
  )
}

export default ApprovePolicy;
