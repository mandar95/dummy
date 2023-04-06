import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import swal from 'sweetalert';

import { Row, Col } from 'react-bootstrap';
import { Input, Button, Select } from 'components';
import TemplateCard from './Card/TemplateCard';
import { Header, Tags, Div } from './Tags';
import { Controller, useForm } from "react-hook-form";

import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import { useDispatch, useSelector } from 'react-redux';
import { sort, reset_template, createEmailTemplate } from '../communication-config.slice';
import { HTML, HTMLInput } from './Box-Input'

import EmailEditor from 'react-email-editor';


export const Email = ({ files, setFiles }) => {

    const { watch, control } = useForm();

    const emailEditorRef = useRef(null);

    // const unlayer = window?.unlayer

    // useEffect(() => {

    //     unlayer.init({
    //         id: 'editor-container',
    //         projectId: '',
    //         displayMode: 'email'
    //     })

    //     // unlayer.registerPropertyEditor({
    //     //     name: 'my_color_picker',
    //     //     Widget: unlayer.createWidget({
    //     //       render(value, updateValue, data) {
    //     //         return `
    //     //           <input className="color-value" value=${value} />
    //     //           <button className="red">Red</button>
    //     //           <button className="green">Green</button>
    //     //           <button className="blue">Blue</button>
    //     //         `
    //     //       },
    //     //       mount(node, value, updateValue, data) {
    //     //         var input = node.getElementsByClassName('color-value')[0]
    //     //         input.onchange = function(event) {
    //     //           updateValue(event.target.value)
    //     //         }

    //     //         var redButton = node.getElementsByClassName('red')[0]
    //     //         redButton.onclick = function() {
    //     //           updateValue('#f00')
    //     //         }

    //     //         var greenButton = node.getElementsByClassName('green')[0]
    //     //         greenButton.onclick = function() {
    //     //           updateValue('#0f0')
    //     //         }

    //     //         var blueButton = node.getElementsByClassName('blue')[0]
    //     //         blueButton.onclick = function() {
    //     //           updateValue('#00f')
    //     //         }
    //     //       }
    //     //     })
    //     //   });


    // }, [unlayer])

    const exportHtml = () => {
        emailEditorRef.current.editor.exportHtml((data) => {
            const { design, html } = data;
        });
    };

    const onLoad = () => {
        // editor instance is created
        // you can load your template here;
        // const templateJson = {};
        // emailEditorRef.current.editor.loadDesign(templateJson);
    }

    const onReady = () => {
        // editor is ready
    };

    // unlayer.registerPropertyEditor({
    //     name: 'my_color_picker',
    //     Widget: <div></div>,
    // });

    // const editor = unlayer.createEditor({
    //     id: 'editor-container',
    //     projectId: 1234,
    //     displayMode: 'email'
    //   })

    //   editor.loadDesign({})
    //   editor.exportHtml(function(data) { })

    const Viewer = () => {
        return <div>I am a custom tool.</div>
    }

    // return (<>
    //     <div id="editor-container">

    //     </div>
    // </>)

    return (
        <form>
            {/* <div>
                <button onClick={exportHtml}>Export HTML</button>
            </div> */}
            {/* <Row xs={1} sm={2} md={2} lg={2} xl={2}></Row> */}
            <Row style={{ padding: '0px 15px' }}>
                <Col sm="12" md="12" lg="4" xl="4">
                    <Controller
                        as={
                            <Select
                                label="Events"
                                placeholder="Select Events"
                                required={false}
                                isRequired={true}
                                options={[]}
                            />
                        }
                        name="event_id"
                        control={control}
                        defaultValue={""}
                    />
                </Col>
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
            </Row>

            <EmailEditor
                ref={emailEditorRef}
                onLoad={onLoad}
                onReady={onReady}
                options={{
                    customJS: [

                    ]
                }}
            // tools={
            //     {
            //         name: 'my_tool',
            //         label: 'My Tool',
            //         icon: 'fa-smile',
            //         supportedDisplayModes: ['web', 'email'],
            //         options: {
            //             colors: { // Property Group
            //                 title: "Colors", // Title for Property Group
            //                 position: 1, // Position of Property Group
            //                 options: {
            //                     "textColor": { // Property: textColor
            //                         "label": "Text Color", // Label for Property
            //                         "defaultValue": "#FF0000",
            //                         "widget": "color_picker" // Property Editor Widget: color_picker
            //                     },
            //                     "backgroundColor": { // Property: backgroundColor
            //                         "label": "Background Color", // Label for Property
            //                         "defaultValue": "#FF0000",
            //                         "widget": "color_picker" // Property Editor Widget: color_picker
            //                     }
            //                 }
            //             }
            //         },
            //         values: {},
            //         renderer: {
            //             //   Viewer:  emailEditorRef?.current?.unlayer?.createViewer({
            //             //     render(values) {
            //             //       return `<div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">I am a custom tool.</div>`
            //             //     }
            //             //   }),
            //             Viewer: Viewer,
            //             exporters: {
            //                 web: function (values) {
            //                     return `<div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">I am a custom tool.</div>`
            //                 },
            //                 email: function (values) {
            //                     return `<div style="color: ${values.textColor}; background-color: ${values.backgroundColor};">I am a custom tool.</div>`
            //                 }
            //             },
            //             head: {
            //                 css: function (values) { },
            //                 js: function (values) { }
            //             }
            //         },
            //         validator(data) {
            //             const { defaultErrors, values } = data;
            //             return [];
            //         },
            //     }
            // }
            />
            <Col md={12} lg={12} xl={12} sm={12} className="d-flex justify-content-end mt-4">
                {/* <Button type="button" onClick={resetTemplate} buttonStyle="danger">
                    Reset
                </Button> */}
                <Button type="button" onClick={exportHtml}>
                    Submit
                </Button>
            </Col>
            {/* <div>
                <button onClick={exportHtml}>Export HTML</button>
            </div> */}
        </form>)
}

const Rows = styled(Row)`
margin: 0`
