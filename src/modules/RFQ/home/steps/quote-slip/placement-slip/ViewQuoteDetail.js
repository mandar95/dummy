import React, { Fragment, useEffect, useReducer, useState } from 'react';
import { useSelector } from 'react-redux';
import styled from 'styled-components';

import { IconlessCard, Button } from 'components';
import { Row, Col, Table } from 'react-bootstrap';
import { useHistory, useLocation, useParams } from 'react-router';
import { initialState, loadQCRQuotes, reducer, downloadQuoteSlipPDF, buyQuote } from './qcr.action';
import { Loader } from '../../../../../../components';
import { randomString, downloadFile, DateFormate } from '../../../../../../utils';
// import { SendQouteSlip } from './SendQouteSlip';
import { SendPlacementSlip } from './SendPlacementSlip'
import { SortFeature } from './helper';
export const CalculatePlans = ({ data = [], feature = [], type, sortedFeature = [] }) => {
  const allIC = [...new Set(data.map(({ insurer_name }) => insurer_name))];

  const result = [];
  allIC.forEach((elem, index) => {
    let product_feature = [];
    sortedFeature.forEach(({ id: feature_id, child }, index2) => {
      data.forEach((elem2) => {
        if (elem2.quote_slip_feature_id === feature_id && elem === elem2.insurer_name) {
          product_feature[index2] = elem2
          let product_feature_child = [];
          child.forEach(({ id: feature_child_id, parent_id }, index3) => {
            data.forEach((elem3) => {
              if (elem3.quote_slip_feature_id === feature_child_id && elem === elem3.insurer_name && parent_id === feature_id) {
                product_feature_child[index3] = elem3
              }
            })
          })
          product_feature[index2].child = product_feature_child;
        }
      })
    })
    if (type === 'final') {
      if (!product_feature?.[0]?.selected_insurer) {
        return
      }
    }
    result[index] = {
      "insurer_name": elem,
      "insurer_id": data.find(({ insurer_name }) => insurer_name === elem)?.insurer_id,
      "premium": product_feature?.[0]?.premium,
      "premium_tax": product_feature?.[0]?.premium_tax,
      "total_premium": product_feature?.[0]?.total_premium,
      "selected_insurer": product_feature?.[0]?.selected_insurer,
      product_feature
    }

  })
  return result

}

