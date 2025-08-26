'use client'
import React, {useEffect, useRef, useState} from 'react'
import {useAuth} from "@/context/authContext";
import axios from "axios";
import {v4 as uuidv4} from 'uuid'
import GroupSizeUi from "@/app/create-new-trip/_components/GroupSizeUI";
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {Loader2Icon, Send} from "lucide-react";
import EmptyBoxState from "@/app/create-new-trip/_components/EmptyBoxState";
import BudgetUi from "@/app/create-new-trip/_components/BudgetUI";
import TripDuration from "@/app/create-new-trip/_components/TripDuration";
import Objective from "@/app/create-new-trip/_components/Objective";
import Demands from "@/app/create-new-trip/_components/Demands";
import FinalUI from "@/app/create-new-trip/_components/FinalUI";
import {useMutation} from "convex/react";
import {addPointerInfo} from "framer-motion";
import {api} from "../../../convex/_generated/api";
import {uuid} from "zod";
import {useTripInfo} from "@/app/provider";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {Select} from "@/components/ui/select";
import {Input} from "@/components/ui/input";
import {useRouter} from "next/navigation";
import Image from "next/image";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {toast} from "sonner";

type Message = {
    role: string,
    content: string,
    ui: string
}

export type PeriodInfo = {
    budget: string,
    destination: string,
    duration: number,
    group_size: string,
    origin: string,
    interests: any
    hotels: any,
    itinerary: any,
    special_needs: string
}


