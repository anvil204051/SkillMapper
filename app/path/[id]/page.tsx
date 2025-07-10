"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Sidebar } from "@/components/sidebar"
import { Edit, Save, Share, Clock, Play, BookOpen, ExternalLink, Plus, Trash2, GripVertical } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface Resource {
  id: string
  title: string
  type: "article" | "video" | "course" | "book"
  url: string
}

interface Step {
  id: string
  title: string
  description: string
  progress: number
  status: "not-started" | "in-progress" | "completed"
  estimatedTime: string
  resources: Resource[]
}

const mockPath = {
  id: "1",
  title: "Become a Data Scientist",
  description: "A comprehensive roadmap to become a professional data scientist",
  totalSteps: 8,
  completedSteps: 2,
  estimatedDuration: "6-8 months",
  difficulty: "Intermediate",
  steps: [
    {
      id: "1",
      title: "Python Fundamentals",
      description: "Learn the basics of Python programming including syntax, data types, and control structures.",
      progress: 100,
      status: "completed" as const,
      estimatedTime: "2 weeks",
      resources: [
        { id: "1", title: "Python.org Tutorial", type: "article" as const, url: "#" },
        { id: "2", title: "Python Crash Course", type: "video" as const, url: "#" },
        { id: "3", title: "Automate the Boring Stuff", type: "book" as const, url: "#" },
      ],
    },
    {
      id: "2",
      title: "Data Analysis with Pandas",
      description: "Master data manipulation and analysis using the Pandas library.",
      progress: 65,
      status: "in-progress" as const,
      estimatedTime: "3 weeks",
      resources: [
        { id: "4", title: "Pandas Documentation", type: "article" as const, url: "#" },
        { id: "5", title: "Data Analysis Course", type: "course" as const, url: "#" },
      ],
    },
    {
      id: "3",
      title: "Statistics and Probability",
      description: "Build a strong foundation in statistics and probability theory.",
      progress: 0,
      status: "not-started" as const,
      estimatedTime: "4 weeks",
      resources: [
        { id: "6", title: "Khan Academy Statistics", type: "course" as const, url: "#" },
        { id: "7", title: "Think Stats", type: "book" as const, url: "#" },
      ],
    },
  ],
}