export function ViewQuoteDetail() {

  const [{ qcr_detail, loading, pdfResponse }, dispatch] = useReducer(reducer, initialState);
  const [quoteSlip, setQouteSlip] = useState(false);
  const { currentUser } = useSelector(state => state.login);
  const history = useHistory();
  const { id, userType } = useParams();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const type = query.get("type");
  const { globalTheme } = useSelector(state => state.theme)

  // const [Modal, setModal] = useState({});
  const [communicationAction, setCommunication] = useState(false)

  useEffect(() => {
    loadQCRQuotes(dispatch, { quote_id: id })

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (pdfResponse) {
      downloadFile(pdfResponse?.download_report, '', true)
    }
    // return () => { dispatch(cleardownloadQuoteResponse()) }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pdfResponse])

  const downloadAction = () => {
    downloadQuoteSlipPDF(dispatch, { quote_id: id, broker_id: currentUser?.broker_id, ...type === 'final' && { is_final_quote: type === 'final' ? 1 : 0 } })
  }

  const sortedFeature = SortFeature(qcr_detail.data_slip_feature || []);
  const ReAdjustDetail = CalculatePlans({ data: qcr_detail.insurer, feature: qcr_detail.data_slip_feature, type, sortedFeature }) || [];



  return (
    <>
      <IconlessCard isHeder={false} marginTop={'0'}>
        <div className="d-flex justify-content-between">
          <HeaderDiv>
            <div className='icon'>
              <i className='fas fa-file-invoice' />
            </div>
            <div>
              <p className='title'>Quote for {qcr_detail.company_name}</p>
              {/* <p className='secondary-title'>Group Mediclaim</p> */}
            </div>
          </HeaderDiv>
          {userType !== 'customer' && type !== 'final' && <div style={{ marginTop: '-10px' }}>
            <Button type="button" onClick={() => { history.replace(`/${userType}/qcr-quote-create/${randomString()}/${id}/${randomString()}`) }} buttonStyle="outline-secondary">
              Edit <i className="ti-pencil" />
            </Button>
          </div>}
        </div>
        <MainDiv final={type === 'final'}>
          <Row className="align-items-center">
            <Col
              md={12}
              lg={12}
              xl={10}
              sm={12}
              className="d-flex flex-wrap"
            >
              {Widget.map(({ text_color, bg_color, imgSrc, key_name, memeberType, type
              }, i) =>
                <WidgetCard
                  key={"qweasdzxc" + i}
                  text_color={text_color}
                  bg_color={bg_color}
                  margin={"0 0.5rem 1rem"}
                  imgSrc={imgSrc}
                  value={type === 'date' ? DateFormate(qcr_detail[key_name]) : qcr_detail[key_name]}
                  memeberType={memeberType} />
              )}

            </Col>
            <Col
              md={12}
              lg={12}
              xl={2}
              sm={12}
              className="d-flex justify-content-end mb-2">
              <DownloadBtn onClick={downloadAction}><i className="fa fa-file-download" style={{ marginRight: '8px' }}></i>Download</DownloadBtn>
              <span onClick={() => setCommunication(!communicationAction)} style={{ cursor: 'pointer' }}><ShareI className="fa fa-share-alt-square" style={{ fontSize: globalTheme.fontSize ? `calc(30px + ${globalTheme.fontSize - 92}%)` : '30px' }} /></span>
              {communicationAction &&
                <CommunicationDiv>
                  <span style={{ marginBottom: '8px', cursor: 'pointer' }} onClick={() => {
                    // setModal({
                    //   show: true,
                    //   isMail: false
                    // })
                  }}>
                    <img
                      src="/assets/images/QCR/mail-icon.png"
                      alt="bck"
                      style={{
                        width: '28px',
                        height: '28px',
                      }}

                    />
                  </span>
                  <span style={{ cursor: 'pointer' }} onClick={() => {
                    // setModal({
                    //   show: true,
                    //   isMail: true
                    // })
                    setQouteSlip(true)
                  }}>
                    <img
                      src="/assets/images/QCR/WhatsApp-icon.png"
                      alt="bck"
                      style={{
                        width: '25px',
                        height: '23px',
                        marginLeft: '2px'
                      }}
                    />
                  </span>
                </CommunicationDiv>
              }



            </Col>
          </Row>

          <Row className="align-items-center">
            <Col
              md={12}
              lg={type === 'final' ? 6 : 12}
              xl={type === 'final' ? 6 : 12}
              sm={12}
            >
              <StyledTable bordered={false} className="text-center rounded text-nowrap" responsive>
                <thead>
                  <tr>
                    <th>Product Feature</th>
                    {/* {type !== 'final' && <th>Proposed Option</th>} */}
                    {ReAdjustDetail.map(({ insurer_name }, i) => <th key={"featureasdxzcasa" + i}>{insurer_name}</th>)}
                  </tr>
                </thead>
                <tbody>
                  {sortedFeature?.map(({ feature_name, proposed_option, child }, index) =>
                    <Fragment key={index + 'feature'}>
                      <tr className='parent_feature'>
                        <th >{feature_name || ''}</th>
                        {/* {type !== 'final' && <td>{proposed_option}</td>} */}
                        {ReAdjustDetail.map(({ product_feature }, i) => <td key={"featuretdasdasdasd" + i}>{product_feature[index]?.label === '-' ? '' : product_feature[index]?.label || ''}</td>)}

                      </tr>
                      {child?.map(({ feature_name, proposed_option }, index2) =>
                        <tr key={index + 'feature_child' + index2}>
                          <th>{feature_name}</th>
                          {/* {type !== 'final' && <td>{proposed_option}</td>} */}
                          {ReAdjustDetail.map(({ product_feature }, i) => <td key={"zxcbvbfdfhf" + i}>
                            {product_feature[index]?.child[index2]?.label}
                          </td>)}

                        </tr>
                      )}
                    </Fragment>
                  )}
                  {ReAdjustDetail.some(({ premium }) => Number(premium)) &&
                    <tr className='tr_premiums'>
                      <th className='upper_border'>Premium</th>
                      {/* {type !== 'final' && <td className='upper_border'>₹5000</td>} */}
                      {ReAdjustDetail.map(({ premium }, index) => <td className='upper_border' key={index + 'premium'}>{premium}</td>)}
                    </tr>}
                  {ReAdjustDetail.some(({ premium_tax }) => Number(premium_tax)) && <tr className='tr_premiums'>
                    <th>Tax</th>
                    {/* {type !== 'final' && <td>₹500</td>} */}
                    {ReAdjustDetail.map(({ premium_tax }, index) => <td key={'premium_tax' + index}>{premium_tax}</td>)}
                  </tr>}
                  {ReAdjustDetail.some(({ total_premium }) => Number(total_premium)) && <tr className='tr_premiums theme_text'>
                    <th>Premium with Tax</th>
                    {/* {type !== 'final' && <td>₹5500</td>} */}
                    {ReAdjustDetail.map(({ total_premium }, index) => <td key={index + 'total'}>{total_premium}</td>)}
                  </tr>}
                  {type !== 'final' && <tr className='tr_premiums'>
                    <th className='lower_border'></th>
                    {/* <td className='lower_border'></td> */}
                    {ReAdjustDetail.map(({ insurer_id, selected_insurer }, index) => <td key={index + 'premium_tax'} className='lower_border'>
                      <BuyButton
                        style={{ cursor: selected_insurer ? 'not-allowed' : 'pointer' }} onClick={() => !selected_insurer && buyQuote(dispatch, { quote_id: id, insurer_id })}
                        selected={selected_insurer}>{selected_insurer ? 'Selected' : 'Buy Now'} {!!selected_insurer && <i className="ti ti-check" aria-hidden="true" />}</BuyButton>
                    </td>)}
                  </tr>}
                </tbody>
              </StyledTable>

            </Col>
            {type === 'final' && <Col
              md={12}
              lg={6}
              xl={6}
              sm={12}
              className="d-flex flex-wrap justify-content-center image_final"
            >
              <img src="/assets/images/QCR/Confirmed-cuate.png" alt="Done" />
            </Col>}
          </Row>
        </MainDiv>
        {loading && <Loader />}
      </IconlessCard>
      {!!quoteSlip && <SendPlacementSlip show={quoteSlip} onHide={setQouteSlip} />}
    </>
  )
}

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
    color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
  }

`

const MainDiv = styled.div`
  border: 1px solid #d8d8d8;
  border-radius: 20px;
  padding: 15px;
  .table-responsive {
    margin: 0;
    /* min-width: ${({ final }) => final ? '50%' : 'inherit'}; */
    @media (max-width: 768px) {
      max-width: 100%;
    }
    /* display: ${({ final }) => final ? 'inline-block' : 'block'}; */
  }
  .image_final{
    /* display: inline-flex; */
    /* position: absolute;
    top: auto;
    right: 10%; */
    img{
      height: 38vh;
      max-width: 90vw;
    }
  }


`

const StyledTable = styled(Table)`
border-collapse: inherit;
td,th,.parent_feature{
  border-top: 0;
  max-width: 200px;
  white-space: break-spaces;
}
.parent_feature{
  border-radius: 20px;
  color: #000000;
  background-color: ${({ theme }) => theme.PrimaryColors?.tableColor ? (theme.PrimaryColors?.tableColor + '1c') : 'rgb(243,243,243,243)'};
  th,td {
    &:first-child{ border-radius: 20px 0 0 20px;}
    &:last-child{ border-radius: 0 20px 20px 0;}
  }
  
}
thead {
  border-radius: 20px;
  tr {
    border-radius: 20px;
    color: #ffffff;
    background-color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
  }
  th {
    &:first-child{ border-radius: 20px 0 0 20px;}
    &:last-child{ border-radius: 0 20px 20px 0;}
    min-width: 158px;
    .insurer-div {
      background: white;
      border-radius: 5px 3px 4px 5px;
      .form-control:focus {
          border-color: transparent;
          box-shadow: none;
      }
      .form-control {
        border: 0;
      }
    }
  }
  .add_button {
    min-width: auto;
  }
}
tbody{
  border-radius: 20px;
  .tr_premiums {
    border-radius: 20px;
    background: ${({ theme }) => theme.PrimaryColors?.tableColor ? (theme.PrimaryColors?.tableColor + '17') : 'rgb(243,243,243,243)'};
    .upper_border{
      &:first-child {
        border-radius: 20px 0 0 0;
      }
      &:last-child {
        border-radius: 0 20px 0 0;
      }
    }
    .lower_border{
      &:first-child {
        border-radius: 0 0 0 20px;
      }
      &:last-child {
        border-radius: 0 0 20px 0;
      }
        
    }
    
  }
  .theme_text {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(1.05rem + ${fontSize - 92}%)` : '1.05rem'};
    color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
  }
}
`
const Container = styled.div`
position: relative;
display: flex;
flex-direction: ${({ flexDirection }) => flexDirection || 'column'};
align-items: center;
justify-content: space-between;
padding: 10px;
width: ${({ width }) => width || '180px'};
height: auto;
text-align: center;
margin: ${({ margin }) => margin || '10px'};
border-radius: 15px;
background-color: ${({ bg_color }) => bg_color || '#ffffff'};
transition: all 0.3s ease 0s;
box-shadow: 1px 5px 14px 0px rgb(0 0 0 / 10%);
@media (max-width: 768px) {
    margin: 0 auto 1rem;
    width: 100%;
}
`;

const ImgDiv = styled.div`
    height: ${({ size }) => size || '85px'};
    width: ${({ size }) => size || '85px'};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    top: ${({ top }) => top || '-47px'};
    margin-bottom: ${({ marginBottom }) => marginBottom || '-25px'};
`
const Img = styled.img`
    height: ${({ size }) => size || '85px'};
    width: ${({ size }) => size || '85px'};
    margin: -4px 0px 0px 0px;
`
const MemberCountDiv = styled.div`
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '1.8rem'} + ${theme.fontSize - 92}%)` : (fontSize || '1.8rem')};
text-align: start;
color: ${({ text_color }) => text_color || '#000000'};
`
const MemberTypeDiv = styled.div`
margin-top: 4px;
font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '1.5rem'} + ${theme.fontSize - 92}%)` : (fontSize || '1.5rem')};
text-align: start;
`

