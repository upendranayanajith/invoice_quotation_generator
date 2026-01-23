import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"
import AppSidebar from "@/components/app-sidebar"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Pravega Electricals - Invoice & Quotation",
  description: "Professional invoice and quotation generator",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="font-sans antialiased flex h-screen overflow-hidden" suppressHydrationWarning>
        <div className="flex w-full">
          <div className="no-print">
            <AppSidebar />
          </div>
          <main className="flex-1 overflow-auto">
            {children}
          </main>
        </div>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
