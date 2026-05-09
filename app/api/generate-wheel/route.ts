import { GoogleGenerativeAI } from "@google/generative-ai";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      tire, wheel, wheelBrand, wheelModel, 
      tireBrand, tireModel, spokeCount, wheelColor 
    } = body;

    const tireSize = `${tire.width}/${tire.profile}R${tire.diameter}`;
    const wheelSize = `${wheel.width}J x R${wheel.diameter}`;
    const offsetStr = `ET${wheel.offset > 0 ? "+" : ""}${wheel.offset}`;

    const prompt = `Generate a photorealistic image of a car wheel and tire:
    WHEEL: ${wheelBrand || "JDM style"} ${wheelModel || ""}, ${wheelSize}, ${offsetStr}, ${spokeCount} spokes, ${wheelColor || "Gunmetal grey"}
    TIRE: ${tireBrand || "Performance"} ${tireModel || ""}, ${tireSize}
    STYLE: Professional automotive photography, 4K, studio lighting.`;

    // GUNAKAN SDK RESMI GOOGLE (Bukan Vercel AI SDK)
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY!);
    // Gunakan model imagen-3 atau gemini-2.0-flash
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

    const result = await model.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: {
        // @ts-ignore - mengizinkan output multimodal jika didukung
        responseModalities: ["TEXT", "IMAGE"],
      },
    });

    const response = await result.response;
    const images: string[] = [];

    // Ekstraksi gambar dari format asli Google
    const parts = response.candidates?.[0].content.parts;
    if (parts) {
      for (const part of parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith("image/")) {
          images.push(`data:${part.inlineData.mimeType};base64,${part.inlineData.data}`);
        }
      }
    }

    return Response.json({
      success: true,
      images,
      text: response.text(),
      prompt,
    });

  } catch (error: any) {
    console.error("Error:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}