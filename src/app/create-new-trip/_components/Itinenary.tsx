'use client'
import React, {useEffect, useState} from "react";
import {Timeline} from "@/components/ui/timeline";
import Image from "next/image";
import {ArrowLeft, Clock, ExternalLinkIcon, Star, Ticket, Timer, Wallet} from "lucide-react";
import {Button} from "@/components/ui/button"; import Link from "next/link";
    import HotelCardItem from "@/app/create-new-trip/_components/HotelCardItem";
    import TripCardItem from "@/app/create-new-trip/_components/TripCardItem";
    import {useTripInfo} from "@/app/provider";
    import {TripInfo} from "@/app/create-new-trip/_components/chatBox";

function Itinerary() {
    const {tripInfo, setTripInfo} = useTripInfo<TripInfo | null>();
    const [tripData, setTripData] = useState<TripInfo | null>(null);

    useEffect(() => { tripInfo && setTripData(tripInfo) }, [tripInfo]);

    if (!tripInfo || !tripData) {
        return (
            <div className='relative w-full overflow-clip h-[83vh] overflow-y-auto'>
                <Image alt='travel' width={800} height={500} src='/GlobalPlane.png'
                       className='w-full h-full object-cover rounded-3xl'/>
                <h2 className='absolute bottom-20 left-10 z-20 text-white text-lg md:text-2xl'>
                    Сгенерируй поездку используя наш ИИ-БОТ чтобы увидеть их тут!
                </h2>
            </div>
        )
    }
    console.log(tripInfo)

    const data = [
        {
            title: "Отели",
            content: (
                <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                    {tripData.hotels?.map((hotel, idx) => <HotelCardItem hotel={hotel} key={idx}/>)}
                </div>
            ),
        },
        ...tripData.itinerary?.map(day => ({
            title: `День ${day.day}`,
            content: (
                <div className=' w-full'>
                    <p className='text-3xl pb-4'>Лучшее время: <span className='text-blue-700'>{day.best_time_to_visit_day}</span></p>
                    <div className='flex items-start  gap-4'>
                        {day.activities?.map((activity, idx) => (
                            <TripCardItem activity={activity} key={idx}/>
                        ))}
                    </div>

                </div>
            )
        })) || []
    ];

    return <Timeline tripData={tripData} data={data} />
}
export default Itinerary