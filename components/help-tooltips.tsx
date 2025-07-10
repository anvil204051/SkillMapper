"use client"

import type React from "react"

import { useState } from "react"
import { HelpCircle } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { motion, AnimatePresence } from "framer-motion"

interface TooltipProps {
  content: string
  title?: string
  position?: "top" | "bottom" | "left" | "right"
  children: React.ReactNode
}

export function HelpTooltip({ content, title, position = "top", children }: TooltipProps) {
  const [isOpen, setIsOpen] = useState(false)

  const getPositionClasses = () => {
    switch (position) {
      case "top":
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
      case "bottom":
        return "top-full left-1/2 transform -translate-x-1/2 mt-2"
      case "left":
        return "right-full top-1/2 transform -translate-y-1/2 mr-2"
      case "right":
        return "left-full top-1/2 transform -translate-y-1/2 ml-2"
      default:
        return "bottom-full left-1/2 transform -translate-x-1/2 mb-2"
    }
  }

  return (
    <div className="relative inline-block">
      <div onMouseEnter={() => setIsOpen(true)} onMouseLeave={() => setIsOpen(false)} className="cursor-help">
        {children}
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className={`absolute z-50 ${getPositionClasses()}`}
          >
            <Card className="border shadow-lg bg-white max-w-xs">
              <CardContent className="p-3">
                {title && <h4 className="font-medium text-sm mb-1">{title}</h4>}
                <p className="text-xs text-muted-foreground leading-relaxed">{content}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function HelpIcon({ content, title, position }: Omit<TooltipProps, "children">) {
  return (
    <HelpTooltip content={content} title={title} position={position}>
      <HelpCircle className="w-4 h-4 text-muted-foreground hover:text-primary transition-colors" />
    </HelpTooltip>
  )
}
