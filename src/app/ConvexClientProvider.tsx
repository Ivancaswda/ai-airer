'use client'
import {ConvexReactClient, ConvexProvider} from "convex/react";
import React, {ReactNode} from "react";
import {TripProvider} from "@/app/provider";

const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL!)

export function ConvexClientProvider({children}: {children: {children: ReactNode}}) {
    return <ConvexProvider client={convex}>
        <TripProvider>
            {children}
        </TripProvider>
    </ConvexProvider>
}