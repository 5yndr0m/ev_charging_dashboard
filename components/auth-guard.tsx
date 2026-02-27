"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { useEffect } from "react"

export function AuthGuard({ children }: { children: React.ReactNode }) {
    const { user, isLoading } = useAuth()
    const router = useRouter()
    const pathname = usePathname()

    useEffect(() => {
        if (!isLoading && !user && pathname !== "/login") {
            router.push("/login")
        }
    }, [user, isLoading, router, pathname])

    if (isLoading) {
        return <div className="flex h-screen items-center justify-center bg-black text-white">Loading...</div>
    }

    if (!user && pathname !== "/login") {
        return null
    }

    return <>{children}</>
}
