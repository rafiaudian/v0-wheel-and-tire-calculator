"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WheelCrossSection } from "./wheel-cross-section"
import { WheelFrontView } from "./wheel-front-view"
import { AIWheelVisualizer } from "./ai-wheel-visualizer"
import type { TireSpec, WheelSpec, FitmentResult } from "@/lib/fitment-data"
import { ArrowRight, ArrowUp, ArrowDown, Minus, AlertTriangle, CheckCircle2, Layers, Circle, Sparkles } from "lucide-react"

interface FitmentComparisonProps {
  currentTire: TireSpec
  currentWheel: WheelSpec
  currentFitment: FitmentResult
  desiredTire: TireSpec
  desiredWheel: WheelSpec
  desiredFitment: FitmentResult
  currentWheelBrand?: string
  currentWheelModel?: string
  currentTireBrand?: string
  currentTireModel?: string
  currentSpokeCount?: number
  currentWheelColor?: string
  desiredWheelBrand?: string
  desiredWheelModel?: string
  desiredTireBrand?: string
  desiredTireModel?: string
  desiredSpokeCount?: number
  desiredWheelColor?: string
}

interface ComparisonItem {
  label: string
  current: string
  desired: string
  diff: number
  unit: string
}

export function FitmentComparison({
  currentTire,
  currentWheel,
  currentFitment,
  desiredTire,
  desiredWheel,
  desiredFitment,
  currentWheelBrand = "",
  currentWheelModel = "",
  currentTireBrand = "",
  currentTireModel = "",
  currentSpokeCount = 10,
  currentWheelColor = "Gunmetal",
  desiredWheelBrand = "",
  desiredWheelModel = "",
  desiredTireBrand = "",
  desiredTireModel = "",
  desiredSpokeCount = 10,
  desiredWheelColor = "Gunmetal"
}: FitmentComparisonProps) {
  const [viewMode, setViewMode] = useState<"cross" | "front" | "ai">("cross")
  
  const comparisons: ComparisonItem[] = useMemo(() => {
    return [
      {
        label: "Diameter Total",
        current: currentFitment.overallDiameter.toFixed(1),
        desired: desiredFitment.overallDiameter.toFixed(1),
        diff: desiredFitment.overallDiameter - currentFitment.overallDiameter,
        unit: "mm"
      },
      {
        label: "Tinggi Sidewall",
        current: currentFitment.tireHeight.toFixed(1),
        desired: desiredFitment.tireHeight.toFixed(1),
        diff: desiredFitment.tireHeight - currentFitment.tireHeight,
        unit: "mm"
      },
      {
        label: "Lebar Ban",
        current: currentTire.width.toString(),
        desired: desiredTire.width.toString(),
        diff: desiredTire.width - currentTire.width,
        unit: "mm"
      },
      {
        label: "Lebar Velg",
        current: currentWheel.width.toFixed(1),
        desired: desiredWheel.width.toFixed(1),
        diff: desiredWheel.width - currentWheel.width,
        unit: "J"
      },
      {
        label: "Offset (ET)",
        current: `ET${currentWheel.offset > 0 ? '+' : ''}${currentWheel.offset}`,
        desired: `ET${desiredWheel.offset > 0 ? '+' : ''}${desiredWheel.offset}`,
        diff: desiredWheel.offset - currentWheel.offset,
        unit: "mm"
      },
      {
        label: "Keliling Ban",
        current: currentFitment.circumference.toFixed(0),
        desired: desiredFitment.circumference.toFixed(0),
        diff: desiredFitment.circumference - currentFitment.circumference,
        unit: "mm"
      },
      {
        label: "Putaran per KM",
        current: currentFitment.revPerKm.toFixed(0),
        desired: desiredFitment.revPerKm.toFixed(0),
        diff: desiredFitment.revPerKm - currentFitment.revPerKm,
        unit: ""
      }
    ]
  }, [currentTire, currentWheel, currentFitment, desiredTire, desiredWheel, desiredFitment])

  const speedoDiff = useMemo(() => {
    const circumDiff = desiredFitment.circumference / currentFitment.circumference
    return ((circumDiff - 1) * 100)
  }, [currentFitment, desiredFitment])

  const isCompatible = useMemo(() => {
    const diameterDiff = Math.abs(desiredFitment.overallDiameter - currentFitment.overallDiameter)
    return diameterDiff <= 30
  }, [currentFitment, desiredFitment])

  const getDiffIcon = (diff: number) => {
    if (Math.abs(diff) < 0.1) return <Minus className="h-3 w-3 text-muted-foreground" />
    if (diff > 0) return <ArrowUp className="h-3 w-3 text-green-500" />
    return <ArrowDown className="h-3 w-3 text-amber-500" />
  }

  const getDiffColor = (diff: number) => {
    if (Math.abs(diff) < 0.1) return "text-muted-foreground"
    if (diff > 0) return "text-green-500"
    return "text-amber-500"
  }

  const currentLabel = currentWheelBrand && currentWheelModel 
    ? `${currentWheelBrand} ${currentWheelModel}` 
    : "Setup Sekarang"
  
  const desiredLabel = desiredWheelBrand && desiredWheelModel 
    ? `${desiredWheelBrand} ${desiredWheelModel}` 
    : "Setup Baru"

  return (
    <div className="space-y-6">
      {/* Visualization Section */}
      <Card className="border-border/50 bg-card/50 backdrop-blur overflow-hidden">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg flex items-center justify-between flex-wrap gap-2">
            <span>Perbandingan Visualisasi</span>
            <div className="flex items-center gap-2 flex-wrap">
              {isCompatible ? (
                <Badge className="bg-green-500/10 text-green-500">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Compatible
                </Badge>
              ) : (
                <Badge className="bg-amber-500/10 text-amber-500">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  Perlu Penyesuaian
                </Badge>
              )}
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* View Mode Tabs */}
          <Tabs value={viewMode} onValueChange={(v) => setViewMode(v as "cross" | "front" | "ai")} className="w-full">
            <TabsList className="grid w-full grid-cols-3 mb-4">
              <TabsTrigger value="cross" className="flex items-center gap-2">
                <Layers className="h-4 w-4" />
                <span className="hidden sm:inline">Cross Section</span>
                <span className="sm:hidden">Section</span>
              </TabsTrigger>
              <TabsTrigger value="front" className="flex items-center gap-2">
                <Circle className="h-4 w-4" />
                <span className="hidden sm:inline">Front View</span>
                <span className="sm:hidden">Front</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                <span className="hidden sm:inline">AI Generate</span>
                <span className="sm:hidden">AI</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="cross">
              <div className="grid md:grid-cols-2 gap-4 relative">
                {/* Current fitment - Cross Section */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50">
                  <WheelCrossSection
                    tire={currentTire}
                    wheel={currentWheel}
                    fitment={currentFitment}
                    label={currentLabel}
                  />
                </div>

                {/* Arrow separator for desktop */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-primary rounded-full p-2">
                    <ArrowRight className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>

                {/* Desired fitment - Cross Section */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-primary/30">
                  <WheelCrossSection
                    tire={desiredTire}
                    wheel={desiredWheel}
                    fitment={desiredFitment}
                    label={desiredLabel}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="front">
              <div className="grid md:grid-cols-2 gap-4 relative">
                {/* Current fitment - Front View */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-border/50 flex flex-col items-center">
                  <WheelFrontView
                    tire={currentTire}
                    wheel={currentWheel}
                    fitment={currentFitment}
                    wheelBrand={currentWheelBrand}
                    wheelModel={currentWheelModel}
                    tireBrand={currentTireBrand}
                    tireModel={currentTireModel}
                    spokeCount={currentSpokeCount}
                  />
                </div>

                {/* Arrow separator for desktop */}
                <div className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
                  <div className="bg-primary rounded-full p-2">
                    <ArrowRight className="h-5 w-5 text-primary-foreground" />
                  </div>
                </div>

                {/* Desired fitment - Front View */}
                <div className="p-4 rounded-xl bg-secondary/30 border border-primary/30 flex flex-col items-center">
                  <WheelFrontView
                    tire={desiredTire}
                    wheel={desiredWheel}
                    fitment={desiredFitment}
                    wheelBrand={desiredWheelBrand}
                    wheelModel={desiredWheelModel}
                    tireBrand={desiredTireBrand}
                    tireModel={desiredTireModel}
                    spokeCount={desiredSpokeCount}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai">
              <div className="grid md:grid-cols-2 gap-4">
                {/* Current Setup AI */}
                <AIWheelVisualizer
                  tire={currentTire}
                  wheel={currentWheel}
                  wheelBrand={currentWheelBrand}
                  wheelModel={currentWheelModel}
                  tireBrand={currentTireBrand}
                  tireModel={currentTireModel}
                  spokeCount={currentSpokeCount}
                  wheelColor={currentWheelColor}
                />

                {/* Desired Setup AI */}
                <AIWheelVisualizer
                  tire={desiredTire}
                  wheel={desiredWheel}
                  wheelBrand={desiredWheelBrand}
                  wheelModel={desiredWheelModel}
                  tireBrand={desiredTireBrand}
                  tireModel={desiredTireModel}
                  spokeCount={desiredSpokeCount}
                  wheelColor={desiredWheelColor}
                />
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>

      {/* Comparison details */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg">Detail Perbandingan</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {comparisons.map((item) => (
              <div
                key={item.label}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 hover:bg-secondary/50 transition-colors"
              >
                <span className="text-sm text-muted-foreground">{item.label}</span>
                <div className="flex items-center gap-2 sm:gap-4">
                  <span className="font-mono text-xs sm:text-sm w-16 sm:w-24 text-right">
                    {item.current}{item.unit && ` ${item.unit}`}
                  </span>
                  <ArrowRight className="h-4 w-4 text-muted-foreground hidden sm:block" />
                  <span className="font-mono text-xs sm:text-sm font-semibold w-16 sm:w-24">
                    {item.desired}{item.unit && ` ${item.unit}`}
                  </span>
                  <div className={`flex items-center gap-1 w-16 sm:w-20 justify-end ${getDiffColor(item.diff)}`}>
                    {getDiffIcon(item.diff)}
                    <span className="font-mono text-xs">
                      {item.diff > 0 ? '+' : ''}{item.diff.toFixed(1)}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Speedometer difference */}
          <div className="mt-4 p-4 rounded-lg bg-primary/10 border border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-semibold text-sm">Koreksi Speedometer</h4>
                <p className="text-xs text-muted-foreground mt-1">
                  Perbedaan pembacaan speedometer dari setup baru
                </p>
              </div>
              <div className="text-right">
                <span className={`font-mono text-2xl font-bold ${
                  Math.abs(speedoDiff) <= 3 ? 'text-green-500' : 
                  Math.abs(speedoDiff) <= 5 ? 'text-amber-500' : 'text-red-500'
                }`}>
                  {speedoDiff > 0 ? '+' : ''}{speedoDiff.toFixed(1)}%
                </span>
                <p className="text-xs text-muted-foreground mt-1">
                  {speedoDiff > 0 
                    ? "Speedometer lebih lambat dari aktual"
                    : speedoDiff < 0 
                    ? "Speedometer lebih cepat dari aktual"
                    : "Tidak ada perbedaan"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="mt-4 space-y-2">
            {desiredFitment.overallDiameter > currentFitment.overallDiameter + 15 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Diameter lebih besar - cek clearance fender dan pastikan tidak gesrot</p>
              </div>
            )}
            {desiredWheel.offset < currentWheel.offset - 10 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Offset lebih kecil - velg akan lebih keluar (poke), cek clearance fender</p>
              </div>
            )}
            {desiredTire.width > currentTire.width + 20 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-500">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Ban lebih lebar - pastikan tidak bergesekan dengan fender atau suspensi</p>
              </div>
            )}
            {desiredTire.profile < 40 && currentTire.profile >= 50 && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-blue-500/10 text-blue-500">
                <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Profil lebih rendah - suspensi terasa lebih keras, hindari jalan rusak</p>
              </div>
            )}
            {Math.abs(speedoDiff) <= 3 && isCompatible && (
              <div className="flex items-start gap-2 p-3 rounded-lg bg-green-500/10 text-green-500">
                <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                <p className="text-sm">Setup ini kompatibel dan tidak memerlukan penyesuaian speedometer signifikan</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
