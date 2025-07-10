"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  ExternalLink,
  Play,
  FileText,
  Star,
  Award,
  Target,
  Lightbulb,
} from "lucide-react"

interface Resource {
  id: string
  title: string
  type: "video" | "article" | "course" | "book" | "tool" | "practice"
  url: string
  provider: string
  duration?: string
  rating: number
  description: string
  free: boolean
}

interface Step {
  id: string
  title: string
  description: string
  detailedDescription: string
  estimatedTime: string
  difficulty: "easy" | "medium" | "hard"
  status: "not-started" | "in-progress" | "completed"
  progress: number
  resources: Resource[]
  skills: string[]
  prerequisites: string[]
  tips: string[]
}

interface Phase {
  id: string
  name: string
  description: string
  steps: Step[]
  color: string
}

const generatePersonalizedRoadmap = (
  careerGoal: string,
  difficulty: "beginner" | "intermediate" | "advanced",
): Phase[] => {
  // This would be replaced with actual AI generation based on career goal and difficulty
  const roadmaps: Record<string, Record<string, Phase[]>> = {
    "Data Scientist": {
      beginner: [
        {
          id: "foundation",
          name: "Foundation Phase",
          description: "Build your mathematical and programming foundation",
          color: "bg-green-100 text-green-800",
          steps: [
            {
              id: "1",
              title: "Python Programming Fundamentals",
              description: "Master Python basics including syntax, data structures, and control flow",
              detailedDescription:
                "Start your data science journey by learning Python, the most popular programming language in data science. You'll learn variables, data types, loops, functions, and object-oriented programming concepts. This foundation is crucial for all future data science work.",
              estimatedTime: "3-4 weeks",
              difficulty: "easy",
              status: "not-started",
              progress: 0,
              skills: ["Python Syntax", "Data Structures", "Functions", "OOP Basics"],
              prerequisites: [],
              tips: [
                "Practice coding daily, even if just for 30 minutes",
                "Use interactive platforms like Codecademy or DataCamp",
                "Build small projects to reinforce learning",
              ],
              resources: [
                {
                  id: "1",
                  title: "Python for Everybody Specialization",
                  type: "course",
                  url: "https://www.coursera.org/specializations/python",
                  provider: "Coursera (University of Michigan)",
                  duration: "8 months",
                  rating: 4.8,
                  description: "Comprehensive Python course designed for beginners",
                  free: true,
                },
                {
                  id: "2",
                  title: "Automate the Boring Stuff with Python",
                  type: "book",
                  url: "https://automatetheboringstuff.com/",
                  provider: "Al Sweigart",
                  rating: 4.7,
                  description: "Practical Python programming for total beginners",
                  free: true,
                },
                {
                  id: "3",
                  title: "Python Tutorial for Beginners",
                  type: "video",
                  url: "https://www.youtube.com/watch?v=_uQrJ0TkZlc",
                  provider: "Programming with Mosh",
                  duration: "6 hours",
                  rating: 4.9,
                  description: "Complete Python tutorial covering all basics",
                  free: true,
                },
                {
                  id: "4",
                  title: "HackerRank Python Domain",
                  type: "practice",
                  url: "https://www.hackerrank.com/domains/python",
                  provider: "HackerRank",
                  rating: 4.5,
                  description: "Practice Python problems from basic to advanced",
                  free: true,
                },
              ],
            },
            {
              id: "2",
              title: "Statistics and Mathematics Fundamentals",
              description: "Learn essential statistics and math concepts for data science",
              detailedDescription:
                "Data science is built on statistical foundations. You'll learn descriptive statistics, probability distributions, hypothesis testing, and linear algebra basics. These concepts are essential for understanding machine learning algorithms and data analysis techniques.",
              estimatedTime: "4-5 weeks",
              difficulty: "medium",
              status: "not-started",
              progress: 0,
              skills: ["Descriptive Statistics", "Probability", "Hypothesis Testing", "Linear Algebra"],
              prerequisites: ["1"],
              tips: [
                "Use real datasets to practice statistical concepts",
                "Focus on understanding concepts rather than memorizing formulas",
                "Use visualization tools to understand distributions",
              ],
              resources: [
                {
                  id: "5",
                  title: "Khan Academy Statistics and Probability",
                  type: "course",
                  url: "https://www.khanacademy.org/math/statistics-probability",
                  provider: "Khan Academy",
                  rating: 4.6,
                  description: "Free comprehensive statistics course",
                  free: true,
                },
                {
                  id: "6",
                  title: "Think Stats",
                  type: "book",
                  url: "https://greenteapress.com/thinkstats2/",
                  provider: "Allen B. Downey",
                  rating: 4.4,
                  description: "Statistics for programmers with Python examples",
                  free: true,
                },
                {
                  id: "7",
                  title: "StatQuest with Josh Starmer",
                  type: "video",
                  url: "https://www.youtube.com/c/joshstarmer",
                  provider: "YouTube",
                  rating: 4.9,
                  description: "Clear explanations of statistical concepts",
                  free: true,
                },
              ],
            },
          ],
        },
        {
          id: "tools",
          name: "Tools & Libraries Phase",
          description: "Master essential data science tools and libraries",
          color: "bg-blue-100 text-blue-800",
          steps: [
            {
              id: "3",
              title: "Data Manipulation with Pandas",
              description: "Learn to clean, transform, and analyze data using Pandas",
              detailedDescription:
                "Pandas is the most important library for data manipulation in Python. You'll learn to load data from various sources, clean messy data, handle missing values, group and aggregate data, and perform complex data transformations. This is where you'll spend most of your time as a data scientist.",
              estimatedTime: "3-4 weeks",
              difficulty: "medium",
              status: "not-started",
              progress: 0,
              skills: ["Data Loading", "Data Cleaning", "Data Transformation", "Grouping & Aggregation"],
              prerequisites: ["1"],
              tips: [
                "Work with real, messy datasets to practice cleaning techniques",
                "Learn keyboard shortcuts for Jupyter notebooks",
                "Practice different ways to solve the same problem",
              ],
              resources: [
                {
                  id: "8",
                  title: "Pandas Documentation",
                  type: "article",
                  url: "https://pandas.pydata.org/docs/",
                  provider: "Pandas Team",
                  rating: 4.5,
                  description: "Official comprehensive documentation",
                  free: true,
                },
                {
                  id: "9",
                  title: "Python for Data Analysis",
                  type: "book",
                  url: "https://wesmckinney.com/book/",
                  provider: "Wes McKinney",
                  rating: 4.7,
                  description: "Definitive guide to Pandas by its creator",
                  free: false,
                },
                {
                  id: "10",
                  title: "Pandas Tutorial Series",
                  type: "video",
                  url: "https://www.youtube.com/playlist?list=PL-osiE80TeTsWmV9i9c58mdDCSskIFdDS",
                  provider: "Corey Schafer",
                  duration: "10+ hours",
                  rating: 4.8,
                  description: "Comprehensive Pandas tutorial series",
                  free: true,
                },
              ],
            },
          ],
        },
      ],
      intermediate: [
        {
          id: "advanced-analysis",
          name: "Advanced Analysis Phase",
          description: "Deep dive into statistical analysis and machine learning",
          color: "bg-purple-100 text-purple-800",
          steps: [
            {
              id: "1",
              title: "Advanced Statistical Analysis",
              description: "Master advanced statistical techniques and experimental design",
              detailedDescription:
                "Build on your statistical foundation with advanced techniques like ANOVA, regression analysis, time series analysis, and experimental design. You'll learn to design experiments, interpret complex statistical results, and make data-driven decisions with confidence.",
              estimatedTime: "4-6 weeks",
              difficulty: "hard",
              status: "not-started",
              progress: 0,
              skills: ["ANOVA", "Regression Analysis", "Time Series", "Experimental Design"],
              prerequisites: [],
              tips: [
                "Focus on understanding when to use each statistical test",
                "Practice interpreting results in business context",
                "Use statistical software like R or Python for analysis",
              ],
              resources: [
                {
                  id: "11",
                  title: "Statistical Learning with R",
                  type: "course",
                  url: "https://www.edx.org/course/statistical-learning",
                  provider: "Stanford University",
                  duration: "10 weeks",
                  rating: 4.8,
                  description: "Advanced statistical learning concepts",
                  free: true,
                },
                {
                  id: "12",
                  title: "The Elements of Statistical Learning",
                  type: "book",
                  url: "https://web.stanford.edu/~hastie/ElemStatLearn/",
                  provider: "Hastie, Tibshirani, Friedman",
                  rating: 4.9,
                  description: "Comprehensive reference for statistical learning",
                  free: true,
                },
              ],
            },
          ],
        },
      ],
      advanced: [
        {
          id: "specialization",
          name: "Specialization Phase",
          description: "Choose your specialization and master advanced techniques",
          color: "bg-red-100 text-red-800",
          steps: [
            {
              id: "1",
              title: "Deep Learning and Neural Networks",
              description: "Master deep learning architectures and frameworks",
              detailedDescription:
                "Dive deep into neural networks, convolutional neural networks, recurrent neural networks, and transformer architectures. You'll learn to build and deploy deep learning models using TensorFlow and PyTorch, and understand the mathematical foundations behind these powerful algorithms.",
              estimatedTime: "8-10 weeks",
              difficulty: "hard",
              status: "not-started",
              progress: 0,
              skills: ["Neural Networks", "CNNs", "RNNs", "Transformers", "TensorFlow", "PyTorch"],
              prerequisites: [],
              tips: [
                "Start with simple neural networks before moving to complex architectures",
                "Use GPU acceleration for training large models",
                "Stay updated with latest research papers and implementations",
              ],
              resources: [
                {
                  id: "13",
                  title: "Deep Learning Specialization",
                  type: "course",
                  url: "https://www.coursera.org/specializations/deep-learning",
                  provider: "deeplearning.ai",
                  duration: "4 months",
                  rating: 4.9,
                  description: "Comprehensive deep learning course by Andrew Ng",
                  free: false,
                },
                {
                  id: "14",
                  title: "Deep Learning",
                  type: "book",
                  url: "https://www.deeplearningbook.org/",
                  provider: "Ian Goodfellow",
                  rating: 4.8,
                  description: "Mathematical foundations of deep learning",
                  free: true,
                },
              ],
            },
          ],
        },
      ],
    },
    // Add more career paths here...
  }

  return (
    roadmaps[careerGoal]?.[difficulty] ||
    roadmaps["Data Scientist"][difficulty] || // Default fallback
    []
  )
}

