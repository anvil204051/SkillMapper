"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { TopNavigation } from "@/components/top-navigation"
import { FloatingAssistant } from "@/components/floating-assistant"
import { Search, Heart, MessageCircle, Share, Users, TrendingUp } from "lucide-react"

interface CommunityPost {
  id: string
  author: {
    name: string
    avatar: string
    career: string
  }
  title: string
  content: string
  career: string
  likes: number
  comments: number
  timeAgo: string
  trending: boolean
}

const mockPosts: CommunityPost[] = [
  {
    id: "1",
    author: {
      name: "Sarah Chen",
      avatar: "/placeholder.svg?height=40&width=40",
      career: "UX Designer",
    },
    title: "Just completed my UX Design roadmap! 🎉",
    content:
      "After 8 months of following the SkillMapper roadmap, I just landed my first UX role! The step-by-step approach really helped me stay focused. Happy to answer any questions for fellow career changers!",
    career: "UX Design",
    likes: 47,
    comments: 12,
    timeAgo: "2 hours ago",
    trending: true,
  },
  {
    id: "2",
    author: {
      name: "Mike Rodriguez",
      avatar: "/placeholder.svg?height=40&width=40",
      career: "Chef",
    },
    title: "Knife skills practice paying off!",
    content:
      "Week 3 of the culinary roadmap and my knife skills have improved dramatically. The YouTube videos recommended were spot on. Practice makes perfect!",
    career: "Culinary Arts",
    likes: 23,
    comments: 8,
    timeAgo: "5 hours ago",
    trending: false,
  },
  {
    id: "3",
    author: {
      name: "Emma Wilson",
      avatar: "/placeholder.svg?height=40&width=40",
      career: "Teacher",
    },
    title: "Teaching certification journey begins",
    content:
      "Starting my teaching roadmap today! Excited to make the transition from corporate to education. The roadmap looks comprehensive and well-structured.",
    career: "Education",
    likes: 31,
    comments: 15,
    timeAgo: "1 day ago",
    trending: false,
  },
  {
    id: "4",
    author: {
      name: "Alex Kim",
      avatar: "/placeholder.svg?height=40&width=40",
      career: "Digital Marketer",
    },
    title: "Google Ads certification complete! ✅",
    content:
      "Just passed my Google Ads certification as part of the digital marketing roadmap. The recommended course was excellent. On to social media marketing next!",
    career: "Digital Marketing",
    likes: 19,
    comments: 6,
    timeAgo: "2 days ago",
    trending: true,
  },
]

const careerCategories = [
  "All Careers",
  "UX Design",
  "Culinary Arts",
  "Education",
  "Digital Marketing",
  "Fashion Design",
  "Photography",
  "Architecture",
]

