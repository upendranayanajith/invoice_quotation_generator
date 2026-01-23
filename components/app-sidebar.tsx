import { logout } from "@/app/actions/auth"
import { LogOut } from "lucide-react"

// ... inside AppSidebar ...

return (
    <>
        {/* Mobile Sidebar */}
        <div className="flex items-center p-4 lg:hidden">
            <Sheet>
                {/* ... existing sheet code ... */}
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
