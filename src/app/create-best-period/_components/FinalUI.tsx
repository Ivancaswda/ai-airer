import React from 'react'
import {Globe2Icon} from "lucide-react";
import {Button} from "@/components/ui/button";

const FinalUI = () => {
    return (
        <div className='flex flex-col items-center justify-center mt-6 p-6 bg-white rounded-xl'>
            <Globe2Icon className='text-primary text-4xl animate-bounce'/>
            <h2 className='mt-3 text-lg font-semibold text-primary'>
                ✈ Планируем рекомендацию по погоде...
            </h2>
            <p className='text-gray-500 text-sm text-center my-1'>
                Подождите пока ИИ завершит свою работу и позже наслаждайтесь результатом
            </p>
            <Button disabled={true}>Посмотреть рекомендацию</Button>
        </div>
    )
}
export default FinalUI
