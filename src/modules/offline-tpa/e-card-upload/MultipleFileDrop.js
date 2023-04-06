import React, { useRef, useEffect } from "react";
import { Col } from 'react-bootstrap';

import classes from "../offline-tpa.module.css";

import { Chip } from 'components'
import { FileDrop } from "react-file-drop";
import { Title, Card as AnotherCard } from "modules/RFQ/select-plan/style.js";
import swal from "sweetalert";
import validation from 'config/validations/common.js'

const _iconeData = {
    exc: { src: "/assets/images/excel_logo2.png" },
    image: { src: "/assets/images/imgupload.jpg" },
    pdf: { src: "/assets/images/pdf.jpg" },
    doc: { src: "/assets/images/Google-Docs-logo.png" },

}

const _checkFileData = (files, uploadLimit, setFile, file) => {
    let temp_files = []
    for (var i = 0; i < files.length; i++) {
        //if (files[i]?.name.endsWith(".xlsx") || files[i]?.name.endsWith(".xls")) {
        if ((file?.length + i + 1) <= uploadLimit) {
            temp_files.push(files[i])
        }
        else {
            swal(`You are only allowed to upload a maximum of ${uploadLimit} files at a time`, "", "info")
        }
        // }
    }
    setFile(prev => [...prev, ...temp_files]);
}

const DataUpload = ({ file, setFile, accept, uploadType, uploadLimit, resetFile, dontShowFile }) => {

    const fileInputRef = useRef(null);

    const onTargetClick = () => {
        fileInputRef.current.click();
    };

    useEffect(() => {
        if (resetFile) {
            setFile([])
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [resetFile])

    const onFileInputChange = (event) => {

        const { files } = event.target;

        if (Object.entries(files).every(([key, { name }]) => (
            accept ? accept.split(',').some((fileType) => (name || '').toLowerCase().endsWith(fileType.trim())) :
                validation.fileType.some((fileType) => (name || '').toLowerCase().endsWith(fileType))
        ))) {
            _checkFileData(files, uploadLimit, setFile, file)
        }
        else {
            swal('File Extension Not Supported', '', 'warning')
        }
    };

    const removeFile = name => {
        const filteredObj = file.filter(item => item.name !== name);
        setFile([...filteredObj]);
    }

    return (
        <Col className="p-0" xl={12} lg={12} md={12} sm={12}>
            <FileDrop
                onDrop={(files, event) => {
                    _checkFileData(files, uploadLimit, setFile, file)
                }}
            >
                <AnotherCard
                    className="mt-3 p-4 text-center"
                    noShadow
                    borderRadius="10px"
                    style={{
                        backgroundImage: `url("data:image/svg+xml,%3csvg width='100%25' height='100%25' xmlns='http://www.w3.org/2000/svg'%3e%3crect width='100%25' height='100%25' fill='none' rx='10' ry='10' stroke='%2386B4EEFF' stroke-width='3' stroke-dasharray='12' stroke-dashoffset='6' stroke-linecap='square'/%3e%3c/svg%3e")`,
                        wordBreak: "break-word",
                    }}
                // bgColor={(file === false) ? "#ffc8c0" : "#F6F9FF"}
                >
                    {(!!file.length && !dontShowFile) ? (
                        <>
                            {uploadType?.map((item, index) =>
                                <img
                                    key={index + 'uploadType'}
                                    className="mx-auto"
                                    width="50"
                                    height="50"
                                    src={_iconeData[item]?.src}
                                    alt="Your File"
                                />

                            )}
                            <br />

                            {file.map(({ name }, index) =>
                                <Chip
                                    key={index + name}
                                    id={name}
                                    name={`${index + 1}. ${name}`}
                                    onDelete={removeFile} />)}
                            <Title
                                fontWeight="500"
                                color="#555555"
                                className="d-block"
                                fontSize="1rem"
                            >
                                <span className={classes.browse} onClick={onTargetClick}>
                                    Browse More
                                </span>
                            </Title>
                        </>
                    ) : (
                        <>
                            <img
                                className="mx-auto"
                                width="60px"
                                src="/assets/images/RFQ/Group 6577@2x.png"
                                alt="Drop File Here"
                            />
                            <Title
                                fontWeight="500"
                                color="#555555"
                                className="d-block"
                                fontSize="0.8rem"
                            >
                                Drop your files here.
                            </Title>
                            <Title
                                fontWeight="500"
                                color="#555555"
                                className="d-block"
                                fontSize="1rem"
                            >
                                or{" "}
                                <span className={classes.browse} onClick={onTargetClick}>
                                    Browse
                                </span>
                            </Title>
                        </>
                    )}
                    <input
                        multiple
                        onChange={onFileInputChange}
                        ref={fileInputRef}
                        onClick={(event) => {
                            event.target.value = null
                        }}
                        type="file"
                        accept={accept}

                        className="hidden"
                        style={{ display: "none" }}
                    />
                </AnotherCard>
            </FileDrop>
            {(file === false) && (
                <Title
                    className="d-block"
                    fontWeight="500"
                    color="#ff1717"
                    fontSize="1.1rem"
                >
                    File Required
                </Title>
            )}
        </Col>
    )
}

DataUpload.defaultProps = {
    uploadLimit: 50,
    dontShowFile: false
}

export default DataUpload;
