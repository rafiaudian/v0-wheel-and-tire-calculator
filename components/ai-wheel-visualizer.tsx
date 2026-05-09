"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Copy, Check, Wand2, Loader2, ImageIcon, AlertCircle, Download, RefreshCw } from "lucide-react"
import Image from "next/image"
import type { TireSpec, WheelSpec } from "@/lib/fitment-data"

interface AIWheelVisualizerProps {
  tire: TireSpec
  wheel: WheelSpec
  wheelBrand: string
  wheelModel: string
  tireBrand: string
  tireModel: string
  spokeCount: number
  wheelColor: string
}

export function AIWheelVisualizer({
  tire,
  wheel,
  wheelBrand,
  wheelModel,
  tireBrand,
  tireModel,
  spokeCount,
  wheelColor
}: AIWheelVisualizerProps) {
  const [copied, setCopied] = useState(false)
  const [showPrompt, setShowPrompt] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generatedImages, setGeneratedImages] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)
  const [usedPrompt, setUsedPrompt] = useState<string>("")

  // Generate AI prompt
  const generatePrompt = () => {
    const tireSize = `${tire.width}/${tire.profile}R${tire.diameter}`
    const wheelSize = `${wheel.width}J x R${wheel.diameter}`
    const offsetStr = `ET${wheel.offset > 0 ? "+" : ""}${wheel.offset}`

    return `Generate a highly detailed, photorealistic image of a car wheel and tire setup:

WHEEL: ${wheelBrand || "JDM style"} ${wheelModel || "racing wheel"}, ${wheelSize}, ${offsetStr}, ${spokeCount} spokes, ${wheelColor || "Gunmetal grey"} finish, PCD ${wheel.pcd}

TIRE: ${tireBrand || "Performance"} ${tireModel || "Sport"}, ${tireSize}, Ultra High Performance

IMAGE STYLE:
- Front 3/4 angle view showing wheel face and tire sidewall
- Professional studio lighting, dark gradient background
- 4K quality, sharp focus on wheel details
- Tire sidewall shows "${tireSize}" size marking
${tireBrand ? `- Tire shows "${tireBrand.toUpperCase()}" branding on sidewall` : ""}
${wheelBrand ? `- Wheel shows "${wheelBrand.toUpperCase()}" on center cap or spokes` : ""}
- Premium automotive product photography style
- Authentic JDM racing wheel aesthetics with metallic reflections`
  }

  const prompt = generatePrompt()

  // Generate image using Gemini API
  const generateImage = async () => {
    setIsGenerating(true)
    setError(null)
    setGeneratedImages([])
    setUsedPrompt(prompt)

    try {
      const response = await fetch("/api/generate-wheel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          tire,
          wheel,
          wheelBrand,
          wheelModel,
          tireBrand,
          tireModel,
          spokeCount,
          wheelColor,
        }),
      })

      const data = await response.json()

      if (!response.ok || !data.success) {
        throw new Error(data.error || "Gagal generate gambar")
      }

      if (data.images && data.images.length > 0) {
        setGeneratedImages(data.images)
      } else {
        // If no images but text response, show info
        setError("Model berhasil diproses tetapi tidak menghasilkan gambar. Coba lagi atau gunakan prompt manual.")
      }
    } catch (err) {
      console.error("[v0] Generate image error:", err)
      setError(err instanceof Error ? err.message : "Terjadi kesalahan saat generate gambar")
    } finally {
      setIsGenerating(false)
    }
  }

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      const textarea = document.createElement("textarea")
      textarea.value = prompt
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand("copy")
      document.body.removeChild(textarea)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const downloadImage = (imageUrl: string, index: number) => {
    const link = document.createElement("a")
    link.href = imageUrl
    link.download = `wheel-${wheelBrand || "custom"}-${wheelModel || "design"}-${index + 1}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Visualization
          <Badge variant="secondary" className="ml-2 text-xs">
            Gemini AI
          </Badge>
        </CardTitle>
        <CardDescription>
          Generate gambar realistis wheel & tire kamu secara otomatis dengan Gemini AI
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Quick summary */}
        <div className="p-4 rounded-lg bg-secondary/30 border border-border/50">
          <h4 className="text-sm font-semibold mb-2">Setup yang akan di-generate:</h4>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Velg:</span>
              <p className="font-mono font-semibold">
                {wheelBrand || "Custom"} {wheelModel || "Wheel"}
              </p>
              <p className="text-xs text-muted-foreground">
                {wheel.width}J x R{wheel.diameter} ET{wheel.offset > 0 ? "+" : ""}{wheel.offset}
              </p>
            </div>
            <div>
              <span className="text-muted-foreground">Ban:</span>
              <p className="font-mono font-semibold">
                {tireBrand || "Performance"} {tireModel || "Tire"}
              </p>
              <p className="text-xs text-muted-foreground">
                {tire.width}/{tire.profile}R{tire.diameter}
              </p>
            </div>
          </div>
        </div>

        {/* Main generate button */}
        <Button
          onClick={generateImage}
          disabled={isGenerating}
          className="w-full h-12 text-base bg-primary hover:bg-primary/90"
          size="lg"
        >
          {isGenerating ? (
            <>
              <Loader2 className="h-5 w-5 mr-2 animate-spin" />
              Generating dengan Gemini AI...
            </>
          ) : (
            <>
              <ImageIcon className="h-5 w-5 mr-2" />
              Generate Visualisasi dengan AI
            </>
          )}
        </Button>

        {/* Error display */}
        {error && (
          <div className="p-4 rounded-lg bg-destructive/10 border border-destructive/30 flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-medium text-destructive">Gagal Generate Gambar</p>
              <p className="text-xs text-muted-foreground mt-1">{error}</p>
              <Button
                variant="outline"
                size="sm"
                className="mt-2"
                onClick={() => setShowPrompt(true)}
              >
                Gunakan Prompt Manual
              </Button>
            </div>
          </div>
        )}

        {/* Generated images display */}
        {generatedImages.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-sm font-semibold flex items-center gap-2">
                <Check className="h-4 w-4 text-green-500" />
                Hasil Visualisasi
              </h4>
              <Button
                variant="ghost"
                size="sm"
                onClick={generateImage}
                disabled={isGenerating}
              >
                <RefreshCw className={`h-4 w-4 mr-1 ${isGenerating ? "animate-spin" : ""}`} />
                Generate Ulang
              </Button>
            </div>
            <div className="grid gap-4">
              {generatedImages.map((imageUrl, index) => (
                <div key={index} className="relative group rounded-lg overflow-hidden border border-border/50">
                  <Image
                    src={imageUrl}
                    alt={`Generated wheel visualization ${index + 1}`}
                    width={800}
                    height={600}
                    className="w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => downloadImage(imageUrl, index)}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-xs text-muted-foreground text-center">
              {wheelBrand} {wheelModel} dengan {tireBrand} {tireModel} {tire.width}/{tire.profile}R{tire.diameter}
            </p>
          </div>
        )}

        {/* Secondary action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowPrompt(!showPrompt)}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {showPrompt ? "Sembunyikan" : "Lihat Prompt"}
          </Button>
          <Button
            onClick={copyToClipboard}
            variant="outline"
            size="sm"
            className="flex-1"
          >
            {copied ? (
              <>
                <Check className="h-4 w-4 mr-2 text-green-500" />
                Tersalin!
              </>
            ) : (
              <>
                <Copy className="h-4 w-4 mr-2" />
                Copy Prompt
              </>
            )}
          </Button>
        </div>

        {/* Prompt display */}
        {showPrompt && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">AI Prompt:</label>
              <Badge variant="outline" className="text-xs">
                {prompt.length} characters
              </Badge>
            </div>
            <Textarea
              value={prompt}
              readOnly
              className="min-h-[150px] font-mono text-xs bg-secondary/30"
            />
            <p className="text-xs text-muted-foreground">
              Copy prompt ini untuk digunakan di Google AI Studio, ChatGPT, Midjourney, atau AI image generator lainnya.
            </p>
          </div>
        )}

        {/* Used prompt for last generation */}
        {usedPrompt && generatedImages.length > 0 && !showPrompt && (
          <details className="text-xs">
            <summary className="text-muted-foreground cursor-pointer hover:text-foreground">
              Lihat prompt yang digunakan
            </summary>
            <pre className="mt-2 p-3 rounded bg-secondary/30 whitespace-pre-wrap font-mono overflow-auto max-h-32">
              {usedPrompt}
            </pre>
          </details>
        )}

        {/* Info about API */}
        <div className="p-3 rounded-lg bg-accent/10 border border-accent/20">
          <p className="text-xs text-muted-foreground">
            <span className="font-medium text-accent">Info:</span> Visualisasi di-generate menggunakan Gemini AI melalui Vercel AI Gateway. 
            Hasil mungkin bervariasi setiap kali generate.
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
