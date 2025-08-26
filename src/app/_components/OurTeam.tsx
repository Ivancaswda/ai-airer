"use client";
import React from "react";
import { AnimatedTooltip } from "@/components/ui/animated-tooltip";

const people = [
    {
        id: 1,
        name: "Иван Катковский",
        designation: "Frontend-разработчик",
        image: "https://ui-avatars.com/api/?name=ИЮ&background=random",
    },
    {
        id: 2,
        name: "Иван Катковский",
        designation: "UX/UI дизайнер",
        image: "https://ui-avatars.com/api/?name=КЕ&background=random",
    },
    {
        id: 3,
        name: "Иван Катковский",
        designation: "Backend-разработчик",
        image: "https://ui-avatars.com/api/?name=СЛ&background=random",
    },
    {
        id: 4,
        name: "Иван Катковский",
        designation: "Продакт-менеджер",
        image: "https://ui-avatars.com/api/?name=ПА&background=random",
    },
    {
        id: 5,
        name: "Иван Катковский",
        designation: "Data Scientist",
        image: "https://ui-avatars.com/api/?name=МН&background=random",
    },
    {
        id: 6,
        name: "Иван Катковский",
        designation: "QA инженер",
        image: "https://ui-avatars.com/api/?name=ИК&background=random",
    },
];

 function OurTeam() {
    return (
        <div className="flex flex-row items-center justify-center my-10 w-full">
            <AnimatedTooltip items={people} />
        </div>
    );
}
export default OurTeam