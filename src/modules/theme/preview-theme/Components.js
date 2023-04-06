import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";

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

import { Button as Btn, Row, Col } from "react-bootstrap";
import { useSelector } from "react-redux";

export const Components = () => {
  const { previewTheme } = useSelector((state) => state.theme);
  const [tab, setTab] = useState(true);
  const brokerData = [
    { id: 12, name: "TCS", contact: "7738545542", users: 5, employers: 7 },
    { id: 22, name: "Infosys", contact: "9769112157", users: 5, employers: 3 },
    { id: 13, name: "HCL", contact: "9293212299", users: 0, employers: 0 },
    { id: 14, name: "Wipro", contact: "9987952528", users: 0, employers: 0 },
    { id: 1, name: "Apple", contact: "7738545542", users: 5, employers: 7 },
    { id: 2, name: "Google", contact: "9769112157", users: 5, employers: 3 },
    { id: 10, name: "Microsoft", contact: "9293212299", users: 0, employers: 0 },
    { id: 11, name: "Meta", contact: "9987952528", users: 0, employers: 0 },
  ];

  /*--------------------------Broker Chip Selection code----------------------*/
  //chip states
  const [broker, setBroker] = useState("");
  const [brokers, setBrokers] = useState([{ id: 1, name: "Apple", contact: "7738545542", users: 5, employers: 7 },
  { id: 2, name: "Google", contact: "9769112157", users: 5, employers: 3 },
  { id: 10, name: "Microsoft", contact: "9293212299", users: 0, employers: 0 },
  { id: 11, name: "Meta", contact: "9987952528", users: 0, employers: 0 }]);

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
    <ThemeProvider theme={previewTheme}>
      <div className="p-5">
        <div className="mb-4">
          <h1 className="display-4 d-flex justify-content-start mt-0">
            {" "}
            Cards{" "}
          </h1>
          <div className="d-flex flex-column">
            <Card title="Card 1" />
            <CardBlue title="Card 2" />
            <IconlessCard title="Card 3" />
          </div>
        </div>

        <div className="mb-4">
          <h1 className="display-4 d-flex justify-content-start mt-0"> Tab </h1>
          <div>
            <TabWrapper width={"max-content"}>
              <Tab isActive={tab} onClick={() => setTab(true)}>
                Option 1
              </Tab>
              <Tab isActive={!tab} onClick={() => setTab(false)}>
                Option 2
              </Tab>
            </TabWrapper>
          </div>
        </div>

        <div className="mb-4">
          <h1 className="display-4 d-flex justify-content-start mt-0">
            {" "}
            Buttons{" "}
          </h1>
          <div className="d-flex pl-5 flex-wrap">
            <Button className="mr-4 mb-3" buttonStyle="">
              Submit
            </Button>
            <Button className="mr-4 mb-3" buttonStyle="danger">
              Error
            </Button>
            <Button className="mr-4 mb-3" buttonStyle="warning">
              Warning
            </Button>
            <Button className="mr-4 mb-3" buttonStyle="outline">
              Outline
            </Button>
            <Button className="mr-4 mb-3" buttonStyle="square-outline">
              Square-Outline
            </Button>
            <Button className="mr-4 mb-3" buttonStyle="submit-disabled">
              Submit-Disabled
            </Button>
            <Button className="mr-4 mb-3" buttonStyle="outline-solid">
              Outline-Solid
            </Button>
          </div>
        </div>

        <div className="mb-4">
          <h1 className="display-4 d-flex justify-content-start mt-0">
            {" "}
            Stepper{" "}
          </h1>
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
                  key={config.id + "theme" + index}
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
        </div>

        {/*chip setup*/}
        <div className="mb-4">
          <h1 className="display-4 d-flex justify-content-start mt-0">
            {" "}
            Chip{" "}
          </h1>
          <IconlessCard title="Chip">
            <Row>
              <Col lg={6} md={12} xl={6}>
                <div>
                  <div className="p-2">
                    <Select
                      label="Employer"
                      placeholder="Select Employer"
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
                          <Chip
                            key={"broker" + index}
                            id={item?.id}
                            name={item?.name}
                            onDelete={removeBroker}
                          />
                        );
                      })}
                    </BenefitList>
                  ) : null}
                </div>
              </Col>
            </Row>
          </IconlessCard>
        </div>
      </div>
    </ThemeProvider>
  );
};

const BenefitList = styled.div`
  margin-left: 5px;
  border: 1px dashed #deff;
  padding: 11px;
  background: #efefef;
  border-radius: 5px;
  width: 90%;
`;
