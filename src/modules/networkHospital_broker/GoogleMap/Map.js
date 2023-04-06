/*global google*/
import React, { Component } from 'react';
import { withGoogleMap, GoogleMap, withScriptjs, InfoWindow, Marker } from "react-google-maps";
import Geocode from "react-geocode";
import Autocomplete from 'react-google-autocomplete';
import { connect } from 'react-redux';
import { location } from '../networkhospitalbroker.slice';
import DirectionMap from './DirectionMap';
import _ from 'lodash';
Geocode.setApiKey(process.env.REACT_APP_MAP_KEY);
Geocode.enableDebug();

const options = {
	fields: ["formatted_address", "geometry", "name"],
	strictBounds: false,
	// types: ["establishment"],
	componentRestrictions: { country: "in" },
	types: ['hospital', 'pharmacy', 'doctor', 'health']
},
	india = { lat: 22.814365, lng: 78.849831 };

class Map extends Component {

	constructor(props) {
		super(props);
		this.state = {
			address: '',
			city: '',
			area: '',
			state: '',
			mapPosition: {
				lat: india.lat,
				lng: india.lng
			},
			markerPosition: {
				lat: '',
				lng: ''
			},
			zoom: 5,
			directions: null
		}
	}


	componentDidUpdate() {
		if (this.props.lat && this.props.lng && _.isEmpty(this.props.userLocation)) {
			Geocode.fromLatLng(this.props.lat, this.props.lng).then(
				response => {
					const address = response.results[0].formatted_address,
						addressArray = response.results[0].address_components,
						city = this.getCity(addressArray),
						area = this.getArea(addressArray),
						state = this.getState(addressArray);

					this.setState({
						address: (address) ? address : '',
						area: (area) ? area : '',
						city: (city) ? city : '',
						state: (state) ? state : '',
						mapPosition: {
							lat: this.props.lat,
							lng: this.props.lng
						},
						markerPosition: {
							lat: this.props.lat,
							lng: this.props.lng
						},
						zoom: 17
					})
				},
				error => {
					console.error(error);
				}
			);
		}
		if (!_.isEmpty(this.props.userLocation) && !(this.props.lat && this.props.lng)) {
			this.setState({
				...this.state,
				mapPosition: {
					lat: this.props.userLocation.latitude + 0.09,
					lng: this.props.userLocation.longitude
				},
				zoom: 10.5
			})
		}
	}
	/**
	 * Component should only update ( meaning re-render ), when the user selects the address, or drags the pin
	 *
	 * @param nextProps
	 * @param nextState
	 * @return {boolean}
	 */
	shouldComponentUpdate(nextProps, nextState) {
		if (
			// this.state.markerPosition.lat !== india.lat ||
			this.state.address !== nextState.address ||
			this.state.city !== nextState.city ||
			this.state.area !== nextState.area ||
			this.state.state !== nextState.state ||
			this.props.lat !== nextProps.lat ||
			this.props.lng !== nextProps.lng ||
			this.props.userLocation?.longitude !== nextProps.userLocation?.longitude ||
			this.props.userLocation?.latitude !== nextProps.userLocation?.latitude
		) {
			return true
		} else {
			return false
		}
	}
	/**
	 * Get the city and set the city input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getCity = (addressArray = []) => {
		let city = '';
		for (let i = 0; i < addressArray.length; i++) {
			if (addressArray[i].types[0] && 'administrative_area_level_2' === addressArray[i].types[0]) {
				city = addressArray[i].long_name;
				return city;
			}
		}
	};
	/**
	 * Get the area and set the area input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getArea = (addressArray = []) => {
		let area = '';
		for (let i = 0; i < addressArray.length; i++) {
			if (addressArray[i].types[0]) {
				for (let j = 0; j < addressArray[i].types.length; j++) {
					if ('sublocality_level_1' === addressArray[i].types[j] || 'locality' === addressArray[i].types[j]) {
						area = addressArray[i].long_name;
						return area;
					}
				}
			}
		}
	};
	/**
	 * Get the address and set the address input value to the one selected
	 *
	 * @param addressArray
	 * @return {string}
	 */
	getState = (addressArray = []) => {
		let state = '';
		for (let i = 0; i < addressArray.length; i++) {
			for (let i = 0; i < addressArray.length; i++) {
				if (addressArray[i].types[0] && 'administrative_area_level_1' === addressArray[i].types[0]) {
					state = addressArray[i].long_name;
					return state;
				}
			}
		}
	};
	/**
	 * And function for city,state and address input
	 * @param event
	 */
	onChange = (event) => {
		this.setState({ [event.target.name]: event.target.value });
	};
	/**
	 * This Event triggers when the marker window is closed
	 *
	 * @param event
	 */
	onInfoWindowClose = (event) => {

	};

