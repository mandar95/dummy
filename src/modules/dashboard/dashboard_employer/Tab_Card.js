import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ButtonGroup, Button } from 'react-bootstrap';
import { IconlessCard } from "../../../components";
import {
  getCoverData,
} from "../dashboard_broker/dashboard_broker.slice";
import Table1 from "./GroupMedTable/Table";
import _ from "lodash";

function ControlledTabs(props) {
  //selectors
  const dispatch = useDispatch();
  const { coverData, topUpData } = useSelector(state => state.dashboardBroker);
  const { currentUser } = useSelector(state => state.login);

  //states
  const [key, setKey] = useState(1);

  useEffect(() => {
    if (!_.isEmpty(currentUser)) {
      dispatch(getCoverData(1, currentUser.is_super_hr));
      dispatch(getCoverData(2, currentUser.is_super_hr));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser]);

  const title = (
    <div style={{ display: 'flex', width: '100%', marginTop: '4px' }}>
      <span style={{ width: '100%' }}>Policies</span>
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <ButtonGroup size="sm">
          <Button onClick={() => setKey(1)}>Group</Button>
          {!!topUpData.length && <Button onClick={() => setKey(2)}>Topup</Button>}
        </ButtonGroup>
      </div>
    </div>
  )
  return (
    <IconlessCard title={title}>
      <div style={{ marginTop: '-50px', marginBottom: '-10px' }}>
        <Table1 Data={key === 1 ? coverData : topUpData} />
      </div>
    </IconlessCard>
  );
}

export default ControlledTabs;
