import React, { useEffect } from "react";
import { CompactCard } from "components";
import { Row, Col } from "react-bootstrap";
import Filters from "./filters2";
import { useDispatch, useSelector } from "react-redux";
import swal from "sweetalert";
import { clear, clearDD, userLocation } from "./networkhospitalbroker.slice";
import Leaflet from "leaflet";
import Map from "../../components/maps/geoSearch";
import { CardSlot } from "./style";
import CardList from "./CardList";
import GoogleMapComponent from './GoogleMap/Map';
import { DrawerConsumer } from "../../context/sidebar.context.api";
import { ModuleControl } from "../../config/module-control";

const getLocation = (dispatch, currentUser) => {
	if (!navigator.geolocation) {
		console.error('Geolocation is not supported by your browser');
	} else if (ModuleControl.GoogleMapIntegration || ['FYNTUNE_PRODUCTION'].includes(process.env.REACT_APP_SERVER) || 'SALMAN' === process.env.REACT_APP_DEVELOPER || currentUser.broker_id === 146) {
		console.error('Locating...');
		navigator.geolocation.getCurrentPosition((position) => {
			dispatch(userLocation({ latitude: position.coords.latitude, longitude: position.coords.longitude }))
		}, () => {
			console.error('Unable to retrieve your location');
		});
	}
}

const NetworkHospaital = () => {
	const dispatch = useDispatch();
	const { error, Hosp,
		getLocationData
	} = useSelector(
		(state) => state.networkhospitalbroker
	);
	const { currentUser } = useSelector((state) => state.login);

	//Map Icons
	Leaflet.Icon.Default.imagePath =
		"//cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.1/images/";

	useEffect(() => {
		getLocation(dispatch, currentUser)
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [])

	useEffect(() => {
		if (error) {
			swal(error, "", "warning");
		}
		return () => {
			dispatch(clear());
			dispatch(clearDD('Hosp'));
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [error]);

	return (
		<Row className="m-0 p-0">
			<Col sm="12" md="12" lg="4" xl="3" style={{ minWidth: "300px" }}>
				<CompactCard
					title={"Network Hospital"}
					headerStyle={{ textAlign: "center" }}>
					<div>
						<Filters />
					</div>
				</CompactCard>
			</Col>

			<DrawerConsumer>
				{value =>
					<>
						<Col sm="12" md="12" lg="8" xl={value.status ? '8' : "6"} className="m-0 p-0">
							<CompactCard removeBottomHeader={true}>
								<div style={{
									margin: (ModuleControl.GoogleMapIntegration || (['FYNTUNE_PRODUCTION'].includes(process.env.REACT_APP_SERVER) &&
										currentUser.email === 'doodleone@fyntune.com') || 'SALMAN' === process.env.REACT_APP_DEVELOPER || currentUser.broker_id === 146) ? "-55px -20px 10px" : "-55px -20px -10px"
								}}>
									{(ModuleControl.GoogleMapIntegration || (['FYNTUNE_PRODUCTION'].includes(process.env.REACT_APP_SERVER) &&
										currentUser.email === 'doodleone@fyntune.com') || 'SALMAN' === process.env.REACT_APP_DEVELOPER || currentUser.broker_id === 146)
										?
										<GoogleMapComponent /> :
										<Map LocationData={getLocationData} />
									}
								</div>
							</CompactCard>
						</Col>
						<Col
							sm="12"
							md="12"
							lg="12"
							xl={value.status ? '12' : "3"}
							className="w-100"
							style={{ overflow: "auto" }}>
							<CardSlot>
								<CardList getLocation={getLocation} hospitalData={Hosp || []} />
							</CardSlot>
						</Col>
					</>
				}
			</DrawerConsumer>
		</Row>
	);
};

export default NetworkHospaital;