interface PersonalizedRoadmapProps {
  careerGoal: string
  difficulty: "beginner" | "intermediate" | "advanced"
  userId: string
}

export function PersonalizedRoadmap({ careerGoal, difficulty, userId }: PersonalizedRoadmapProps) {
  const [roadmap, setRoadmap] = useState<Phase[]>([])
  const [selectedStep, setSelectedStep] = useState<Step | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    const generatedRoadmap = generatePersonalizedRoadmap(careerGoal, difficulty)
    setRoadmap(generatedRoadmap)

    // Load user progress from localStorage
    const savedProgress = localStorage.getItem(`roadmap_${userId}_${careerGoal}_${difficulty}`)
    if (savedProgress) {
      const progressData = JSON.parse(savedProgress)
      // Apply saved progress to roadmap
      setRoadmap(progressData)
    }
  }, [careerGoal, difficulty, userId])

  const updateStepProgress = (phaseId: string, stepId: string, progress: number, status: Step["status"]) => {
    const updatedRoadmap = roadmap.map((phase) =>
      phase.id === phaseId
        ? {
            ...phase,
            steps: phase.steps.map((step) => (step.id === stepId ? { ...step, progress, status } : step)),
          }
        : phase,
    )

    setRoadmap(updatedRoadmap)
    localStorage.setItem(`roadmap_${userId}_${careerGoal}_${difficulty}`, JSON.stringify(updatedRoadmap))
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />
      case "course":
        return <BookOpen className="w-4 h-4" />
      case "book":
        return <BookOpen className="w-4 h-4" />
      case "article":
        return <FileText className="w-4 h-4" />
      case "practice":
        return <Target className="w-4 h-4" />
      case "tool":
        return <Award className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "easy":
        return "bg-green-100 text-green-800"
      case "medium":
        return "bg-yellow-100 text-yellow-800"
      case "hard":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const totalSteps = roadmap.reduce((acc, phase) => acc + phase.steps.length, 0)
  const completedSteps = roadmap.reduce(
    (acc, phase) => acc + phase.steps.filter((step) => step.status === "completed").length,
    0,
  )
  const overallProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold gradient-text mb-2">Your Personalized {careerGoal} Roadmap</h2>
        <p className="text-muted-foreground mb-4">
          {difficulty.charAt(0).toUpperCase() + difficulty.slice(1)} Level • {totalSteps} Steps • Tailored for You
        </p>
        <div className="max-w-md mx-auto">
          <div className="flex justify-between text-sm mb-2">
            <span>Overall Progress</span>
            <span>{overallProgress}%</span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>
      </div>

      {/* Roadmap Phases */}
      <div className="space-y-8">
        {roadmap.map((phase, phaseIndex) => (
          <motion.div
            key={phase.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: phaseIndex * 0.2 }}
          >
            <Card className="gradient-border">
              <div className="gradient-border-content">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl gradient-text">{phase.name}</CardTitle>
                      <CardDescription>{phase.description}</CardDescription>
                    </div>
                    <Badge className={phase.color}>Phase {phaseIndex + 1}</Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-6">
                  {phase.steps.map((step, stepIndex) => (
                    <Card
                      key={step.id}
                      className={`cursor-pointer transition-all hover:shadow-md ${
                        selectedStep?.id === step.id ? "ring-2 ring-primary" : ""
                      }`}
                      onClick={() => setSelectedStep(selectedStep?.id === step.id ? null : step)}
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start space-x-4">
                          {/* Status Icon */}
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              const newStatus =
                                step.status === "completed"
                                  ? "not-started"
                                  : step.status === "not-started"
                                    ? "in-progress"
                                    : "completed"
                              const newProgress = newStatus === "completed" ? 100 : newStatus === "in-progress" ? 50 : 0
                              updateStepProgress(phase.id, step.id, newProgress, newStatus)
                            }}
                            className="mt-1"
                          >
                            {step.status === "completed" ? (
                              <CheckCircle className="w-6 h-6 text-green-500" />
                            ) : step.status === "in-progress" ? (
                              <Circle className="w-6 h-6 text-blue-500 fill-current" />
                            ) : (
                              <Circle className="w-6 h-6 text-gray-400" />
                            )}
                          </button>

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-semibold text-lg">{step.title}</h4>
                              <div className="flex items-center space-x-2">
                                <Badge className={getDifficultyColor(step.difficulty)}>{step.difficulty}</Badge>
                                <Badge variant="outline" className="flex items-center space-x-1">
                                  <Clock className="w-3 h-3" />
                                  <span>{step.estimatedTime}</span>
                                </Badge>
                              </div>
                            </div>

                            <p className="text-muted-foreground mb-3">{step.description}</p>

                            {/* Progress Bar */}
                            <div className="mb-3">
                              <div className="flex justify-between text-sm mb-1">
                                <span>Progress</span>
                                <span>{step.progress}%</span>
                              </div>
                              <Progress value={step.progress} className="h-2" />
                            </div>

                            {/* Skills */}
                            <div className="flex flex-wrap gap-1 mb-3">
                              {step.skills.slice(0, 4).map((skill, i) => (
                                <Badge key={i} variant="secondary" className="text-xs">
                                  {skill}
                                </Badge>
                              ))}
                              {step.skills.length > 4 && (
                                <Badge variant="secondary" className="text-xs">
                                  +{step.skills.length - 4} more
                                </Badge>
                              )}
                            </div>

                            {/* Expanded Details */}
                            {selectedStep?.id === step.id && (
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                className="border-t pt-4 mt-4"
                              >
                                <Tabs value={activeTab} onValueChange={setActiveTab}>
                                  <TabsList className="grid w-full grid-cols-3">
                                    <TabsTrigger value="overview">Overview</TabsTrigger>
                                    <TabsTrigger value="resources">Resources</TabsTrigger>
                                    <TabsTrigger value="tips">Tips</TabsTrigger>
                                  </TabsList>

                                  <TabsContent value="overview" className="space-y-4">
                                    <div>
                                      <h5 className="font-medium mb-2">Detailed Description</h5>
                                      <p className="text-sm text-muted-foreground leading-relaxed">
                                        {step.detailedDescription}
                                      </p>
                                    </div>

                                    <div>
                                      <h5 className="font-medium mb-2">Skills You'll Learn</h5>
                                      <div className="flex flex-wrap gap-1">
                                        {step.skills.map((skill, i) => (
                                          <Badge key={i} variant="outline" className="text-xs">
                                            {skill}
                                          </Badge>
                                        ))}
                                      </div>
                                    </div>

                                    {step.prerequisites.length > 0 && (
                                      <div>
                                        <h5 className="font-medium mb-2">Prerequisites</h5>
                                        <div className="flex flex-wrap gap-1">
                                          {step.prerequisites.map((prereq, i) => (
                                            <Badge key={i} variant="secondary" className="text-xs">
                                              Step {prereq}
                                            </Badge>
                                          ))}
                                        </div>
                                      </div>
                                    )}
                                  </TabsContent>

                                  <TabsContent value="resources" className="space-y-4">
                                    <div className="grid gap-3">
                                      {step.resources.map((resource) => (
                                        <div
                                          key={resource.id}
                                          className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                                        >
                                          <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-background rounded-lg flex items-center justify-center shadow-sm">
                                              {getResourceIcon(resource.type)}
                                            </div>
                                            <div className="flex-1">
                                              <div className="flex items-center space-x-2 mb-1">
                                                <h6 className="font-medium text-sm">{resource.title}</h6>
                                                {resource.free && (
                                                  <Badge className="bg-green-500 text-white text-xs">FREE</Badge>
                                                )}
                                              </div>
                                              <div className="flex items-center space-x-2 text-xs text-muted-foreground">
                                                <span>{resource.provider}</span>
                                                {resource.duration && (
                                                  <>
                                                    <span>•</span>
                                                    <span>{resource.duration}</span>
                                                  </>
                                                )}
                                                <span>•</span>
                                                <div className="flex items-center space-x-1">
                                                  <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                                                  <span>{resource.rating}</span>
                                                </div>
                                              </div>
                                              <p className="text-xs text-muted-foreground mt-1">
                                                {resource.description}
                                              </p>
                                            </div>
                                          </div>
                                          <Button size="sm" variant="outline" asChild>
                                            <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                              <ExternalLink className="w-3 h-3 mr-1" />
                                              Open
                                            </a>
                                          </Button>
                                        </div>
                                      ))}
                                    </div>
                                  </TabsContent>

                                  <TabsContent value="tips" className="space-y-3">
                                    {step.tips.map((tip, i) => (
                                      <div key={i} className="flex items-start space-x-2">
                                        <Lightbulb className="w-4 h-4 text-yellow-500 mt-0.5 flex-shrink-0" />
                                        <p className="text-sm text-muted-foreground">{tip}</p>
                                      </div>
                                    ))}
                                  </TabsContent>
                                </Tabs>
                              </motion.div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </CardContent>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
