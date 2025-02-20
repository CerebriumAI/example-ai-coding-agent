"use client"

import type React from "react"

import { useRef, useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Send, FileCode } from "lucide-react"
import { useCode } from "@/contexts/code-context"
import { MarkdownContent } from "@/components/markdown-content"

interface Message {
    id: string
    role: string
    content: string
    type?: string
    fragmentId?: string
}

interface ChatProps {
    messages: Message[]
    onSendMessage: (message: string) => void
    isLoading: boolean
    status: string | null
}

export function Chat({ messages, onSendMessage, isLoading, status }: ChatProps) {
    const [input, setInput] = useState("")
    const messagesEndRef = useRef<HTMLDivElement>(null)
    const { toggleCode, fragments } = useCode()

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }

    useEffect(() => {
        scrollToBottom()
    }, [messages])

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        if (input.trim() && !isLoading) {
            onSendMessage(input.trim())
            setInput("")
        }
    }

    const renderMessage = (message: Message) => {
        if (message.role === "user") {
            return (
                <div key={message.id} className="flex justify-end mb-4">
                    <div className="bg-primary text-primary-foreground rounded-lg p-4 max-w-[80%]">{message.content}</div>
                </div>
            )
        }

        if (message.type === "code") {
            const fragment = fragments.find((f) => f.id === message.fragmentId)
            return (
                <div key={message.id} className="flex mb-4">
                    <div
                        className="bg-secondary hover:bg-secondary/90 cursor-pointer rounded-lg p-4 max-w-[80%] space-y-2"
                        onClick={toggleCode}
                    >
                        <div className="flex items-center gap-2 text-sm font-medium">
                            <FileCode className="h-4 w-4" />
                            <span>{fragment?.file_path || "Code"}</span>
                        </div>
                        <div className="text-sm text-muted-foreground font-mono">
                            {message.content
                                .split("\n")
                                .slice(0, 3)
                                .map((line, i) => (
                                    <div key={i} className="truncate">
                                        {line}
                                    </div>
                                ))}
                            {message.content.split("\n").length > 3 && (
                                <div className="text-xs text-muted-foreground mt-1">
                                    {message.content.split("\n").length - 3} more lines
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )
        }

        return (
            <div key={message.id} className="flex mb-4">
                <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                    <MarkdownContent content={message.content} />
                </div>
            </div>
        )
    }

    return (
        <div className="flex h-full overflow-hidden w-full flex-grow flex-col justify-between">
            <div className="h-full overflow-y-auto flex-grow">
                <div className="space-y-4 p-4">
                    {messages.map(renderMessage)}
                    {isLoading && (
                        <div className="flex mb-4">
                            <div className="bg-muted rounded-lg p-4 max-w-[80%]">
                                <div className="flex items-center gap-2">
                                    <div className="h-4 w-4 rounded-full bg-secondary animate-pulse" />
                                    <div className="text-sm text-muted-foreground">{status || "Processing..."}</div>
                                </div>
                            </div>
                        </div>
                    )}
                    <div ref={messagesEndRef} />
                </div>
            </div>
            <div className="flex flex-shrink-0 space-x-2 p-4 border-t bg-background">
                <form onSubmit={handleSubmit} className="flex flex-1 space-x-2">
                    <Input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Type your message..."
                        disabled={isLoading}
                        className="flex-1"
                    />
                    <Button type="submit" disabled={isLoading}>
                        <Send className="h-4 w-4" />
                        <span className="sr-only">Send</span>
                    </Button>
                </form>
            </div>
        </div>
    )
}