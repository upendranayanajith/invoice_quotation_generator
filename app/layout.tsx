import type React from "react"
import type { Metadata } from "next"
import { Geist, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { Toaster } from "@/components/ui/sonner"
import "./globals.css"

const geist = Geist({ subsets: ["latin"] })
const geistMono = Geist_Mono({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: `${process.env.NEXT_PUBLIC_COMPANY_NAME || "Company Name"} - Invoice & Quotation`,
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
        {/* Sidebar was here, now moved to (dashboard)/layout.tsx */}
        <div className="flex w-full h-full">
          {children}
        </div>
        <Analytics />
        <Toaster />
      </body>
    </html>
  )
}
