"use client"

import { useMemo, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getTireRecommendations, type TireSpec, type TireBrand } from "@/lib/fitment-data"
import { ExternalLink, ShoppingCart, Star, Globe, Tag, ChevronRight, Search } from "lucide-react"

interface ProductRecommendationsProps {
  tire: TireSpec
  region: string
}

// E-commerce platforms by region
const ecommercePlatforms: Record<string, { name: string; baseUrl: string; searchParam: string; icon: string }[]> = {
  indonesia: [
    { name: "Tokopedia", baseUrl: "https://www.tokopedia.com/search", searchParam: "q", icon: "🟢" },
    { name: "Shopee", baseUrl: "https://shopee.co.id/search", searchParam: "keyword", icon: "🟠" },
    { name: "Bukalapak", baseUrl: "https://www.bukalapak.com/products", searchParam: "search[keywords]", icon: "🔴" },
    { name: "Blibli", baseUrl: "https://www.blibli.com/cari", searchParam: "s", icon: "🔵" },
  ],
  asia: [
    { name: "Lazada", baseUrl: "https://www.lazada.sg/catalog", searchParam: "q", icon: "🟠" },
    { name: "Shopee", baseUrl: "https://shopee.sg/search", searchParam: "keyword", icon: "🟠" },
    { name: "Alibaba", baseUrl: "https://www.alibaba.com/trade/search", searchParam: "SearchText", icon: "🟡" },
  ],
  europe: [
    { name: "Amazon EU", baseUrl: "https://www.amazon.de/s", searchParam: "k", icon: "🟡" },
    { name: "eBay", baseUrl: "https://www.ebay.com/sch/i.html", searchParam: "_nkw", icon: "🔴" },
    { name: "Oponeo", baseUrl: "https://www.oponeo.co.uk/search", searchParam: "q", icon: "🔵" },
  ],
  americas: [
    { name: "Amazon", baseUrl: "https://www.amazon.com/s", searchParam: "k", icon: "🟡" },
    { name: "Tire Rack", baseUrl: "https://www.tirerack.com/content/tirerack/desktop/en/homepage.html", searchParam: "search", icon: "🔵" },
    { name: "Discount Tire", baseUrl: "https://www.discounttire.com/search", searchParam: "q", icon: "🔴" },
  ],
  global: [
    { name: "Amazon", baseUrl: "https://www.amazon.com/s", searchParam: "k", icon: "🟡" },
    { name: "eBay", baseUrl: "https://www.ebay.com/sch/i.html", searchParam: "_nkw", icon: "🔴" },
    { name: "AliExpress", baseUrl: "https://www.aliexpress.com/wholesale", searchParam: "SearchText", icon: "🟠" },
  ],
}

const priceRangeColors: Record<string, string> = {
  budget: "bg-green-500/10 text-green-500 border-green-500/20",
  midrange: "bg-blue-500/10 text-blue-500 border-blue-500/20",
  premium: "bg-amber-500/10 text-amber-500 border-amber-500/20"
}

const priceRangeLabels: Record<string, string> = {
  budget: "Budget",
  midrange: "Mid-Range",
  premium: "Premium"
}

const priceEstimates: Record<string, { min: number; max: number }> = {
  budget: { min: 400000, max: 800000 },
  midrange: { min: 800000, max: 1500000 },
  premium: { min: 1500000, max: 3500000 }
}

