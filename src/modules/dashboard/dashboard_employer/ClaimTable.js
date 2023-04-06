import React, { useEffect } from "react";
import { useDispatch, useSelector } from 'react-redux';
import { Row } from 'react-bootstrap';
import { getclaimTable, selectclaimTable } from '../dashboard_broker/dashboard_broker.slice'
import { TableDiv, TableSubDiv, TableValueDiv, /* TableRow */ } from "./style";
import _ from "lodash";
import DashboardCard1 from "../../../components/dashboard-card/DashboardCard1";

const ClaimTable = () => {
  //Selectors
  const dispatch = useDispatch();
  const getClaimData = useSelector(selectclaimTable);
  const tableData = getClaimData?.data?.data
  const { currentUser } = useSelector(state => state.login);

  //Api Call for Claim Table Data--------------
  useEffect(() => {
    if (!_.isEmpty(currentUser))
      dispatch(getclaimTable(currentUser.is_super_hr))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  //------------------------------------------

  return (
    <DashboardCard1 icon={<i className="ti-write"></i>} title='Claim Summary' >
      <Row sm={2} md={2} lg={2} xl={2} style={{ marginTop: '-20px', overflow: 'auto' }}>
        <TableDiv>
          <TableSubDiv>
            <label>Claims Registered</label>
          </TableSubDiv>
          <TableValueDiv>
            {tableData?.claim_registered || 0}
          </TableValueDiv>
        </TableDiv>
        <TableDiv>
          <TableSubDiv>
            <label>Registered Amount</label>
          </TableSubDiv>
          <TableValueDiv>
            ₹{tableData?.total_claimed_amount || 0}
          </TableValueDiv>
        </TableDiv>

        <TableDiv>
          <TableSubDiv>
            <label>Claims Pending</label>
          </TableSubDiv>
          <TableValueDiv>
            {tableData?.claim_pending || 0}
          </TableValueDiv>
        </TableDiv>
        <TableDiv>
          <TableSubDiv>
            <label>Pending Amount</label>
          </TableSubDiv>
          <TableValueDiv>
            ₹{tableData?.claim_pending_amount || 0}
          </TableValueDiv>
        </TableDiv>

        <TableDiv>
          <TableSubDiv>
            <label>Claims Settled</label>
          </TableSubDiv>
          <TableValueDiv>
            {tableData?.claim_settled || 0}
          </TableValueDiv>
        </TableDiv>
        <TableDiv>
          <TableSubDiv>
            <label>Settled Amount</label>
          </TableSubDiv>
          <TableValueDiv>
            ₹{tableData?.total_settled_amount || 0}
          </TableValueDiv>
        </TableDiv>


        <TableDiv>
          <TableSubDiv>
            <label>Claims Rejected</label>
          </TableSubDiv>
          <TableValueDiv>
            {tableData?.claim_rejected || 0}
          </TableValueDiv>
        </TableDiv>
        <TableDiv>
          <TableSubDiv>
            <label>Rejected Amount</label>
          </TableSubDiv>
          <TableValueDiv>
            ₹{tableData?.total_rejected_amount || 0}
          </TableValueDiv>
        </TableDiv>


      </Row>
    </DashboardCard1>
  )
  // return (
  //   <TableRow>
  //     <Row sm={2} md={2} lg={2} xl={2} style={{ marginTop: '-20px', overflow: 'auto' }}>
  //       <TableDiv>
  //         <TableSubDiv>
  //           <label>Claims Registered</label>
  //         </TableSubDiv>
  //         <TableValueDiv>
  //           <span>{tableData?.claim_registered || 0}</span>
  //         </TableValueDiv>
  //       </TableDiv>
  //       <TableDiv>
  //         <TableSubDiv>
  //           <label>Registered Amount</label>
  //         </TableSubDiv>
  //         <TableValueDiv>
  //           <span>{tableData?.total_claimed_amount || 0}</span>
  //         </TableValueDiv>
  //       </TableDiv>

  //       <TableDiv>
  //         <TableSubDiv>
  //           <label>Claims Pending</label>
  //         </TableSubDiv>
  //         <TableValueDiv>
  //           <span>{tableData?.claim_pending || 0}</span>
  //         </TableValueDiv>
  //       </TableDiv>
  //       <TableDiv>
  //         <TableSubDiv>
  //           <label>Pending Amount</label>
  //         </TableSubDiv>
  //         <TableValueDiv>
  //           <span>{tableData?.claim_pending_amount || 0}</span>
  //         </TableValueDiv>
  //       </TableDiv>

  //       <TableDiv>
  //         <TableSubDiv>
  //           <label>Claims Settled</label>
  //         </TableSubDiv>
  //         <TableValueDiv>
  //           <span>{tableData?.claim_settled || 0}</span>
  //         </TableValueDiv>
  //       </TableDiv>
  //       <TableDiv>
  //         <TableSubDiv>
  //           <label>Settled Amount</label>
  //         </TableSubDiv>
  //         <TableValueDiv>
  //           <span>{tableData?.total_settled_amount || 0}</span>
  //         </TableValueDiv>
  //       </TableDiv>


  //       <TableDiv>
  //         <TableSubDiv>
  //           <label>Claims Rejected</label>
  //         </TableSubDiv>
  //         <TableValueDiv>
  //           <span>{tableData?.claim_rejected || 0}</span>
  //         </TableValueDiv>
  //       </TableDiv>
  //       <TableDiv>
  //         <TableSubDiv>
  //           <label>Rejected Amount</label>
  //         </TableSubDiv>
  //         <TableValueDiv>
  //           <span>{tableData?.total_rejected_amount || 0}</span>
  //         </TableValueDiv>
  //       </TableDiv>


  //     </Row>
  //   </TableRow>
  // );
};

export default ClaimTable;
