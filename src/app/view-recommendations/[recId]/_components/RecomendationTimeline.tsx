'use client'
import React, { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface RecommendationDetail {
    recommended_country: string;
    recommended_location: string;
    reason: string;
    coordinates?: { lat: number; lng: number };
}

const RecommendationTimeline = ({ recommendation }: { recommendation: RecommendationDetail }) => {
    const [flagUrl, setFlagUrl] = useState<string | null>(null);

    useEffect(() => {
        if (!recommendation?.recommended_country) return;
        const fetchFlag = async () => {
            try {
                const res = await fetch(
                    `/api/unsplash-photo?query=flag of ${encodeURIComponent(recommendation.recommended_country)}`
                );
                const data = await res.json();
                if (data.results && data.results[0]?.urls?.regular) {
                    setFlagUrl(data.results[0].urls.regular);
                } else {
                    setFlagUrl(`https://source.unsplash.com/1200x800/?${encodeURIComponent(recommendation.recommended_country)} flag`);
                }
            } catch {
                setFlagUrl(`https://source.unsplash.com/1200x800/?${encodeURIComponent(recommendation.recommended_country)} flag`);
            }
        };
        fetchFlag();
    }, [recommendation]);

    if (!recommendation) return null;

    return (
        <div className="h-[85vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg">
            <div className="space-y-8">
                {/* Блок со страной */}
                <div className="relative rounded-xl overflow-hidden shadow-md border">
                    {flagUrl ? (
                        <img
                            src={flagUrl}
                            alt={recommendation.recommended_country}
                            className="w-full h-[250px] object-cover"
                        />
                    ) : (
                        <div className="flex items-center justify-center h-[250px] bg-gray-100">
                            <Loader2 className="animate-spin text-gray-400 w-8 h-8" />
                        </div>
                    )}
                    <div className="absolute bottom-0 left-0 w-full bg-black/50 p-4">
                        <h2 className="text-white text-xl font-bold">
                            {recommendation.recommended_country}
                        </h2>
                    </div>
                </div>

                {/* Блок с локацией */}
                <div className="p-6 border rounded-xl bg-gray-50 shadow-sm">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">📍 Рекомендуемое место</h3>
                    <p className="text-gray-800 text-lg">{recommendation.recommended_location}</p>
                </div>

                {/* Блок с причиной */}
                <div className="p-6 border rounded-xl bg-gray-50 shadow-sm">
                    <h3 className="text-lg font-semibold text-green-700 mb-2">💡 Причина выбора</h3>
                    <p className="text-gray-700">{recommendation.reason}</p>
                </div>

                {/* Опционально: координаты */}
                {recommendation.coordinates && (
                    <div className="p-6 border rounded-xl bg-gray-50 shadow-sm">
                        <h3 className="text-lg font-semibold text-purple-700 mb-2">🌍 Координаты</h3>
                        <p className="text-gray-700">
                            {recommendation.coordinates.lat}, {recommendation.coordinates.lng}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default RecommendationTimeline;
