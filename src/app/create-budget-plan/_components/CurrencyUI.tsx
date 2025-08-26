// CurrencyUI.tsx
import React from "react";

interface CurrencyUIProps {
    onSelectedOption: (value: string) => void;
}

const CurrencyUI: React.FC<CurrencyUIProps> = ({ onSelectedOption }) => {
    return (
        <div className="flex flex-col">

            <input
                type="text"
                placeholder="Введите желаемую валюту"
                className="p-2 rounded-lg border border-gray-300"
                onBlur={(e) => onSelectedOption(e.target.value)}
            />
        </div>
    );
};

export default CurrencyUI;
