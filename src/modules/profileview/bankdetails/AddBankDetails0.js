import React, { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { useSelector, useDispatch } from "react-redux";
import { Row } from "react-bootstrap";
import swal from "sweetalert";
import { CardBlue, Select, Input, Button } from "./../../../components";
import _ from "lodash";
import { AttachFile } from "../../core/attachFile/AttachFile";
import { getFirstError } from "../../../utils";
import { numOnly, noSpecial } from 'utils';
import {
  getbankName,
  selectbankName,
  getBankCity,
  selectBankCity,
  getBankBranch,
  selectBankBranch,
  getCityIfscByBranch,
  selectCityIfscByBranch,
  saveBankDetails,
  selectStoredBankDetails,
  getBankDetails,
  selectBankDetails,
} from "./bankDetails.slice";

const AddBankDetails = (props) => {
  const dispatch = useDispatch();

  //selectors
  const BankName = useSelector(selectbankName);
  const BankCity = useSelector(selectBankCity);
  const BankBranch = useSelector(selectBankBranch);
  const Ifsc = useSelector(selectCityIfscByBranch);
  const StoreResp = useSelector(selectStoredBankDetails);
  const PrefilledData = useSelector(selectBankDetails);

  //form
  const { handleSubmit, control } = useForm({
    defaultValues: PrefilledData?.data?.data
      ? {
        ...PrefilledData?.data?.data,
        re_entered_account_no: PrefilledData?.data?.data?.account_no,
      }
      : "",
  });

  //states
  const [bank, setBank] = useState();
  const [city, setCity] = useState();
  const [branch, setBranch] = useState();
  const [passbook, setpassbook] = useState(null);
  const [statement, setstatement] = useState(null);
  const [accNo, setAccNo] = useState(null);
  const [confirmAccNo, setConfirmAccNo] = useState(null);
  const [alert, setAlert] = useState(0);

  //API calls------
  useEffect(() => {
    dispatch(getBankDetails());
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (!_.isEmpty(PrefilledData?.data?.data)) {
      setBank(PrefilledData?.data?.data?.bank_id);
      setCity(PrefilledData?.data?.data?.bank_city);
      setBranch(PrefilledData?.data?.data?.bank_branch);
      setAccNo(PrefilledData?.data?.data?.account_no);
      setConfirmAccNo(PrefilledData?.data?.data?.account_no);
    }
  }, [PrefilledData]);

  useEffect(() => {
    dispatch(getbankName());
    //eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (bank) {
      const data = { bank_id: bank };
      dispatch(getBankCity(data));
    }
    //eslint-disable-next-line
  }, [bank]);

  useEffect(() => {
    if (city) {
      const data = { bank_id: bank, bank_city: city };
      dispatch(getBankBranch(data));
    }
    //eslint-disable-next-line
  }, [city]);

  useEffect(() => {
    if (branch && BankBranch?.data?.data) {
      const branch_name = BankBranch?.data?.data?.find(
        (item) => item?.bank_branch === branch
      );
      const data = { bank_id: bank, bank_branch: branch_name?.bank_branch };
      dispatch(getCityIfscByBranch(data));
    }
    //eslint-disable-next-line
  }, [BankBranch, branch]);
  //----------------

  //get Files-----------------------
  const getPassbookFile = (file) => {
    setpassbook(file);
  };

  const getStatementFile = (file) => {
    setstatement(file);
  };
  //--------------------------------

  //Submit function ----------------
  const onSubmit = async (data) => {
    if (String(accNo).split('').every(n => +n === 0)) {
      swal("Account number not valid", "", "warning");
      return null;
    }
    if (accNo === confirmAccNo) {
      const formdata = new FormData();
      const branch_name = BankBranch?.data?.data?.find(
        (item) => item?.bank_branch === data.bank_branch
      );
      formdata.append("branch_id", branch_name?.branch_id);
      formdata.append("account_holder_name", data.account_holder_name);
      formdata.append("account_no", data.account_no);
      if (passbook) {
        formdata.append("image", passbook[0]);
      }
      if (statement) {
        formdata.append("document", statement[0]);
      }
      dispatch(saveBankDetails(formdata));
      setAlert(1);
    } else {
      swal("Account number does not match", "", "warning");
    }
  };
  //--------------------------------

  //Alert for succesfull submission--------
  useEffect(() => {
    if (alert === 1) {
      if (StoreResp?.data?.status === true) {
        swal(StoreResp?.data?.message, "", "success");
        setAlert(0);
        props.closeAddBankComponent();
      } else {
        let error =
          StoreResp?.data?.errors && getFirstError(StoreResp?.data?.errors);
        error = error
          ? error
          : StoreResp?.data?.message
            ? StoreResp?.data?.message
            : "Something went wrong";
        swal("", error, "warning");
        setAlert(0);
      }
    }
    //eslint-disable-next-line
  }, [StoreResp]);
  //---------------------------------------

  //Validations----------------------------
  const accNoValidation = (e) => {
    if (accNo !== confirmAccNo) {
      swal("Account Number Does Not Match", "", "warning");
      setConfirmAccNo(null);
    }
  };
  //---------------------------------------
  return (
    <CardBlue title="Bank Details" round>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div style={{ marginTop: "-20px" }}>
          <Row xs={1} sm={2} md={3} lg={4}>
            <div className="p-2">
              <Controller
                as={
                  <Input
                    label="Account Holder's Name"
                    placeholder="Account Holder's Name"
                    required={true}
                  />
                }
                name="account_holder_name"
                control={control}
              />
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Input
                    label="Account Number"
                    placeholder="Enter Account Number"
                    type='password'
                    maxLength={18}
                    onKeyDown={numOnly} onKeyPress={noSpecial}
                    required={true}
                  />
                }
                onChange={([selected]) => {
                  setAccNo(selected.target.value);
                  return selected;
                }}
                name="account_no"
                control={control}
              />
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Input
                    label="Re-Enter Account Number"
                    placeholder="Account Number"
                    type='tel'
                    maxLength={18}
                    onKeyDown={numOnly} onKeyPress={noSpecial}
                    required={true}
                    value={confirmAccNo}
                  />
                }
                onBlur={([e]) => accNoValidation(e)}
                onChange={([selected]) => {
                  setConfirmAccNo(selected.target.value);
                  return selected;
                }}
                name="re_entered_account_no"
                control={control}
              />
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Select
                    label="Bank"
                    placeholder="Select Bank"
                    options={BankName?.data?.data?.map((item) => ({
                      id: item?.id,
                      name: item?.name,
                      value: item?.id,
                    }))}
                  />
                }
                onChange={([selected]) => {
                  setBank(selected.target.value);
                  return selected;
                }}
                name="bank_id"
                control={control}
              />
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Select
                    label="Bank City"
                    placeholder="Select Bank City"
                    options={BankCity?.data?.data?.map((item) => ({
                      id: item?.bank_city,
                      name: item?.bank_city,
                      value: item?.bank_city,
                    }))}
                  />
                }
                onChange={([selected]) => {
                  setCity(selected.target.value);
                  return selected;
                }}
                name="bank_city"
                control={control}
              />
            </div>
            <div className="p-2">
              <Controller
                as={
                  <Select
                    label="Bank Branch"
                    placeholder="Select Bank Branch"
                    options={BankBranch?.data?.data?.map((item) => ({
                      id: item?.bank_branch,
                      name: item?.bank_branch,
                      value: item?.bank_branch,
                    }))}
                  />
                }
                onChange={([selected]) => {
                  setBranch(selected.target.value);
                  return selected;
                }}
                name="bank_branch"
                control={control}
              />
            </div>
            <div className="p-2">
              <Input
                label="IFSC Code"
                placeholder="IFSC Code"
                value={
                  Ifsc?.data?.data?.length &&
                  (Ifsc?.data?.data[0]?.ifsc_code || "N/A")
                }
                disabled
                labelProps={{ background: 'linear-gradient(#ffffff, #dadada)' }}
              />
            </div>
          </Row>
          <div style={{ display: "flex", flexDirection: "column" }}>
            <div className="p-2">
              <AttachFile
                title="Bank Passbook"
                accept=".pdf, .jpg, .jpeg"
                key="member_sheet"
                onUpload={getPassbookFile}
                description="File Formats: (.pdf, .jpg, .jpeg)"
                nameBox
              />
            </div>
            <div className="p-2">
              <AttachFile
                title="Bank Statement"
                accept={".pdf"}
                key="member_sheet"
                onUpload={getStatementFile}
                description="File Formats: (.pdf)"
                nameBox
              />
            </div>
          </div>
          <div style={{ display: "flex", justifyContent: "flex-end" }}>
            <div className="p-2">
              <Button
                type="button"
                buttonStyle="outline"
                onClick={() => props.closeAddBankComponent()}
              >
                Close
              </Button>
            </div>
            <div className="d-flex p-2">
              <Button type="submit">Save</Button>
            </div>
          </div>
        </div>
      </form>
    </CardBlue>
  );
};

export default AddBankDetails;