export default function PathDetailsPage() {
  const [path, setPath] = useState(mockPath)
  const [isEditing, setIsEditing] = useState(false)
  const [editingStep, setEditingStep] = useState<string | null>(null)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth")
    }
  }, [router])

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-blue-500"
      default:
        return "bg-gray-300"
    }
  }

  const getResourceIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />
      case "course":
        return <BookOpen className="w-4 h-4" />
      default:
        return <ExternalLink className="w-4 h-4" />
    }
  }

  const handleSaveStep = (stepId: string, updatedData: Partial<Step>) => {
    setPath((prev) => ({
      ...prev,
      steps: prev.steps.map((step) => (step.id === stepId ? { ...step, ...updatedData } : step)),
    }))
    setEditingStep(null)
    toast({
      title: "Step updated",
      description: "Your changes have been saved successfully.",
    })
  }

  const handleSharePath = () => {
    navigator.clipboard.writeText(window.location.href)
    toast({
      title: "Link copied!",
      description: "Path link has been copied to your clipboard.",
    })
  }

  const addNewStep = () => {
    const newStep: Step = {
      id: Date.now().toString(),
      title: "New Step",
      description: "Add description for this step",
      progress: 0,
      status: "not-started",
      estimatedTime: "1 week",
      resources: [],
    }
    setPath((prev) => ({
      ...prev,
      steps: [...prev.steps, newStep],
      totalSteps: prev.totalSteps + 1,
    }))
    setEditingStep(newStep.id)
  }

  const deleteStep = (stepId: string) => {
    setPath((prev) => ({
      ...prev,
      steps: prev.steps.filter((step) => step.id !== stepId),
      totalSteps: prev.totalSteps - 1,
    }))
    toast({
      title: "Step deleted",
      description: "The step has been removed from your path.",
    })
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{path.title}</h1>
                <p className="text-muted-foreground">{path.description}</p>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setIsEditing(!isEditing)}>
                  <Edit className="w-4 h-4 mr-2" />
                  {isEditing ? "Done Editing" : "Edit Path"}
                </Button>
                <Button onClick={handleSharePath}>
                  <Share className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>
            </div>

            {/* Path Stats */}
            <div className="grid md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">
                      {path.completedSteps}/{path.totalSteps}
                    </p>
                    <p className="text-sm text-muted-foreground">Steps Completed</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{Math.round((path.completedSteps / path.totalSteps) * 100)}%</p>
                    <p className="text-sm text-muted-foreground">Progress</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <p className="text-2xl font-bold">{path.estimatedDuration}</p>
                    <p className="text-sm text-muted-foreground">Duration</p>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="text-center">
                    <Badge variant="secondary" className="text-lg px-3 py-1">
                      {path.difficulty}
                    </Badge>
                    <p className="text-sm text-muted-foreground mt-1">Difficulty</p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </motion.div>

          {/* Steps */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Learning Steps</h2>
              {isEditing && (
                <Button onClick={addNewStep} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Step
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {path.steps.map((step, index) => (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="relative"
                >
                  {/* Timeline connector */}
                  {index < path.steps.length - 1 && <div className="absolute left-6 top-20 w-0.5 h-16 bg-border" />}

                  <Card>
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        {/* Drag handle and status indicator */}
                        <div className="flex flex-col items-center gap-2">
                          {isEditing && <GripVertical className="w-4 h-4 text-muted-foreground cursor-move" />}
                          <div className={`w-3 h-3 rounded-full ${getStatusColor(step.status)}`} />
                        </div>

                        <div className="flex-1">
                          {editingStep === step.id ? (
                            <EditStepForm
                              step={step}
                              onSave={(data) => handleSaveStep(step.id, data)}
                              onCancel={() => setEditingStep(null)}
                            />
                          ) : (
                            <>
                              <div className="flex items-center justify-between mb-2">
                                <h3 className="text-lg font-semibold">{step.title}</h3>
                                <div className="flex items-center gap-2">
                                  <Badge variant="secondary" className="flex items-center gap-1">
                                    <Clock className="w-3 h-3" />
                                    {step.estimatedTime}
                                  </Badge>
                                  {isEditing && (
                                    <div className="flex gap-1">
                                      <Button size="sm" variant="outline" onClick={() => setEditingStep(step.id)}>
                                        <Edit className="w-3 h-3" />
                                      </Button>
                                      <Button size="sm" variant="outline" onClick={() => deleteStep(step.id)}>
                                        <Trash2 className="w-3 h-3" />
                                      </Button>
                                    </div>
                                  )}
                                </div>
                              </div>

                              <p className="text-muted-foreground mb-4">{step.description}</p>

                              {/* Progress bar */}
                              <div className="mb-4">
                                <div className="flex items-center justify-between mb-2">
                                  <span className="text-sm text-muted-foreground">Progress</span>
                                  <span className="text-sm font-medium">{step.progress}%</span>
                                </div>
                                <Progress value={step.progress} className="h-2" />
                              </div>

                              {/* Resources */}
                              <div>
                                <p className="text-sm font-medium mb-2">Resources:</p>
                                <div className="flex flex-wrap gap-2">
                                  {step.resources.map((resource) => (
                                    <Button
                                      key={resource.id}
                                      variant="outline"
                                      size="sm"
                                      className="h-8 text-xs bg-transparent"
                                      asChild
                                    >
                                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                        {getResourceIcon(resource.type)}
                                        {resource.title}
                                      </a>
                                    </Button>
                                  ))}
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  )
}

function EditStepForm({
  step,
  onSave,
  onCancel,
}: {
  step: Step
  onSave: (data: Partial<Step>) => void
  onCancel: () => void
}) {
  const [title, setTitle] = useState(step.title)
  const [description, setDescription] = useState(step.description)
  const [estimatedTime, setEstimatedTime] = useState(step.estimatedTime)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ title, description, estimatedTime })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Step title"
          className="font-semibold"
        />
      </div>
      <div>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Step description"
          rows={3}
        />
      </div>
      <div>
        <Input value={estimatedTime} onChange={(e) => setEstimatedTime(e.target.value)} placeholder="Estimated time" />
      </div>
      <div className="flex gap-2">
        <Button type="submit" size="sm">
          <Save className="w-3 h-3 mr-1" />
          Save
        </Button>
        <Button type="button" variant="outline" size="sm" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  )
}
