'use client'
import React, { useEffect, useState } from "react";
import { Timeline } from "@/components/ui/timeline";

interface Recommendation {
    category: string;
    estimated_cost: number;
    recommendation: string;
}

interface TripRecommendation {
    budget_level: string;
    currency: string;
    destination: string;
    origin: string;
    trip_duration: string;
    total_budget: number;
    final_estimation: {
        suggested_adjustments: string;
        total_cost_estimate: number;
    };
    recommendations: Recommendation[];
}

const BudgetTimeline = ({ recommendation }: { recommendation: TripRecommendation }) => {
    const [images, setImages] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        const fetchImages = async () => {
            const newImages: { [key: string]: string } = {};
            for (const r of recommendation.recommendations) {
                try {

                    console.log(encodeURIComponent(r.category))
                    const res = await fetch(`/api/unsplash-photo?query=${encodeURIComponent(r.category)}`);

                    const data = await res.json();
                    if (data.results && data.results[0]?.urls?.regular) {
                        newImages[r.category] = data.results[0].urls.regular;
                    } else {
                        newImages[r.category] = "https://source.unsplash.com/800x400/?" + encodeURIComponent(r.category);
                    }
                } catch (e) {
                    newImages[r.category] = "https://source.unsplash.com/800x400/?" + encodeURIComponent(r.category);
                }
            }
            setImages(newImages);
        };

        fetchImages();
    }, [recommendation]);

    if (!recommendation) return null;

    const data = [
        {
            title: "Общая информация",
            content: (
                <div className="space-y-2">
                    <p>
                        <strong>Маршрут:</strong> <span className='text-red-800 font-semibold text-xl'> {recommendation.origin}</span> →  <span className='text-green-800 font-semibold text-xl'>{recommendation.destination}</span>
                    </p>
                    <p>
                        <strong>Длительность:</strong> <span className='text-blue-800 font-semibold text-xl'>{recommendation.trip_duration}</span>
                    </p>
                    <p>
                        <strong>Бюджет:</strong> <span className='text-blue-800 font-semibold text-xl'>{recommendation.budget_level} ({recommendation.currency})</span>
                    </p>
                    <p>
                        <strong>Общий бюджет:</strong> <span className='text-blue-800 font-semibold text-xl'> {recommendation.total_budget} {recommendation.currency}</span>
                    </p>
                </div>
            ),
        },
        ...recommendation.recommendations.map((r) => ({
            title: r.category,
            content: (
                <div className="p-4 border rounded-xl bg-gray-50 shadow-sm">
                    {images[r.category] && (
                        <img
                            src={images[r.category]}
                            alt={r.category}
                            className="rounded-xl w-full h-[450px] object-cover mb-3 shadow"
                        />
                    )}
                    <p className="font-semibold text-blue-600">{r.recommendation}</p>
                    <p className="text-sm text-gray-600 mt-2">
                        Примерная стоимость: {r.estimated_cost} {recommendation.currency}
                    </p>
                </div>
            ),
        })),
        {
            title: "Финальная оценка",
            content: (
                <div className="space-y-3">
                    <p>
                        <strong>Итоговая стоимость:</strong> <span className='text-blue-800 font-semibold text-xl'> {recommendation.final_estimation.total_cost_estimate}{" "}
                        {recommendation.currency}</span>
                    </p>
                    <p className="text-gray-700">{recommendation.final_estimation.suggested_adjustments}</p>
                </div>
            ),
        },
    ];

    return (
        <div className="h-[85vh] overflow-y-auto p-4 bg-white rounded-xl shadow-lg">
            <Timeline data={data} tripData={recommendation} />
        </div>
    );
};

export default BudgetTimeline;
