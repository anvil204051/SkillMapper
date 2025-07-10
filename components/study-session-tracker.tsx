"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, Square, Clock, Target, BookOpen, Coffee, Brain, Zap } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface StudySession {
  id: string
  skill: string
  duration: number
  startTime: Date
  endTime?: Date
  status: "active" | "paused" | "completed"
  notes: string
  focusScore: number
}

interface StudyGoal {
  daily: number
  weekly: number
  current: {
    daily: number
    weekly: number
  }
}

const mockSessions: StudySession[] = [
  {
    id: "1",
    skill: "Pattern Making",
    duration: 45,
    startTime: new Date(Date.now() - 2 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 1.25 * 60 * 60 * 1000),
    status: "completed",
    notes: "Practiced basic pattern drafting techniques",
    focusScore: 85,
  },
  {
    id: "2",
    skill: "Color Theory",
    duration: 30,
    startTime: new Date(Date.now() - 4 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 3.5 * 60 * 60 * 1000),
    status: "completed",
    notes: "Studied complementary color schemes",
    focusScore: 92,
  },
]

export function StudySessionTracker() {
  const [currentSession, setCurrentSession] = useState<StudySession | null>(null)
  const [sessions, setSessions] = useState<StudySession[]>(mockSessions)
  const [selectedSkill, setSelectedSkill] = useState("")
  const [sessionNotes, setSessionNotes] = useState("")
  const [timer, setTimer] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [studyGoals, setStudyGoals] = useState<StudyGoal>({
    daily: 120, // 2 hours
    weekly: 600, // 10 hours
    current: {
      daily: 75,
      weekly: 320,
    },
  })
  const { toast } = useToast()

  const skills = [
    "Fashion Design Fundamentals",
    "Sketching & Illustration",
    "Pattern Making",
    "Fabric Knowledge",
    "Color Theory",
    "Fashion Business",
  ]

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning && currentSession) {
      interval = setInterval(() => {
        setTimer((prev) => prev + 1)
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, currentSession])

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60

    if (hours > 0) {
      return `${hours}:${minutes.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
    }
    return `${minutes}:${secs.toString().padStart(2, "0")}`
  }

  const startSession = () => {
    if (!selectedSkill) {
      toast({
        title: "Please select a skill",
        description: "Choose what you want to study first.",
        variant: "destructive",
      })
      return
    }

    const newSession: StudySession = {
      id: Date.now().toString(),
      skill: selectedSkill,
      duration: 0,
      startTime: new Date(),
      status: "active",
      notes: "",
      focusScore: 0,
    }

    setCurrentSession(newSession)
    setTimer(0)
    setIsRunning(true)

    toast({
      title: "Study session started! 📚",
      description: `Good luck with ${selectedSkill}!`,
    })
  }

  const pauseSession = () => {
    setIsRunning(false)
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: "paused",
      })
    }
  }

  const resumeSession = () => {
    setIsRunning(true)
    if (currentSession) {
      setCurrentSession({
        ...currentSession,
        status: "active",
      })
    }
  }

  const endSession = () => {
    if (!currentSession) return

    const completedSession: StudySession = {
      ...currentSession,
      duration: timer,
      endTime: new Date(),
      status: "completed",
      notes: sessionNotes,
      focusScore: Math.floor(Math.random() * 30) + 70, // Mock focus score
    }

    setSessions((prev) => [completedSession, ...prev])
    setCurrentSession(null)
    setTimer(0)
    setIsRunning(false)
    setSessionNotes("")

    // Update study goals
    setStudyGoals((prev) => ({
      ...prev,
      current: {
        daily: prev.current.daily + Math.floor(timer / 60),
        weekly: prev.current.weekly + Math.floor(timer / 60),
      },
    }))

    toast({
      title: "Session completed! 🎉",
      description: `Great job! You studied for ${formatTime(timer)}.`,
    })
  }

  const getTodaysSessions = () => {
    const today = new Date().toDateString()
    return sessions.filter((session) => session.endTime && session.endTime.toDateString() === today)
  }

  const getTotalStudyTime = (sessionList: StudySession[]) => {
    return sessionList.reduce((total, session) => total + session.duration, 0)
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Study Session Tracker</h2>
          <p className="text-muted-foreground">Track your focused learning time</p>
        </div>
        <Badge className="gradient-bg text-white">
          <Clock className="w-4 h-4 mr-1" />
          {Math.floor(studyGoals.current.daily / 60)}h {studyGoals.current.daily % 60}m today
        </Badge>
      </div>

      {/* Study Goals Progress */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="gradient-border">
          <div className="gradient-border-content">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Target className="w-5 h-5 text-blue-500" />
                <span>Daily Goal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {Math.floor(studyGoals.current.daily / 60)}h {studyGoals.current.daily % 60}m
                  </span>
                  <span>
                    {Math.floor(studyGoals.daily / 60)}h {studyGoals.daily % 60}m
                  </span>
                </div>
                <Progress value={(studyGoals.current.daily / studyGoals.daily) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {Math.max(0, studyGoals.daily - studyGoals.current.daily)} minutes remaining
                </p>
              </div>
            </CardContent>
          </div>
        </Card>

        <Card className="gradient-border">
          <div className="gradient-border-content">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center space-x-2">
                <Zap className="w-5 h-5 text-purple-500" />
                <span>Weekly Goal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>
                    {Math.floor(studyGoals.current.weekly / 60)}h {studyGoals.current.weekly % 60}m
                  </span>
                  <span>
                    {Math.floor(studyGoals.weekly / 60)}h {studyGoals.weekly % 60}m
                  </span>
                </div>
                <Progress value={(studyGoals.current.weekly / studyGoals.weekly) * 100} className="h-3" />
                <p className="text-xs text-muted-foreground">
                  {Math.max(0, studyGoals.weekly - studyGoals.current.weekly)} minutes remaining
                </p>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>

      {/* Active Session or Start New Session */}
      <Card className="gradient-border">
        <div className="gradient-border-content">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="w-5 h-5 text-green-500" />
              <span>{currentSession ? "Active Session" : "Start New Session"}</span>
            </CardTitle>
            {currentSession && <CardDescription>Studying: {currentSession.skill}</CardDescription>}
          </CardHeader>
          <CardContent className="space-y-4">
            {currentSession ? (
              <div className="space-y-4">
                {/* Timer Display */}
                <div className="text-center">
                  <div className="text-4xl font-bold gradient-text mb-2">{formatTime(timer)}</div>
                  <Badge
                    className={`${currentSession.status === "active" ? "bg-green-500" : "bg-yellow-500"} text-white`}
                  >
                    {currentSession.status === "active" ? "Active" : "Paused"}
                  </Badge>
                </div>

                {/* Session Controls */}
                <div className="flex justify-center space-x-3">
                  {currentSession.status === "active" ? (
                    <Button onClick={pauseSession} variant="outline">
                      <Pause className="w-4 h-4 mr-2" />
                      Pause
                    </Button>
                  ) : (
                    <Button onClick={resumeSession} className="gradient-bg">
                      <Play className="w-4 h-4 mr-2" />
                      Resume
                    </Button>
                  )}
                  <Button onClick={endSession} variant="outline">
                    <Square className="w-4 h-4 mr-2" />
                    End Session
                  </Button>
                </div>

                {/* Session Notes */}
                <div className="space-y-2">
                  <Label htmlFor="notes">Session Notes (optional)</Label>
                  <Input
                    id="notes"
                    placeholder="What did you learn or work on?"
                    value={sessionNotes}
                    onChange={(e) => setSessionNotes(e.target.value)}
                  />
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="skill">What would you like to study?</Label>
                  <Select value={selectedSkill} onValueChange={setSelectedSkill}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a skill to study" />
                    </SelectTrigger>
                    <SelectContent>
                      {skills.map((skill) => (
                        <SelectItem key={skill} value={skill}>
                          {skill}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={startSession} className="w-full gradient-bg">
                  <Play className="w-4 h-4 mr-2" />
                  Start Study Session
                </Button>
              </div>
            )}
          </CardContent>
        </div>
      </Card>

      {/* Recent Sessions */}
      <Card className="gradient-border">
        <div className="gradient-border-content">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="w-5 h-5 text-blue-500" />
              <span>Recent Sessions</span>
            </CardTitle>
            <CardDescription>
              Today: {getTodaysSessions().length} sessions, {formatTime(getTotalStudyTime(getTodaysSessions()))} total
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <AnimatePresence>
                {sessions.slice(0, 5).map((session, index) => (
                  <motion.div
                    key={session.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                  >
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-medium">{session.skill}</h4>
                        <Badge variant="outline" className="text-xs">
                          {formatTime(session.duration)}
                        </Badge>
                        {session.focusScore >= 80 && (
                          <Badge className="bg-green-500 text-white text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            High Focus
                          </Badge>
                        )}
                      </div>
                      {session.notes && <p className="text-sm text-muted-foreground">{session.notes}</p>}
                      <p className="text-xs text-muted-foreground">
                        {session.endTime?.toLocaleTimeString()} • Focus: {session.focusScore}%
                      </p>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>

              {sessions.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  <Coffee className="w-12 h-12 mx-auto mb-3 opacity-50" />
                  <p>No study sessions yet. Start your first session above!</p>
                </div>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
