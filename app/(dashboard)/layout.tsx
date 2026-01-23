import type React from "react"
import AppSidebar from "@/components/app-sidebar"

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <div className="flex h-screen w-full overflow-hidden bg-slate-50">
            <div className="no-print border-r bg-white h-full flex-shrink-0">
                <AppSidebar />
            </div>
            <main className="flex-1 overflow-y-auto p-0">
                {children}
            </main>
        </div>
    )
}
