import React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism'

export default function CodePreview({ code, language = 'typescript' }: any) {
    const formatCode = (code: string) => {
        if (!code) return ''

        const lines = code.split('\n')
        const formattedLines = []
        let indentLevel = 0
        const indentSize = 4

        for (const line of lines) {
            const trimmedLine = line.trim()

            if (trimmedLine.match(/^[})\]]/)) {
                indentLevel = Math.max(0, indentLevel - 1)
            }

            if (trimmedLine.length > 0) {
                formattedLines.push(
                    ' '.repeat(indentLevel * indentSize) + trimmedLine
                )
            } else {
                formattedLines.push('')
            }

            if (trimmedLine.match(/[{([]\s*$/)) {
                indentLevel += 1
            }

            if (
                trimmedLine.startsWith('import') &&
                !trimmedLine.endsWith(';')
            ) {
                indentLevel += 1
            }
            if (trimmedLine.endsWith(';') && indentLevel > 0) {
                indentLevel -= 1
            }
        }

        return formattedLines.join('\n')
    }

    const formattedCode = formatCode(code)

    return (
        <ScrollArea className="w-full h-full">
            <div className="relative w-full p-4">
                <SyntaxHighlighter
                    language={language}
                    style={prism}
                    customStyle={{
                        whiteSpace: 'pre-wrap',
                        wordBreak: 'break-word',
                        overflowWrap: 'break-word',
                        width: '100%',
                        height: '100%',
                        margin: 0,
                    }}
                    wrapLines={true}
                    wrapLongLines={true}
                    codeTagProps={{
                        style: {
                            whiteSpace: 'pre-wrap',
                            wordBreak: 'break-word',
                            display: 'block',
                        },
                    }}
                    PreTag={({ children, ...props }) => (
                        <pre {...props} style={{ margin: 0, width: '100%' }}>
                            {children}
                        </pre>
                    )}
                >
                    {formattedCode}
                </SyntaxHighlighter>
            </div>
        </ScrollArea>
    )
}
