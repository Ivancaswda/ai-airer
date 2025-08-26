'use client'
import React, {useState, useEffect} from 'react';
import {Button} from '@/components/ui/button';
import {useAuth} from "@/context/authContext";
import {TripInfo} from "@/app/create-new-trip/_components/chatBox";
import MyTripCardItem from "@/app/my-trips/_components/MyTripCardItem";
import {api} from "../../../convex/_generated/api";
import {useConvex} from "convex/react";
import Link from 'next/link';
import BudgetTimeline from "@/app/create-budget-plan/_components/BudgetTimeline";

export type BudgetPlan = {
    budgetId: string,
    budgetDetail: any,
    uid: string,
    createdAt?: string
}

const Page = () => {
    const [myBudgetPlans, setMyBudgetPlans] = useState<BudgetPlan[]>([]);
    const convex = useConvex();
    const {user} = useAuth();

    useEffect(() => {
        if(user) GetUserBudgetPlans();
    }, [user]);
    console.log(myBudgetPlans)

    const GetUserBudgetPlans = async () => {
        const result = await convex.query(api.budgetRecommendations.GetUserBudgets, { uid: user?.userId });
        setMyBudgetPlans(result);
    }

    return (
        <div className='px-10 py-10 md:px-24 lg:px-48 flex flex-col justify-center items-center gap-5'>
            {myBudgetPlans?.length === 0 && (
                <div className='text-center'>
                    <h2 className='text-lg mb-4'>You don’t have any budget plan yet!</h2>
                    <Button>
                        <Link href='/create-budget-plan'>Create a new budget plan</Link>
                    </Button>
                </div>
            )}

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6 w-full'>
                {myBudgetPlans.map((item) => {
                    const d = item.budgetDetail;

                    return (
                        <div
                            key={item.budgetId}
                            className="border rounded-xl shadow-md p-4 flex flex-col justify-between bg-white"
                        >
                            <div>
                                <h3 className="text-lg font-semibold text-blue-600 mb-2">
                                    {d.origin} → {d.destination}
                                </h3>
                                <p><strong>Budget:</strong> {d.budget_level}</p>
                                <p><strong>Duration:</strong> {d.trip_duration}</p>
                                <p><strong>Total:</strong> {d.final_estimation?.total_cost_estimate} {d.currency}</p>
                            </div>
                            <div className="mt-4">
                                <Button className='w-full' variant="outline" asChild>
                                    <Link href={`/my-budget-plans/${item.budgetId}`}>
                                        Смотреть детально
                                    </Link>
                                </Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default Page;
