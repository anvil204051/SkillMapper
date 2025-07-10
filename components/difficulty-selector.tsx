"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Zap, Target, Trophy, Clock, BookOpen, Users } from "lucide-react"

interface DifficultyLevel {
  id: "beginner" | "intermediate" | "advanced"
  title: string
  description: string
  duration: string
  commitment: string
  prerequisites: string
  icon: React.ReactNode
  color: string
  features: string[]
}

const difficultyLevels: DifficultyLevel[] = [
  {
    id: "beginner",
    title: "Beginner",
    description: "Perfect for those starting from scratch with no prior experience",
    duration: "3-6 months",
    commitment: "5-10 hours/week",
    prerequisites: "None required",
    icon: <Zap className="w-6 h-6" />,
    color: "bg-green-100 text-green-800 border-green-200",
    features: [
      "Step-by-step fundamentals",
      "Basic concepts and terminology",
      "Hands-on practice exercises",
      "Beginner-friendly resources",
      "Community support",
    ],
  },
  {
    id: "intermediate",
    title: "Intermediate",
    description: "For learners with some basic knowledge looking to advance their skills",
    duration: "4-8 months",
    commitment: "8-15 hours/week",
    prerequisites: "Basic understanding of the field",
    icon: <Target className="w-6 h-6" />,
    color: "bg-yellow-100 text-yellow-800 border-yellow-200",
    features: [
      "Advanced concepts and techniques",
      "Real-world project experience",
      "Industry best practices",
      "Professional-level resources",
      "Mentorship opportunities",
    ],
  },
  {
    id: "advanced",
    title: "Advanced",
    description: "Intensive program for experienced learners aiming for mastery",
    duration: "6-12 months",
    commitment: "15-25 hours/week",
    prerequisites: "Solid foundation and prior experience",
    icon: <Trophy className="w-6 h-6" />,
    color: "bg-red-100 text-red-800 border-red-200",
    features: [
      "Expert-level mastery",
      "Complex project portfolios",
      "Industry specialization",
      "Leadership and strategy",
      "Professional networking",
    ],
  },
]

interface DifficultySelectorProps {
  isOpen: boolean
  onClose: () => void
  onSelect: (difficulty: "beginner" | "intermediate" | "advanced", careerGoal: string) => void
  careerGoal: string
}

export function DifficultySelector({ isOpen, onClose, onSelect, careerGoal }: DifficultySelectorProps) {
  const [selectedDifficulty, setSelectedDifficulty] = useState<"beginner" | "intermediate" | "advanced" | null>(null)

  const handleSelect = () => {
    if (selectedDifficulty) {
      onSelect(selectedDifficulty, careerGoal)
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">Choose Your Learning Path</DialogTitle>
          <DialogDescription className="text-lg">
            Select the difficulty level that best matches your current experience with{" "}
            <span className="font-semibold text-primary">{careerGoal}</span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid md:grid-cols-3 gap-6 py-4">
          {difficultyLevels.map((level, index) => (
            <motion.div
              key={level.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg ${
                  selectedDifficulty === level.id
                    ? "ring-2 ring-primary shadow-lg scale-105"
                    : "hover:scale-102 border-2"
                } ${level.color}`}
                onClick={() => setSelectedDifficulty(level.id)}
              >
                <CardHeader className="text-center pb-3">
                  <div className="flex justify-center mb-3">{level.icon}</div>
                  <CardTitle className="text-xl">{level.title}</CardTitle>
                  <CardDescription className="text-sm">{level.description}</CardDescription>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Key Stats */}
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-muted-foreground" />
                      <span>{level.duration}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <BookOpen className="w-4 h-4 text-muted-foreground" />
                      <span>{level.commitment}</span>
                    </div>
                  </div>

                  {/* Prerequisites */}
                  <div>
                    <p className="text-sm font-medium mb-1">Prerequisites:</p>
                    <p className="text-xs text-muted-foreground">{level.prerequisites}</p>
                  </div>

                  {/* Features */}
                  <div>
                    <p className="text-sm font-medium mb-2">What you'll get:</p>
                    <ul className="space-y-1">
                      {level.features.map((feature, i) => (
                        <li key={i} className="text-xs text-muted-foreground flex items-start">
                          <span className="w-1 h-1 bg-current rounded-full mt-2 mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Selection Indicator */}
                  {selectedDifficulty === level.id && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex justify-center">
                      <Badge className="gradient-bg text-white">Selected</Badge>
                    </motion.div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSelect} disabled={!selectedDifficulty} className="gradient-bg min-w-[120px]">
            {selectedDifficulty ? `Start ${selectedDifficulty} Path` : "Select a Level"}
          </Button>
        </div>

        {/* Help Text */}
        <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
          <div className="flex items-start space-x-2">
            <Users className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-blue-800 dark:text-blue-200">Not sure which level to choose?</p>
              <p className="text-xs text-blue-600 dark:text-blue-300 mt-1">
                Start with Beginner if you're completely new, Intermediate if you have some basic knowledge, or Advanced
                if you're looking to master the field. You can always adjust your path later!
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
