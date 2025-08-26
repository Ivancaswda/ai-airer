'use client'
import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { useTripInfo } from "@/app/provider";
import { TripInfo } from "@/app/create-new-trip/_components/chatBox";

// фикс для иконок (иначе будут "синие квадраты")
import "leaflet/dist/leaflet.css";
import Image from "next/image";

const DefaultIcon = L.icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

const GlobalActiveMap = () => {
    const { tripInfo } = useTripInfo<TripInfo | null>();

    const [isFixed, setIsFixed] = useState(false);

    useEffect(() => {
        const handleScroll = () => {

            const mapSection = document.getElementById("map-section");
            if (mapSection) {
                const rect = mapSection.getBoundingClientRect();
                setIsFixed(rect.top <= 0);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    if (!tripInfo || !tripInfo.itinerary) {
        return  <div className='relative w-full overflow-clip h-[83vh] overflow-y-auto'>
            <Image alt='travel' width={800} height={500} src='/GlobalPlane.png'
                   className='w-full h-[87vh] object-cover rounded-3xl'/>

        </div>   }


    const center = (
        tripInfo.hotels?.[0]?.geo_coordinates
            ? [
                tripInfo.hotels[0].geo_coordinates.latitude,
                tripInfo.hotels[0].geo_coordinates.longitude
            ]
            : [51.505, -0.09]
    ) as [number, number];

    return (
        <div
            className={`w-full h-[400px] rounded-2xl overflow-hidden mr-4 `}
            id="map-section"
        >
            <MapContainer center={center} zoom={12} style={{ height: "100%", width: "100%" }}>

                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />

                {tripInfo.itinerary.map((day, dayIdx) =>
                    day.activities?.map((activity, idx) =>
                        activity.geo_coordinates ? (
                            <Marker
                                key={`activity-${dayIdx}-${idx}`}
                                position={[
                                    activity.geo_coordinates.latitude,
                                    activity.geo_coordinates.longitude
                                ]}
                            >
                                <Popup>
                                    <div className="text-sm">
                                        <b>{activity.place_name}</b> <br />
                                        {activity.place_details} <br />
                                    </div>
                                </Popup>
                            </Marker>
                        ) : null
                    )
                )}
            </MapContainer>
        </div>
    );
};

export default GlobalActiveMap;
