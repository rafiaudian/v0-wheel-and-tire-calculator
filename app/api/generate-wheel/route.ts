import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { 
      tire, 
      wheel, 
      wheelBrand, 
      wheelModel, 
      tireBrand, 
      tireModel, 
      spokeCount, 
      wheelColor 
    } = body

    const tireSize = `${tire.width}/${tire.profile}R${tire.diameter}`
    const wheelSize = `${wheel.width}J x R${wheel.diameter}`
    const offsetStr = `ET${wheel.offset > 0 ? "+" : ""}${wheel.offset}`

    const prompt = `Generate a highly detailed, photorealistic image of a car wheel and tire setup:

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

    // Use Gemini model that supports image generation
    const result = await generateText({
      model: "google/gemini-2.0-flash-exp",
      prompt: prompt,
      providerOptions: {
        google: {
          responseModalities: ["TEXT", "IMAGE"],
        },
      },
    })

    // Extract images from response
    const images: string[] = []
    
    // Method 1: Check result.files (AI SDK 6 pattern)
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const resultAny = result as any
    
    if (resultAny.files && Array.isArray(resultAny.files)) {
      for (const file of resultAny.files) {
        if (file.mimeType?.startsWith("image/") && file.base64) {
          images.push(`data:${file.mimeType};base64,${file.base64}`)
        } else if (file.mimeType?.startsWith("image/") && file.data) {
          images.push(`data:${file.mimeType};base64,${file.data}`)
        }
      }
    }

    // Method 2: Check response messages for inline images
    if (resultAny.response?.messages) {
      for (const message of resultAny.response.messages) {
        if (Array.isArray(message.content)) {
          for (const part of message.content) {
            if (part.type === "file" || part.type === "image") {
              const mimeType = part.mimeType || "image/png"
              const data = part.data || part.base64
              if (data && mimeType.startsWith("image/")) {
                images.push(`data:${mimeType};base64,${data}`)
              }
            }
          }
        }
      }
    }

    // Method 3: Check rawResponse for Gemini-specific structure
    if (resultAny.rawResponse) {
      try {
        const raw = typeof resultAny.rawResponse === "string" 
          ? JSON.parse(resultAny.rawResponse) 
          : resultAny.rawResponse
        
        if (raw.candidates) {
          for (const candidate of raw.candidates) {
            if (candidate.content?.parts) {
              for (const part of candidate.content.parts) {
                if (part.inlineData?.mimeType?.startsWith("image/")) {
                  images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`)
                }
              }
            }
          }
        }
      } catch {
        // Ignore parsing errors
      }
    }

    console.log("[v0] Generate wheel result:", {
      hasText: !!result.text,
      textLength: result.text?.length,
      imagesFound: images.length,
      resultKeys: Object.keys(result),
    })

    return Response.json({
      success: true,
      images,
      text: result.text,
      prompt,
      debug: {
        imagesFound: images.length,
        hasText: !!result.text,
      }
    })
  } catch (error) {
    console.error("[v0] Error generating wheel image:", error)
    return Response.json(
      { 
        success: false, 
        error: error instanceof Error ? error.message : "Failed to generate image",
        details: "Pastikan model Gemini yang digunakan mendukung image generation"
      },
      { status: 500 }
    )
  }
}
