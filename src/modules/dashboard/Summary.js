import React from 'react';

import { Accordion } from "react-bootstrap";
import classes from "modules/enrollment/index.module.css";
import classesone from "modules/enrollment/index.module.css";
import AccordionPolicy from '../enrollment/NewDesignComponents/subComponent/AccordionPolicy';
import { ContextAwareToggle } from '../enrollment/enrollment.help';
import { useSelector } from 'react-redux';

export function Summary({ policyName, summaryTitle, summary, setInstallment }) {

  const { globalTheme } = useSelector(state => state.theme)
  return (
    <Accordion defaultActiveKey={/* packageIndex + */ 1} style={{
      boxShadow: '1px 1px 16px 0px #e7e7e7',
      borderRadius: '15px',
      width: '100%',
      marginBottom: '15px',
      maxWidth: '900px'
    }}>
      <Accordion.Toggle
        eventKey={/* packageIndex + */ 1} style={{
          width: '100%',
          border: 'none',
          borderTopLeftRadius: '20px',
          borderTopRightRadius: '20px',
          background: 'white',
          padding: '10px',

        }} className='d-flex justify-content-between align-items-center'>
        <div style={{
          fontWeight: '500',
          fontSize: globalTheme.fontSize ? `calc(19px + ${globalTheme.fontSize - 92}%)` : '19px',
          letterSpacing: '1px',
          color: 'black',
          textAlign: 'start'
        }}>
          {policyName.join(' & ')}</div>
        <ContextAwareToggle eventKey={/* packageIndex + */ 1} />
      </Accordion.Toggle>
      <Accordion.Collapse eventKey={/* packageIndex + */ 1} style={{
        width: '100%',
        // paddingTop: '50px',
        paddingTop: '5px',
        background: 'white',
        borderTop: '2px solid #FFDF00',
        borderBottomLeftRadius: '20px',
        borderBottomRightRadius: '20px'
      }}>
        <div className={`mx-0 d-flex flex-column ${classesone.card}`}>
          <div className="m-0 row justify-content-between">
            <div className="col-12">
              <div className={`${classes.autoscroll}`}>
                <div className="row justify-content-center">
                  {summaryTitle.length > 0 ? summaryTitle.map((title, i) => {
                    return (
                      <AccordionPolicy
                        setInstallment={setInstallment}
                        key={"summ" + i} id={i + 1} title={title} summary={summary} />
                    )
                  })
                    : <span style={{
                      fontWeight: '500',
                      fontSize: globalTheme.fontSize ? `calc(18px + ${globalTheme.fontSize - 92}%)` : '18px',
                      marginTop: '52px'

                    }}>'No Benefit Summary Found'</span>
                  }
                </div>
              </div>
            </div>
          </div>
        </div>
      </Accordion.Collapse>
    </Accordion>
  )
}
