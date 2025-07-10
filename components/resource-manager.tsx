"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Bookmark, Star, Search, Plus, ExternalLink, Play, BookOpen, FileText, Tag } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Resource {
  id: string
  title: string
  url: string
  type: "article" | "video" | "course" | "book" | "tool"
  category: string
  rating: number
  notes: string
  tags: string[]
  dateAdded: string
  isBookmarked: boolean
}

const mockResources: Resource[] = [
  {
    id: "1",
    title: "React Documentation",
    url: "https://react.dev",
    type: "article",
    category: "Web Development",
    rating: 5,
    notes: "Comprehensive guide to React concepts",
    tags: ["react", "javascript", "frontend"],
    dateAdded: "2024-01-15",
    isBookmarked: true,
  },
  {
    id: "2",
    title: "Machine Learning Course",
    url: "https://coursera.org/ml",
    type: "course",
    category: "Data Science",
    rating: 4,
    notes: "Great introduction to ML algorithms",
    tags: ["machine-learning", "python", "algorithms"],
    dateAdded: "2024-01-10",
    isBookmarked: false,
  },
]

const categories = ["All", "Web Development", "Data Science", "Design", "DevOps", "Mobile", "AI/ML"]
const resourceTypes = ["All", "article", "video", "course", "book", "tool"]

export function ResourceManager() {
  const [resources, setResources] = useState<Resource[]>(mockResources)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [selectedType, setSelectedType] = useState("All")
  const [showBookmarkedOnly, setShowBookmarkedOnly] = useState(false)
  const [isAddingResource, setIsAddingResource] = useState(false)
  const { toast } = useToast()

  // Load resources from localStorage
  useEffect(() => {
    const savedResources = localStorage.getItem("savedResources")
    if (savedResources) {
      setResources(JSON.parse(savedResources))
    }
  }, [])

  // Save resources to localStorage
  useEffect(() => {
    localStorage.setItem("savedResources", JSON.stringify(resources))
  }, [resources])

  const filteredResources = resources.filter((resource) => {
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory
    const matchesType = selectedType === "All" || resource.type === selectedType
    const matchesBookmark = !showBookmarkedOnly || resource.isBookmarked

    return matchesSearch && matchesCategory && matchesType && matchesBookmark
  })

  const toggleBookmark = (resourceId: string) => {
    setResources((prev) =>
      prev.map((resource) =>
        resource.id === resourceId ? { ...resource, isBookmarked: !resource.isBookmarked } : resource,
      ),
    )
  }

  const updateRating = (resourceId: string, rating: number) => {
    setResources((prev) => prev.map((resource) => (resource.id === resourceId ? { ...resource, rating } : resource)))
  }

  const addResource = (newResource: Omit<Resource, "id" | "dateAdded">) => {
    const resource: Resource = {
      ...newResource,
      id: Date.now().toString(),
      dateAdded: new Date().toISOString().split("T")[0],
    }
    setResources((prev) => [resource, ...prev])
    setIsAddingResource(false)
    toast({
      title: "Resource added!",
      description: "Your resource has been saved successfully.",
    })
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "video":
        return <Play className="w-4 h-4" />
      case "course":
        return <BookOpen className="w-4 h-4" />
      case "book":
        return <BookOpen className="w-4 h-4" />
      case "tool":
        return <Tag className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const StarRating = ({
    rating,
    onRatingChange,
    readonly = false,
  }: {
    rating: number
    onRatingChange?: (rating: number) => void
    readonly?: boolean
  }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <motion.button
          key={star}
          type="button"
          whileHover={{ scale: readonly ? 1 : 1.2 }}
          whileTap={{ scale: readonly ? 1 : 0.9 }}
          onClick={() => !readonly && onRatingChange?.(star)}
          className={`${readonly ? "cursor-default" : "cursor-pointer"}`}
          disabled={readonly}
        >
          <Star className={`w-4 h-4 ${star <= rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`} />
        </motion.button>
      ))}
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Resource Library</h2>
          <p className="text-muted-foreground">Save, organize, and rate your learning materials</p>
        </div>
        <Dialog open={isAddingResource} onOpenChange={setIsAddingResource}>
          <DialogTrigger asChild>
            <Button className="gradient-bg">
              <Plus className="w-4 h-4 mr-2" />
              Add Resource
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Resource</DialogTitle>
              <DialogDescription>Save a new learning resource to your library</DialogDescription>
            </DialogHeader>
            <AddResourceForm onAdd={addResource} />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card className="gradient-border">
        <div className="gradient-border-content">
          <CardContent className="p-4">
            <div className="grid md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search resources..."
                  className="pl-10"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>

              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedType} onValueChange={setSelectedType}>
                <SelectTrigger>
                  <SelectValue placeholder="Type" />
                </SelectTrigger>
                <SelectContent>
                  {resourceTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type === "All" ? "All Types" : type.charAt(0).toUpperCase() + type.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button
                variant={showBookmarkedOnly ? "default" : "outline"}
                onClick={() => setShowBookmarkedOnly(!showBookmarkedOnly)}
                className={showBookmarkedOnly ? "gradient-bg" : ""}
              >
                <Bookmark className="w-4 h-4 mr-2" />
                Bookmarked
              </Button>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Resources Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        <AnimatePresence>
          {filteredResources.map((resource, index) => (
            <motion.div
              key={resource.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="resource-card gradient-border h-full">
                <div className="gradient-border-content h-full">
                  <CardHeader className="pb-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        {getTypeIcon(resource.type)}
                        <Badge variant="secondary" className="gradient-bg-soft text-white">
                          {resource.type}
                        </Badge>
                      </div>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => toggleBookmark(resource.id)}
                      >
                        <Bookmark
                          className={`w-5 h-5 ${
                            resource.isBookmarked ? "fill-yellow-400 text-yellow-400" : "text-gray-400"
                          }`}
                        />
                      </motion.button>
                    </div>
                    <CardTitle className="text-lg gradient-text">{resource.title}</CardTitle>
                    <CardDescription>{resource.category}</CardDescription>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between">
                      <StarRating
                        rating={resource.rating}
                        onRatingChange={(rating) => updateRating(resource.id, rating)}
                      />
                      <span className="text-sm text-muted-foreground">
                        {new Date(resource.dateAdded).toLocaleDateString()}
                      </span>
                    </div>

                    {resource.notes && <p className="text-sm text-muted-foreground">{resource.notes}</p>}

                    <div className="flex flex-wrap gap-1">
                      {resource.tags.map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          #{tag}
                        </Badge>
                      ))}
                    </div>

                    <Button variant="outline" className="w-full gradient-border bg-transparent" asChild>
                      <a href={resource.url} target="_blank" rel="noopener noreferrer">
                        <div className="gradient-border-content flex items-center justify-center gap-2 py-2">
                          <ExternalLink className="w-4 h-4" />
                          Open Resource
                        </div>
                      </a>
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {filteredResources.length === 0 && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
          <div className="w-16 h-16 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Bookmark className="w-8 h-8 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No resources found</h3>
          <p className="text-muted-foreground mb-4">Try adjusting your search criteria or add some resources</p>
          <Button onClick={() => setIsAddingResource(true)} className="gradient-bg">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Resource
          </Button>
        </motion.div>
      )}
    </div>
  )
}

