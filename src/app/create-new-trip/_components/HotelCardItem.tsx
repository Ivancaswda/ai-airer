'use client'
import React, {useEffect, useState} from 'react'
import Image from "next/image";
import {ExternalLinkIcon, Star, Wallet} from "lucide-react";
import Link from "next/link";
import {Button} from "@/components/ui/button";
import {Hotel} from "@/app/create-new-trip/_components/chatBox";
import axios from 'axios'
type Props = {
    hotel: Hotel
}

const HotelCardItem = ({hotel}: Props) => {

    const [photoUrl, setPhotoUrl] = useState<string>()

    useEffect(() => {
        hotel && getPhoto()
    }, [hotel])

    const getPhoto = async () => {
        const result = await axios.get('/api/unsplash-photo', {
            params: { query: hotel?.hotel_name }
        });

        if (!result?.data.error && result.data.results?.length > 0) {
            setPhotoUrl(result.data.results[0].urls.small);
        }
    };
    return (
        <div >
            <Image className='rounded-xl w-[400px] h-[200px] shadow object-cover mb-2' src={photoUrl ? photoUrl : '/placeholder.png'} alt='place-image'
                   width={400} height={200}/>
            <h2 className='font-semibold text-lg '>{hotel?.hotel_name}</h2>
            <h2 className='text-gray-500'>{hotel.hotel_address}</h2>
            <div className='flex justify-between items-center py-2'>
                <p className='flex gap-2 text-sm items-center text-green-600'>
                    <Wallet/>
                    {hotel.price_per_night}</p>
                <p className='text-yellow-500 text-sm flex items-center gap-2'><Star/>
                    {hotel.rating}
                </p>
            </div>
            <Link target='_blank' href={`https://www.google.com/maps/search/?api=1&query=%27${hotel.hotel_name}`}>
                <Button size='sm' variant='outline' className='mt-2 w-full'>Посмотреть
                    <ExternalLinkIcon/>
                </Button>
            </Link>
            <p className='line-clamp-2 text-gray-500'>
                {hotel?.description}
            </p>
        </div>
    )
}
export default HotelCardItem
