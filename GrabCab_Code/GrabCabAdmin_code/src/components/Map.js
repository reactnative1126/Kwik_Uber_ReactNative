import React from 'react';
import {
    withScriptjs,
    withGoogleMap,
    GoogleMap,
    Marker,
    InfoWindow
  } from "react-google-maps";

const Map = withScriptjs(withGoogleMap(props =>
  <GoogleMap
    defaultZoom={10}
    defaultCenter={props.mapcenter}
  >
    {props.locations.map(marker => (
        <Marker
            position={{ lat: marker.lat, lng: marker.lng }}
            key={marker.id}
            options={{icon: require('../assets/car.png'), size: { width: 32, height: 32 }}}
        >
          <InfoWindow>
            <div>{marker.drivername}</div>
          </InfoWindow>
        </Marker>
    ))}
  </GoogleMap>
));

export default Map;
