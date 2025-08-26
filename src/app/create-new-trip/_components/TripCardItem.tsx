'use client'
import React, { useEffect, useState } from 'react'
import Image from "next/image";
import { Clock, ExternalLinkIcon, Ticket, Timer } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity } from "@/app/create-new-trip/_components/chatBox";
import axios from "axios";

type Props = {
    activity: Activity
}

const TripCardItem = ({ activity }: Props) => {
    const [photoUrl, setPhotoUrl] = useState<string>( '')

    useEffect(() => {

          activity &&  getPhoto()

    }, [activity])

    const getPhoto = async () => {
        try {
            const result = await axios.get('/api/unsplash-photo', {
                params: { query: activity?.place_name }
            })
            console.log(result)
            if (!result?.data.error ) {
                setPhotoUrl(result.data.results[0].urls.regular)
            }
        } catch (e) {
            console.error("Unsplash fetch error", e)
        }
    }


    return (
        <div>
            <Image
                className="object-cover w-[400px] h-[200px] rounded-xl"
                src={photoUrl || '/placeholder.jpg'}
                width={400}
                height={200}
                alt={activity.place_name}
            />

            <h2 className="font-semibold text-lg">{activity.place_name}</h2>
            <p className="text-gray-500 line-clamp-2">{activity.place_details}</p>

            <h2 className="flex gap-2 text-blue-500 line-clamp-1">
                <Ticket/>{activity.ticket_pricing}
            </h2>

            <p className="flex text-orange-400 gap-2">
                <Clock/>{activity.time_travel_each_location}
            </p>

            <p className="text-orange-400 gap-2 line-clamp-1 flex">
                <Timer/>{activity.best_time_to_visit}
            </p>

            <Link
                target="_blank"
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(activity.place_address || activity.place_name)}`}
            >
                <Button size="sm" variant="outline" className="mt-2 w-full">
                   Посмотреть <ExternalLinkIcon/>
                </Button>
            </Link>
        </div>
    )
}

export default TripCardItem