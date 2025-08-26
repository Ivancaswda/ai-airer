// DepartureUI.tsx
import React from "react";

interface DepartureUIProps {
    onSelectedOption: (value: string) => void;
}

const DepartureUI: React.FC<DepartureUIProps> = ({ onSelectedOption }) => {
    return (
        <div className="flex flex-col">

            <input
                type="text"
                placeholder="Введите город отправки"
                className="p-2 rounded-lg border border-gray-300"
                onBlur={(e) => onSelectedOption(e.target.value)}
            />
        </div>
    );
};

export default DepartureUI;
