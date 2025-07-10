"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts"
import { TrendingUp, Clock, Target, BookOpen, Award, Zap } from "lucide-react"

interface AnalyticsData {
  weeklyProgress: Array<{ day: string; hours: number; completed: number }>
  skillDistribution: Array<{ name: string; value: number; color: string }>
  learningStreak: Array<{ date: string; active: boolean }>
  skillMastery: Array<{ skill: string; beginner: number; intermediate: number; advanced: number }>
  timeSpent: {
    total: number
    thisWeek: number
    average: number
  }
  achievements: Array<{
    id: string
    name: string
    description: string
    progress: number
    target: number
    icon: string
  }>
}

const mockAnalytics: AnalyticsData = {
  weeklyProgress: [
    { day: "Mon", hours: 2.5, completed: 1 },
    { day: "Tue", hours: 1.8, completed: 0 },
    { day: "Wed", hours: 3.2, completed: 2 },
    { day: "Thu", hours: 2.1, completed: 1 },
    { day: "Fri", hours: 4.0, completed: 3 },
    { day: "Sat", hours: 1.5, completed: 1 },
    { day: "Sun", hours: 2.8, completed: 2 },
  ],
  skillDistribution: [
    { name: "Completed", value: 35, color: "#10B981" },
    { name: "In Progress", value: 45, color: "#3B82F6" },
    { name: "Not Started", value: 20, color: "#E5E7EB" },
  ],
  learningStreak: Array.from({ length: 30 }, (_, i) => ({
    date: new Date(Date.now() - (29 - i) * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
    active: Math.random() > 0.3,
  })),
  skillMastery: [
    { skill: "Design", beginner: 85, intermediate: 60, advanced: 30 },
    { skill: "Technical", beginner: 90, intermediate: 45, advanced: 20 },
    { skill: "Business", beginner: 70, intermediate: 40, advanced: 15 },
    { skill: "Creative", beginner: 95, intermediate: 70, advanced: 45 },
    { skill: "Communication", beginner: 80, intermediate: 55, advanced: 25 },
  ],
  timeSpent: {
    total: 156,
    thisWeek: 18,
    average: 3.2,
  },
  achievements: [
    { id: "1", name: "First Steps", description: "Complete your first skill", progress: 1, target: 1, icon: "🎯" },
    { id: "2", name: "Week Warrior", description: "Study for 7 consecutive days", progress: 5, target: 7, icon: "🔥" },
    { id: "3", name: "Speed Learner", description: "Complete 10 skills", progress: 3, target: 10, icon: "⚡" },
    {
      id: "4",
      name: "Master Student",
      description: "Reach 100 hours of study",
      progress: 156,
      target: 100,
      icon: "🏆",
    },
  ],
}

export function ProgressAnalytics() {
  const [analytics, setAnalytics] = useState<AnalyticsData>(mockAnalytics)
  const [activeTab, setActiveTab] = useState("overview")

  const COLORS = ["#10B981", "#3B82F6", "#E5E7EB"]

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Learning Analytics</h2>
          <p className="text-muted-foreground">Track your progress and insights</p>
        </div>
        <Badge className="gradient-bg text-white">
          <TrendingUp className="w-4 h-4 mr-1" />
          {analytics.timeSpent.thisWeek}h this week
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="progress">Progress</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="achievements">Achievements</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Key Metrics */}
          <div className="grid md:grid-cols-4 gap-4">
            <Card className="gradient-border">
              <div className="gradient-border-content">
                <CardContent className="p-4 text-center">
                  <Clock className="w-8 h-8 text-primary mx-auto mb-2" />
                  <div className="text-2xl font-bold gradient-text">{analytics.timeSpent.total}h</div>
                  <div className="text-sm text-muted-foreground">Total Study Time</div>
                </CardContent>
              </div>
            </Card>

            <Card className="gradient-border">
              <div className="gradient-border-content">
                <CardContent className="p-4 text-center">
                  <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold gradient-text">12</div>
                  <div className="text-sm text-muted-foreground">Skills Completed</div>
                </CardContent>
              </div>
            </Card>

            <Card className="gradient-border">
              <div className="gradient-border-content">
                <CardContent className="p-4 text-center">
                  <Zap className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold gradient-text">7</div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </CardContent>
              </div>
            </Card>

            <Card className="gradient-border">
              <div className="gradient-border-content">
                <CardContent className="p-4 text-center">
                  <BookOpen className="w-8 h-8 text-purple-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold gradient-text">{analytics.timeSpent.average}h</div>
                  <div className="text-sm text-muted-foreground">Daily Average</div>
                </CardContent>
              </div>
            </Card>
          </div>

          {/* Weekly Activity Chart */}
          <Card className="gradient-border">
            <div className="gradient-border-content">
              <CardHeader>
                <CardTitle>Weekly Activity</CardTitle>
                <CardDescription>Your learning hours and completed skills this week</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={analytics.weeklyProgress}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="day" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="hours" fill="#3B82F6" name="Hours Studied" />
                    <Bar dataKey="completed" fill="#10B981" name="Skills Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </div>
          </Card>

          {/* Skill Distribution */}
          <Card className="gradient-border">
            <div className="gradient-border-content">
              <CardHeader>
                <CardTitle>Skill Progress Distribution</CardTitle>
                <CardDescription>Overview of your learning progress</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-center">
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={analytics.skillDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={120}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {analytics.skillDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex justify-center space-x-6 mt-4">
                  {analytics.skillDistribution.map((item, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                      <span className="text-sm text-muted-foreground">
                        {item.name}: {item.value}%
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="progress" className="space-y-6">
          {/* Learning Streak Heatmap */}
          <Card className="gradient-border">
            <div className="gradient-border-content">
              <CardHeader>
                <CardTitle>Learning Streak (Last 30 Days)</CardTitle>
                <CardDescription>Your daily learning activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-10 gap-1">
                  {analytics.learningStreak.map((day, index) => (
                    <div
                      key={index}
                      className={`w-6 h-6 rounded-sm ${day.active ? "bg-green-500" : "bg-gray-200"}`}
                      title={day.date}
                    />
                  ))}
                </div>
                <div className="flex justify-between text-xs text-muted-foreground mt-2">
                  <span>30 days ago</span>
                  <span>Today</span>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Progress Timeline */}
          <Card className="gradient-border">
            <div className="gradient-border-content">
              <CardHeader>
                <CardTitle>Learning Timeline</CardTitle>
                <CardDescription>Your recent achievements and milestones</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { date: "2024-01-15", event: "Completed Fashion Design Fundamentals", type: "skill" },
                    { date: "2024-01-12", event: "Started Pattern Making course", type: "start" },
                    { date: "2024-01-10", event: "Achieved 7-day learning streak", type: "achievement" },
                    { date: "2024-01-08", event: "Completed Sketching and Illustration", type: "skill" },
                    { date: "2024-01-05", event: "Joined SkillMapper community", type: "milestone" },
                  ].map((item, index) => (
                    <div key={index} className="flex items-center space-x-4">
                      <div
                        className={`w-3 h-3 rounded-full ${
                          item.type === "skill"
                            ? "bg-green-500"
                            : item.type === "achievement"
                              ? "bg-yellow-500"
                              : item.type === "start"
                                ? "bg-blue-500"
                                : "bg-purple-500"
                        }`}
                      />
                      <div className="flex-1">
                        <p className="text-sm font-medium">{item.event}</p>
                        <p className="text-xs text-muted-foreground">{item.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="skills" className="space-y-6">
          {/* Skill Mastery Radar */}
          <Card className="gradient-border">
            <div className="gradient-border-content">
              <CardHeader>
                <CardTitle>Skill Mastery Overview</CardTitle>
                <CardDescription>Your progress across different skill categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <RadarChart data={analytics.skillMastery}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="skill" />
                    <PolarRadiusAxis angle={90} domain={[0, 100]} />
                    <Radar name="Beginner" dataKey="beginner" stroke="#10B981" fill="#10B981" fillOpacity={0.1} />
                    <Radar
                      name="Intermediate"
                      dataKey="intermediate"
                      stroke="#3B82F6"
                      fill="#3B82F6"
                      fillOpacity={0.1}
                    />
                    <Radar name="Advanced" dataKey="advanced" stroke="#8B5CF6" fill="#8B5CF6" fillOpacity={0.1} />
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
                <div className="flex justify-center space-x-6 mt-4">
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">Beginner</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-blue-500" />
                    <span className="text-sm text-muted-foreground">Intermediate</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-purple-500" />
                    <span className="text-sm text-muted-foreground">Advanced</span>
                  </div>
                </div>
              </CardContent>
            </div>
          </Card>

          {/* Skill Progress Breakdown */}
          <div className="grid md:grid-cols-2 gap-6">
            {analytics.skillMastery.map((skill, index) => (
              <Card key={index} className="gradient-border">
                <div className="gradient-border-content">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-lg">{skill.skill} Skills</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Beginner</span>
                        <span>{skill.beginner}%</span>
                      </div>
                      <Progress value={skill.beginner} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Intermediate</span>
                        <span>{skill.intermediate}%</span>
                      </div>
                      <Progress value={skill.intermediate} className="h-2" />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Advanced</span>
                        <span>{skill.advanced}%</span>
                      </div>
                      <Progress value={skill.advanced} className="h-2" />
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            {analytics.achievements.map((achievement) => (
              <Card key={achievement.id} className="gradient-border">
                <div className="gradient-border-content">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{achievement.icon}</div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{achievement.name}</h3>
                        <p className="text-muted-foreground text-sm mb-3">{achievement.description}</p>
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span>Progress</span>
                            <span>
                              {Math.min(achievement.progress, achievement.target)}/{achievement.target}
                            </span>
                          </div>
                          <Progress
                            value={(Math.min(achievement.progress, achievement.target) / achievement.target) * 100}
                            className="h-2"
                          />
                          {achievement.progress >= achievement.target && (
                            <Badge className="bg-green-500 text-white">
                              <Award className="w-3 h-3 mr-1" />
                              Completed!
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
