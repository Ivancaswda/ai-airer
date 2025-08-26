'use client'
import React, {useState, useEffect} from 'react'
import {Button} from '@/components/ui/button';
import {useAuth} from "@/context/authContext";
import {api} from "../../../convex/_generated/api";
import {useConvex} from "convex/react";
import Link from 'next/link';
import axios from 'axios';
import {toast} from "sonner";
import {Loader, Loader2Icon} from "lucide-react";

export type BestSeasonPlan = {
    seasonId: string,
    weather_plan: any,
    uid: string,
    createdAt?: string
}

const ViewBestSeasons = () => {
    const [myBestSeasons, setMyBestSeasons] = useState<BestSeasonPlan[]>([]);
    const [photos, setPhotos] = useState<Record<string, string>>({});
    const convex = useConvex();
    const {user} = useAuth();
    const [loading, setLoading] = useState<boolean>(false)
    const [photosLoading, setPhotosLoading] = useState<boolean>(false)
    useEffect(() => {
        if(user) GetUserBestSeasons()
    }, [user]);

    const GetUserBestSeasons = async () => {
        try {
            setLoading(true)
            const result = await convex.query(api.bestSeason.GetUserSeasons, { uid: user?.userId });
            setMyBestSeasons(result);
            getPhotos(result);
        } catch (error) {
            toast.error(error.message)
        }
        setLoading(false)
    }

    const getPhotos = async (seasons: BestSeasonPlan[]) => {
        setPhotosLoading(true)
        const newPhotos: Record<string, string> = {};
        for (const s of seasons) {
            try {
                const res = await axios.get('/api/unsplash-photo', { params: { query: s.weather_plan.destination } });
                if (res.data.results.length > 0) {
                    newPhotos[s.seasonId] = res.data.results[0].urls.regular;
                }
            } catch(e) { console.error(e) }
        }
        setPhotos(newPhotos);
        setPhotosLoading(false)
    }

    if (loading) {
        return <div className='flex items-center justify-center w-full h-full'>
            <Loader2Icon className='animate-spin text-blue-700'/>
        </div>
    }

    return (
        <div className='px-10 py-10 md:px-24 lg:px-48 flex flex-col justify-center items-center gap-5'>
            {myBestSeasons?.length === 0 && (
                <div className='text-center'>
                    <h2 className='text-lg mb-4'>You don’t have any best season plan yet!</h2>
                    <Button>
                        <Link href='/create-best-period'>Create a new plan</Link>
                    </Button>
                </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 w-full'>
                {myBestSeasons.map((item) => {
                    const d = item.weather_plan;
                    return (
                        <div
                            key={item.seasonId}
                            className="border rounded-xl shadow-md p-4 flex flex-col justify-between bg-white"
                        >
                            {photos[item.seasonId] && (
                                <img src={photos[item.seasonId]} alt={d.destination} className="w-full h-40 object-cover rounded-lg mb-2" />
                            )}
                            {photosLoading && <div className='w-full flex items-center justify-center'>
                                <Loader2Icon className='animate-spin text-blue-700'/>
                            </div>}
                            <h3 className="text-lg font-semibold text-blue-600 mb-2">{d.destination}</h3>
                            <p><strong className='text-blue-700'>Month:</strong> {d.month}</p>
                            <Button className='w-full mt-2' variant="outline" asChild>
                                <Link href={`/view-best-seasons/${item.seasonId}`}>
                                    Смотреть детально
                                </Link>
                            </Button>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default ViewBestSeasons;
