
'use client'

import React, { useState } from 'react'

const demandsOptions = [
    { label: '♿ Доступность для инвалидов', value: 'Доступность' },
    { label: '🌱 Эко-дружественный транспорт', value: 'Эко-дружественный транспорт' },
    { label: '🐶 Путешествие с питомцем', value: 'Питомец' },
    { label: '🍽️ Вегетарианское питание', value: 'Вегетарианское питание' },
    { label: '🛏️ Специальные условия проживания', value: 'Специальное проживание' },
]

const Demands = ({ onSelectedOption }: { onSelectedOption: (value: string) => void }) => {
    const [showOptions, setShowOptions] = useState(false)

    const handleConfirm = (value: boolean) => {
        if (value) {
            setShowOptions(true)
        } else {
            onSelectedOption('No')
        }
    }

    const handleOptionClick = (value: string) => {
        onSelectedOption(value)
    }

    return (
        <div className="mt-4">
            {!showOptions ? (
                <div className="space-y-2">
                    <p>Есть ли у вас особые требования или предпочтения? 📝</p>
                    <div className="flex gap-2">
                        <button
                            onClick={() => handleConfirm(true)}
                            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition"
                        >
                            ✅ Да
                        </button>
                        <button
                            onClick={() => handleConfirm(false)}
                            className="bg-gray-300 text-black px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                        >
                            ❌ Нет
                        </button>
                    </div>
                </div>
            ) : (
                <div className="space-y-2">
                    <p>Выберите требования:</p>
                    <div className="flex flex-wrap gap-2">
                        {demandsOptions.map((option) => (
                            <button
                                key={option.value}
                                onClick={() => handleOptionClick(option.value)}
                                className="bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/80 transition"
                            >
                                {option.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Demands
