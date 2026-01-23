"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, FileText, FilePlus, Search, Menu, LogOut } from "lucide-react"
import { logout } from "@/app/actions/auth"

import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function AppSidebar() {
    const pathname = usePathname()

    const routes = [
        {
            href: "/",
            label: "Dashboard",
            icon: LayoutDashboard,
            active: pathname === "/",
        },
        {
            href: "/editor",
            label: "Generator",
            icon: FilePlus,
            active: pathname === "/editor",
        },
        {
            href: "/invoices",
            label: "Invoices",
            icon: FileText,
            active: pathname === "/invoices",
        },
        {
            href: "/quotations",
            label: "Quotations",
            icon: FileText,
            active: pathname === "/quotations",
        },
        {
            href: "/search",
            label: "Search",
            icon: Search,
            active: pathname === "/search",
        },
    ]

    return (
        <>
            {/* Mobile Sidebar */}
            <div className="flex items-center p-4 lg:hidden">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button variant="outline" size="icon">
                            <Menu className="h-6 w-6" />
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="w-64 p-0">
                        <SidebarContent routes={routes} />
                    </SheetContent>
                </Sheet>
            </div>

            {/* Desktop Sidebar */}
            <div className="hidden h-screen w-64 border-r bg-muted/40 lg:block">
                <SidebarContent routes={routes} />
            </div>
        </>
    )
}

function SidebarContent({ routes }: { routes: any[] }) {
    return (
        <div className="flex h-full flex-col">
            <div className="flex h-14 items-center border-b px-6">
                <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
                    {/* <img src="/placeholder-logo.png" alt="Logo" className="h-8 w-8" /> */}
                    <span>Pravega</span>
                </Link>
            </div>
            <div className="flex-1 overflow-auto py-2">
                <nav className="grid items-start px-4 text-sm font-medium">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            className={`flex items-center gap-3 rounded-lg px-3 py-2 transition-all hover:text-primary ${route.active ? "bg-muted text-primary" : "text-muted-foreground"
                                }`}
                        >
                            <route.icon className="h-4 w-4" />
                            {route.label}
                        </Link>
                    ))}
                </nav>
            </div>
            {/* Logout Section */}
            <div className="mt-auto p-4 border-t">
                <Button
                    variant="ghost"
                    className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
                    onClick={() => logout()}
                >
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                </Button>
            </div>
        </div>
    )
}
