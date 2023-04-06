import React from "react";
import classesone from "../../index.module.css";
import Drawer from "@material-ui/core/Drawer";
// import self from "../Vectors/self.png";
// import son from "../Vectors/son.png";
// import lady from "../Vectors/spouse.png";
// import daughter from "../Vectors/daughter.png";
// import { useForm, Controller } from "react-hook-form";
import DrawerForm from "../TopupDrawer";
import { useSelector } from "react-redux";
const Avatar = ({ val, elem, name, gender, premiuma, premiumb }) => {
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
  const list = (anchor, closeModal) => (
    <div role="presentation">
      <DrawerForm val={val} elem={elem} name={name} gender={gender} premiuma={premiuma} premiumb={premiumb} />
    </div>
  );


  const getImage = (name) => {
    let pic = '/assets/images/icon/man.png';
    if (name === "Self" && gender === "Female") {
      pic = '/assets/images/icon/woman.png';
    } else if (name === "Son" && gender === "Male") {
      pic = '/assets/images/icon/boy.png';
    } else if (name === "Daughter" && gender === "Female") {
      pic = '/assets/images/icon/girl.png';
    } else if ((name === "Spouse/Partner" || name === "Spouse" || name === "Partner") && gender === "Female") {
      pic = '/assets/images/icon/woman.png';
    } else if ((name === "Mother-in-law" || name === "Mother") && gender === "Female") {
      pic = '/assets/images/icon/grandmother.png';
    } else if ((name === "Father-in-law" || name === "Father") && gender === "Male") {
      pic = '/assets/images/icon/grandfather.png';
    } else if (gender === "Other") {
      pic = "/assets/images/icon/othergender.png";
    }
    return pic;
  }

  return (
    <>
      <div
        style={{ cursor: "pointer", padding: '5px 20px', borderRadius: '20px' }}
        className={`text-center ${classesone.avatar} border border-primary m-2`}
        onClick={toggleDrawer("right", true)}
      >
        <img style={{ maxHeight: "40px" }} src={getImage(name)} alt="" />
        <small style={{ fontSize: globalTheme.fontSize ? `calc(13px + ${globalTheme.fontSize - 92}%)` : '13px' }} className="d-block">{name}</small>
        <small style={{ fontSize: globalTheme.fontSize ? `calc(11px + ${globalTheme.fontSize - 92}%)` : '11px' }} className="d-block text-primary">
          View Details
        </small>
      </div>

      <Drawer
        anchor={"right"}
        open={state["right"]}
        onClose={toggleDrawer("right", false)}
      >
        <div onClick={toggleDrawer("right", false)}>
          <i style={{
            cursor: "pointer",
            fontSize: globalTheme.fontSize ? `calc(22px + ${globalTheme.fontSize - 92}%)` : '22px'
          }} className="fa fa-times-circle text-danger" onClick={toggleDrawer("right", false)}></i>
        </div>
        {list("right", toggleDrawer("right", false))}
      </Drawer>
    </>
  );
};

export default Avatar;
