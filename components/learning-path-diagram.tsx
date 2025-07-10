"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CheckCircle, Circle, Clock, BookOpen, Users, Lightbulb } from "lucide-react"

interface PathNode {
  id: string
  title: string
  description: string
  status: "completed" | "current" | "locked" | "available"
  estimatedTime: string
  prerequisites: string[]
  skills: string[]
  difficulty: "beginner" | "intermediate" | "advanced"
  resources: number
  learners: number
}

const mockPathData: PathNode[] = [
  {
    id: "1",
    title: "Design Fundamentals",
    description: "Learn basic design principles, color theory, and composition",
    status: "completed",
    estimatedTime: "2-3 weeks",
    prerequisites: [],
    skills: ["Color Theory", "Typography", "Layout"],
    difficulty: "beginner",
    resources: 12,
    learners: 1250,
  },
  {
    id: "2",
    title: "Sketching & Illustration",
    description: "Master hand sketching and digital illustration techniques",
    status: "completed",
    estimatedTime: "3-4 weeks",
    prerequisites: ["1"],
    skills: ["Hand Sketching", "Digital Art", "Perspective"],
    difficulty: "beginner",
    resources: 8,
    learners: 980,
  },
  {
    id: "3",
    title: "Pattern Making",
    description: "Learn to create patterns and understand garment construction",
    status: "current",
    estimatedTime: "4-6 weeks",
    prerequisites: ["2"],
    skills: ["Pattern Creation", "Measurements", "Fitting"],
    difficulty: "intermediate",
    resources: 15,
    learners: 750,
  },
  {
    id: "4",
    title: "Fabric Knowledge",
    description: "Understand different fabrics, their properties and applications",
    status: "available",
    estimatedTime: "2-3 weeks",
    prerequisites: ["2"],
    skills: ["Fabric Types", "Properties", "Selection"],
    difficulty: "intermediate",
    resources: 10,
    learners: 650,
  },
  {
    id: "5",
    title: "Advanced Techniques",
    description: "Master complex construction and finishing techniques",
    status: "locked",
    estimatedTime: "5-7 weeks",
    prerequisites: ["3", "4"],
    skills: ["Advanced Construction", "Finishing", "Quality Control"],
    difficulty: "advanced",
    resources: 20,
    learners: 420,
  },
  {
    id: "6",
    title: "Fashion Business",
    description: "Learn about fashion industry, marketing, and business aspects",
    status: "locked",
    estimatedTime: "3-4 weeks",
    prerequisites: ["5"],
    skills: ["Business Planning", "Marketing", "Brand Development"],
    difficulty: "advanced",
    resources: 18,
    learners: 380,
  },
]

