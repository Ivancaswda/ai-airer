import React from 'react'
import {Textarea} from "@/components/ui/textarea";
import {Button} from "@/components/ui/button";
import {CalendarIcon, Globe2Icon, RocketIcon, Send, WalletIcon} from "lucide-react";
import HeroVideoDialog from "@/components/magicui/hero-video-dialog";
import {TypewriterEffectSmooth} from "@/components/ui/typewrite-effect";
import Link from "next/link";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import {useAuth} from "@/context/authContext";
import OurTeam from "@/app/_components/OurTeam";

export const suggestions = [
    {
        title: 'Создать новую поездку',
        icon: <Globe2Icon/>,
        link: '/create-new-trip',
        isPremRequired: false
    },
    {
        title: 'Порекомендуй мне куда направиться',
        icon: <RocketIcon/>,
        link: '/recommend-destination',
        isPremRequired: false
    },

    {
        title: 'Помоги выбрать лучший сезон для поездки',
        icon: <CalendarIcon />,
        link: '/create-best-period',
        isPremRequired: false
    },
    {
        title: 'Планирование бюджета',
        icon: <WalletIcon />,
        link: '/create-budget-plan',
        isPremRequired: true
    }

]

const Hero = () => {
    const {user} = useAuth()
    const words = [
        {
            text: "Составь",
        },
        {
            text: "свой",
        },
        {
            text: "отпуск",
        },
        {
            text: "вместе с",
        },
        {
            text: "ai-airer.",
            className: "text-blue-500 dark:text-blue-500",
        },
    ];

    return (
        <div className='mt-24 flex items-center  justify-center'>
            <div className='max-w-[80%] w-full flex flex-col gap-4 items-center justify-center text-center'>
                <p className="text-neutral-600 dark:text-neutral-200 text-xs sm:text-base  ">
                    Начало нового пути начинается тут
                </p>
                <TypewriterEffectSmooth words={words} />
                <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 space-x-0 md:space-x-4">
                    <button className="w-40 h-10 rounded-xl bg-black border dark:border-white border-transparent text-white text-sm">
                        <Link href='/create-new-trip'>
                            Попробовать сейчас
                        </Link>
                    </button>
                    <button className="w-40 h-10 rounded-xl bg-white text-black border border-black  text-sm">
                        {!user ?   <Link href='/sign-up' >
                        Войти
                        </Link> : <Link href='/contact-us' >
                            Связаться с нами
                        </Link> }

                    </button>
                </div>



                <div className='text-center w-full flex items-center mt-4 justify-center gap-4' >
                    {suggestions.map((item, index) => item.isPremRequired && user?.isPrem === false ?  (
                        <Tooltip>
                            <TooltipTrigger>
                                <div key={index} className='flex items-center p-4 px-2 gap-2 border hover:border-primary transition rounded-full '>
                                    {item.icon}
                                    <h2 className='text-sm'>{item.title}</h2>
                                </div>
                            </TooltipTrigger>
                            <TooltipContent>
                                Получить air-prem чтобы разблокировать эту ИИ функцию
                            </TooltipContent>
                        </Tooltip>

                    ) :  (

                            <div key={index} className='flex items-center p-4 px-2 gap-2 border cursor-pointer hover:border-primary transition rounded-full '>
                                <Link className='flex items-center  gap-2 ' href={item.link} >
                                    {item.icon}
                                    <h2 className='text-sm'>{item.title}</h2>
                                </Link>

                            </div>
                        )
                    )}
                </div>
                <div className='flex items-center justify-center flex-col '>
                    <h2 className='my-2 mt-14 flex gap-2 text-center'>Не знаете с чего начать <strong>Посмотрите как это работает</strong></h2>
                </div>

                <HeroVideoDialog
                    className="block dark:hidden max-w-[500px]   "
                    animationStyle="from-center"
                    videoSrc="https://youtu.be/TbUdSFpJN5k"
                    thumbnailSrc="https://i.ytimg.com/vi/7HuXSoDXfTY/hqdefault.jpg?sqp=-oaymwEnCNACELwBSFryq4qpAxkIARUAAIhCGAHYAQHiAQoIGBACGAY4AUAB&rs=AOn4CLD_z0mquYrda-G1Tx-bzjvgEFrW5g"
                    thumbnailAlt="Dummy Video Thumbnail"
                />
                <OurTeam/>
            </div>
        </div>
    )
}
export default Hero
