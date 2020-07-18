import React, { Component } from 'react';
import { Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marginBottom: 0,
        }
    }

    render() {
        const { mapRegion, mapStyle, nearby, onRegionChangeComplete } = this.props;
        return (
            <MapView
                // provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                loadingEnabled
                showsMyLocationButton={false}
                style={[mapStyle, { marginBottom: this.state.marginBottom }]}
                region={mapRegion}
                onRegionChangeComplete={onRegionChangeComplete}
                onMapReady={() => this.setState({ marginBottom: 1 })}
            >
                {nearby ? nearby.map((item, index) => {
                    return (
                        <Marker.Animated
                            coordinate={{ latitude: item.driver_lat, longitude: item.driver_long }}
                            key={index}
                        // image={require('@assets/images/available_car.png')}
                        >
                            <Image source={require('@assets/images/available_car.png')} style={{ width: 40, height: 20 }} />
                        </Marker.Animated>
                    )
                })
                    : null
                }
            </MapView>
        );
    }
}
