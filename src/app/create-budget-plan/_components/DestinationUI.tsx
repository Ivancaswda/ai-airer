// DestinationUI.tsx
import React from "react";

interface DestinationUIProps {
    onSelectedOption: (value: string) => void;
}

const DestinationUI: React.FC<DestinationUIProps> = ({ onSelectedOption }) => {
    return (
        <div className="flex flex-col">

            <input
                type="text"
                placeholder="Введите город или страну поездки"
                className="p-2 rounded-lg border border-gray-300"
                onBlur={(e) => onSelectedOption(e.target.value)}
            />
        </div>
    );
};

export default DestinationUI;
