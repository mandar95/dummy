import React, { useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useLocation } from 'react-router'
import { ThankYou } from '../../../data-upload/style'
import { Title, Button } from '../../../select-plan/style'
import { getQuoteSlip, clearQuoteSlip, completeQuoteLoading } from '../../home.slice';
import { downloadFile } from 'utils';
import swal from 'sweetalert';


export default function NoPlanFound() {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const payment = query.get("payment");
  const enquiry_id = decodeURIComponent(query.get("enquiry_id"));
  const { QuoteSlip } = useSelector((state) => state.RFQHome);

  useEffect(() => {
    if (QuoteSlip?.download_quote_slip) {
      downloadFile(QuoteSlip.download_quote_slip, undefined, true);
      swal({
        title: "Downloading",
        text: "Quote slip",
        timer: 2000,
        button: false,
        icon: "info",
      });
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [QuoteSlip]);

  useEffect(() => {
    if (enquiry_id && payment) {
      dispatch(getQuoteSlip({ enquiry_id }))
    }
    return () => {
      dispatch(clearQuoteSlip());
    }
    //eslint-disable-next-line
  }, [enquiry_id])

  useEffect(() => {
    // return () => {
    dispatch(completeQuoteLoading(null))
    // }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div>
      <ThankYou className='justify-content-center mx-auto'>
        {/* <CloseButton onClick={onHide}>×</CloseButton> */}
        <img src='/assets/images/RFQ/Completed.png' width='auto' height='270' alt='Thank You' />
        <div>
          <Title fontSize='2rem' className='mb-2 d-block'>Thank You</Title><br />
          {payment ? <>
            <Title color='#555555' fontSize='1.1rem'>
              Your proposal has been submitted successfully, our representative will contact you soon.
            </Title>
            <Title color='#555555' fontSize='1.1rem'>
              Quote details sent to your registered e-mail id. You can also login on below link, login credentials sent on your e-mail.
            </Title>

            {!!QuoteSlip?.download_quote_slip && <Title color='#3d5dd5'
              onClick={() => downloadFile(QuoteSlip.download_quote_slip, undefined, true)} role="button" fontSize='1.1rem'>
              Download Quote Slip
            </Title>}
          </> : <Title color='#555555' fontSize='1.1rem'>Your request has been registered, our representative will contact you soon.</Title>}
          <br />
          {/* <Title color='#555555' fontSize='1.4rem'>Will call you back.</Title><br /> */}
          <Button invertFa fontSize='1.3rem' width={'210px'} padding='15px' onClick={() => history.push('/login')}>
            Click here to login
          </Button>
        </div>
      </ThankYou>
    </div>
  )
}
