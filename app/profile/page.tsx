"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Sidebar } from "@/components/sidebar"
import { Edit, Save, Github, Globe, Mail, MapPin, Calendar, Trophy, Target, BookOpen, Eye, EyeOff } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"

interface UserProfile {
  id: string
  name: string
  email: string
  avatar: string
  bio: string
  location: string
  website: string
  githubUsername: string
  joinedDate: string
  isPublic: boolean
  showProgress: boolean
  stats: {
    pathsCompleted: number
    skillsLearned: number
    hoursLearned: number
    streakDays: number
  }
  currentPaths: Array<{
    id: string
    title: string
    progress: number
    category: string
  }>
  achievements: Array<{
    id: string
    title: string
    description: string
    icon: string
    unlockedAt: string
  }>
}

const mockProfile: UserProfile = {
  id: "1",
  name: "John Doe",
  email: "john@example.com",
  avatar: "/placeholder.svg?height=120&width=120",
  bio: "Full-stack developer passionate about learning new technologies and sharing knowledge with the community.",
  location: "San Francisco, CA",
  website: "https://johndoe.dev",
  githubUsername: "johndoe",
  joinedDate: "2024-01-01",
  isPublic: true,
  showProgress: true,
  stats: {
    pathsCompleted: 5,
    skillsLearned: 23,
    hoursLearned: 156,
    streakDays: 12,
  },
  currentPaths: [
    {
      id: "1",
      title: "Advanced React Patterns",
      progress: 75,
      category: "Web Development",
    },
    {
      id: "2",
      title: "Machine Learning Fundamentals",
      progress: 45,
      category: "Data Science",
    },
    {
      id: "3",
      title: "System Design Interview Prep",
      progress: 30,
      category: "Software Engineering",
    },
  ],
  achievements: [
    {
      id: "1",
      title: "First Path Completed",
      description: "Completed your first learning path",
      icon: "🎯",
      unlockedAt: "2024-02-15",
    },
    {
      id: "2",
      title: "Week Warrior",
      description: "Maintained a 7-day learning streak",
      icon: "🔥",
      unlockedAt: "2024-03-01",
    },
    {
      id: "3",
      title: "Community Helper",
      description: "Helped 10 community members",
      icon: "🤝",
      unlockedAt: "2024-03-10",
    },
  ],
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile>(mockProfile)
  const [isEditing, setIsEditing] = useState(false)
  const [githubConnected, setGithubConnected] = useState(false)
  const router = useRouter()
  const { toast } = useToast()

  useEffect(() => {
    const userData = localStorage.getItem("user")
    if (!userData) {
      router.push("/auth")
      return
    }

    // Check if GitHub is connected
    const githubData = localStorage.getItem("githubConnected")
    setGithubConnected(githubData === "true")
  }, [router])

  const handleSaveProfile = () => {
    // Save profile data
    localStorage.setItem("userProfile", JSON.stringify(profile))
    setIsEditing(false)
    toast({
      title: "Profile updated",
      description: "Your profile has been saved successfully.",
    })
  }

  const handleConnectGitHub = () => {
    // Simulate GitHub OAuth flow
    localStorage.setItem("githubConnected", "true")
    setGithubConnected(true)
    toast({
      title: "GitHub connected!",
      description: "Your GitHub account has been linked successfully.",
    })
  }

  const handleDisconnectGitHub = () => {
    localStorage.setItem("githubConnected", "false")
    setGithubConnected(false)
    toast({
      title: "GitHub disconnected",
      description: "Your GitHub account has been unlinked.",
    })
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Web Development":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
      case "Data Science":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "Software Engineering":
        return "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300"
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300"
    }
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      <Sidebar />

      <main className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between">
              <h1 className="text-3xl font-bold">Profile</h1>
              <Button
                onClick={isEditing ? handleSaveProfile : () => setIsEditing(true)}
                className="flex items-center gap-2"
              >
                {isEditing ? <Save className="w-4 h-4" /> : <Edit className="w-4 h-4" />}
                {isEditing ? "Save Changes" : "Edit Profile"}
              </Button>
            </div>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-6">
            {/* Profile Info */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="lg:col-span-1">
              <Card>
                <CardHeader className="text-center">
                  <div className="relative mx-auto mb-4">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={profile.avatar || "/placeholder.svg"} />
                      <AvatarFallback className="text-2xl">{profile.name[0]}</AvatarFallback>
                    </Avatar>
                    {isEditing && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="absolute -bottom-2 -right-2 rounded-full w-8 h-8 p-0 bg-transparent"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                    )}
                  </div>

                  {isEditing ? (
                    <div className="space-y-3">
                      <Input
                        value={profile.name}
                        onChange={(e) => setProfile((prev) => ({ ...prev, name: e.target.value }))}
                        placeholder="Full name"
                      />
                      <Textarea
                        value={profile.bio}
                        onChange={(e) => setProfile((prev) => ({ ...prev, bio: e.target.value }))}
                        placeholder="Bio"
                        rows={3}
                      />
                    </div>
                  ) : (
                    <>
                      <CardTitle className="text-2xl">{profile.name}</CardTitle>
                      <CardDescription className="text-base mt-2">{profile.bio}</CardDescription>
                    </>
                  )}
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Contact Info */}
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          type="email"
                          value={profile.email}
                          onChange={(e) => setProfile((prev) => ({ ...prev, email: e.target.value }))}
                          className="h-8"
                        />
                      ) : (
                        <span>{profile.email}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <MapPin className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          value={profile.location}
                          onChange={(e) => setProfile((prev) => ({ ...prev, location: e.target.value }))}
                          placeholder="Location"
                          className="h-8"
                        />
                      ) : (
                        <span>{profile.location}</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Globe className="w-4 h-4 text-muted-foreground" />
                      {isEditing ? (
                        <Input
                          value={profile.website}
                          onChange={(e) => setProfile((prev) => ({ ...prev, website: e.target.value }))}
                          placeholder="Website"
                          className="h-8"
                        />
                      ) : (
                        <a
                          href={profile.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline"
                        >
                          {profile.website}
                        </a>
                      )}
                    </div>

                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-muted-foreground" />
                      <span>Joined {new Date(profile.joinedDate).toLocaleDateString()}</span>
                    </div>
                  </div>

                  {/* GitHub Integration */}
                  <div className="pt-4 border-t">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <Github className="w-4 h-4" />
                        <span className="text-sm font-medium">GitHub</span>
                      </div>
                      {githubConnected ? (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                        >
                          Connected
                        </Badge>
                      ) : (
                        <Badge variant="outline">Not connected</Badge>
                      )}
                    </div>

                    {githubConnected ? (
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground">@{profile.githubUsername}</p>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleDisconnectGitHub}
                          className="w-full bg-transparent"
                        >
                          Disconnect
                        </Button>
                      </div>
                    ) : (
                      <Button onClick={handleConnectGitHub} size="sm" className="w-full">
                        <Github className="w-4 h-4 mr-2" />
                        Connect GitHub
                      </Button>
                    )}
                  </div>

                  {/* Privacy Settings */}
                  <div className="pt-4 border-t space-y-4">
                    <h3 className="font-medium">Privacy Settings</h3>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {profile.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                        <span className="text-sm">Public Profile</span>
                      </div>
                      <Switch
                        checked={profile.isPublic}
                        onCheckedChange={(checked) => setProfile((prev) => ({ ...prev, isPublic: checked }))}
                      />
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4" />
                        <span className="text-sm">Show Progress</span>
                      </div>
                      <Switch
                        checked={profile.showProgress}
                        onCheckedChange={(checked) => setProfile((prev) => ({ ...prev, showProgress: checked }))}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats and Activity */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="lg:col-span-2 space-y-6"
            >
              {/* Stats Cards */}
              <div className="grid md:grid-cols-4 gap-4">
                <Card>
                  <CardContent className="p-4 text-center">
                    <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{profile.stats.pathsCompleted}</p>
                    <p className="text-sm text-muted-foreground">Paths Completed</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <Target className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{profile.stats.skillsLearned}</p>
                    <p className="text-sm text-muted-foreground">Skills Learned</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <BookOpen className="w-8 h-8 text-green-500 mx-auto mb-2" />
                    <p className="text-2xl font-bold">{profile.stats.hoursLearned}</p>
                    <p className="text-sm text-muted-foreground">Hours Learned</p>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-4 text-center">
                    <div className="text-2xl mb-2">🔥</div>
                    <p className="text-2xl font-bold">{profile.stats.streakDays}</p>
                    <p className="text-sm text-muted-foreground">Day Streak</p>
                  </CardContent>
                </Card>
              </div>

              {/* Current Paths */}
              <Card>
                <CardHeader>
                  <CardTitle>Current Learning Paths</CardTitle>
                  <CardDescription>Your active learning paths and progress</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {profile.currentPaths.map((path) => (
                    <div key={path.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{path.title}</h4>
                          <Badge className={getCategoryColor(path.category)}>{path.category}</Badge>
                        </div>
                        <span className="text-sm font-medium">{path.progress}%</span>
                      </div>
                      <Progress value={path.progress} className="h-2" />
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Achievements */}
              <Card>
                <CardHeader>
                  <CardTitle>Achievements</CardTitle>
                  <CardDescription>Your learning milestones and accomplishments</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {profile.achievements.map((achievement) => (
                      <div key={achievement.id} className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                        <div className="text-2xl">{achievement.icon}</div>
                        <div className="flex-1">
                          <h4 className="font-medium">{achievement.title}</h4>
                          <p className="text-sm text-muted-foreground">{achievement.description}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            Unlocked {new Date(achievement.unlockedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  )
}
