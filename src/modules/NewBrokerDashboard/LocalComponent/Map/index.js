import React from "react";

import India from "@svg-maps/india";
import { SVGMap } from "react-svg-map";
import "./map.css";
import { useDispatch } from "react-redux";
import { setCurrentStateInfo } from "modules/NewBrokerDashboard/newbrokerDashboard.slice";
// import ReactDatamaps from "react-india-states-map";
// import "react-svxg-map/lib/index.css";

const Map = ({statesFromAPI = [], handleOnLocationClick}) => {

  const dispatch = useDispatch();

  const stateOnClick = (event) => {
    const clickedStateCode = event.target.id.toUpperCase();
    const clickedState = statesList.filter(state => state.state_code === clickedStateCode);
    const stateID = statesFromAPI?.filter(state => state.id === clickedState[0]?.id)[0]?.id;
    if(!!stateID) {
      handleOnLocationClick(stateID);
    }
  };
  const handleLocationMouseOver = (event) => {
    const currentStateCode = event.target.id.toUpperCase();
    const currentState = statesList.filter(state => state.state_code === currentStateCode);
    const state = statesFromAPI?.filter(state => state.id === currentState[0]?.id);
    dispatch(setCurrentStateInfo(state));
  }
  const handleLocationMouseOut = () => {
    dispatch(setCurrentStateInfo([]));
  }

  return (
    <SVGMap 
      map={India} 
      onLocationClick={stateOnClick}
      onLocationMouseOver={handleLocationMouseOver}
      onLocationMouseOut={handleLocationMouseOut}
    />
    //     <ReactDatamaps
    //   regionData={["Maharashtra"]}
    //   mapLayout={{
    //     hoverTitle: "Count",
    //     noDataColor: "pink",
    //     borderColor: "#ffffff",
    //     hoverBorderColor: "pink",
    //     hoverColor: "green"
    //   }}
    //   hoverComponent={({ value }) => {
    //     return (
    //       <>
    //         <p>{value.name}</p>
    //       </>
    //     );
    //   }}
    //   onClick={stateOnClick}
    //   activeState={activeState}
    // />
  );
};

export default Map;

const statesList = [ 
  { id: 8,
  state_code: 'AN',
  state_name: 'Andaman and Nicobar Islands' },
{ id: 10, state_code: 'AP', state_name: 'Andhra Pradesh' },
{ id: 11, state_code: 'AR', state_name: 'Arunachal Pradesh' },
{ id: 12, state_code: 'AS', state_name: 'Assam' },
{ id: 13, state_code: 'BR', state_name: 'Bihar' },
{ id: 14, state_code: 'CH', state_name: 'Chandigarh' },
{ id: 15, state_code: 'CT', state_name: 'Chhattisgarh' },
{ id: 16,
  state_code: 'DN',
  state_name: 'Dadra and Nagar Haveli and Daman and Diu' },
{ id: 2, state_code: 'DL', state_name: 'Delhi' },
{ id: 18, state_code: 'GA', state_name: 'Goa' },
{ id: 19, state_code: 'GJ', state_name: 'Gujarat' },
{ id: 20, state_code: 'HR', state_name: 'Haryana' },
{ id: 21, state_code: 'HP', state_name: 'Himachal Pradesh' },
{ id: 22, state_code: 'JK', state_name: 'Jammu and Kashmir' },
{ id: 23, state_code: 'JH', state_name: 'Jharkhand' },
{ id: 4, state_code: 'KA', state_name: 'Karnataka' },
{ id: 24, state_code: 'KL', state_name: 'Kerala' },
{ state_code: 'LA', state_name: 'Ladakh' },
{ id: 25, state_code: 'LD', state_name: 'Lakshadweep' },
{ id: 5, state_code: 'MH', state_name: 'Maharashtra' },
{ id: 26, state_code: 'MP', state_name: 'Madhya Pradesh' },
{ id: 27, state_code: 'MN', state_name: 'Manipur' },
{ id: 28, state_code: 'ML', state_name: 'Meghalaya' },
{ id: 29, state_code: 'MZ', state_name: 'Mizoram' },
{ id: 30, state_code: 'NL', state_name: 'Nagaland' },
{ id: 31, state_code: 'OR', state_name: 'Odisha' },
{ id: 33, state_code: 'PY', state_name: 'Puducherry' },
{ id: 34, state_code: 'PB', state_name: 'Punjab' },
{ id: 35, state_code: 'RJ', state_name: 'Rajasthan' },
{ id: 36, state_code: 'SK', state_name: 'Sikkim' },
{ id: 6, state_code: 'TN', state_name: 'Tamil Nadu' },
{ id: 1, state_code: 'TG', state_name: 'Telangana' },
{ id: 37, state_code: 'TR', state_name: 'Tripura' },
{
  state_code: 'TT',
  state_name: 'The Government of NCT of Delhi' },
{ id: 39, state_code: 'UP', state_name: 'Uttar Pradesh' },
{ id: 38, state_code: 'UT', state_name: 'Uttarakhand' },
{ id: 7, state_code: 'WB', state_name: 'West Bengal' } ]