const BestPeriodPage = () => {
    const router = useRouter()
    const [locationError, setLocationError] = useState<string | null>(null)
    const [weatherAdvise, setWeatherAdvise] = useState<any>()
    const {tripInfo, setTripInfo} = useTripInfo()
    const [userInput, setUserInput] = useState<string>()
    const {user} = useAuth()
    const [loading, setLoading] = useState<boolean>()
    const [messages, setMessages] = useState<Message[]>([])
    const [tripDetail, setTripDetail] = useState<any>()
    const [isFinal, setIsFinal] = useState<boolean>(false)
    const SaveBestSeason = useMutation(api.bestSeason.CreateBestSeason)
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);

    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {
        if ( weatherAdvise) {
            getPhoto(weatherAdvise.destination);
        }
    }, [isFinal, weatherAdvise]);

    console.log(photoUrl)
    const getPhoto = async (city: string) => {
        try {
            const result = await axios.get("/api/unsplash-photo", {
                params: { query: city },
            });
            if (!result.data.error && result.data.results.length > 0) {
                setPhotoUrl(result.data.results[0].urls.regular);
            }
            console.log(result)
        } catch (error) {
            console.error("Unsplash fetch error", error);
        }
    };

    const onSend = async () => {
        if (!userInput?.trim()) return;
        setLoading(true);

        const newMsg = {
            role: 'user',
            content: userInput ?? '',
        };

        setUserInput(''); // Очищаем input

        setMessages(prev => {
            const updatedMessages = [...prev, newMsg];


            if (isFinal) {
                return updatedMessages;
            }


            const lastMsg = updatedMessages[updatedMessages.length - 1];
            if (lastMsg?.content === 'final') {
                setIsFinal(true); // Если вопрос финальный, переходим к финальной стадии
            }

            return updatedMessages;
        });

        try {
            const result = await axios.post('/api/aiperiod', {
                messages: [...messages, newMsg],
                isFinal: isFinal,
            });

            if (result.data.resp) {
                setMessages(prev => [
                    ...prev,
                    { role: 'assistant', content: result?.data.resp, ui: result?.data?.ui },
                ]);
            }



        } catch (err) {
            if (err.response?.data?.code === "LOCATION_BLOCKED") {
                setLocationError(err.response.data.error);
            }
            if (err.response?.data?.code === "QUOTA_EXCEEDED") {
                setLocationError(err.response.data.error); // показываем в том же попапе
            }

            if (err.response?.status === 403 && err.response?.data?.redirect) {
                router.push(err.response.data.redirect); // редирект на premium

            } else {
                console.error("Error generating recommendation:", err);
            }
        } finally {
            setLoading(false);
        }
    };



    const RenderGenerativeUi = (ui: string) => {
        if (ui === 'destination') {
            return (
                <Input className='mt-2'
                    placeholder="Введите место отдыха (Например: Томск)"
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                            setUserInput((e.target as HTMLInputElement).value);
                            onSend();
                        }
                    }}
                />
            );
        }

        if (ui === 'month') {
            const months = [
                "Январь","Февраль","Март","Апрель","Май","Июнь",
                "Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"
            ];
            return (
                <div className="flex flex-wrap gap-2 mt-3">
                    {months.map((m) => (
                        <Button key={m} size="sm" variant="outline"
                                onClick={() => { setUserInput(m); onSend(); }}>
                            {m}
                        </Button>
                    ))}
                </div>
            );
        }
        if (ui === 'tripType') {
            return   <div className="flex gap-2 mt-3 flex-wrap">
                {["Отпуск", "Бизнес", "Приключение", "Семья"].map(opt => (
                    <Button key={opt} variant="outline" onClick={() => {
                        setUserInput(opt)
                        onSend()
                    }}>
                        {opt}
                    </Button>
                ))}
            </div>
        }
        if (ui === 'weatherPref') {
            return   <div className="flex gap-2 mt-3 flex-wrap">
                {["Теплый", "Холодный", "Сухой", "Влажный"].map(opt => (
                    <Button key={opt} variant="outline" onClick={() => setUserInput(opt)}>
                        {opt}
                    </Button>
                ))}
            </div>
        }
        if (ui === 'final' && !weatherAdvise) {
            return <FinalUI disable={!weatherAdvise} viewTrip={() => router.push('/view-best-seasons')}/>
        }

        return null;
    };

    useEffect(() => {
        const lastMsg = messages[messages.length - 1];
        console.log('Last message:', lastMsg);
        if (!lastMsg || lastMsg.ui !== 'final') return;
        handleFinalStep();
    }, [messages]);

    const finalProcessed = useRef(false);

    const handleFinalStep = async () => {

        if (finalProcessed.current) return;

        finalProcessed.current = true;
        setLoading(true);

        try {

            const result = await axios.post('/api/aiperiod', {
                messages: [...messages],
                isFinal: true,
                user
            });
            console.log('Final response:', result.data);

            if (result.data?.weather_plan) {

                const tripId = uuidv4();
                setWeatherAdvise(result.data?.weather_plan)
                console.log(messages)
                const seasonId = uuidv4()
                await SaveBestSeason({
                    seasonId,
                    uid: user?.userId,
                    weather_plan: result.data?.weather_plan
                })
                toast.success('Посмотрите ии-ответ в лучших сезонах')
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: "Ваша рекомендация успешно готова!",
                        ui: 'final',
                    },
                ]);
            }
        } catch (err) {
            if (err.response?.data?.code === "LOCATION_BLOCKED") {
                setLocationError(err.response.data.error);
            }
            if (err.response?.data?.code === "QUOTA_EXCEEDED") {
                setLocationError(err.response.data.error); // показываем в том же попапе
            }

            if (err.response?.status === 403 && err.response?.data?.redirect) {
                router.push(err.response.data.redirect); // редирект на premium

            } else {
                console.error("Error generating recommendation:", err);
            }
        } finally {
            setLoading(false);
        }
    };

    if (locationError) {
        return  <AlertDialog open={!!locationError} onOpenChange={() => setLocationError(null)}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Доступ запрещён</AlertDialogTitle>
                    <AlertDialogDescription>{locationError}</AlertDialogDescription>
                </AlertDialogHeader>
            </AlertDialogContent>
        </AlertDialog>
    }


    return (
        <div className='h-full  flex  '>
            <div className='flex flex-col fixed top-20 z-20 w-full md:w-[50%] h-[85vh]'>
                <section className='flex-1 overflow-y-auto p-4'>
                    {messages.length === 0 && <EmptyBoxState onSelectOption={(v: string) => {
                        setUserInput(v)
                        onSend()
                    }}/>}
                    {messages.map((msg: Message, index) => (
                        msg.role === 'user' ?   <div key={index} className='flex justify-end mt-2'>
                                <div className='flex items-start gap-4'>
                                    <div className='max-w-lg bg-blue-100  px-6 rounded-3xl py-3 text-black'>

                                        {msg.content}
                                    </div>
                                    <Avatar>
                                        <AvatarFallback className='bg-blue-500 text-white'>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </div>

                            </div> :
                            <div key={index} className='flex justify-start mt-2'>
                                <div className='max-w-lg text-black flex  items-center gap-4'>
                                    <Avatar>
                                        <AvatarImage src='/Ai-Chat-logo.png' width={40} height={40} className='rounded-full object-cover   w-[60px] h-[60px] cursor-pointer'/>
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>

                                    <div>
                                        {msg.content}
                                        {RenderGenerativeUi(msg?.ui ?? '')}
                                    </div>

                                </div>
                            </div>
                    ))}
                    {!isFinal && loading &&
                        <div className='flex items-center gap-4'>
                            <Avatar>
                                <AvatarImage src='/Ai-Chat-logo.png' width={40} height={40} className='rounded-full object-cover   w-[60px] h-[60px] cursor-pointer'/>
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <Loader2Icon className='animate-spin text-blue-500'/>
                        </div>}

                    <div ref={messagesEndRef} />
                </section>
                <section>
                    <div className='border rounded-2xl p-4 relative'>
                        <Textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder='Узнайте когда лучше всего устроить поездку'
                                  className='resize-none focus:outline-none focus:border-none  bg-transparent w-full h-28 p-4 rounded-lg'
                        />
                        <Button onClick={onSend} className='absolute bottom-4 right-4 '>
                            <Send className='h-4 w-4'/>
                        </Button>
                    </div>
                </section>

            </div>
            <div className="relative hidden md:flex w-2/2  justify-end h-screen">

                {!weatherAdvise && <Image src='/Destination.png' width={400} height={400} className='w-[50%] object-cover border-2xl h-[80vh]' alt='dest-image' />}
                {weatherAdvise && (
                    <div className="w-[50%] self-end p-6 bg-white shadow-lg h-full rounded-xl border border-gray-200 ml-4  top-4 space-y-4">
                        <h3 className="text-2xl font-bold mb-2">Погода & Совет поездки</h3>
                        {photoUrl && <img src={photoUrl} alt={weatherAdvise.destination} className="w-full h-64 object-cover rounded-lg shadow-md" />}

                        <div className="space-y-1">
                            <p><strong>Место назначение:</strong> {weatherAdvise.destination}</p>
                            <p><strong>Месяц:</strong> {weatherAdvise.month}</p>
                            <p><strong>Тип поездки:</strong> {weatherAdvise.trip_type}</p>
                            <p><strong>Погодные условия:</strong> {weatherAdvise.weather_preference}</p>
                        </div>

                        <div className="space-y-1 p-3 bg-blue-50 rounded-lg">
                            <p className="font-semibold text-blue-600">Ожидаемая погода:</p>
                            <p>Средняя температура: <strong>{weatherAdvise.expected_weather.avg_temp_c}°C</strong></p>
                            {weatherAdvise.expected_weather.humidity_percent && (
                                <p>Влажность: <strong>{weatherAdvise.expected_weather.humidity_percent}%</strong></p>
                            )}
                            <p>Дождливые дожди: <strong>{weatherAdvise.expected_weather.rain_days}</strong></p>
                            <p className="mt-2"><strong>Рекомендация:</strong> {weatherAdvise.recommendation}</p>
                        </div>

                        <div className="space-y-2 p-3 bg-green-50 rounded-lg">
                            <p className="font-semibold text-green-600">Активные предположения:</p>
                            <p>{weatherAdvise.activity_suggestion}</p>
                        </div>

                        <div className="space-y-2 p-3 bg-yellow-50 rounded-lg">
                            <p className="font-semibold text-yellow-600">Что надеть:</p>
                            <p>{weatherAdvise.clothing_advice}</p>
                        </div>
                    </div>
                ) }
            </div>
        </div>
    )
}
export default BestPeriodPage
