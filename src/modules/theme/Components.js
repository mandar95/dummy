import React, { useRef, useState } from "react";
import styled from "styled-components";

import { FileDrop } from "react-file-drop";
import { Title, Card as AnotherCard } from "modules/RFQ/select-plan/style.js";

import {
  Button,
  Card,
  CardBlue,
  IconlessCard,
  TabWrapper,
  Tab,
  Stepper,
  Step,
  Chip,
  Select,
} from "components";
// import RFQComponents from "./RFQComponent"

import { Button as Btn, Row, Col } from 'react-bootstrap';

export const Components = () => {
  const [tab, setTab] = useState(true);
  const brokerData = [
    { id: 1, name: "TMIBSAL", contact: "7738545542", users: 5, employers: 7 },
    { id: 2, name: "Google", contact: "9769112157", users: 5, employers: 3 },
    { id: 10, name: "HDFC", contact: "9293212299", users: 0, employers: 0 },
    { id: 11, name: "Iphone", contact: "9987952528", users: 0, employers: 0 },
  ]

  /*--------------------------Broker Chip Selection code----------------------*/
  //chip states
  const [broker, setBroker] = useState("");
  const [brokers, setBrokers] = useState([]);

  /*---------add---------------*/

  const onAddBroker = () => {
    if (broker && Number(broker)) {
      const flag = brokerData?.find((value) => value?.id === Number(broker));
      const flag2 = brokers.some((value) => value?.id === Number(broker));
      if (flag && !flag2) setBrokers((prev) => [...prev, flag]);
      // reset({
      //   broker_ids: "",
      // });
    }
  };

  /*-----------------remove------------------*/
  const removeBroker = (Broker) => {
    const filteredBrokers = brokers.filter((item) => item?.id !== Broker);
    setBrokers((prev) => [...filteredBrokers]);
  };

  /*---------------------------------X------------------------------------*/

  return (
    <div className="p-5">
      <h1 className="display-4"> Buttons </h1>
      <Button buttonStyle="">Default</Button>
      <br />
      <br />
      <Button buttonStyle="danger">Danger</Button>
      <br />
      <br />
      <Button buttonStyle="warning">Warning</Button>
      <br />
      <br />
      <Button buttonStyle="outline">Outline</Button>
      <br />
      <br />
      <Button buttonStyle="square-outline">Square-Outline</Button>
      <br />
      <br />
      <Button buttonStyle="submit-disabled">Submit-Disabled</Button>
      <br />
      <br />
      <Button buttonStyle="outline-solid">Outline-Solid</Button>

      <h1 className="display-4"> Cards </h1>
      <Card title="Default Card" />
      <CardBlue title="Round Card" />
      <IconlessCard title="Iconless Card" />

      <h1 className="display-4"> Tab </h1>
      <TabWrapper width={"max-content"}>
        <Tab isActive={tab} onClick={() => setTab(true)}>
          Option 1
        </Tab>
        <Tab isActive={!tab} onClick={() => setTab(false)}>
          Option 2
        </Tab>
      </TabWrapper>

      <h1 className="display-4"> Stepper </h1>
      <Stepper
        activeStep={0}
        onSave={() => { }}
        afterNext={() => { }}
        hideProgressBar={true}
      >
        {[
          {
            id: 4,
            completed: false,
            formId: 5,
            image: "/assets/images/neutral_user.jpg",
          },
        ].map((config, index) => {
          return (
            <Step
              key={config.id + 'theme' + index}
              id={config.id}
              completed={config.completed ? "completed" : ""}
              formId={config.formId}
              label={config.content}
              icon={config.image}
            >
              {React.cloneElement(<></>, {})}
            </Step>
          );
        })}
      </Stepper>

      {/*chip setup*/}
      <IconlessCard title="Chip">
        <Row>
          <Col lg={6} md={12} xl={6}>
            <div>
              <div className="p-2">
                <Select
                  label="Broker"
                  placeholder="Select Broker"
                  options={brokerData.map((item) => ({
                    id: item?.id,
                    name: item?.name,
                    value: item?.id,
                  }))}
                  valueName="name"
                  id="id"
                  required
                  onChange={(e) => {
                    setBroker(e.target.value);
                  }}
                  name="broker_id"
                />
              </div>
              <div style={{ display: "flex", paddingBottom: "10px" }}>
                <div className="p-2">
                  <Btn type="button" onClick={onAddBroker}>
                    <i className="ti ti-plus"></i> Add
                  </Btn>
                </div>
              </div>
              {brokers.length ? (
                <BenefitList>
                  {brokers.map((item, index) => {
                    return (
                      <Chip key={'broker' + index} id={item?.id} name={item?.name} onDelete={removeBroker} />
                    );
                  })}
                </BenefitList>
              ) : null}
            </div>
          </Col>
        </Row>
      </IconlessCard>
      <br />
      <br />
      {/* <RFQComponents/> */}
      <DataUpload />
    </div>
  );
};

