import { google } from "@ai-sdk/google"; // Gunakan provider resmi
import { generateText } from "ai";

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
    WHEEL: ${wheelBrand || "JDM"} ${wheelModel || ""}, ${wheelSize}, ${offsetStr}, ${spokeCount} spokes, ${wheelColor || "Silver"}
    TIRE: ${tireBrand || "Sport"} ${tireModel || ""}, ${tireSize}
    STYLE: Professional automotive photography, 4K, studio lighting.`;

    // 1. Pemanggilan Model dengan struktur terbaru
    const result = await generateText({
      model: google("gemini-2.0-flash-exp"), // Pastikan menggunakan provider google
      prompt: prompt,
      experimental_activeOutput: {
        modalities: ["text", "image"], // Memberitahu model untuk menghasilkan teks & gambar
      },
    });

    // 2. Ekstraksi gambar menggunakan experimental_output
    // Di SDK terbaru, output multimodal masuk ke array 'experimental_output'
    const images: string[] = [];

    if (result.experimental_output) {
      result.experimental_output.forEach((part) => {
        if (part.type === "image") {
          // Hasil biasanya berupa uint8Array atau base64
          const base64Data = part.image.toString("base64");
          images.push(`data:image/png;base64,${base64Data}`);
        }
      });
    }

    // Fallback: Jika SDK belum memetakan ke experimental_output, cek attachments
    if (images.length === 0 && (result as any).attachments) {
      (result as any).attachments.forEach((a: any) => {
        if (a.contentType?.startsWith("image/")) {
          images.push(`data:${a.contentType};base64,${a.url}`);
        }
      });
    }

    console.log("[v0] Processing complete:", {
      textFound: !!result.text,
      imagesFound: images.length,
    });

    return Response.json({
      success: true,
      images,
      text: result.text,
      prompt,
    });

  } catch (error: any) {
    console.error("[v0] Error:", error);
    return Response.json(
      { 
        success: false, 
        error: error.message || "Failed to generate image",
        details: "Pastikan API Key mendukung Gemini 2.0 Flash"
      },
      { status: 500 }
    );
  }
}