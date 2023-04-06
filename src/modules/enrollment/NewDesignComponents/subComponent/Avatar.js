import React, { useEffect } from "react";

import classesone from "../../index.module.css";
import Drawer from "@material-ui/core/Drawer";
import DrawerForm from "../Drawer";
import DrawerFormNominee from "../DrawerNominee";
import imagea from "./user.png";
import { Button } from "components";
import { useSelector } from "react-redux";

const Avatar = ({
  name,
  gender,
  data,
  policy_id,
  relations,
  originalRelation,
  type,
  relations2,
  isInsuredRelation,
  success,
  dispatch,
  flex_plan_data,
  flex,
  member_option,
  UdaanLogicActivate,
  policyCoverage,
  parentIndex,
  baseEnrolmentStatus,
  policy_ids,
  setpolicyMembers,
  enhanceCover,
  // isParentPolicy
}) => {
  const [state, setState] = React.useState({
    right: false,
  });
  const { globalTheme } = useSelector(state => state.theme)

  const toggleDrawer = (anchor, open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setState({ ...state, [anchor]: open });
  };

  useEffect(() => {
    if (success)
      toggleDrawer("right", false)({})
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success])

  const list = (anchor, closeModal) => (
    <div role="presentation">
      {type === "nominee" ? (
        <DrawerFormNominee
          closeModal={closeModal}
          name={name}
          Data={data}
          relations={relations}
          policy_id={policy_id}
          relations2={relations2}
          isInsuredRelation={isInsuredRelation}
          dispatch={dispatch}
          baseEnrolmentStatus={baseEnrolmentStatus}
        />
      ) : (
        <DrawerForm
          closeModal={closeModal}
          Data={data}
          relations={relations}
          originalRelation={originalRelation}
          policy_id={policy_id}
          dispatch={dispatch}
          flex_plan_data={flex_plan_data}
          flex={flex}
          parentIndex={parentIndex}
          member_option={member_option}
          UdaanLogicActivate={UdaanLogicActivate}
          policyCoverage={policyCoverage}
          baseEnrolmentStatus={baseEnrolmentStatus}
          policy_ids={policy_ids}
          setpolicyMembers={setpolicyMembers}
        // isParentPolicy={isParentPolicy}
        />
      )}
    </div>
  );

  const getImage = (name) => {
    let pic = "/assets/images/icon/man.png";
    if (name === "Self" && gender === "Female") {
      pic = "/assets/images/icon/woman.png";
    } else if (name === "Son" && gender === "Male") {
      pic = "/assets/images/icon/boy.png";
    } else if (name === "Daughter" && gender === "Female") {
      pic = "/assets/images/icon/girl.png";
    } else if ((name === "Spouse/Partner" || name === "Spouse" || name === "Partner") && gender === "Female") {
      pic = "/assets/images/icon/woman.png";
    } else if ((name === "Mother-in-law" || name === "Mother") && gender === "Female") {
      pic = '/assets/images/icon/grandmother.png';
    } else if ((name === "Father-in-law" || name === "Father") && gender === "Male") {
      pic = '/assets/images/icon/grandfather.png';
    } else if (gender === "Other") {
      pic = "/assets/images/icon/othergender.png";
    }
    if (type === "nominee") {
      pic = imagea;
    }
    return pic;
  };

  return (
    <>
      {enhanceCover ? <div className="d-flex justify-content-start align-items-center">
        <div className="d-flex justify-content-center mr-3">
          <Button
            onClick={toggleDrawer("right", true)}
            type='button'
            buttonStyle={"outline"}
            className={`${classesone.bigButton2} font-weight-bolder`}
          >
            Enhance your insurance coverage
          </Button>
        </div>
      </div>
        : <div
          style={{ cursor: "pointer", padding: "5px 20px", borderRadius: "20px" }}
          className={`text-center ${classesone.avatar} border border-primary m-2`}
          onClick={toggleDrawer("right", true)}
        >
          <img style={{ maxHeight: "40px" }} src={getImage(name)} alt="" />
          <small
            style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }}
            className="d-block"
          >
            {name}
          </small>
          <small
            style={{ fontSize: globalTheme.fontSize ? `calc(11px + ${globalTheme.fontSize - 92}%)` : '11px' }}
            className="d-block text-primary"
          >
            View Details
          </small>
        </div>}
      <Drawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        <div onClick={toggleDrawer("right", false)}>
          <i
            style={{
              cursor: "pointer",
              fontSize: globalTheme.fontSize ? `calc(22px + ${globalTheme.fontSize - 92}%)` : '22px',
            }}
            className="fa fa-times-circle text-danger"
            onClick={toggleDrawer("right", false)}
          ></i>
        </div>
        {list("right", toggleDrawer("right", false))}
      </Drawer>
    </>
  );
};

export default Avatar;
