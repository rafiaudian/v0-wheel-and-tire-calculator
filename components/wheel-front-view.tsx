"use client"

import { useMemo } from "react"
import type { TireSpec, WheelSpec, FitmentResult } from "@/lib/fitment-data"

interface WheelFrontViewProps {
  tire: TireSpec
  wheel: WheelSpec
  fitment: FitmentResult
  wheelBrand?: string
  wheelModel?: string
  tireBrand?: string
  tireModel?: string
  spokeCount?: number
  spokeStyle?: "multi" | "mesh" | "split" | "dish"
}

export function WheelFrontView({
  tire,
  wheel,
  fitment,
  wheelBrand = "",
  wheelModel = "",
  tireBrand = "",
  tireModel = "",
  spokeCount = 10,
  spokeStyle = "multi"
}: WheelFrontViewProps) {
  const dimensions = useMemo(() => {
    const scale = 0.5
    const wheelDiameterMM = wheel.diameter * 25.4
    const sidewallHeight = (tire.width * tire.profile) / 100
    const overallDiameter = wheelDiameterMM + (sidewallHeight * 2)
    
    return {
      wheelDiameter: wheelDiameterMM * scale,
      overallDiameter: overallDiameter * scale,
      sidewallHeight: sidewallHeight * scale,
      tireWidth: tire.width * scale,
      lipWidth: 8 * scale,
      hubDiameter: 45 * scale,
      boltCircle: 65 * scale,
      scale
    }
  }, [tire, wheel])

  const {
    wheelDiameter,
    overallDiameter,
    sidewallHeight,
    lipWidth,
    hubDiameter,
    boltCircle
  } = dimensions

  const svgSize = 320
  const centerX = svgSize / 2
  const centerY = svgSize / 2
  const outerRadius = overallDiameter / 2
  const wheelRadius = wheelDiameter / 2
  const innerWheelRadius = wheelRadius - lipWidth

  // Generate spokes based on style
  const generateSpokes = () => {
    const spokes = []
    const angleStep = (2 * Math.PI) / spokeCount

    for (let i = 0; i < spokeCount; i++) {
      const angle = i * angleStep - Math.PI / 2
      const nextAngle = (i + 1) * angleStep - Math.PI / 2
      const midAngle = angle + angleStep / 2

      if (spokeStyle === "multi" || spokeStyle === "split") {
        // Multi-spoke style (like Rays Engineering)
        const innerStartRadius = hubDiameter / 2 + 5
        const outerEndRadius = innerWheelRadius - 5

        // Main spoke
        const x1 = centerX + Math.cos(angle) * innerStartRadius
        const y1 = centerY + Math.sin(angle) * innerStartRadius
        const x2 = centerX + Math.cos(angle) * outerEndRadius
        const y2 = centerY + Math.sin(angle) * outerEndRadius

        // Spoke with taper
        const widthInner = 4
        const widthOuter = spokeStyle === "split" ? 6 : 8
        
        const perpX = Math.cos(angle + Math.PI / 2)
        const perpY = Math.sin(angle + Math.PI / 2)

        spokes.push(
          <path
            key={`spoke-${i}`}
            d={`
              M ${x1 + perpX * widthInner / 2} ${y1 + perpY * widthInner / 2}
              L ${x2 + perpX * widthOuter / 2} ${y2 + perpY * widthOuter / 2}
              L ${x2 - perpX * widthOuter / 2} ${y2 - perpY * widthOuter / 2}
              L ${x1 - perpX * widthInner / 2} ${y1 - perpY * widthInner / 2}
              Z
            `}
            fill="url(#spokeGradient)"
            stroke="#555"
            strokeWidth="0.5"
          />
        )

        if (spokeStyle === "split") {
          // Add split line
          spokes.push(
            <line
              key={`split-${i}`}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#333"
              strokeWidth="1"
            />
          )
        }
      } else if (spokeStyle === "mesh") {
        // Mesh style
        const innerRadius = hubDiameter / 2 + 10
        const outerRadius = innerWheelRadius - 5
        const midRadius = (innerRadius + outerRadius) / 2

        const x1 = centerX + Math.cos(angle) * innerRadius
        const y1 = centerY + Math.sin(angle) * innerRadius
        const x2 = centerX + Math.cos(midAngle) * midRadius
        const y2 = centerY + Math.sin(midAngle) * midRadius
        const x3 = centerX + Math.cos(angle) * outerRadius
        const y3 = centerY + Math.sin(angle) * outerRadius

        spokes.push(
          <g key={`mesh-${i}`}>
            <line x1={x1} y1={y1} x2={x2} y2={y2} stroke="url(#spokeGradient)" strokeWidth="3" strokeLinecap="round" />
            <line x1={x2} y1={y1} x2={x3} y2={y3} stroke="url(#spokeGradient)" strokeWidth="3" strokeLinecap="round" />
          </g>
        )
      }
    }

    return spokes
  }

  // Generate lug holes
  const generateLugHoles = () => {
    const pcdMatch = wheel.pcd.match(/(\d+)x/)
    const lugCount = pcdMatch ? parseInt(pcdMatch[1]) : 5
    const holes = []
    const angleStep = (2 * Math.PI) / lugCount

    for (let i = 0; i < lugCount; i++) {
      const angle = i * angleStep - Math.PI / 2
      const x = centerX + Math.cos(angle) * (boltCircle / 2)
      const y = centerY + Math.sin(angle) * (boltCircle / 2)

      holes.push(
        <circle
          key={`lug-${i}`}
          cx={x}
          cy={y}
          r={4}
          fill="#111"
          stroke="#444"
          strokeWidth="1"
        />
      )
    }

    return holes
  }

  // Generate tire tread pattern
  const generateTreadPattern = () => {
    const treads = []
    const segments = 60
    const angleStep = (2 * Math.PI) / segments

    for (let i = 0; i < segments; i++) {
      const angle = i * angleStep
      const innerR = outerRadius - 6
      const outerR = outerRadius - 2

      if (i % 3 === 0) {
        const x1 = centerX + Math.cos(angle) * innerR
        const y1 = centerY + Math.sin(angle) * innerR
        const x2 = centerX + Math.cos(angle) * outerR
        const y2 = centerY + Math.sin(angle) * outerR

        treads.push(
          <line
            key={`tread-${i}`}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#1a1a1a"
            strokeWidth="2"
          />
        )
      }
    }

    return treads
  }

  return (
    <div className="relative">
      <svg
        viewBox={`0 0 ${svgSize} ${svgSize}`}
        className="w-full h-auto"
        style={{ maxWidth: "300px" }}
      >
        <defs>
          {/* Gradients */}
          <radialGradient id="tireGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="50%" stopColor="#1a1a1a" />
            <stop offset="100%" stopColor="#0a0a0a" />
          </radialGradient>
          
          <radialGradient id="sidewallGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </radialGradient>

          <radialGradient id="wheelGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#8a8a8a" />
            <stop offset="50%" stopColor="#6a6a6a" />
            <stop offset="100%" stopColor="#4a4a4a" />
          </radialGradient>

          <linearGradient id="spokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#9a9a9a" />
            <stop offset="50%" stopColor="#7a7a7a" />
            <stop offset="100%" stopColor="#5a5a5a" />
          </linearGradient>

          <radialGradient id="hubGradient" cx="30%" cy="30%">
            <stop offset="0%" stopColor="#aaa" />
            <stop offset="100%" stopColor="#666" />
          </radialGradient>

          <radialGradient id="lipGradient" cx="50%" cy="50%">
            <stop offset="0%" stopColor="#888" />
            <stop offset="100%" stopColor="#555" />
          </radialGradient>
        </defs>

        {/* Outer tire (tread) */}
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius}
          fill="url(#tireGradient)"
          stroke="#111"
          strokeWidth="1"
        />

        {/* Tread pattern */}
        {generateTreadPattern()}

        {/* Tire sidewall text area */}
        <circle
          cx={centerX}
          cy={centerY}
          r={outerRadius - 8}
          fill="none"
          stroke="#2a2a2a"
          strokeWidth="1"
        />

        {/* Tire size text on sidewall */}
        <text
          textAnchor="middle"
          fontSize="8"
          fill="#555"
          fontFamily="Arial, sans-serif"
          fontWeight="bold"
        >
          <textPath href="#tireSizeArc" startOffset="50%">
            {tire.width}/{tire.profile} R{tire.diameter} {tireBrand && tireModel ? `• ${tireBrand.toUpperCase()} ${tireModel.toUpperCase()}` : ""}
          </textPath>
        </text>

        {/* Path for tire text */}
        <defs>
          <path
            id="tireSizeArc"
            d={`
              M ${centerX - outerRadius + 15} ${centerY}
              A ${outerRadius - 15} ${outerRadius - 15} 0 0 1 ${centerX + outerRadius - 15} ${centerY}
            `}
            fill="none"
          />
        </defs>

        {/* Inner tire edge / wheel lip contact */}
        <circle
          cx={centerX}
          cy={centerY}
          r={wheelRadius}
          fill="url(#sidewallGradient)"
          stroke="#333"
          strokeWidth="2"
        />

        {/* Wheel outer lip */}
        <circle
          cx={centerX}
          cy={centerY}
          r={wheelRadius - 2}
          fill="url(#lipGradient)"
          stroke="#444"
          strokeWidth="1"
        />

        {/* Wheel inner surface */}
        <circle
          cx={centerX}
          cy={centerY}
          r={innerWheelRadius}
          fill="url(#wheelGradient)"
          stroke="#555"
          strokeWidth="1"
        />

        {/* Spokes */}
        {generateSpokes()}

        {/* Center hub */}
        <circle
          cx={centerX}
          cy={centerY}
          r={hubDiameter / 2 + 5}
          fill="url(#hubGradient)"
          stroke="#666"
          strokeWidth="1"
        />

        {/* Lug holes */}
        {generateLugHoles()}

        {/* Center cap */}
        <circle
          cx={centerX}
          cy={centerY}
          r={hubDiameter / 4}
          fill="#222"
          stroke="#444"
          strokeWidth="1"
        />

        {/* Brand logo area (center) */}
        {wheelBrand && (
          <text
            x={centerX}
            y={centerY + 3}
            textAnchor="middle"
            fontSize="6"
            fill="#888"
            fontFamily="Arial, sans-serif"
            fontWeight="bold"
          >
            {wheelBrand.substring(0, 8).toUpperCase()}
          </text>
        )}
      </svg>

      {/* Labels below */}
      <div className="text-center mt-3 space-y-1">
        {wheelBrand && wheelModel && (
          <div className="text-sm font-semibold text-foreground">
            {wheelBrand} {wheelModel}
          </div>
        )}
        <div className="font-mono text-xs text-muted-foreground">
          {wheel.width}J x R{wheel.diameter} ET{wheel.offset > 0 ? "+" : ""}{wheel.offset}
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          {tire.width}/{tire.profile}R{tire.diameter}
          {tireBrand && tireModel && ` • ${tireBrand} ${tireModel}`}
        </div>
        <div className="text-xs text-muted-foreground">
          PCD: {wheel.pcd}
        </div>
      </div>
    </div>
  )
}
