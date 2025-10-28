'use client'
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {AlertCircle, Loader2Icon, Send} from "lucide-react";
import axios from "axios";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/authContext";
import Image from "next/image";
import EmptyBoxState from "@/app/create-new-trip/_components/EmptyBoxState";
import DepartureUI from "@/app/create-budget-plan/_components/DepartureUI";
import DestinationUI from "@/app/create-budget-plan/_components/DestinationUI";
import CurrencyUI from "@/app/create-budget-plan/_components/CurrencyUI";
import BudgetUI from "@/app/create-budget-plan/_components/BudgetUI";
import TimeUI from "@/app/create-budget-plan/_components/TimeUI";
import FinalUI from "@/app/create-budget-plan/_components/FinalUI";
import {useMutation} from "convex/react";
import {api} from "../../../convex/_generated/api";
import {v4 as uuidv4} from "uuid";
import BudgetTimeline from "@/app/create-budget-plan/_components/BudgetTimeline";
import Link from "next/link";
import {useRouter} from "next/navigation";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {toast} from "sonner";

const BudgetPlanningChat = () => {
    const router =useRouter()
    const [apiError, setApiError] = useState<string | null>(null)
    const [locationError, setLocationError] = useState<string | null>(null)
    const [userInput, setUserInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [messages, setMessages] = useState<any[]>([]);
    const [recommendation, setRecommendation] = useState<any>(null);
    const { user } = useAuth();
    const [isFinal, setIsFinal] = useState<boolean>(false); // Новая переменная для отслеживания последнего вопроса
    const SaveBudgetDetail = useMutation(api.budgetRecommendations.CreateBudgetDetail)

    const messagesEndRef = useRef<HTMLDivElement>(null);




    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    useEffect(() => {

        const lastMessage = messages[messages.length - 1];

        if (lastMessage && lastMessage.ui === "time") {
            setIsFinal(true);

        }
    }, [messages]);

    const onSendRecommendation = async () => {
        if (!userInput.trim()) return
        setApiError(null) // 🔄 сбрасываем прошлую ошибку
        setLoading(true)

        const newUserMessage = { role: "user", content: userInput }
        setUserInput("")

        setMessages(prev => [...prev, newUserMessage])

        try {
            const result = await axios.post("/api/aibudget", {
                messages: [...messages, newUserMessage],
                isFinal,
                user,
            })

            const botResponse = {
                role: "assistant",
                content: result.data.resp,
                ui: result.data.ui,
                step: result.data.step,
            }

            setMessages([...messages, newUserMessage, botResponse])

            if (botResponse.ui === "time") setIsFinal(true)

            if (isFinal) {
                toast.success("Посмотрите ИИ-ответ в бюджетных планах")
                setRecommendation(result.data.trip_details)
                await SaveBudgetDetail({
                    budgetDetail: result.data.trip_details,
                    budgetId: uuidv4(),
                    uid: user?.userId,
                })
            }
        } catch (err: any) {
            if (err.response?.data?.code === "LOCATION_BLOCKED") {
                setLocationError(err.response.data.error)
            } else if (err.response?.data?.code === "QUOTA_EXCEEDED") {
                setLocationError(err.response.data.error)
            } else if (err.response?.status === 403 && err.response?.data?.redirect) {
                router.push(err.response.data.redirect)
            } else if (err.response?.status === 500) {
                setApiError("⚠️ Ошибка при обращении к AI. Попробуйте снова или отключите VPN.")
            } else {
                setApiError("⚠️ Что-то пошло не так. Попробуйте отправить сообщение снова.")
                console.error("Error generating recommendation:", err)
            }
        } finally {
            setLoading(false)
        }
    }
    console.log(isFinal)
    console.log(recommendation)

    const RenderGenerativeUi = (ui: string) => {
        if (ui === 'departure') {
            return <DepartureUI onSelectedOption={(v: string) => { setUserInput(v); onSendRecommendation() }} />;
        } else if (ui === 'destination') {
            return <DestinationUI onSelectedOption={(v: string) => { setUserInput(v); onSendRecommendation() }} />;
        } else if (ui === 'currency') {
            return <CurrencyUI onSelectedOption={(v: string) => { setUserInput(v); onSendRecommendation() }} />;
        } else if (ui === 'budget') {
            return <BudgetUI onSelectedOption={(v: string) => { setUserInput(v); onSendRecommendation() }} />;
        } else if (ui === 'time') {
            return <TimeUI onSelectedOption={(v: string) => { setUserInput(v); onSendRecommendation() }} />;
        } else if ( !recommendation && isFinal) {
            return <FinalUI disable={!recommendation} viewTrip={() => console.log(recommendation)}/>
        }

        return null;
    };
    // если юзер не премиум
    if (!user?.isPrem) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] w-full text-center gap-4">
                <h2 className="text-2xl font-bold">Доступно только для Air-Prem пользователей 🚀</h2>
                <p className="text-muted-foreground">
                    Подпишитесь на Air-Prem, чтобы открыть ИИ-планировщик бюджета.
                </p>
                <Link href="/premium">
                    <Button className="mt-4">Купить Air-Prem</Button>
                </Link>
            </div>
        );
    }
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
        <div className="flex items-start gap-2">
            <div className="h-[85vh] w-[50%] px-2 flex flex-col">
                  <section className="flex-1 flex flex-col gap-4 overflow-y-auto p-4">

                      {messages.length === 0 && <EmptyBoxState onSelectOption={(v: string) => { setUserInput(v);
                      }} />}

                      {messages.map((msg: any, index) => (
                        msg.role === 'user' ? (
                            <div key={index} className='flex justify-end mt-2'>
                                <div className='flex items-start gap-4'>
                                    <div className='max-w-lg bg-blue-100 px-6 rounded-3xl py-3 text-black'>
                                        {msg.content}
                                    </div>
                                    <Avatar>
                                        <AvatarFallback className='bg-blue-500 text-white'>{user?.name.charAt(0).toUpperCase()}</AvatarFallback>
                                    </Avatar>
                                </div>
                            </div>
                        ) : (
                            <div key={index} className='flex justify-start mt-2'>
                                <div className='max-w-lg text-black flex items-start gap-4'>
                                    <Avatar>
                                        <AvatarImage src='/Ai-Chat-logo.png' width={40} height={40} className='rounded-full object-cover w-[60px] h-[60px] cursor-pointer'/>
                                        <AvatarFallback>AI</AvatarFallback>
                                    </Avatar>
                                    <div>

                                        {msg.content && (
                                            <p className='text-xl pb-2 font-semibold'>{msg.content}</p>
                                        )}




                                        {RenderGenerativeUi(msg?.ui ?? '')}
                                    </div>
                                </div>
                            </div>
                        )
                    ))}
                    {loading && (
                        <div className='flex items-start h-full w-full gap-4 justify-start'>
                            <Avatar>
                                <AvatarImage src='/Ai-Chat-logo.png' width={40} height={40} className='rounded-full object-cover w-[60px] h-[60px] cursor-pointer'/>
                                <AvatarFallback>AI</AvatarFallback>
                            </Avatar>
                            <div className='flex items-center mt-2 justify-center'>
                                <Loader2Icon className='animate-spin text-blue-600' />
                            </div>
                        </div>
                    )}

                      {apiError && (
                          <div className="mt-4 flex items-start gap-3 bg-red-100 text-red-800 border border-red-300 rounded-xl p-4">
                              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                              <p className="text-sm">{apiError}</p>
                          </div>
                      )}
                    <div ref={messagesEndRef} />
                </section>

                <section>
                    <div className="border rounded-2xl p-4 relative">
                        <Textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Задайте вопрос по вашей поездке" className="resize-none focus:outline-none focus:border-none bg-transparent w-full h-28 p-4 rounded-lg" />
                        <Button onClick={onSendRecommendation} className="absolute bottom-4 right-4">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </section>
            </div>
            {!recommendation || !isFinal ? (
                <div className="relative w-full md:w-[50%] hidden md:block h-[85vh]">
                    <div className="w-full h-full">
                        <Image
                            src="/Budget-Plan.png"
                            width={800}
                            height={600}
                            className="w-[800px] h-[600px] object-cover rounded-2xl shadow-lg"
                            alt="globalPlace"
                        />
                    </div>
                </div>
            ) : (
                <div className=' hidden md:block'>
                    <BudgetTimeline recommendation={recommendation}/>
                </div>
            )}

           </div>
    );
};

export default BudgetPlanningChat;
