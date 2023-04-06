import React from 'react';

import { Card, Input } from 'components';
import { useForm, Controller } from "react-hook-form";
import { Row, Col } from 'react-bootstrap';
import { Decrypt, Encrypt } from '../../utils';
import DashboardCard from '../../components/dashboard-card/DashboardCard';
import DashboardCard1 from '../../components/dashboard-card/DashboardCard1';
import InProgressCard from '../../components/dashboard-card/InProgressCard';
import QuickStatsCard from '../../components/dashboard-card/QuickStatsCard';
import QuickStatsCard1 from '../../components/dashboard-card/QuickStatsCard1';

export default function EncryptDepcrypt() {
  const { control, watch } = useForm();


  const toEncrypt = watch('encypt_input');
  const toDecrypt = watch('decrypt_input');


  return (
    <Card title='Encrypt-Decrypt'>
      <Row>
        <Col>
          <Controller
            as={
              <Input
                name="encypt_input"
                label="To Encrypt"
                type="tel"
                placeholder="Enter ID"
              />}
            control={control}
            name="encypt_input"
          />
        </Col>
        <Col className='align-self-center'>
          {!!toEncrypt && Encrypt(toEncrypt)}
        </Col>
      </Row>

      <Row>
        <Col>
          <Controller
            as={
              <Input
                name="decrypt_input"
                label="To Decrypt"
                type="tel"
                placeholder="Enter ID"
              />}
            name="decrypt_input"
            control={control}
          />
        </Col>
        <Col className='align-self-center'>
          {!!toDecrypt && Decrypt(toDecrypt)}
        </Col>
      </Row>

      <DashboardCard
        icon={<i className="fal fa-wallet"></i>} title='Title' amount={2228262} />
      <br /><br /><br />
      <DashboardCard1 icon={<i className="fal fa-wallet"></i>} title='Title' >
        <div className="row w-100 m-auto">
          <div className="col-4">
            <div className="d-flex pr-3 flex-column">
              <p className="m-0">Active </p>
              <h4 className="m-0">29</h4>
            </div>
          </div>
          <div className="col-4">
            <div className="d-flex pr-3 flex-column">
              <p className="m-0">Active </p>
              <h4 className="m-0">29</h4>
            </div>
          </div>
          <div className="col-4">
            <div className="d-flex pr-3 flex-column">
              <p className="m-0">Active </p>
              <h4 className="m-0">29</h4>
            </div>
          </div>
        </div>
      </DashboardCard1>
      <br /><br /><br />

      <InProgressCard title='Title' badgeName={'Badge Name'} percentage={28} />
      <br /><br /><br />
      <QuickStatsCard title='Title' number={86} />
      <br /><br /><br />
      <QuickStatsCard1
      title1={'Title 1'} title2={'Title 1'} actionName={'Action Name'} imgSrc={'https://www.pngrepo.com/png/157641/512/ice-cream.png'}
      />
    </Card>

  )
}
