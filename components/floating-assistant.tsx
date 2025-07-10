"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { HelpCircle, X, Lightbulb } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

export function FloatingAssistant() {
  const [isOpen, setIsOpen] = useState(false)

  const tips = [
    "Start by entering your career goal and selecting your skill level on the home page.",
    "Your personalized roadmap is generated with real, curated resources for each step.",
    "Use the AI tab to chat directly with the assistant for any learning questions.",
    "Switch careers or levels anytime by editing your goal from the roadmap page.",
  ]

  const [currentTip, setCurrentTip] = useState(0)

  const nextTip = () => {
    setCurrentTip((prev) => (prev + 1) % tips.length)
  }

  const prevTip = () => {
    setCurrentTip((prev) => (prev - 1 + tips.length) % tips.length)
  }

  return (
    <>
      {/* Floating Help Button */}
      <motion.div
        className="fixed bottom-6 right-6 z-50"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 2, type: "spring", stiffness: 200 }}
      >
        <Button
          onClick={() => setIsOpen(true)}
          className="floating w-14 h-14 rounded-full gradient-bg shadow-lg hover:shadow-xl transition-shadow"
        >
          <HelpCircle className="w-6 h-6 text-white" />
        </Button>
      </motion.div>

      {/* Help Modal */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-md"
            >
              <Card className="border-0 shadow-2xl">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-8 gradient-bg rounded-full flex items-center justify-center">
                        <Lightbulb className="w-4 h-4 text-white dark:-scale-x-100" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Quick Tips</h3>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => setIsOpen(false)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    <div className="bg-white/90 dark:bg-gray-900/90 p-4 rounded-lg shadow-inner">
                      <p className="text-gray-900 dark:text-gray-100 leading-relaxed">{tips[currentTip]}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        {tips.map((_, index) => (
                          <div
                            key={index}
                            className={`w-2 h-2 rounded-full transition-colors ${
                              index === currentTip ? "bg-deep-blue" : "bg-gray-200 dark:bg-gray-700"
                            }`}
                          />
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={prevTip}
                          variant="outline"
                          size="sm"
                          className="text-deep-blue border-deep-blue bg-transparent"
                          disabled={tips.length <= 1}
                        >
                          Prev Tip
                        </Button>
                        <Button
                          onClick={nextTip}
                          variant="outline"
                          size="sm"
                          className="text-deep-blue border-deep-blue bg-transparent"
                          disabled={tips.length <= 1}
                        >
                          Next Tip
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