const WidgetCard = ({ text_color, bg_color, imgSrc, value, memeberType, margin }) => {
  return (
    <Container bg_color={bg_color} width='200px' flexDirection={'row'} margin={margin}>
      <div>
        <MemberTypeDiv fontSize='1rem'>{memeberType || 'member type'}</MemberTypeDiv>
        <MemberCountDiv text_color={text_color} fontSize='1rem'>{value || ''}</MemberCountDiv>
      </div>
      <ImgDiv size="40px" top='0' marginBottom='0'>
        <Img size="40px" src={imgSrc}></Img>
      </ImgDiv>
    </Container >
  )
}

// const ActionButton = styled.div`
// height: 40px;
// width: max-content;
// padding: 6px;
// display: flex;
// justify-content: space-around;
// background: ${({ theme }) => theme.PrimaryColors?.tableColor ? (theme.PrimaryColors?.tableColor + '17') : 'rgb(243,243,243,243)'};
// border: 1px solid ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
// border-radius: 10px;
// color: ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
// span {
//   cursor: pointer;
//   width: 100px;
//   text-align: center;
// }
// .vl {
//   margin-top: -6px;
//   border-left: 1px dashed ${({ theme }) => theme.PrimaryColors?.tableColor || 'rgb(243,243,243,243)'};
//   height: 39px;
// }
// `