function AddResourceForm({ onAdd }: { onAdd: (resource: Omit<Resource, "id" | "dateAdded">) => void }) {
  const [formData, setFormData] = useState({
    title: "",
    url: "",
    type: "article" as Resource["type"],
    category: "",
    rating: 0,
    notes: "",
    tags: "",
    isBookmarked: false,
  })

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onAdd({
      ...formData,
      tags: formData.tags
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean),
    })
    setFormData({
      title: "",
      url: "",
      type: "article",
      category: "",
      rating: 0,
      notes: "",
      tags: "",
      isBookmarked: false,
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="text-sm font-medium">Title</label>
        <Input
          value={formData.title}
          onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
          required
        />
      </div>

      <div>
        <label className="text-sm font-medium">URL</label>
        <Input
          type="url"
          value={formData.url}
          onChange={(e) => setFormData((prev) => ({ ...prev, url: e.target.value }))}
          required
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium">Type</label>
          <Select
            value={formData.type}
            onValueChange={(value: Resource["type"]) => setFormData((prev) => ({ ...prev, type: value }))}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="article">Article</SelectItem>
              <SelectItem value="video">Video</SelectItem>
              <SelectItem value="course">Course</SelectItem>
              <SelectItem value="book">Book</SelectItem>
              <SelectItem value="tool">Tool</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="text-sm font-medium">Category</label>
          <Input
            value={formData.category}
            onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
            placeholder="e.g., Web Development"
            required
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Rating</label>
        <div className="flex gap-1 mt-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <motion.button
              key={star}
              type="button"
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setFormData((prev) => ({ ...prev, rating: star }))}
            >
              <Star
                className={`w-5 h-5 ${star <= formData.rating ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
              />
            </motion.button>
          ))}
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">Notes</label>
        <Textarea
          value={formData.notes}
          onChange={(e) => setFormData((prev) => ({ ...prev, notes: e.target.value }))}
          placeholder="Add your notes about this resource..."
          rows={3}
        />
      </div>

      <div>
        <label className="text-sm font-medium">Tags</label>
        <Input
          value={formData.tags}
          onChange={(e) => setFormData((prev) => ({ ...prev, tags: e.target.value }))}
          placeholder="react, javascript, frontend (comma separated)"
        />
      </div>

      <Button type="submit" className="w-full gradient-bg">
        Add Resource
      </Button>
    </form>
  )
}
