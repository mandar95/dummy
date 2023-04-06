import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import swal from 'sweetalert';

import { Row, Col } from 'react-bootstrap';
import { Input, Button } from 'components';
import TemplateCard from './Card/TemplateCard';
import { Header, Tags, Div } from './Tags';

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { sort_sms, reset_sms_template, createSmsTemplate } from '../communication-config.slice';
import { HTMLInput } from './Box-Input'



export const Sms = ({ _setTab }) => {

  const dispatch = useDispatch();
  const { dynamic_data, sms, success } = useSelector(state => state.commConfig)
  const [template_name, setTemplate_name] = useState('');
  const { userType: userTypeName } = useSelector(state => state.login);

  useEffect(() => {
    if (success) {
      setTemplate_name('')
    }
  }, [success])


  const onDragEnd = (result) => {
    //reorderinglogic
    const { destination, source, draggableId } = result;
    dispatch(sort_sms({
      sourceIdStart: source?.droppableId,
      destinationIdEnd: destination?.droppableId,
      sourceIndexEnd: source?.index,
      destinationIndexStart: destination?.index,
      id: draggableId
    }))
  }

  const handleChange = (e) => {
    setTemplate_name(e.target.value)
  }

  const example2 = () => (
    <TemplateCard style={{ width: '500px' }} border>
      <Header>
        Mobile Messenger
        <Div>
          {HTMLInput(0, 0, sms.value, 'sms')}
        </Div>
      </Header>
    </TemplateCard>
  )

  const DynamicBox = () => (
    <Droppable droppableId="dynamic">
      {provided => (<div {...provided.droppableProps} ref={provided.innerRef}>
        <TemplateCard label='Dynamic Values' variant='#fbfceb'>
          <div className='d-flex flex-wrap m-3'>
            {dynamic_data.map(({ id, name }, index) => (
              <Draggable key={index} draggableId={`dynamic-${id}`} index={index}>
                {newprov => (
                  <Tags ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >{name}</Tags>
                )}
              </Draggable>
            ))}
          </div>
          {provided.placeholder}
        </TemplateCard>
      </div>)}
    </Droppable>
  )

  const resetSmsTemplate = () => {
    dispatch(reset_sms_template());
    setTemplate_name('');
  }

  const onSubmit = () => {
    if (!template_name)
      swal("Validation", 'Template name required', "info");
    else if (!sms.value) {
      swal("Validation", "Sms template is empty", "info");
    }
    else
      dispatch(createSmsTemplate(sms, template_name, dynamic_data, userTypeName, true, undefined, _setTab))
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Rows className="d-flex flex-wrap mt-5">
        <Col md={12} lg={8} xl={8} sm={12}>
          <Rows>
            <Col md={12} lg={6} xl={6} sm={12}>
              <Input
                required={false}
                isRequired={true}
                value={template_name}
                label='Template Name'
                placeholder='Enter Template Name'
                onChange={handleChange} />
            </Col>
            <Col md={12} lg={12} xl={12} sm={12} className='d-flex justify-content-center'>
              {example2()}
            </Col>
            <Col md={12} lg={12} xl={12} sm={12} className="d-flex justify-content-end mt-4">
              <Button type="button" onClick={resetSmsTemplate} buttonStyle="danger">
                Reset
              </Button>
              <Button type="button" onClick={onSubmit}>
                Submit
              </Button>
            </Col>
          </Rows>
        </Col>
        <Col md={12} lg={4} xl={4} sm={12}>
          {DynamicBox()}
        </Col>
      </Rows>
    </DragDropContext>)
}

const Rows = styled(Row)`
margin: 0`
