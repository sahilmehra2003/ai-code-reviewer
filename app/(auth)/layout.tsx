
import { requireUnAuth } from "@/features/auth/actions";
import * as React from "react";
export default async function AuthLayout(
    {children}:{children:React.ReactNode}
) {
    await requireUnAuth()
    return (
        <div className="flex min-h-full flex flex-1 flex-col items-center justify-center bg-muted/40 px-4 py-12">
            <div className="w-full max-w-sm">{children}</div>
        </div>
    )
}