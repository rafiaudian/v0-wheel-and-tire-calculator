"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WheelVisualizer } from "./wheel-visualizer"
import { TireRecommendations } from "./tire-recommendations"
import { calculateFitment, commonPCDs, regions, type TireSpec, type WheelSpec } from "@/lib/fitment-data"
import { AlertTriangle, CheckCircle2, Gauge, CircleDot, Ruler } from "lucide-react"

export function FitmentCalculator() {
  // Tire specs
  const [tireWidth, setTireWidth] = useState(225)
  const [tireProfile, setTireProfile] = useState(45)
  const [tireDiameter, setTireDiameter] = useState(18)
  
  // Wheel specs
  const [wheelWidth, setWheelWidth] = useState(8.5)
  const [wheelDiameter, setWheelDiameter] = useState(18)
  const [wheelOffset, setWheelOffset] = useState(35)
  const [wheelPCD, setWheelPCD] = useState("5x114.3")
  const [centerBore, setCenterBore] = useState(67.1)
  
  // Region for recommendations
  const [region, setRegion] = useState("indonesia")
  
  // Memoized tire and wheel specs
  const tire: TireSpec = useMemo(() => ({
    width: tireWidth,
    profile: tireProfile,
    diameter: tireDiameter
  }), [tireWidth, tireProfile, tireDiameter])
  
  const wheel: WheelSpec = useMemo(() => ({
    width: wheelWidth,
    diameter: wheelDiameter,
    offset: wheelOffset,
    pcd: wheelPCD,
    centerBore
  }), [wheelWidth, wheelDiameter, wheelOffset, wheelPCD, centerBore])
  
  // Calculate fitment
  const fitment = useMemo(() => calculateFitment(tire, wheel), [tire, wheel])
  
  // Common tire widths
  const tireWidths = [165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315]
  const tireProfiles = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70]
  const tireDiameters = [14, 15, 16, 17, 18, 19, 20, 21, 22]
  const wheelWidths = [6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12]

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      {/* Input Section */}
      <div className="space-y-6">
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <CircleDot className="h-5 w-5 text-primary" />
              Spesifikasi Ban
            </CardTitle>
            <CardDescription>Masukkan ukuran ban yang diinginkan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tire-width" className="text-sm text-muted-foreground">
                  Lebar (mm)
                </Label>
                <Select value={tireWidth.toString()} onValueChange={(v) => setTireWidth(Number(v))}>
                  <SelectTrigger id="tire-width">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tireWidths.map(w => (
                      <SelectItem key={w} value={w.toString()}>{w}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tire-profile" className="text-sm text-muted-foreground">
                  Profil (%)
                </Label>
                <Select value={tireProfile.toString()} onValueChange={(v) => setTireProfile(Number(v))}>
                  <SelectTrigger id="tire-profile">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tireProfiles.map(p => (
                      <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="tire-diameter" className="text-sm text-muted-foreground">
                  Ring (inch)
                </Label>
                <Select value={tireDiameter.toString()} onValueChange={(v) => {
                  setTireDiameter(Number(v))
                  setWheelDiameter(Number(v))
                }}>
                  <SelectTrigger id="tire-diameter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tireDiameters.map(d => (
                      <SelectItem key={d} value={d.toString()}>{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="pt-2 px-1">
              <div className="text-center font-mono text-2xl font-bold text-foreground">
                {tireWidth}/{tireProfile}R{tireDiameter}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-1">
                Format: Lebar/Profil R Diameter
              </p>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Gauge className="h-5 w-5 text-primary" />
              Spesifikasi Velg
            </CardTitle>
            <CardDescription>Masukkan ukuran velg yang diinginkan</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wheel-width" className="text-sm text-muted-foreground">
                  Lebar Velg (J)
                </Label>
                <Select value={wheelWidth.toString()} onValueChange={(v) => setWheelWidth(Number(v))}>
                  <SelectTrigger id="wheel-width">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {wheelWidths.map(w => (
                      <SelectItem key={w} value={w.toString()}>{w}J</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="wheel-diameter" className="text-sm text-muted-foreground">
                  Diameter (inch)
                </Label>
                <Select value={wheelDiameter.toString()} onValueChange={(v) => setWheelDiameter(Number(v))}>
                  <SelectTrigger id="wheel-diameter">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tireDiameters.map(d => (
                      <SelectItem key={d} value={d.toString()}>R{d}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm text-muted-foreground">Offset / ET</Label>
                <span className="font-mono text-sm font-semibold text-primary">
                  ET{wheelOffset > 0 ? '+' : ''}{wheelOffset}
                </span>
              </div>
              <Slider
                value={[wheelOffset]}
                onValueChange={([v]) => setWheelOffset(v)}
                min={-20}
                max={60}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>-20 (lebih keluar)</span>
                <span>+60 (lebih masuk)</span>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="wheel-pcd" className="text-sm text-muted-foreground">
                  PCD
                </Label>
                <Select value={wheelPCD} onValueChange={setWheelPCD}>
                  <SelectTrigger id="wheel-pcd">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {commonPCDs.map(pcd => (
                      <SelectItem key={pcd} value={pcd}>{pcd}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="center-bore" className="text-sm text-muted-foreground">
                  Center Bore (mm)
                </Label>
                <Input
                  id="center-bore"
                  type="number"
                  value={centerBore}
                  onChange={(e) => setCenterBore(Number(e.target.value))}
                  step="0.1"
                  className="font-mono"
                />
              </div>
            </div>
            
            <div className="pt-2 px-1">
              <div className="text-center font-mono text-xl font-bold text-foreground">
                {wheelWidth}J x {wheelDiameter} ET{wheelOffset > 0 ? '+' : ''}{wheelOffset}
              </div>
              <p className="text-center text-sm text-muted-foreground mt-1">
                PCD: {wheelPCD} | CB: {centerBore}mm
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Region Selection */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="flex items-center gap-2 text-xl">
              <Ruler className="h-5 w-5 text-primary" />
              Region Pembelian
            </CardTitle>
            <CardDescription>Pilih region untuk rekomendasi merek ban</CardDescription>
          </CardHeader>
          <CardContent>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {regions.map(r => (
                  <SelectItem key={r.value} value={r.value}>{r.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>
      </div>
      
      {/* Results Section */}
      <div className="space-y-6">
        {/* Visualization */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Visualisasi Fitment</CardTitle>
            <CardDescription>Tampilan dinamis wheel & tire setup</CardDescription>
          </CardHeader>
          <CardContent>
            <WheelVisualizer tire={tire} wheel={wheel} fitment={fitment} />
          </CardContent>
        </Card>
        
        {/* Calculations */}
        <Card className="border-border/50 bg-card/50 backdrop-blur">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl">Hasil Kalkulasi</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1 p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Tinggi Sidewall</p>
                <p className="font-mono text-lg font-semibold">{fitment.tireHeight.toFixed(1)} mm</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Diameter Total</p>
                <p className="font-mono text-lg font-semibold">{fitment.overallDiameter.toFixed(1)} mm</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Keliling Ban</p>
                <p className="font-mono text-lg font-semibold">{fitment.circumference.toFixed(1)} mm</p>
              </div>
              <div className="space-y-1 p-3 rounded-lg bg-secondary/50">
                <p className="text-xs text-muted-foreground">Putaran per KM</p>
                <p className="font-mono text-lg font-semibold">{fitment.revPerKm.toFixed(0)}</p>
              </div>
            </div>
            
            {/* Warnings */}
            <div className="mt-4 space-y-2">
              {fitment.warnings.length === 0 ? (
                <div className="flex items-center gap-2 p-3 rounded-lg bg-green-500/10 text-green-500">
                  <CheckCircle2 className="h-4 w-4" />
                  <span className="text-sm font-medium">Fitment optimal!</span>
                </div>
              ) : (
                fitment.warnings.map((warning, i) => (
                  <div key={i} className="flex items-center gap-2 p-3 rounded-lg bg-amber-500/10 text-amber-500">
                    <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm">{warning}</span>
                  </div>
                ))
              )}
            </div>
            
            {/* Fitment Badge */}
            <div className="mt-4 flex items-center justify-center">
              <Badge 
                variant={fitment.wheelFitment === 'ideal' ? 'default' : 'secondary'}
                className="text-sm px-4 py-1"
              >
                {fitment.wheelFitment === 'ideal' && 'Fitment Ideal'}
                {fitment.wheelFitment === 'wide' && 'Sedikit Lebar'}
                {fitment.wheelFitment === 'stretch' && 'Stretch Setup'}
                {fitment.wheelFitment === 'narrow' && 'Velg Terlalu Sempit'}
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        {/* Tire Recommendations */}
        <TireRecommendations tire={tire} region={region} />
      </div>
    </div>
  )
}
