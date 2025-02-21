import React, { useMemo } from 'react';
import { FileCode } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { prism } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { useCode } from "@/contexts/code-context";

const CodeMessagePreview = ({ message, fragment, toggleCode }) => {
    const { code } = useCode();
    const codeContent = message.fragmentId ? code[message.fragmentId] : '';

    const previewContent = useMemo(() => {
        if (!codeContent) return '';
        const lines = codeContent.split('\n').filter(line => line.trim().length > 0);
        return lines.slice(0, 3).join('\n');
    }, [codeContent]);

    const totalLines = useMemo(() => {
        if (!codeContent) return 0;
        return codeContent.split('\n').filter(line => line.trim().length > 0).length;
    }, [codeContent]);

    const remainingLines = Math.max(0, totalLines - 3);

    return (
        <div
            key={message.id}
            className="flex mb-4"
        >
            <div
                className="bg-secondary hover:bg-secondary/90 cursor-pointer rounded-lg p-4 max-w-[80%] w-full space-y-2"
                onClick={toggleCode}
            >
                <div className="flex items-center gap-2 text-sm font-medium">
                    <FileCode className="h-4 w-4" />
                    <span>{fragment?.file_path || "Code"}</span>
                </div>
                <div className="text-sm text-muted-foreground font-mono overflow-hidden rounded bg-secondary/50">
                    {codeContent ? (
                        <>
                            <SyntaxHighlighter
                                language="typescript"
                                style={prism}
                                customStyle={{
                                    margin: 0,
                                    padding: '8px',
                                    backgroundColor: 'transparent',
                                    fontSize: '0.875rem'
                                }}
                            >
                                {previewContent}
                            </SyntaxHighlighter>
                            {remainingLines > 0 && (
                                <div className="text-xs text-muted-foreground mt-1 pl-2 pb-1">
                                    {remainingLines} more lines
                                </div>
                            )}
                        </>
                    ) : (
                        <div className="p-4 space-y-3">
                            <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                            <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default CodeMessagePreview;