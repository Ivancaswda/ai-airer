import React from 'react'

const TasteUi = ({ onSelectedOption }: { onSelectedOption: (value: string) => void }) => {
    const options = ['Приключение', 'Отдых', 'Культура', 'Природа'];

    return (
        <div className='mt-2'>

            <div className="flex gap-4 mt-2">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onSelectedOption(option)}
                        className="p-2 bg-blue-100 cursor-pointer hover:bg-blue-200 rounded-lg"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
export default TasteUi
