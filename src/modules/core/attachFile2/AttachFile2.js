import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  FlexContainer,
  AttachFileDiv,
  AttachDesc,
  AttachDoc,
  Wrapper,
  Img
} from './style.js';
import swal from 'sweetalert';
import validation from 'config/validations/common.js'

export const AttachFile2 = props => {
  const {
    onUpload,
    nameBox,
    title,
    fileRegister,
    description,
    name,
    error,
    accept,
    reset,
    required,
    defaultFileName,
    resetValue,
    fileDataUI,
    attachStyle,
    ...otherProps
  } = props;
  const [fileName, setFileName] = useState('No File Chosen');
  const returnFile = (e) => {
    if (accept ? accept.split(',').some((fileType) => (e.target?.files[0]?.name ||'').toLowerCase().endsWith(fileType.trim())) :
      validation.fileType.some((fileType) => (e.target?.files[0]?.name ||'').toLowerCase().endsWith(fileType))
    ) {
      setFileName(e.target?.files[0]?.name)
      onUpload && onUpload(e.target.files, e.target.name)
      if (reset) {
        e.target.value = null;
      }
    } else {
      swal('File Extension Not Supported', '', 'warning');
      e.target.value = null;
    }
  }

  useEffect(() => {
    if (resetValue) {
      setFileName('No File Chosen');
    }
  }, [resetValue])
  return (
    <Wrapper className={`file-container ${error ? 'error' : ''}`}>
      <FlexContainer>
        <AttachFileDiv>
          <i className="ti-clip attach-i"></i>
          <input
            type="file"
            onInput={returnFile}
            onClick={(event) => {
              event.target.value = null;
              setFileName('No File Chosen');
              onUpload && onUpload([], '')
            }}
            id={name}
            name={name}
            ref={fileRegister}
            accept={accept}
            required={required}
            style={{ opacity: -2.3 }}
            {...otherProps}
          />
        </AttachFileDiv>
        <AttachDesc><p className="attach-p">{title}{required
          ? <sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
          : null}</p><b className="attach-b">  {description}</b></AttachDesc>
      </FlexContainer>
      {nameBox && (
        <AttachDoc style={attachStyle}>
          {fileDataUI && fileName === "No File Chosen" ?
            <>
              <b>  Attached File -  </b>{fileDataUI()}
            </>
            :
            <>
              <b>  Attached File -  </b><span>  {defaultFileName || fileName} </span>
            </>
          }
          {/* <b>  Attached File -  </b><span>  {defaultFileName || fileName} </span> */}
        </AttachDoc>)}
    </Wrapper>
  )
}

// PropTypes
AttachFile2.propTypes = {
  onUpload: PropTypes.func,
  nameBox: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  name: PropTypes.string
}

// DefaultTypes
AttachFile2.defaultProps = {
  onUpload: () => { },
  nameBox: false,
  title: "Attach File",
  description: ("File Formats: jpeg, png, pdf"),
  name: "myfile"
}

export default AttachFile2;
