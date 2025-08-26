import React, {useState} from 'react'
import {Button} from "@/components/ui/button";

interface TripDurationProps {
    onSelectedOption: (value: string) => void
}
const TripDuration = ({onSelectedOption} : TripDurationProps) => {

    const [days, setDays] = useState<number>(3)

    const increase = () => setDays((prevState) => Math.min(prevState + 1, 60))
    const decrease = () => setDays((prevState) => Math.max(prevState -1, 1))

    const confirm = () => {
        onSelectedOption(`${days} days`)
    }
    return (
        <div className="mt-4 flex flex-col items-start gap-4">
            <div className="flex items-center gap-4">
                <Button onClick={decrease} variant="outline">
                    −
                </Button>
                <span className="text-lg font-semibold">{days} дней</span>
                <Button onClick={increase} variant="outline">
                    +
                </Button>
            </div>
            <Button onClick={confirm} variant="default">
                Подтвердить
            </Button>
        </div>
    )
}
export default TripDuration
