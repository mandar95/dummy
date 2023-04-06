import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { TemplateCard, Input, InputBox } from './components';
import styled from "styled-components";
// import classes from "./index.module.css"

const Span = styled.span`
@media (max-width: 374px) {
  font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(10px + ${fontSize - 92}%)` : '10px'};
}
`

export const SheetFormat = ({ data, inputs, handleChange, setShow, type }) => {
  return (
    <Droppable droppableId={`drop-div`}>
      {(provided, snapshot) => (<div {...provided.droppableProps} ref={provided.innerRef}>
        <TemplateCard label='Excel SetUp' variant='rgb(252, 228, 255)'>
          {/* {type === 9 && <span  onClick={() => setShow(true)} className={`bg-primary text-light px-5 ${classes.absolute2}`}>Add</span>} */}
          <div className='d-flex flex-wrap m-3'>
            {data.map((elem, index) => !!elem?.feild_name && (
              <Draggable key={elem.id + 'sheet-format' + index} draggableId={`droped-${index}`} index={index}>
                {(newprov, dragSnap) => (<InputBox drag={dragSnap.isDragging ? true : ''}
                  ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >

                  <Span>{`${index + 1}. ${elem.feild_name}`}
                    {elem.is_mandatory ? <sup> <img height='8px' alt="important" src='/assets/images/inputs/important.png' /> </sup> : ''} :</Span>

                  <Input
                    autoFocus
                    defaultValue={inputs[elem.feild_name]}
                    name={elem.feild_name}
                    onChange={handleChange}
                    fontSize={'1em'}
                    placeholder={'Enter Key Name'} />

                </InputBox>)}
              </Draggable>
            ))}
          </div>
          {provided.placeholder}
        </TemplateCard>
      </div >)}
    </Droppable >
  )
}
