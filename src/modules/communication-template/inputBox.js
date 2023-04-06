import React, { useState } from 'react';
import { InputBox, Input2, Div, PreviewImg } from 'modules/communication-config/create-template/Tags/index';

import { Droppable } from 'react-beautiful-dnd';
import { Controller } from "react-hook-form";
import InputTextArea from './input';
import { AttachFile2 } from './file';
import styled from 'styled-components';
import { useSelector } from 'react-redux';
import service from './template.service'


// const setNormalText = () => {
//     var highlight = window.getSelection();
//     var span = '<span style="font-weight:bold">' + highlight + '</span>';
//     //var text = $('.textEditor').html();
//     let el = document.getElementById(`input-Q-${2}-content`)
//     let f = el.innerHTML
//     el.innerHTML = f.replace(highlight, span);
//     //el.focus();

//     // To update cursor position to recently added character in textBox
//     //el[0].setSelectionRange(10, 10);
// }

export const HTML = (id) => {
    switch (id) {
        case 1:
            return (<InputBox children={'<> H1 </>'} />);
        case 2:
            return (<InputBox children={'<> H2 </>'} />);
        case 3:
            return (<InputBox children={'<> H3 </>'} />);
        case 4:
            return (<InputBox children={'<> H4 </>'} />);
        case 5:
            return (<InputBox children={'<> H5 </>'} />);
        case 6:
            return (<InputBox children={'<> H6 </>'} />);
        case 7:
            return (<InputBox children={'<> P </>'} />);
        case 8:
            return (<InputBox children={'<> Img </>'} />);
        case 9:
            return (<InputBox children={'<> Anchor </>'} />);
        default: return (<></>);
    }
}

const setTableSelectValue = (e) => {

    if (e.target.nodeName === "SELECT") {
        e.target.dataset.tag = e.target.value
        for (let i = 0; i < e.target.childElementCount; i++) {
            if (i === Number(e.target.selectedIndex)) {
                e.target[i].setAttribute("selected", "selected")
            } else {
                e.target[i].removeAttribute("selected")
            }
        }
    }
}

const insertTextOnly = (e) => {
    e.preventDefault()
    var text = e.clipboardData.getData('text/plain')
    document.execCommand('insertText', false, text)
}

const buttonGroup = (chooseColor, changeSize, globalTheme) => {
    return (
        <>
            <Buttons className="fontStyle" onClick={() => document.execCommand('justifyLeft', false, null)} title='Left Align'><i className="fa fa-solid fa-align-left"></i>
            </Buttons>
            <Buttons className="fontStyle" onClick={() => document.execCommand('justifyCenter', false, null)} title='Center Align'><i className="fa fa-solid fa-align-center"></i>
            </Buttons>
            <Buttons className="fontStyle" onClick={() => document.execCommand('justifyRight', false, null)} title='Right Align'><i className="fa fa-solid fa-align-right"></i>
            </Buttons>
            <input style={{
                width: '40px',
                height: '30px',
                margin: '0px 8px',
                borderRadius: '2px',
                background: '#e7e7e7'
            }} className="color-apply" type="color" onChange={() => chooseColor()} id="myColor" />
            <select
                style={{
                    width: '40px',
                    height: '30px',
                    margin: '0px 0px',
                    borderRadius: '2px',
                    background: '#e7e7e7',
                    fontSize: globalTheme.fontSize ? `calc(14px + ${globalTheme.fontSize - 92}%)` : '14px',
                    border: '1px'
                }}
                id="fontSize" onClick={() => changeSize()}>
                <option value="1">1</option>
                <option value="2">2</option>
                <option value="3">3</option>
                <option value="4">4</option>
                <option value="5">5</option>
                <option value="6">6</option>
                <option value="7">7</option>
                <option value="8">8</option>
            </select>
        </>
    )
}


