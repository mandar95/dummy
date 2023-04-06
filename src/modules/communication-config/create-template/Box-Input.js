import React from 'react';
import { Input, InputBox } from './Tags';

import { add_text } from '../communication-config.slice';
import { useDispatch } from 'react-redux';
import { Droppable } from 'react-beautiful-dnd';
import { Div, PreviewImg, BorderDiv } from './Tags';
import { AttachFile } from 'modules/core';

export const HTML = (id) => {
  switch (id) {
    case 1:
      return (<InputBox children={'<> H1 </>'} />);
    case 2:
      return (<InputBox children={'<> H2 </>'} />);
    case 3:
      return (<InputBox children={'<> H3 </>'} />);
    case 4:
      return (<InputBox children={'<> H4 </>'} />);
    case 5:
      return (<InputBox children={'<> H5 </>'} />);
    case 6:
      return (<InputBox children={'<> H6 </>'} />);
    case 7:
      return (<InputBox children={'<> P </>'} />);
    case 8:
      return (<InputBox children={'<> Img </>'} />);
    case 9:
      return (<InputBox children={'<> Anchor </>'} />);
    default: return (<></>);
  }
}

export const HTMLInput = (index, id, value, table, setFiles) => {

  const dispatch = useDispatch();

  const handleChange = (e) => {
    dispatch(add_text({
      value: e.target.value,
      id, table, index
    }))
  }

  const addImage = (filesAccepted) => {
    const file = filesAccepted[0];
    const url = URL.createObjectURL(file);
    // const image = URL.revokeObjectURL(url);
    // let image = await fetch(url).then(r => r.blob());

    dispatch(add_text({
      value: { name: file.name, url: url },
      id, table, index, file: file
    }))
    setFiles(prev => [...prev, file])
  }

  switch (id) {
    case 1:
      return (
        <Droppable droppableId={`input-h1-${index}-${table}`} index={index}>
          {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
            <Input
              autoFocus
              drag={snapshot.isDraggingOver ? 'true' : ''}
              value={value}
              onChange={handleChange}
              fontSize={'1.3em'}
              placeholder={'<> H1 </>'} />
            {provided.placeholder}
          </Div>)}
        </Droppable>
      );
    case 2:
      return (
        <Droppable droppableId={`input-h2-${index}-${table}`} index={index}>
          {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
            <Input
              autoFocus
              drag={snapshot.isDraggingOver ? 'true' : ''}
              value={value}
              onChange={handleChange}
              fontSize={'1em'}
              placeholder={'<> H2 </>'} />
            {provided.placeholder}
          </Div>)}
        </Droppable>
      );
    case 3:
      return (
        <Droppable droppableId={`input-h3-${index}-${table}`} index={index}>
          {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
            <Input
              autoFocus
              drag={snapshot.isDraggingOver ? 'true' : ''}
              value={value}
              onChange={handleChange}
              fontSize={'0.75em'}
              placeholder={'<> H3 </>'} />
            {provided.placeholder}
          </Div>)}
        </Droppable>
      );
    case 4:
      return (
        <Droppable droppableId={`input-h4-${index}-${table}`} index={index}>
          {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
            <Input
              autoFocus
              drag={snapshot.isDraggingOver ? 'true' : ''}
              value={value}
              onChange={handleChange}
              fontSize={'0.6em'}
              placeholder={'<> H4 </>'} />
            {provided.placeholder}
          </Div>)}
        </Droppable>
      );
    case 5:
      return (
        <Droppable droppableId={`input-h5-${index}-${table}`} index={index}>
          {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
            <Input
              autoFocus
              drag={snapshot.isDraggingOver ? 'true' : ''}
              value={value}
              onChange={handleChange}
              fontSize={'0.52em'}
              placeholder={'<> H5 </>'} />
            {provided.placeholder}
          </Div>)}
        </Droppable>
      );
    case 6:
      return (
        <Droppable droppableId={`input-p-${index}-${table}`} index={index}>
          {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
            <Input
              autoFocus
              drag={snapshot.isDraggingOver ? 'true' : ''}
              value={value}
              onChange={handleChange}
              fontSize={'0.41em'}
              placeholder={'<> H6 </>'} />
            {provided.placeholder}
          </Div>)}
        </Droppable >
      );
    case 7:
      return (
        <Droppable droppableId={`input-p-${index}-${table}`} index={index}>
          {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
            <Input
              autoFocus
              drag={snapshot.isDraggingOver ? 'true' : ''}
              value={value}
              onChange={handleChange}
              fontSize={'0.62em'}
              fontWeight={500}
              placeholder={'<> P </>'} />
            {provided.placeholder}
          </Div>)}
        </Droppable >
      );
    case 8:
      return (!value ?
        <BorderDiv>
          <AttachFile
            name="premium_file"
            title="Attach File"
            key="premium_file"
            accept=".jpeg, .png, .jpg"
            onUpload={addImage}
            description="File Formats: jpeg, png, jpg"
            nameBox
            required
          />
        </BorderDiv> :

        <PreviewImg
          src={value.url || "/assets/images/nprv.png"}
          alt="Email Image"
        />)
    case 9:
      return (
        <Droppable droppableId={`input-p-${index}-${table}`} index={index}>
          {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
            <Input
              autoFocus
              drag={snapshot.isDraggingOver ? 'true' : ''}
              value={value}
              onChange={handleChange}
              fontSize={'0.75em'}
              placeholder={'<> Anchor </>'} />
            {provided.placeholder}
          </Div>)}
        </Droppable >
      );
    default: return (
      <Droppable droppableId={`input-p-${index}-${table}`} index={index}>
        {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
          <Input
            minheight={'500px'}
            autoFocus
            drag={snapshot.isDraggingOver ? 'true' : ''}
            value={value}
            onChange={handleChange}
            fontSize={'0.75em'}
            placeholder={'<> Text </>'} />
          {provided.placeholder}
        </Div>)}
      </Droppable >
    );
  }
}
