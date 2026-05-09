import { NextResponse } from "next/server";
import OpenAI from "openai";

// Inisialisasi OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // Ambil dari Environment Variable
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { 
      tire, 
      wheel, 
      wheelBrand, 
      wheelModel, 
      tireBrand, 
      tireModel, 
      spokeCount, 
      wheelColor 
    } = body;

    // Persiapan data untuk prompt
    const tireSize = `${tire.width}/${tire.profile}R${tire.diameter}`;
    const wheelSize = `${wheel.width}J x R${wheel.diameter}`;
    const offsetStr = `ET${wheel.offset > 0 ? "+" : ""}${wheel.offset}`;

    // Prompt yang sangat detail untuk DALL-E 3 (dalam Bahasa Inggris)
    const prompt = `A professional automotive product photography shot of a single custom car wheel and tire setup. 
    The wheel is a ${wheelBrand || "racing style"} ${wheelModel || "performance wheel"}, finished in ${wheelColor || "Gunmetal Grey"}. 
    It features ${spokeCount} spokes and has center PCD markings ${wheel.pcd}. 
    The wheel size is ${wheelSize} with an offset of ${offsetStr}.
    Mounted on the wheel is a ultra-high performance tire, ${tireBrand || "Sport"} ${tireModel || "Performance"}, sized ${tireSize}.
    The tire sidewall has clear, legible text showing "${tireSize}" branding. 
    The background is a clean, modern studio setting with subtle, dark gradient reflections, making the wheel the central focus. 
    Professional studio lighting with shallow depth of field, 4K quality, extremely high detail.`;

    console.log("[API] Generating image with prompt:", prompt);

    // Memanggil DALL-E 3
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1, // DALL-E 3 hanya mendukung n=1
      size: "1024x1024", // Ukuran gambar
      quality: "hd", // "standard" atau "hd"
      response_format: "url", // Dapatkan URL, bukan base64 (lebih hemat bandwidth server)
    });

    const imageUrl = response.data[0].url;
    console.log("[API] Image generated successfully:", imageUrl);

    return NextResponse.json({
      success: true,
      images: [imageUrl], // Masukkan ke dalam array sesuai format frontend
      prompt, // Untuk debug jika perlu
    });

  } catch (error: any) {
    console.error("[API] OpenAI Error:", error.response?.data || error.message);
    
    // Tangani error spesifik jika API key tidak valid atau kuota habis
    const status = error.status || 500;
    const message = error.response?.data?.error?.message || "Internal Server Error";

    return NextResponse.json(
      { 
        success: false, 
        error: "Gagal generate gambar. " + message,
        details: "Pastikan API Key OpenAI valid dan memiliki kuota (bukan Free Tier yang expired)."
      },
      { status }
    );
  }
}