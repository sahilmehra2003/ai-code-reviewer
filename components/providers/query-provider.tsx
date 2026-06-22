"use client"
import {QueryClient,QueryClientProvider} from "@tanstack/react-query";
import { useState } from "react";

export function QueryProvider({children}:{children:React.ReactNode}){
   // create instance and initialized to queryClient no setter function needed
    const [queryClient,_]=useState(()=>new QueryClient());

    return (
        <QueryClientProvider client={queryClient}>
             {children}
        </QueryClientProvider>
    )
}