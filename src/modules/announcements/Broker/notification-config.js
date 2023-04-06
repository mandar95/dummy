import React, { useState, useEffect } from "react";
import Table from "./notificationTable";
import { Card, Loader } from "../../../components";
import { Button as Btn } from "react-bootstrap";
import { TableDiv } from "../style";

// import AddComponent from "../notificationSubComponent/add-notification";
import AddComponent from "../notificationSubComponent/add-notification2";

import { useParams } from 'react-router-dom';

import { useSelector, useDispatch } from 'react-redux';

import swal from "sweetalert";

import { clear } from "../announcement.slice";



export const Notification = ({ myModule }) => {

  //states
  const [modalShow, setModalShow] = useState(false);
  const dispatch = useDispatch();
  const { loading, success, error } = useSelector(state => state.announcement);
  const { globalTheme } = useSelector(state => state.theme)
  const { id } = useParams();

  //success ,error alert--------------------
  useEffect(() => {
    if (!loading && success?.status) {
      swal('Success', success.message, "success").then(() => dispatch(clear()));
    }
    if (!loading && error) {
      swal("Alert", error, "warning").then(() => dispatch(clear()));
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error, loading])


  //card title------------------
  const title = (
    <div style={{ display: "flex", width: "100%", marginTop: "4px" }}>
      <span style={{ width: "100%" }}>Notification Configurator</span>
      {!!myModule?.canwrite &&
        <div style={{ display: "flex", justifyContent: "flex-end" }}>
          <Btn size="sm" varient="primary" onClick={() => setModalShow(true)}>
            <span style={{ fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px', fontWeight: "600" }}>+Add</span>
          </Btn>
        </div>
      }
    </div>
  );
  //-----------------------



  // if (id) return (
  //   <>
  //     <AddComponent onHide={() => setModalShow(false)} />
  //     {loading && <Loader />}
  //   </>
  // )





  return (
    <>
      {(modalShow || id) ? (
        <>
          <AddComponent onHide={() => setModalShow(false)} />
        </>
      ) : (
        <Card title={title} round>
          <TableDiv>
            <Table myModule={myModule} />
          </TableDiv>
          {/* <div>table</div> */}
        </Card>
      )}

      {loading && <Loader />}
    </>
  );
};
