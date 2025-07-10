"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TopNavigation } from "@/components/top-navigation"
import { FloatingAssistant } from "@/components/floating-assistant"
import {
  CheckCircle,
  Circle,
  Clock,
  BookOpen,
  ExternalLink,
  Play,
  FileText,
  Award,
  Target,
  Users,
  Calendar,
  Edit,
  BarChart3,
  Atom,
  FlaskConical,
  Bookmark,
  Sparkles,
  TrendingUp,
  ChevronRight,
  Gauge,
  Check,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Aurora from "@/components/Aurora";
import { DifficultySelector } from "@/components/difficulty-selector"
import { useRef } from "react"

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
  estimatedTime: string
  difficulty: "easy" | "medium" | "hard"
  status: "not-started" | "in-progress" | "completed"
  progress: number
  resources: Resource[]
  skills: string[]
  weekNumber: number
  bullets: string[]
}

interface Phase {
  id: string
  name: string
  description: string
  steps: Step[]
  color: string
  level: "beginner" | "intermediate" | "advanced"
}

interface SkillSuggestion {
  name: string;
  match: string;
  description: string;
  context: string;
  tags: string[];
}

interface NextSuggestion {
  name: string;
  description: string;
  context: string;
}

interface SmartSuggestion {
  skill: SkillSuggestion;
  next: NextSuggestion;
}

const resetProgress = (phases: Phase[]) =>
  phases.map(phase => ({
    ...phase,
    steps: phase.steps.map(step => ({
      ...step,
      status: "not-started" as Step["status"],
      progress: 0,
    })),
  }));

