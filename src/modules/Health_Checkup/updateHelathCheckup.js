import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import _ from "lodash";
import classes from "./index.module.css";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { getstatecity } from "modules/RFQ/home/home.slice";
import { createHealthCheckup } from "./healthSlice";
import moment from "moment";
import swal from "sweetalert";
import {schema,setDateFormate} from "./helper";
import UpdateForm from "./Forms/UpdateForm";

const EditModal = (props) => {
  const dispatch = useDispatch();
  const { userType: userTypeName } = useSelector(
    (state) => state.login
  );
  const { statecity } = useSelector((state) => state.RFQHome);
  const { control, handleSubmit, setValue, errors, watch } = useForm({
    validationSchema: schema,
    mode: "onBlur",
  });
  const [editData, setEditData] = useState([]);
  let _pincode = watch("pincode");
  useEffect(() => {
    if (props?.id) {
      let j = props.healthcheckupdata.filter((item) => item.id === props?.id);
      setEditData(j);
    }
    //eslint-disable-next-line
  }, []);
  useEffect(() => {
    if (!_.isEmpty(editData)) {
      setValue(
        "employee_member_mapping_id",
        editData[0]?.employee_member_mapping_id
      );
      setValue("name", editData[0]?.member_name);
      
      if(Boolean(editData[0]?.contact)) {
        setValue("contact", editData[0]?.contact);
      } else {
        setValue("contact", null);
      }
      if(Boolean(editData[0]?.email)) {
        setValue("email", editData[0]?.email);
        
      } else {
        setValue("email", null);
      }
      
      setValue("address_line_1", editData[0]?.address_line_1);
      setValue("address_line_2", editData[0]?.address_line_2);
      setValue("content", editData[0]?.content);
      setValue("pincode", editData[0]?.pincode);
      setValue("state_id", editData[0]?.state_id);
      setValue("city_id", editData[0]?.city_id);

      setValue(
        "appointment_request_date_time",
        moment(editData[0]?.appointment_request_date_time).format(
          "YYYY-MM-DDTHH:mm"
        )
      );
      setValue(
        "alternate_appointment_request_date_time",
        moment(editData[0]?.alternate_appointment_request_date_time).format(
          "YYYY-MM-DDTHH:mm"
        )
      );
      if (Boolean(editData[0]?.appointment_status === "Pending")) {
        setValue("appointment_status_id", 1);
      }
      if (Boolean(editData[0]?.appointment_status === "Approved")) {
        setValue("appointment_status_id", 2);
      }
      if (Boolean(editData[0]?.appointment_status === "Rejected")) {
        setValue("appointment_status_id", 3);
      }
    }
    //eslint-disable-next-line
  }, [editData]);

  useEffect(() => {
    if (typeof _pincode !== "undefined") {
      if (_pincode?.length === 6 || String(_pincode)?.length === 6) {
        dispatch(getstatecity({ pincode: _pincode }));
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_pincode]);
  useEffect(() => {
    if(statecity?.length) {
      setValue(`state_id`,statecity[0]?.state_id);
      setValue(`city_id`,statecity[0]?.city_id);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  },[statecity])
  const onSubmit = (data) => {
      
    if (_.isEqual(editData[0]?.relation_with_employee, "Self")) {
      if (Boolean(data?.email?.length === 0)) {
        swal({ title: "Email Requried", icon: "warning" });

        return;
      }
      if (Boolean(data?.contact?.length === 0)) {
        swal({ title: "Mobile Number Requried", icon: "warning" });

        return;
      }
    }
    let newObj = _.omit(data, "name");
    if(Boolean(!data?.email) && !_.isEqual(editData[0]?.relation_with_employee, "Self")) {
      newObj = _.omit(newObj, "email");
    }
    if(Boolean(!data?.contact) && !_.isEqual(editData[0]?.relation_with_employee, "Self")) {
      newObj = _.omit(newObj, "contact");
    }
    dispatch(
      createHealthCheckup({
        user_type_name: props.usertypename,
        action: "update",
        members: [{
          ...newObj,
          appointment_request_date_time: setDateFormate(
            newObj.appointment_request_date_time
          ),
          alternate_appointment_request_date_time: setDateFormate(
            newObj.alternate_appointment_request_date_time
          ),
        }],
      })
    );
    props.onHide();
  };
  
  return (
    <Modal
      {...props}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      centered
    >
      <UpdateForm
        handleSubmit={handleSubmit} onSubmit={onSubmit} classes={classes} errors={errors} 
        control={control} editData={editData} statecity={statecity} userTypeName={userTypeName}
      />
    </Modal>
  );
};

export default EditModal;
