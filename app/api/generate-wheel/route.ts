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