import React from 'react'
import {suggestions} from "@/app/_components/Hero";
import Link from "next/link";
import {usePathname, useRouter} from "next/navigation";

const EmptyBoxState = ({onSelectOption}: any) => {
    const router = useRouter();
    const pathname = usePathname()
    console.log(pathname)
    return (
        <div>
            <h2 className='font-bold text-xl text-center'>
                {pathname === '/recommend-destination' && 'Получите профессиональную рекомендацию от ИИ об месте отдыха'}
                {pathname === '/create-new-trip' && 'Начните составлять новую поездку прямо сейчас используя ИИ'}
                {pathname === '/create-budget-plan' && 'Распределите бюджет и будьте готовы заранее к финансовым трудностям используя ИИ'}
                {pathname === '/create-best-period' && 'Узнайте какая будет погода в вашем месте отдыха используя ИИ'}
        </h2>
            <p className='text-center text-gray-400 mt-2'>
                С помощью наших инструментов вы сможете представить свою поездку, грамотно подготовится к ней и разобрать ошибки не вставая с дивана
            </p>

            <div className='text-center flex items-start mt-4 flex-col justify-center gap-4'>
                {suggestions.map((item, index) => {
                    const isCurrentPage = pathname === item?.link;
                    return isCurrentPage ? (
                        <div
                            key={index}
                            onClick={() => onSelectOption(item.title)}
                            className='flex items-center gap-2 border cursor-pointer hover:border-primary transition rounded-full p-3'
                        >
                            {item.icon}
                            <h2 className='text-lg'>{item.title}</h2>
                        </div>
                    ) : (
                        <Link key={index} href={item?.link}>
                            <div className='flex items-center gap-2 border cursor-pointer hover:border-primary transition rounded-full p-3'>
                                {item.icon}
                                <h2 className='text-lg'>{item.title}</h2>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    )
}
export default EmptyBoxState
