'use client'

import { useCallback, useEffect, useState } from 'react'
import { Chat } from '@/components/chat'
import { Header } from '@/components/header'
import { AppSidebar } from '@/components/app-sidebar'
import { CodeSidebar } from '@/components/code-sidebar'
import { useCode } from '@/contexts/code-context'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface Message {
    id: string
    role: string
    content: string
    type?: string
    fragmentId?: string
}

interface Conversation {
    id: string
    messages: Message[]
    socket: WebSocket | null
}

const Page = () => {
    const [conversations, setConversations] = useState<Conversation[]>([])
    const [currentConversationId, setCurrentConversationId] = useState<
        string | null
    >(null)
    const [isLoading, setIsLoading] = useState(false)
    const [status, setStatus] = useState<string | null>(null)
    const { setFragments, updateCode, isCodeOpen, syncWithLocalStorage } =
        useCode()

    useEffect(() => {
        const savedConversations = localStorage.getItem('conversations')
        if (savedConversations) {
            const parsedConversations = JSON.parse(savedConversations)
            setConversations(
                parsedConversations.map((conv: Conversation) => ({
                    ...conv,
                    socket: null,
                }))
            )

            const lastActiveConversation =
                localStorage.getItem('activeConversation')
            if (lastActiveConversation) {
                setCurrentConversationId(lastActiveConversation)
            }
        }
    }, [])

    useEffect(() => {
        localStorage.setItem(
            'conversations',
            JSON.stringify(conversations.map(({ ...conv }) => conv))
        )
    }, [conversations])

    const handleConversationSwitch = useCallback(
        (conversationId: string) => {
            setCurrentConversationId(conversationId)
            localStorage.setItem('activeConversation', conversationId)
            syncWithLocalStorage(conversationId)
        },
        [syncWithLocalStorage]
    )

    useEffect(() => {
        if (currentConversationId) {
            handleConversationSwitch(currentConversationId)
        }
    }, [currentConversationId, handleConversationSwitch])

    const createWebSocket = (conversationId: string) => {
        const ws = new WebSocket(
            process.env.NEXT_PUBLIC_CEREBRIUM_SOCKET_URL || ''
        )

        ws.onopen = () => {
            console.log(
                `WebSocket connected for conversation ${conversationId}`
            )
        }

        ws.onmessage = (event) => {
            const data = JSON.parse(event.data)
            handleIncomingMessage(conversationId, data)
        }

        ws.onclose = () => {
            console.log(`WebSocket closed for conversation ${conversationId}`)
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === conversationId
                        ? {
                              ...conv,
                              socket: null,
                          }
                        : conv
                )
            )
        }

        ws.onerror = (error) => {
            console.error(
                `WebSocket error for conversation ${conversationId}:`,
                error
            )
        }

        return ws
    }

    const handleIncomingMessage = (conversationId: string, data: any) => {
        if (data.type === 'fragment_structure') {
            setFragments(data.content)
            if (data.content.length === 1) {
                const firstFragment = data.content[0]
                updateCode(firstFragment.id, '')
            }
        } else if (data.type === 'status') {
            setStatus(data.content)
        } else if (
            data.type.startsWith('context_') ||
            data.type.startsWith('code_') ||
            data.type === 'token'
        ) {
            setConversations((prevConversations) => {
                return prevConversations.map((conv) => {
                    if (conv.id !== conversationId) return conv

                    const messages = [...conv.messages]
                    const messageType = data.type.startsWith('code_')
                        ? 'code'
                        : data.type.startsWith('context_')
                          ? 'context'
                          : undefined
                    const fragmentId =
                        data.type.startsWith('code_') ||
                        data.type.startsWith('context_')
                            ? data.type.split('_')[1]
                            : undefined

                    const existingMessageIndex = messages.findIndex(
                        (m) =>
                            m.type === messageType &&
                            m.fragmentId === fragmentId
                    )

                    if (existingMessageIndex !== -1) {
                        messages[existingMessageIndex] = {
                            ...messages[existingMessageIndex],
                            content:
                                messageType === 'context'
                                    ? data.content
                                    : messages[existingMessageIndex].content +
                                      data.content,
                        }
                    } else {
                        messages.push({
                            id: `${Date.now()}-${Math.random()}`,
                            role: 'assistant',
                            content: data.content,
                            type: messageType,
                            fragmentId,
                        })
                    }

                    return { ...conv, messages }
                })
            })

            if (data.type.startsWith('code_')) {
                const fragmentId = data.type.replace('code_', '')
                updateCode(fragmentId, data.content)
            }
        } else if (data.type === 'preview_url') {
            const previewMessage = {
                id: `${Date.now()}-${Math.random()}`,
                role: 'assistant',
                content: `Your code has been deployed! You can view the preview here: [Preview](https://${data.content})`,
                type: 'preview',
            }

            setConversations((prevConversations) => {
                return prevConversations.map((conv) => {
                    if (conv.id === conversationId) {
                        return {
                            ...conv,
                            messages: [...conv.messages, previewMessage],
                        }
                    }
                    return conv
                })
            })
            setIsLoading(false)
            setStatus(null)
        }

        if (data.type === 'done') {
            setIsLoading(false)
            setStatus(null)
        }
    }

    const sendMessage = (message: string) => {
        if (!currentConversationId) return

        setIsLoading(true)
        setStatus('Processing...')

        const currentConversation = conversations.find(
            (conv) => conv.id === currentConversationId
        )
        if (!currentConversation) return

        const userMessage = {
            id: `${Date.now()}-${Math.random()}`,
            role: 'user',
            content: message,
        }

        setConversations((prev) =>
            prev.map((conv) =>
                conv.id === currentConversationId
                    ? { ...conv, messages: [...conv.messages, userMessage] }
                    : conv
            )
        )

        if (
            !currentConversation.socket ||
            currentConversation.socket.readyState !== WebSocket.OPEN
        ) {
            const newSocket = createWebSocket(currentConversationId)
            setConversations((prev) =>
                prev.map((conv) =>
                    conv.id === currentConversationId
                        ? { ...conv, socket: newSocket }
                        : conv
                )
            )
            newSocket.onopen = () => {
                newSocket.send(
                    JSON.stringify({
                        prompt: message,
                        history: currentConversation.messages,
                    })
                )
            }
        } else {
            currentConversation.socket.send(
                JSON.stringify({
                    prompt: message,
                    history: currentConversation.messages,
                })
            )
        }
    }

    const createNewConversation = () => {
        const newId = Date.now().toString()
        setConversations((prev) => [
            ...prev,
            { id: newId, messages: [], socket: null },
        ])
        handleConversationSwitch(newId)
    }

    const currentConversation = conversations.find(
        (conv) => conv.id === currentConversationId
    )

    return (
        <div className="flex h-screen w-screen">
            <AppSidebar
                conversations={conversations}
                currentConversationId={currentConversationId}
                onSelectConversation={handleConversationSwitch}
                onNewConversation={createNewConversation}
            />
            <div className="flex flex-col w-full justify-between">
                <Header
                    isConnected={!!currentConversation?.socket}
                    conversations={conversations}
                    currentConversationId={currentConversationId}
                    onSelectConversation={handleConversationSwitch}
                    onNewConversation={createNewConversation}
                />
                <div className="flex-grow w-full h-full overflow-hidden">
                    <div className="w-full h-full grid grid-cols-2">
                        <main
                            className={cn(
                                'h-full w-full transition-all overflow-scroll flex flex-col duration-200 ease-in-out',
                                isCodeOpen ? 'col-span-1' : 'col-span-2'
                            )}
                        >
                            {currentConversation ? (
                                <Chat
                                    messages={currentConversation.messages}
                                    onSendMessage={sendMessage}
                                    isLoading={isLoading}
                                    status={status}
                                />
                            ) : (
                                <div className="flex items-center justify-center h-full">
                                    <Button onClick={createNewConversation}>
                                        Start a new conversation
                                    </Button>
                                </div>
                            )}
                        </main>
                        {isCodeOpen && (
                            <div className="h-full border-l col-span-1 overflow-hidden">
                                <CodeSidebar />
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Page
