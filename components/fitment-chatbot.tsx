"use client"

import { useState, useRef, useEffect } from "react"
import { useChat } from "@ai-sdk/react"
import { DefaultChatTransport } from "ai"
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

  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  })

  const isLoading = status === "streaming" || status === "submitted"

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || isLoading) return

    const messageText = input.trim()
    setInput("")
    await sendMessage({ text: messageText })
  }

  // Quick action buttons
  const quickActions = [
    "Saya mau upgrade velg dari 16 ke 18 inch",
    "Berapa lebar ban ideal untuk velg 8.5J?",
    "Jelaskan tentang offset/ET",
    "Rekomendasi ban budget untuk daily"
  ]

  const handleQuickAction = async (action: string) => {
    await sendMessage({ text: action })
  }

  // Helper function to extract text from message parts
  const getMessageText = (message: typeof messages[0]): string => {
    if (!message.parts || !Array.isArray(message.parts)) return ""
    return message.parts
      .filter((p): p is { type: "text"; text: string } => p.type === "text")
      .map((p) => p.text)
      .join("")
  }

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 h-14 w-14 rounded-full shadow-lg z-50"
        size="icon"
      >
        <MessageCircle className="h-6 w-6" />
        <span className="sr-only">Buka FitmentBot</span>
      </Button>
    )
  }

  return (
    <Card
      className={cn(
        "fixed bottom-6 right-6 w-96 shadow-2xl z-50 border-border/50 bg-card/95 backdrop-blur transition-all duration-200",
        isMinimized ? "h-14" : "h-[600px]"
      )}
    >
      {/* Header */}
      <CardHeader className="p-3 border-b border-border/50 flex flex-row items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar className="h-8 w-8 bg-primary">
            <AvatarFallback className="bg-primary text-primary-foreground">
              <Bot className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-sm">FitmentBot</CardTitle>
            <p className="text-xs text-muted-foreground">Konsultasi wheel & tire</p>
          </div>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsMinimized(!isMinimized)}
          >
            {isMinimized ? (
              <Maximize2 className="h-4 w-4" />
            ) : (
              <Minimize2 className="h-4 w-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={() => setIsOpen(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      {!isMinimized && (
        <CardContent className="p-0 flex flex-col h-[calc(100%-56px)]">
          {/* Messages */}
          <ScrollArea className="flex-1 p-4" ref={scrollRef}>
            {messages.length === 0 ? (
              <div className="space-y-4">
                {/* Welcome message */}
                <div className="flex gap-3">
                  <Avatar className="h-8 w-8 bg-primary flex-shrink-0">
                    <AvatarFallback className="bg-primary text-primary-foreground">
                      <Bot className="h-4 w-4" />
                    </AvatarFallback>
                  </Avatar>
                  <div className="bg-secondary/50 rounded-lg p-3 max-w-[85%]">
                    <p className="text-sm">
                      Halo! 👋 Saya FitmentBot, asisten kamu untuk konsultasi wheel & tire
                      fitment. Ceritakan mobil kamu dan setup yang kamu inginkan, atau tanya
                      apapun tentang velg dan ban!
                    </p>
                  </div>
                </div>

                {/* Quick actions */}
                <div className="space-y-2 mt-4">
                  <p className="text-xs text-muted-foreground text-center">
                    Pertanyaan populer:
                  </p>
                  <div className="grid gap-2">
                    {quickActions.map((action, i) => (
                      <button
                        key={i}
                        onClick={() => handleQuickAction(action)}
                        className="text-left text-xs p-2 rounded-lg border border-border/50 hover:bg-secondary/50 transition-colors"
                        disabled={isLoading}
                      >
                        {action}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      "flex gap-3",
                      message.role === "user" && "flex-row-reverse"
                    )}
                  >
                    <Avatar
                      className={cn(
                        "h-8 w-8 flex-shrink-0",
                        message.role === "assistant" ? "bg-primary" : "bg-secondary"
                      )}
                    >
                      <AvatarFallback
                        className={
                          message.role === "assistant"
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-secondary-foreground"
                        }
                      >
                        {message.role === "assistant" ? (
                          <Bot className="h-4 w-4" />
                        ) : (
                          <User className="h-4 w-4" />
                        )}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        "rounded-lg p-3 max-w-[85%] text-sm",
                        message.role === "assistant"
                          ? "bg-secondary/50"
                          : "bg-primary text-primary-foreground"
                      )}
                    >
                      <div className="whitespace-pre-wrap">{getMessageText(message)}</div>
                    </div>
                  </div>
                ))}

                {isLoading && (
                  <div className="flex gap-3">
                    <Avatar className="h-8 w-8 bg-primary flex-shrink-0">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        <Bot className="h-4 w-4" />
                      </AvatarFallback>
                    </Avatar>
                    <div className="bg-secondary/50 rounded-lg p-3">
                      <Loader2 className="h-4 w-4 animate-spin" />
                    </div>
                  </div>
                )}
              </div>
            )}
          </ScrollArea>

          {/* Input */}
          <form
            onSubmit={handleSubmit}
            className="p-3 border-t border-border/50 flex gap-2"
          >
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Tanya tentang fitment..."
              disabled={isLoading}
              className="flex-1"
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <Send className="h-4 w-4" />
              <span className="sr-only">Kirim</span>
            </Button>
          </form>
        </CardContent>
      )}
    </Card>
  )
}
