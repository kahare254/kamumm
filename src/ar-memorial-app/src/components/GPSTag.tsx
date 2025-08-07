import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

const GPSTag: React.FC = () => {
    const [position, setPosition] = useState<[number, number] | null>(null);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                setPosition([position.coords.latitude, position.coords.longitude]);
            });
        }
    }, []);

    return (
        <div className="h-full w-full">
            {position ? (
                <MapContainer center={position} zoom={13} className="h-full w-full">
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    <Marker position={position}>
                        <Popup>
                            You are here: {position[0]}, {position[1]}
                        </Popup>
                    </Marker>
                </MapContainer>
            ) : (
                <div>Loading...</div>
            )}
        </div>
    );
};

export default GPSTag;