import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";

// import TemplateCard from 'modules/communication-config/create-template/Card/TemplateCard';
// import { Header2 } from 'modules/communication-config/create-template/Tags/index';
import styled from "styled-components";
import { getTemplateView } from './template.action';

// const IMGDiv = styled.img`
// text-decoration: none;
//     border: 0;
//     display: block;
//     border-radius: 100px;
//     // height: 260px;
//     // width: 460px;
//     height: 255px;
//     width: 485px;
//     margin: 10px 0px;
// `
const ModalHeader = styled(Modal.Header)`
& > .modal-title  > span {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(17px + ${fontSize - 92}%)` : '17px'};
}
& > .close  >span {
    font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(28px + ${fontSize - 92}%)` : '28px'};
}
`

const ModalComponent = ({ show, onHide, HtmlArray }) => {
    const [state, setState] = useState("");
    useEffect(() => {
        getTemplateView({ id: HtmlArray }, setState);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    // setTimeout(() => {
    //     let _data = document.getElementById(`d`)
    //     _data.innerHTML = HtmlArray
    // }, 0);
    //var doc = new DOMParser().parseFromString(HtmlArray?.content, "text/xml");
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
            <ModalHeader closeButton>
                <Modal.Title id="contained-modal-title-vcenter">
                    <span >Mail Sample View</span>
                </Modal.Title>
            </ModalHeader>
            <Modal.Body>
                <iframe
                    style={{ minHeight: "580px" }}
                    className="w-100 h-100"
                    srcDoc={state}
                    title="description"
                ></iframe>
            </Modal.Body>
        </Modal>
    );
};

export default ModalComponent;