export function ProductRecommendations({ tire, region }: ProductRecommendationsProps) {
  const [filter, setFilter] = useState<'all' | 'budget' | 'midrange' | 'premium'>('all')
  const [selectedBrand, setSelectedBrand] = useState<TireBrand | null>(null)

  const recommendations = useMemo(() => {
    return getTireRecommendations(tire, region, filter)
  }, [tire, region, filter])

  const platforms = ecommercePlatforms[region] || ecommercePlatforms.global

  const tireSize = `${tire.width}/${tire.profile}R${tire.diameter}`

  const generateSearchUrl = (platform: typeof platforms[0], brand: TireBrand, line?: string) => {
    const searchTerm = line 
      ? `${brand.name} ${line} ${tireSize}` 
      : `${brand.name} ${tireSize} ban mobil`
    const encodedSearch = encodeURIComponent(searchTerm)
    return `${platform.baseUrl}?${platform.searchParam}=${encodedSearch}`
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center gap-2 text-xl">
          <ShoppingCart className="h-5 w-5 text-primary" />
          Rekomendasi Produk Ban
        </CardTitle>
        <CardDescription>
          Ban ukuran <span className="font-mono font-semibold text-foreground">{tireSize}</span> yang tersedia di marketplace
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
            Semua ({recommendations.length})
          </Button>
          <Button
            variant={filter === 'budget' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('budget')}
            className={filter === 'budget' ? '' : 'border-green-500/30 text-green-500 hover:bg-green-500/10'}
          >
            Budget
          </Button>
          <Button
            variant={filter === 'midrange' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('midrange')}
            className={filter === 'midrange' ? '' : 'border-blue-500/30 text-blue-500 hover:bg-blue-500/10'}
          >
            Mid-Range
          </Button>
          <Button
            variant={filter === 'premium' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setFilter('premium')}
            className={filter === 'premium' ? '' : 'border-amber-500/30 text-amber-500 hover:bg-amber-500/10'}
          >
            Premium
          </Button>
        </div>

        {/* Brand list with quick buy */}
        <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2">
          {recommendations.map((brand) => (
            <div 
              key={brand.name}
              className="rounded-lg border border-border/50 bg-secondary/20 overflow-hidden hover:border-primary/30 transition-colors"
            >
              {/* Brand header */}
              <button
                onClick={() => setSelectedBrand(selectedBrand?.name === brand.name ? null : brand)}
                className="w-full p-4 flex items-center justify-between hover:bg-secondary/40 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                    <span className="text-lg font-bold text-primary">
                      {brand.name.charAt(0)}
                    </span>
                  </div>
                  <div className="text-left">
                    <h4 className="font-semibold text-base">{brand.name}</h4>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Globe className="h-3 w-3" />
                      <span>{brand.country}</span>
                      <span className="text-border">|</span>
                      <span className="text-muted-foreground">
                        Est. {formatPrice(priceEstimates[brand.priceRange].min)} - {formatPrice(priceEstimates[brand.priceRange].max)}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge className={`${priceRangeColors[brand.priceRange]} border`}>
                    {priceRangeLabels[brand.priceRange]}
                  </Badge>
                  <ChevronRight className={`h-4 w-4 text-muted-foreground transition-transform ${selectedBrand?.name === brand.name ? 'rotate-90' : ''}`} />
                </div>
              </button>

              {/* Expanded details */}
              {selectedBrand?.name === brand.name && (
                <div className="px-4 pb-4 border-t border-border/50 pt-4 space-y-4">
                  {/* Specialties */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Keunggulan</p>
                    <div className="flex flex-wrap gap-1">
                      {brand.specialties.map((spec) => (
                        <Badge key={spec} variant="outline" className="text-xs">
                          <Star className="h-3 w-3 mr-1 text-amber-500" />
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  {/* Popular product lines with buy links */}
                  <div>
                    <p className="text-xs text-muted-foreground mb-2">Lini Produk Populer</p>
                    <div className="space-y-2">
                      {brand.popularLines.map((line) => (
                        <div key={line} className="flex items-center justify-between p-2 rounded-lg bg-background/50 border border-border/30">
                          <div className="flex items-center gap-2">
                            <Tag className="h-4 w-4 text-primary" />
                            <span className="font-medium text-sm">{brand.name} {line}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {platforms.slice(0, 3).map((platform) => (
                              <a
                                key={platform.name}
                                href={generateSearchUrl(platform, brand, line)}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors"
                                title={`Cari di ${platform.name}`}
                              >
                                <span>{platform.icon}</span>
                                <span className="hidden sm:inline">{platform.name}</span>
                              </a>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick search all platforms */}
                  <div className="pt-2 border-t border-border/30">
                    <p className="text-xs text-muted-foreground mb-2">Cari di Semua Marketplace</p>
                    <div className="flex flex-wrap gap-2">
                      {platforms.map((platform) => (
                        <a
                          key={platform.name}
                          href={generateSearchUrl(platform, brand)}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-secondary hover:bg-primary hover:text-primary-foreground transition-colors text-sm"
                        >
                          <span>{platform.icon}</span>
                          <span>{platform.name}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick search box */}
        <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
          <div className="flex items-center gap-2 mb-3">
            <Search className="h-4 w-4 text-primary" />
            <span className="font-medium text-sm">Pencarian Cepat</span>
          </div>
          <p className="text-xs text-muted-foreground mb-3">
            Cari ban ukuran <span className="font-mono font-semibold text-foreground">{tireSize}</span> di marketplace favorit kamu:
          </p>
          <div className="flex flex-wrap gap-2">
            {platforms.map((platform) => (
              <a
                key={platform.name}
                href={`${platform.baseUrl}?${platform.searchParam}=${encodeURIComponent(`ban mobil ${tireSize}`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-background border border-border hover:border-primary hover:bg-primary/10 transition-colors"
              >
                <span>{platform.icon}</span>
                <span className="text-sm font-medium">{platform.name}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </a>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
