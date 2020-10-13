import React from 'react';
import {MapWrapper} from "./google-map.style";
import {GoogleApiWrapper, Map, Marker} from "google-maps-react";

const GoogleMap = ({ google, lat, lng, title, isLoaded }) => {
    lng = -lng;

    if (!isLoaded)
        return <span>Loading...</span>;

    return (
        <MapWrapper>
            <Map
                google={google}
                initialCenter={{lat, lng}}
                center={{lat, lng}}
                zoom={14}
            >
                <Marker
                    title={title}
                    name='Location'
                    position={{lat, lng}}
                />
            </Map>
        </MapWrapper>
    );
}

const API_KEY = 'AIzaSyAsW9YUwzkf3TZ51GMC85wbhv4rx9jVXP0'; // very bad - never do in practice

export default GoogleApiWrapper({apiKey: API_KEY })(GoogleMap);
