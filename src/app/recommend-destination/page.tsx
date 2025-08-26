'use client'
import React, { useEffect, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { useMutation } from "convex/react";
import { Loader2Icon, Send } from "lucide-react";
import { api } from "../../../convex/_generated/api";
import axios from "axios";
import EmptyBoxState from "@/app/create-new-trip/_components/EmptyBoxState";
import { Textarea } from "@/components/ui/textarea";
import Image from "next/image";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/context/authContext";
import L from 'leaflet';
import TasteUI from "@/app/recommend-destination/_components/TasteUI";
import ClimateUI from "@/app/recommend-destination/_components/ClimateUI";
import BudgetRecUI from "@/app/recommend-destination/_components/BudgetRecUI";
import TimeUI from "@/app/recommend-destination/_components/TimeUI";
import DestinationRecommendationUI from "@/app/recommend-destination/_components/destinationRecommendationUI";
import {v4 as uuidv4} from 'uuid'
import {useRouter} from "next/navigation";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogHeader,
    AlertDialogTitle
} from "@/components/ui/alert-dialog";
import FinalUI from "@/app/recommend-destination/_components/FinalUI";
import {toast} from "sonner";


const RecommendDestination = () => {
    const [locationError, setLocationError] = useState<string | null>(null)
    const router = useRouter()
    const [userInput, setUserInput] = useState<string>("");
    const [loading, setLoading] = useState<boolean>(false);
    const [recommendation, setRecommendation] = useState<any>(null);
    const [messages, setMessages] = useState<any[]>([]);
    const [photoUrl, setPhotoUrl] = useState<string | null>(null);
    const saveRecommendation = useMutation(api.savedRecommendations.SaveRecommendation);
    const { user } = useAuth()
    const [isFinal, setIsFinal] = useState<boolean>(false)
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

    useEffect(() => {
        if (isFinal) {
            getPhoto(recommendation?.resp);  // Get photo based on country
        }
    }, [recommendation]);

    const onSendRecommendation = async () => {
        if (!userInput.trim()) return;
        setLoading(true);

        const newUserMessage = {
            role: "user",
            content: userInput,
        };
        setMessages(prev => {
            const updatedMessages = [...prev, newUserMessage];


            if (isFinal) {
                return updatedMessages;
            }


            const lastMsg = updatedMessages[updatedMessages.length - 1];
            if (lastMsg?.ui === 'time') {
                setIsFinal(true);
            }

            return updatedMessages;
        });

        try {
            const result = await axios.post("/api/aiadvise", {
                messages: [...messages, newUserMessage],
                isFinal: isFinal,
                user
            });
            console.log(result.data)

            const botResponse = {
                role: "assistant",
                content: result.data.resp,
                ui: result.data.ui,
            };
            const recId = uuidv4()

            if (isFinal && user) {

                await saveRecommendation({
                    resp: result.data,
                    uid: user.userId,
                    recId,
                });
            }
            toast.success('Посмотрите ии-ответ в моих рекомендация')

            setMessages([...messages, newUserMessage, botResponse]);
            setUserInput("");
            setRecommendation(result.data);
            setLoading(false);
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
        }
    };
    const getPhoto = async (country: string) => {
        try {
            const result = await axios.get('/api/unsplash-photo', {
                params: { query: recommendation?.resp?.recommended_country ?? recommendation?.recommended_country }  // Request photo by country name
            });

            if (!result?.data.error) {
                setPhotoUrl(result.data.results[0].urls.regular);  // Save image URL
            }
        } catch (e) {
            console.error("Unsplash fetch error", e);
        }
    };

    console.log(photoUrl)

    const RenderGenerativeUi = (ui: string) => {
        if (ui === 'taste') {
            return <TasteUI onSelectedOption={(v: string) => { setUserInput(v); onSendRecommendation() }} />;
        } else if (ui === 'climate') {
            return <ClimateUI onSelectedOption={(v: string) => { setUserInput(v); onSendRecommendation() }} />;
        } else if (ui === 'budget') {
            return <BudgetRecUI onSelectedOption={(v: string) => { setUserInput(v); onSendRecommendation() }} />;
        } else if (ui === 'time') {
            return <TimeUI onSelectedOption={(v: string) => { setUserInput(v); onSendRecommendation() }} />;
        } else if (ui === 'destinationRecommendation' || ui === 'final' || isFinal && !recommendation) {
            return <FinalUI disable={true} viewTrip={() => console.log(recommendation)} />;
        }

        return null;
    };
    console.log(recommendation)
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
        <div className="flex items-start gap-2 ">
            <div className="h-[85vh] w-full md:w-[50%] px-2 flex flex-col">
                <section className="flex-1 flex flex-col gap-4 overflow-y-auto p-4">
                    {messages.length === 0 && <EmptyBoxState onSelectOption={(v: string) => { setUserInput(v); onSendRecommendation(); }} />}
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
                                        {msg?.ui === 'destinationRecommendation' ? (
                                            <strong className='text-xl'>{typeof msg.content === 'object' ? JSON.stringify(msg.content) : msg.content}</strong>
                                        ) : (
                                            <p>{typeof msg.content === 'object' ? JSON.stringify(msg.content) : msg.content}</p>
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
                    <div ref={messagesEndRef} />
                </section>

                <section>
                    <div className="border rounded-2xl p-4 relative">
                        <Textarea value={userInput} onChange={(e) => setUserInput(e.target.value)} placeholder="Раскажите какую путевку вы хотите" className="resize-none focus:outline-none focus:border-none bg-transparent w-full h-28 p-4 rounded-lg" />
                        <Button onClick={onSendRecommendation} className="absolute bottom-4 right-4">
                            <Send className="h-4 w-4" />
                        </Button>
                    </div>
                </section>
            </div>

            <div className="relative  hidden md:w-[50%] h-[85vh] block ">
                <div className="w-full h-full">
                    {photoUrl ? (
                        <div>
                            <h1 className='text-blue-800 text-2xl font-semibold pb-2'>{recommendation?.recommended_country}</h1>
                            <Image src={photoUrl} width={800} height={600} className='w-full h-[600px] object-cover rounded-2xl shadow-lg' alt="destination photo" />
                        </div>
                         ) : (
                        <Image src='/GlobalPlane.png' width={800} height={600} className='w-[800px] h-[600px] object-cover rounded-2xl shadow-lg' alt='globalPlace' />
                    )}
                </div>
            </div>
        </div>
    );
};

export default RecommendDestination;
