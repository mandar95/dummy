/*global google*/
import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import {
  withGoogleMap,
  GoogleMap,
  DirectionsRenderer,
} from "react-google-maps";
import { useDispatch } from "react-redux";
import styled from "styled-components";
import swal from "sweetalert";
import { Span } from "../../claims/claim-data/Claim-details-view2";
import { location } from "../networkhospitalbroker.slice";

function DirectionMap({ userLocation, destinationLocation, state }) {

  const [directions, setDirections] = useState(null);
  const [distance, setDistance] = useState(null);
  const dispatch = useDispatch();
  const [travelMode, setTravelMode] = useState('DRIVING')

  useEffect(() => {
    const origin = { lat: userLocation.latitude, lng: userLocation.longitude };
    const destination = { lat: destinationLocation.lat, lng: destinationLocation.lng };


    // Direction API
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(
      {
        origin: origin,
        destination: destination,
        travelMode: travelMode
      },
      (result, status) => {
        if (status === google.maps.DirectionsStatus.OK) {
          setDirections(result);
        } else {
          console.error(`error fetching directions ${result}`);
        }
      }
    );


    // Distance API
    const service = new google.maps.DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: travelMode
      },
      (response, status) => {
        if (status && response?.rows?.[0]?.elements?.[0]) {
          if (response?.rows?.[0]?.elements?.[0]?.status === "ZERO_RESULTS") {
            swal('No Data Found', '', 'info').then(() => setTravelMode(distance.travelMode || 'DRIVING'))
            return null
          }
          setDistance({ ...response.rows[0].elements[0], travelMode });
        } else {
          console.error(`error fetching directions ${response}`);
        }
      }
    );

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [travelMode])

  const GoogleMapExample = withGoogleMap(props => (
    <GoogleMap
      defaultCenter={{ lat: state.mapPosition.lat, lng: state.mapPosition.lng }}
      defaultZoom={13}
      options={{ streetViewControl: false }}
    >
      {directions && <DirectionsRenderer
        directions={directions}
      />}
    </GoogleMap>
  ));

  const onReset = () => {
    setDirections(null);
    setDistance(null);
    dispatch(location({}));
  }

  return directions ? <div>
    <GoogleMapExample
      containerElement={
        <div style={{ height: '100vh' }} />
      }
      mapElement={
        <div style={{ height: '97%', borderRadius: '10px 10px 0 0' }} />
      }
    />
    {distance && <div className="d-flex justify-content-between flex-wrap align-items-center px-4">
      <div>
        <span className="mr-3">Distance: <Span bgColor="#ffdede" Color="red">{distance.distance.text || '-'}</Span></span>
        <span className="mr-3">Duration: <Span bgColor="#dee1ffd9" Color="#006bff">{distance.duration.text || '-'}</Span></span>
        <span>Travel Mode: {/* <Span bgColor="#fff3ded9" Color="#cd9a00">DRIVING</Span> */}
          <Filter>
            <Select value={travelMode} onChange={(e) => setTravelMode(e?.target?.value || 'DRIVING')}>
              {Object.entries(google.maps.TravelMode).map(([id, column], index) => <option key={index + '-travel-mode'} value={id}>
                {column.replace('_', ' ')}
              </option>)}
            </Select>
          </Filter>
        </span>
      </div>

      <Button type='button' variant="danger" onClick={onReset}>Reset</Button>
    </div>}
  </div>
    : null

}

export default DirectionMap;

const Filter = styled.div`
padding: 0px 10px;
width: fit-content;
background: #c7d3f05c;
border-radius: 20px;
display: inline-block;
`

const Select = styled.select`
border: 0px solid #dddddd;
border-radius: 30px;
outline: none;
background: #c7d3f000;
height: 32px;
width: 140px;
color: #484848e6;
font-size: ${({ theme: { fontSize } }) => fontSize ? `calc(13px + ${fontSize - 92}%)` : '13px'};
padding: 4px 10px;


@media (max-width:992px) {
	width:100%
   }
`
