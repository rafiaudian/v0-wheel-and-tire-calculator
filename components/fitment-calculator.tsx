"use client"

import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { FitmentComparison } from "./fitment-comparison"
import { ProductRecommendations } from "./product-recommendations"
import { calculateFitment, commonPCDs, regions, type TireSpec, type WheelSpec } from "@/lib/fitment-data"
import { AlertTriangle, CheckCircle2, Gauge, CircleDot, Ruler, Settings2, Eye, EyeOff } from "lucide-react"

export function FitmentCalculator() {
  // Current fitment specs
  const [currentTireWidth, setCurrentTireWidth] = useState(195)
  const [currentTireProfile, setCurrentTireProfile] = useState(55)
  const [currentTireDiameter, setCurrentTireDiameter] = useState(16)
  const [currentWheelWidth, setCurrentWheelWidth] = useState(7)
  const [currentWheelDiameter, setCurrentWheelDiameter] = useState(16)
  const [currentWheelOffset, setCurrentWheelOffset] = useState(40)
  const [currentWheelPCD, setCurrentWheelPCD] = useState("5x114.3")
  const [currentCenterBore, setCurrentCenterBore] = useState(67.1)

  // Desired fitment specs
  const [desiredTireWidth, setDesiredTireWidth] = useState(225)
  const [desiredTireProfile, setDesiredTireProfile] = useState(45)
  const [desiredTireDiameter, setDesiredTireDiameter] = useState(18)
  const [desiredWheelWidth, setDesiredWheelWidth] = useState(8.5)
  const [desiredWheelDiameter, setDesiredWheelDiameter] = useState(18)
  const [desiredWheelOffset, setDesiredWheelOffset] = useState(35)
  const [desiredWheelPCD, setDesiredWheelPCD] = useState("5x114.3")
  const [desiredCenterBore, setDesiredCenterBore] = useState(67.1)

  // Visualization toggles
  const [showTire, setShowTire] = useState(true)
  const [showWheel, setShowWheel] = useState(true)
  
  // Region for recommendations
  const [region, setRegion] = useState("indonesia")
  
  // Memoized specs
  const currentTire: TireSpec = useMemo(() => ({
    width: currentTireWidth,
    profile: currentTireProfile,
    diameter: currentTireDiameter
  }), [currentTireWidth, currentTireProfile, currentTireDiameter])
  
  const currentWheel: WheelSpec = useMemo(() => ({
    width: currentWheelWidth,
    diameter: currentWheelDiameter,
    offset: currentWheelOffset,
    pcd: currentWheelPCD,
    centerBore: currentCenterBore
  }), [currentWheelWidth, currentWheelDiameter, currentWheelOffset, currentWheelPCD, currentCenterBore])

  const desiredTire: TireSpec = useMemo(() => ({
    width: desiredTireWidth,
    profile: desiredTireProfile,
    diameter: desiredTireDiameter
  }), [desiredTireWidth, desiredTireProfile, desiredTireDiameter])
  
  const desiredWheel: WheelSpec = useMemo(() => ({
    width: desiredWheelWidth,
    diameter: desiredWheelDiameter,
    offset: desiredWheelOffset,
    pcd: desiredWheelPCD,
    centerBore: desiredCenterBore
  }), [desiredWheelWidth, desiredWheelDiameter, desiredWheelOffset, desiredWheelPCD, desiredCenterBore])
  
  // Calculate fitments
  const currentFitment = useMemo(() => calculateFitment(currentTire, currentWheel), [currentTire, currentWheel])
  const desiredFitment = useMemo(() => calculateFitment(desiredTire, desiredWheel), [desiredTire, desiredWheel])
  
  // Common tire sizes
  const tireWidths = [165, 175, 185, 195, 205, 215, 225, 235, 245, 255, 265, 275, 285, 295, 305, 315]
  const tireProfiles = [25, 30, 35, 40, 45, 50, 55, 60, 65, 70]
  const tireDiameters = [13, 14, 15, 16, 17, 18, 19, 20, 21, 22]
  const wheelWidths = [5.5, 6, 6.5, 7, 7.5, 8, 8.5, 9, 9.5, 10, 10.5, 11, 11.5, 12]

  // Input card component for reusability
  const SpecInputCard = ({ 
    title, 
    description,
    isCurrent,
    tireWidth, setTireWidth,
    tireProfile, setTireProfile,
    tireDiameter, setTireDiameter,
    wheelWidth, setWheelWidth,
    wheelDiameter, setWheelDiameter,
    wheelOffset, setWheelOffset,
    wheelPCD, setWheelPCD,
    centerBore, setCenterBore
  }: {
    title: string
    description: string
    isCurrent: boolean
    tireWidth: number
    setTireWidth: (v: number) => void
    tireProfile: number
    setTireProfile: (v: number) => void
    tireDiameter: number
    setTireDiameter: (v: number) => void
    wheelWidth: number
    setWheelWidth: (v: number) => void
    wheelDiameter: number
    setWheelDiameter: (v: number) => void
    wheelOffset: number
    setWheelOffset: (v: number) => void
    wheelPCD: string
    setWheelPCD: (v: string) => void
    centerBore: number
    setCenterBore: (v: number) => void
  }) => (
    <Card className={`border-border/50 bg-card/50 backdrop-blur ${!isCurrent ? 'border-primary/30' : ''}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          {isCurrent ? (
            <CircleDot className="h-4 w-4 text-muted-foreground" />
          ) : (
            <Settings2 className="h-4 w-4 text-primary" />
          )}
          {title}
        </CardTitle>
        <CardDescription className="text-xs">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tire specs */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-2">
            <CircleDot className="h-3 w-3" />
            Ukuran Ban
          </Label>
          <div className="grid grid-cols-3 gap-2">
            <Select value={tireWidth.toString()} onValueChange={(v) => setTireWidth(Number(v))}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tireWidths.map(w => (
                  <SelectItem key={w} value={w.toString()}>{w}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={tireProfile.toString()} onValueChange={(v) => setTireProfile(Number(v))}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tireProfiles.map(p => (
                  <SelectItem key={p} value={p.toString()}>{p}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={tireDiameter.toString()} onValueChange={(v) => {
              setTireDiameter(Number(v))
              setWheelDiameter(Number(v))
            }}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {tireDiameters.map(d => (
                  <SelectItem key={d} value={d.toString()}>R{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-center font-mono text-lg font-bold">
            {tireWidth}/{tireProfile}R{tireDiameter}
          </div>
        </div>
        
        {/* Wheel specs */}
        <div className="space-y-2">
          <Label className="text-xs text-muted-foreground flex items-center gap-2">
            <Gauge className="h-3 w-3" />
            Ukuran Velg
          </Label>
          <div className="grid grid-cols-2 gap-2">
            <Select value={wheelWidth.toString()} onValueChange={(v) => setWheelWidth(Number(v))}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {wheelWidths.map(w => (
                  <SelectItem key={w} value={w.toString()}>{w}J</SelectItem>
                ))}
              </SelectContent>
            </Select>
            
            <Select value={wheelDiameter.toString()} onValueChange={(v) => setWheelDiameter(Number(v))}>
              <SelectTrigger className="h-9 text-sm">
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
        
        {/* Offset slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs text-muted-foreground">Offset / ET</Label>
            <span className="font-mono text-xs font-semibold text-primary">
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
          <div className="flex justify-between text-[10px] text-muted-foreground">
            <span>-20 (keluar)</span>
            <span>+60 (masuk)</span>
          </div>
        </div>
        
        {/* PCD & Center Bore */}
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">PCD</Label>
            <Select value={wheelPCD} onValueChange={setWheelPCD}>
              <SelectTrigger className="h-9 text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {commonPCDs.map(pcd => (
                  <SelectItem key={pcd} value={pcd}>{pcd}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-1">
            <Label className="text-xs text-muted-foreground">Center Bore</Label>
            <Input
              type="number"
              value={centerBore}
              onChange={(e) => setCenterBore(Number(e.target.value))}
              step="0.1"
              className="h-9 text-sm font-mono"
            />
          </div>
        </div>
        
        {/* Summary */}
        <div className="pt-2 border-t border-border/50">
          <div className="text-center font-mono text-sm font-semibold">
            {wheelWidth}J x {wheelDiameter} ET{wheelOffset > 0 ? '+' : ''}{wheelOffset}
          </div>
          <p className="text-center text-[10px] text-muted-foreground mt-1">
            PCD: {wheelPCD} | CB: {centerBore}mm
          </p>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Input Section - Side by Side */}
      <div className="grid lg:grid-cols-2 gap-4">
        {/* Current Fitment */}
        <SpecInputCard
          title="Setup Sekarang"
          description="Ukuran ban & velg yang terpasang saat ini"
          isCurrent={true}
          tireWidth={currentTireWidth}
          setTireWidth={setCurrentTireWidth}
          tireProfile={currentTireProfile}
          setTireProfile={setCurrentTireProfile}
          tireDiameter={currentTireDiameter}
          setTireDiameter={setCurrentTireDiameter}
          wheelWidth={currentWheelWidth}
          setWheelWidth={setCurrentWheelWidth}
          wheelDiameter={currentWheelDiameter}
          setWheelDiameter={setCurrentWheelDiameter}
          wheelOffset={currentWheelOffset}
          setWheelOffset={setCurrentWheelOffset}
          wheelPCD={currentWheelPCD}
          setWheelPCD={setCurrentWheelPCD}
          centerBore={currentCenterBore}
          setCenterBore={setCurrentCenterBore}
        />

        {/* Desired Fitment */}
        <SpecInputCard
          title="Setup Baru"
          description="Ukuran ban & velg yang diinginkan"
          isCurrent={false}
          tireWidth={desiredTireWidth}
          setTireWidth={setDesiredTireWidth}
          tireProfile={desiredTireProfile}
          setTireProfile={setDesiredTireProfile}
          tireDiameter={desiredTireDiameter}
          setTireDiameter={setDesiredTireDiameter}
          wheelWidth={desiredWheelWidth}
          setWheelWidth={setDesiredWheelWidth}
          wheelDiameter={desiredWheelDiameter}
          setWheelDiameter={setDesiredWheelDiameter}
          wheelOffset={desiredWheelOffset}
          setWheelOffset={setDesiredWheelOffset}
          wheelPCD={desiredWheelPCD}
          setWheelPCD={setDesiredWheelPCD}
          centerBore={desiredCenterBore}
          setCenterBore={setDesiredCenterBore}
        />
      </div>

      {/* Comparison Visualization */}
      <FitmentComparison
        currentTire={currentTire}
        currentWheel={currentWheel}
        currentFitment={currentFitment}
        desiredTire={desiredTire}
        desiredWheel={desiredWheel}
        desiredFitment={desiredFitment}
      />

      {/* Region Selection & Product Recommendations */}
      <Card className="border-border/50 bg-card/50 backdrop-blur">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl">
            <Ruler className="h-5 w-5 text-primary" />
            Region Pembelian
          </CardTitle>
          <CardDescription>Pilih region untuk rekomendasi merek ban dan link pembelian</CardDescription>
        </CardHeader>
        <CardContent>
          <Select value={region} onValueChange={setRegion}>
            <SelectTrigger className="max-w-xs">
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

      {/* Product Recommendations */}
      <ProductRecommendations tire={desiredTire} region={region} />
    </div>
  )
}
