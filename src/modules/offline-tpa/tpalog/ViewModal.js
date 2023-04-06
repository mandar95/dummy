import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

export function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const ModalComponent = ({ show, onHide, HtmlArray }) => {
  const [copy, setCopy] = useState(false);
  // json styling start

  if (isJson(HtmlArray)) {
    HtmlArray = JSON.stringify(JSON.parse(HtmlArray), undefined, 4);
  }
  // json styling end
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
          <span >View</span>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {typeof HtmlArray === "object" ? (
          HtmlArray.map((htmlString, index) => (<>
            <div
              key={index + "htmlString"}
              dangerouslySetInnerHTML={{ __html: htmlString }}
            />
            <textarea id="textasd" defaultValue={HtmlArray} style={{ display: "none" }}></textarea></>
          ))
        ) : (
          <div className="row">
            <div className="col-12 text-break">
              {HtmlArray.split('\n').map((htmlString, index) =>
                <div
                  className="text-justify"
                  key={index + "htmlString"}

                  dangerouslySetInnerHTML={{ __html: htmlString }}
                />
              )}

              <textarea id="textasd" defaultValue={HtmlArray} style={{ display: "none" }}></textarea>
            </div>
          </div>
        )}
      </Modal.Body>
      {!!navigator.clipboard &&
        <Modal.Footer>
          <button className={`btn btn-primary ${copy ? "disabled" : ""}`} onClick={copyText}>{copy ? "Copied" : "Copy"}</button>
        </Modal.Footer>
      }
    </Modal>
  );
  function copyText() {
    /* Get the text field */
    var copyText = document.getElementById("textasd");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /* For mobile devices */

    /* Copy the text inside the text field */
    navigator.clipboard.writeText(copyText.value);

    /* Alert the copied text */
    // alert("Copied the text: " + copyText.value);
    if (copyText.value.length) {
      setCopy(true)
    } else {
      setCopy(false);
    }
  }
};

export default ModalComponent;
