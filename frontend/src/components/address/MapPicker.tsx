"use client";

import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";

const center = { lat: 28.6139, lng: 77.209 };

export default function MapPicker({
  value,
  onChange,
}: {
  value: { lat: number; lng: number } | null;
  onChange: (loc: { lat: number; lng: number }) => void;
}) {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_KEY!,
  });

  if (!isLoaded) return <p>Loading map…</p>;

  return (
    <div className="rounded-2xl overflow-hidden border border-white/10">
      <GoogleMap
        zoom={15}
        center={value || center}
        mapContainerStyle={{ width: "100%", height: "240px" }}
        onClick={(e) =>
          onChange({
            lat: e.latLng!.lat(),
            lng: e.latLng!.lng(),
          })
        }
      >
        {value && <Marker position={value} />}
      </GoogleMap>
    </div>
  );
}
