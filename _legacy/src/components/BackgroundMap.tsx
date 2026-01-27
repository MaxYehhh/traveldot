'use client';

import React from 'react';
import { GoogleMap, useJsApiLoader } from '@react-google-maps/api';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const center = {
    lat: 25.0330, // Taipei
    lng: 121.5654
};

const libraries: ("places")[] = ["places"];

// Light Gray Map Style for background
const lightGrayMapStyle: google.maps.MapTypeStyle[] = [
    {
        "featureType": "all",
        "elementType": "geometry",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.fill",
        "stylers": [{ "color": "#616161" }]
    },
    {
        "featureType": "all",
        "elementType": "labels.text.stroke",
        "stylers": [{ "color": "#f5f5f5" }]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "poi",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "road",
        "elementType": "geometry",
        "stylers": [{ "color": "#ffffff" }]
    },
    {
        "featureType": "road",
        "elementType": "labels.icon",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "transit",
        "stylers": [{ "visibility": "off" }]
    },
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [{ "color": "#e9e9e9" }]
    }
];

export function BackgroundMap() {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries
    });

    if (!isLoaded) {
        return (
            <div className="w-full h-full bg-gray-100 flex items-center justify-center">
                <div className="text-gray-400">Loading map...</div>
            </div>
        );
    }

    return (
        <GoogleMap
            mapContainerStyle={containerStyle}
            center={center}
            zoom={12}
            options={{
                styles: lightGrayMapStyle,
                disableDefaultUI: true,
                gestureHandling: 'none', // Disable all interactions
                zoomControl: false,
                scrollwheel: false,
                disableDoubleClickZoom: true,
                draggable: false,
            }}
        />
    );
}