export const HTMLInput = (index, id, value, table, control, register, style, addRemoveObj, placeholder, eventID, emailData) => {

    const [showDiv, setShowDiv] = useState(false)
    const { globalTheme } = useSelector(state => state.theme)
    const chooseColor = () => {
        var mycolor = document.getElementById("myColor").value;
        document.execCommand('foreColor', false, mycolor);
    }

    const changeSize = () => {
        var mysize = document.getElementById("fontSize").value;
        document.execCommand('fontSize', false, mysize);
    }

    switch (id) {
        case 1:
            return (
                <>
                    <Droppable droppableId={`input-h1-${index}-${table}`} index={index}>
                        {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
                            <Controller
                                as={<InputTextArea as="textarea" rows={style?.row || '3'}
                                    drag={snapshot.isDraggingOver ? 'true' : ''}
                                    value={value}
                                    placeholder={placeholder || '<> H1 </>'}
                                    fontSize={'1.3em'}
                                    spellcheck="false"
                                    style={style?.css || {}}
                                />}
                                name={`${table}[${index}].value`}
                                control={control}
                            />
                        </Div>)}
                    </Droppable>
                    <Controller
                        as={
                            <input
                                type="hidden"
                                value={id}
                            />
                        }
                        defaultValue={id}
                        name={`${table}[${index}].tag_id`}
                        control={control}
                    />
                    {(addRemoveObj.isAdd || addRemoveObj.isRemove) &&
                        <AddRemoveDiv>
                            {addRemoveObj.isAdd && <Add onClick={() => addRemoveObj.setData(index, id, table, true)}>Add</Add>}
                            {addRemoveObj.isRemove && <Remove onClick={() => addRemoveObj.setData(index, id, table, false)}>Remove</Remove>}
                        </AddRemoveDiv>
                    }
                </>
            );
        case 2:
            return (
                <>
                    <Droppable droppableId={`input-h2-${index}-${table}`} index={index}>
                        {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
                            <Controller
                                as={<InputTextArea as="textarea" rows={style?.row || '3'}
                                    drag={snapshot.isDraggingOver ? 'true' : ''}
                                    value={value}
                                    placeholder={'<> H2 </>'}
                                    fontSize={'1em'}
                                    spellcheck="false"
                                />}
                                name={`${table}[${index}].value`}
                                control={control}
                            />
                        </Div>)}
                    </Droppable>
                    <Controller
                        as={
                            <input
                                type="hidden"
                                value={id}
                            />
                        }
                        defaultValue={id}
                        name={`${table}[${index}].tag_id`}
                        control={control}
                    />
                </>
            );
        case 3:
            return (
                <>
                    <Droppable droppableId={`input-h3-${index}-${table}`} index={index}>
                        {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
                            <Controller
                                as={<InputTextArea as="textarea" rows={style?.row || '3'}
                                    drag={snapshot.isDraggingOver ? 'true' : ''}
                                    value={value}
                                    placeholder={'<> H3 </>'}
                                    fontSize={'0.75em'}
                                    spellcheck="false"
                                />}
                                name={`${table}[${index}].value`}
                                control={control}
                            />
                        </Div>)}
                    </Droppable>
                    <Controller
                        as={
                            <input
                                type="hidden"
                                value={id}
                            />
                        }
                        defaultValue={id}
                        name={`${table}[${index}].tag_id`}
                        control={control}
                    />
                </>
            );
        case 4:
            return (
                <>
                    <Droppable droppableId={`input-h4-${index}-${table}`} index={index}>
                        {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
                            <Controller
                                as={<InputTextArea as="textarea" rows={style?.row || '3'}
                                    drag={snapshot.isDraggingOver ? 'true' : ''}
                                    value={value}
                                    placeholder={'<> H4 </>'}
                                    fontSize={'0.6em'}
                                    spellcheck="false"
                                />}
                                name={`${table}[${index}].value`}
                                control={control}
                            />
                        </Div>)}
                    </Droppable>
                    <Controller
                        as={
                            <input
                                type="hidden"
                                value={id}
                            />
                        }
                        defaultValue={id}
                        name={`${table}[${index}].tag_id`}
                        control={control}
                    />
                </>
            );
        case 5:
            return (
                <>
                    <Droppable droppableId={`input-h5-${index}-${table}`} index={index}>
                        {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
                            <Controller
                                as={<InputTextArea as="textarea" rows={style?.row || '3'}
                                    drag={snapshot.isDraggingOver ? 'true' : ''}
                                    value={value}
                                    placeholder={'<> H5 </>'}
                                    fontSize={'0.52em'}
                                    spellcheck="false"
                                />}
                                name={`${table}[${index}].value`}
                                control={control}
                            />
                        </Div>)}
                    </Droppable>
                    <Controller
                        as={
                            <input
                                type="hidden"
                                value={id}
                            />
                        }
                        defaultValue={id}
                        name={`${table}[${index}].tag_id`}
                        control={control}
                    />
                </>
            );
        case 6:
            return (
                <>
                    <Droppable droppableId={`input-h6-${index}-${table}`} index={index}>
                        {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
                            <Controller
                                as={<InputTextArea as="textarea" rows={style?.row || '3'}
                                    drag={snapshot.isDraggingOver ? 'true' : ''}
                                    value={value}
                                    placeholder={'<> H5 </>'}
                                    fontSize={'0.41em'}
                                    spellcheck="false"
                                />}
                                name={`${table}[${index}].value`}
                                control={control}
                            />
                        </Div>)}
                    </Droppable>
                    <Controller
                        as={
                            <input
                                type="hidden"
                                value={id}
                            />
                        }
                        defaultValue={id}
                        name={`${table}[${index}].tag_id`}
                        control={control}
                    />
                </>
            );
        case 7:
            return (
                <>
                    <Droppable droppableId={`input-p-${index}-${table}`} index={index}>
                        {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
                            <Controller
                                as={<InputTextArea as="textarea" rows={style?.row || '3'}
                                    drag={snapshot.isDraggingOver ? 'true' : ''}
                                    value={value}
                                    fontSize={'0.62em'}
                                    fontWeight={500}
                                    spellcheck="false"
                                    placeholder={placeholder || '<> P </>'}
                                    style={style?.css || {}}
                                />}
                                name={`${table}[${index}].value`}
                                control={control}
                            />
                        </Div>)}
                    </Droppable>
                    <Controller
                        as={
                            <input
                                type="hidden"
                                value={id}
                            />
                        }
                        defaultValue={id}
                        name={`${table}[${index}].tag_id`}
                        control={control}
                    />
                    {(addRemoveObj.isAdd || addRemoveObj.isRemove) &&
                        <AddRemoveDiv>
                            {addRemoveObj.isAdd && <Add onClick={() => addRemoveObj.setData(index, id, table, true)}>Add</Add>}
                            {addRemoveObj.isRemove && <Remove onClick={() => addRemoveObj.setData(index, id, table, false)}>Remove</Remove>}
                        </AddRemoveDiv>
                    }

                </>
            );
        case 8:
            if (![25, 26, 27, 28].includes(eventID)) {
                return (!value ?
                    <>
                        <AttachFile2
                            fileRegister={register}
                            name={`${table}[${index}].image`}
                            title="Attach Logo"
                            key="premium_file"
                            accept=".jpeg, .png, .jpg"
                            description="File Formats: jpeg, png, jpg - Max File Size: 2MB"
                            nameBox
                            attachStyle={{ padding: "5px 5px", marginTop: "7px" }}
                            msgDiv={{
                                text: '(Dimensions-630x360)'
                            }}
                            imageFile={emailData?.image_name}
                        />
                        <Controller
                            as={
                                <input
                                    type="hidden"
                                    value={id}
                                />
                            }
                            defaultValue={id}
                            name={`${table}[${index}].tag_id`}
                            control={control}
                        />
                    </>
                    :
                    <PreviewImg
                        src={value.url || "/assets/images/nprv.png"}
                        alt="Email Image"
                    />)
            }
            else {
                return ""
            }
        case 9:
            return (
                <>
                    <Droppable droppableId={`input-p-${index}-${table}`} index={index}>
                        {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
                            <Input2
                                autoFocus
                                drag={snapshot.isDraggingOver ? 'true' : ''}
                                value={value}
                                // onChange={handleChange}
                                fontSize={'0.75em'}
                                placeholder={'<> Anchor </>'} />
                            {provided.placeholder}
                        </Div>)}
                    </Droppable >
                    <Controller
                        as={
                            <input
                                type="hidden"
                                value={id}
                            />
                        }
                        defaultValue={id}
                        name={`${table}[${index}].tag_id`}
                        control={control}
                    />
                </>
            );
        case 10:
            return (
                <>
                    <div style={{
                        borderTop: '1px solid #454242',
                        width: '90%',
                        margin: '13px auto'
                    }}></div>
                    <Controller
                        as={
                            <input
                                type="hidden"
                                value={id}
                            />
                        }
                        defaultValue={id}
                        name={`${table}[${index}].tag_id`}
                        control={control}
                    />
                </>
            );
            // return (
            //     <div>
            //         <span>{value}</span>
            //     </div>
            // )
        case 18:
            if ([44].includes(eventID)) {
                return (!value ?
                    <>
                        <AttachFile2
                            multiple={true}
                            fa_classname="fa-paperclip"
                            fileRegister={register}
                            name={`${table}[${index}].file`}
                            title="Attach Logo"
                            key="premium_file"
                            accept=".xls, .xlsx, .jpg, .png, .jpeg, .tiff, .eml, .msg, .pdf, .gif, .doc, .docx, .csv, .ppt, .pptx"
                            description="File Formats: jpeg, png, jpg - Max File Size: 2MB"
                            nameBox
                            attachStyle={{ padding: "5px 5px", marginTop: "7px" }}
                            msgDiv={{
                                text: ''
                            }}
                            attachFile={{ attachFile: emailData?.attachments, tempId: emailData?.id }}
                            API={service.deleteTemeplateAttachement}
                        />
                        <Controller
                            as={
                                <input
                                    type="hidden"
                                    value={id}
                                />
                            }
                            defaultValue={id}
                            name={`${table}[${index}].tag_id`}
                            control={control}
                        />
                    </>
                    :
                    <PreviewImg
                        //src={value.url || "/assets/images/nprv.png"}
                        alt="Email Image"
                    />
                )
            }
            else {
                return ""
            }
        case 19:
            return (
                <>
                    <fieldset style={{
                        display: 'flex',
                        padding: '0px'
                    }}>
                        <Buttons className="fontStyle" onClick={() => document.execCommand('italic', false, null)} title="Italicize Highlighted Text"><i className="fa fa-solid fa-italic"></i>
                        </Buttons>
                        <Buttons className="fontStyle" onClick={() => document.execCommand('bold', false, null)} title="Bold Highlighted Text"><i className="fa fa-solid fa-bold"></i>
                        </Buttons>
                        <Buttons className="fontStyle" onClick={() => document.execCommand('underline', false, null)} title='Underline Highlighted Text'><i className="fa fa-solid fa-underline"></i>
                        </Buttons>
                        <Buttons className="fontStyle" onClick={() => document.execCommand('insertOrderedList', false, null)} title='Order List'><i className="fa fa-solid fa-list-ol"></i>
                        </Buttons>
                        <Buttons className="fontStyle" onClick={() => document.execCommand('insertUnorderedList', false, null)} title='Unorder List'><i className="fa fa-solid fa-list-ul"></i>
                        </Buttons>
                        <ButtonGroupDiv>
                            {buttonGroup(chooseColor, changeSize, globalTheme)}
                        </ButtonGroupDiv>
                        <CircleParent onClick={() => setShowDiv(!showDiv)}>
                            <Circle></Circle>
                            <Circle></Circle>
                            <Circle></Circle>
                        </CircleParent>
                        {showDiv &&
                            <MobileButtonGroupDiv>
                                {buttonGroup(chooseColor, changeSize, globalTheme)}
                            </MobileButtonGroupDiv>
                        }
                    </fieldset>
                    <Droppable droppableId={`input-Q-${index}-${table}`} index={index}>
                        {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
                            <div id={`input-Q-${index}-${table}`}
                                onClick={(e) => setTableSelectValue(e)}
                                onPaste={(e) => insertTextOnly(e)}
                                contenteditable="true"
                                drag={snapshot.isDraggingOver ? 'true' : ''}
                                spellcheck="false"
                                style={{
                                    border: '1px solid #454242',
                                    width: '100%',
                                    height: '210px',
                                    padding: '13px',
                                    // overflowY: 'auto',
                                    margin: '13px auto',
                                    fontSize: globalTheme.fontSize ? `calc(17px + ${globalTheme.fontSize - 92}%)` : '17px',
                                    lineHeight: '1.5',
                                    textAlign: 'left',
                                    wordBreak: 'break-word',
                                    fontFamily: 'inherit',
                                    color: 'rgb(57 57 57)',
                                    fontWeight: 'normal',
                                    resize: 'vertical',
                                    overflow: 'auto',
                                    ...(style?.css && {
                                        textAlign: style.css.textAlign
                                    })
                                }}
                            >
                            </div>
                        </Div>)}
                    </Droppable >
                    {/* <div id='fake_textarea' contenteditable="true" spellcheck="false"
                        style={{
                            border: '1px solid #454242',
                            width: '100%',
                            height: '90px',
                            margin: '13px auto'
                        }}
                    >

                    </div> */}
                    {/* <EditableDiv id='fake_textarea' contenteditable="true" spellcheck="false">kmk</EditableDiv> */}
                    {/* <fieldset style={{
                        display: 'flex',
                        padding: '0px'
                    }}>
                        <Buttons className="fontStyle" onClick={() => document.execCommand('italic', false, null)} title="Italicize Highlighted Text"><i>I</i>
                        </Buttons>
                        <Buttons className="fontStyle" onClick={() => document.execCommand('bold', false, null)} title="Bold Highlighted Text"><b>B</b>
                        </Buttons>
                        <Buttons className="fontStyle" onClick={() => document.execCommand('underline', false, null)} title='Underline Highlighted Text'><u>U</u>
                        </Buttons>
                      
                    </fieldset> */}
                    <Controller
                        as={
                            <input
                                type="hidden"
                                value={id}
                            />
                        }
                        defaultValue={id}
                        name={`${table}[${index}].tag_id`}
                        control={control}
                    />
                    {(addRemoveObj.isAdd || addRemoveObj.isRemove) &&
                        <AddRemoveDiv>
                            {addRemoveObj.isAdd && <Add onClick={() => addRemoveObj.setData(index, id, table, true)}>Add</Add>}
                            {addRemoveObj.isRemove && <Remove onClick={() => addRemoveObj.setData(index, id, table, false)}>Remove</Remove>}
                        </AddRemoveDiv>
                    }
                </>
            );
        case 20:
            return (
                <>
                    <table border="3"
                        style={{
                            border: "solid 1px #e6e6e6",
                            width: "100%", marginBottom: "1rem", color: "#212529"
                        }}>
                        <thead>
                            <tr
                                style={{ background: "#3e4dcc", color: "#FFFFFF" }}>
                                <th contenteditable='true'>Enter Text</th>
                                <th contenteditable='true'>Enter Text</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td contenteditable='true'>Enter Text</td>
                                <td contenteditable='true'>Enter Text</td>
                            </tr>
                        </tbody>
                    </table>
                    <div>row</div>
                    <div>col</div>
                    <div onClick={() => addRemoveObj.deleteHtml(index)}>del</div>
                </>
            );
        default: return (
            <Droppable droppableId={`input-p-${index}-${table}`} index={index}>
                {(provided, snapshot) => (<Div {...provided.droppableProps} ref={provided.innerRef}>
                    <Input2
                        spellcheck="false"
                        minheight={'500px'}
                        autoFocus
                        drag={snapshot.isDraggingOver ? 'true' : ''}
                        value={value}
                        //onChange={handleChange}
                        fontSize={'0.75em'}
                        placeholder={'<> Text </>'} />
                    {provided.placeholder}
                </Div>)}
            </Droppable >
        );
    }
}

