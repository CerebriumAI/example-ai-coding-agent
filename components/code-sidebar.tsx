"use client"

import { useCode } from "@/contexts/code-context"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Button } from "@/components/ui/button"
import { ChevronDown, File, Folder, Code2, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface FileTreeItem {
    id: string
    title: string
    file_path: string
}

export function CodeSidebar() {
    const { fragments, codes, isCodeOpen, toggleCode, activeFileId, setActiveFileId } = useCode()

    if (!isCodeOpen) return null

    const getFilePathParts = (path: string) => {
        return path.split("/").filter(Boolean)
    }

    const organizeFiles = (files: FileTreeItem[]) => {
        const fileTree: { [key: string]: FileTreeItem[] } = {}

        files.forEach((file) => {
            const parts = getFilePathParts(file.file_path)
            const folder = parts.length > 1 ? parts[0] : ""
            if (!fileTree[folder]) {
                fileTree[folder] = []
            }
            fileTree[folder].push(file)
        })

        return fileTree
    }

    const organizedFiles = organizeFiles(fragments)
    const activeFile = fragments.find((f) => f.id === activeFileId)
    const isGenerating = activeFileId && !codes[activeFileId]

    return (
        <div className="flex h-full flex-col">
            <div className="flex h-12 items-center border-b border-border bg-sidebar px-2">
                <div className="flex items-center gap-2 px-4 font-medium">
                    <Code2 className="h-4 w-4" />
                    Code
                </div>
                <div className="flex-1" />
                <Button variant="ghost" size="icon" className="h-8 w-8" onClick={toggleCode}>
                    <X className="h-4 w-4" />
                    <span className="sr-only">Close</span>
                </Button>
            </div>

            <div className="flex flex-1 overflow-hidden">
                <div className="flex w-full justify-between h-full overflow-hidden">
                    {/* File tree */}
                    <div className="w-80 border-r border-border">
                        <ScrollArea className="h-full">
                            <div className="p-2">
                                {Object.entries(organizedFiles).map(([folder, files]) => (
                                    <div key={folder || "root"} className="space-y-1">
                                        {folder && (
                                            <div className="flex items-center gap-2 px-2 py-1.5 text-sm text-muted-foreground">
                                                <Folder className="h-4 w-4" />
                                                <span>{folder}</span>
                                                <ChevronDown className="h-4 w-4 ml-auto" />
                                            </div>
                                        )}
                                        <div className={cn("space-y-1", folder && "ml-3")}>
                                            {files.map((file) => (
                                                <Button
                                                    key={file.id}
                                                    variant="ghost"
                                                    className={cn(
                                                        "w-full justify-start gap-2 px-2 py-1.5 text-sm",
                                                        activeFileId === file.id && "bg-muted",
                                                    )}
                                                    onClick={() => setActiveFileId(file.id)}
                                                >
                                                    <File className="h-4 w-4" />
                                                    <span className="truncate">
                            {folder ? getFilePathParts(file.file_path).slice(1).join("/") : file.file_path}
                          </span>
                                                </Button>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </ScrollArea>
                    </div>

                    {/* Code View */}
                    {activeFile && (
                        <div className="flex flex-grow flex-col overflow-hidden">
                            <div className="px-4 py-2 text-sm text-muted-foreground border-b">{activeFile.file_path}</div>
                            <ScrollArea className="flex-1" orientation="both">
                                {isGenerating ? (
                                    <div className="p-4 space-y-3">
                                        <div className="h-4 w-3/4 bg-muted animate-pulse rounded" />
                                        <div className="h-4 w-1/2 bg-muted animate-pulse rounded" />
                                        <div className="h-4 w-2/3 bg-muted animate-pulse rounded" />
                                    </div>
                                ) : (
                                    <pre className="p-4 whitespace-pre-wrap break-all">
                    <code className="text-sm font-mono">{codes[activeFileId]}</code>
                  </pre>
                                )}
                            </ScrollArea>
                        </div>
                    )}
                    {!activeFile && (
                        <div className="flex items-center justify-center flex-1 text-muted-foreground">
                            Select a file to view its contents
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}