export default function RoadmapPage() {
  // Chat state hooks must be at the top
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'assistant', content: string}[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Always clear roadmap data on page load
  useEffect(() => {
    const careerGoal = localStorage.getItem('careerGoal');
    if (!careerGoal) {
      localStorage.removeItem('careerGoal');
      localStorage.removeItem('userRoadmapConfig');
      localStorage.removeItem('roadmap_resources');
      setRoadmapData([]);
      setRoadmapConfig(null);
    }
    // Only clear chat on first visit in this session
    if (!sessionStorage.getItem('aiChatInitialized')) {
      setChatHistory([]);
      sessionStorage.setItem('aiChatInitialized', 'true');
    }
  }, []);

  const [roadmapConfig, setRoadmapConfig] = useState<any>(null)
  const [roadmapData, setRoadmapData] = useState<Phase[]>([])
  const [activeTab, setActiveTab] = useState("roadmap")
  const [savedResources, setSavedResources] = useState<string[]>([])
  const [showDifficultySelector, setShowDifficultySelector] = useState(false)
  const [showSmartSuggestions, setShowSmartSuggestions] = useState(false);
  const router = useRouter()
  const { toast } = useToast()
  const [stepProgress, setStepProgress] = useState<number[]>([]); // 0: not started, 1: in progress, 2: completed
  // Parse chatSteps at the top so it's available everywhere
  const [chatSteps, setChatSteps] = useState<{ title: string; bullets: string[]; resources: any[] }[]>([]);
  // Load chatSteps from localStorage on mount
  useEffect(() => {
    try {
      setChatSteps(JSON.parse(localStorage.getItem('roadmap_resources') || '[]'));
    } catch (e) {
      setChatSteps([]);
    }
  }, []);
  // Reset step progress when steps change
  useEffect(() => {
    setStepProgress(Array(chatSteps.length).fill(0));
  }, [chatSteps.length]);
  // Progress bar click handler
  const handleStepProgressClick = (idx: number) => {
    setStepProgress(prev => {
      const next = [...prev];
      next[idx] = (next[idx] + 1) % 3; // 0 -> 1 -> 2 -> 0
      return next;
    });
  };
  // Stats calculation
  const totalSteps = chatSteps.length;
  const completedSteps = stepProgress.filter(p => p === 2).length;
  const inProgressSteps = stepProgress.filter(p => p === 1).length;
  const overallProgress = totalSteps > 0 ? Math.round((completedSteps / totalSteps) * 100) : 0;

  // Add state for AI suggestion
  const [aiSuggestion, setAiSuggestion] = useState<SmartSuggestion | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Replace fetchAISuggestion with fetchAIContent that updates both roadmap and smart suggestions
  const fetchAIContent = async (career: string, difficulty: string) => {
    setAiLoading(true);
    setAiError(null);
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ career, difficulty }),
      });
      const data = await res.json();
      // Update roadmap steps from AI
      if (data.roadmapSteps) {
        // Map link to url for all resources
        const mappedSteps = data.roadmapSteps.map((step: any, idx: number) => ({
          ...step,
          resources: (step.resources || []).map((r: any, i: number) => ({
            ...r,
            url: r.url || r.link,
          })),
        }));
        localStorage.setItem('roadmap_resources', JSON.stringify(mappedSteps));
        setChatSteps(mappedSteps);
        setRoadmapData([
          {
            id: "phase-1",
            name: `${career} Roadmap`,
            description: `Personalized roadmap for ${career}`,
            color: "bg-blue-100 text-blue-800 border-blue-200",
            level: difficulty as any,
            steps: mappedSteps,
          },
        ]);
      }
      setAiSuggestion(data.suggestion || null);
    } catch (e) {
      setAiError("Failed to fetch suggestions.");
    } finally {
      setAiLoading(false);
    }
  };

  useEffect(() => {
    const config = localStorage.getItem("userRoadmapConfig")
    const careerGoal = localStorage.getItem("careerGoal")
    const userData = localStorage.getItem("user")
    const user = userData ? JSON.parse(userData) : null

    if (!config) {
      if (!careerGoal) {
        toast({
          title: "Please enter a career path first",
          description: "You need to select a career goal to access your roadmap.",
          variant: "destructive",
        })
      router.push("/")
      return
      } else {
        setShowDifficultySelector(true)
        return
      }
    }
    const parsedConfig = JSON.parse(config)
    setRoadmapConfig(parsedConfig)

    // --- ChatGPT steps integration ---
    if (chatSteps.length > 0 && chatSteps[0].title && chatSteps[0].bullets && chatSteps[0].resources) {
      // Convert ChatGPT steps to our Phase/Step structure (1 phase, 3 steps)
      const difficultyLabel = parsedConfig.difficulty || "";
      const phase = {
        id: "phase-1",
        name: `${careerGoal} Roadmap`,
        description: `Personalized roadmap for ${careerGoal}`,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        level: difficultyLabel,
        steps: chatSteps.map((step: any, idx: number) => ({
          id: `step-${idx + 1}`,
          title: step.title,
          description: "",
          estimatedTime: "",
          difficulty: difficultyLabel,
          status: "not-started" as const,
          progress: 0,
          weekNumber: idx + 1,
          skills: [],
          resources: (step.resources || []).map((r: any, i: number) => ({
            id: `step-${idx + 1}-r${i}`,
            title: r.title,
            type: r.type,
            url: r.link,
            provider: r.provider || '',
            description: '',
            rating: 0,
            free: true,
          })),
          bullets: step.bullets || [],
        })),
      };
      setRoadmapData([phase]);
      return;
    }
    // --- End ChatGPT steps integration ---

    // Fallback: use static roadmap
    const data = [
      {
        id: "phase-1",
        name: `${careerGoal} Roadmap`,
        description: `Personalized roadmap for ${careerGoal}`,
        color: "bg-blue-100 text-blue-800 border-blue-200",
        level: parsedConfig.difficulty || "beginner",
        steps: [
          {
            id: "step-1",
            title: "Introduction to Software Development",
            description: "Understanding the basics of programming and software development.",
            estimatedTime: "2 weeks",
            difficulty: "easy" as "easy",
            status: "not-started" as "not-started",
            progress: 0,
            resources: [
              { id: "r1", title: "What is Programming?", url: "https://www.freecodecamp.org/news/what-is-programming-a-beginners-guide/", provider: "freeCodeCamp", type: "article" as "article", rating: 5, free: true, description: "Beginner's guide to programming." },
              { id: "r2", title: "Introduction to C Programming", url: "https://www.learn-c.org/", provider: "Learn C", type: "course" as "course", rating: 4.5, free: true, description: "Interactive C programming course." },
            ],
            skills: ["Understanding programming concepts", "Basic syntax", "Variables and data types"],
            weekNumber: 1,
            bullets: ["Learn the fundamentals of programming.", "Understand basic concepts like variables, data types, and operators."],
          },
          {
            id: "step-2",
            title: "Learn HTML, CSS, and JavaScript",
            description: "Building the foundation for web development.",
            estimatedTime: "3 weeks",
            difficulty: "easy" as "easy",
            status: "not-started" as "not-started",
            progress: 0,
            resources: [
              { id: "r3", title: "HTML for Beginners", url: "https://www.w3schools.com/html/", provider: "W3Schools", type: "article" as "article", rating: 5, free: true, description: "HTML basics for beginners." },
              { id: "r4", title: "CSS Basics", url: "https://www.freecodecamp.org/news/learn-css-basics-for-beginners/", provider: "freeCodeCamp", type: "article" as "article", rating: 4.5, free: true, description: "Learn CSS basics." },
              { id: "r5", title: "JavaScript for Beginners", url: "https://www.freecodecamp.org/news/javascript-for-beginners/", provider: "freeCodeCamp", type: "article" as "article", rating: 4.5, free: true, description: "JavaScript basics for beginners." },
            ],
            skills: ["HTML basics", "CSS basics", "JavaScript basics"],
            weekNumber: 2,
            bullets: ["Learn HTML to structure web pages.", "Understand CSS for styling.", "Learn JavaScript for interactivity."],
          },
          {
            id: "step-3",
            title: "Introduction to React",
            description: "Building your first React application.",
            estimatedTime: "2 weeks",
            difficulty: "easy" as "easy",
            status: "not-started" as "not-started",
            progress: 0,
            resources: [
              { id: "r6", title: "React for Beginners", url: "https://www.freecodecamp.org/news/react-for-beginners/", provider: "freeCodeCamp", type: "article" as "article", rating: 4.5, free: true, description: "React basics for beginners." },
              { id: "r7", title: "React Hooks", url: "https://www.freecodecamp.org/news/react-hooks-for-beginners/", provider: "freeCodeCamp", type: "article" as "article", rating: 4.5, free: true, description: "Introduction to React Hooks." },
            ],
            skills: ["React basics", "React Hooks", "Component structure"],
            weekNumber: 3,
            bullets: ["Learn React basics.", "Understand React Hooks.", "Build a simple React application."],
          },
        ],
      },
    ];
    setRoadmapData(data);
  }, [router, toast])

  // Save progress to backend when user is logged in and roadmapData changes
  useEffect(() => {
    const userData = localStorage.getItem("user")
    const user = userData ? JSON.parse(userData) : null
    if (user && roadmapConfig && roadmapData.length > 0) {
      fetch("http://localhost:4001/api/progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user.id,
          roadmapConfig,
          roadmapData,
        }),
      })
    }
  }, [roadmapConfig, roadmapData])

  const updateStepProgress = (phaseId: string, stepId: string, progress: number, status: Step["status"]) => {
    const updatedData = roadmapData.map((phase) =>
      phase.id === phaseId
        ? {
            ...phase,
            steps: phase.steps.map((step) => (step.id === stepId ? { ...step, progress, status } : step)),
          }
        : phase,
    )

    setRoadmapData(updatedData)

    // Save to localStorage
    if (roadmapConfig) {
      localStorage.setItem(
        `roadmap_${roadmapConfig.userId}_${roadmapConfig.careerGoal}_${roadmapConfig.difficulty}`,
        JSON.stringify(updatedData),
      )
    }

    toast({
      title: "Progress updated! 🎉",
      description: "Great job on your learning journey!",
    })
  }

  const toggleSaveResource = (resourceId: string) => {
    const newSaved = savedResources.includes(resourceId)
      ? savedResources.filter((id) => id !== resourceId)
      : [...savedResources, resourceId]

    setSavedResources(newSaved)
    localStorage.setItem("savedResources", JSON.stringify(newSaved))
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

  if (!roadmapConfig) return null

  const careerGoal = localStorage.getItem("careerGoal")
  if (!careerGoal) {
    localStorage.removeItem('roadmap_resources');
    setRoadmapData([]); // Clear any roadmap data in state
    return (
      <div className="min-h-screen flex items-center justify-center bg-transparent">
        <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
          <h2 className="text-2xl font-bold mb-4 text-red-600">Please enter a career path</h2>
          <p className="text-muted-foreground mb-6">You need to select a career goal to access your roadmap.</p>
          <Button onClick={() => window.location.href = '/'}>Go to Home</Button>
        </div>
      </div>
    );
  }

  const sendChatMessage = async () => {
    if (!chatInput.trim()) return;
    const userMessage = chatInput.trim();
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setChatInput("");
    setChatLoading(true);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: userMessage }),
      });
      const data = await res.json();
      setChatHistory(prev => [...prev, { role: 'assistant', content: data.message }]);
    } catch (e) {
      setChatHistory(prev => [...prev, { role: 'assistant', content: "Error: Failed to get response from AI." }]);
    } finally {
      setChatLoading(false);
      setTimeout(() => chatEndRef.current?.scrollIntoView({ behavior: 'smooth' }), 100);
    }
  };

  return (
    <div className="min-h-screen bg-transparent">
      <Aurora
        colorStops={["#3366FF", "#33FFDD", "#7733FF"]}
        blend={0.5}
        amplitude={1.0}
        speed={0.5}
      />
      <div style={{ position: 'relative', zIndex: 10 }}>
      <TopNavigation />
      <FloatingAssistant />

      <div className="pt-20 pb-16 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Your <span className="gradient-text">{roadmapConfig.careerGoal}</span> Roadmap
                </h1>
                <p className="text-muted-foreground">
                  {roadmapConfig.difficulty.charAt(0).toUpperCase() + roadmapConfig.difficulty.slice(1)} Level •{" "}
                  {totalSteps} Steps • Personalized for You
                </p>
              </div>
                <Button 
                  variant="outline" 
                  className="flex items-center space-x-2 bg-transparent"
                  onClick={() => setShowDifficultySelector(true)}
                >
                <Edit className="w-4 h-4" />
                <span>Edit Level</span>
              </Button>
            </div>

            {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Card className="gradient-border">
                <div className="gradient-border-content">
                  <CardContent className="p-6 text-center">
                      <div className="flex items-center justify-center mb-2">
                        <Gauge className="w-6 h-6 text-cyan-400 mr-2" />
                        <span className="text-3xl font-bold gradient-text">{overallProgress}%</span>
                      </div>
                    <p className="text-sm text-muted-foreground">Overall Progress</p>
                  </CardContent>
                </div>
              </Card>
              <Card className="gradient-border">
                <div className="gradient-border-content">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                        <Check className="w-6 h-6 text-green-500 mr-2" />
                      <span className="text-3xl font-bold text-green-500">{completedSteps}</span>
                      <span className="text-muted-foreground">/{totalSteps}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Skills Completed</p>
                  </CardContent>
                </div>
              </Card>
              <Card className="gradient-border">
                <div className="gradient-border-content">
                  <CardContent className="p-6 text-center">
                    <div className="flex items-center justify-center mb-2">
                      <Clock className="w-6 h-6 text-blue-500 mr-2" />
                      <span className="text-3xl font-bold text-blue-500">{inProgressSteps}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">In Progress</p>
                  </CardContent>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Navigation Tabs */}
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 mb-8">
              <TabsTrigger value="roadmap" className="flex items-center space-x-2">
                <Target className="w-4 h-4" />
                <span className="hidden sm:inline">Roadmap</span>
              </TabsTrigger>
              <TabsTrigger value="ai" className="flex items-center space-x-2">
                <Atom className="w-4 h-4" />
                <span className="hidden sm:inline">AI</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="roadmap" className="space-y-8">
              <div className="grid lg:grid-cols-4 gap-8">
                {/* Left: Main Roadmap Content */}
                <div className="lg:col-span-3">
                  {/* Buttons Row */}
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold gradient-text">Your Learning Path</h2>
                    <div className="flex space-x-2">
                      {/* Flowchart button removed as requested */}
                    </div>
                  </div>
                  {/* Add margin below buttons for spacing */}
                  <div style={{ marginBottom: '24px' }} />
                  {/* Learning Path Visualization */}
                  <Card className="gradient-border">
                    <div className="gradient-border-content">
                      <CardHeader>
                        <CardTitle className="gradient-text">Learning Path Visualization</CardTitle>
                        <CardDescription>Interactive roadmap of your learning journey</CardDescription>
                      </CardHeader>
                      <CardContent className="p-6">
                        {/* Render the ChatGPT roadmap steps as vertical cards with progress bars */}
                        {chatSteps.length > 0 ? (
                          <div className="flex flex-col gap-6">
                            {chatSteps.map((step: { title: string; bullets: string[]; resources: any[] }, idx: number) => (
                              <div key={idx} className={`relative p-6 rounded-lg bg-muted/50 border border-border flex flex-col h-full transition-shadow`}> 
                                <div className="flex items-center mb-2">
                                  <div
                                    className={`w-32 h-4 rounded-full cursor-pointer mr-4 border ${stepProgress[idx] === 2 ? 'bg-green-400 border-green-500' : stepProgress[idx] === 1 ? 'bg-blue-400 border-blue-500' : 'bg-gray-300 border-gray-400'}`}
                                    onClick={() => handleStepProgressClick(idx)}
                                    title={stepProgress[idx] === 2 ? 'Completed' : stepProgress[idx] === 1 ? 'In Progress' : 'Not Started'}
                                  >
                                    <div className={`h-4 rounded-full transition-all duration-300 ${stepProgress[idx] === 2 ? 'w-full bg-green-600' : stepProgress[idx] === 1 ? 'w-1/2 bg-blue-600' : 'w-1/6 bg-gray-400'}`}></div>
                                          </div>
                                  <h3 className="text-xl font-bold mb-0 flex-1">{step.title}</h3>
                                  <span className="ml-2 text-xs text-muted-foreground">{stepProgress[idx] === 2 ? 'Completed' : stepProgress[idx] === 1 ? 'In Progress' : 'Not Started'}</span>
                                        </div>
                                {step.bullets && (
                                  <ul className="list-disc list-inside mb-4 text-base text-muted-foreground">
                                    {step.bullets.map((bullet: string, i: number) => (
                                      <li key={i}>{bullet}</li>
                                    ))}
                                  </ul>
                                )}
                                {step.resources && step.resources.length > 0 && (
                                  <div className="space-y-2 mt-auto">
                                    <div className="font-semibold text-sm mb-1 text-muted-foreground">Resources</div>
                                    <ul className="space-y-1">
                                      {step.resources.map((resource: any, i: number) => (
                                        <li key={i}>
                                          <a
                                            href={resource.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:underline text-base flex items-center gap-2"
                                          >
                                            <span className="font-medium">{resource.title}</span>
                                            <span className="text-xs bg-gray-800 text-gray-200 rounded px-2 py-0.5 ml-2">{resource.type}</span>
                                          </a>
                                        </li>
                                      ))}
                                    </ul>
                                        </div>
                                )}
                            </div>
                          ))}
                        </div>
                        ) :
                          <div className="text-muted-foreground text-center py-8 text-lg animate-pulse">Generating roadmap...</div>
                        }
                      </CardContent>
                    </div>
                  </Card>
                </div>
                {/* Smart Suggestions Sidebar Area */}
                <div className="space-y-6">
                  {/* Smart Suggestions Button always visible above the sidebar, aligned left */}
                  <div className="mb-6">
                    <Button
                      variant={showSmartSuggestions ? "default" : "outline"}
                      size="sm"
                      onClick={() => {
                        if (!showSmartSuggestions && !aiSuggestion) fetchAIContent(roadmapConfig.careerGoal, roadmapConfig.difficulty);
                        setShowSmartSuggestions(v => !v);
                      }}
                      className="gradient-bg"
                    >
                      Smart Suggestions
                    </Button>
                  </div>
                  {/* Smart Suggestions Card - only show if toggled on */}
                  {showSmartSuggestions && (
                  <Card className="gradient-border">
                    <div className="gradient-border-content">
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <Sparkles className="w-5 h-5 text-purple-500" />
                              <CardTitle className="gradient-text text-xl">Smart Suggestions</CardTitle>
                          </div>
                            <Button variant="ghost" size="sm" onClick={() => fetchAIContent(roadmapConfig.careerGoal, roadmapConfig.difficulty)} disabled={aiLoading} aria-label="Regenerate Smart Suggestions">
                            <TrendingUp className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-4">
                          {aiError && <div className="text-red-500 mb-2">{aiError}</div>}
                          {aiLoading && <div className="text-muted-foreground">Generating suggestions...</div>}
                          {aiSuggestion && (
                        <div className="space-y-3">
                              {/* Skill Suggestion */}
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <Target className="w-4 h-4 text-blue-500" />
                              <span className="text-sm font-medium">skill</span>
                                  <Badge className="bg-green-500 text-white text-xs">{aiSuggestion.skill.match}</Badge>
                            </div>
                                <h4 className="font-semibold text-blue-500 mb-1">{aiSuggestion.skill.name}</h4>
                                <p className="text-xs text-muted-foreground mb-2">{aiSuggestion.skill.description}</p>
                                <p className="text-xs text-muted-foreground">{aiSuggestion.skill.context}</p>
                            <div className="flex flex-wrap gap-1 mt-2">
                                  {aiSuggestion.skill.tags.map((tag, i) => (
                                    <Badge key={i} variant="outline" className="text-xs">#{tag}</Badge>
                                  ))}
                            </div>
                          </div>
                              {/* Next Recommendation */}
                          <div className="p-3 bg-muted/50 rounded-lg">
                            <div className="flex items-center space-x-2 mb-2">
                              <BookOpen className="w-4 h-4 text-green-500" />
                              <span className="text-sm font-medium">Next Recommended</span>
                            </div>
                                <h4 className="font-semibold text-green-500 mb-1">{aiSuggestion.next.name}</h4>
                                <p className="text-xs text-muted-foreground mb-2">{aiSuggestion.next.description}</p>
                                <p className="text-xs text-muted-foreground">{aiSuggestion.next.context}</p>
                          </div>
                        </div>
                          )}
                      </CardContent>
                    </div>
                  </Card>
                  )}
                </div>
              </div>
            </TabsContent>

            <TabsContent value="ai" className="space-y-6">
              <Card className="gradient-border">
                <div className="gradient-border-content">
                  <CardHeader>
                    <CardTitle className="gradient-text">AI Chat</CardTitle>
                    <CardDescription>Chat directly with the AI assistant about your learning journey, resources, or anything else!</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col h-[400px] max-h-[60vh] overflow-y-auto bg-muted/40 rounded-lg p-4 mb-4">
                      {chatHistory.length === 0 && (
                        <div className="text-muted-foreground text-center my-auto">Start the conversation by typing a message below.</div>
                      )}
                      {chatHistory.map((msg, idx) => (
                        <div key={idx} className={`mb-2 flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                          <div className={`px-4 py-2 rounded-lg max-w-[70%] ${msg.role === 'user' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-900'}`}>{msg.content}</div>
                        </div>
                      ))}
                      <div ref={chatEndRef} />
                    </div>
                    <form className="flex gap-2" onSubmit={e => { e.preventDefault(); sendChatMessage(); }}>
                      <input
                        type="text"
                        className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring"
                        placeholder="Type your message..."
                        value={chatInput}
                        onChange={e => setChatInput(e.target.value)}
                        disabled={chatLoading}
                      />
                      <Button type="submit" disabled={chatLoading || !chatInput.trim()}>Send</Button>
                    </form>
                    {chatLoading && <div className="text-muted-foreground mt-2">AI is thinking...</div>}
                  </CardContent>
                </div>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      </div>
      {/* Difficulty Selector Modal */}
      {roadmapConfig && (
        <DifficultySelector
          isOpen={showDifficultySelector}
          onClose={() => setShowDifficultySelector(false)}
          onSelect={(difficulty, careerGoal) => {
            console.log('Edit Level selected:', { difficulty, careerGoal });
            localStorage.setItem(
              "userRoadmapConfig",
              JSON.stringify({
                ...roadmapConfig,
                difficulty,
              })
            );
            setRoadmapConfig((prev: any) => ({ ...prev, difficulty }));
            fetchAIContent(roadmapConfig.careerGoal, difficulty);
            setShowDifficultySelector(false);
            toast({
              title: "Path Updated!",
              description: `Your learning path has been updated to ${difficulty} level.`,
            });
          }}
          careerGoal={roadmapConfig.careerGoal}
        />
      )}
    </div>
  )
}
