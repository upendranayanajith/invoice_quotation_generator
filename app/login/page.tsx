"use client"

import { useActionState } from "react"
import { useFormStatus } from "react-dom"
import { login } from "@/app/actions/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Zap, Lock, User, ArrowRight, Loader2 } from "lucide-react"

const initialState = {
    error: '',
}

function SubmitButton() {
    const { pending } = useFormStatus()

    return (
        <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white transition-all duration-300 h-11 text-base font-medium shadow-lg hover:shadow-blue-500/25"
            disabled={pending}
        >
            {pending ? (
                <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                </>
            ) : (
                <>
                    Sign In
                    <ArrowRight className="ml-2 h-4 w-4" />
                </>
            )}
        </Button>
    )
}

export default function LoginPage() {
    const [state, formAction] = useActionState(login, initialState)

    return (
        <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>

            {/* Ambient Glow */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-500/20 rounded-full blur-3xl"></div>

            <div className="w-full max-w-md p-8 relative z-10">
                <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl p-8 space-y-8">

                    {/* Header */}
                    <div className="text-center space-y-2">
                        <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30 transform rotate-3 hover:rotate-6 transition-transform">
                            <Zap className="h-8 w-8 text-white" fill="currentColor" />
                        </div>
                        <h1 className="text-3xl font-bold tracking-tight text-white">
                            Pravega Electricals
                        </h1>
                        <p className="text-slate-400">
                            Enter your credentials to access the dashboard
                        </p>
                    </div>

                    {/* Form */}
                    <form action={formAction} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="username" className="text-slate-300">Username</Label>
                            <div className="relative group">
                                <User className="absolute left-3 top-3 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <Input
                                    id="username"
                                    name="username"
                                    required
                                    placeholder="Enter your username"
                                    className="pl-10 h-11 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="password" className="text-slate-300">Password</Label>
                            <div className="relative group">
                                <Lock className="absolute left-3 top-3 h-5 w-5 text-slate-500 group-focus-within:text-blue-400 transition-colors" />
                                <Input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    placeholder="Enter your password"
                                    className="pl-10 h-11 bg-slate-900/50 border-slate-700 text-slate-100 placeholder:text-slate-600 focus:border-blue-500 focus:ring-blue-500/20 transition-all font-medium"
                                />
                            </div>
                        </div>

                        {state?.error && (
                            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium animate-in fade-in slide-in-from-top-2">
                                {state.error}
                            </div>
                        )}

                        <SubmitButton />
                    </form>

                    {/* Footer */}
                    <div className="text-center text-xs text-slate-500 pt-4 border-t border-white/5">
                        Protected System &copy; {new Date().getFullYear()} Pravega Electricals
                    </div>
                </div>
            </div>
        </div>
    )
}
