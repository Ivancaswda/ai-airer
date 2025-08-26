'use client'
import React, {useEffect, useState} from 'react'
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {api} from "../../../convex/_generated/api";
import {useConvex} from "convex/react";
import {useAuth} from "@/context/authContext";
import {toast} from "sonner";
import {Loader2Icon} from "lucide-react";
import {Button} from "@/components/ui/button";
import Image from "next/image";
import {format} from "date-fns";
import {ru} from "date-fns/locale";
import axios from "axios";
import {useRouter} from "next/navigation";

const ViewRecommendations = () => {
    const [recommendations, setRecommendations] = useState<any[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const {user} = useAuth()
    const convex = useConvex();
    const router = useRouter()
    useEffect(() => {
        if (user) GetUserRecommendations();
    }, [user]);

    // Функция для получения URL флага через Unsplash
    const getFlagUrl = async (country: string) => {
        try {
            const result = await axios.get('/api/unsplash-photo', {
                params: { query: `${country} flag` } // запрос на флаг страны
            });
            if (!result?.data.error && result.data.results?.length > 0) {
                return result.data.results[0].urls.regular;
            }
        } catch (error) {
            console.error("Unsplash fetch error", error);
        }
        return null;
    }

    const GetUserRecommendations = async () => {
        try {
            setLoading(true)
            const result = await convex.query(api.savedRecommendations.GetSavedRecommendations, { uid: user?.userId });

            // Для каждого результата получаем флаг
            const resultsWithFlags = await Promise.all(result.map(async (rec: any) => {
                const flagUrl = await getFlagUrl(rec.resp.recommended_country);
                return {...rec, flagUrl};
            }));

            setRecommendations(resultsWithFlags);
        } catch (error) {
            console.log(error)
            toast.error('Не удалось получить рекомендации')
        }
        setLoading(false)
    }

    return (
        <div className="flex flex-col gap-6 p-4">
            <h2 className="text-2xl font-semibold text-blue-600">Ваши Рекомендации</h2>

            {loading ? (
                <div className="flex justify-center items-center h-full w-full">
                    <Loader2Icon className='animate-spin text-blue-700 '/>
                </div>
            ) : (
                <div className="space-y-4 flex items-center flex-wrap gap-4">
                    {!recommendations || recommendations.length === 0 ? (
                        <div className="text-center text-gray-500">Нет рекомендаций для отображения</div>
                    ) : (
                        recommendations.map((rec, index) => (
                            <div key={index} className="flex items-start hover:scale-105 transition cursor-pointer flex-col w-[300px] gap-4 p-4  border rounded-lg shadow-sm">
                                {rec.flagUrl ? (
                                    <Image src={rec.flagUrl} width={400} height={100} className='w-full rounded-lg h-[200px] object-cover' alt='flag' />
                                ) : (
                                    <Avatar>
                                        <AvatarFallback className='bg-blue-700 text-white'>AI</AvatarFallback>
                                    </Avatar>
                                )}




                                <div className="flex-1 text-start">
                                    <h3 className="text-lg font-semibold text-gray-900">{rec.resp.recommended_country}</h3>
                                    <p className='text-sm font-medium text-gray-500'>
                                        {format(new Date(rec.createdAt), 'dd.MM.yyyy HH:mm', {locale: ru})}
                                    </p>
                                </div>

                                <Button onClick={() => router.push(`/view-recommendations/${rec.recId}`)} className="self-center w-full">Подробнее</Button>
                            </div>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}

export default ViewRecommendations
