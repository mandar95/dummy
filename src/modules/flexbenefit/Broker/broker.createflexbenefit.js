import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Controller, useForm } from "react-hook-form";
import { Card, Select, NoDataFound, Loader } from "../../../components";
import swal from "sweetalert";
import { Button as Btn } from "react-bootstrap";
import AddBenefitsModal from "./add-benefits.js";
import { DateFormate, getFirstError } from "../../../utils";
import {
  getEmployersData,
  getFlexData,
  selectFlexresp,
  selectAllocateFlex,
  loadBroker,
  deleteBenefitsData,
  clear,
} from "../flexbenefit.slice";
import { useParams } from "react-router-dom";

import { DataTable } from "../../user-management/index";
import { TableData } from "./helper";

const BrokerCreateFlex = () => {
  const { userType } = useParams();
  //selectors
  const dispatch = useDispatch();
  // const employerResp = useSelector(selectEmployerDataresp);
  const { success, error, loading } = useSelector((state) => state.flexbenefit);
  const { currentUser } = useSelector((state) => state.login);
  const { globalTheme } = useSelector(state => state.theme)

  const allocateResp = useSelector(selectAllocateFlex);
  const { handleSubmit, control, watch } = useForm();

  const flexResp = useSelector(selectFlexresp);
  const [show, setShow] = useState({
    isShow: false,
    isBulkUpload: false,
    isEditData: false,
  });
  const [editData, setEditData] = useState(null);

  const [alert, setAlert] = useState(null);
  const _filterType = watch("filter_type");

  useEffect(() => {
    if (_filterType) {
      dispatch(
        getFlexData({
          type: _filterType,
        })
      );
    }
    //eslint-disable-next-line
  }, [_filterType]);

  //api calls --------------------------
  useEffect(() => {
    if (userType === "admin") {
      dispatch(loadBroker());
    }
    dispatch(
      getFlexData({
        type: "W",
      })
    );
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (currentUser.broker_id && userType === "broker") {
      dispatch(getEmployersData(currentUser.broker_id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);
  //------------------------------------

  //onSubmit----------------------------
  const onSubmit = (data) => { };
  //------------------------------------

  //alert------------------------------
  useEffect(() => {
    if (alert === 1) {
      if (allocateResp?.data?.status) {
        swal(allocateResp?.data?.message, "", "success");
        setAlert(0);
      } else {
        let error =
          allocateResp?.data?.errors &&
          getFirstError(allocateResp?.data?.errors);
        error = error
          ? error
          : allocateResp?.data?.message
            ? allocateResp?.data?.message
            : "Something went wrong";
        swal("", error, "warning");
        setAlert(0);
      }
    }
    //eslint-disable-next-line
  }, [allocateResp]);

  useEffect(() => {
    if (success) {
      swal(success, "", "success").then(() => {
        dispatch(
          getFlexData({
            type: _filterType,
          })
        );
      });
    }
    if (error) {
      swal("Alert", error, "warning");
    }
    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error]);

  const EditTATQueryData = (id, data) => {
    setEditData(data);
    setShow({
      isShow: true,
      isBulkUpload: false,
      isEditData: true,
    });
  };

  //card title------------------
  const title = (
    <div style={{ display: "flex", width: "100%", marginTop: "4px" }}>
      <span style={{ width: "90%" }}>Select Benefits</span>
      <div style={{ display: "flex", justifyContent: "flex-end" }}>
        <Btn
          size="sm"
          varient="primary"
          onClick={() => {
            setShow({
              isShow: true,
              isBulkUpload: false,
              isEditData: false,
            });
          }}
        >
          <span style={{ fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px' }}>Add Benefits</span>
        </Btn>
      </div>
    </div>
  );
  //-----------------------

  return (
    <>
      <Card title={title}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
            }}
            className="row"
          >
            <div className="col-xl-4 col-lg-5 col-md-12 col-sm-12">
              <Controller
                as={
                  <Select
                    required={false}
                    isRequired={false}
                    label="Filter"
                    placeholder="Select Option"
                    options={[
                      // { id: 1, name: "Voluntary", value: "V" },
                      { id: 0, name: "Wellness", value: "W" },
                    ]}
                  />
                }
                name="filter_type"
                control={control}
                defaultValue={"W"}
              />
            </div>
          </div>
        </form>
        {flexResp?.data?.data.length > 0 ? (
          <DataTable
            columns={TableData}
            data={flexResp?.data?.data?.map(elem => ({
              ...elem,
              created_at: DateFormate(elem.created_at),
              updated_at: DateFormate(elem.updated_at),
              status: elem.status === 1 ? 'Active' : 'In Active',
              flex_allocation_type: elem.flex_allocation_type === 1 ? 'Monthly' : 'Yearly',
              wellness_type: elem.type === 'W' ? "Wellness" : "Voluntry",


            })) || []}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            rowStyle
            deleteFlag={"custom_delete"}
            removeAction={deleteBenefitsData}
            EditFlag
            EditFunc={EditTATQueryData}
          />
        ) : (
          <NoDataFound text="No Data Found" />
        )}
      </Card>

      <AddBenefitsModal
        style={{ transition: " opacity .25s linear " }}
        show={show}
        onHide={() => {
          setShow({
            isShow: false,
            isBulkUpload: false,
          });
          setEditData(null)
        }
        }
        _editData={editData}
      />
      {loading && <Loader />}
    </>
  );
};

export default BrokerCreateFlex;
