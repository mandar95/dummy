import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import { getTemplateView } from '../communication-config.slice';

const ModalComponent = ({ show, onHide, HtmlArray, templateType, tab, userTypeName }) => {
  const [state, setState] = useState("");
  useEffect(() => {
    getTemplateView({
      id: HtmlArray?.template_id,
      ...(tab === "Email" ? { is_email: true } : { is_sms: true }),
      type: HtmlArray?.template_type,
      user_type_name: userTypeName
    }, setState);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  // if (templateType === 2) {
  //   setTimeout(() => {
  //     let _data = document.getElementById(`d`)
  //     _data.innerHTML = HtmlArray
  //   }, 0);
  // }
  // const StringHtml = HtmlArray.reduce((concated, htmlString) => concated + htmlString + '<br/>', '');
  return (
    <Modal
      show={show}
      onHide={onHide}
      animation={true}
      size="lg"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          {/* <span >{typeof HtmlArray === "object" ? "Mail Sample View" : "SMS Sample View"}</span> */}
          <span >{tab === "Email" ? "Mail Sample View" : "SMS Sample View"}</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* {templateType === 1 ?
          <>
            {typeof HtmlArray === "object" ? HtmlArray.map((htmlString, index) =>
              <div key={index + 'htmlString'} dangerouslySetInnerHTML={{ __html: htmlString }} />) :
              HtmlArray.split('\n').map((htmlString, index) =>
                <div key={index + 'htmlString'} dangerouslySetInnerHTML={{ __html: htmlString }} />)
            }
          </>
          : <div id="d">

          </div>
        } */}
        <>
          {typeof state?.data?.template_value === "object" && templateType === 1 ? state?.data?.template_value?.map((htmlString, index) =>
            <div key={index + 'htmlString'} dangerouslySetInnerHTML={{ __html: htmlString }} />) :
            (tab === 'Sms' && templateType === 1) ? state?.data?.template_value.split('\n').map((htmlString, index) =>
              <div key={index + 'htmlString'} dangerouslySetInnerHTML={{ __html: htmlString }} />) :
              <iframe
                style={{ minHeight: "580px" }}
                className="w-100 h-100"
                srcDoc={state}
                title="description"
              ></iframe>
          }
        </>

      </Modal.Body>
    </Modal>
  );
};

export default ModalComponent;
