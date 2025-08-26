'use client'

import React from 'react'

const options = [
    { label: '😎 Отдых', value: 'relaxation' },
    { label: '💼 Работа', value: 'job' },
    { label: '🎓 Учёба', value: 'education' },
    { label: '🎉 Мероприятие', value: 'events' },
    { label: '🤔 Другое', value: 'others' },
]

const Objective = ({ onSelectedOption }: { onSelectedOption: (value: string) => void }) => {
    return (
        <div className="mt-4 flex flex-wrap gap-2">
            {options.map((option) => (
                <button
                    key={option.value}
                    onClick={() => onSelectedOption(option.value)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition"
                >
                    {option.label}
                </button>
            ))}
        </div>
    )
}

export default Objective
