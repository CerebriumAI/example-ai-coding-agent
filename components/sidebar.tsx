import { Button } from '@/components/ui/button'
import { ScrollArea } from '@/components/ui/scroll-area'
import { PlusCircle, MessageCircle } from 'lucide-react'

interface SidebarProps {
    conversations: {
        id: string
        messages: { role: string; content: string }[]
    }[]
    currentConversationId: string | null
    onSelectConversation: (id: string) => void
    onNewConversation: () => void
}

export function Sidebar({
    conversations,
    currentConversationId,
    onSelectConversation,
    onNewConversation,
}: SidebarProps) {
    return (
        <div className="flex h-full w-full flex-col border-r border-border">
            <div className="flex items-center justify-between px-4 py-2">
                <h2 className="text-lg font-semibold">Conversations</h2>
                <Button onClick={onNewConversation} size="sm">
                    <PlusCircle className="mr-2 h-4 w-4" />
                    New
                </Button>
            </div>
            <ScrollArea className="flex-1">
                <div className="px-2">
                    {conversations.map((conversation) => (
                        <Button
                            key={conversation.id}
                            onClick={() =>
                                onSelectConversation(conversation.id)
                            }
                            variant={
                                conversation.id === currentConversationId
                                    ? 'secondary'
                                    : 'ghost'
                            }
                            className="w-full justify-start mb-1"
                        >
                            <MessageCircle className="mr-2 h-4 w-4" />
                            <span className="truncate">
                                {conversation.messages.length > 0
                                    ? conversation.messages[0].content.slice(
                                          0,
                                          20
                                      ) + '...'
                                    : 'New Conversation'}
                            </span>
                        </Button>
                    ))}
                </div>
            </ScrollArea>
        </div>
    )
}
