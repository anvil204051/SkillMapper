"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Calendar, Flame, Trophy, Target, Zap, Star } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StreakData {
  currentStreak: number
  longestStreak: number
  totalDays: number
  lastActivityDate: string
  weeklyGoal: number
  weeklyProgress: number
  badges: Array<{
    id: string
    name: string
    description: string
    icon: string
    unlockedAt: string
    rarity: "common" | "rare" | "epic" | "legendary"
  }>
}

const mockStreakData: StreakData = {
  currentStreak: 12,
  longestStreak: 28,
  totalDays: 156,
  lastActivityDate: new Date().toISOString().split("T")[0],
  weeklyGoal: 5,
  weeklyProgress: 3,
  badges: [
    {
      id: "1",
      name: "First Steps",
      description: "Started your learning journey",
      icon: "🎯",
      unlockedAt: "2024-01-01",
      rarity: "common",
    },
    {
      id: "2",
      name: "Week Warrior",
      description: "Maintained a 7-day streak",
      icon: "🔥",
      unlockedAt: "2024-01-08",
      rarity: "rare",
    },
    {
      id: "3",
      name: "Consistency King",
      description: "Achieved a 30-day streak",
      icon: "👑",
      unlockedAt: "2024-02-01",
      rarity: "epic",
    },
  ],
}

const streakMilestones = [
  { days: 7, name: "Week Warrior", icon: "🔥", rarity: "rare" },
  { days: 14, name: "Fortnight Fighter", icon: "⚡", rarity: "rare" },
  { days: 30, name: "Monthly Master", icon: "👑", rarity: "epic" },
  { days: 60, name: "Dedication Dynamo", icon: "💎", rarity: "epic" },
  { days: 100, name: "Century Crusher", icon: "🏆", rarity: "legendary" },
  { days: 365, name: "Year Yearner", icon: "🌟", rarity: "legendary" },
]

