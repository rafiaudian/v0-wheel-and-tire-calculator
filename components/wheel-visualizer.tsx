"use client"

import { useMemo } from "react"
import type { TireSpec, WheelSpec, FitmentResult } from "@/lib/fitment-data"

interface WheelVisualizerProps {
  tire: TireSpec
  wheel: WheelSpec
  fitment: FitmentResult
}

export function WheelVisualizer({ tire, wheel, fitment }: WheelVisualizerProps) {
  const visualization = useMemo(() => {
    // Scale factor for visualization
    const scale = 0.4
    
    // Wheel dimensions
    const wheelDiameterPx = wheel.diameter * 25.4 * scale
    const wheelWidthPx = wheel.width * 25.4 * scale
    
    // Tire dimensions
    const tireSidewallPx = fitment.tireHeight * scale
    const tireDiameterPx = fitment.overallDiameter * scale
    const tireWidthPx = tire.width * scale
    
    // Center position
    const centerX = 200
    const centerY = 180
    
    // Wheel radius
    const wheelRadius = wheelDiameterPx / 2
    
    // Outer tire radius
    const tireRadius = tireDiameterPx / 2
    
    return {
      wheelRadius,
      tireRadius,
      tireSidewallPx,
      tireWidthPx,
      wheelWidthPx,
      centerX,
      centerY
    }
  }, [tire, wheel, fitment])

  const { wheelRadius, tireRadius, centerX, centerY } = visualization

  // Fitment color based on wheel fitment status
  const getFitmentColor = () => {
    switch (fitment.wheelFitment) {
      case 'ideal':
        return '#22c55e' // green
      case 'wide':
        return '#f59e0b' // amber
      case 'stretch':
        return '#ef4444' // red
      case 'narrow':
        return '#f59e0b' // amber
      default:
        return '#22c55e'
    }
  }

  // Generate spokes
  const spokes = useMemo(() => {
    const spokeCount = 5
    const innerRadius = wheelRadius * 0.3
    const outerRadius = wheelRadius * 0.85
    
    return Array.from({ length: spokeCount }, (_, i) => {
      const angle1 = (i * 2 * Math.PI) / spokeCount - Math.PI / 2
      const angle2 = ((i + 0.5) * 2 * Math.PI) / spokeCount - Math.PI / 2
      
      const x1Inner = centerX + Math.cos(angle1) * innerRadius
      const y1Inner = centerY + Math.sin(angle1) * innerRadius
      const x1Outer = centerX + Math.cos(angle1) * outerRadius
      const y1Outer = centerY + Math.sin(angle1) * outerRadius
      
      const x2Inner = centerX + Math.cos(angle2) * innerRadius
      const y2Inner = centerY + Math.sin(angle2) * innerRadius
      const x2Outer = centerX + Math.cos(angle2) * outerRadius
      const y2Outer = centerY + Math.sin(angle2) * outerRadius
      
      return `M ${x1Inner} ${y1Inner} L ${x1Outer} ${y1Outer} L ${x2Outer} ${y2Outer} L ${x2Inner} ${y2Inner} Z`
    })
  }, [wheelRadius, centerX, centerY])

  // Generate lug holes
  const lugHoles = useMemo(() => {
    const [lugCount] = wheel.pcd.split('x').map(Number)
    const lugRadius = wheelRadius * 0.4
    
    return Array.from({ length: lugCount || 5 }, (_, i) => {
      const angle = (i * 2 * Math.PI) / (lugCount || 5) - Math.PI / 2
      return {
        cx: centerX + Math.cos(angle) * lugRadius,
        cy: centerY + Math.sin(angle) * lugRadius
      }
    })
  }, [wheel.pcd, wheelRadius, centerX, centerY])

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto">
      <svg viewBox="0 0 400 360" className="w-full h-full">
        <defs>
          {/* Tire gradient */}
          <radialGradient id="tireGradient" cx="50%" cy="50%" r="50%">
            <stop offset="70%" stopColor="#1a1a1a" />
            <stop offset="85%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </radialGradient>
          
          {/* Wheel gradient */}
          <radialGradient id="wheelGradient" cx="30%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#4a4a4a" />
            <stop offset="50%" stopColor="#2a2a2a" />
            <stop offset="100%" stopColor="#1a1a1a" />
          </radialGradient>
          
          {/* Spoke gradient */}
          <linearGradient id="spokeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5a5a5a" />
            <stop offset="50%" stopColor="#3a3a3a" />
            <stop offset="100%" stopColor="#2a2a2a" />
          </linearGradient>
          
          {/* Glow effect */}
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>
        
        {/* Outer tire */}
        <circle
          cx={centerX}
          cy={centerY}
          r={tireRadius}
          fill="url(#tireGradient)"
          stroke="#333"
          strokeWidth="2"
        />
        
        {/* Tire tread pattern */}
        {Array.from({ length: 36 }, (_, i) => {
          const angle = (i * Math.PI * 2) / 36
          const x1 = centerX + Math.cos(angle) * (tireRadius - 3)
          const y1 = centerY + Math.sin(angle) * (tireRadius - 3)
          const x2 = centerX + Math.cos(angle) * (tireRadius - 12)
          const y2 = centerY + Math.sin(angle) * (tireRadius - 12)
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="#252525"
              strokeWidth="2"
            />
          )
        })}
        
        {/* Tire sidewall highlight */}
        <circle
          cx={centerX}
          cy={centerY}
          r={tireRadius - 15}
          fill="none"
          stroke="#333"
          strokeWidth="1"
        />
        
        {/* Wheel rim outer */}
        <circle
          cx={centerX}
          cy={centerY}
          r={wheelRadius}
          fill="url(#wheelGradient)"
          stroke={getFitmentColor()}
          strokeWidth="3"
          filter="url(#glow)"
        />
        
        {/* Wheel lip */}
        <circle
          cx={centerX}
          cy={centerY}
          r={wheelRadius - 5}
          fill="none"
          stroke="#4a4a4a"
          strokeWidth="2"
        />
        
        {/* Spokes */}
        {spokes.map((path, i) => (
          <path
            key={i}
            d={path}
            fill="url(#spokeGradient)"
            stroke="#1a1a1a"
            strokeWidth="1"
          />
        ))}
        
        {/* Center cap */}
        <circle
          cx={centerX}
          cy={centerY}
          r={wheelRadius * 0.2}
          fill="#2a2a2a"
          stroke="#3a3a3a"
          strokeWidth="2"
        />
        
        {/* Lug holes */}
        {lugHoles.map((hole, i) => (
          <circle
            key={i}
            cx={hole.cx}
            cy={hole.cy}
            r={6}
            fill="#1a1a1a"
            stroke="#3a3a3a"
            strokeWidth="1"
          />
        ))}
        
        {/* Center logo */}
        <circle
          cx={centerX}
          cy={centerY}
          r={wheelRadius * 0.1}
          fill={getFitmentColor()}
          opacity="0.8"
        />
      </svg>
      
      {/* Dimension labels */}
      <div className="absolute top-2 left-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        <span className="font-mono">{tire.width}/{tire.profile}R{tire.diameter}</span>
      </div>
      
      <div className="absolute top-2 right-2 text-xs text-muted-foreground bg-background/80 px-2 py-1 rounded">
        <span className="font-mono">{wheel.width}J x {wheel.diameter} ET{wheel.offset}</span>
      </div>
      
      {/* Fitment status */}
      <div 
        className="absolute bottom-2 left-1/2 -translate-x-1/2 text-xs font-semibold px-3 py-1 rounded-full"
        style={{ 
          backgroundColor: getFitmentColor() + '20',
          color: getFitmentColor()
        }}
      >
        {fitment.wheelFitment === 'ideal' && 'Perfect Fitment'}
        {fitment.wheelFitment === 'wide' && 'Sedikit Lebar'}
        {fitment.wheelFitment === 'stretch' && 'Stretch Setup'}
        {fitment.wheelFitment === 'narrow' && 'Velg Terlalu Sempit'}
      </div>
    </div>
  )
}
