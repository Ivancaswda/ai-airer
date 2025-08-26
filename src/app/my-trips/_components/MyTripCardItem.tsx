'use client'
import React, { useEffect, useState } from 'react'
import { ArrowBigDownDashIcon } from "lucide-react";
import { Trip } from "@/app/my-trips/page";
import Image from "next/image";
import axios from "axios";
import Link from 'next/link'
import {Button} from "@/components/ui/button";

type Props = {
    item: Trip
}

const MyTripCardItem = ({ item }: Props) => {
    const [photoUrl, setPhotoUrl] = useState<string>()

    useEffect(() => {
        if (item) fetchUnsplashPhoto()
    }, [item])

    const fetchUnsplashPhoto = async () => {
        try {
            const result  = await axios.get('/api/unsplash-photo',{ params: { query: item?.tripDetail?.destination } });

            if (result?.data) {
                setPhotoUrl(result.data.results[0].urls.regular);
            }
        } catch (error) {
            console.error("Error fetching Unsplash photo:", error);
        }
    }

    return (
        <Link href={`/view-trips/${item?.tripId}`} className='p-2'>
            <div className='p-5 shadow rounded-2xl mt-2'>
                <Image
                    className='rounded-xl object-cover mt-2 w-full h-[240px]'
                    src={photoUrl || '/placeholder.jpg'}
                    alt={item?.tripId}
                    width={400}
                    height={400}
                />

                <h2>{item.tripDetail?.destination} <ArrowBigDownDashIcon /></h2>
                <h2 className='mt-2 font-semibold '>
                    {item?.tripDetail?.duration}-дневная поездка с {item?.tripDetail?.budget} бюджетом
                </h2>
                <Button className='w-full cursor-pointer mt-2'>Посмотреть подробности</Button>
            </div>
        </Link>
    )
}

export default MyTripCardItem