export default function CommunityPage() {
  const [posts, setPosts] = useState<CommunityPost[]>(mockPosts)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCareer, setSelectedCareer] = useState("All Careers")
  const [likedPosts, setLikedPosts] = useState<string[]>([])

  useEffect(() => {
    const saved = localStorage.getItem("likedPosts")
    if (saved) {
      setLikedPosts(JSON.parse(saved))
    }
  }, [])

  const filteredPosts = posts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.author.name.toLowerCase().includes(searchQuery.toLowerCase())

    const matchesCareer = selectedCareer === "All Careers" || post.career === selectedCareer

    return matchesSearch && matchesCareer
  })

  const handleLike = (postId: string) => {
    const newLikedPosts = likedPosts.includes(postId)
      ? likedPosts.filter((id) => id !== postId)
      : [...likedPosts, postId]

    setLikedPosts(newLikedPosts)
    localStorage.setItem("likedPosts", JSON.stringify(newLikedPosts))

    setPosts((prev) =>
      prev.map((post) =>
        post.id === postId
          ? {
              ...post,
              likes: likedPosts.includes(postId) ? post.likes - 1 : post.likes + 1,
            }
          : post,
      ),
    )
  }

  const getCareerColor = (career: string) => {
    const colors: Record<string, string> = {
      "UX Design": "bg-soft-purple text-deep-purple",
      "Culinary Arts": "bg-soft-blue text-deep-blue",
      Education: "bg-light-teal text-teal",
      "Digital Marketing": "bg-soft-purple text-deep-purple",
      "Fashion Design": "bg-soft-blue text-deep-blue",
      Photography: "bg-light-teal text-teal",
      Architecture: "bg-soft-purple text-deep-purple",
    }
    return colors[career] || "bg-gray-100 text-gray-600"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      <TopNavigation />
      <FloatingAssistant />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Community <span className="gradient-text">Stories</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Connect with fellow learners, share your progress, and get inspired by success stories from every career
              path
            </p>
          </motion.div>

          {/* Search and Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-8"
          >
            <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="space-y-4">
                  {/* Search */}
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      placeholder="Search posts, authors, or topics..."
                      className="pl-10 py-3 text-base border-gray-200 focus:border-primary"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>

                  {/* Career Filter */}
                  <div className="flex flex-wrap gap-2">
                    {careerCategories.map((career) => (
                      <Button
                        key={career}
                        variant={selectedCareer === career ? "default" : "outline"}
                        size="sm"
                        onClick={() => setSelectedCareer(career)}
                        className={
                          selectedCareer === career
                            ? "gradient-bg hover:opacity-90 text-white"
                            : "text-muted-foreground border-gray-200 hover:border-primary hover:text-primary"
                        }
                      >
                        {career}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Posts */}
          <div className="space-y-6">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <Card className="border-0 shadow-lg bg-white/50 dark:bg-gray-800/50 backdrop-blur-sm hover:shadow-xl transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={post.author.avatar || "/placeholder.svg"} />
                          <AvatarFallback>{post.author.name[0]}</AvatarFallback>
                        </Avatar>
                        <div>
                          <div className="flex items-center space-x-2">
                            <h3 className="font-semibold text-gray-900">{post.author.name}</h3>
                            {post.trending && (
                              <Badge className="gradient-bg text-white">
                                <TrendingUp className="w-3 h-3 mr-1" />
                                Trending
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                            <span>{post.author.career}</span>
                            <span>•</span>
                            <span>{post.timeAgo}</span>
                          </div>
                        </div>
                      </div>
                      <Badge className={getCareerColor(post.career)}>{post.career}</Badge>
                    </div>
                  </CardHeader>

                  <CardContent className="pt-0">
                    <div className="space-y-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 mb-2">{post.title}</h4>
                        <p className="text-muted-foreground leading-relaxed">{post.content}</p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => handleLike(post.id)}
                            className={`
                              flex items-center space-x-2 px-3 py-2 rounded-lg transition-colors
                              ${
                                likedPosts.includes(post.id)
                                  ? "text-red-500 bg-red-50"
                                  : "text-muted-foreground hover:text-red-500 hover:bg-red-50"
                              }
                            `}
                          >
                            <Heart className={`w-4 h-4 ${likedPosts.includes(post.id) ? "fill-current" : ""}`} />
                            <span className="text-sm font-medium">{post.likes}</span>
                          </button>

                          <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-blue-50 transition-colors">
                            <MessageCircle className="w-4 h-4" />
                            <span className="text-sm font-medium">{post.comments}</span>
                          </button>
                        </div>

                        <button className="flex items-center space-x-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-primary hover:bg-blue-50 transition-colors">
                          <Share className="w-4 h-4" />
                          <span className="text-sm font-medium">Share</span>
                        </button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Empty State */}
          {filteredPosts.length === 0 && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-4">
                Try adjusting your search or browse different career categories
              </p>
              <Button
                onClick={() => {
                  setSearchQuery("")
                  setSelectedCareer("All Careers")
                }}
                variant="outline"
                className="text-primary border-primary hover:bg-primary hover:text-white"
              >
                Clear Filters
              </Button>
            </motion.div>
          )}

          {/* Community Stats */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mt-12"
          >
            <Card className="border-0 shadow-lg gradient-bg-soft">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-4">Join Our Growing Community</h3>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div>
                    <div className="text-3xl font-bold gradient-text mb-1">12,000+</div>
                    <div className="text-muted-foreground">Active Learners</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold gradient-text mb-1">50+</div>
                    <div className="text-muted-foreground">Career Paths</div>
                  </div>
                  <div>
                    <div className="text-3xl font-bold gradient-text mb-1">95%</div>
                    <div className="text-muted-foreground">Success Rate</div>
                  </div>
                </div>
                <p className="text-muted-foreground mb-6">
                  Share your journey, get support, and celebrate milestones with fellow career changers
                </p>
                <Button className="gradient-bg hover:opacity-90 transition-opacity px-6 py-3">
                  Start Your Journey
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
