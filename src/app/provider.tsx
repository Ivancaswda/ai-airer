// app/provider.tsx
import {createContext, useContext, useState, ReactNode} from 'react';

type TripContext<T> = {
    tripInfo: T | null;
    setTripInfo: (info: T) => void;
}

const TripContext = createContext<TripContext<any>>({ tripInfo: null, setTripInfo: () => {} });

export function TripProvider({ children }: {children: ReactNode}) {
    const [tripInfo, setTripInfo] = useState<any>(null);
    return <TripContext.Provider value={{tripInfo, setTripInfo}}>{children}</TripContext.Provider>
}

export function useTripInfo<T>() {
    return useContext(TripContext) as TripContext<T>;
}
