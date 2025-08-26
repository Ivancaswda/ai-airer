'use client'
import React, {useEffect, useState} from 'react'
import {useParams} from "next/navigation";
import {useAuth} from "@/context/authContext";
import {api} from "../../../../convex/_generated/api";
import {useConvex} from "convex/react";
import Itinenary from "@/app/create-new-trip/_components/Itinenary";
import {Trip} from "@/app/my-trips/page";
import {useTripInfo} from "@/app/provider";

import GlobalHotelMap from "@/app/create-new-trip/_components/GlobalHotelMap";
import GlobalActiveMap from "@/app/create-new-trip/_components/GlobalActiveMap";

const ViewTrip = () => {

    const {tripid: tripId} = useParams()
    const {user} = useAuth()
    const convex = useConvex()
    const [tripData, setTripData] = useState<Trip>()
    // @ts-ignore
    const {tripInfo, setTripInfo} = useTripInfo()
    useEffect(() => {
        user && GetTrip()
    }, [user])


    const GetTrip = async () => {
        if (!tripId || !user) return;

        const result = await convex.query(api.tripDetail.GetTripById, {
            uid: user.userId,
            tripId: tripId,
        });

        console.log(result);
        if (result) {
            setTripData(result);
            setTripInfo(result.tripDetail);
        }
    };


    return (

        <div className='grid grid-cols-5 '>
            <div className='col-span-3'>
                <Itinenary/>
            </div>

            <div className='col-span-2 mt-38 flex flex-col gap-40'>
                <GlobalHotelMap/>
                <GlobalActiveMap/>
            </div>

        </div>
    )
}
export default ViewTrip
