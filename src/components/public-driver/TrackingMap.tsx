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

export default function TrackingMap({ pickupAddress }: TrackingMapProps) {
  const [pickupCoords, setPickupCoords] = useState<[number, number] | null>(null);
  const [driverCoords, setDriverCoords] = useState<[number, number] | null>(null);
  const [route, setRoute] = useState<[number, number][]>([]);
  const [currentPosIndex, setCurrentPosIndex] = useState(0);

  // 1. Geocode the pickup address
  useEffect(() => {
    async function geocode() {
      try {
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(pickupAddress)}`);
        const data = await res.json();
        if (data && data.length > 0) {
          const lat = parseFloat(data[0].lat);
          const lon = parseFloat(data[0].lon);
          setPickupCoords([lat, lon]);
          
          // Mock driver location (about 1-2km away diagonally)
          setDriverCoords([lat - 0.015, lon - 0.015]);
        } else {
          throw new Error("Address not found");
        }
      } catch (err) {
        console.error("Geocoding error:", err);
        // Fallback to Paris center if geocoding fails completely
        setPickupCoords([48.8566, 2.3522]);
        setDriverCoords([48.8466, 2.3422]);
      }
    }
    if (pickupAddress) {
      geocode();
    }
  }, [pickupAddress]);

  // 2. Fetch OSRM route between driver and pickup
  useEffect(() => {
    if (!pickupCoords || !driverCoords) return;
    
    async function getRoute() {
      try {
        // OSRM format is lng,lat
        const url = `https://router.project-osrm.org/route/v1/driving/${driverCoords![1]},${driverCoords![0]};${pickupCoords![1]},${pickupCoords![0]}?geometries=geojson`;
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
  }, [pickupCoords, driverCoords]);

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

  if (!pickupCoords) {
    return (
      <div className="w-full h-full bg-[#111] animate-pulse flex items-center justify-center">
        <p className="text-gray-500 font-bold tracking-widest uppercase text-sm">Chargement du GPS...</p>
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
      </MapContainer>
      
      {/* Vignette effect overlay to blend map edges into darkness for a premium look */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-black via-transparent to-black/40 z-[400]" />
    </div>
  );
}
