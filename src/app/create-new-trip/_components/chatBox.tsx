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
import {api} from "../../../../convex/_generated/api";
import {uuid} from "zod";
import {useTripInfo} from "@/app/provider";
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar";
import {toast} from "sonner";
import {useRouter} from "next/navigation";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";

type Message = {
    role: string,
    content: string,
    ui: string
}

export type TripInfo = {
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


const ChatBox = () => {
    const {tripInfo, setTripInfo} = useTripInfo()
    const [userInput, setUserInput] = useState<string>()
    const [locationError, setLocationError] = useState<string | null>(null)
    const {user} = useAuth()
    const router = useRouter()
    const [loading, setLoading] = useState<boolean>()
    const [messages, setMessages] = useState<Message[]>([])
    const [tripDetail, setTripDetail] = useState<any>()
    const [isFinal, setIsFinal] = useState<boolean>(false)
    const SaveTripDetail = useMutation(api.tripDetail.CreateTripDetail)
    const messagesEndRef = useRef<HTMLDivElement>(null);




    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

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
            const result = await axios.post('/api/aimodel', {
                messages: [...messages, newMsg],
                isFinal: isFinal,
            });

            if (result.data.resp) {
                setMessages(prev => [
                    ...prev,
                    { role: 'assistant', content: result?.data.resp, ui: result?.data?.ui },
                ]);
            }

            // Обработка финального шага
            if (isFinal) {
                setTripDetail(result?.data?.trip_plan);
                await SaveTripDetail({ tripDetail: result?.data?.trip_plan, tripId: uuidv4(), uid: user?.userId });
            }
        } catch (err) {
            if (err.response?.data?.code === "QUOTA_EXCEEDED") {
                setLocationError(err.response.data.error); // показываем в том же попапе
            }
            if (err.response?.data?.code === "LOCATION_BLOCKED") {
                setLocationError(err.response.data.error);
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
        if (ui  === 'groupSize') {
            return <GroupSizeUi onSelectedOption={(v:string) => {
                setUserInput(v)
                onSend()
            }} />

        }  else if (ui  === 'budget') {
            return <BudgetUi onSelectedOption={(v:string) => {
                setUserInput(v)
                onSend()
            }} />

        } else if (ui  === 'TripDuration') {
            return <TripDuration onSelectedOption={(v:string) => {
                setUserInput(v)
                onSend()
            }} />

        }  else if (ui  === 'Objective') {
            return <Objective onSelectedOption={(v:string) => {
                setUserInput(v)
                onSend()
            }} />

        } else if (ui  === 'Demands') {
            return <Demands onSelectedOption={(v:string) => {
                setUserInput(v)
                onSend()
            }} />

        } else if (ui  === 'interests') {
            const interests = ["Приключения", "Красивые виды", "Культура", "Еда", "Ночная жизнь", "отдых"]
            return  <div className="flex flex-wrap gap-2 mt-2">
                {interests.map((item, index) => (
                    <Button onClick={() => {
                        setUserInput(item)
                        onSend()
                    }}  key={index} className="whitespace-nowrap">
                        {item}
                    </Button>
                ))}
            </div>

        } else if (ui === 'final'  && !tripDetail) {
            return <FinalUI
                disable={!tripDetail}
                viewTrip={() => console.log(tripDetail)}

            />
        }

        return  null
    }

    useEffect(() => {
        // вызываем handleFinalStep только если последнее сообщение финальное

        const lastMsg = messages[messages.length - 1];
        console.log('Last message:', lastMsg); // Логируем последнее сообщение
        if (!lastMsg || lastMsg.ui !== 'final') return;
        handleFinalStep();
    }, [messages]); // следим за messages, а не isFinal

    const finalProcessed = useRef(false);

    const handleFinalStep = async () => {

        if (finalProcessed.current) return; // уже обработали финальный шаг

        finalProcessed.current = true; // помечаем как обработанный
        setLoading(true);

        try {
            console.log('Sending final request...'); // Логируем начало запроса
            const result = await axios.post('/api/aimodel', {
                messages: [...messages], // Все актуальные сообщения
                isFinal: true,
            });
            console.log('Final response:', result.data); // Логируем ответ от API

            if (result.data?.trip_plan) {
                const trip = result.data.trip_plan;
                setTripDetail(trip);
                setTripInfo(trip)
                const tripId = uuidv4();
                await SaveTripDetail({
                    tripDetail: trip,
                    tripId,
                    uid: user?.userId,
                });
                toast.success('Посмотрите ии-ответ в моих поездках')
                // Добавляем сообщение FinalUI один раз
                setMessages(prev => [
                    ...prev,
                    {
                        role: 'assistant',
                        content: "Your complete trip plan is ready!",
                        ui: 'final',
                    },
                ]);
            }
        } catch (err) {
            if (err.response?.data?.code === "QUOTA_EXCEEDED") {
                setLocationError(err.response.data.error); // показываем в том же попапе
            }
            if (err.response?.status === 403 && err.response?.data?.redirect) {
                toast.error(err.response.data.error); // оповещение
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
        <div className='h-[85vh] flex flex-col'>
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
                    <div className='flex items-center gap-3 w-full  justify-start'>
                        <Avatar>
                            <AvatarImage src='/Ai-Chat-logo.png' width={40} height={40} className='rounded-full object-cover w-[60px] h-[60px] cursor-pointer'/>
                            <AvatarFallback>AI</AvatarFallback>
                        </Avatar>
                        <Loader2Icon className='animate-spin text-blue-500'/>
                    </div>
                    }
                <div ref={messagesEndRef} />
            </section>
            <section>
                <div className='border rounded-2xl p-4 relative'>
                    <Textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder='Создайте поездку от Парижа до Москвы'
                              className='resize-none focus:outline-none focus:border-none  bg-transparent w-full h-28 p-4 rounded-lg'
                    />
                    <Button onClick={onSend} className='absolute bottom-4 right-4 '>
                        <Send className='h-4 w-4'/>
                    </Button>
                </div>
            </section>
        </div>
    )
}
export default ChatBox
