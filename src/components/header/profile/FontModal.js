/* eslint-disable eqeqeq */
import React, { useEffect, useState } from "react";

import { Modal } from "react-bootstrap";

import { useDispatch, useSelector } from "react-redux";
import { fontFamily, fontFamilySize } from "../../../modules/theme/theme.slice";
import FontFamilyCard from "../../../modules/theme/theme-table/FontFamilyCard";

export const allFont = [{ title: "Titillium Web", example: "ABCD", value: 1 },
{ title: "Roboto Condensed", example: "ABCD", value: 2 },
{ title: "Poppins", example: "ABCD", value: 3 },
{ title: "Open Sans", example: "ABCD", value: 4 },
{ title: "Lato", example: "ABCD", value: 5 },
{ title: "Montserrat", example: "ABCD", value: 6 },
{ title: "Caveat", example: "ABCD", value: 7 },
{ title: "Indie Flower", example: "ABCD", value: 8 },
{ title: "Permanent Marker", example: "ABCD", value: 9 },
{ title: "Satisfy", example: "ABCD", value: 10 },
{ title: "Russo One", example: "ABCD", value: 11 },
{ title: "Carter One", example: "ABCD", value: 12 },
]

export const allFontSize = [
  { title: "Small", example: "ABCD", value: 80 },
  { title: "Regular", example: "ABCD", value: 92 },
  { title: "Large", example: "ABCD", value: 109 },
  { title: "Extra Large", example: "ABCD", value: 122 },
]


const ModalFont = ({ show, onHide }) => {

  const { fontFamily: font, fontSize } = useSelector(state => state.theme);
  const [selectFont, setSelectFont] = useState(font);
  const [selectFontSize, setSelectFontSize] = useState(fontSize);
  const dispatch = useDispatch();

  useEffect(() => {
    localStorage.setItem("font-family", selectFont)
  }, [selectFont])

  useEffect(() => {
    localStorage.setItem("font-size", selectFontSize)
  }, [selectFontSize])



  const handleSelect = (value) => {
    setSelectFont(value)
    dispatch(fontFamily(value))
  }

  const handleSelectSize = (value) => {
    setSelectFontSize(value)
    dispatch(fontFamilySize(value))
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      aria-labelledby="contained-modal-title-vcenter"
      dialogClassName="my-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title id="contained-modal-title-vcenter">
          Select Your Font Style & Size
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="text-center">
        <div className='mb-3'>
          <div className='d-flex flex-wrap justify-content-between'>
            {allFont.map((f) => <FontFamilyCard handleSelect={handleSelect} selectFont={selectFont} key={f.value} data={f} />)}
          </div>
        </div>
        <hr />
        <div className='mb-3'>
          <div className='d-flex flex-wrap justify-content-between'>
            {allFontSize.map((f) => <FontFamilyCard handleSelect={handleSelectSize} size selectFont={selectFontSize} key={f.value} data={f} />)}
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default ModalFont;
