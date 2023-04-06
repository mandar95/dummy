import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Badge } from "react-bootstrap";
import styled from "styled-components";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import _ from "lodash";
import {
  getInfo,
  getCol,
  colResponse,
  clearColDetails,
  clearcolResponse,
  verifyTableMerge,
  clear,
  clear_report_resp
} from "../../report-config.slice";
import swal from "sweetalert";
import { v4 as uuidv4 } from "uuid";
import { Button } from "../../../../components";

let col = [];
const StepTwo = (props) => {
  const dispatch = useDispatch();
  const { globalTheme } = useSelector(state => state.theme)
  const response = useSelector((state) => state.reportConfig);
  const { userType } = useSelector((state) => state.login);

  const [ItemData, setItemData] = useState([]);
  // const [search, setSearch] = useState();

  //api call & alert handling----------------------
  useEffect(() => {
    if (userType) {
      dispatch(getInfo(userType));
      dispatch(clearColDetails());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userType]);

  useEffect(() => {
    if (!_.isEmpty(response?.response?.data?.data)) {
      const itemsFromBackend = response?.response?.data?.data?.map((obj) =>
        Object.assign({ id: uuidv4() }, obj)
      );

      setItemData(itemsFromBackend);
    }
  }, [response.response.data]);

  //-----------------------------------------------

  const colfromBackend = {
    c1: {
      name: "Tables",
      items: ItemData,
    },
    c2: {
      name: "Selected Tables",
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
  const [prevcolumns, prevsetColumns] = useState();
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

  const onSubmit = () => {
    if (!_.isEmpty(columns.c2.items)) {
      if (columns.c2.items.length < 20) {
        const data = columns?.c2?.items;
        col = [];
        if (!_.isEmpty(data)) {
          data.forEach((data, index) => {
            const formdata = { table_name: data?.Tables_in_employeebenefit };
            dispatch(getCol(formdata));
          });
        }
      } else {
        swal("Maximum selection limit is 20", "", "warning");
      }
    } else {
      swal("Please select the required tables", "", "warning");
    }
  };

  useEffect(() => {
    if (!_.isEmpty(response?.colResp?.data?.data)) {
      let a = _.union(col, response?.colResp?.data?.data);
      a = _.uniqWith(
        a,
        (A, B) =>
          A.column_name === B.column_name &&
          A.column_type === B.column_type &&
          A.table_name === B.table_name
      );
      col = a;
      dispatch(colResponse(col));
    }
    if (_.isEmpty(response?.colResp)) {
      dispatch(clearcolResponse());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.colResp.data]);


  //merge eligibility check
  useEffect(() => {
    if (!_.isEmpty(columns.c2.items)) {
      let selected_table = columns.c2.items.map(item => { return item.Tables_in_employeebenefit })
      selected_table = Object.values(selected_table)
      const formData = {
        selected_tables: selected_table
      }
      dispatch(verifyTableMerge(formData))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [columns])

  //report error
  /*-----------------error/success handling ----------------*/
  //set prev state on error
  useEffect(() => {
    if (response.error) {
      swal("Alert", response.error, "warning").then(() => {
        setColumns(prevcolumns)
      });
    }

    return () => {
      dispatch(clear());
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.error]);

  //update prev state on success
  useEffect(() => {
    if (response.report_merge) {
      prevsetColumns(columns)
    }

    return () => {
      dispatch(clear_report_resp());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [response.report_merge])
  /*----------x------error/success handling ----------x-----*/

  return (
    <Container>
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
                      fontWeight: "600",
                      color: "white",
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
                            border: "1px dashed #2400ff",
                            borderRadius: "10px",
                            maxHeight: "300px",
                            overflow: "auto",
                            background: snapshot.isDraggingOver
                              ? "#b992ff"
                              : "white",
                            transition: "ease-in-out 1s",
                            height: snapshot.isDraggingOver ? "100%" : "100%",
                            width: snapshot.isDraggingOver ? "90%" : "90%",
                            // boxShadow: "inset 0 0 10px",
                          }}
                        >
                          {column.items.map((item, index) => {

                            let b = a[index];
                            return (
                              <Draggable
                                key={item.id + index}
                                draggableId={item.id}
                                index={index}
                              >
                                {(provided, snapshot) => {
                                  return (
                                    <Badge
                                      variant={
                                        snapshot.isDragging ? "success" : `${b}`
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
                                      {item.Tables_in_employeebenefit}
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
        <RowButton>
          <Button
            hex1="#9900cc"
            hex2="#cc00cc"
            buttonStyle="outline-solid"
            onClick={onSubmit}
            style={{ marginTop: "20px", marginBottom: "10px" }}
          >
            Save
          </Button>
        </RowButton>
      </RowDiv>
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

const RowButton = styled(Row)`
  display: flex;
  justify-content: flex-end;
  width: 90%;
  height: 100%;
  margin-top: 10px;
  margin-bottom: 10px;
  @media (max-width: 600px) {
    justify-content: center;
    padding-top: 10px;
    padding-bottom: 10px;
  }

  /* overflow: auto; */
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
