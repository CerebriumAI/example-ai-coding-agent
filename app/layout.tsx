import type React, {PropsWithChildren} from "react"
import type {Metadata} from "next"
import {Inter} from "next/font/google"
import "./globals.css"
import {SidebarProvider} from "@/components/ui/sidebar"
import {CodeProvider} from "@/contexts/code-context"
import {Analytics} from "@vercel/analytics/react"

const inter = Inter({subsets: ["latin"]})

export const metadata: Metadata = {
    title: "AI Coding Agent | Cerebrium",
    description: "AI-powered Coding Agent"
}

const Layout = ({children}: PropsWithChildren) => {
    return (
        <html lang="en">
        <body className={inter.className}>
        <CodeProvider>
            <SidebarProvider>{children}</SidebarProvider>
            <Analytics/>
        </CodeProvider>
        </body>
        </html>
    )
}

export default Layout;

