"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { getTireRecommendations, type TireSpec, type TireBrand } from "@/lib/fitment-data"
import { Star, Globe, Tag, ChevronDown, ChevronUp } from "lucide-react"

interface TireRecommendationsProps {
  tire: TireSpec
  region: string
}

export function TireRecommendations({ tire, region }: TireRecommendationsProps) {
  const [filter, setFilter] = useState<'all' | 'budget' | 'midrange' | 'premium'>('all')
  const [expanded, setExpanded] = useState<string | null>(null)
  
  const recommendations = useMemo(() => {
    return getTireRecommendations(tire, region, filter)
  }, [tire, region, filter])
  
  const priceRangeColors: Record<string, string> = {
    budget: "bg-green-500/10 text-green-500",
    midrange: "bg-blue-500/10 text-blue-500",
    premium: "bg-amber-500/10 text-amber-500"
  }
  
  const priceRangeLabels: Record<string, string> = {
    budget: "Budget",
    midrange: "Mid-Range",
    premium: "Premium"
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <Star className="h-5 w-5 text-primary" />
          Rekomendasi Merek Ban
        </CardTitle>
        <CardDescription>
          Merek ban yang tersedia untuk ukuran {tire.width}/{tire.profile}R{tire.diameter} di region kamu
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Filter buttons */}
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filter === 'all' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('all')}
          >
            Semua
          </Button>
          <Button
            variant={filter === 'budget' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('budget')}
          >
            Budget
          </Button>
          <Button
            variant={filter === 'midrange' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('midrange')}
          >
            Mid-Range
          </Button>
          <Button
            variant={filter === 'premium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('premium')}
          >
            Premium
          </Button>
        </div>
        
        {/* Results count */}
        <p className="text-sm text-muted-foreground">
          {recommendations.length} merek ditemukan
        </p>
        
        {/* Brand list */}
        <div className="space-y-2 max-h-96 overflow-y-auto pr-2">
          {recommendations.map((brand) => (
            <BrandCard
              key={brand.name}
              brand={brand}
              isExpanded={expanded === brand.name}
              onToggle={() => setExpanded(expanded === brand.name ? null : brand.name)}
              priceRangeColors={priceRangeColors}
              priceRangeLabels={priceRangeLabels}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

interface BrandCardProps {
  brand: TireBrand
  isExpanded: boolean
  onToggle: () => void
  priceRangeColors: Record<string, string>
  priceRangeLabels: Record<string, string>
}

function BrandCard({ brand, isExpanded, onToggle, priceRangeColors, priceRangeLabels }: BrandCardProps) {
  return (
    <div className="rounded-lg border border-border/50 bg-secondary/30 overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full p-3 flex items-center justify-between hover:bg-secondary/50 transition-colors"
      >
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
            <span className="text-sm font-bold text-primary">
              {brand.name.charAt(0)}
            </span>
          </div>
          <div className="text-left">
            <h4 className="font-semibold">{brand.name}</h4>
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Globe className="h-3 w-3" />
              <span>{brand.country}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className={priceRangeColors[brand.priceRange]}>
            {priceRangeLabels[brand.priceRange]}
          </Badge>
          {isExpanded ? (
            <ChevronUp className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          )}
        </div>
      </button>
      
      {isExpanded && (
        <div className="px-3 pb-3 pt-1 border-t border-border/50">
          <div className="space-y-3">
            <div>
              <p className="text-xs text-muted-foreground mb-1">Spesialisasi</p>
              <div className="flex flex-wrap gap-1">
                {brand.specialties.map((spec) => (
                  <Badge key={spec} variant="outline" className="text-xs">
                    {spec}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Lini Populer</p>
              <div className="flex flex-wrap gap-1">
                {brand.popularLines.map((line) => (
                  <Badge key={line} variant="secondary" className="text-xs">
                    <Tag className="h-3 w-3 mr-1" />
                    {line}
                  </Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-xs text-muted-foreground mb-1">Tersedia di</p>
              <p className="text-xs">
                {brand.regions.join(", ")}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
