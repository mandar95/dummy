import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAnncmt, selectAnncmt } from "./announcement.slice";
import Announcement from "./Announcement";


const Prototype = (props) => {
  const dispatch = useDispatch();
  const response = useSelector(selectAnncmt);
  const { userType } = useSelector(state => state.login);
  const [getPos, setPos] = useState(null);
  const { url } = props;
  const URL = url?.length && `/${url[2]}`;

  const resp = response?.data?.data?.filter((elem) => {
    return elem?.module?.find((item) => {
      return (item?.module_url === URL) && elem?.status !== "Inactive" && elem.position === props.position;
    })
  });


  useEffect(() => {
    if (resp?.length)
      setPos(resp[0].position || "Top");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resp]);

  useEffect(() => {
    if (userType)
      dispatch(getAnncmt(userType));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  return (
    !!resp?.length && (resp || [])?.map((item, index) => <>
      {item?.status !== "Inactive" ?
        <div key={index + 'proptype'} style={{ display: getPos === props.position ? "" : "none" }}>
          <Announcement AnnouncementData={item} />
        </div>
        :
        <noscript />
      }
    </>)
  );
};

export default Prototype;
