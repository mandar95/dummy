import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import swal from 'sweetalert';

import { Row, Col } from 'react-bootstrap';
import { Input, Button/* , Select */ } from 'components';
import TemplateCard from './Card/TemplateCard';
import { Header, Tags, Div /* ,Header2 */ } from './Tags';
// import { /* Controller, */ useForm } from "react-hook-form";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { sort, reset_template, createEmailTemplate } from '../communication-config.slice';
// import { HTML, HTMLInput } from './Box-Input'
import { HTML, HTMLInput } from './Box-Input2'

// const _Events = [{ id: 1, name: 'Broker User' }]

export const Email = ({ files, setFiles, _setTab }) => {

  const dispatch = useDispatch();
  const [template_name, setTemplate_name] = useState('');
  const { html_data, header, content, footer, dynamic_data, success } = useSelector(state => state.commConfig);
  const { userType: userTypeName } = useSelector(state => state.login);

  // const { watch, control } = useForm();

  // let _eventId = watch('event_id')

  useEffect(() => {
    if (success) {
      setTemplate_name('')
    }
  }, [success])

  const onDragEnd = (result) => {
    //reorderinglogic
    const { destination, source, draggableId } = result;
    dispatch(sort({
      sourceIdStart: source?.droppableId,
      destinationIdEnd: destination?.droppableId,
      sourceIndexEnd: source?.index,
      destinationIndexStart: destination?.index,
      id: draggableId
    }))
  }

  const example2 = () => (
    <TemplateCard border>
      <Droppable droppableId="header" type='box'>
        {(provided, snapshot) => (
          <Header drag={snapshot.isDraggingOver ? 'true' : ''} {...provided.droppableProps} ref={provided.innerRef}>
            {!!header.length ? header.map(({ id, value }, index) => (<Draggable key={`header-${index}`} draggableId={`header-${index}`} index={index}>
              {newprov => (
                <Div ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >
                  {HTMLInput(index, id, value, 'header', setFiles)}
                </Div>)}

            </Draggable>)) : '<> Header </>'}
            {provided.placeholder}
          </Header>
        )}
      </Droppable>
      <Droppable droppableId="content" type='box'>
        {(provided, snapshot) => (
          <Header drag={snapshot.isDraggingOver ? 'true' : ''} height='200px' {...provided.droppableProps} ref={provided.innerRef}>
            {!!content.length ? content.map(({ id, value }, index) => (<Draggable key={`content-${index}`} draggableId={`content-${index}`} index={index}>
              {newprov => (
                <Div ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >
                  {HTMLInput(index, id, value, 'content', setFiles)}
                </Div>)}

            </Draggable>)) : '<> Content </>'}
            {provided.placeholder}
          </Header>
        )}
      </Droppable>
      <Droppable droppableId="footer" type='box'>
        {(provided, snapshot) => (
          <Header drag={snapshot.isDraggingOver ? 'true' : ''} {...provided.droppableProps} ref={provided.innerRef}>
            {!!footer.length ? footer.map(({ id, value }, index) => (<Draggable key={`footer-${index}`} draggableId={`footer-${index}`} index={index}>
              {newprov => (
                <Div ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >
                  {HTMLInput(index, id, value, 'footer', setFiles)}
                </Div>)}

            </Draggable>)) : '<> Footer </>'}
            {provided.placeholder}
          </Header>
        )}
      </Droppable>
    </TemplateCard >
  )

  // const example3 = () => (
  //   <TemplateCard border>
  //     <Droppable droppableId="header" type='box'>
  //       {(provided, snapshot) => (
  //         <Header2 drag={snapshot.isDraggingOver ? 'true' : ''} height='100px' {...provided.droppableProps} ref={provided.innerRef}>
  //           {!!header.length ? header.map(({ id, value }, index) => (<Draggable key={`header-${index}`} draggableId={`header-${index}`} index={index}>
  //             {newprov => (
  //               <Div ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >
  //                 {HTMLInput(index, id, value, 'header', setFiles)}
  //               </Div>)}

  //           </Draggable>)) : '<> Header </>'}
  //           {provided.placeholder}
  //         </Header2>
  //       )}
  //     </Droppable>
  //     <Droppable droppableId="content" type='box'>
  //       {(provided, snapshot) => (
  //         <Header2 drag={snapshot.isDraggingOver ? 'true' : ''} height='200px' {...provided.droppableProps} ref={provided.innerRef}>
  //           {!!content.length ? content.map(({ id, value }, index) => (<Draggable key={`content-${index}`} draggableId={`content-${index}`} index={index}>
  //             {newprov => (
  //               <Div ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >
  //                 {HTMLInput(index, id, value, 'content', setFiles)}
  //               </Div>)}

  //           </Draggable>)) : '<> Content </>'}
  //           {provided.placeholder}
  //         </Header2>
  //       )}
  //     </Droppable>
  //     <Droppable droppableId="footer" type='box'>
  //       {(provided, snapshot) => (
  //         <Header2 drag={snapshot.isDraggingOver ? 'true' : ''} height='100px' {...provided.droppableProps} ref={provided.innerRef}>
  //           {!!footer.length ? footer.map(({ id, value }, index) => (<Draggable key={`footer-${index}`} draggableId={`footer-${index}`} index={index}>
  //             {newprov => (
  //               <Div ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >
  //                 {HTMLInput(index, id, value, 'footer', setFiles)}
  //               </Div>)}

  //           </Draggable>)) : '<> Footer </>'}
  //           {provided.placeholder}
  //         </Header2>
  //       )}
  //     </Droppable>
  //   </TemplateCard >

  // )

  const HtmlBox = () => (
    <Droppable droppableId="html" type='box'>
      {provided => (<div {...provided.droppableProps} ref={provided.innerRef}>
        <TemplateCard label='Html Tags' variant='#fbfceb'>
          {html_data.map(({ id, value }, index) => (<Draggable key={`html-${index}`} draggableId={`html-${index}`} index={index}>
            {newprov => (<div ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >
              {HTML(id)}
            </div>)}

          </Draggable>))}
          {provided.placeholder}
        </TemplateCard>
      </div>
      )}
    </Droppable>
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

  const resetTemplate = () => {
    dispatch(reset_template());
    setTemplate_name('');
  }

  const handleChange = (e) => {
    setTemplate_name(e.target.value)
  }

  const onSubmit = () => {
    if (!template_name) {
      swal("Validation", 'Template name required', "info");
    }
    else if (!header.length && !content.length && !footer.length) {
      swal("Validation", "Email template is empty", "info");
    }
    else {
      dispatch(createEmailTemplate([...header, ...content, ...footer], template_name, files, dynamic_data, userTypeName, false, undefined, _setTab))
    }
  }


  return (<>
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
            <Col md={12} lg={12} xl={12} sm={12}>
              {example2()}
            </Col>
            <Col md={12} lg={12} xl={12} sm={12} className="d-flex justify-content-end mt-4">
              <Button type="button" onClick={resetTemplate} buttonStyle="danger">
                Reset
              </Button>
              <Button type="button" onClick={onSubmit}>
                Submit
              </Button>
            </Col>
          </Rows>
        </Col>
        <Col md={12} lg={4} xl={4} sm={12}>
          {HtmlBox()}
          {DynamicBox()}
        </Col>
      </Rows>
    </DragDropContext>
  </>)
}

const Rows = styled(Row)`
margin: 0`
