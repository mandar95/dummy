import React, { useState, useEffect } from "react";
import styled from "styled-components";
import swal from "sweetalert";
import ModalComponent from "./EditModel";
import checkIt from "config/validations/common";
import { Row, Col } from "react-bootstrap";
import { DragDropContext } from "react-beautiful-dnd";
import { Button, Input, Card, Loader, Select } from "components";
import { SheetFormat } from "./SheetFormat";
import { OptionsKey } from "./OptionsKey";
import { Title, Card as TextCard } from "modules/RFQ/select-plan/style.js";

import {
  createSheet,
  updateSheetTemplate,
  loadTemplates,
  clearState,
  loadDynamicKeys,
  Fetch
} from "../EndorsementRequest.slice";
import { useHistory, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { Decrypt } from "../../../utils";
const types = {
  add: 1,
  remove: 2,
  correct: 3,
  "member-sheet": 4,
  claim: 5,
  "intimate-claim-sheet": 6,
  "submit-claim-sheet": 7,
  "netwrok-hospital-sheet": 8,
  "report-enrolment": 9,
  "tpa-claim-export": 10,
  "gpa-claim": 14,
  "gpa-claim-export": 15,
  'employee-addition': 21,
  'employee-removal': 22,
  'employee-correction': 23,
  'gtl-import': 25,
  'gtl-export': 26
};

export default function CustomSheetEndorsement() {
  const [show, setShow] = useState(false);
  const [tpa_id, setTpaid] = useState("");
  const [tpaList, setTpaList] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [template_name, setTemplate_name] = useState("");
  const [dynamic_data, setDynamic_data] = useState([]);
  const [dynamic_data_temp, setDynamic_data_temp] = useState([]);
  const [data, setData] = useState([]);
  const [inputs, setInputs] = useState({});
  const { dynamicKeys, templates, success, error, loading } = useSelector(
    (state) => state.endorsementRequest
  );
  let { type, template_id } = useParams();
  template_id = Decrypt(template_id);
  useEffect(() => {
    if (types[type] === 10) {
      Fetch(template_id, setTpaList, setTpaid);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    const a = dynamic_data_temp.filter(data => Number(data.tpa_id) === Number(tpa_id))
    setDynamic_data(a.filter(({ is_mandatory }) => !is_mandatory));
    setData(a.filter(({ is_mandatory }) => is_mandatory));
    template_id && dispatch(loadTemplates({ template_id }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [tpa_id]);

  // NOTE: distribute mandatory and non-mandatory
  useEffect(() => {
    if (types[type] === 10 && dynamicKeys?.length) {
      let { feilds } = dynamicKeys.find(({ id }) => types[type] === id) || {
        feilds: [],
      };
      setDynamic_data_temp(feilds.filter(({ is_mandatory }) => !is_mandatory));
    } else if (dynamicKeys?.length) {
      let { feilds } = dynamicKeys.find(({ id }) => types[type] === id) || {
        feilds: [],
      };
      setDynamic_data(feilds.filter(({ is_mandatory }) => !is_mandatory));
      setDynamic_data_temp(feilds.filter(({ is_mandatory }) => !is_mandatory));
      setData(feilds.filter(({ is_mandatory }) => is_mandatory));
    } else {
      dispatch(loadDynamicKeys());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dynamicKeys]);

  // NOTE: on rearrange (required for unpredictable behaviour)
  useEffect(() => {
    setInputs((prev) => {
      const prevData = prev;
      let temp = {};
      data.forEach((elem) => {
        if (elem?.feild_name)
          temp[elem?.feild_name] = prevData[elem?.feild_name] || "";
      });
      return temp;
    });
  }, [data]);

  // NOTE: on edit set data
  useEffect(() => {
    if (
      template_id &&
      templates.length &&
      templates[0].id === Number(template_id)
    ) {
      if (types[type] === 10) {
        Fetch(template_id, setTpaList, setTpaid, templates[0]?.tpa_id)
      }
      const editTemplate = templates[0];
      setTemplate_name(editTemplate.name);
      setData(
        editTemplate.feilds.map(({ default_feild_data }) => default_feild_data)
      );
      setInputs(() => {
        let temp = {};
        editTemplate.feilds.forEach(({ label, default_feild_data }) => {
          if (default_feild_data)
            temp[default_feild_data.feild_name] = label || "";
        });
        return temp;
      });
      setDynamic_data((prev) =>
        prev.filter(
          (prevElem) =>
            !editTemplate.feilds?.some(
              (elem) => prevElem?.id === elem?.default_feild_data?.id
            )
        )
      );

    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [template_id, templates]);

  // NOTE: success || error
  useEffect(() => {
    if (success) {
      swal('Success', success, "success").then(() =>
        history.replace("/broker/endorsement-sheets/" + type)
      );
    }
    if (error) {
      swal("Alert", error, "warning");
    }

    return () => {
      dispatch(clearState());
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [success, error]);

  // NOTE: on drag and drop feature
  const sort = ({
    sourceIdStart,
    destinationIdEnd,
    sourceIndexEnd,
    destinationIndexStart,
    // id
  }) => {
    // A => B
    if (
      sourceIdStart !== destinationIdEnd &&
      (sourceIdStart === "dynamic") & (destinationIdEnd === "drop-div")
    ) {
      const dynamic_dataCopy = [...dynamic_data];
      const dataCopy = [...data];
      const html = dynamic_dataCopy.splice(sourceIndexEnd, 1);
      dataCopy.splice(destinationIndexStart, 0, ...html);
      setDynamic_data(dynamic_dataCopy);
      setData(dataCopy);
    }

    // reshuffle B
    if (sourceIdStart === destinationIdEnd && sourceIdStart === "drop-div") {
      const dataCopy = [...data];
      const html = dataCopy.splice(sourceIndexEnd, 1);
      dataCopy.splice(destinationIndexStart, 0, ...html);
      setData(dataCopy);
    }

    // B => A
    if (sourceIdStart !== destinationIdEnd && sourceIdStart === "drop-div") {
      const dataCopy = [...data];
      const dynamic_dataCopy = [...dynamic_data];
      const html = dataCopy.splice(sourceIndexEnd, 1);
      if (!html[0].is_mandatory) {
        dynamic_dataCopy.splice(destinationIndexStart, 0, ...html);
        setData(dataCopy);
        setDynamic_data(dynamic_dataCopy);
      }
    }
  };

  const onDragEnd = (result) => {
    //reorderinglogic
    const {
      destination,
      source,
      // draggableId
    } = result;
    sort({
      sourceIdStart: source?.droppableId,
      destinationIdEnd: destination?.droppableId,
      sourceIndexEnd: source?.index,
      destinationIndexStart: destination?.index,
      // id: draggableId
    });
  };

  const resetTemplate = () => {
    if (types[type] === 10) {
      setDynamic_data([]);
      setData([]);
      setTemplate_name("");
      setTpaid("");
    } else {
      let { feilds } = dynamicKeys.find(({ id }) => types[type] === id);
      const mandatoryFields = feilds.filter(({ is_mandatory }) => is_mandatory);
      setDynamic_data(feilds.filter(({ is_mandatory }) => !is_mandatory));
      setData(mandatoryFields);
      setInputs(() => {
        let temp = {};
        mandatoryFields.forEach(({ feild_name }) => {
          temp[feild_name] = "";
        });
        return temp;
      });
      setTemplate_name("");
    }
  };

  const onSubmit = () => {
    // regEx.test(event.target.value) === true
    if (types[type] === 10 && Number(tpa_id) === 0) {
      swal("Validation", "TPA Not Selected", "info");
      return;
    }
    if (data.length <= 0) {
      swal("Validation", "Key Not Selected", "info");
      return;
    }
    if (!template_name) {
      swal("Validation", "Template name required", "info");
      return;
    }
    if (checkIt.alphabets.test(template_name) !== true) {
      swal("Validation", "Only Alphabets Are Allowed", "info");
      return;
    }
    template_id
      ? dispatch(
        updateSheetTemplate({
          template_id: template_id,
          name: template_name,
          // format_id: types[type],
          fields: data.map(({ id, feild_name }) => ({
            id,
            name: inputs[feild_name] || feild_name,
          })),
        })
      )
      : dispatch(
        createSheet({
          name: template_name,
          format_id: types[type],
          fields: data.map(({ id, feild_name }) => ({
            id,
            name: inputs[feild_name] || feild_name,
          })),
          ...tpa_id && { tpa_id }
        })
      );
  };

  const handleChange = (e) => {
    if (e.target) {
      const name = e.target.name;
      const value = e.target.value;
      setInputs((prev) => ({ ...prev, [name]: value }));
    }
  };

  const changeTemplateName = (e) => {
    if (e.target) {
      setTemplate_name(e.target.value || "");
    }
  };
  function setdata(e) {
    setData((data) => [...data, e]);
  }

  return (
    <Card
      title={
        types[type] === 9
          ? "Dynamic sheet for Report Enrolment"
          : `${template_id ? "Update" : "Create"} Sheet Template`
      }
      containerstyle={{ padding: "0" }}
    >
      <DragDropContext onDragEnd={onDragEnd}>
        <Rows className="d-flex">
          <Col md={12} lg={6} xl={6} sm={12}>
            <Input
              required
              value={template_name}
              label="Template Name"
              placeholder="Enter Template Name"
              onChange={changeTemplateName}
            />
          </Col>
          {types[type] === 10 && <Col md={12} lg={6} xl={6} sm={12}>
            <Select
              options={tpaList}
              label="Select TPA"
              placeholder="Select TPA"
              value={tpa_id}
              disabled={template_id}
              onChange={(e) => setTpaid(e.target.value)}
            />
          </Col>}
        </Rows>
        <Rows className="d-flex flex-wrap mt-5">
          <Col md={12} lg={12} xl={4} sm={12}>
            {<OptionsKey dynamic_data={dynamic_data} />}
            <TextCard className="pl-3 pr-3 mb-4" noShadow bgColor="#f2f2f2">
              <Title fontSize="0.9rem" color="#ff7070">
                Note: If key name is not set then default label will be set
                <br />(
                <sup>
                  {" "}
                  <img
                    height="8px"
                    alt="important"
                    src="/assets/images/inputs/important.png"
                  />{" "}
                </sup>
                ) asterisk - mandatory key
              </Title>
            </TextCard>
          </Col>
          <Col md={12} lg={12} xl={8} sm={12}>
            {
              <SheetFormat
                data={data}
                inputs={inputs}
                handleChange={handleChange}
                setShow={setShow}
                type={types[type]}
              />
            }
          </Col>
        </Rows>
      </DragDropContext>
      <Rows>
        <Col
          md={12}
          lg={12}
          xl={12}
          sm={12}
          className="d-flex justify-content-end mt-4"
        >
          {!template_id && (
            <Button type="button" onClick={resetTemplate} buttonStyle="danger">
              Reset
            </Button>
          )}
          <Button type="button" onClick={onSubmit}>
            {template_id ? "Update" : "Submit"}
          </Button>
        </Col>
      </Rows>
      {loading && <Loader />}
      {show && (
        <ModalComponent
          show={show}
          onHide={() => setShow(false)}
          setData={setdata}
        />
      )}
    </Card>
  );
}

const Rows = styled(Row)`
  margin: 0;
`;
