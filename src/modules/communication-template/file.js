import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
    FlexContainer,
    AttachFileDiv,
    // AttachDesc,
    AttachDoc,
    Wrapper,
    // Img
} from './fileStyle';
import swal from 'sweetalert';
import validation from 'config/validations/common.js'
import { useSelector } from 'react-redux';

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
        msgDiv,
        fa_classname,
        attachFile,
        imageFile,
        multiple,
        API,
        ...otherProps
    } = props;

    const [fileName, setFileName] = useState('No File Chosen');
    const { globalTheme } = useSelector(state => state.theme);

    const [_fileName, _setFileName] = useState([])
    const returnFile = (e) => {
        if (accept ? accept.split(',').some((fileType) => (e.target?.files[0]?.name || '').toLowerCase().endsWith(fileType.trim())) :
            validation.fileType.some((fileType) => (e.target?.files[0]?.name || '').toLowerCase().endsWith(fileType))
        ) {
            let _fileData = Array.from(e?.target?.files)

            if (_fileData?.length > 0) {
                let _data = _fileData.reduce((str, item) => str ? `${str}" , "${item.name}` : `${item.name}`, '')
                setFileName(_data)
            }
            else {
                setFileName(e.target?.files[0]?.name)
            }

            onUpload && onUpload(e.target.files, e.target.name)
            if (reset) {
                e.target.value = null;
            }
        }
        else {
            swal('File Extension Not Supported', '', 'warning')
            e.target.value = null;
        }
    }

    useEffect(() => {
        if (!!attachFile?.attachFile?.length && multiple) {
            _setFileName(attachFile?.attachFile)
        }
        if (typeof (imageFile) !== "undefined" && !multiple) {
            setFileName(imageFile)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [attachFile, imageFile])

    useEffect(() => {
        if (resetValue) {
            setFileName('No File Chosen');
        }
    }, [resetValue])

    const removeData = (id) => {
        API({ templateId: attachFile?.tempId, attachmentId: id }).then(() => {
            let _data = _fileName.filter((item) => item.id !== id)
            _setFileName(_data)
        })
    }

    return (
        <Wrapper className={`file-container ${error ? 'error' : ''}`} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center'
        }}>
            <FlexContainer>
                <AttachFileDiv>
                    {/* <i className="ti-clip attach-i"></i> */}
                    <i className={`fa ${fa_classname}`}></i>
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
                        multiple={multiple}
                        {...otherProps}
                    />
                </AttachFileDiv>
                {/* <AttachDesc><span className="attach-p">{title}{required
          ? <sup> <Img alt="important" src='/assets/images/inputs/important.png' /> </sup>
          : null}</span> className="attach-b">  {description}</b></AttachDesc> */}
            </FlexContainer>
            {msgDiv &&
                <div className='d-flex'>
                    <span style={{
                        fontSize: globalTheme.fontSize ? `calc(11px + ${globalTheme.fontSize - 92}%)` : '11px',
                        marginTop: '1px',
                        color: '#757575',
                        letterSpacing: '1px'
                    }}>{msgDiv.text}</span>
                </div>
            }
            {
                nameBox && (
                    <AttachDoc>
                        {fileDataUI && fileName === "No File Chosen" ?
                            <>
                                <span>  Attached File -  </span>{fileDataUI()}
                            </>
                            :
                            <>
                                {!_fileName?.length && <span>  {defaultFileName || fileName} </span>}
                                {(!!_fileName?.length && API) && <div style={{
                                    // display: 'flex', flexDirection: 'column'
                                }}>{_fileName.map((item) =>
                                    // <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                    <>
                                        <span style={{
                                            backgroundColor: '#e7e7e7',
                                            padding: '5px',
                                            fontSize: '8px',
                                            borderRadius: '11px',
                                            margin: '5px',
                                            fontWeight: 'bold'
                                        }}>{item.file_name}
                                            <span
                                                onClick={() => removeData(item.id)}
                                                style={{
                                                    marginLeft: '6px'
                                                }}><i className='fa fa-close' style={{ color: 'red' }}></i></span>
                                        </span>
                                    </>
                                )}</div>}
                            </>
                        }
                    </AttachDoc>)
            }
        </Wrapper >
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
    description: ("File Formats: jpeg, png, pdf - Max File Size: 2MB"),
    name: "myfile",
    msgDiv: null,
    fa_classname: 'fa-image',
    attachFile: [],
    multiple: false,
    APIPayload: null
}

export default AttachFile2;
