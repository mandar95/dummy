import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';

import { IconlessCard } from 'components';
import { DataTable } from 'modules/user-management';
import { QuotesColumn } from './helper';
import { SendPlacementSlip } from './SendPlacementSlip'
import { AuditDetails } from './AuditDetails';
import { SendQouteSlip } from './SendQouteSlip';
import { initialState, loadQCRQuotes, reducer } from './qcr.action';
import { useParams } from 'react-router';
import { useSelector } from 'react-redux';
import { NoDataFound, Loader } from '../../../../../../components';

export function QuoteDetails({ myModule }) {

  const [placementSlip, setPlacemetSlip] = useState(null);
  const [auditDetails, setAuditDetails] = useState(false);
  const [quoteSlip, setQouteSlip] = useState(null);
  const [{ details, loading }, dispatch] = useReducer(reducer, initialState);
  const { userType } = useParams();
  const { currentUser, userType: userTypeName } = useSelector(state => state.login);

  useEffect(() => {
    if ((userType !== 'customer' && currentUser.id) || (userType === 'customer' && currentUser.work_email)) {
      loadQCRQuotes(dispatch, userType === 'customer' ? { email: currentUser.work_email } : { user_type_name: userTypeName })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentUser])

  return (
    <>
      <IconlessCard isHeder={false} marginTop={'0'}>
        <HeaderDiv>
          <div className='icon'>
            <i className='fas fa-file-invoice' />
          </div>
          <div>
            <p className='title'>Quote Details</p>
            {/* <p className='secondary-title'>Some life insurance companies use captive agents who can only sell you life insurance from that particular provider.</p> */}
          </div>
        </HeaderDiv>
        {(loading && !details.length) ? <Loader /> : (details.length ?
          <DataTable
            columns={QuotesColumn({ setPlacemetSlip, setAuditDetails, setQouteSlip, dispatch, userType, myModule })}
            data={details}
            noStatus={true}
            pageState={{ pageIndex: 0, pageSize: 5 }}
            pageSizeOptions={[5, 10]}
            rowStyle
          /> :
          <NoDataFound />)
        }
      </IconlessCard>
      {!!placementSlip && <SendPlacementSlip show={placementSlip} onHide={setPlacemetSlip} />}
      {!!auditDetails && <AuditDetails show={auditDetails} onHide={setAuditDetails} />}
      {!!quoteSlip && <SendQouteSlip show={quoteSlip} onHide={setQouteSlip} />}

      {loading && !!details.length && <Loader />}
    </>
  )
}

// styling

const HeaderDiv = styled.div`
  display:flex;
  margin-top: -12px;
  margin-bottom: 15px;
  align-items: center;
  .icon {
    background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
    border-radius: 50%;
    height: 50px;
    width: 50px;
    margin: -1px 10px 0 -30px;
    i{
      color: white;
      padding: 13px 16px;
      font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(25px + ${fontSize - 92}%)` : '25px'};
    }
  }
  .title {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.6rem + ${fontSize - 92}%)` : '1.6rem'};
    margin: 0;
    
  }
  .secondary-title {
    margin: 0;
    color: #5b5b5b;
  }

`
