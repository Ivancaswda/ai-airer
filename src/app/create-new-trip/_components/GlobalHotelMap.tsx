import {useTripInfo} from "@/app/provider";
import {TripInfo} from "@/app/create-new-trip/_components/chatBox";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";

import Image from "next/image";

const GlobalHotelMap = () => {
    const {tripInfo} = useTripInfo<TripInfo | null>();

    // Проверка на наличие данных
    if (!tripInfo || tripInfo.hotels?.length === 0 || tripInfo.itinerary?.length === 0) {
        return <div>
            <Image width={800} height={500}
                   className="w-full h-[87vh] flex items-center object-cover justify-center rounded-2xl"
                   src='/GlobalImage.png' alt='GlobalImage'/>
        </div>;
    }

    // Центрирование карты по координатам первого отеля
    const center = tripInfo.hotels[0]?.geo_coordinates
        ? [tripInfo.hotels[0].geo_coordinates.latitude, tripInfo.hotels[0].geo_coordinates.longitude]
        : [51.505, -0.09];

    return (
        <div className="w-full h-[400px] rounded-2xl mr-4 ">
            <MapContainer center={center} zoom={12} style={{height: "100%", width: "100%"}}>
                <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                />
                {/* Маркеры для отелей */}
                {tripInfo.hotels?.map((hotel, idx) => hotel.geo_coordinates && (
                    <Marker key={`hotel-${idx}`} position={[
                        hotel.geo_coordinates.latitude,
                        hotel.geo_coordinates.longitude
                    ]}>
                        <Popup>
                            <div className="text-sm">
                                <b>{hotel.hotel_name}</b> <br/>
                                {hotel.hotel_address} <br/>
                                ⭐ {hotel.rating} <br/>
                                💲 {hotel.price_per_night} / ночь
                            </div>
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </div>
    );
};
export default GlobalHotelMap