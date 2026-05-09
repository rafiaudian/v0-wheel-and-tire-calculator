"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Copy, Check, ExternalLink, Wand2 } from "lucide-react"
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

  // Generate AI prompt for Google AI Studio / Gemini
  const generatePrompt = () => {
    const tireSize = `${tire.width}/${tire.profile}R${tire.diameter}`
    const wheelSize = `${wheel.width}J x R${wheel.diameter}`
    const offsetStr = `ET${wheel.offset > 0 ? "+" : ""}${wheel.offset}`

    return `Generate a highly detailed, photorealistic image of a car wheel and tire setup with the following specifications:

## Wheel Specifications:
- Brand: ${wheelBrand || "JDM style"}
- Model: ${wheelModel || "multi-spoke racing wheel"}
- Size: ${wheelSize}
- Offset: ${offsetStr}
- PCD: ${wheel.pcd}
- Spoke Count: ${spokeCount} spokes
- Finish/Color: ${wheelColor || "Gunmetal grey with machined lip"}
- Style: Japanese racing wheel design, similar to Rays Engineering or Work Wheels

## Tire Specifications:
- Brand: ${tireBrand || "High performance"}
- Model: ${tireModel || "Sport tire"}
- Size: ${tireSize}
- Type: Ultra High Performance Summer tire

## Image Requirements:
- View: Front 3/4 angle showing the wheel face and partial tire sidewall
- Lighting: Professional studio lighting with soft shadows
- Background: Clean gradient background (dark grey to black)
- Quality: 4K resolution, sharp focus on wheel details
- Details: Show spoke design clearly, tire sidewall text visible, lip finish visible
- Mood: Premium automotive photography style

## Additional Details:
- Show the tire mounted on the wheel properly
- Tire sidewall should display the size marking "${tireSize}"
${tireBrand ? `- Tire sidewall should show "${tireBrand.toUpperCase()}" branding` : ""}
${wheelBrand ? `- Center cap or spoke should show "${wheelBrand.toUpperCase()}" branding` : ""}
- Wheel should have authentic JDM racing wheel aesthetics
- Include subtle reflections to show metallic finish

Make the image look like a professional product shot for an automotive wheel catalog.`
  }

  const prompt = generatePrompt()

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(prompt)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Fallback for older browsers
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

  const openGoogleAIStudio = () => {
    window.open("https://aistudio.google.com/", "_blank")
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Visualization
          <Badge variant="secondary" className="ml-2 text-xs">
            Google AI Studio
          </Badge>
        </CardTitle>
        <CardDescription>
          Generate gambar realistis wheel & tire kamu menggunakan Gemini AI
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

        {/* Action buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            onClick={() => setShowPrompt(!showPrompt)}
            variant="outline"
            className="flex-1"
          >
            <Wand2 className="h-4 w-4 mr-2" />
            {showPrompt ? "Sembunyikan Prompt" : "Lihat AI Prompt"}
          </Button>
          <Button
            onClick={copyToClipboard}
            variant="outline"
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
          <Button
            onClick={openGoogleAIStudio}
            className="flex-1 bg-primary hover:bg-primary/90"
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Buka AI Studio
          </Button>
        </div>

        {/* Prompt display */}
        {showPrompt && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Generated Prompt:</label>
              <Badge variant="outline" className="text-xs">
                {prompt.length} characters
              </Badge>
            </div>
            <Textarea
              value={prompt}
              readOnly
              className="min-h-[200px] font-mono text-xs bg-secondary/30"
            />
          </div>
        )}

        {/* Instructions */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <h4 className="text-sm font-semibold mb-2 text-primary">Cara Menggunakan:</h4>
          <ol className="text-xs text-muted-foreground space-y-1 list-decimal list-inside">
            <li>Klik &quot;Copy Prompt&quot; untuk menyalin prompt ke clipboard</li>
            <li>Klik &quot;Buka AI Studio&quot; untuk membuka Google AI Studio</li>
            <li>Login dengan akun Google kamu</li>
            <li>Pilih model Gemini (disarankan: Gemini 2.0 Flash atau Imagen 3)</li>
            <li>Paste prompt yang sudah di-copy</li>
            <li>Klik Generate untuk membuat visualisasi</li>
          </ol>
        </div>

        {/* Alternative models */}
        <div className="text-xs text-muted-foreground">
          <p className="font-medium mb-1">Model AI yang disarankan:</p>
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">Gemini 2.0 Flash</Badge>
            <Badge variant="outline">Imagen 3</Badge>
            <Badge variant="outline">DALL-E 3</Badge>
            <Badge variant="outline">Midjourney</Badge>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
