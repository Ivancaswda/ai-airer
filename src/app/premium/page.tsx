'use client'
import React from 'react'
import { Zap } from 'lucide-react'
import { useAuth } from "@/context/authContext";
import { Button } from "@/components/ui/button";

const Page = () => {
    const { user } = useAuth();

    return (
        <div className="min-h-screen bg-[#F0F4FF] flex flex-col items-center py-20 px-4">
            <h1 className="text-4xl md:text-6xl font-bold text-blue-700 mb-4">
                Выберите тариф
            </h1>


            <p className="text-center text-sm text-red-600 mb-12 max-w-xl">
                ⚠️ Внимание: сервис оплаты через LemonSqueezy недоступен пользователям из России.
                Чтобы тестово оплатить и приобрести премиум, необходимо использовать VPN.
            </p>

            <div className="flex flex-col md:flex-row gap-8 max-w-6xl w-full justify-center">

                <div className="bg-white rounded-3xl shadow-lg p-8 md:p-12 flex-1 text-center hover:shadow-2xl transition">
                    <h2 className="text-2xl font-semibold mb-4 text-blue-700">Базовый</h2>
                    <p className="text-gray-600 mb-6">Доступ к стандартным функциям AI-Airer</p>
                    <div className="text-4xl font-bold mb-6 text-gray-800">0 ₽</div>
                    <ul className="text-left mb-8 space-y-2 text-gray-600">
                        <li>✔ Доступно генерация путевок</li>
                        <li>✔ Вы можете узнать когда лучше всего начать путешевствовать</li>
                        <li>✔ Вы пользуетесь нашим ИИ абсолютно бесплатно</li>
                    </ul>
                    <button
                        className="bg-gray-300 text-gray-800 px-6 py-3 rounded-xl font-semibold cursor-not-allowed"
                        disabled
                    >
                        Бесплатно
                    </button>
                </div>

                <div className="bg-blue-700 rounded-3xl shadow-lg p-8 md:p-12 flex-1 text-center text-white hover:shadow-2xl transition relative">
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 bg-yellow-400 text-black font-bold px-4 py-1 rounded-full text-sm">
                        Популярно
                    </div>
                    <h2 className="text-2xl font-semibold mb-4">AI-Premium</h2>
                    <p className="mb-6">Полный доступ к AI-Airer с эксклюзивными функциями</p>
                    <div className="text-4xl font-bold mb-6">199.99 РУБЛЕЙ</div>
                    <ul className="text-left mb-8 space-y-2">
                        <li>✔ ИИ отвечает на 15% быстрее</li>
                        <li>✔ Вам доступны все ИИ функции нашей платформы</li>
                        <li>✔ Приоритетная поддержка</li>
                        <li>✔ Вы помогаете создателю копеечкой (нет)</li>
                    </ul>
                    <Button
                        disabled={user?.isPrem}
                        className="bg-yellow-400 text-black px-6 py-6 rounded-xl font-semibold hover:bg-yellow-300 transition"
                    >
                        <a
                            className='flex items-center justify-center gap-2'
                            target='_blank'
                            href="https://ai-airer.lemonsqueezy.com/buy/085e3fea-d196-4da3-9be1-2e98c1628505"
                        >
                            <Zap className='w-5 h-5'/>
                            {user?.isPrem ? 'Уже есть' : 'Купить AIR-Premium'}
                        </a>
                    </Button>
                </div>
            </div>
        </div>
    )
}
export default Page
