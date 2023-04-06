import React,{/* useEffect, */ useRef} from 'react';
// import ReactDOM from "react-dom";
import { Overlay, Popover} from "react-bootstrap";
import styled from 'styled-components';

export default function PopOver({ showpopover, target, tooltipdata }) {

  const ref = useRef(null);

//   useEffect(()=>{
    // var element = ref.current;
    // element.setAttribute('data-container', 'body');
  
//   },[])

    //let sum = tooltipdata?.reduce((n, { sum_insured }) => n + parseInt(sum_insured), 0)
    return (
        <div ref={ref} className="responsivator" id='responsivator'>
            <Overlay
                show={showpopover}
                target={target}
                placement={"top"}
                // container={ref}
                containerPadding={50}
            >
                <Popup id="popover-contained">
                    <Popover.Content>
                        {tooltipdata}
                    </Popover.Content>
                </Popup>
            </Overlay>
        </div>
    );
}

const Popup = styled(Popover)`
    min-width: 700px;
    /* height:350px; */
    padding:5px 10px;
    border-radius: 13px;
    border:none;
    background: white;
    box-shadow: 0px 3px 10px 1px #ccc;
    & .popover-body> .row:last-child{
        margin: 5px 0px 0px 0px;
        border-top: 1px solid rgba(0,0,0,.1)
    }
    & .popover-body> .row:last-child > div{
        padding: 0px;
    }
    @media (max-width: 767px) {
        min-width: 300px;
        font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(9px + ${fontSize - 92}%)` : '9px'};
        padding: 0px;
  }
`