export function LearningPathDiagram() {
  const [selectedNode, setSelectedNode] = useState<string | null>(null)
  const [viewMode, setViewMode] = useState<"flowchart" | "timeline">("flowchart")

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="w-5 h-5 text-green-500" />
      case "current":
        return <Circle className="w-5 h-5 text-blue-500 fill-current" />
      case "available":
        return <Circle className="w-5 h-5 text-gray-400" />
      case "locked":
        return <Circle className="w-5 h-5 text-gray-300" />
      default:
        return <Circle className="w-5 h-5 text-gray-300" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "border-green-500 bg-green-50"
      case "current":
        return "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
      case "available":
        return "border-gray-300 bg-white hover:border-blue-300"
      case "locked":
        return "border-gray-200 bg-gray-50 opacity-60"
      default:
        return "border-gray-200 bg-gray-50"
    }
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-100 text-green-800"
      case "intermediate":
        return "bg-yellow-100 text-yellow-800"
      case "advanced":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const FlowchartView = () => (
    <div className="relative">
      {/* Connection Lines */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none" style={{ zIndex: 1 }}>
        {mockPathData.map((node) =>
          node.prerequisites.map((prereq) => {
            const fromNode = mockPathData.find((n) => n.id === prereq)
            const toNode = node
            if (!fromNode) return null

            const fromIndex = mockPathData.indexOf(fromNode)
            const toIndex = mockPathData.indexOf(toNode)

            // Calculate positions (simplified for demo)
            const fromX = (fromIndex % 3) * 300 + 150
            const fromY = Math.floor(fromIndex / 3) * 200 + 100
            const toX = (toIndex % 3) * 300 + 150
            const toY = Math.floor(toIndex / 3) * 200 + 100

            return (
              <line
                key={`${prereq}-${node.id}`}
                x1={fromX}
                y1={fromY + 80}
                x2={toX}
                y2={toY - 20}
                stroke="#E5E7EB"
                strokeWidth="2"
                markerEnd="url(#arrowhead)"
              />
            )
          }),
        )}
        <defs>
          <marker id="arrowhead" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill="#E5E7EB" />
          </marker>
        </defs>
      </svg>

      {/* Nodes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative" style={{ zIndex: 2 }}>
        {mockPathData.map((node, index) => (
          <motion.div
            key={node.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative cursor-pointer transition-all duration-200 ${
              selectedNode === node.id ? "scale-105" : ""
            }`}
            onClick={() => setSelectedNode(selectedNode === node.id ? null : node.id)}
          >
            <Card className={`border-2 ${getStatusColor(node.status)}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(node.status)}
                    <CardTitle className="text-lg">{node.title}</CardTitle>
                  </div>
                  <Badge className={getDifficultyColor(node.difficulty)}>{node.difficulty}</Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">{node.description}</p>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Clock className="w-3 h-3" />
                    <span>{node.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BookOpen className="w-3 h-3" />
                    <span>{node.resources} resources</span>
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <div className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{node.learners.toLocaleString()} learners</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Lightbulb className="w-3 h-3" />
                    <span>{node.skills.length} skills</span>
                  </div>
                </div>

                {selectedNode === node.id && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    className="border-t pt-3 mt-3"
                  >
                    <div className="space-y-2">
                      <div>
                        <p className="text-xs font-medium text-muted-foreground mb-1">Skills you'll learn:</p>
                        <div className="flex flex-wrap gap-1">
                          {node.skills.map((skill, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {skill}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      {node.prerequisites.length > 0 && (
                        <div>
                          <p className="text-xs font-medium text-muted-foreground mb-1">Prerequisites:</p>
                          <div className="flex flex-wrap gap-1">
                            {node.prerequisites.map((prereq) => {
                              const prereqNode = mockPathData.find((n) => n.id === prereq)
                              return prereqNode ? (
                                <Badge key={prereq} variant="secondary" className="text-xs">
                                  {prereqNode.title}
                                </Badge>
                              ) : null
                            })}
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )

  const TimelineView = () => (
    <div className="space-y-6">
      {mockPathData.map((node, index) => (
        <motion.div
          key={node.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          className="relative"
        >
          {/* Timeline line */}
          {index < mockPathData.length - 1 && <div className="absolute left-6 top-16 w-0.5 h-16 bg-gray-200" />}

          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 mt-2">{getStatusIcon(node.status)}</div>
            <Card className={`flex-1 border ${getStatusColor(node.status)}`}>
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-lg">{node.title}</h3>
                  <Badge className={getDifficultyColor(node.difficulty)}>{node.difficulty}</Badge>
                </div>
                <p className="text-muted-foreground mb-3">{node.description}</p>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>{node.estimatedTime}</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <BookOpen className="w-4 h-4" />
                    <span>{node.resources} resources</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{node.learners.toLocaleString()} learners</span>
                  </div>
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <Lightbulb className="w-4 h-4" />
                    <span>{node.skills.length} skills</span>
                  </div>
                </div>

                <div className="mt-3 pt-3 border-t">
                  <div className="flex flex-wrap gap-1">
                    {node.skills.map((skill, i) => (
                      <Badge key={i} variant="outline" className="text-xs">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Learning Path Visualization</h2>
          <p className="text-muted-foreground">Interactive roadmap of your learning journey</p>
        </div>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === "flowchart" ? "default" : "outline"}
            onClick={() => setViewMode("flowchart")}
            className={viewMode === "flowchart" ? "gradient-bg" : ""}
          >
            Flowchart
          </Button>
          <Button
            variant={viewMode === "timeline" ? "default" : "outline"}
            onClick={() => setViewMode("timeline")}
            className={viewMode === "timeline" ? "gradient-bg" : ""}
          >
            Timeline
          </Button>
        </div>
      </div>

      <Card className="gradient-border">
        <div className="gradient-border-content">
          <CardContent className="p-6">{viewMode === "flowchart" ? <FlowchartView /> : <TimelineView />}</CardContent>
        </div>
      </Card>

      {/* Legend */}
      <Card className="gradient-border">
        <div className="gradient-border-content">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3">Legend</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span>Completed</span>
              </div>
              <div className="flex items-center space-x-2">
                <Circle className="w-4 h-4 text-blue-500 fill-current" />
                <span>Current</span>
              </div>
              <div className="flex items-center space-x-2">
                <Circle className="w-4 h-4 text-gray-400" />
                <span>Available</span>
              </div>
              <div className="flex items-center space-x-2">
                <Circle className="w-4 h-4 text-gray-300" />
                <span>Locked</span>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