const AddRemoveDiv = styled.div`
display: flex;
justify-content: center;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(11px + ${fontSize - 92}%)` : '11px'};
border-top: 1px solid #ffcfcf;
`

const Add = styled.div`
margin-right: 5px;
background: #00c300;
padding: 3px 10px;
border-radius: 2px;
color: white;
cursor: pointer;

`

const Remove = styled(Add)`
background: #ff3939;
`
const Buttons = styled.div`
height: 30px;
text-align: center;
padding: 2px 12px;
background: #e7e7e7;
color: black;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(15px + ${fontSize - 92}%)` : '15px'};
border-radius: 2px;
margin: 0px 2px;

`
const ButtonGroupDiv = styled.div`
display:flex;
@media (max-width: 530px) {
   display:none
  }
`

const CircleParent = styled.div`
display:none;
width: 26px;
justify-content: center;
padding: 6px 0px;
background: #e9e9e9;
margin: 0px 5px;
border-radius: 3px;
@media (max-width: 530px) {
    display:inline-grid
   }
`

const Circle = styled.span`
background: #626262;
width: 4px;
height: 4px;
border-radius: 50%;
`
const MobileButtonGroupDiv = styled.div`
display: flex;
justify-content: space-around;
align-items: center;
flex-direction: column;
position: absolute;
margin-left: 113px;
margin-top: 34px;
background: #c2c2c2;
border-radius: 4px;
padding: 3px 3px;
width: 45px;
@media (max-width: 530px) {
   & > div {
       margin:1px
   }
   }
`
