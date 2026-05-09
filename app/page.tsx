import { FitmentCalculator } from "@/components/fitment-calculator"
import { FitmentChatbot } from "@/components/fitment-chatbot"
import { Badge } from "@/components/ui/badge"
import { Gauge, CircleDot, MessageCircle } from "lucide-react"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      {/* Hero Section */}
      <header className="relative border-b border-border/50 bg-gradient-to-b from-card/50 to-background">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-3xl mx-auto text-center">
            <Badge variant="secondary" className="mb-4">
              <Gauge className="h-3 w-3 mr-1" />
              Wheel & Tire Calculator
            </Badge>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight mb-4 text-balance">
              <span className="text-primary">Fitment</span> Calculator
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed text-pretty max-w-2xl mx-auto">
              Hitung dan visualisasikan wheel & tire fitment mobil kamu. Dapatkan rekomendasi ban
              terbaik berdasarkan spesifikasi dan region pembelian.
            </p>
            
            {/* Feature badges */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-6">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CircleDot className="h-4 w-4 text-primary" />
                <span>Visualisasi Dinamis</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Gauge className="h-4 w-4 text-primary" />
                <span>Kalkulasi Akurat</span>
              </div>
              <div className="h-1 w-1 rounded-full bg-border" />
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageCircle className="h-4 w-4 text-primary" />
                <span>AI Chatbot</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Decorative gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5 pointer-events-none" />
      </header>
      
      {/* Main Calculator Section */}
      <section className="container mx-auto px-4 py-8 lg:py-12">
        <FitmentCalculator />
      </section>
      
      {/* Info Section */}
      <section className="border-t border-border/50 bg-card/30">
        <div className="container mx-auto px-4 py-12 lg:py-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-2xl font-bold mb-8 text-center">Panduan Fitment</h2>
            
            <div className="grid md:grid-cols-2 gap-6">
              {/* Tire Size Guide */}
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <CircleDot className="h-5 w-5 text-primary" />
                  Membaca Ukuran Ban
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Contoh: <span className="font-mono text-foreground">225/45R18</span></p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li><strong>225</strong> = Lebar ban dalam mm</li>
                    <li><strong>45</strong> = Aspect ratio (tinggi sidewall = 45% dari lebar)</li>
                    <li><strong>R</strong> = Konstruksi Radial</li>
                    <li><strong>18</strong> = Diameter velg dalam inch</li>
                  </ul>
                </div>
              </div>
              
              {/* Wheel Size Guide */}
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Gauge className="h-5 w-5 text-primary" />
                  Membaca Ukuran Velg
                </h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Contoh: <span className="font-mono text-foreground">8.5J x 18 ET+35</span></p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li><strong>8.5J</strong> = Lebar velg dalam inch</li>
                    <li><strong>18</strong> = Diameter velg dalam inch</li>
                    <li><strong>ET+35</strong> = Offset (jarak mounting ke centerline)</li>
                  </ul>
                </div>
              </div>
              
              {/* PCD Guide */}
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h3 className="font-semibold mb-3">PCD (Pitch Circle Diameter)</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>PCD adalah pola baut velg. Format: <span className="font-mono text-foreground">5x114.3</span></p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li><strong>5</strong> = Jumlah baut</li>
                    <li><strong>114.3</strong> = Diameter lingkaran baut (mm)</li>
                  </ul>
                  <p className="mt-2">PCD harus COCOK dengan mobil kamu!</p>
                </div>
              </div>
              
              {/* Offset Guide */}
              <div className="p-6 rounded-xl bg-card border border-border/50">
                <h3 className="font-semibold mb-3">Offset / ET</h3>
                <div className="space-y-2 text-sm text-muted-foreground">
                  <p>Offset menentukan seberapa jauh velg masuk atau keluar dari fender:</p>
                  <ul className="space-y-1 ml-4 list-disc">
                    <li><strong>Positif tinggi (+40 keatas)</strong> = Velg lebih masuk</li>
                    <li><strong>Rendah (+20 kebawah)</strong> = Velg lebih keluar (poke)</li>
                    <li><strong>Negatif</strong> = Velg sangat keluar (extreme poke)</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Footer */}
      <footer className="border-t border-border/50 py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Built by car enthusiasts, for car enthusiasts. 🏎️
          </p>
          <p className="mt-2">
            Selalu konsultasikan dengan profesional sebelum modifikasi.
          </p>
        </div>
      </footer>
      
      {/* Chatbot */}
      <FitmentChatbot />
    </main>
  )
}
