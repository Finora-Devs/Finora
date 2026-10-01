"use client";
import { useContext } from "react";
import { TestContext } from "../context";

export default function DashboardPage() 
    {
    if(useContext(TestContext) === undefined)
    {
    
    }
    else
    {
        const testContextValue = useContext(TestContext);
        console.log("TestContext value:", testContextValue);
    }
    return (
        <div>
            <h2 className="text-3xl font-bold text-[#123c35]">
                Dashboard
            </h2>

            <p className="mt-2 text-[#4e7069]">
                Dashboard content will be added later.
            </p>
        </div>
    );
}