export function StreakTracker() {
  const [streakData, setStreakData] = useState<StreakData>(mockStreakData)
  const [showBadgeAnimation, setShowBadgeAnimation] = useState(false)
  const [newBadge, setNewBadge] = useState<StreakData["badges"][0] | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    const savedStreak = localStorage.getItem("streakData")
    if (savedStreak) {
      setStreakData(JSON.parse(savedStreak))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem("streakData", JSON.stringify(streakData))
  }, [streakData])

  const markTodayComplete = () => {
    const today = new Date().toISOString().split("T")[0]
    const yesterday = new Date(Date.now() - 86400000).toISOString().split("T")[0]

    if (streakData.lastActivityDate === today) {
      toast({
        title: "Already completed!",
        description: "You've already marked today as complete.",
      })
      return
    }

    const newStreak = streakData.lastActivityDate === yesterday ? streakData.currentStreak + 1 : 1

    const newWeeklyProgress = Math.min(streakData.weeklyProgress + 1, streakData.weeklyGoal)

    // Check for new badges
    const milestone = streakMilestones.find((m) => m.days === newStreak)
    if (milestone && !streakData.badges.some((b) => b.name === milestone.name)) {
      const badge = {
        id: Date.now().toString(),
        name: milestone.name,
        description: `Achieved a ${milestone.days}-day streak!`,
        icon: milestone.icon,
        unlockedAt: today,
        rarity: milestone.rarity,
      }

      setNewBadge(badge)
      setShowBadgeAnimation(true)

      setTimeout(() => {
        setShowBadgeAnimation(false)
        setNewBadge(null)
      }, 3000)

      setStreakData((prev) => ({
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        totalDays: prev.totalDays + 1,
        lastActivityDate: today,
        weeklyProgress: newWeeklyProgress,
        badges: [...prev.badges, badge],
      }))

      toast({
        title: "New badge unlocked! 🎉",
        description: `You earned the "${milestone.name}" badge!`,
      })
    } else {
      setStreakData((prev) => ({
        ...prev,
        currentStreak: newStreak,
        longestStreak: Math.max(prev.longestStreak, newStreak),
        totalDays: prev.totalDays + 1,
        lastActivityDate: today,
        weeklyProgress: newWeeklyProgress,
      }))

      toast({
        title: "Great job! 🔥",
        description: `Day ${newStreak} of your streak!`,
      })
    }
  }

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
      case "rare":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "epic":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      case "legendary":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300"
    }
  }

  const isToday = streakData.lastActivityDate === new Date().toISOString().split("T")[0]

  return (
    <>
      <Card className="gradient-border">
        <div className="gradient-border-content">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <motion.div className="flame-animation" whileHover={{ scale: 1.1 }}>
                  <Flame className="w-5 h-5 text-orange-500" />
                </motion.div>
                <CardTitle className="gradient-text">Streak Tracker</CardTitle>
              </div>
              <Badge className="gradient-bg-soft text-white">{streakData.currentStreak} days</Badge>
            </div>
            <CardDescription>Keep your learning momentum going!</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Current Streak Display */}
            <div className="text-center">
              <motion.div
                className="text-6xl font-bold gradient-text mb-2"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {streakData.currentStreak}
              </motion.div>
              <p className="text-muted-foreground">Current Streak</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Trophy className="w-5 h-5 text-yellow-500" />
                </div>
                <div className="text-2xl font-bold">{streakData.longestStreak}</div>
                <div className="text-xs text-muted-foreground">Longest</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>
                <div className="text-2xl font-bold">{streakData.totalDays}</div>
                <div className="text-xs text-muted-foreground">Total Days</div>
              </div>
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Star className="w-5 h-5 text-purple-500" />
                </div>
                <div className="text-2xl font-bold">{streakData.badges.length}</div>
                <div className="text-xs text-muted-foreground">Badges</div>
              </div>
            </div>

            {/* Weekly Progress */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Weekly Goal</span>
                <span className="text-sm text-muted-foreground">
                  {streakData.weeklyProgress}/{streakData.weeklyGoal} days
                </span>
              </div>
              <div className="relative">
                <Progress value={(streakData.weeklyProgress / streakData.weeklyGoal) * 100} className="h-3" />
                <div
                  className="absolute top-0 left-0 h-3 rounded-full gradient-bg transition-all duration-1000 ease-out"
                  style={{ width: `${(streakData.weeklyProgress / streakData.weeklyGoal) * 100}%` }}
                />
              </div>
            </div>

            {/* Action Button */}
            <Button
              onClick={markTodayComplete}
              disabled={isToday}
              className={`w-full ${isToday ? "bg-green-500 hover:bg-green-500" : "gradient-bg"}`}
            >
              {isToday ? (
                <>
                  <Zap className="w-4 h-4 mr-2" />
                  Completed Today!
                </>
              ) : (
                <>
                  <Target className="w-4 h-4 mr-2" />
                  Mark Today Complete
                </>
              )}
            </Button>

            {/* Recent Badges */}
            {streakData.badges.length > 0 && (
              <div>
                <h4 className="text-sm font-medium mb-3 gradient-text">Recent Badges</h4>
                <div className="grid grid-cols-3 gap-2">
                  {streakData.badges.slice(-3).map((badge) => (
                    <motion.div
                      key={badge.id}
                      whileHover={{ scale: 1.05 }}
                      className="text-center p-2 rounded-lg bg-muted/50"
                    >
                      <div className="text-2xl mb-1">{badge.icon}</div>
                      <div className="text-xs font-medium">{badge.name}</div>
                      <Badge className={`text-xs mt-1 ${getRarityColor(badge.rarity)}`}>{badge.rarity}</Badge>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Next Milestone */}
            {(() => {
              const nextMilestone = streakMilestones.find((m) => m.days > streakData.currentStreak)
              if (nextMilestone) {
                const daysToGo = nextMilestone.days - streakData.currentStreak
                return (
                  <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 rounded-lg">
                    <div className="text-lg mb-1">{nextMilestone.icon}</div>
                    <div className="text-sm font-medium">{nextMilestone.name}</div>
                    <div className="text-xs text-muted-foreground">{daysToGo} days to go</div>
                    <Progress
                      value={((nextMilestone.days - daysToGo) / nextMilestone.days) * 100}
                      className="h-2 mt-2"
                    />
                  </div>
                )
              }
              return null
            })()}
          </CardContent>
        </div>
      </Card>

      {/* Badge Unlock Animation */}
      <AnimatePresence>
        {showBadgeAnimation && newBadge && (
          <motion.div
            initial={{ opacity: 0, scale: 0, y: 50 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0, y: -50 }}
            className="fixed inset-0 flex items-center justify-center z-50 bg-black/50"
          >
            <motion.div
              className="bg-white dark:bg-gray-800 rounded-lg p-8 text-center max-w-sm mx-4 gradient-border"
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 0.5, repeat: 2 }}
            >
              <div className="gradient-border-content p-6">
                <motion.div
                  className="text-6xl mb-4"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.6, repeat: 3 }}
                >
                  {newBadge.icon}
                </motion.div>
                <h3 className="text-xl font-bold mb-2 gradient-text">Badge Unlocked!</h3>
                <h4 className="text-lg font-semibold mb-2">{newBadge.name}</h4>
                <p className="text-muted-foreground mb-4">{newBadge.description}</p>
                <Badge className={`${getRarityColor(newBadge.rarity)} badge-unlock`}>
                  {newBadge.rarity.toUpperCase()}
                </Badge>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
