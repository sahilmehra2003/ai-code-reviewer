"use client"
import * as React from "react"
import {MoonIcon,SunIcon} from "@phosphor-icons/react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"


export function ModeToggle() {
  const { resolvedTheme,setTheme } = useTheme()

  return (
        <Button 
         variant="outline" 
         size="icon"
         onClick={()=>setTheme(resolvedTheme==="dark" ? "light":"dark")}>
            {resolvedTheme==="dark" ? 
            (<SunIcon className={cn("absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0")} />):
            (<MoonIcon className={cn("h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90")} />)}
            
        </Button>
    
  )
}
