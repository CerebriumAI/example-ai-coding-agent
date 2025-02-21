import {
    Sidebar,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
} from '@/components/ui/sidebar'
import { Button } from '@/components/ui/button'
import { PlusCircle, MessageCircle } from 'lucide-react'

interface AppSidebarProps {
    conversations: {
        id: string
        messages: { role: string; content: string }[]
    }[]
    currentConversationId: string | null
    onSelectConversation: (id: string) => void
    onNewConversation: () => void
}

export function AppSidebar({
    conversations,
    currentConversationId,
    onSelectConversation,
    onNewConversation,
}: AppSidebarProps) {
    return (
        <Sidebar>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupLabel>Conversations</SidebarGroupLabel>
                    <SidebarGroupContent>
                        <Button
                            onClick={onNewConversation}
                            className="w-full mb-2"
                        >
                            <PlusCircle className="mr-2 h-4 w-4" />
                            New Conversation
                        </Button>
                        <SidebarMenu>
                            {conversations.map((conversation) => (
                                <SidebarMenuItem key={conversation.id}>
                                    <SidebarMenuButton
                                        onClick={() =>
                                            onSelectConversation(
                                                conversation.id
                                            )
                                        }
                                        isActive={
                                            conversation.id ===
                                            currentConversationId
                                        }
                                    >
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        <span>
                                            {conversation.messages.length > 0
                                                ? conversation.messages[0].content.slice(
                                                      0,
                                                      20
                                                  ) + '...'
                                                : 'New Conversation'}
                                        </span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
        </Sidebar>
    )
}