const Widget = [{
  bg_color: '#fff8ee',
  text_color: '#E38B10',
  imgSrc: "/assets/images/qcr/policy-expiry.png",
  key_name: 'policy_expiry',
  memeberType: "Policy Expiry",
  type: 'date'
},
{
  bg_color: '#ebefff',
  text_color: '#123BDC',
  imgSrc: "/assets/images/qcr/no-of-employees.png",
  key_name: 'no_of_employee',
  memeberType: "No. of Employees"
},
{
  bg_color: '#eefff6',
  text_color: '#11CC6C',
  imgSrc: "/assets/images/qcr/no-of-lives.png",
  key_name: 'no_of_lives_inception',
  memeberType: "No. of Lives"
},
{
  bg_color: '#ffeefb',
  text_color: '#812670',
  imgSrc: "/assets/images/qcr/sum-insured.png",
  key_name: 'existing_cover',
  memeberType: "Sum Insured"
}]

const DownloadBtn = styled.div`
min-width: 109px;
color: white;
padding: 5px 20px;
border-radius: 3px;
cursor: pointer;

margin-right: 16px;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(12px + ${fontSize - 92}%)` : '12px'};
height: 29px;
background: ${({ theme }) => theme.Tab?.color || "#e11a22"};
`;


const ShareI = styled.i`
color: ${({ theme }) => theme.Tab?.color};
opacity:0.6;
`
const CommunicationDiv = styled.div`
position: absolute;
display: flex;
flex-direction: column;
z-index: 999;
background: red;
padding: 7px 5px;
border-radius: 7px;
top: 32px;
right: 8px;
box-shadow: 1px 6px 12px 0px #bfbfbf;
background: white;
`

const BuyButton = styled.button`
  color: ${({ theme, selected }) => selected ? '#fff' : (theme.Tab?.color || '#ff3c46')};
  background:  ${({ theme, selected }) => (!selected ? '#fff' : (theme.Tab?.color || '#ff3c46'))};
  border-radius: 5px;
  padding: 0px !important;
  display: inline-block;
  width: ${({ width }) => width || '115px'} !important;
  font-size: ${({ theme, fontSize }) => theme.fontSize ? `calc(${fontSize || '1rem'} + ${theme.fontSize - 92}%)` : (fontSize || '1rem')};
  
  text-align: center;
  letter-spacing: 1px;
  height: ${({ height }) => height || '40px'};
  border: 1px dashed ${({ theme }) => (theme.Tab?.color || '#ff3c46')};
  outline: none;
  &:focus{
    outline: none;
  }
  & > i {
    padding-left: 2px;
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(0.9rem + ${fontSize - 92}%)` : '0.9rem'};
    
    transition: transform 0.5s;
  }
  &:hover,
  &:focus,
  &:active {
    & > i {
      transform: translateX(10px);
    }
  }
  `;
