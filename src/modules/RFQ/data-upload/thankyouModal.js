import React from 'react';
// import * as yup from 'yup';

import { Modal } from 'react-bootstrap';
import { CloseButton, ThankYou } from './style'
import { Button, Title } from '../select-plan/style';

export const Completed = ({ show, onHide }) => {

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal">

      <Modal.Body>
        <ThankYou>
          <CloseButton onClick={onHide}>×</CloseButton>
          <img src='/assets/images/RFQ/Completed.png' width='auto' height='270' alt='Thank You' />
          <div>
            <Title fontSize='2rem' className='mb-2 d-block'>Thank You</Title>
            <Title color='#555555' fontSize='1.1rem'>
              Your proposal has been submitted successfully, our representative will contact you soon.
            </Title>
            <Title color='#555555' fontSize='1.1rem'>
              Quote details sent to your registered e-mail id. You can also login on below link, login credentials sent on your e-mail.
            </Title>
            <Button fontSize='1.3rem' width={'210px'} padding='15px' onClick={onHide}>
              Back to home <i className="fa fa-long-arrow-right" aria-hidden="true" />
            </Button>
          </div>
        </ThankYou>

      </Modal.Body>
    </Modal >
  );
}
