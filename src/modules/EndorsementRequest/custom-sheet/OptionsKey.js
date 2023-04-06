import React from 'react';
import { Droppable, Draggable } from 'react-beautiful-dnd';

import { TemplateCard, Tags } from './components';

export const OptionsKey = ({ dynamic_data }) => {
  return (
    <Droppable droppableId="dynamic">
      {provided => (<div {...provided.droppableProps} ref={provided.innerRef}>
        <TemplateCard label='Dynamic Values' variant='#fdffdc'>
          <div className='d-flex flex-wrap m-3'>
            {dynamic_data.map(({ id, feild_name }, index) => (
              <Draggable key={index + 'option-key'} draggableId={`dynamic-${index}`} index={index}>
                {newprov => (
                  <Tags ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >{feild_name}</Tags>
                )}
              </Draggable>
            ))}
          </div>
          {provided.placeholder}
        </TemplateCard>
      </div>)}
    </Droppable>
  )
}
