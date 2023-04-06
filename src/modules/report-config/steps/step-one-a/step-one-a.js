import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Badge } from "react-bootstrap";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import {
  fieldResponse, clearfieldResponse
} from "../../report-config.slice";
import { v4 as uuidv4 } from "uuid";

const StepTwo = (props) => {
  const dispatch = useDispatch();
  const { globalTheme } = useSelector(state => state.theme)
  const response = useSelector((state) => state.reportConfig);
  const [ItemData, setItemData] = useState([]);

  useEffect(() => {
    if (!_.isEmpty(response?.col_resp)) {
      const itemsFromBackend = response?.col_resp?.map((obj) =>
        Object.assign({ id: uuidv4() }, obj)
      );

      setItemData(itemsFromBackend);
    }
  }, [response.col_resp]);

  //-----------------------------------------------

  const colfromBackend = {
    c1: {
      name: "Columns",
      items: ItemData,
    },
    c2: {
      name: "Selected Columns",
      items: [],
    },
  };

  useEffect(() => {
    if (!_.isEmpty(ItemData)) {
      setColumns(colfromBackend);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ItemData]);

  const [columns, setColumns] = useState(colfromBackend);
  //onDragEnd
  const onDragEnd = (result, columns, setColumns) => {
    if (!result.destination) return;
    const { source, destination } = result;
    if (source.droppableId !== destination.droppableId) {
      const sourceColumn = columns[source.droppableId];
      const destColumn = columns[destination.droppableId];
      const sourceItems = [...sourceColumn.items];
      const destItems = [...destColumn.items];
      const [removed] = sourceItems.splice(source.index, 1);
      destItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...sourceColumn,
          items: sourceItems,
        },
        [destination.droppableId]: {
          ...destColumn,
          items: destItems,
        },
      });
    } else {
      const column = columns[source.droppableId];
      const copiedItems = [...column.items];
      const [removed] = copiedItems.splice(source.index, 1);
      copiedItems.splice(destination.index, 0, removed);
      setColumns({
        ...columns,
        [source.droppableId]: {
          ...column,
          items: copiedItems,
        },
      });
    }
  };

  useEffect(() => {
    if (!_.isEmpty(columns.c2.items)) {
      const data = columns?.c2?.items;
      dispatch(fieldResponse(data));
    }
    if (_.isEmpty(columns.c2.items)) {
      dispatch(clearfieldResponse());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns.c2.items]);

  return (
    <Container>
      {!_.isEmpty(response.col_resp) ? (
        <RowDiv className="h-100">
          <DragDropContext
            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
          >
            <ColComponents xs={12} sm={12} md={12} lg={12} xl={12}>
              {Object.entries(columns).map(([id, column], index) => {
                return (
                  <Col key={id + index} xs={12} sm={12} md={5} lg={6} xl={6}>
                    <p
                      style={{
                        textAlign: "center",
                        fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                        color: 'white',
                        fontWeight: '700',
                        background: `linear-gradient(to right, #fce4ff, #fce4ff, #c0bbf3, #9d9bed, #747de6, #747de6, #747de6, #747de6, #9d9bed, #c0bbf3, #fce4ff, #fce4ff)`,

                      }}
                    >
                      {column?.name}
                    </p>
                    <Droppable droppableId={id} key={id}>
                      {(provided, snapshot) => {
                        return (
                          <div
                            {...provided.droppableProps}
                            ref={provided.innerRef}
                            style={{
                              padding: "20px",
                              margin: "20px",
                              borderRadius: '10px',
                              maxHeight: "300px",
                              overflow: "auto",
                              border: '1px dashed #2400ff',
                              background: snapshot.isDraggingOver
                                ? "#b992ff"
                                : "white",
                              transition: 'ease-in-out 0.2s',
                              height: snapshot.isDraggingOver ? ("100%") : ("100%"),
                              width: snapshot.isDraggingOver ? ("90%") : ("90%"),
                              // boxShadow: "inset 0 0 10px",
                            }}
                          >
                            {column.items.map((item, index) => {

                              let b = a[index];
                              return (
                                <Draggable
                                  key={item.id + index + 'step-one85'}
                                  draggableId={item.id}
                                  index={index}
                                >
                                  {(provided, snapshot) => {
                                    return (
                                      <Badge
                                        variant={
                                          snapshot.isDragging
                                            ? "success"
                                            : `${b}`
                                        }
                                        className="p-2 m-1"
                                        ref={provided.innerRef}
                                        {...provided.draggableProps}
                                        {...provided.dragHandleProps}
                                        style={{
                                          // userSelect: "none",
                                          color: `${b}`,
                                          ...provided.draggableProps.style,
                                          backgroundColor: "white",
                                          border: `1px solid ${b}`,
                                          fontSize: globalTheme.fontSize ? `calc(12px + ${globalTheme.fontSize - 92}%)` : '12px',
                                          fontWeight: "600",
                                        }}
                                      >
                                        {`${item?.table_name}.${item?.column_name}`}
                                      </Badge>
                                    );
                                  }}
                                </Draggable>
                              );
                            })}
                            {provided.placeholder}
                          </div>
                        );
                      }}
                    </Droppable>
                  </Col>
                );
              })}
            </ColComponents>
          </DragDropContext>
        </RowDiv>
      ) : (
        <div>
          <p
            style={{
              color: "red",
              fontSize: globalTheme.fontSize ? `calc(16px + ${globalTheme.fontSize - 92}%)` : '16px',
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            Please Select & Save the required Tables
          </p>
        </div>
      )}
    </Container>
  );
};

const Container = styled.div`
  /**/
`;

const RowDiv = styled(Row)`
  display: flex;
  justify-content: space-evenly;
`;


const ColComponents = styled(Col)`
  display: flex;
  flex-wrap: wrap;
  height: fit-content;
  margin: 5px;
  padding: 20px;
  justify-content: space-evenly;
`;

export default StepTwo;

const a = [
  "#003366",
  "#336699",
  "#3366cc",
  "#003399",
  "#000099",
  "#0000cc",
  "#000066",
  "#006666",
  "#0099cc",
  "#006699",
  "#339966",
  "#339933",
  "#00cc66",
  "#00cc00",
  "#00ff00",
  "#33cc33",
  "#009933",
  "#003300",
  "black",
  "#cc9900",
  "#ffcc00",
  "#ffcc66",
  "#ff3300",
  "#990000",
  "#800000",
  "#cc0099",
  "#660066",
  "#ff00ff",
  "#ffcc66",
  "#33ccff",
  "#003366",
  "#336699",
  "#3366cc",
  "#003399",
  "#000099",
  "#0000cc",
  "#000066",
  "#006666",
  "#0099cc",
  "#006699",
  "#339966",
  "#339933",
  "#00cc66",
  "#00cc00",
  "#00ff00",
  "#33cc33",
  "#009933",
  "#003300",
  "black",
  "#cc9900",
  "#ffcc00",
  "#ffcc66",
  "#ff3300",
  "#990000",
  "#800000",
  "#cc0099",
  "#660066",
  "#ff00ff",
  "#ffcc66",
  "#33ccff",
  "#003366",
  "#336699",
  "#3366cc",
  "#003399",
  "#000099",
  "#0000cc",
  "#000066",
  "#006666",
  "#0099cc",
  "#006699",
  "#339966",
  "#339933",
  "#00cc66",
  "#00cc00",
  "#00ff00",
  "#33cc33",
  "#009933",
  "#003300",
  "black",
  "#cc9900",
  "#ffcc00",
  "#ffcc66",
  "#ff3300",
  "#990000",
  "#800000",
  "#cc0099",
  "#660066",
  "#ff00ff",
  "#ffcc66",
  "#33ccff",
  "#003366",
  "#336699",
  "#3366cc",
  "#003399",
  "#000099",
  "#0000cc",
  "#000066",
  "#006666",
  "#0099cc",
  "#006699",
  "#339966",
  "#339933",
  "#00cc66",
  "#00cc00",
  "#00ff00",
  "#33cc33",
  "#009933",
  "#003300",
  "black",
  "#cc9900",
  "#ffcc00",
  "#ffcc66",
  "#ff3300",
  "#990000",
  "#800000",
  "#cc0099",
  "#660066",
  "#ff00ff",
  "#ffcc66",
  "#33ccff",
  "#003366",
  "#336699",
  "#3366cc",
  "#003399",
  "#000099",
  "#0000cc",
  "#000066",
  "#006666",
  "#0099cc",
  "#006699",
  "#339966",
  "#339933",
  "#00cc66",
  "#00cc00",
  "#00ff00",
  "#33cc33",
  "#009933",
  "#003300",
  "black",
  "#cc9900",
  "#ffcc00",
  "#ffcc66",
  "#ff3300",
  "#990000",
  "#800000",
  "#cc0099",
  "#660066",
  "#ff00ff",
  "#ffcc66",
  "#33ccff",
];
