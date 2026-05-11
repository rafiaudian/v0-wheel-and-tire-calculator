"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Bot, User, Send, MessageCircle, X, Minimize2, Maximize2, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function FitmentChatbot() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [input, setInput] = useState("")
  const scrollRef = useRef<HTMLDivElement>(null)

  const { messages, append, status } = useChat({
    api: "/api/chat",
  })

  const isLoading = status === "streaming" || status === "submitted"

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return
    await append({ content: input, role: 'user' })
    setInput("")
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-4 right-4 rounded-full w-12 h-12 shadow-lg z-50 bg-primary hover:bg-primary/90"
      >
        <MessageCircle className="w-6 h-6" />
      </Button>
    )
  }

  return (
    <Card className={cn(
      "fixed bottom-4 right-4 z-50 shadow-2xl transition-all duration-300 border-primary/20 bg-background",
      isMinimized ? "w-72 h-14" : "w-[350px] sm:w-[400px] h-[500px] flex flex-col"
    )}>
      <CardHeader className="p-3 bg-primary text-primary-foreground flex flex-row items-center justify-between rounded-t-xl">
        <div className="flex items-center gap-2">
          <Bot className="w-5 h-5" />
          <CardTitle className="text-sm font-bold">FitmentBot AI</CardTitle>
        </div>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground" onClick={() => setIsMinimized(!isMinimized)}>
            {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
          </Button>
          <Button variant="ghost" size="icon" className="h-8 w-8 text-primary-foreground" onClick={() => setIsOpen(false)}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <div className="flex-1 flex flex-col min-h-0">
          <CardContent className="flex-1 overflow-hidden p-0 flex flex-col bg-muted/30">
            <ScrollArea className="flex-1 p-4">
              <div ref={scrollRef} className="space-y-4">
                {messages.length === 0 && (
                  <div className="bg-background border rounded-lg p-3 text-sm text-muted-foreground text-center italic">
                    Halo! Saya FitmentBot. Ada yang bisa saya bantu?
                  </div>
                )}
                {messages.map((m) => (
                  <div key={m.id} className={cn("flex items-start gap-2", m.role === "user" ? "flex-row-reverse" : "flex-row")}>
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback className={m.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"}>
                        {m.role === "user" ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                      </AvatarFallback>
                    </Avatar>
                    <div className={cn("max-w-[80%] rounded-lg p-3 text-sm shadow-sm", m.role === "user" ? "bg-primary text-primary-foreground" : "bg-background border")}>
                      {m.content}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-start gap-2">
                    <Avatar className="w-8 h-8 border">
                      <AvatarFallback className="bg-muted">
                        <Bot className="w-4 h-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-background border rounded-lg p-3">
                      <Loader2 className="w-4 h-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>
            <form onSubmit={handleSubmit} className="p-3 bg-background border-t flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Tanya FitmentBot..."
                className="flex-1"
                disabled={isLoading}
              />
              <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
                <Send className="w-4 h-4" />
              </Button>
            </form>
          </CardContent>
        </div>
      )}
    </Card>
  )
}
