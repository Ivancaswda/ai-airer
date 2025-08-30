'use client'
import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {useAuth} from "@/context/authContext";
import {TripInfo} from "@/app/create-new-trip/_components/chatBox";
import MyTripCardItem from "@/app/my-trips/_components/MyTripCardItem";
import {api} from "../../../convex/_generated/api";
import {useConvex} from "convex/react";
import Link from 'next/link';
import {FaMagic} from "react-icons/fa";

export type Trip = {
    tripId: string,
    tripDetail: TripInfo,
    uid: string
}

const Page = () => {
    const [myTrips, setMyTrips] = useState<Trip[]>([]);
    const convex = useConvex();
    const {user} = useAuth();

    useEffect(() => {
        if(user) GetUserTrips();
    }, [user]);
    console.log(myTrips)

    const GetUserTrips = async () => {
        const result = await convex.query(api.tripDetail.GetUserTrips, { uid: user?.userId });
        setMyTrips(result);
    }

    return (
        <div className='px-10 py-10 md:px-24 lg:px-48 flex flex-col justify-center items-center gap-5'>
            {myTrips?.length === 0 && (
                <div className='text-center'>
                    <h2 className='text-lg mb-4'>У вас еще нет сгенерированных поездок!</h2>
                    <Button>
                        <FaMagic/>
                        <Link href='/create-new-trip'>
                            Создать новую поездку</Link>
                    </Button>
                </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 w-full'>
                {myTrips.map((item) => (
                    <MyTripCardItem key={item.tripId} item={item} />
                ))}
            </div>
        </div>
    )
}

export default Page;
