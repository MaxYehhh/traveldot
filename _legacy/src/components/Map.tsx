'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, Autocomplete } from '@react-google-maps/api';
import { Dot } from '@/types/database';
import { Search, Moon, Sun } from 'lucide-react';

const containerStyle = {
    width: '100%',
    height: '100vh'
};

const center = {
    lat: 43.06417, // Sapporo, Hokkaido as default
    lng: 141.34694
};

// Libraries must be a static constant to avoid re-renders
const libraries: ("places")[] = ["places"];

const darkMapStyle = [
    { elementType: "geometry", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.stroke", stylers: [{ color: "#242f3e" }] },
    { elementType: "labels.text.fill", stylers: [{ color: "#746855" }] },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [{ color: "#263c3f" }],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [{ color: "#6b9a76" }],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [{ color: "#38414e" }],
    },
    {
        featureType: "road",
        elementType: "geometry.stroke",
        stylers: [{ color: "#212a37" }],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#9ca5b3" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#746855" }],
    },
    {
        featureType: "road.highway",
        elementType: "geometry.stroke",
        stylers: [{ color: "#1f2835" }],
    },
    {
        featureType: "road.highway",
        elementType: "labels.text.fill",
        stylers: [{ color: "#f3d19c" }],
    },
    {
        featureType: "transit",
        elementType: "geometry",
        stylers: [{ color: "#2f3948" }],
    },
    {
        featureType: "transit.station",
        elementType: "labels.text.fill",
        stylers: [{ color: "#d59563" }],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#17263c" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [{ color: "#515c6d" }],
    },
    {
        featureType: "water",
        elementType: "labels.text.stroke",
        stylers: [{ color: "#17263c" }],
    },
];

const lightMapStyle: google.maps.MapTypeStyle[] = []; // Default Google Maps style

interface MapProps {
    dots: Dot[];
    selectedDotId?: string | null;
    onMapClick: (lat: number, lng: number) => void;
    onDotClick: (dot: Dot) => void;
    theme: 'light' | 'dark';
    onThemeToggle: () => void;
}

export function Map({ dots, selectedDotId, onMapClick, onDotClick, theme, onThemeToggle }: MapProps) {
    const { isLoaded } = useJsApiLoader({
        id: 'google-map-script',
        googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || '',
        libraries
    });

    const [map, setMap] = useState<google.maps.Map | null>(null);
    const [autocomplete, setAutocomplete] = useState<google.maps.places.Autocomplete | null>(null);
    const [searchedLocation, setSearchedLocation] = useState<{ lat: number, lng: number } | null>(null);

    const onLoad = useCallback(function callback(map: google.maps.Map) {
        setMap(map);
    }, []);

    const onUnmount = useCallback(function callback(map: google.maps.Map) {
        setMap(null);
    }, []);

    const onPlaceChanged = () => {
        if (autocomplete !== null) {
            const place = autocomplete.getPlace();
            if (place.geometry && place.geometry.location && map) {
                const newLocation = {
                    lat: place.geometry.location.lat(),
                    lng: place.geometry.location.lng()
                };
                map.panTo(newLocation);
                map.setZoom(15);
                setSearchedLocation(newLocation);
            } else {
                console.log('Autocomplete is not loaded correctly onPlaceChanged');
            }
        } else {
            console.log('Autocomplete is not loaded yet!');
        }
    };

    const handleClick = (e: google.maps.MapMouseEvent) => {
        if (e.latLng) {
            onMapClick(e.latLng.lat(), e.latLng.lng());
            // Clear searched location when user intends to create a new dot
            setSearchedLocation(null);
        }
    };

    if (!isLoaded) {
        return (
            <div className="w-full h-full bg-[#0a0a0c] flex items-center justify-center">
                <div className="text-indigo-400 animate-pulse">地圖載入中...</div>
            </div>
        );
    }

    return (
        <div className="relative w-full h-full">
            <GoogleMap
                mapContainerStyle={containerStyle}
                center={center}
                zoom={8}
                onLoad={onLoad}
                onUnmount={onUnmount}
                onClick={handleClick}
                options={{
                    styles: theme === 'dark' ? darkMapStyle : lightMapStyle,
                    disableDefaultUI: true,
                    zoomControl: true,
                    disableDoubleClickZoom: true,
                }}
            >
                {/* User's Travel Dots */}
                {dots.map((dot) => (
                    <Marker
                        key={dot.id}
                        position={{ lat: dot.latitude, lng: dot.longitude }}
                        onClick={() => onDotClick(dot)}
                        animation={selectedDotId === dot.id ? google.maps.Animation.BOUNCE : undefined}
                        icon={{
                            path: google.maps.SymbolPath.CIRCLE,
                            fillColor: dot.is_public ? "#6366f1" : "#10b981",
                            fillOpacity: 1,
                            strokeWeight: 2,
                            strokeColor: "#ffffff",
                            scale: 8,
                        }}
                    />
                ))}

                {/* Searched Location Marker */}
                {searchedLocation && (
                    <Marker
                        position={searchedLocation}
                        animation={google.maps.Animation.DROP}
                        icon={{
                            url: "http://maps.google.com/mapfiles/ms/icons/red-dot.png"
                        }}
                    />
                )}
            </GoogleMap>

            {/* Feature Controls (Search & Theme) - Positioned over the map */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full max-w-md px-4 pointer-events-none">
                <div className="relative w-full pointer-events-auto flex items-center gap-3">
                    <div className="flex-1 relative">
                        <div className={`absolute left-4 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-slate-400' : 'text-slate-500'}`}>
                            <Search size={18} />
                        </div>
                        <Autocomplete
                            onLoad={setAutocomplete}
                            onPlaceChanged={onPlaceChanged}
                            className="w-full"
                        >
                            <input
                                type="text"
                                placeholder="搜尋地點..."
                                className={`w-full py-3 pl-12 pr-4 rounded-xl shadow-lg border outline-none transition-all ${theme === 'dark'
                                    ? 'bg-[#1a1c23]/90 border-white/10 text-white placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/50'
                                    : 'bg-white/90 border-slate-200 text-slate-800 placeholder-slate-400 focus:ring-2 focus:ring-indigo-500/30'
                                    }`}
                            />
                        </Autocomplete>
                    </div>

                    <button
                        onClick={onThemeToggle}
                        className={`p-3 rounded-xl shadow-lg border transition-all ${theme === 'dark'
                            ? 'bg-[#1a1c23]/90 border-white/10 text-amber-500 hover:bg-white/5'
                            : 'bg-white/90 border-slate-200 text-indigo-400 hover:bg-slate-50'
                            }`}
                        title={theme === 'dark' ? "切換至淺色模式" : "切換至深色模式"}
                    >
                        {/* If Dark, show Sun (to go Light). If Light, show Moon (to go Dark). */}
                        {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                    </button>
                </div>
            </div>
        </div>
    );
}
