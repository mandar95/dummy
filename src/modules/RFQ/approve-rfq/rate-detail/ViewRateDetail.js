import React from 'react';
import swal from 'sweetalert';

import { Button, Typography, Marker } from "components";
import { Row, Col } from 'react-bootstrap';

import { downloadFile } from 'utils';

export const ViewRateDetail = ({ rfqData, nextPage }) => {


  const SiBasisFile = () => {
    if (rfqData.indivdual_rate_sheet && (typeof rfqData.indivdual_rate_sheet !== "number"))
      downloadFile(rfqData.indivdual_rate_sheet);
    else
      swal("Sorry", 'No file found', "warning");

  }

  const PremiumBasisFile = () => {
    if (rfqData.family_floater_rate_sheet && (typeof rfqData.family_floater_rate_sheet !== "number"))
      downloadFile(rfqData.family_floater_rate_sheet);
    else
      swal("Sorry", 'No file found', "warning");

  }

  return (
    <>

      {!!rfqData.has_indivdual && <>
        <Marker />
        <Typography>{'\u00A0'}Individual Rater</Typography>
        <Row className="d-flex flex-wrap m-3">
          <Col md={6} lg={3} xl={3} sm={12} className="h-50 mb-3">
            <Button buttonStyle="outline" onClick={SiBasisFile}>
              Individual Rater File <i className="ti-download" />
            </Button>
          </Col>
        </Row>
      </>}

      {!!rfqData.has_family_floater && <>
        <Marker />
        <Typography>{'\u00A0'}Family Rater</Typography>
        <Row className="d-flex flex-wrap m-3">
          <Col md={6} lg={3} xl={3} sm={12} className="h-50">
            <Button buttonStyle="outline" onClick={PremiumBasisFile}>
              Family Rater File <i className="ti-download" />
            </Button>
          </Col>
        </Row>
      </>}

      <Row >
        <Col md={12} className="d-flex justify-content-end mt-4">
          <Button type="button" onClick={nextPage}>
            Approve
          </Button>
        </Col>
      </Row>
    </>
  )
}
