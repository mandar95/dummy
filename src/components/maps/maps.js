import React, { Component } from "react";
import { LatLng } from "leaflet";
import { Map, TileLayer, Popup, Marker } from "react-leaflet";
import ReactLeafletSearch from "react-leaflet-search";
import "./maps.css";
import _ from "lodash";

class CustomOpenStreetMap {
  constructor(options = { providerKey: null, searchBounds: [] }) {
    const { searchBounds } = options;
    let boundsUrlComponent = "";
    let regionUrlComponent = "";
    if (searchBounds.length) {
      const reversed = searchBounds.map((el) => {
        return el.reverse();
      });
      this.bounds = [].concat([], ...reversed).join(",");
      boundsUrlComponent = `&bounded=1&viewbox=${this.bounds}`;
    }
    if ("region" in options) {
      regionUrlComponent = `&countrycodes=${options.region}`;
    }
    this.url = `https://nominatim.openstreetmap.org/search?format=json&addressdetails=1&polygon_svg=1&namedetails=1${boundsUrlComponent}${regionUrlComponent}&q=`;
  }

  async search(query) {
    const response = await fetch(this.url + query).then((res) => res.json());
    return this.formatResponse(response);
  }
}

export default class MapBox extends Component {
  constructor(props) {
    super(props);
    this.provider = new CustomOpenStreetMap();
    this.state = {
      search: new LatLng(22.814365, 78.849831),
      count: 0,
      maxZoom: 10,
      maxBounds: [
        [-90, -180],
        [90, 180],
      ],
      bounds: [
        {
          lat: 68.1766451354,
          lng: 7.96553477623,
        },
        {
          lat: 68.1766451354,
          lng: 97.4025614766,
        },
        {
          lat: 35.4940095078,
          lng: 97.4025614766,
        },
        {
          lat: 35.4940095078,
          lng: 7.96553477623,
        },
      ],
    };
  }
  // custom popup
  customPopup(SearchInfo) {
    return (
      <Popup>
        <div>
          <p>{SearchInfo.latLng.toString().replace(",", " , ")}</p>
          <p>{SearchInfo.info}</p>
          <p>
            {SearchInfo.raw &&
              SearchInfo.raw.place_id &&
              JSON.stringify(SearchInfo.raw.place_id)}
          </p>
        </div>
      </Popup>
    );
  }

  render() {
    return (
      <Map
        className="Map"
        scrollWheelZoom={true}
        bounds={this.state.bounds}
        maxZoom={this.state.maxZoom}
        maxBounds={this.state.maxBounds}
      >
        <TileLayer
          noWrap={true}
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {!_.isEmpty(this.props.LocationData) ? (
          this?.props?.LocationData?.map((item, index) => {
            return (
              <Marker key={'marker' + index} position={[item.lat, item.lon]}>
                <Popup>Marker 1</Popup>
              </Marker>
            );
          })
        ) : (
          <noscript />
        )}
        <ReactLeafletSearch
          position={this.props.position}
          inputPlaceholder={this.props.inputPlaceholder}
          search={
            [
              this.props.LocationData[0]?.lat,
              this.props.LocationData[0]?.lon,
            ] || [30, 30]
          }
          showMarker={false}
          zoom={5}
          showPopup={true}
          openSearchOnLoad={false}
          closeResultsOnClick={this.props.closeResultsOnClick}
          providerOptions={{
            region: "in",
          }}
        />
      </Map>
    );
  }
}
