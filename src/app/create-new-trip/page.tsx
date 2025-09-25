'use client'
import React, {useState, useEffect} from 'react'
import ChatBox from "@/app/create-new-trip/_components/chatBox";

import {useTripInfo} from "@/app/provider";
import dynamic from "next/dynamic";

const Itinenary = dynamic(
    () => import("@/app/create-new-trip/_components/Itinenary"),
    { ssr: false }
);

const GlobalHotelMap = dynamic(
    () => import("@/app/create-new-trip/_components/GlobalHotelMap"),
    { ssr: false }
);

import {Button} from "@/components/ui/button";
import {Globe2, Plane} from "lucide-react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip";
import GlobalActiveMap from "@/app/create-new-trip/_components/GlobalActiveMap";
const NewTripPage = () => {

    const [activeIndex, setActiveIndex] = useState(0)
    const {tripInfo, setTripInfo} = useTripInfo()

    useEffect(() => {
        console.log(tripInfo)
    }, [])

    console.log(activeIndex)
    return (
        <div className='flex items-start relative  gap-5 p-10'>
            <div className=' w-full md:w-[50%] lg:w-[35%]'>
                <ChatBox/>
            </div>
            <div  className='  md:w-[50%] lg:w-[65%] hidden md:block  '>
                {activeIndex === 0 ? <Itinenary/> : <GlobalHotelMap/> }



            </div>
        </div>
    )
}
export default NewTripPage
