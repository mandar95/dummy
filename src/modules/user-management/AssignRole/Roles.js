import React, { Fragment, useEffect, useState } from 'react'

import { Row, Col } from 'react-bootstrap';
import swal from 'sweetalert';
import { ParentCheckbox, ChildCheckBox } from "./option/OptionRef";


export const Roles = ({ modules, watch, register, create }) => {

  const watchModule = watch('module_id') || []
  const [flag, setFlag] = useState(0)
  const [prefillModules, setPrefillModules] = useState((create) ? null : false);

  useEffect(() => {
    if (flag < 2 && modules && modules.length)
      setFlag(prev => prev + 1)

  }, [flag, modules])

  useEffect(() => {
    if (prefillModules) {
      setTimeout(() => {
        setFlag(0)
      }, 200)
    }
  }, [prefillModules])

  useEffect(() => {
    if ((create )) {
      swal({
        title: 'Auto Select All the Modules?',
        text: "Should auto select all the modules & its options",
        icon: "info",
        buttons: {
          cancel: "Manual Select",
          catch: {
            text: "Auto Select",
            value: "update",
          },
        },
        dangerMode: 'true',
      })
        .then((caseValue) => {
          switch (caseValue) {
            case "update":
              setPrefillModules(true)
              break;
            default:
              setPrefillModules(false)
          }
        })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return prefillModules !== null && (
    <Row className="d-flex flex-wrap">
      {modules?.map((parentElem) => {
        return (
          <Fragment key={`module1-${parentElem.id}`}>
            <Col className="pl-0" md={7} lg={7} xl={7} sm={7} >
              <ParentCheckbox id={parentElem.id}
                name={`module_id.${parentElem.id}`}
                register={register}
                onChange={(e) => {
                  setTimeout(() => {
                    setFlag((prev) => prev + 1)
                  }, 200)
                  return e
                }}
                defaultValue={(parentElem.isSelected || prefillModules) && parentElem.id}
                text={parentElem.moduleName || parentElem.name} />
            </Col>
            {(watchModule[parentElem.id]) ?
              (parentElem.child.length) ?
                parentElem.child.map((childElem) =>
                  <Fragment key={`module2-${childElem.id}`}>
                    <Col md={7} lg={7} xl={7} sm={7} style={{ paddingLeft: "5vw" }} >
                      <ParentCheckbox id={childElem.id}
                        name={`module_id.${childElem.id}`}
                        register={register}
                        onChange={(e) => {
                          setTimeout(() => {
                            setFlag((prev) => prev + 1)
                          }, 200)
                          return e
                        }}
                        defaultValue={(childElem.isSelected || prefillModules) && childElem.id}
                        text={childElem.moduleName || childElem.name} />
                    </Col>
                    {((watchModule[childElem.id] === undefined || watchModule[childElem.id] === null) ? childElem.isSelected === 1 : watchModule[childElem.id]) &&
                      <Col className="pl-0" md={5} lg={5} xl={5} sm={5} >
                        <div className="d-flex flex-grow-1 mt-3 mb-3 rounded-lg justify-content-around">
                          <ChildCheckBox id={childElem.id} text="Read"
                            name={`canread.${childElem.id}`}
                            register={register}
                            // defaultValue={true}
                            defaultValue={(childElem.canread || watchModule[childElem.id] || prefillModules) && childElem.id}
                          />
                          <ChildCheckBox id={childElem.id} text="Write"
                            name={`canwrite.${childElem.id}`}
                            register={register}
                            defaultValue={(childElem.canwrite || prefillModules) && childElem.id}
                          />
                          <ChildCheckBox id={childElem.id} text="Delete"
                            name={`candelete.${childElem.id}`}
                            register={register}
                            defaultValue={(childElem.candelete || prefillModules) && childElem.id}
                          />
                          {[childElem.moduleName, childElem.name].includes('Policy List') &&
                            <ChildCheckBox id={childElem.id} text="Approve"
                              name={`other.${childElem.id}`}
                              register={register}
                              defaultValue={(childElem.other || prefillModules) && childElem.id}
                            />}
                        </div>
                      </Col>
                    }
                  </Fragment>
                )
                :
                <Col className="pl-0" md={5} lg={5} xl={5} sm={5} >
                  <div className="d-flex flex-grow-1 mt-3 mb-3 rounded-lg justify-content-around">
                    <ChildCheckBox id={parentElem.id} text="Read"
                      name={`canread.${parentElem.id}`}
                      register={register}
                      // defaultValue={true}
                      defaultValue={(parentElem.canread || watchModule[parentElem.id] || prefillModules) && parentElem.id}
                    />
                    <ChildCheckBox id={parentElem.id} text="Write"
                      name={`canwrite.${parentElem.id}`}
                      register={register}
                      defaultValue={(parentElem.canwrite || prefillModules) && parentElem.id}
                    />
                    <ChildCheckBox id={parentElem.id} text="Delete"
                      name={`candelete.${parentElem.id}`}
                      register={register}
                      defaultValue={(parentElem.candelete || prefillModules) && parentElem.id}
                    />
                  </div>
                </Col>
              : ""
            }
          </Fragment>
        )
      })
      }
    </Row>)
}
