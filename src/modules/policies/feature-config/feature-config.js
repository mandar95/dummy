import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import {
  Card,
  Loader,
  NoDataFound,
  IconlessCard,
} from "components";
import _ from "lodash";
import swal from "sweetalert";
import {
  fetchBrokers,
  fetchEmployers,
  fetchPolicies, setPageData, clearDD
} from "modules/networkHospital_broker/networkhospitalbroker.slice";
import {
  selectPolicySubType,
  getPolicySubTypeData,
  clear as policyTypeClear
} from "modules/EndorsementRequest/EndorsementRequest.slice";
import {
  getFeatures,
  clear,
  deleteFeature,
  getRater
} from "modules/policies/policy-config.slice";
import { TableData, TableDataUpload } from "./helper";
import { DataTable } from "modules/user-management/index";
import ModalComponent from "../../master-config/AddModal";
import httpClient from "api/httpClient";
import FeatureForm from "./Forms/feature-form";
import { Prefill } from "../../../custom-hooks/prefill";
import { DateFormate } from "../../../utils";

const FeatureConf = ({ myModule }) => {
  const [uploadFeatureData, setUploadFeatureData] = useState([]);
  const dispatch = useDispatch();
  const { userType: userTypeName, currentUser } = useSelector(
    (state) => state.login
  );
  async function FeatureFetch(p) {
    try {
      const { data } = await httpClient("/broker/get/error-sheet", {
        method: "POST",
        data: {
          broker_id: p,
          document_type_id: 17,
          is_super_hr: currentUser.is_super_hr
        },
      });
      setUploadFeatureData((uploadFeatureData) => data.data.map((elem) => ({ ...elem, uploaded_at: DateFormate(elem.uploaded_at, { type: "withTime" }) })));
    } catch (err) {
      console.error(err.message);
    }
  }

  useEffect(() => {
    FeatureFetch(currentUser?.broker_id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  const { brokers, employers, policies,
    firstPage,
    lastPage, } = useSelector(
      (state) => state.networkhospitalbroker
    );
  const { success, error, loading, featureData } = useSelector(
    (state) => state.policyConfig
  );

  const { SIType } = useSelector((state) => state.policyConfig);

  const PolicyTypeResponse = useSelector(selectPolicySubType);

  const [planModal, setPlanModal] = useState(false);
  const [modalShow, setModalShow] = useState(false);
  const [UpdatePlanModal, setUpdatePlanModal] = useState(false);

  const [tab, setTab] = useState("view");
  const { control, errors, watch, setValue } = useForm({});

  const policyId = (watch("policy_id") || {})?.id;
  useEffect(() => {
    if (!loading && error) {
      swal("Alert", error, "warning");
    }
    if (!loading && success) {
      swal('Success', success, "success").then(() =>
        dispatch(
          getFeatures({
            policy_id: policyId,
          })
        )
      );
    }

    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading]);

  function getRecallAfterExcelUpload(p, status = "not") {
    dispatch(
      getFeatures({
        policy_id: p,
        status: status
      })
    );
  }
  useEffect(() => {
    if (policyId) {
      dispatch(
        getRater({
          policy_id: policyId,
        })
      );
      dispatch(
        getFeatures({
          policy_id: policyId,
        })
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyId]);

  //get broker
  useEffect(() => {
    if (userTypeName === "Admin" || userTypeName === "Super Admin") {
      dispatch(fetchBrokers(userTypeName));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userTypeName]);

  const brokerId = (watch("broker_id") || {})?.id;
  /*-x-broker ID -x-*/

  /*---Employer ID ---*/
  //get employer
  useEffect(() => {
    return () => {
      dispatch(setPageData({
        firstPage: 1,
        lastPage: 1
      }))

      dispatch(clearDD('employer'))
      dispatch(clearDD('policyST'))
      dispatch(clearDD('policy'))
      dispatch(policyTypeClear('broker'))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  useEffect(() => {
    if ((currentUser?.broker_id || brokerId) && userTypeName !== "Employee") {
      if (lastPage >= firstPage) {
        var _TimeOut = setTimeout(_callback, 250);
      }
      function _callback() {
        dispatch(fetchEmployers({ broker_id: currentUser?.broker_id || brokerId }, firstPage));
      }
      return () => {
        clearTimeout(_TimeOut)
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [firstPage, brokerId, currentUser]);

  const employerId = (watch("employer_id") || {})?.id;

  //get policy type id
  useEffect(() => {
    if (currentUser?.employer_id || employerId) {
      dispatch(
        getPolicySubTypeData({
          employer_id: currentUser?.employer_id || employerId,
        })
      );
      return () => {
        dispatch(clearDD('policy'))
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser, employerId]);

  const policyTypeID = (watch("policy_sub_type_id") || {})?.id;
  //get policy id
  useEffect(() => {
    if (policyTypeID && (currentUser?.employer_id || employerId)) {
      dispatch(
        fetchPolicies({
          user_type_name: userTypeName,
          employer_id: currentUser?.employer_id || employerId,
          policy_sub_type_id: policyTypeID,
          ...(currentUser.broker_id && { broker_id: currentUser.broker_id }),
        }, true)
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [policyTypeID]);

  // Prefill 
  Prefill((currentUser.is_super_hr && currentUser.child_entities.length) ? currentUser.child_entities : employers, setValue, 'employer_id')
  Prefill(PolicyTypeResponse?.data?.data, setValue, 'policy_sub_type_id')
  Prefill(policies, setValue, 'policy_id', 'number')


  const onRemovePlan = (id) => {
    dispatch(deleteFeature(id));
  };

  const onEdit = (id, data) => {
    setUpdatePlanModal(data);
    // setPlanModal(data);

  };
  const render = (status) => {
    if (_.isEqual(status, "Processing")) {
      var _TimeOut = setTimeout(_callback, 10000);
    }
    function _callback() {
      FeatureFetch(currentUser?.broker_id);
      policyId && getRecallAfterExcelUpload(policyId, "Processing");
    }
    return () => {
      clearTimeout(_TimeOut)
    }
  }
  useEffect(() => {
    if (!_.isEmpty(uploadFeatureData?.filter(data => data?.status === "Processing"))) {
      render("Processing");
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [uploadFeatureData])
  return (
    <>
      <Card
        title={
          <>
            <div className="d-flex justify-content-between">
              <span>Feature Configurator</span>
            </div>
          </>
        }
      >
        <FeatureForm
          userTypeName={userTypeName} control={control} errors={errors} setValue={setValue}
          brokers={brokers} employers={employers} PolicyTypeResponse={PolicyTypeResponse} policies={policies}
          policyId={policyId} setTab={setTab} tab={tab} setPlanModal={setPlanModal}
          setModalShow={setModalShow} featureData={featureData} SIType={SIType}
          myModule={myModule} planModal={planModal} dispatch={dispatch}
          onRemovePlan={onRemovePlan} setUpdatePlanModal={setUpdatePlanModal} UpdatePlanModal={UpdatePlanModal}
        />
        {tab === "view" &&
          !_.isEmpty(featureData) && policyId ? (
          <DataTable
            columns={TableData(SIType, !!(myModule?.candelete || myModule?.canwrite), featureData.some(({ suminsured, no_of_times_of_salary }) => SIType ? suminsured : no_of_times_of_salary))}
            data={featureData}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            rowStyle
            deleteFlag={!!myModule?.candelete && "custom_delete"}
            removeAction={deleteFeature}
            EditFlag={!!myModule?.canwrite}
            EditFunc={onEdit}
            autoResetPage={false}
          />
        ) : policyId && <NoDataFound text="No Data Found" />}
        {modalShow && (
          <ModalComponent
            getRecallAfterExcelUpload={getRecallAfterExcelUpload}
            FeatureFetch={FeatureFetch}
            featurePolicyId={policyId}
            component={"feature-config"}
            show={modalShow}
            onHide={() => setModalShow(false)}
          />
        )}
        {loading && <Loader />}
      </Card>
      {!_.isEmpty(uploadFeatureData) && policyId && <IconlessCard title={"Upload Features Table"}>
        {!_.isEmpty(uploadFeatureData) && policyId ? (
          <DataTable
            columns={TableDataUpload}
            data={uploadFeatureData}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            autoResetPage={false}
            rowStyle
          />
        ) : (
          <>{policyId && <NoDataFound text="No Data Found" />}</>
        )}
      </IconlessCard>}
    </>
  );
};
export default FeatureConf;
