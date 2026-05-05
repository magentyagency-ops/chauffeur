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
  html: `<div style="background-color: white; width: 24px; height: 24px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 0 15px rgba(255,255,255,0.6); position: relative;">
           <div style="background-color: black; width: 8px; height: 8px; border-radius: 50%; z-index: 2;"></div>
           <div style="position: absolute; inset: -4px; border-radius: 50%; background-color: white; opacity: 0.3; animation: pulse 2s infinite;"></div>
         </div>
         <style>
           @keyframes pulse {
             0% { transform: scale(1); opacity: 0.5; }
             100% { transform: scale(2.5); opacity: 0; }
           }
         </style>`,
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
  const [currentPos, setCurrentPos] = useState<[number, number] | null>(null);

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
          setCurrentPos(coordinates[0]); // Start position
        }
      } catch (err) {
        console.error("OSRM error:", err);
      }
    }
    getRoute();
  }, [pickupCoords, dropoffCoords]);

  // 3. Smooth 60fps Animation along the route
  useEffect(() => {
    if (route.length < 2) return;
    
    let totalDistance = 0;
    const distances: number[] = [];
    
    // Pre-calculate segments to normalize speed
    for (let i = 0; i < route.length - 1; i++) {
      const p1 = route[i];
      const p2 = route[i+1];
      // Pythagoras for simple local distance estimation
      const d = Math.sqrt(Math.pow(p2[0]-p1[0], 2) + Math.pow(p2[1]-p1[1], 2));
      distances.push(d);
      totalDistance += d;
    }

    let startTime: number | null = null;
    // Dynamic duration based on distance, clamped between 10s and 30s
    const dynamicDuration = Math.max(10000, Math.min(30000, totalDistance * 100000));
    let animationFrameId: number;

    const animate = (time: number) => {
      if (!startTime) startTime = time;
      const elapsed = time - startTime;
      
      // The progress resets to 0 when reaching 1, creating a loop
      const progress = (elapsed % dynamicDuration) / dynamicDuration; 
      const targetDistance = progress * totalDistance;

      let currentDist = 0;
      for (let i = 0; i < route.length - 1; i++) {
        const d = distances[i];
        if (currentDist + d >= targetDistance) {
          // We are in this segment, interpolate precisely
          const segmentProgress = d === 0 ? 0 : (targetDistance - currentDist) / d;
          const p1 = route[i];
          const p2 = route[i+1];
          const lat = p1[0] + (p2[0] - p1[0]) * segmentProgress;
          const lng = p1[1] + (p2[1] - p1[1]) * segmentProgress;
          
          setCurrentPos([lat, lng]);
          break;
        }
        currentDist += d;
      }
      
      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrameId);
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
            <Marker position={currentPos || route[0]} icon={carIcon} />
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
