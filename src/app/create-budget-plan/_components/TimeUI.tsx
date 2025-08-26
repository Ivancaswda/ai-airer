// TimeUI.tsx
import React from "react";

interface TimeUIProps {
    onSelectedOption: (value: string) => void;
}

const TimeUI: React.FC<TimeUIProps> = ({ onSelectedOption }) => {
    return (
        <div className="flex flex-col">

            <input
                type="text"
                placeholder="Enter the duration of your trip (e.g., 1 week)"
                className="p-2 rounded-lg border border-gray-300"
                onBlur={(e) => onSelectedOption(e.target.value)}
            />
        </div>
    );
};

export default TimeUI;
