import React, { Fragment, useEffect, useState } from "react";
import { Row, Col } from "react-bootstrap";
import { ParentCheckbox, ChildCheckBox } from "./option/OptionRef";
import { numOnly, noSpecial } from 'utils';

export const RolesForEmployer = ({
  modules,
  watch,
  register,
  Controller,
  control,
}) => {
  const watchModule = watch("module_id_employer") || [];
  watch("parentInput_id_employer");
  const [flag, setFlag] = useState(0);

  useEffect(() => {
    if (flag < 2 && modules && modules.length) setFlag((prev) => prev + 1);
  }, [flag, modules]);

  return (
    <Row className="d-flex flex-wrap">
      {modules?.map((parentElem) => {
        return (
          <Fragment key={`module1_employer-${parentElem.id}`}>
            <Col className="pl-0 my-2" md={7} lg={7} xl={7} sm={7}>
              <div className="d-flex align-items-center">
                {watchModule[parentElem.id] && <div className="mr-2 align-self-center">
                  {/* <Controller
                    as={ */}
                  <input
                    required={true}
                    style={{ width: "30px", height: "30px" }}
                    type='tel'
                    maxLength={4}
                    onKeyDown={numOnly} onKeyPress={noSpecial}
                    ref={register({ required: true })}
                    name={`parentInput_id_employer.${parentElem.id}`}
                    defaultValue={parentElem?.module_sequence}
                  // control={control}
                  />
                  {/* } */}
                  {/* /> */}
                </div>}
                <div>
                  <ParentCheckbox
                    id={parentElem.id}
                    name={`module_id_employer.${parentElem.id}`}
                    register={register}
                    defaultValue={parentElem.isSelected && parentElem.id}
                    text={parentElem.moduleName || parentElem.name}
                  />
                </div>
              </div>
            </Col>
            {watchModule[parentElem.id] ? (
              parentElem.child.length ? (
                parentElem.child.map((childElem) => (
                  <Fragment key={`module3-${childElem.id}`}>
                    <Col
                      md={7}
                      lg={7}
                      xl={7}
                      sm={7}
                      style={{ paddingLeft: "5vw" }}
                    >
                      <div className="d-flex align-items-center">
                        {watchModule[childElem.id] && <div className="mr-2 align-self-center">
                          {/* <Controller
                              as={ */}
                          <input
                            required={true}
                            style={{ width: "30px", height: "30px" }}
                            type='tel'
                            maxLength={4}
                            ref={register({ required: true })}
                            onKeyDown={numOnly} onKeyPress={noSpecial}
                            defaultValue={childElem?.module_sequence}
                            name={`childInput_id_employer.${childElem.id}`}
                          // control={control}
                          />
                          {/* } */}
                          {/* /> */}
                        </div>}
                        <div>
                          <ParentCheckbox
                            id={childElem.id}
                            name={`module_id_employer.${childElem.id}`}
                            register={register}
                            defaultValue={
                              childElem.isSelected && childElem.id
                            }
                            text={childElem.moduleName || childElem.name}
                          />
                        </div>
                      </div>
                    </Col>
                    {(watchModule[childElem.id] === undefined ||
                      watchModule[childElem.id] === null
                      ? childElem.isSelected === 1
                      : watchModule[childElem.id]) && (
                        <Col className="pl-0" md={5} lg={5} xl={5} sm={5}>
                          <div className="d-flex flex-grow-1 mt-3 mb-3 rounded-lg justify-content-around">
                            <ChildCheckBox
                              id={childElem.id}
                              text="Read"
                              name={`canread_employer.${childElem.id}`}
                              register={register}
                              defaultValue={
                                (childElem.canread && childElem.id) ||
                                (watchModule[childElem.id] && childElem.id)
                              }
                            />
                            <ChildCheckBox
                              id={childElem.id}
                              text="Write"
                              name={`canwrite_employer.${childElem.id}`}
                              register={register}
                              defaultValue={childElem.canwrite && childElem.id}
                            />
                            <ChildCheckBox
                              id={childElem.id}
                              text="Delete"
                              name={`candelete_employer.${childElem.id}`}
                              register={register}
                              defaultValue={childElem.candelete && childElem.id}
                            />
                          </div>
                        </Col>
                      )}
                  </Fragment>
                ))
              ) : (
                <Col className="pl-0" md={5} lg={5} xl={5} sm={5}>
                  <div className="d-flex flex-grow-1 mt-3 mb-3 rounded-lg justify-content-around">
                    <ChildCheckBox
                      id={parentElem.id}
                      text="Read"
                      name={`canread_employer.${parentElem.id}`}
                      register={register}
                      defaultValue={
                        (parentElem.canread && parentElem.id) ||
                        (watchModule[parentElem.id] && parentElem.id)
                      }
                    />
                    <ChildCheckBox
                      id={parentElem.id}
                      text="Write"
                      name={`canwrite_employer.${parentElem.id}`}
                      register={register}
                      defaultValue={parentElem.canwrite && parentElem.id}
                    />
                    <ChildCheckBox
                      id={parentElem.id}
                      text="Delete"
                      name={`candelete_employer.${parentElem.id}`}
                      register={register}
                      defaultValue={parentElem.candelete && parentElem.id}
                    />
                  </div>
                </Col>
              )
            ) : (
              ""
            )}
          </Fragment>
        );
      })}
    </Row>
  );
};
