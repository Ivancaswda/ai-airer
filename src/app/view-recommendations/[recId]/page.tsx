'use client'
import React, { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useConvex } from "convex/react";
import {api} from "../../../../convex/_generated/api";
import { Timeline } from "@/components/ui/timeline";
import { Loader2Icon } from "lucide-react";
import {MapContainer, Marker, Popup, TileLayer} from "react-leaflet";
import {useAuth} from "@/context/authContext";
import {toast} from "sonner";
import RecommendationTimeline from "@/app/view-recommendations/[recId]/_components/RecomendationTimeline";


interface RecommendationDetail {
    recommended_country: string;
    recommended_location: string;
    reason: string;
    coordinates?: { lat: number; lng: number };
}

const RecommendationDetailPage = () => {
    const { recId } = useParams();
    const convex = useConvex();
    const [recommendation, setRecommendation] = useState<RecommendationDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const {user} = useAuth()
    console.log(user)
    useEffect(() => {


        user && fetchRecommendation();
    }, [user]);
    const fetchRecommendation = async () => {
        setLoading(true);
        try {
            const result = await convex.query(api.savedRecommendations.GetSavedRecommendationById, {
                    uid: user?.userId,
                    recId:recId
                });
            console.log(result)
            if (result) setRecommendation(result);

        } catch (err) {
            toast.error('Failed to get recommendation  plan')
            console.error(err);

        } setLoading(false);
    };


    console.log(recommendation)


    if (!recommendation) {
        return (
            <div className="flex items-center justify-center h-[80vh] text-gray-500">
                Рекомендация не найдена
            </div>
        );
    }

    const timelineData = [
        {
            title: "Рекомендованная страна",
            content: <p>{recommendation.recommended_country}</p>,
        },
        {
            title: "Рекомендуемое место",
            content: <p>{recommendation.recommended_location}</p>,
        },
        {
            title: "Причина выбора",
            content: <p>{recommendation.reason}</p>,
        },
    ];

    return (
        <div className="flex gap-6 p-4 md:flex-row flex-col">

            <div className="md:w-2/2 w-full">
               <RecommendationTimeline recommendation={recommendation} />
            </div>


        </div>
    );
};

export default RecommendationDetailPage;
