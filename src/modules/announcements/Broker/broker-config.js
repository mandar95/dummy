import React, { useState } from "react";
import Table from "./Table";
import { Card } from "../../../components";
import { Button as Btn } from "react-bootstrap";
import { TableDiv } from "../style";
import AddComponent from "./add-announcement";
import { useSelector } from "react-redux";

export const Config = ({ myModule }) => {
  //states
  const [modalShow, setModalShow] = useState(false);
  const { globalTheme } = useSelector(state => state.theme)

  //card title------------------
  const title = (
    <div style={{ display: "flex", width: "100%", marginTop: "4px" }}>
      <span style={{ width: "100%" }}>Announcement Configurator</span>
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

  return modalShow ?
    <AddComponent onHide={() => setModalShow(false)} />
    : (
      <Card title={title} round>
        <TableDiv>
          <Table candelete={!!myModule?.candelete} canwrite={!!myModule?.canwrite} />
        </TableDiv>
      </Card>
    )
};
