import React from 'react';
import { Overlay, Popover } from "react-bootstrap";
import { useSelector } from 'react-redux';
import styled from 'styled-components';

const Popup = styled(Popover)`
    height: 34px;
    width: 195px;
    z-index:1;
    border-radius: 5px;
    border: none;
    background: #6d6d6d;
    color: white;
    box-shadow: 0px 3px 10px 1px #ccc;
    & > .arrow{
        background:red
    }
   & > .arrow::after {
    border-width: 0 .5rem .5rem .5rem;
    border-bottom-color: #6d6d6d !important;
}

    & .popover-body> .row:last-child{
        margin: 5px 0px 0px 0px;
        border-top: 1px solid rgba(0,0,0,.1)
    }
    & .popover-body> .row:last-child > div{
        padding: 0px;
    }
`

const EditTooltip = ({ showpopover, target, reference, content }) => {
    const { globalTheme } = useSelector(state => state.theme)
    //export default function EditTooltip() 
    return (
        <div ref={reference}>
            <Overlay
                show={showpopover}
                target={target}
                placement="bottom"
                container={reference.current}
                containerPadding={50}
            >
                <Popup id="popover-contained">
                    <Popover.Content>
                        <p style={{
                            fontSize: globalTheme.fontSize ? `calc(11px + ${globalTheme.fontSize - 92}%)` : '11px',
                            color: 'white',
                            whiteSpace: 'nowrap'
                        }}>{content}</p>
                    </Popover.Content>
                </Popup>
            </Overlay>
        </div>
    );
}

export default EditTooltip;

