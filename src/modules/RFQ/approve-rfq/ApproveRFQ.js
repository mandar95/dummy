import React, { useState, useEffect } from 'react';
import swal from 'sweetalert';
import { useHistory, useParams } from "react-router";

import { TabWrapper, Tab, Loader } from "components";
import { BasicDetail } from './basic-detail/BasicDetail';
import { BucketDetail } from './bucket-detail/BucketDetail';
import { ProductFeature } from './product-feature/ProductFeature';
import { RateDetail } from './rate-detail/RateDetail';
import { FamilyDetail } from './family-detail/FamilyDetail'

import { useDispatch, useSelector } from 'react-redux';
import { loadRfq, loadRfqConfig, updateRfq, loadBuckets, clear } from '../rfq.slice';
import { loadRelationMaster } from 'modules/policies/policy-config.slice';
import { Decrypt } from '../../../utils';


export const ApproveRFQ = () => {

  const history = useHistory();
  let { userType, id } = useParams();
  id = Decrypt(id)
  const dispatch = useDispatch();
  const [filter, setFilter] = useState("Basic");
  const { configs, loading, error, success, riskBuckets, insurer_id } = useSelector(state => state.rfq);
  const { currentUser } = useSelector(state => state.login);
  const { familyLabels } = useSelector(state => state.policyConfig);


  useEffect(() => {
    if ((userType === "insurer" && currentUser?.ic_id) || (userType === "admin" && insurer_id)) {
      dispatch(loadRfq({ ic_id: currentUser.ic_id || insurer_id, ic_plan_id: id }));
      dispatch(loadBuckets({ ic_id: currentUser.ic_id || insurer_id }));

    }
    if ((userType === "broker" && currentUser?.broker_id)) {
      dispatch(loadRfq({ broker_id: currentUser?.broker_id, ic_plan_id: id }));
      dispatch(loadBuckets({ broker_id: currentUser?.broker_id }));

    }
    dispatch(loadRfqConfig());
    dispatch(loadRelationMaster());
    // dispatch(loadFeatures())
    if (!insurer_id && userType === "admin") {
      history.push(`/${userType}/uwquote-view`);
    }

    return () => {
      // dispatch(clearPolicyData());
      // dispatch(clear_broker_id());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    };
    if (!loading && success) {
      swal('Success', success, "success");
    };

    return () => { dispatch(clear()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error]);


  const nextPage = () => {
    switch (filter) {
      case 'Basic': setFilter('Family');
        break;
      case 'Family': setFilter('Industry');
        break;
      case 'Industry': setFilter('Feature');
        break;
      case 'Feature': setFilter('Rater');
        break;
      case 'Rater':
        swal({
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
                dispatch(updateRfq({
                  status: 1,
                  step: 1,
                  ic_plan_id: id,
                  broker_id: currentUser.broker_id
                }, {
                  ic_plan_id: id,
                  ic_id: currentUser.ic_id || insurer_id,
                  broker_id: currentUser.broker_id
                }))

                break;
              case "approve":
                dispatch(updateRfq({
                  status: 3,
                  step: 1,
                  general_rfq_id: id,
                  ic_plan_id: id,
                }, {
                  ic_plan_id: id,
                  ic_id: currentUser.ic_id || insurer_id,
                  broker_id: currentUser.broker_id
                }))

                break;
              default:
            }
          })
        break;
      default: setFilter('Basic');
    }
  }

  return (
    <>
      <TabWrapper width='max-content'>
        <Tab isActive={Boolean(filter === "Basic")} onClick={() => setFilter("Basic")}>
          Basic Detail
        </Tab>
        <Tab isActive={Boolean(filter === "Family")} onClick={() => setFilter("Family")}>
          Family Detail
        </Tab>
        <Tab isActive={Boolean(filter === "Industry")} onClick={() => setFilter("Industry")}>
          Industry Detail
        </Tab>
        <Tab isActive={Boolean(filter === "Feature")} onClick={() => setFilter("Feature")}>
          Product Feature
        </Tab>
        <Tab isActive={Boolean(filter === "Rater")} onClick={() => setFilter("Rater")}>
          Rater (SI & Premium)
        </Tab>
      </TabWrapper>

      {(filter === "Basic") &&
        <BasicDetail
          userType={userType}
          ic_id={currentUser.ic_id || insurer_id}
          broker_id={currentUser.broker_id}
          ic_plan_id={id}
          options={configs}
          nextPage={nextPage} />}

      {(filter === "Family") &&
        <FamilyDetail
          userType={userType}
          ic_id={currentUser.ic_id || insurer_id}
          broker_id={currentUser.broker_id}
          ic_plan_id={id}
          options={{ ...configs, familyLabels }}
          nextPage={nextPage} />
      }

      {(filter === "Industry") &&
        <BucketDetail
          userType={userType}
          ic_id={currentUser.ic_id || insurer_id}
          broker_id={currentUser.broker_id}
          ic_plan_id={id}
          riskBuckets={riskBuckets}
          options={configs}
          nextPage={nextPage} />
      }

      {(filter === "Feature") &&
        <ProductFeature
          userType={userType}
          ic_id={currentUser.ic_id || insurer_id}
          broker_id={currentUser.broker_id}
          ic_plan_id={id}
          options={configs}
          nextPage={nextPage} />
      }

      {(filter === "Rater") &&
        <RateDetail
          userType={userType}
          ic_id={currentUser.ic_id || insurer_id}
          broker_id={currentUser.broker_id}
          ic_plan_id={id}
          options={configs}
          dispatch={dispatch}
          nextPage={nextPage} />
      }

      {loading && <Loader />}
    </>
  )
}

