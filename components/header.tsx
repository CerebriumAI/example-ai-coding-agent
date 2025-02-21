import { Wifi, WifiOff } from 'lucide-react'
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Menu } from 'lucide-react'
import { Sidebar } from './sidebar'

interface HeaderProps {
    isConnected: boolean
    conversations: {
        id: string
        messages: { role: string; content: string }[]
    }[]
    currentConversationId: string | null
    onSelectConversation: (id: string) => void
    onNewConversation: () => void
}

export function Header({
    isConnected,
    conversations,
    currentConversationId,
    onSelectConversation,
    onNewConversation,
}: HeaderProps) {
    return (
        <header className="py-4 h-16 border-b border-border">
            <div className="px-4 flex justify-between items-center">
                <div className="flex items-center">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="mr-2 md:hidden"
                            >
                                <Menu className="h-[1.2rem] w-[1.2rem]" />
                                <span className="sr-only">Toggle menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent
                            side="left"
                            className="w-[300px] sm:w-[400px]"
                        >
                            <Sidebar
                                conversations={conversations}
                                currentConversationId={currentConversationId}
                                onSelectConversation={onSelectConversation}
                                onNewConversation={onNewConversation}
                            />
                        </SheetContent>
                    </Sheet>
                    <h1 className="text-2xl font-bold">AI Coding Agent</h1>
                </div>
                <div className="flex items-center">
                    {isConnected ? (
                        <Wifi className="text-green-400" />
                    ) : (
                        <WifiOff className="text-red-400" />
                    )}
                    <span className="ml-2">
                        {isConnected ? 'Connected' : 'Disconnected'}
                    </span>
                </div>
            </div>
        </header>
    )
}
