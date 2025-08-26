// BudgetUI.tsx
import React from "react";

interface BudgetUIProps {
    onSelectedOption: (value: string) => void;
}

const BudgetUI: React.FC<BudgetUIProps> = ({ onSelectedOption }) => {
    return (
        <div className="flex flex-col">

            <input

                placeholder="Введите ваш бюджет"
                className="p-2 rounded-lg border border-gray-300"
                onBlur={(e) => onSelectedOption(e.target.value)}
            />
        </div>
    );
};

export default BudgetUI;
