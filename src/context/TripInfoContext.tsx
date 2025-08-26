import React, {createContext} from "react";
import {TripInfo} from "@/app/create-new-trip/_components/chatBox";

export type TripInfoContext = {
    tripInfo: TripInfo | null,
    setTripInfo: React.Dispatch<React.SetStateAction<TripInfo | null>>
}

export const TripInfoContext = createContext<TripInfoContext | undefined>(undefined)