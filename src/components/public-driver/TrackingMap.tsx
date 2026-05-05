"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Polyline, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon issue in Next.js
import "leaflet-defaulticon-compatibility";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";

// --- CUSTOM ICONS ---
const pickupIcon = new L.DivIcon({
  html: `<div style="background-color: black; width: 16px; height: 16px; border-radius: 50%; border: 3px solid white; box-shadow: 0 0 10px rgba(0,0,0,0.5);"></div>`,
  className: "",
  iconSize: [16, 16],
  iconAnchor: [8, 8],
});

const carIcon = new L.DivIcon({
  html: `<div style="background-color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(255,255,255,0.6);">
           <div style="background-color: black; width: 8px; height: 8px; border-radius: 50%;"></div>
         </div>`,
  className: "",
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

interface TrackingMapProps {
  pickupAddress: string;
  dropoffAddress: string;
}

// Component to auto-fit map to route bounds
function MapBounds({ route }: { route: [number, number][] }) {
  const map = useMap();
  useEffect(() => {
    if (route.length > 0) {
      const bounds = L.latLngBounds(route);
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
    }
  }, [route, map]);
  return null;
}

export default function TrackingMap({ pickupAddress, dropoffAddress }: TrackingMapProps) {
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [dropoffCoords, setDropoffCoords] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [currentPosIndex, setCurrentPosIndex] = useState(0);

  // Helper function to geocode an address
  const geocodeAddress = async (address: string): Promise<[number, number]> => {
    let res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}&limit=1`);
    let data = await res.json();
    
    // Retry with ", France" if not found
    if (!data || data.length === 0) {
      res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address + ", France")}&limit=1`);
      data = await res.json();
    }

    if (data && data.length > 0) {
      return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
    }
    throw new Error(`Address not found: ${address}`);
  };

  // 1. Geocode BOTH pickup and dropoff
  useEffect(() => {
    async function geocodeBoth() {
      try {
        const pCoords = await geocodeAddress(pickupAddress);
        setPickupCoords(pCoords);

        if (dropoffAddress) {
          const dCoords = await geocodeAddress(dropoffAddress);
          setDropoffCoords(dCoords);
        } else {
          // If no dropoff, mock one 2km away for demo purposes
          setDropoffCoords([pCoords[0] + 0.02, pCoords[1] + 0.02]);
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        // Fallback to Paris center -> Charles de Gaulle if all fails
        setPickupCoords([48.8566, 2.3522]);
        setDropoffCoords([49.0097, 2.5479]);
      }
    }
    if (pickupAddress) {
      geocodeBoth();
    }
  }, [pickupAddress, dropoffAddress]);

  // 2. Fetch OSRM route between pickup and dropoff
  useEffect(() => {
    if (!pickupCoords || !dropoffCoords) return;
    
    async function getRoute() {
      try {
        // OSRM format is lng,lat
        const url = `https://router.project-osrm.org/route/v1/driving/${pickupCoords![1]},${pickupCoords![0]};${dropoffCoords![1]},${dropoffCoords![0]}?geometries=geojson`;
        const res = await fetch(url);
        const data = await res.json();
        
        if (data && data.routes && data.routes.length > 0) {
          // GeoJSON coordinates are [lng, lat], react-leaflet wants [lat, lng]
          const coordinates = data.routes[0].geometry.coordinates.map((coord: number[]) => [coord[1], coord[0]]);
          setRoute(coordinates);
        }
      } catch (err) {
        console.error("OSRM error:", err);
      }
    }
    getRoute();
  }, [pickupCoords, dropoffCoords]);

  // 3. Animate car along the route
  useEffect(() => {
    if (route.length === 0) return;
    
    const interval = setInterval(() => {
      setCurrentPosIndex((prev) => {
        if (prev >= route.length - 1) {
          clearInterval(interval);
          return prev;
        }
        return prev + 1;
      });
    }, 1000); // 1 point per second
    
    return () => clearInterval(interval);
  }, [route]);

  if (!pickupCoords || !dropoffCoords) {
    return (
      <div className="w-full h-full bg-[#111] animate-pulse flex items-center justify-center">
        <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">Calcul de l'itinéraire...</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={pickupCoords} 
        zoom={13} 
        style={{ width: "100%", height: "100%", background: "#0a0a0a" }}
        zoomControl={false}
        attributionControl={false}
      >
        <TileLayer
          url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
        />
        
        {route.length > 0 && (
          <>
            {/* Route Line */}
            <Polyline positions={route} color="#ffffff" weight={4} opacity={0.5} />
            
            <MapBounds route={route} />
            
            {/* Animated Car Marker */}
            <Marker position={route[currentPosIndex]} icon={carIcon} />
          </>
        )}

        {/* Pickup Location Marker */}
        <Marker position={pickupCoords} icon={pickupIcon} />
        
        {/* Dropoff Location Marker (Red dot to distinguish) */}
        <Marker position={dropoffCoords} icon={new L.DivIcon({
          html: `<div style="background-color: white; width: 16px; height: 16px; border-radius: 50%; border: 3px solid #ff3333; box-shadow: 0 0 10px rgba(255,51,51,0.5);"></div>`,
          className: "", iconSize: [16, 16], iconAnchor: [8, 8]
        })} />
      </MapContainer>
      
      {/* Vignette effect overlay */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/40 z-[400]" />
    </div>
  );
}
