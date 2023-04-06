import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";

const DisplayHTML = ({ htmlString }) => {

}

function isJson(str) {
  try {
    JSON.parse(str);
  } catch (e) {
    return false;
  }
  return true;
}

const JsonPareseNested = (payload) => {
  let result = {};
  if (typeof payload === "object") {
    for (const key in payload) {
      result[key] = JsonPareseNested(payload[key])
    }
  }
  if (isJson(payload)) {
    return JSON.parse(payload)
  }
  return result
}

const ModalComponent = ({ show, onHide, HtmlArray }) => {
  const [copy, setCopy] = useState(false);
  // json styling start

  HtmlArray = JsonPareseNested(JSON.parse(HtmlArray))
  HtmlArray = JSON.stringify(HtmlArray, null, "\t"); // stringify with tabs inserted at each level
  // HtmlArray = JSON.stringify(jsObj, null, 4);
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
        {(
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
