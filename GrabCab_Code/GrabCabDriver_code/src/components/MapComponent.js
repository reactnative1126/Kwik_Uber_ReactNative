import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';
import {Image} from 'react-native';


export default class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }
        
    render() {
    const { mapRegion, markerCord, mapStyle } = this.props;
        return (
            <MapView
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                showsMyLocationButton={true}
                style={[mapStyle,{ marginBottom: this.state.marginBottom }]}
                region={mapRegion}
                onMapReady={() => this.setState({ marginBottom: 1 })}
            >
                <Marker
                    coordinate={markerCord}
                    title={'marker_title'}
                    description={'marker_description'}
                    image={require('../../assets/images/rsz_2red_pin.png')}
                    >
                </Marker>

            </MapView>
        );
    }
}
