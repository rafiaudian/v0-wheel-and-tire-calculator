"use client"

import { useMemo } from "react"
import type { TireSpec, WheelSpec, FitmentResult } from "@/lib/fitment-data"

interface WheelCrossSectionProps {
  tire: TireSpec
  wheel: WheelSpec
  fitment: FitmentResult
  label?: string
  showTire?: boolean
  showWheel?: boolean
}

export function WheelCrossSection({ 
  tire, 
  wheel, 
  fitment, 
  label = "Fitment",
  showTire = true,
  showWheel = true
}: WheelCrossSectionProps) {
  const dimensions = useMemo(() => {
    // Scale factor
    const scale = 0.45
    
    // Calculate real dimensions in mm
    const wheelDiameterMM = wheel.diameter * 25.4
    const wheelWidthMM = wheel.width * 25.4
    const tireWidthMM = tire.width
    const sidewallHeight = (tire.width * tire.profile) / 100
    const overallDiameter = wheelDiameterMM + (sidewallHeight * 2)
    
    // Offset calculations (mm)
    const offsetMM = wheel.offset
    const wheelCenterToMounting = wheelWidthMM / 2
    const backSpacing = wheelCenterToMounting + offsetMM
    const frontSpacing = wheelWidthMM - backSpacing
    
    // Scaled dimensions for SVG
    return {
      wheelDiameter: wheelDiameterMM * scale,
      wheelWidth: wheelWidthMM * scale,
      tireWidth: tireWidthMM * scale,
      sidewallHeight: sidewallHeight * scale,
      overallDiameter: overallDiameter * scale,
      backSpacing: backSpacing * scale,
      frontSpacing: frontSpacing * scale,
      offsetMM,
      wheelWidthMM,
      backSpacingMM: backSpacing,
      sidewallHeightMM: sidewallHeight,
      overallDiameterMM: overallDiameter,
      scale
    }
  }, [tire, wheel])

  const {
    wheelDiameter,
    wheelWidth,
    tireWidth,
    sidewallHeight,
    overallDiameter,
    backSpacing,
    offsetMM,
    wheelWidthMM,
    backSpacingMM,
    sidewallHeightMM,
    overallDiameterMM
  } = dimensions

  // SVG dimensions
  const svgWidth = 280
  const svgHeight = 380
  const centerX = svgWidth / 2
  const centerY = svgHeight / 2 - 10
  
  // Wheel center offset from mounting surface
  const mountingLineX = centerX - backSpacing + (wheelWidth / 2)

  // Colors
  const tireColor = "#2d2d2d"
  const tireSidewall = "#1a1a1a"
  const wheelColor = "#4a4a4a"
  const hubColor = "#f59e0b"
  const dimensionColor = "#888"
  const accentColor = "#f59e0b"

  return (
    <div className="relative">
      {/* Label */}
      <div className="text-center mb-2">
        <span className="text-sm font-medium text-accent">{label}</span>
      </div>
      
      <svg 
        viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
        className="w-full h-auto"
        style={{ maxHeight: "350px" }}
      >
        <defs>
          {/* Gradients */}
          <linearGradient id={`tireGrad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#1a1a1a" />
            <stop offset="50%" stopColor="#2d2d2d" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </linearGradient>
          <linearGradient id={`wheelGrad-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3a3a3a" />
            <stop offset="50%" stopColor="#5a5a5a" />
            <stop offset="100%" stopColor="#3a3a3a" />
          </linearGradient>
          <linearGradient id={`hubGrad-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="100%" stopColor="#d97706" />
          </linearGradient>
        </defs>

        {/* Center line (mounting surface) - dashed */}
        <line
          x1={mountingLineX}
          y1={centerY - overallDiameter / 2 - 30}
          x2={mountingLineX}
          y2={centerY + overallDiameter / 2 + 30}
          stroke={dimensionColor}
          strokeWidth="1"
          strokeDasharray="4,4"
        />
        <text
          x={mountingLineX}
          y={centerY + overallDiameter / 2 + 45}
          textAnchor="middle"
          fontSize="8"
          fill={dimensionColor}
        >
          Mounting
        </text>

        {/* Tire - Top section */}
        {showTire && (
          <>
            {/* Top tire (outer) */}
            <path
              d={`
                M ${centerX - tireWidth / 2} ${centerY - wheelDiameter / 2}
                L ${centerX - tireWidth / 2 - 3} ${centerY - wheelDiameter / 2 - sidewallHeight + 10}
                Q ${centerX - tireWidth / 2 - 5} ${centerY - wheelDiameter / 2 - sidewallHeight} ${centerX - tireWidth / 2 + 10} ${centerY - wheelDiameter / 2 - sidewallHeight}
                L ${centerX + tireWidth / 2 - 10} ${centerY - wheelDiameter / 2 - sidewallHeight}
                Q ${centerX + tireWidth / 2 + 5} ${centerY - wheelDiameter / 2 - sidewallHeight} ${centerX + tireWidth / 2 + 3} ${centerY - wheelDiameter / 2 - sidewallHeight + 10}
                L ${centerX + tireWidth / 2} ${centerY - wheelDiameter / 2}
                Z
              `}
              fill={`url(#tireGrad-${label})`}
              stroke="#444"
              strokeWidth="1"
            />
            
            {/* Tread pattern top */}
            <rect
              x={centerX - tireWidth / 2 + 5}
              y={centerY - wheelDiameter / 2 - sidewallHeight}
              width={tireWidth - 10}
              height={8}
              fill={tireSidewall}
              rx="2"
            />
          </>
        )}

        {/* Wheel - Cross section */}
        {showWheel && (
          <>
            {/* Wheel barrel - left side (front) */}
            <rect
              x={centerX - wheelWidth / 2}
              y={centerY - wheelDiameter / 2 + 5}
              width={8}
              height={wheelDiameter - 10}
              fill={`url(#wheelGrad-${label})`}
              stroke="#555"
              strokeWidth="1"
            />
            
            {/* Wheel barrel - right side (back) */}
            <rect
              x={centerX + wheelWidth / 2 - 8}
              y={centerY - wheelDiameter / 2 + 5}
              width={8}
              height={wheelDiameter - 10}
              fill={`url(#wheelGrad-${label})`}
              stroke="#555"
              strokeWidth="1"
            />
            
            {/* Wheel face/lip - left */}
            <path
              d={`
                M ${centerX - wheelWidth / 2} ${centerY - wheelDiameter / 2 + 5}
                L ${centerX - wheelWidth / 2 - 5} ${centerY - wheelDiameter / 2}
                L ${centerX - wheelWidth / 2 - 5} ${centerY - wheelDiameter / 2 - 8}
                L ${centerX - wheelWidth / 2 + 3} ${centerY - wheelDiameter / 2 - 8}
                L ${centerX - wheelWidth / 2 + 8} ${centerY - wheelDiameter / 2 + 5}
                Z
              `}
              fill={wheelColor}
              stroke="#555"
              strokeWidth="1"
            />
            
            {/* Wheel face/lip - right */}
            <path
              d={`
                M ${centerX + wheelWidth / 2} ${centerY - wheelDiameter / 2 + 5}
                L ${centerX + wheelWidth / 2 + 5} ${centerY - wheelDiameter / 2}
                L ${centerX + wheelWidth / 2 + 5} ${centerY - wheelDiameter / 2 - 8}
                L ${centerX + wheelWidth / 2 - 3} ${centerY - wheelDiameter / 2 - 8}
                L ${centerX + wheelWidth / 2 - 8} ${centerY - wheelDiameter / 2 + 5}
                Z
              `}
              fill={wheelColor}
              stroke="#555"
              strokeWidth="1"
            />
            
            {/* Hub/spoke representation */}
            <polygon
              points={`
                ${mountingLineX - 15},${centerY - 15}
                ${mountingLineX + 15},${centerY - 15}
                ${mountingLineX + 25},${centerY}
                ${mountingLineX + 15},${centerY + 15}
                ${mountingLineX - 15},${centerY + 15}
                ${mountingLineX - 25},${centerY}
              `}
              fill={`url(#hubGrad-${label})`}
              stroke="#d97706"
              strokeWidth="1"
            />
            
            {/* Spokes connecting to barrel */}
            <line
              x1={mountingLineX - 20}
              y1={centerY - 10}
              x2={centerX - wheelWidth / 2 + 8}
              y2={centerY - wheelDiameter / 4}
              stroke={hubColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1={mountingLineX + 20}
              y1={centerY - 10}
              x2={centerX + wheelWidth / 2 - 8}
              y2={centerY - wheelDiameter / 4}
              stroke={hubColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1={mountingLineX - 20}
              y1={centerY + 10}
              x2={centerX - wheelWidth / 2 + 8}
              y2={centerY + wheelDiameter / 4}
              stroke={hubColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
            <line
              x1={mountingLineX + 20}
              y1={centerY + 10}
              x2={centerX + wheelWidth / 2 - 8}
              y2={centerY + wheelDiameter / 4}
              stroke={hubColor}
              strokeWidth="4"
              strokeLinecap="round"
            />
          </>
        )}

        {/* Tire - Bottom section */}
        {showTire && (
          <>
            {/* Bottom tire (outer) */}
            <path
              d={`
                M ${centerX - tireWidth / 2} ${centerY + wheelDiameter / 2}
                L ${centerX - tireWidth / 2 - 3} ${centerY + wheelDiameter / 2 + sidewallHeight - 10}
                Q ${centerX - tireWidth / 2 - 5} ${centerY + wheelDiameter / 2 + sidewallHeight} ${centerX - tireWidth / 2 + 10} ${centerY + wheelDiameter / 2 + sidewallHeight}
                L ${centerX + tireWidth / 2 - 10} ${centerY + wheelDiameter / 2 + sidewallHeight}
                Q ${centerX + tireWidth / 2 + 5} ${centerY + wheelDiameter / 2 + sidewallHeight} ${centerX + tireWidth / 2 + 3} ${centerY + wheelDiameter / 2 + sidewallHeight - 10}
                L ${centerX + tireWidth / 2} ${centerY + wheelDiameter / 2}
                Z
              `}
              fill={`url(#tireGrad-${label})`}
              stroke="#444"
              strokeWidth="1"
            />
            
            {/* Tread pattern bottom */}
            <rect
              x={centerX - tireWidth / 2 + 5}
              y={centerY + wheelDiameter / 2 + sidewallHeight - 8}
              width={tireWidth - 10}
              height={8}
              fill={tireSidewall}
              rx="2"
            />
          </>
        )}

        {/* Dimension lines */}
        {/* Overall diameter */}
        <line
          x1={20}
          y1={centerY - overallDiameter / 2}
          x2={20}
          y2={centerY + overallDiameter / 2}
          stroke={dimensionColor}
          strokeWidth="1"
          markerStart="url(#arrowStart)"
          markerEnd="url(#arrowEnd)"
        />
        <line x1={15} y1={centerY - overallDiameter / 2} x2={25} y2={centerY - overallDiameter / 2} stroke={dimensionColor} strokeWidth="1" />
        <line x1={15} y1={centerY + overallDiameter / 2} x2={25} y2={centerY + overallDiameter / 2} stroke={dimensionColor} strokeWidth="1" />
        <text x={10} y={centerY} textAnchor="middle" fontSize="7" fill={dimensionColor} transform={`rotate(-90, 10, ${centerY})`}>
          {overallDiameterMM.toFixed(0)}mm
        </text>

        {/* Wheel width */}
        <line
          x1={centerX - wheelWidth / 2}
          y1={centerY + overallDiameter / 2 + 25}
          x2={centerX + wheelWidth / 2}
          y2={centerY + overallDiameter / 2 + 25}
          stroke={dimensionColor}
          strokeWidth="1"
        />
        <line x1={centerX - wheelWidth / 2} y1={centerY + overallDiameter / 2 + 20} x2={centerX - wheelWidth / 2} y2={centerY + overallDiameter / 2 + 30} stroke={dimensionColor} strokeWidth="1" />
        <line x1={centerX + wheelWidth / 2} y1={centerY + overallDiameter / 2 + 20} x2={centerX + wheelWidth / 2} y2={centerY + overallDiameter / 2 + 30} stroke={dimensionColor} strokeWidth="1" />
        <text x={centerX} y={centerY + overallDiameter / 2 + 35} textAnchor="middle" fontSize="7" fill={dimensionColor}>
          {wheelWidthMM.toFixed(0)}mm ({wheel.width}J)
        </text>

        {/* Backspacing */}
        <line
          x1={mountingLineX}
          y1={centerY - 40}
          x2={centerX + wheelWidth / 2}
          y2={centerY - 40}
          stroke={accentColor}
          strokeWidth="1"
        />
        <text x={(mountingLineX + centerX + wheelWidth / 2) / 2} y={centerY - 45} textAnchor="middle" fontSize="7" fill={accentColor}>
          BackSpace: {backSpacingMM.toFixed(0)}mm
        </text>

        {/* Sidewall height indicator */}
        <line
          x1={svgWidth - 25}
          y1={centerY - wheelDiameter / 2}
          x2={svgWidth - 25}
          y2={centerY - wheelDiameter / 2 - sidewallHeight}
          stroke={dimensionColor}
          strokeWidth="1"
        />
        <line x1={svgWidth - 30} y1={centerY - wheelDiameter / 2} x2={svgWidth - 20} y2={centerY - wheelDiameter / 2} stroke={dimensionColor} strokeWidth="1" />
        <line x1={svgWidth - 30} y1={centerY - wheelDiameter / 2 - sidewallHeight} x2={svgWidth - 20} y2={centerY - wheelDiameter / 2 - sidewallHeight} stroke={dimensionColor} strokeWidth="1" />
        <text x={svgWidth - 15} y={centerY - wheelDiameter / 2 - sidewallHeight / 2} textAnchor="start" fontSize="6" fill={dimensionColor}>
          {sidewallHeightMM.toFixed(0)}mm
        </text>

        {/* Offset indicator */}
        <text x={mountingLineX} y={centerY - overallDiameter / 2 - 15} textAnchor="middle" fontSize="8" fill={accentColor} fontWeight="bold">
          ET{offsetMM > 0 ? '+' : ''}{offsetMM}
        </text>
      </svg>

      {/* Spec label */}
      <div className="text-center mt-2 space-y-1">
        <div className="font-mono text-sm font-semibold text-foreground">
          {tire.width}/{tire.profile}R{tire.diameter}
        </div>
        <div className="font-mono text-xs text-muted-foreground">
          {wheel.width}J x {wheel.diameter} ET{wheel.offset > 0 ? '+' : ''}{wheel.offset}
        </div>
      </div>
    </div>
  )
}
