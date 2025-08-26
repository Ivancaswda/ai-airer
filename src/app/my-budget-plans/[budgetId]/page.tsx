'use client'
import React, {useEffect, useState} from 'react'
import {useParams} from "next/navigation";
import {useAuth} from "@/context/authContext";
import {useConvex} from "convex/react";
import {api} from "../../../../convex/_generated/api";
import {BudgetPlan} from "@/app/my-budget-plans/page";
import {Trip} from "@/app/my-trips/page";
import BudgetTimeline from "@/app/create-budget-plan/_components/BudgetTimeline";
import {toast} from "sonner";
import {Loader2Icon} from "lucide-react";

const BudgetIdPage = () => {
    const {budgetId} = useParams()
    const {user} = useAuth()
    console.log(budgetId)
    const [isLoading, setIsLoading] = useState<boolean>(false)
    const convex = useConvex()
    const [budgetData, setBudgetData] = useState<BudgetPlan>()
    useEffect(() => {
        user && GetBudgetPlan()
    }, [user])

    const GetBudgetPlan = async () => {
        if (!budgetId || !user) return;
        try {
            setIsLoading(true)
            const result = await convex.query(api.budgetRecommendations.GetBudgetById, {
                uid: user.userId,
                budgetId: budgetId,
            });

            console.log(result);
            if (result) {
                setBudgetData(result.budgetDetail)
                console.log(result)
            }
        } catch (error) {
            toast.error('Failed to get budget plan')
            console.log(error)
        }
        setIsLoading(false)
    };
    if (isLoading) {
        return  <div className='flex items-center justify-center w-full h-full'>
            <Loader2Icon className='animate-spin text-muted-foreground'/>
        </div>
    }
    if (!budgetData) {
        return  <div className='flex items-center justify-center text-center'>
            Budget data not found
        </div>
    }



    return (
        <div>
            <BudgetTimeline recommendation={budgetData} />
        </div>
    )
}
export default BudgetIdPage
