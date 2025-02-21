'use client'

import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

interface MarkdownContentProps {
    content: string
    className?: string
}

export function MarkdownContent({ content, className }: MarkdownContentProps) {
    return (
        <ReactMarkdown
            className={cn(
                'prose prose-sm dark:prose-invert max-w-none',
                'prose-headings:font-semibold prose-headings:tracking-tight',
                'prose-p:leading-normal',
                'prose-code:rounded prose-code:bg-muted prose-code:p-1',
                'prose-pre:bg-muted prose-pre:rounded-lg',
                className
            )}
            remarkPlugins={[remarkGfm]}
            components={{
                code({ children, ...props }) {
                    return (
                        <code
                            className="bg-muted px-1 py-0.5 rounded"
                            {...props}
                        >
                            {children}
                        </code>
                    )
                },
            }}
        >
            {content}
        </ReactMarkdown>
    )
}
