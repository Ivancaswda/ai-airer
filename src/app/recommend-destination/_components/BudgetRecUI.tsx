import React from 'react'

const BudgetRecUi = ({onSelectedOption}:{ onSelectedOption: (value: string) => void }) => {
    const options = ['Низкий', 'Средний', 'Высокий'];

    return (
        <div>

            <div className="flex gap-4 mt-2">
                {options.map((option) => (
                    <button
                        key={option}
                        onClick={() => onSelectedOption(option)}
                        className="p-2 bg-blue-100 hover:bg-blue-200 rounded-lg"
                    >
                        {option}
                    </button>
                ))}
            </div>
        </div>
    );
}
export default BudgetRecUi
