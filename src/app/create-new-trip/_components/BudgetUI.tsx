import React from 'react'
import {SelectTravelsList} from "@/app/create-new-trip/_components/GroupSizeUI";
interface TripDurationProps {
    onSelectedOption: (value: string) => void
}
export const SelectBudgetOption = [
    {
        title: 'Экономия',
        desc: 'Минимальный затрат, максимум эмоций!',
        icon: '💸',
        color: 'bg-green-100 text-green-600',
    },
    {
        title: 'Бюджет',
        desc: 'Комфорт и разумная трата денег',
        icon: '💰',
        color: 'bg-yellow-100 text-yellow-600',
    },
    {
        title: 'Премиум',
        desc: 'Великолепная поездка с множеством радости',
        icon: '💎',
        color: 'bg-blue-100 text-blue-600',
    },
    {
        title: 'Роскошь',
        desc: 'Не думай о деньгах, думай об удовольствии ',
        icon: '🤑',
        color: 'bg-purple-100 text-purple-600',
    },
]

const BudgetUi = ({onSelectedOption}:TripDurationProps) => {
    return (
        <div className='grid grid-cols-2 gap-2 md:grid-cols-4 items-center mt-1'>
            {SelectBudgetOption.map((item, index) => (
                <div onClick={() => onSelectedOption(item.title )}
                     className='bg-white cursor-pointer hover:border-primary rounded-2xl p-3 border flex flex-col items-center text-center' key={index}>
                    <div className={`text-3xl p-3 rounded-full  ${item.color}`}>{item.icon}</div>
                    <h2 className='text-lg font-semibold mt-2'>{item.title}</h2>
                    <p className='text-sm text-gray-500'>{item.desc}</p>
                </div>
            ))}
        </div>
    )
}
export default BudgetUi
