import React, { Component } from 'react';
import MapView, { PROVIDER_GOOGLE, Marker } from 'react-native-maps';

export default class MapComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            marginBottom:0,
        }
    }

    render() {
    const { mapRegion, mapStyle,nearby,  onRegionChangeComplete } = this.props;
        return (
            <MapView
                provider={PROVIDER_GOOGLE}
                showsUserLocation={true}
                loadingEnabled
                showsMyLocationButton={true}
                style={[mapStyle,{ marginBottom: this.state.marginBottom }]}
                region={mapRegion}
                onRegionChangeComplete={onRegionChangeComplete}
                //onRegionChange={onRegionChange}
                //onPanDrag={onPanDrag}
                onMapReady={() => this.setState({ marginBottom: 1 })}
            >
     
             

             {nearby?nearby.map((item,index)=>{
                return (
                    <Marker.Animated
                    coordinate={{latitude: item.location?item.location.lat:0.00, longitude: item.location?item.location.lng:0.00}}
                    key = {index}
                    image={require('../../assets/images/available_car.png')}
                    //tracksViewChanges={this.state.tracksViewChanges}
                    >
                    </Marker.Animated>

                )
             })
            :null}
            {/*}
                <Marker.Animated
                    draggable
                    ref={markerRef}
                    coordinate={{latitude: markerCord.droplatitude?markerCord.droplatitude:markerCord.wherelatitude, longitude: markerCord.droplongitude?markerCord.droplongitude:markerCord.wherelongitude}}
                    image={require('../../assets/images/rsz_2red_pin.png')}
                    onDragEnd={(e) => markerDrag(e.nativeEvent.coordinate)}
                    tracksViewChanges={this.state.tracksViewChanges}
                    >
                </Marker.Animated>
            */}
            </MapView>
        );
    }
}
