"use client";

import React from "react";
import { Carousel, Card } from "@/components/ui/apple-cards-carousel";

export function PopularCityList() {
    const cards = data.map((card, index) => (
        <Card key={card.src} card={card} index={index} layout={true} />
    ));

    return (
        <div className="w-full h-full py-20  dark:bg-black">
            <h2 className="max-w-7xl pl-4 mx-auto text-xl md:text-5xl font-bold text-blue-700 dark:text-blue-400 font-sans">
                Популярные направления для вашей следующей поездки
            </h2>
            <Carousel items={cards} />
        </div>
    );
}

const DummyContent = () => {
    return (
        <>
            {[...new Array(3).fill(1)].map((_, index) => {
                return (
                    <div
                        key={"dummy-content" + index}
                        className="bg-white dark:bg-neutral-900 p-8 md:p-14 rounded-3xl mb-4 shadow-lg"
                    >
                        <p className="text-neutral-700 dark:text-neutral-200 text-base md:text-2xl font-sans max-w-3xl mx-auto">
                            <span className="font-bold text-blue-700 dark:text-blue-400">
                                AI-Airer помогает планировать идеальные путешествия.
                            </span>{" "}
                            Мы создаем персонализированные маршруты, генерируем путевки и подбираем уникальные впечатления для каждого путешественника. Просто выберите направление, а остальное оставьте AI.
                        </p>
                        <img
                            src={`https://picsum.photos/seed/ai-airer-${index}/600/400`}
                            alt="Сгенерированная AI картинка путешествия"
                            height="400"
                            width="600"
                            className="md:w-1/2 md:h-1/2 h-full w-full mx-auto object-cover rounded-2xl mt-4"
                        />
                    </div>
                );
            })}
        </>
    );
};

const data = [
    {
        category: "AI и путешествия",
        title: "Планируйте поездку с AI-Airer",
        src: "https://picsum.photos/seed/ai-airer-1/600/800",
        content: <DummyContent />,
    },
    {
        category: "Маршруты",
        title: "Персонализированные маршруты за секунды",
        src: "https://picsum.photos/seed/ai-airer-2/600/800",
        content: <DummyContent />,
    },
    {
        category: "Приключения",
        title: "Откройте новые впечатления",
        src: "https://picsum.photos/seed/ai-airer-3/600/800",
        content: <DummyContent />,
    },
    {
        category: "Путешествия",
        title: "Лучшие направления по всему миру",
        src: "https://picsum.photos/seed/ai-airer-4/600/800",
        content: <DummyContent />,
    },
    {
        category: "AI-Аналитика",
        title: "Оптимизация маршрутов с AI",
        src: "https://picsum.photos/seed/ai-airer-5/600/800",
        content: <DummyContent />,
    },
];
