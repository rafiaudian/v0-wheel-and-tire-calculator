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

    // Use the standard AI SDK 4.x pattern to extract multimodal image parts.
    // Gemini 2.0 returns images as parts within the response messages content.
    result.response.messages.forEach((message) => {
      message.content.forEach((part) => {
        if (part.type === "image") {
          const base64 = Buffer.from(part.image).toString("base64")
          images.push(`data:${part.mimeType || "image/png"};base64,${base64}`)
        }
      })
    })

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
