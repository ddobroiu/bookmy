// /src/components/Map.jsx (NOU)

'use client';

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix pentru iconițele Leaflet care nu se încarcă corect în Next.js/React
const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// Coordonate default (ex: Centrul Bucureștiului)
const DEFAULT_CENTER = [44.4268, 26.1025]; 

const Map = ({ salons }) => {
  return (
    <MapContainer 
        center={DEFAULT_CENTER} 
        zoom={13} 
        style={{ height: "100%", width: "100%", borderRadius: "12px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {salons.map((salon) => (
        // Simulăm coordonate aleatorii în jurul centrului dacă nu au (pentru demo)
        <Marker 
            key={salon.id} 
            position={salon.coords || [
                DEFAULT_CENTER[0] + (Math.random() - 0.5) * 0.05, 
                DEFAULT_CENTER[1] + (Math.random() - 0.5) * 0.05
            ]} 
            icon={icon}
        >
          <Popup>
            <div style={{textAlign: 'center'}}>
                <strong style={{fontSize: '14px', color: '#007bff'}}>{salon.title}</strong><br />
                <span>⭐ {salon.rating}</span><br />
                <a href={`/salon/${salon.id}`} style={{color: '#333', fontWeight: 'bold', textDecoration: 'underline'}}>Vezi detalii</a>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
};

export default Map;