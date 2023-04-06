import React, { useState, useEffect, useReducer } from 'react';
import styled from 'styled-components';
import swal from 'sweetalert';
import { initialState, reducer, getAllTrigger, createEmailTemplate, updateEmailTemplate, clear, templateImageUpload } from './template.action';

import { Row, Col, Form } from 'react-bootstrap';
import { Input, Button, Select, CardBlue, Loader, Error } from 'components';
import TemplateCard from 'modules/communication-config/create-template/Card/TemplateCard';
import { Tags, Div, Header2 } from 'modules/communication-config/create-template/Tags/index';
import { Controller, useForm } from "react-hook-form";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useSelector } from 'react-redux';
import { HTMLInput } from './inputBox'

import { getTemplateCSS, _resetPasswordStyle } from './helper';
import _ from 'lodash';
import { ModuleControl } from "../../../src/config/module-control";
import { SelectComponent } from '../../components';
// import { Switch } from 'modules/user-management/AssignRole/switch/switch';
import { AttachFile2 } from './file';

// - Template BG-White
const isHowden = ModuleControl.isHowden;

const dynamicTable = [13, 22, 23, 26, 10, 11, 6, 15, 16, 27, 28]

export const CreateTemplate = ({ emailData, setTab }) => {

    const { currentUser } = useSelector(state => state.login);

    const [{ brokerData, allTrigger, loading, success }, dispatch] = useReducer(reducer, initialState);
    const [header, setHeader] = useState([])
    const [content, setContent] = useState([])
    const [footer, setFooter] = useState([])

    const [dynamic_data, setDynamicData] = useState([])

    const [openDiv, setOpenDiv] = useState(false)
    const [msg, setMsg] = useState(null);
    const [msg2, setMsg2] = useState(null);

    const [msgWidth, setMsgWidth] = useState(null);
    const [msgHeight, setMsgHeight] = useState(null);


    const [mappingType, setMappingType] = useState(null)
    const [subEvent, setSubEvent] = useState([])

    const [imgUploadData, setImgUploadData] = useState(null)
    const [imgURLData, setImgURLData] = useState([])
    const [imgLoader, setImgLoader] = useState(false)

    const { globalTheme } = useSelector(state => state.theme)

    const { control, handleSubmit, watch, setValue, register } = useForm({
        mode: "onChange",
        reValidateMode: "onChange"
    });

    let _eventId = watch('event_id')?.value || '';
    // let _typeid = watch('typeid')


    let _cols = watch('cols')
    let _rows = watch('rows')
    let _type = watch('type')

    let _colspanindex = watch('colspanindex')
    let _colspan = watch('colspan')

    // let _datarowindex = watch('datarowindex')
    // let _datacolumnindex = watch('datacolumnindex')
    // let _rowspan = watch('rowspan')


    // let [_width, setWidth] = useState(0)
    // let [_height, setHeight] = useState(0)

    let _width = watch('_width')
    let _height = watch('_height')


    useEffect(() => {
        if (success) {
            swal(success, "", "success").then(() => {
                setTab()
            })
        }
        return () => {
            clear(dispatch)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [success])

    useEffect(() => {
        if (!_.isEmpty(emailData) && allTrigger.length) {
            //setTab('Template')
            setValue('event_id', allTrigger?.map((item) => ({
                id: item?.id,
                label: item?.trigger_name,
                value: item?.id,
            })).find(elem => elem.id === emailData.system_trigger_id))
            setValue('template_name', emailData.name)
            setValue('subject', emailData.subject)
            setTimeout(() => {
                let _data = document.getElementById(`input-Q-${1}-content`)
                if (_data) _data.innerHTML = emailData?.content
            }, 100)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [emailData, allTrigger])

    useEffect(() => {
        getAllTrigger(dispatch)
    }, [])


    useEffect(() => {
        if (!_.isEmpty(allTrigger) && _eventId) {
            let _data = allTrigger.filter((item) => item.id === Number(_eventId))
            setDynamicData(_data?.[0]?.dynamic_values || [])
            if (Number(_eventId) === 13) {
                setSubEvent(_data?.[0]?.sub_system_triggers)
                emailData?.sub_system_trigger_id && setValue('sub_event_id', emailData?.sub_system_trigger_id)

            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [allTrigger, _eventId])

    useEffect(() => {
        if (_eventId) {
            let ID = Number(_eventId)
            setHeader(getTemplateCSS(ID)?.header)
            setContent(getTemplateCSS(ID)?.content)
            setFooter(getTemplateCSS(ID)?.footer)


            let _data = allTrigger.filter((item) => item.id === Number(_eventId))
            setDynamicData(_data?.[0]?.dynamic_values || [])

            if (ID === 13) {
                setSubEvent(_data?.[0]?.sub_system_triggers)
            }

            setTimeout(() => {
                if (_.isEmpty(emailData)) {
                    let _element = document.getElementById(`input-Q-${1}-content`)
                    _element.innerHTML = ""
                }

                if (_data?.[0]?.is_employer_wise_template_allowed && _data?.[0]?.is_policy_wise_template_allowed) {
                    setMappingType(3)
                    return false
                }
                if (_data?.[0]?.is_employer_wise_template_allowed) {
                    setMappingType(1)
                    return false
                }
                if (_data?.[0]?.is_policy_wise_template_allowed) {
                    setMappingType(2)
                    return false
                }
                if (!_data?.[0]?.is_employer_wise_template_allowed && !_data?.[0]?.is_policy_wise_template_allowed) {
                    setMappingType(4)
                    return false
                }
            }, 0)

        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [_eventId, allTrigger])

    const onDragEnd = (result) => {
        const { destination, source } = result;
        let inputId = (destination?.droppableId.split('-'))
        if (inputId?.[3] === 'content') {
            if (inputId[1] === 'Q') {
                let _editableDiv = document.getElementById(destination.droppableId)
                if (Number(source?.index) === 200) {
                    if (Number(_cols) > 10) {
                        return false
                    }
                    setValue('cols', '');
                    setOpenDiv(false)
                    setMsg(null)
                    setMsg2(null)

                    if (document.activeElement.id === "destination.droppableId") {
                        //alert("Focused!");
                    } else {
                        _editableDiv.focus()
                    }
                    setTimeout(() => {
                        let sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            range = sel.getRangeAt(0);
                            range.deleteContents();
                            let newNode = document.createElement("div");
                            // newNode.style.overflowX = 'auto';
                            let typeid = document.getElementById(_type)
                            if (typeid === null) {
                                newNode.innerHTML = `${HTMLTabe(_eventId)}`
                                range.insertNode(newNode);
                            } else {
                                return false
                            }

                        }
                    }, 0)

                }
                else if (Number(source?.index) === 555) { //image upload
                    var range;
                    // let sel = window.getSelection();
                    if (document.activeElement.id === "destination.droppableId") {
                        //alert("Focused!");
                    } else {
                        _editableDiv.focus()
                    }
                    setTimeout(() => {
                        let sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            let _index = result.draggableId.split("-")[1]
                            range = sel.getRangeAt(0);
                            range.deleteContents();
                            let newNode = document.createElement("img");
                            newNode.style.width = `${Number(_width) ? Number(_width) : 150}px`
                            newNode.style.height = `${Number(_height) ? Number(_height) : 150}px`
                            // newNode.setAttribute('class', 'img-attchement');
                            newNode.setAttribute('src', imgURLData[Number(_index)].url);
                            range.insertNode(newNode);
                        }
                    }, 0)

                }
                else if ((dynamic_data[source?.index].value === "attachments")) {
                    // var range;
                    // let sel = window.getSelection();
                    if (document.activeElement.id === "destination.droppableId") {
                        //alert("Focused!");
                    } else {
                        _editableDiv.focus()
                    }
                    setTimeout(() => {
                        let sel = window.getSelection();
                        if (sel.getRangeAt && sel.rangeCount) {
                            range = sel.getRangeAt(0);
                            range.deleteContents();
                            let newNode = document.createElement("div");
                            newNode.setAttribute('data-tag', dynamic_data[source?.index].value);
                            newNode.innerHTML = `${dynamic_data[source?.index].name}`
                            range.insertNode(newNode);
                        }
                    }, 0)
                }
                else {
                    let range;
                    let sel = window.getSelection();
                    if (document.activeElement.id === "destination.droppableId") {
                        //alert("Focused!");
                    } else {
                        _editableDiv.focus()
                    }

                    // if (destination.droppableId === fd){
                    setTimeout(() => {
                        if (sel.getRangeAt && sel.rangeCount) {
                            range = sel.getRangeAt(0);
                            range.deleteContents();

                        }
                        if (['<a>'].includes(dynamic_data[source?.index].html_tag_name)) {
                            let newNode = document.createElement("a");
                            newNode.setAttribute('id', dynamic_data[source?.index].value);
                            newNode.setAttribute('contenteditable', 'false');
                            if (dynamic_data[source?.index].value === "reset_password_link") {

                                // newNode.setAttribute('contenteditable', 'false');
                                _resetPasswordStyle.map((item) => newNode.style[item.name] = item.value)
                                let d = document.createElement("span");
                                d.innerHTML = `&nbsp;`
                                range.insertNode(d);

                                newNode.innerHTML = `${dynamic_data[source?.index].name}`
                                range.insertNode(newNode);

                                let c = document.createElement("span");
                                c.innerHTML = `&nbsp;`
                                range.insertNode(c);
                            }
                            else {
                                newNode.innerHTML = `${dynamic_data[source?.index].name}`
                                range.insertNode(newNode);
                            }
                        }
                        else {
                            range.insertNode(document.createTextNode(`{!!${dynamic_data[source?.index].value}!!}`));
                        }
                    }, 0)
                }
            }
        }
    }

    const setData = (i, id, table, isAdding) => {
        if (table === 'header') {
            if (isAdding) { onAdd(header, setHeader, id, i) }
            else { onRemove(header, setHeader, id, i) }
        }
        if (table === 'content') {
            if (isAdding) { onAdd(content, setContent, id, i) }
            else { onRemove(content, setContent, id, i) }
        }
        if (table === 'footer') {
            if (isAdding) { onAdd(footer, setFooter, id, i) }
            else { onRemove(footer, setFooter, id, i) }
        }
    }
    const deleteHtml = (i) => {
        let _content = content.filter((item, index) => index !== i)
        setContent(_content)
    }

    const example = () => (
        <TemplateCard border>
            {![25, 27, 28].includes(Number(_eventId)) &&
                <Droppable droppableId="header" type='box'>
                    {(provided, snapshot) => (
                        <Header2 bgColor={isHowden ? '#fff' : '#d6d6d6'}
                            drag={snapshot.isDraggingOver ? 'true' : ''} height='100px' {...provided.droppableProps} ref={provided.innerRef}>
                            <img src={brokerData?.broker_logo_url} style={{
                                height: 'auto',
                                width: '100%',
                                maxWidth: '137px'
                            }} height="40" width="150" alt="header" />
                        </Header2>
                    )}
                </Droppable>
            }
            <Droppable droppableId="content" type='box'>
                {(provided, snapshot) => (
                    <Header2 style={{ padding: '15px 0px' }} bgColor='#fff'
                        drag={snapshot.isDraggingOver ? 'true' : ''} height='200px' {...provided.droppableProps} ref={provided.innerRef}>
                        {true ?
                            <>
                                {!!content?.length ? content.map(({ id, value, style, isAdd, isRemove, placeholder }, index) => (<Draggable key={`content-${index}`} draggableId={`content-${index}`} index={index}>
                                    {newprov => (
                                        <Div ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >
                                            {HTMLInput(index, id, value, 'content', control, register, style, {
                                                isAdd, isRemove, setData, deleteHtml
                                            }, placeholder, Number(_eventId), emailData)}
                                        </Div>)}

                                </Draggable>)) : '<> Content </>'}</> :
                            ""
                        }
                    </Header2>
                )}
            </Droppable>
            {![25, 27, 28].includes(Number(_eventId)) &&
                <Droppable droppableId="footer" type='box'>
                    {(provided, snapshot) => (
                        <Header2 style={{ padding: '15px 0px' }} bgColor={isHowden ? '#fff' : '#d6d6d6'} drag={snapshot.isDraggingOver ? 'true' : ''} height='100px' {...provided.droppableProps} ref={provided.innerRef}>
                            <img src={brokerData?.broker_logo_url} style={{
                                height: 'auto',
                                width: '100%',
                                maxWidth: '137px'
                            }} height="40" width="150" alt="footer" />
                            <span style={{
                                color: '#5c5c5c',
                                fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px',
                                marginTop: '10px',
                                letterSpacing: '1px'
                            }}>
                                {brokerData?.broker_address}
                            </span>
                            <div style={{
                                borderTop: '1px solid #454242',
                                width: '90%',
                                margin: '13px auto'
                            }}></div>
                            <div>
                                <p style={{
                                    color: '#5c5c5c',
                                    fontSize: globalTheme.fontSize ? `calc(10px + ${globalTheme.fontSize - 92}%)` : '10px',
                                    marginTop: '10px',
                                    letterSpacing: '1px'
                                }}>
                                    {brokerData?.broker_footmark}
                                </p>
                            </div>

                        </Header2>
                    )}
                </Droppable>
            }
        </TemplateCard >
    )

    const DynamicBox = () => (
        <Droppable droppableId="dynamic">
            {provided => (<div {...provided.droppableProps} ref={provided.innerRef}>
                <TemplateCard label='Dynamic Values' variant='#fbfceb'>
                    <div className='d-flex flex-wrap m-3'>
                        {dynamic_data.map(({ id, name }, index) => (
                            <Draggable key={index + 'dynamic-data'} draggableId={`dynamic-${id}`} index={index}>
                                {newprov => (
                                    <Tags ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >{name}</Tags>
                                )}
                            </Draggable>
                        ))}
                    </div>
                    {provided.placeholder}
                </TemplateCard>
            </div>)}
        </Droppable>
    )
    const TableDiv = (eventId) => (
        <Droppable droppableId="table">
            {provided => (<div {...provided.droppableProps} ref={provided.innerRef}>
                <TemplateCard style={{ background: 'white' }} lablestyle={{
                    borderRadius: '4px',
                    background: '#7b7b7b',
                    border: '1px solid #aaaaaa',
                    color: '#ffffff',
                    letterSpacing: '1px',
                    margin: '-27px 0px 0px -7px'
                }}
                    //  label='HTML'
                    label={dynamicTable.includes(Number(eventId)) ? 'HTML' : 'HTML (Static)'}
                    variant='#fbfceb'>
                    <div className='d-flex flex-wrap m-3'>
                        {[{ id: 200 }].map(({ id }, index) => (
                            <Draggable key={index + 'tableDiv'} draggableId={`table-${id}`} index={id}>
                                {newprov => (
                                    <Div ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >
                                        {HTMLContent()}
                                    </Div>
                                )}
                            </Draggable>
                        ))}
                    </div>
                    {provided.placeholder}
                </TemplateCard>
            </div>)}

        </Droppable>
    )
    const HTMLContent = () => {
        return (
            <>
                <div onClick={() => {
                    setOpenDiv(!openDiv)
                    setMsg(null)
                    setMsg2(null)
                }}><i className="fa fa-solid fa-table"
                    style={{
                        background: '#b1b1b1',
                        padding: '10px',
                        fontSize: globalTheme.fontSize ? `calc(33px + ${globalTheme.fontSize - 92}%)` : '33px',
                        borderRadius: '3px'
                    }}
                ></i></div>
            </>
        )
    }
    const HTMLTabe = (_eventId) => {
        let tableObj;
        let _data = allTrigger.find((item) => item.id === Number(_eventId))
        tableObj = _data.dynamic_tables.find((item) => item.value === _type)
        let _table = dynamicTable.includes(Number(_eventId)) ? ['<table id=' + _type + ' class="fl-table" border="3" style="border: solid 1px #e6e6e6;width: 100%;margin-bottom: 1rem;color: #212529">',
            '<thead>',
            '<tr style="background: #3e4dcc;color: #FFFFFF">',
            '</tr>',
            '</thead>',
            '<tbody>',
            '<tr>',
            '</tr>',
            '</tbody>',
            '</table>'
        ] : ['<table id="" class="fl-table" border="3" style="border: solid 1px #e6e6e6;width: 100%;margin-bottom: 1rem;color: #212529">',
            '<thead>',
            '<tr style="background: #3e4dcc;color: #FFFFFF">',
            '</tr>',
            '</thead>',
            '<tbody>',
            '</tbody>',
            '</table>'
        ]
        let _th = "";
        if (dynamicTable.includes(Number(_eventId))) {
            _th = "";
            if (tableObj?.headers?.length > 0) {
                _th += "<th contenteditable='true' style='padding: 5px 5px;text-align: center'><select data-tag=" + tableObj?.headers[0].value + " style='width:100%'>"
                for (let i = 0; i < tableObj?.headers?.length; i++) {
                    _th += "<option value=" + tableObj?.headers[i].value + ">" + tableObj?.headers[i].name + "</option>"
                }

                _th += "</select></th>"
            } else {
                _th = "<th contenteditable='true' style='padding: 0px 0px 0px 10px'}>Enter Text</th>";
            }
            for (let i = 0; i < Number(_cols); i++) {
                _table.splice(3, 0, _th)
                _table.splice(_table.length - 3, 0, "<td contenteditable='false' style='user-select: none;padding: 0px 0px 0px 10px;color:transparent'>Enter Text</td>")
            }
        }
        if (!dynamicTable.includes(Number(_eventId))) {
            //  _th = "<th contenteditable='true' style='padding: 0px 0px 0px 10px'>Enter Text</th>";
            if (_colspanindex && _colspan) {
                for (let i = 0; i < Number(_cols); i++) {
                    if (Number(_colspanindex - 1) === i) {
                        _th = "<th contenteditable='true' colspan=" + Number(_colspan) + " style='padding: 0px 0px 0px 10px'>Enter Text</th>";
                    } else {
                        _th = "<th contenteditable='true' style='padding: 0px 0px 0px 10px'>Enter Text</th>";
                    }
                    _table.splice(3 + i, 0, _th)
                }
                let tr = "";
                for (let i = 0; i < Number(_rows); i++) {
                    tr += "<tr>"
                    for (let i = 0; i < (Number(_cols) + Number(_colspan) - 1); i++) {
                        tr += "<td contenteditable='true' style='padding: 0px 0px 0px 10px'>Enter Text</th>"
                    }
                    tr += "</tr>"
                }
                _table.splice(_table.length - 2, 0, tr)
            } else {
                for (let i = 0; i < Number(_cols); i++) {
                    _th = "<th contenteditable='true' style='padding: 0px 0px 0px 10px'>Enter Text</th>";
                    _table.splice(3, 0, _th)
                }
                let tr = "";
                for (let i = 0; i < Number(_rows); i++) {
                    tr += "<tr>"
                    for (let i = 0; i < Number(_cols); i++) {
                        tr += "<td contenteditable='true' style='padding: 0px 0px 0px 10px'>Enter Text</th>"
                    }
                    tr += "</tr>"
                }
                _table.splice(_table.length - 2, 0, tr)
            }
        }

        return _table.join("")
    }
    const handleChange = (e) => {
        //setTemplate_name(e.target.value)
        let valu = e.target.value;
        if (!Number(valu)) {
            e.target.value = ""
        } else {
            if (Number(valu) <= 10 && Number(valu) > 0) {
                setMsg(null)
            } else {
                setMsg('max limit is 10')
            }
        }
    }
    const handleChange2 = (e) => {
        //setTemplate_name(e.target.value)
        let valu = e.target.value;
        if (!Number(valu)) {
            e.target.value = ""
        } else {
            if (Number(valu) <= 10 && Number(valu) > 0) {
                setMsg2(null)
            } else {
                setMsg2('max limit is 10')
            }
        }
    }
    const PropertyBox = (_eventId) => {
        return (
            <TemplateCard style={{ background: 'white' }} lablestyle={{
                borderRadius: '4px',
                background: '#7b7b7b',
                border: '1px solid #aaaaaa',
                color: '#ffffff',
                letterSpacing: '1px',
                margin: '-27px 0px 0px -7px'
            }} label='Properties' variant='#fbfceb'>
                <div className='d-flex flex-wrap m-3' style={{
                    padding: '0px 15px'

                }}>
                    <form style={{ width: '100%' }}>
                        <Row className='justify-content-between' style={{
                            marginBottom: '10px', paddingBottom: '11px',
                            borderBottom: '1px solid #8a8a8a'
                        }}>
                            <LabelDiv>Enter Cols</LabelDiv>
                            <div> <input
                                style={{ padding: '7px' }}
                                ref={register}
                                name="cols"
                                onKeyUp={handleChange}
                            />
                                {!!msg && <Error style={{ marginTop: '2px' }}>{msg}</Error>}
                            </div>
                        </Row>
                        {!dynamicTable.includes(Number(_eventId)) &&
                            <>
                                <Row className='justify-content-between' style={{
                                    marginBottom: '10px',
                                    paddingBottom: '11px',
                                    borderBottom: '1px solid #8a8a8a'
                                }}>
                                    <LabelDiv>Enter Rows</LabelDiv>
                                    <div> <input
                                        style={{ padding: '7px' }}
                                        ref={register}
                                        name="rows"
                                        onKeyUp={handleChange2}
                                    />
                                        {!!msg2 && <Error style={{ marginTop: '2px' }}>{msg2}</Error>}
                                    </div>
                                </Row>


                            </>
                        }
                        {dynamicTable.includes(Number(_eventId)) &&
                            <Row className='justify-content-between'>
                                <LabelDiv>Select Table Type</LabelDiv>
                                <div style={{ width: '153px' }}>    <select name={`type`} ref={register} style={{ width: '100%' }}>
                                    {allTrigger.find((item) => item.id === Number(_eventId))?.dynamic_tables?.map((item) => <option key={item.value + '-dynamic_tables'} value={item.value}>{item.name}</option>)}
                                </select></div>
                            </Row>
                        }
                    </form>
                </div>
            </TemplateCard>

        )
    }

    // ............................image upload..................................

    const handleChangeWidth = (e) => {
        //setTemplate_name(e.target.value)
        let valu = e.target.value;
        if (!Number(valu)) {
            e.target.value = ""
        } else {
            if (Number(valu) <= 800 && Number(valu) > 0) {
                setMsgWidth(null)
            } else {
                setMsgWidth('max limit is 800')
            }
        }
    }
    const handleChangeHeight = (e) => {
        //setTemplate_name(e.target.value)
        let valu = e.target.value;
        if (!Number(valu)) {
            e.target.value = ""
        } else {
            if (Number(valu) <= 800 && Number(valu) > 0) {
                setMsgHeight(null)
            } else {
                setMsgHeight('max limit is 800')
            }
        }
    }
    const deleteIMG = (id) => {
        setImgURLData(imgURLData.filter((item) => item.id !== (id)))
    }
    const UploadImage = (e) => {
        if (imgUploadData !== null) {
            const formdata = new FormData();
            formdata.append(`attachment`, imgUploadData[0]);
            templateImageUpload(setImgLoader, setImgURLData, formdata)
            e.preventDefault()
        }
        else {
            swal("Alert", 'Please upload image', 'info');
            e.preventDefault()
        }

    }
    const ImgUploadDiv = () => {
        return (
            <>
                <TemplateCard style={{ background: 'white' }} lablestyle={{
                    borderRadius: '4px',
                    background: '#7b7b7b',
                    border: '1px solid #aaaaaa',
                    color: '#ffffff',
                    letterSpacing: '1px',
                    margin: '-27px 0px 0px -7px'
                }}
                    //  label='HTML'
                    label={'Image Upload'}
                    variant='#fbfceb'>
                    <div className='d-flex flex-wrap m-3' style={{
                        flexDirection: 'column'
                    }}
                    >
                        <AttachFile2
                            // multiple={true}
                            fa_classname="fa-image"
                            fileRegister={register}
                            title="Upload image"
                            key="file"
                            accept=".jpg, .png, .jpeg, .tiff"
                            description="File Formats: jpeg, png, jpg - Max File Size: 2MB"
                            nameBox
                            attachStyle={{ padding: "5px 5px", marginTop: "7px" }}
                            msgDiv={{
                                text: ''
                            }}
                            onUpload={(e) => {
                                setImgUploadData(e)
                            }}
                        />
                        {!!imgURLData.length &&
                            <>
                                <Droppable droppableId="dynamic">
                                    {provided => (<div {...provided.droppableProps} ref={provided.innerRef}>
                                        <div className='d-flex flex-wrap m-3'>
                                            {imgURLData.map((item, index) => (
                                                <Draggable key={index + 'img'} draggableId={`img-${index}`} index={555}>
                                                    {newprov => (
                                                        <Tags ref={newprov.innerRef} {...newprov.draggableProps} {...newprov.dragHandleProps} >{item.name}
                                                            <span style={{
                                                                color: 'red',
                                                                marginLeft: '10px'

                                                            }} onClick={() => {
                                                                deleteIMG(item.id)
                                                            }}><i className='fa fa-close'></i></span>
                                                        </Tags>
                                                    )}
                                                </Draggable>
                                            ))}
                                        </div>
                                        {provided.placeholder}
                                    </div>)}
                                </Droppable>
                            </>
                        }
                        <div style={HeightWidthParent}>
                            <div style={HeightWidthDiv}>
                                <label style={{ margin: '0px' }}>Width</label>
                                <input
                                    style={{ padding: '7px', marginLeft: '5px', marginRight: '5px' }}
                                    ref={register}
                                    name="_width"
                                    onChange={handleChangeWidth}
                                //error={errors && errors.cols}
                                />
                                {!!msgWidth && <Error style={{ marginTop: '2px' }}>{msgWidth}</Error>}</div>
                            <div style={HeightWidthDiv}>
                                <label style={{ margin: '0px' }}>Height</label>
                                <input
                                    style={{ padding: '7px', marginLeft: '5px' }}
                                    ref={register}
                                    name="_height"
                                    onChange={handleChangeHeight}
                                //error={errors && errors.cols}
                                />
                                {!!msgHeight && <Error style={{ marginTop: '2px' }}>{msgHeight}</Error>}
                            </div>
                        </div>
                        <Button style={{ marginTop: '5px' }} onClick={(e) => { UploadImage(e) }}>{!!imgLoader ? "Uploading..." : "Upload"}</Button>
                    </div>
                </TemplateCard>

            </>
        )
    }

    // ............................image upload..................................

    const onSubmit = (data) => {
        // alert(JSON.stringify(data))
        if (!data.event_id?.value) {
            swal('Validation', 'Please select Event', 'info')
            return null
        }
        let contentData = data.content.filter((item) => item.tag_id === 19)
        let _data;
        if (contentData.length) {
            _data = document.getElementById(`input-Q-${1}-content`)
        }
        const formdata = new FormData();
        data.content.forEach((data, index) => {
            if (data.tag_id === 19) {
                formdata.append(`content`, _data.innerHTML);
            }
            else {
                if (data.tag_id === 8) {
                    if (data.image[0]) {
                        formdata.append(`image`, data.image[0]);
                    }

                }
                if (data?.tag_id === 18 && data?.file[0]) {
                    Array.from(data?.file).forEach((item, i) => {
                        formdata.append(`attachments[${i}]`, item);
                    })
                }
            }
        });

        if (Number(data.event_id?.value) === 13) {
            formdata.append(`sub_system_trigger_id`, data.sub_event_id);
        }
        formdata.append(`template_name`, data.template_name);
        if (Number(data.event_id?.value) !== 25) {
            formdata.append(`subject`, data.subject);
        }
        formdata.append(`system_trigger_id`, data.event_id?.value);
        formdata.append(`status`, 1);
        formdata.append(`broker_id`, currentUser?.broker_id);

        if (_.isEmpty(emailData)) {
            createEmailTemplate(dispatch, formdata)
            // resetTemplateData()
        } else {
            formdata.append(`_method`, 'PATCH');
            updateEmailTemplate(dispatch, formdata, emailData.id)
        }
    }

    return (<>
        <CardBlue title='Create Template'>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <Row style={{ padding: '0px 15px' }}>
                    <Col sm="12" md="12" lg="4" xl="4">
                        <Controller
                            as={
                                <SelectComponent
                                    label="Events"
                                    placeholder="Select Events"
                                    required={false}
                                    isRequired={true}
                                    // options={_Events}
                                    options={allTrigger?.map((item) => ({
                                        id: item?.id,
                                        label: item?.trigger_name,
                                        value: item?.id,
                                    }))}
                                />
                            }
                            name="event_id"
                            control={control}
                        />
                        {_eventId &&
                            <div>
                                {mappingType === 3 && <MappingNote>Note : Map with&nbsp;<MappingSpan>Employer</MappingSpan>&nbsp;and&nbsp;<MappingSpan>Policy</MappingSpan>&nbsp;wise</MappingNote>}
                                {mappingType === 1 && <MappingNote>Note : Map with&nbsp;<MappingSpan>Employer</MappingSpan>&nbsp;wise</MappingNote>}
                                {mappingType === 2 && <MappingNote>Note : Map with&nbsp;<MappingSpan>Policy</MappingSpan>&nbsp;wise</MappingNote>}
                                {mappingType === 4 && <MappingNote>Note : No mapping requied</MappingNote>}
                                {Number(_eventId) === 25 && <MappingNote style={{ fontSize: globalTheme.fontSize ? `calc(11px + ${globalTheme.fontSize - 92}%)` : '11px' }}>* Changes of this event will be reflected on enrolment confirmation</MappingNote>}
                            </div>
                        }
                    </Col>
                    {Number(_eventId) === 13 &&
                        <Col sm="12" md="12" lg="4" xl="4">
                            <Controller
                                as={
                                    <Select
                                        label="Sub Events"
                                        placeholder="Select Sub Events"
                                        required={false}
                                        isRequired={true}
                                        // options={_Events}
                                        options={subEvent?.map((item) => ({
                                            id: item?.id,
                                            name: item?.name,
                                            value: item?.id,
                                        }))}
                                    />
                                }
                                name="sub_event_id"
                                control={control}
                                defaultValue={""}
                            />
                        </Col>
                    }
                    <Col sm="12" md="12" lg="4" xl="4">
                        <Controller
                            as={
                                <Input
                                    label="Template Name"
                                    placeholder="Enter Template Name"
                                    required={false}
                                    isRequired={true}
                                />
                            }
                            name="template_name"
                            control={control}
                            defaultValue={""}
                        />
                    </Col>
                    {Number(_eventId) !== 25 &&
                        <Col sm="12" md="12" lg="4" xl="4">
                            <Controller
                                as={
                                    <Input
                                        label="Subject"
                                        placeholder="Enter Subject"
                                        required={false}
                                        isRequired={true}
                                    />
                                }
                                name="subject"
                                control={control}
                                defaultValue={""}
                            />
                        </Col>
                    }
                </Row>
                <DragDropContext onDragEnd={onDragEnd}>
                    <Rows className="d-flex flex-wrap mt-5">
                        <Col md={12} lg={8} xl={8} sm={12}>
                            <Rows>
                                <Col md={12} lg={12} xl={12} sm={12}>
                                    {!!(Number(_eventId)) && example()}
                                </Col>
                                {_eventId &&
                                    <Col md={12} lg={12} xl={12} sm={12} className="d-flex justify-content-end mt-4">
                                        <Button type="submit">Submit</Button>
                                    </Col>
                                }
                            </Rows>
                        </Col>
                        {_eventId &&
                            <Col md={12} lg={4} xl={4} sm={12}>
                                {DynamicBox()}
                                {![25].includes(Number(_eventId)) && <>
                                    {TableDiv(_eventId)}
                                    {openDiv && PropertyBox(_eventId)}
                                </>}
                                {/* {[44].includes(Number(_eventId)) && <> */}
                                {ImgUploadDiv(Number(_eventId))}
                                {/* </>} */}
                            </Col>
                        }

                    </Rows>
                </DragDropContext>
            </Form>
        </CardBlue>
        {loading && <Loader />}
    </>)
}


const onAdd = (content, setContent, id, i) => {
    const data = content.map((item) => {
        if (item.id === id) {
            return { ...item, isAdd: false, isRemove: false }
        }
        else {
            return { ...item }
        }
    })
    let finalData = [...data, ...[{ id, style: content[i].style, isAdd: true, isRemove: true, placeholder: 'content' }]]
    setContent(finalData)
}

const onRemove = (content, setContent, id, i) => {
    let _data = content.filter((item, index) => index !== i)
    let _data2 = _data.filter((item) => item.id === id)
    if (_data2.length > 1) {
        let d = _data2.map((item, index) => {
            if (_data2.length === index + 1) {
                return { ...item, isAdd: true, isRemove: true }
            }
            else {
                return { ...item, isAdd: false, isRemove: false }
            }
        })
        let df = content.filter((item) => item.id !== id)
        const data = [...df, ...d]
        setContent(data)

    }
    else {
        let d = _data2.map((item) => {
            return {
                ...item,
                isAdd: true, isRemove: false
            }
        })
        let df = content.filter((item) => item.id !== id)
        const data = [...df, ...d]
        setContent(data)
    }
}

const Rows = styled(Row)`
margin: 0`

const LabelDiv = styled.div`
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
letter-spacing: 1px;


`
const MappingNote = styled.div`
background: #b4ffc9;
padding: 10px;
border-radius: 5px;
box-shadow: 1px 3px 6px 1px #e0e0e0;
letter-spacing: 1px;
font-family: sans-serif;
display: flex;
justify-content: center;
`

const MappingSpan = styled.span`
background: white;
    padding: 0px 5px;
    border-radius: 5px;
    
`

const HeightWidthParent = {
    display: 'flex',
    flexDirection: 'row',
    padding: '5px',
    justifyContent: 'center',
    alignItems: 'center'
}

const HeightWidthDiv = {
    justifyContent: 'center',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
}

