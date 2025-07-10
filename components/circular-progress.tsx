"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface CircularProgressProps {
  progress: number
  size?: number
  strokeWidth?: number
  className?: string
  showPercentage?: boolean
  color?: "blue" | "purple" | "teal" | "gradient"
}

export function CircularProgress({
  progress,
  size = 120,
  strokeWidth = 8,
  className = "",
  showPercentage = true,
  color = "gradient",
}: CircularProgressProps) {
  const [animatedProgress, setAnimatedProgress] = useState(0)

  const radius = (size - strokeWidth) / 2
  const circumference = radius * 2 * Math.PI
  const strokeDasharray = `${circumference} ${circumference}`
  const strokeDashoffset = circumference - (animatedProgress / 100) * circumference

  useEffect(() => {
    const timer = setTimeout(() => setAnimatedProgress(progress), 100)
    return () => clearTimeout(timer)
  }, [progress])

  const getStrokeColor = () => {
    switch (color) {
      case "blue":
        return "hsl(var(--deep-blue))"
      case "purple":
        return "hsl(var(--deep-purple))"
      case "teal":
        return "hsl(var(--teal))"
      default:
        return "url(#gradient)"
    }
  }

  return (
    <div className={`relative ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        <defs>
          <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(var(--deep-blue))" />
            <stop offset="50%" stopColor="hsl(var(--teal))" />
            <stop offset="100%" stopColor="hsl(var(--deep-purple))" />
          </linearGradient>
        </defs>

        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
          opacity={0.3}
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={getStrokeColor()}
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="progress-ring"
        />
      </svg>

      {showPercentage && (
        <div className="absolute inset-0 flex items-center justify-center">
          <motion.span
            className="text-2xl font-bold gradient-text"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.3 }}
          >
            {Math.round(animatedProgress)}%
          </motion.span>
        </div>
      )}
    </div>
  )
}
