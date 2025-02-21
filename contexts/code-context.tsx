'use client'

import {
    createContext,
    PropsWithChildren,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react'

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
    code: Record<string, string>
    isCodeOpen: boolean
    activeFileId: string | null
    setFragments: (fragments: Fragment[]) => void
    updateCode: (id: string, content: string) => void
    toggleCode: () => void
    setActiveFileId: (id: string | null) => void
    syncWithLocalStorage: (conversationId: string) => void
}

interface StoredCodeData {
    fragments: Fragment[]
    code: Record<string, string>
}

const STORAGE_PREFIX = 'code_data_'

const CodeContext = createContext<CodeContextType | undefined>(undefined)

export function CodeProvider({ children }: PropsWithChildren) {
    const [fragments, setFragments] = useState<Fragment[]>([])
    const [code, setCode] = useState<Record<string, string>>({})
    const [isCodeOpen, setIsCodeOpen] = useState(false)
    const [activeFileId, setActiveFileId] = useState<string | null>(null)

    const loadFromStorage = useCallback((conversationId: string) => {
        try {
            const storedData = localStorage.getItem(
                `${STORAGE_PREFIX}${conversationId}`
            )
            if (storedData) {
                const parsedData: StoredCodeData = JSON.parse(storedData)
                setFragments(parsedData.fragments || [])
                setCode(parsedData.code || {})
            } else {
                setFragments([])
                setCode({})
            }
        } catch (error) {
            console.error('Error loading code data from storage:', error)
            // Reset state on error
            setFragments([])
            setCode({})
        }
    }, [])

    // Save current state to localStorage
    const saveToStorage = useCallback(
        (conversationId: string) => {
            try {
                const dataToStore: StoredCodeData = {
                    fragments,
                    code,
                }
                localStorage.setItem(
                    `${STORAGE_PREFIX}${conversationId}`,
                    JSON.stringify(dataToStore)
                )
            } catch (error) {
                console.error('Error saving code data to storage:', error)
            }
        },
        [fragments, code]
    )

    const updateCode = useCallback((id: string, content: string) => {
        setCode((prev) => {
            const updated = { ...prev, [id]: content }
            return updated
        })
        setIsCodeOpen(true)
        setActiveFileId(id)
    }, [])

    const toggleCode = useCallback(() => {
        setIsCodeOpen((prev) => !prev)
    }, [])

    // Function to sync context with localStorage for a specific conversation
    const syncWithLocalStorage = useCallback(
        (conversationId: string) => {
            if (!conversationId) {
                setFragments([])
                setCode({})
                return
            }
            loadFromStorage(conversationId)
        },
        [loadFromStorage]
    )

    useEffect(() => {
        const activeConversation = localStorage.getItem('activeConversation')
        if (
            activeConversation &&
            (fragments.length > 0 || Object.keys(code).length > 0)
        ) {
            saveToStorage(activeConversation)
        }
    }, [fragments, code, saveToStorage])

    const contextValue: CodeContextType = {
        fragments,
        code,
        isCodeOpen,
        activeFileId,
        setFragments,
        updateCode,
        toggleCode,
        setActiveFileId,
        syncWithLocalStorage,
    }

    return (
        <CodeContext.Provider value={contextValue}>
            {children}
        </CodeContext.Provider>
    )
}

export function useCode() {
    const context = useContext(CodeContext)
    if (context === undefined) {
        throw new Error('useCode must be used within a CodeProvider')
    }
    return context
}
