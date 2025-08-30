'use client'
import React from 'react'
import Image from "next/image";
import Link from "next/link";
import {Button} from '@/components/ui/button'
import {useAuth} from "@/context/authContext";
import {DropdownMenuTrigger, DropdownMenu, DropdownMenuContent} from "@/components/ui/dropdown-menu";
import {Avatar, AvatarImage, AvatarFallback} from "@/components/ui/avatar";
import {usePathname} from "next/navigation";
import {CalendarIcon, CrownIcon, LogOutIcon, PlaneIcon, PlaneLandingIcon, TrainIcon} from "lucide-react";
import {BiMoney} from "react-icons/bi";

const Header = () => {
    const { user, logout } = useAuth();

    const menuOptions = [
        {
            name: 'Главная',
            path: '/'
        },
        {
            name: 'Премиум',
            path: '/premium'
        },
        {
            name: 'Связаться с нами',
            path: '/contact-us'
        }
    ];

    const path = usePathname();
    console.log(user?.image)
    return (
        <div className={`flex ${path === '/' && 'bg-[#F0F4FF]'} items-center justify-between p-4`}>
            {/* Логотип */}
            <div className='flex gap-2 items-center'>
                <Image src='/logo.png' className='rounded-2xl' alt='Логотип' width={80} height={50}/>
            </div>

            {/* Главное меню */}
            <div className='flex items-center gap-2'>
                {menuOptions.map((item, index) => (
                    <Link href={item.path} key={index}>
                        <h2 className='text-lg hover:scale-105 transition-all px-4 hover:text-blue-600'>
                            {item.name}
                        </h2>
                    </Link>
                ))}
            </div>

            {/* Пользователь / Авторизация */}
            {user ? (
                <DropdownMenu>
                    <DropdownMenuTrigger>
                        {user?.image ? <Image className='rounded-full w-[35px] h-[35px] cursor-pointer' src={user?.image} alt={'avatar'} width={60} height={60} />
                        :  <Avatar>
                                <AvatarImage src={user?.image}/>
                                <AvatarFallback>
                                    {user?.name?.charAt(0).toUpperCase()}
                                </AvatarFallback>
                            </Avatar>}

                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        <ul className='flex items-center justify-center flex-col'>

                               <li className='py-2 px-2 w-full flex items-center gap-2 hover:bg-muted-foreground/60 transition cursor-pointer'>
                                   <CrownIcon/>
                                   <Link href='/premium'>
                                   Получить air-premium
                                   </Link>

                               </li>


                            <li className='py-2 px-2 w-full flex items-center gap-2 hover:bg-muted-foreground/60 transition cursor-pointer'>
                                <TrainIcon/>
                                {path === '/create-new-trip'
                                    ? <Link href='/my-trips'>Мои поездки</Link>
                                    : <Link href='/create-new-trip'>Создать новую поездку</Link>}

                            </li>
                            <li className='py-2 px-2 w-full flex items-center gap-2 hover:bg-muted-foreground/60 transition cursor-pointer'>
                                <PlaneLandingIcon/> {path === '/recommend-destination'
                                    ? <Link href='/view-recommendations'>Мои рекомендации</Link>
                                    : <Link href='/recommend-destination'>Создать новую рекомендацию</Link>}

                            </li>
                            <li className='py-2 px-2 w-full flex items-center gap-2 hover:bg-muted-foreground/60 transition cursor-pointer'>
                                <BiMoney/>  {path === '/create-budget-plan'
                                    ? <Link href='/my-budget-plans'>Мои бюджетные планы</Link>
                                    : <Link href='/create-budget-plan'>Создать бюджетный план</Link>}

                            </li>
                            <li className='py-2 px-2 w-full flex items-center gap-2 hover:bg-muted-foreground/60 transition cursor-pointer'>
                                <CalendarIcon/> {path === '/create-best-period'
                                    ? <Link href='/view-best-seasons'>Мои лучшие сезоны</Link>
                                    : <Link href='/create-best-period'>Создать лучший сезон</Link>}

                            </li>
                            <li
                                className='py-2 px-2 flex items-center gap-2 w-full hover:bg-muted-foreground/60 transition cursor-pointer'
                                onClick={logout}
                            >

                                Выйти
                                <LogOutIcon/>
                            </li>
                        </ul>
                    </DropdownMenuContent>
                </DropdownMenu>
            ) : (
                <Button>
                    <Link href='/sign-up'>
                        Зарегистрироваться
                    </Link>
                </Button>
            )}
        </div>
    );
};

export default Header;
