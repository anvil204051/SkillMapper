"use client"

import { useState } from "react"
import { DragDropContext, Droppable, Draggable, type DropResult } from "@hello-pangea/dnd"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { GripVertical, Clock, Play, BookOpen, ExternalLink, Edit, Trash2 } from "lucide-react"

interface Step {
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

interface DragDropRoadmapProps {
  steps: Step[]
  onStepsReorder: (steps: Step[]) => void
  onEditStep: (stepId: string) => void
  onDeleteStep: (stepId: string) => void
  isEditing?: boolean
}

export function DragDropRoadmap({
  steps,
  onStepsReorder,
  onEditStep,
  onDeleteStep,
  isEditing = false,
}: DragDropRoadmapProps) {
  const [isDragging, setIsDragging] = useState(false)

  const handleDragEnd = (result: DropResult) => {
    setIsDragging(false)

    if (!result.destination) return

    const items = Array.from(steps)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)

    onStepsReorder(items)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-500"
      case "in-progress":
        return "bg-gradient-to-r from-blue-500 to-teal-500"
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

  return (
    <DragDropContext onDragStart={() => setIsDragging(true)} onDragEnd={handleDragEnd}>
      <Droppable droppableId="roadmap-steps">
        {(provided, snapshot) => (
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={`space-y-6 ${snapshot.isDraggingOver ? "drop-zone p-4 rounded-lg" : ""}`}
          >
            <AnimatePresence>
              {steps.map((step, index) => (
                <Draggable key={step.id} draggableId={step.id} index={index} isDragDisabled={!isEditing}>
                  {(provided, snapshot) => (
                    <motion.div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ delay: index * 0.1 }}
                      className={`relative ${snapshot.isDragging ? "dragging" : ""}`}
                    >
                      {/* Timeline connector */}
                      {index < steps.length - 1 && (
                        <div className="absolute left-8 top-20 w-0.5 h-16 bg-gradient-to-b from-blue-400 to-purple-400 z-10" />
                      )}

                      <Card className="gradient-border">
                        <div className="gradient-border-content">
                          <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                              {/* Drag handle and status indicator */}
                              <div className="flex flex-col items-center gap-2">
                                {isEditing && (
                                  <div
                                    {...provided.dragHandleProps}
                                    className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-muted"
                                  >
                                    <GripVertical className="w-4 h-4 text-muted-foreground" />
                                  </div>
                                )}
                                <motion.div
                                  className={`w-4 h-4 rounded-full ${getStatusColor(step.status)}`}
                                  whileHover={{ scale: 1.2 }}
                                  transition={{ type: "spring", stiffness: 400 }}
                                />
                              </div>

                              <div className="flex-1">
                                <div className="flex items-center justify-between mb-2">
                                  <motion.h3
                                    className="text-lg font-semibold gradient-text"
                                    whileHover={{ scale: 1.02 }}
                                  >
                                    {step.title}
                                  </motion.h3>
                                  <div className="flex items-center gap-2">
                                    <Badge
                                      variant="secondary"
                                      className="flex items-center gap-1 gradient-bg-soft text-white"
                                    >
                                      <Clock className="w-3 h-3" />
                                      {step.estimatedTime}
                                    </Badge>
                                    {isEditing && (
                                      <div className="flex gap-1">
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => onEditStep(step.id)}
                                          className="h-8 w-8 p-0"
                                        >
                                          <Edit className="w-3 h-3" />
                                        </Button>
                                        <Button
                                          size="sm"
                                          variant="outline"
                                          onClick={() => onDeleteStep(step.id)}
                                          className="h-8 w-8 p-0 hover:bg-red-50 hover:text-red-600"
                                        >
                                          <Trash2 className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    )}
                                  </div>
                                </div>

                                <p className="text-muted-foreground mb-4">{step.description}</p>

                                {/* Enhanced progress bar */}
                                <div className="mb-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <span className="text-sm text-muted-foreground">Progress</span>
                                    <span className="text-sm font-medium gradient-text">{step.progress}%</span>
                                  </div>
                                  <div className="relative">
                                    <Progress value={step.progress} className="h-3" />
                                    <div
                                      className="absolute top-0 left-0 h-3 rounded-full gradient-bg transition-all duration-1000 ease-out"
                                      style={{ width: `${step.progress}%` }}
                                    />
                                  </div>
                                </div>

                                {/* Enhanced resources */}
                                <div>
                                  <p className="text-sm font-medium mb-2 gradient-text">Resources:</p>
                                  <div className="flex flex-wrap gap-2">
                                    {step.resources.map((resource) => (
                                      <motion.div
                                        key={resource.id}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                      >
                                        <Button
                                          variant="outline"
                                          size="sm"
                                          className="h-8 text-xs resource-card gradient-border bg-transparent"
                                          asChild
                                        >
                                          <a href={resource.url} target="_blank" rel="noopener noreferrer">
                                            <div className="gradient-border-content flex items-center gap-1 px-2 py-1">
                                              {getResourceIcon(resource.type)}
                                              {resource.title}
                                            </div>
                                          </a>
                                        </Button>
                                      </motion.div>
                                    ))}
                                  </div>
                                </div>
                              </div>
                            </div>
                          </CardContent>
                        </div>
                      </Card>
                    </motion.div>
                  )}
                </Draggable>
              ))}
            </AnimatePresence>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}
