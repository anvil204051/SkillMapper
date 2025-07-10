"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Sidebar } from "@/components/sidebar"
import { CircularProgress } from "@/components/circular-progress"
import { DragDropRoadmap } from "@/components/drag-drop-roadmap"
import { ResourceManager } from "@/components/resource-manager"
import { AISuggestions } from "@/components/ai-suggestions"
import { StreakTracker } from "@/components/streak-tracker"
import { PDFExport } from "@/components/pdf-export"
import { ProgressAnalytics } from "@/components/progress-analytics"
import { LearningPathDiagram } from "@/components/learning-path-diagram"
import { StudySessionTracker } from "@/components/study-session-tracker"
import { SkillAssessment } from "@/components/skill-assessment"
import { BreadcrumbNavigation } from "@/components/breadcrumb-navigation"
import { HelpIcon } from "@/components/help-tooltips"
import { Target, Clock, CheckCircle, BookOpen, Plus, Sparkles, BarChart3, Brain, Timer } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Skill {
  id: string
  title: string
  description: string
  progress: number
  status: "not-started" | "in-progress" | "completed"
  estimatedTime: string
  resources: Array<{
    id: string
    title: string
    type: "article" | "video" | "course" | "book"
    url: string
  }>
}

const mockSkills: Skill[] = [
  {
    id: "1",
    title: "Python Fundamentals",
    description: "Learn the basics of Python programming including syntax, data types, and control structures.",
    progress: 85,
    status: "in-progress",
    estimatedTime: "2 weeks",
    resources: [
      { id: "1", title: "Python.org Tutorial", type: "article", url: "#" },
      { id: "2", title: "Python Crash Course", type: "video", url: "#" },
      { id: "3", title: "Automate the Boring Stuff", type: "book", url: "#" },
    ],
  },
  {
    id: "2",
    title: "Data Analysis with Pandas",
    description: "Master data manipulation and analysis using the Pandas library.",
    progress: 45,
    status: "in-progress",
    estimatedTime: "3 weeks",
    resources: [
      { id: "4", title: "Pandas Documentation", type: "article", url: "#" },
      { id: "5", title: "Data Analysis Course", type: "course", url: "#" },
    ],
  },
  {
    id: "3",
    title: "Machine Learning Basics",
    description: "Introduction to machine learning concepts and algorithms.",
    progress: 0,
    status: "not-started",
    estimatedTime: "4 weeks",
    resources: [
      { id: "6", title: "ML Course by Andrew Ng", type: "course", url: "#" },
      { id: "7", title: "Hands-On ML Book", type: "book", url: "#" },
    ],
  },
]