const DataUpload = () => {

  const [file, setFile] = useState();
  const fileInputRef = useRef(null);

  const onTargetClick = () => {
    fileInputRef.current.click();
  };

  const onFileInputChange = (event) => {
    const { files } = event.target;
    let temp_files = []
    if (files.length) {
      for (var i = 0; i < files.length; i++) {
        if (files[i]?.name.endsWith(".xlsx") || files[i]?.name.endsWith(".xls")) {
          temp_files.push(files[i])
        }
      }
    }
    setFile(temp_files);
  };


  return (
    <Col className="p-0" xl={12} lg={12} md={12} sm={12}>
      <FileDrop
        onDrop={(files, event) => {
          if (files.length && (files[0]?.name.endsWith(".xlsx") || files[0]?.name.endsWith(".xls")))
            setFile(files);
        }}
      >
        <AnotherCard
          className="mt-3 p-4 text-center"
          noShadow
          borderRadius="10px"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%2386B4EEFF' stroke-width='3' stroke-dasharray='12' stroke-dashoffset='6' stroke-linecap='square'/%3e%3c/svg%3e")`,
            wordBreak: "break-word",
          }}
        // bgColor={(file === false) ? "#ffc8c0" : "#F6F9FF"}
        >
          {!!file ? (
            <>
              <img
                className="mx-auto"
                width="80px"
                src="/assets/images/excel_logo.png"
                alt="Your File"
              />
              {file.map(({ name }, index) => <Title
                fontWeight="500"
                color="#555555"
                className="d-block"
                fontSize="1rem"
                key={index + 'file1'}
              >
                {name || 'wait'}
              </Title>)}
              <Title
                fontWeight="500"
                color="#555555"
                className="d-block"
                fontSize="1rem"
              >
                <span className="browse" onClick={onTargetClick}>
                  Browse
                </span>
              </Title>
            </>
          ) : (
            <>
              <img
                className="mx-auto"
                width="60px"
                src="/assets/images/RFQ/Group 6577@2x.png"
                alt="Drop File Here"
              />
              <Title
                fontWeight="500"
                color="#555555"
                className="d-block"
                fontSize="0.8rem"
              >
                Drop your file here.
              </Title>
              <Title
                fontWeight="500"
                color="#555555"
                className="d-block"
                fontSize="1rem"
              >
                or{" "}
                <span className="browse" onClick={onTargetClick}>
                  Browse
                </span>
              </Title>
            </>
          )}
          <input
            multiple
            onChange={onFileInputChange}
            ref={fileInputRef}
            onClick={(event) => {
              event.target.value = null
            }}
            type="file"
            accept={".xlsx, .xls"}
            className="hidden"
            style={{ display: "none" }}
          />
        </AnotherCard>
      </FileDrop>
      {(file === false) && (
        <Title
          className="d-block"
          fontWeight="500"
          color="#ff1717"
          fontSize="1.1rem"
        >
          File Required
        </Title>
      )}
    </Col>
  )
}

const BenefitList = styled.div`
  margin-left: 5px;
  border: 1px dashed #deff;
  padding: 11px;
  background: #efefef;
  border-radius: 5px;
  width: 90%;
`;
