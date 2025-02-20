"use client"

import { createContext, useContext, useState, type ReactNode } from "react"

interface Fragment {
    id: string
    title: string
    description: string
    file_path: string
    dependencies: string[]
    port: number
}

interface CodeContextType {
    fragments: Fragment[]
    codes: Record<string, string>
    isCodeOpen: boolean
    activeFileId: string | null
    setFragments: (fragments: Fragment[]) => void
    updateCode: (id: string, content: string) => void
    toggleCode: () => void
    setActiveFileId: (id: string | null) => void
}

const CodeContext = createContext<CodeContextType | undefined>(undefined)

export function CodeProvider({ children }: { children: ReactNode }) {
    const [fragments, setFragments] = useState<Fragment[]>([])
    const [codes, setCodes] = useState<Record<string, string>>({})
    const [isCodeOpen, setIsCodeOpen] = useState(false)
    const [activeFileId, setActiveFileId] = useState<string | null>(null)

    const updateCode = (id: string, content: string) => {
        setCodes((prev) => ({ ...prev, [id]: content }))
        setIsCodeOpen(true)
        setActiveFileId(id)
    }

    const toggleCode = () => {
        setIsCodeOpen((prev) => !prev)
    }

    return (
        <CodeContext.Provider
            value={{
                fragments,
                codes,
                isCodeOpen,
                activeFileId,
                setFragments,
                updateCode,
                toggleCode,
                setActiveFileId,
            }}
        >
            {children}
        </CodeContext.Provider>
    )
}

export function useCode() {
    const context = useContext(CodeContext)
    if (context === undefined) {
        throw new Error("useCode must be used within a CodeProvider")
    }
    return context
}