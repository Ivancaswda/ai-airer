'use client'
import React, {useEffect, useState} from 'react';
import {useParams} from 'next/navigation';
import {api} from "../../../../convex/_generated/api";
import {useConvex} from "convex/react";
import axios from 'axios';
import {Loader2Icon, TriangleAlert} from "lucide-react";
import {useAuth} from "@/context/authContext";
import {toast} from "sonner";

const ViewBestSeasonDetail = () => {
    const params = useParams();
    const seasonId = params.seasonId;
    const convex = useConvex();
    const [season, setSeason] = useState<any>();
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false)
    const {user} = useAuth()
    useEffect(() => {
        user && fetchSeason();
    }, [user]);

    const fetchSeason = async () => {
       try {
            setLoading(true)
            const result  = await convex.query(api.bestSeason.GetSeasonById, { seasonId, uid: user?.userId });
            setSeason(result);
            getPhoto(result.weather_plan.destination);
       } catch (error) {
        toast.error('Failed to get a plan')
           console.log(error)
       }
       setLoading(false)
    }

    const getPhoto = async (destination: string) => {
        try {
            const res = await axios.get('/api/unsplash-photo', { params: { query: destination } });
            if (res.data.results.length > 0) {
                setPhotoUrl(res.data.results[0].urls.regular);
            }
        } catch(e) { console.error(e) }
    }

    if (loading) {
        return <div className='flex items-center justify-center w-full h-full'>
            <Loader2Icon className='animate-spin text-blue-700'/>
        </div>
    }

    if(!season) return <div className='flex items-center justify-center w-full flex-col h-full'>
        <TriangleAlert/>
        <h2 className='text-2xl text-center font-semibold '>Не удалось найти данные!</h2>
    </div>;

    const w = season.weather_plan;

    return (
        <div className='px-10 py-10 md:px-24 lg:px-48 flex flex-col justify-center items-center gap-5'>
            {photoUrl && <img src={photoUrl} alt={w.destination} className="w-full h-64 object-cover rounded-lg shadow-md mb-4" />}
            <h2 className="text-2xl font-bold mb-2 ">{w.destination} — <span className=''>{w.month}</span> </h2>
            <p><strong className='text-blue-700'>Trip Type:</strong> {w.trip_type}</p>
            <p><strong className='text-blue-700'>Weather Preference:</strong> {w.weather_preference}</p>
            <div className="p-3 bg-blue-50 rounded-lg space-y-1">
                <p className="font-semibold text-blue-600">Expected Weather:</p>
                <p>Average Temperature: <strong>{w.expected_weather.avg_temp_c}°C</strong></p>
                <p>Humidity: <strong>{w.expected_weather.humidity_percent}%</strong></p>
                <p>Rainy Days: <strong>{w.expected_weather.rain_days}</strong></p>
                <p><strong>Recommendation:</strong> {w.recommendation}</p>
            </div>

            <div className="p-3 bg-green-50 rounded-lg space-y-1">
                <p className="font-semibold text-green-600">Activity Suggestions:</p>
                <p>{w.activity_suggestion}</p>
            </div>

            <div className="p-3 bg-yellow-50 rounded-lg space-y-1">
                <p className="font-semibold text-yellow-600">Clothing Advice:</p>
                <p>{w.clothing_advice}</p>
            </div>
        </div>
    )
}

export default ViewBestSeasonDetail;