export default function Dashboard() {
  const [user, setUser] = useState<any>(null)
  const [goal, setGoal] = useState("")
  const [currentLevel, setCurrentLevel] = useState("")
  const [timeCommitment, setTimeCommitment] = useState("")
  const [skills, setSkills] = useState<Skill[]>(mockSkills)
  const [showGoalForm, setShowGoalForm] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [activeTab, setActiveTab] = useState<
    "roadmap" | "analytics" | "study" | "assessment" | "resources" | "suggestions"
  >("roadmap")
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth")
      return
    }
    setUser(JSON.parse(userData))

    // Check if user has a goal set
    const savedGoal = localStorage.getItem("userGoal")
    if (savedGoal) {
      setGoal(JSON.parse(savedGoal).goal)
    } else {
      setShowGoalForm(true)
    }
  }, [router])

  const handleGoalSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const goalData = { goal, currentLevel, timeCommitment }
    localStorage.setItem("userGoal", JSON.stringify(goalData))
    setShowGoalForm(false)
    toast({
      title: "Goal set successfully! 🎯",
      description: "Your personalized roadmap is being generated.",
    })
  }

  const handleStepsReorder = (reorderedSteps: Skill[]) => {
    setSkills(reorderedSteps)
    toast({
      title: "Roadmap updated!",
      description: "Your learning path has been reordered.",
    })
  }

  const handleEditStep = (stepId: string) => {
    // Implementation for editing steps
    console.log("Edit step:", stepId)
  }

  const handleDeleteStep = (stepId: string) => {
    setSkills((prev) => prev.filter((skill) => skill.id !== stepId))
    toast({
      title: "Step removed",
      description: "The step has been deleted from your roadmap.",
    })
  }

  const addNewStep = () => {
    const newStep: Skill = {
      id: Date.now().toString(),
      title: "New Learning Step",
      description: "Add description for this step",
      progress: 0,
      status: "not-started",
      estimatedTime: "1 week",
      resources: [],
    }
    setSkills((prev) => [...prev, newStep])
  }

  const overallProgress = Math.round(skills.reduce((acc, skill) => acc + skill.progress, 0) / skills.length)
  const completedSteps = skills.filter((s) => s.status === "completed").length
  const inProgressSteps = skills.filter((s) => s.status === "in-progress").length

  if (!user) return null

  return (
    <div className="flex h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          <BreadcrumbNavigation />

          {/* Welcome Section */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold gradient-text mb-2 flex items-center">
                  Welcome back, {user.name}! 👋
                  <HelpIcon
                    content="This is your learning dashboard where you can track progress, study, and access all your learning tools."
                    title="Dashboard Overview"
                    position="right"
                  />
                </h1>
                <p className="text-muted-foreground">
                  {goal ? `Continue your journey to: ${goal}` : "Ready to start your learning journey?"}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <StreakTracker />
                {!showGoalForm && (
                  <PDFExport
                    pathData={{
                      title: goal || "My Learning Path",
                      description: "Personalized learning roadmap generated by SkillMapper",
                      steps: skills.map((skill) => ({
                        title: skill.title,
                        description: skill.description,
                        progress: skill.progress,
                        estimatedTime: skill.estimatedTime,
                        resources: skill.resources,
                      })),
                    }}
                  />
                )}
              </div>
            </div>
          </motion.div>

          {/* Goal Setting Form */}
          {showGoalForm && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
              <Card className="gradient-border">
                <div className="gradient-border-content">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 gradient-text">
                      <Target className="w-5 h-5" />
                      Set Your Learning Goal
                      <HelpIcon
                        content="Setting a clear goal helps us create a personalized learning roadmap tailored to your career aspirations."
                        title="Why set a goal?"
                      />
                    </CardTitle>
                    <CardDescription>
                      Tell us what you want to achieve and we'll create a personalized roadmap for you.
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <form onSubmit={handleGoalSubmit} className="space-y-4">
                      <div>
                        <Label htmlFor="goal">What do you want to become or learn?</Label>
                        <Input
                          id="goal"
                          placeholder="e.g., Data Scientist, Full Stack Developer, UX Designer"
                          value={goal}
                          onChange={(e) => setGoal(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="level">What's your current level?</Label>
                        <Input
                          id="level"
                          placeholder="e.g., Complete beginner, Some experience, Intermediate"
                          value={currentLevel}
                          onChange={(e) => setCurrentLevel(e.target.value)}
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="time">How much time can you commit per week?</Label>
                        <Input
                          id="time"
                          placeholder="e.g., 5-10 hours, 10-20 hours, 20+ hours"
                          value={timeCommitment}
                          onChange={(e) => setTimeCommitment(e.target.value)}
                          required
                        />
                      </div>
                      <Button type="submit" className="w-full gradient-bg">
                        <Sparkles className="w-4 h-4 mr-2" />
                        Generate My Roadmap
                      </Button>
                    </form>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Progress Overview */}
          {!showGoalForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="grid lg:grid-cols-4 gap-6 mb-8"
            >
              <Card className="gradient-border">
                <div className="gradient-border-content">
                  <CardContent className="p-6 text-center">
                    <CircularProgress progress={overallProgress} size={80} className="mx-auto mb-4" />
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                  </CardContent>
                </div>
              </Card>

              <Card className="gradient-border">
                <div className="gradient-border-content">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Skills Completed</p>
                        <p className="text-2xl font-bold gradient-text">
                          {completedSteps}/{skills.length}
                        </p>
                      </div>
                      <CheckCircle className="w-8 h-8 text-green-500" />
                    </div>
                  </CardContent>
                </div>
              </Card>

              <Card className="gradient-border">
                <div className="gradient-border-content">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">In Progress</p>
                        <p className="text-2xl font-bold gradient-text">{inProgressSteps}</p>
                      </div>
                      <Clock className="w-8 h-8 text-blue-500" />
                    </div>
                  </CardContent>
                </div>
              </Card>

              <Card className="gradient-border">
                <div className="gradient-border-content">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-muted-foreground">Resources Saved</p>
                        <p className="text-2xl font-bold gradient-text">24</p>
                      </div>
                      <BookOpen className="w-8 h-8 text-purple-500" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          )}

          {/* Enhanced Tab Navigation */}
          {!showGoalForm && (
            <div className="grid lg:grid-cols-4 gap-6">
              {/* Main Content */}
              <div className="lg:col-span-3">
                <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)} className="space-y-6">
                  <TabsList className="grid w-full grid-cols-6">
                    <TabsTrigger value="roadmap" className="flex items-center gap-1">
                      <Target className="w-4 h-4" />
                      <span className="hidden sm:inline">Roadmap</span>
                    </TabsTrigger>
                    <TabsTrigger value="analytics" className="flex items-center gap-1">
                      <BarChart3 className="w-4 h-4" />
                      <span className="hidden sm:inline">Analytics</span>
                    </TabsTrigger>
                    <TabsTrigger value="study" className="flex items-center gap-1">
                      <Timer className="w-4 h-4" />
                      <span className="hidden sm:inline">Study</span>
                    </TabsTrigger>
                    <TabsTrigger value="assessment" className="flex items-center gap-1">
                      <Brain className="w-4 h-4" />
                      <span className="hidden sm:inline">Test</span>
                    </TabsTrigger>
                    <TabsTrigger value="resources" className="flex items-center gap-1">
                      <BookOpen className="w-4 h-4" />
                      <span className="hidden sm:inline">Resources</span>
                    </TabsTrigger>
                    <TabsTrigger value="suggestions" className="flex items-center gap-1">
                      <Sparkles className="w-4 h-4" />
                      <span className="hidden sm:inline">AI</span>
                    </TabsTrigger>
                  </TabsList>

                  {/* Tab Content */}
                  <motion.div
                    key={activeTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                  >
                    <TabsContent value="roadmap" className="space-y-6">
                      <div className="flex items-center justify-between">
                        <h2 className="text-2xl font-bold gradient-text flex items-center gap-2">
                          Your Learning Path
                          <HelpIcon
                            content="This is your personalized learning roadmap. You can reorder steps, edit content, and track your progress."
                            title="Learning Path"
                          />
                        </h2>
                        <div className="flex gap-2">
                          <Button
                            onClick={() => setIsEditing(!isEditing)}
                            variant="outline"
                            className="gradient-border"
                          >
                            <div className="gradient-border-content px-3 py-2">
                              {isEditing ? "Done Editing" : "Edit Path"}
                            </div>
                          </Button>
                          {isEditing && (
                            <Button onClick={addNewStep} className="gradient-bg">
                              <Plus className="w-4 h-4 mr-2" />
                              Add Step
                            </Button>
                          )}
                        </div>
                      </div>

                      <LearningPathDiagram />

                      <DragDropRoadmap
                        steps={skills}
                        onStepsReorder={handleStepsReorder}
                        onEditStep={handleEditStep}
                        onDeleteStep={handleDeleteStep}
                        isEditing={isEditing}
                      />
                    </TabsContent>

                    <TabsContent value="analytics">
                      <ProgressAnalytics />
                    </TabsContent>

                    <TabsContent value="study">
                      <StudySessionTracker />
                    </TabsContent>

                    <TabsContent value="assessment">
                      <SkillAssessment />
                    </TabsContent>

                    <TabsContent value="resources">
                      <ResourceManager />
                    </TabsContent>

                    <TabsContent value="suggestions">
                      {/* Remove the Smart Suggestions box from the AI tab: */}
                      {/* <AISuggestions career={goal || "Data Scientist"} difficulty={currentLevel || "beginner"} /> */}
                    </TabsContent>
                  </motion.div>
                </Tabs>
              </div>

              {/* AI Suggestions Sidebar - Only show on roadmap tab */}
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
