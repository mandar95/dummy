import React, { useEffect, useState } from "react";
import MapBox from "./maps";
import _ from "lodash";

const SearchComponent = (props) => {
  const [LocData, setLocData] = useState({});
  useEffect(() => {
    if (!_.isEmpty(props.LocationData) && props.LocationData)
      setLocData(props.LocationData);
  }, [props.LocationData]);

  return (
    <MapBox
      position="topright"
      inputPlaceholder="Search"
      showMarker={true}
      showPopup={true}
      LocationData={LocData}
      openSearchOnLoad={false}
      closeResultsOnClick={true}
      providerOptions={{ searchBounds: [] }}
    // customProvider={{ search: (searchString) => {} }}
    />
  );
};
export default SearchComponent;
