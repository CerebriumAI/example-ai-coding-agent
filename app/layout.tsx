import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { SidebarProvider } from "@/components/ui/sidebar"
import { CodeProvider } from "@/contexts/code-context"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
    title: "AI Coding Agent | Cerebrium",
    description: "AI-powered chat application",
}

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode
}) {
    return (
        <html lang="en">
        <body className={inter.className}>
        <CodeProvider>
            <SidebarProvider>{children}</SidebarProvider>
        </CodeProvider>
        </body>
        </html>
    )
}