	/**
	 * When the marker is dragged you get the lat and long using the functions available from event object.
	 * Use geocode to get the address, city, area and state from the lat and lng positions.
	 * And then set those values in the state.
	 *
	 * @param event
	 */
	onMarkerDragEnd = (event) => {
		let newLat = event.latLng.lat(),
			newLng = event.latLng.lng();

		Geocode.fromLatLng(newLat, newLng).then(
			response => {
				const address = response.results[0].formatted_address,
					addressArray = response.results[0].address_components,
					city = this.getCity(addressArray),
					area = this.getArea(addressArray),
					state = this.getState(addressArray);
				this.setState({
					address: (address) ? address : '',
					area: (area) ? area : '',
					city: (city) ? city : '',
					state: (state) ? state : '',
					markerPosition: {
						lat: newLat,
						lng: newLng
					},
					mapPosition: {
						lat: newLat,
						lng: newLng
					},
				})
			},
			error => {
				console.error(error);
			}
		);
	};

	/**
	 * When the user types an address in the search box
	 * @param place
	 */
	onPlaceSelected = (place) => {
		this.props.reset({})
		const latValue = place.geometry.location.lat(),
			lngValue = place.geometry.location.lng();

		if (!_.isEmpty(this.props.userLocation)) {
			this.props.setLoacation({ lat: latValue, lng: lngValue })
		} else {

			const address = place.formatted_address,
				addressArray = place.address_components,
				city = this.getCity(addressArray),
				area = this.getArea(addressArray),
				state = this.getState(addressArray);
			// Set these values in the state.
			this.setState({
				address: (address) ? address : '',
				area: (area) ? area : '',
				city: (city) ? city : '',
				state: (state) ? state : '',
				markerPosition: {
					lat: latValue,
					lng: lngValue
				},
				mapPosition: {
					lat: latValue,
					lng: lngValue
				},
				zoom: 17
			})
		}
	};


	render() {
		const AsyncMap = withScriptjs(
			withGoogleMap(
				props => (
					<GoogleMap google={this.props.google}
						defaultZoom={this.state.zoom || 5}
						options={{ streetViewControl: false }}
						defaultCenter={{ lat: this.state.mapPosition.lat, lng: this.state.mapPosition.lng }}
					>
						{/* InfoWindow on top of marker */}
						{!!(this.state.markerPosition.lat && this.state.markerPosition.lng) && <InfoWindow
							onClose={this.onInfoWindowClose}
							position={{ lat: (this.state.markerPosition.lat + 0.0008), lng: this.state.markerPosition.lng }}
						>
							<div>
								<span style={{ padding: 0, margin: 0 }}>{this.state.address}</span>
							</div>
						</InfoWindow>}
						{/*Marker*/}
						<Marker google={this.props.google}
							name={'destination'}
							draggable={true}
							streetView={false}
							onDragEnd={this.onMarkerDragEnd}

							position={{ lat: this.state.markerPosition.lat, lng: this.state.markerPosition.lng }}
						/>
						<Marker />
						{/* For Auto complete Search Box */}
						<Autocomplete
							style={{
								width: '100%',
								height: '40px',
								paddingLeft: '16px',
								marginTop: '2px',
							}}
							onPlaceSelected={this.onPlaceSelected}
							options={{
								...options, ...!_.isEmpty(this.props.userLocation) && {
									bounds: new google.maps.LatLngBounds(new google.maps.LatLng(this.props.userLocation.latitude, this.props.userLocation.longitude)),
								}
							}}
						/>
					</GoogleMap>
				)
			)
		);

		let map = <div style={{ height: '100vh' }} />;
		if (!_.isEmpty(this.props.userLocation) && this.props.lat && this.props.lng /* && false */) {

			const MapLoader = withScriptjs(DirectionMap);
			map = <div>
				<MapLoader
					googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_KEY}&libraries=places`}
					loadingElement={
						<div style={{ height: `100%` }} />
					}
					containerElement={
						<div style={{ height: '100vh' }} />
					}
					mapElement={
						<div style={{ height: '97%', borderRadius: '10px 10px 0 0' }} />
					}
					userLocation={this.props.userLocation}
					destinationLocation={{ lat: this.props.lat, lng: this.props.lng }}
					state={this.state}
				/>
			</div>
		}
		else if (india.lat !== undefined) {
			map = <div>
				<AsyncMap
					googleMapURL={`https://maps.googleapis.com/maps/api/js?key=${process.env.REACT_APP_MAP_KEY}&libraries=places`}
					loadingElement={
						<div style={{ height: `100%` }} />
					}
					containerElement={
						<div style={{ height: '100vh' }} />
					}
					mapElement={
						<div style={{ height: '97%', borderRadius: '10px 10px 0 0' }} />
					}
				/>
			</div>
		}

		return (map)
	}
}

const mapStateToProps = (state) => ({
	lat: state.networkhospitalbroker.location?.lat,
	lng: state.networkhospitalbroker.location?.lng,
	userLocation: state.networkhospitalbroker.userLocation
});

const mapDispatchToProps = (dispatch) => ({
	reset: () => dispatch(location()),
	setLoacation: (data) => dispatch(location(data)),
})


export default connect(mapStateToProps, mapDispatchToProps)(Map)
