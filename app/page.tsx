"use client"

import { useState, useEffect, useRef } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { TopNavigation } from "@/components/top-navigation"
import { FloatingAssistant } from "@/components/floating-assistant"
import { DifficultySelector } from "@/components/difficulty-selector"
import { Sparkles, ArrowRight, Target, BookOpen, Users, Star, Map, Atom } from "lucide-react"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import Image from "next/image"
import Orb from "@/components/Orb";
import Aurora from "@/components/Aurora";

const careerExamples = [
  "Data Scientist",
  "Web Developer",
  "UX Designer",
  "Digital Marketer",
  "Product Manager",
  "Software Engineer",
  "Graphic Designer",
  "Content Writer",
  "Business Analyst",
  "Cybersecurity Specialist",
]

const features = [
  {
    icon: Target,
    title: "Personalized Roadmaps",
    description: "Get a step-by-step learning path tailored to your dream career, no matter what field you choose.",
  },
  {
    icon: BookOpen,
    title: "Curated Resources",
    description: "Access handpicked videos, courses, and articles from trusted sources to accelerate your learning.",
  },
  {
    icon: Atom,
    title: "AI Chat Assistant",
    description: "Chat directly with our AI assistant to get instant answers, learning tips, and personalized guidance anytime.",
  },
]

const testimonials = [
  {
    name: "Sarah Chen",
    career: "UX Designer",
    content: "SkillMapper helped me transition from marketing to UX design in just 6 months!",
    rating: 5,
  },
  {
    name: "Mike Rodriguez",
    career: "Chef",
    content: "The culinary roadmap was perfect - from knife skills to restaurant management.",
    rating: 5,
  },
  {
    name: "Emma Wilson",
    career: "Teacher",
    content: "Clear, actionable steps that made my teaching certification journey so much easier.",
    rating: 5,
  },
]

export default function HomePage() {
  const [careerGoal, setCareerGoal] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [showDifficultySelector, setShowDifficultySelector] = useState(false)
  const [selectedDifficulty, setSelectedDifficulty] = useState<"beginner" | "intermediate" | "advanced">("beginner")
  const router = useRouter()
  const { toast } = useToast()
  const mainContentRef = useRef<HTMLDivElement>(null)
  const [showSplash, setShowSplash] = useState(false)
  const [splashAnimating, setSplashAnimating] = useState(false)

  useEffect(() => {
    // Show splash only on first open in this session
    if (!sessionStorage.getItem('splashShown')) {
      setShowSplash(true);
      sessionStorage.setItem('splashShown', 'true');
    } else {
      setShowSplash(false);
    }
  }, [])

  // Remove scroll-to-hide logic; splash is only shown once per session

  const handleContinue = () => {
    setSplashAnimating(true)
    setTimeout(() => {
      setShowSplash(false)
      if (mainContentRef.current) {
        window.scrollTo({
          top: mainContentRef.current.offsetTop,
          behavior: 'smooth',
        });
      }
    }, 700) // Match animation duration
  }

  const handleGenerateRoadmap = async () => {
    if (!careerGoal.trim()) {
      toast({
        title: "Please enter a career goal",
        description: "Tell us what you want to become so we can create your personalized roadmap.",
        variant: "destructive",
      })
      return
    }

    setIsGenerating(true)

    // Save the career goal
    localStorage.setItem("careerGoal", careerGoal)

    // Fetch resources from ChatGPT
    let resources = [];
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career: careerGoal, difficulty: selectedDifficulty || 'beginner' }),
      });
      const data = await res.json();
      resources = data.resources || [];
    } catch (e) {
      resources = [];
    }

    // Store resources in localStorage for use in roadmap page
    localStorage.setItem('roadmap_resources', JSON.stringify(resources));

    setIsGenerating(false)
    setShowDifficultySelector(true)
  }

  const handleDifficultySelect = async (difficulty: "beginner" | "intermediate" | "advanced", goal: string) => {
    setSelectedDifficulty(difficulty)
    // Save user's selection
    localStorage.setItem(
      "userRoadmapConfig",
      JSON.stringify({
        careerGoal: goal,
        difficulty,
        userId: null, // No longer saving user ID
        createdAt: new Date().toISOString(),
      }),
    )

    setShowDifficultySelector(false)

    // Fetch resources from ChatGPT using the latest user input
    let steps = [];
    try {
      const res = await fetch('/api/resources', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ career: goal, difficulty }),
      });
      const data = await res.json();
      steps = data.steps || [];
    } catch (e) {
      steps = [];
    }
    localStorage.setItem('roadmap_resources', JSON.stringify(steps));

    toast({
      title: "Roadmap Generated! 🎉",
      description: `Your ${difficulty} level ${goal} roadmap is ready!`,
    })

    // Redirect to roadmap page
    router.push("/roadmap")
  }

  const handleExampleClick = (example: string) => {
    setCareerGoal(example)
  }

  return (
    <div className="min-h-screen bg-transparent">
      {showSplash && (
        <div className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-gradient-to-br from-blue-400 via-purple-400 to-indigo-500 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900 transition-opacity duration-700${splashAnimating ? ' splash-animate-out' : ''}`}>
          {/* Aurora animated background, always behind splash content */}
          <Aurora
            colorStops={["#3366FF", "#33FFDD", "#7733FF"]}
            blend={0.5}
            amplitude={1.0}
            speed={0.5}
          />
          <div className="flex flex-col items-center" style={{ width: '100%', height: '600px', position: 'relative', zIndex: 10 }}>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Orb
                hoverIntensity={0.5}
                rotateOnHover={true}
                hue={0}
                forceHoverState={false}
              />
            </div>
            <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', pointerEvents: 'none' }}>
              <div className="flex flex-col items-center justify-center">
                <h1 className="text-4xl md:text-5xl font-extrabold gradient-text tracking-tight mb-4 drop-shadow-lg">SkillMapper</h1>
                <p className="text-lg md:text-xl text-white/80 mb-12 max-w-xl text-center drop-shadow">Your Path to Any Career</p>
                <button
                  onClick={handleContinue}
                  className="mt-8 animate-bounce bg-white/20 hover:bg-white/30 text-white rounded-full p-4 shadow-lg transition"
                  aria-label="Scroll to main content"
                  style={{ zIndex: 30, pointerEvents: 'auto' }}
                >
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <span className="mt-4 text-white/70 text-sm" style={{ zIndex: 30, pointerEvents: 'auto' }}>Click to continue</span>
              </div>
            </div>
          </div>
        </div>
      )}
      <div style={{ opacity: showSplash ? 0.2 : 1, pointerEvents: showSplash ? "none" : "auto", transition: "opacity 0.7s" }}>
        <TopNavigation />
        <FloatingAssistant />
        {/* Main Content */}
        <div id="main" ref={mainContentRef} />
        {/* Hero Section */}
        <section className="pt-24 pb-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
              <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6 leading-tight">
                Map Your Path to <span className="gradient-text">Any Career</span>
              </h1>
              <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto leading-relaxed light:text-black">
                Get a personalized learning roadmap for your dream career. Whether you want to become a chef, teacher,
                designer, or entrepreneur - we'll show you exactly what to learn and when.
              </p>
            </motion.div>

            {/* Career Goal Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="max-w-2xl mx-auto"
            >
              <Card className="border-0 shadow-xl bg-card/50 backdrop-blur-sm">
                <CardContent className="p-8">
                  <div className="space-y-6">
                    <div>
                      <label htmlFor="career-goal" className="block text-lg font-semibold text-foreground mb-3">
                        What do you want to become?
                      </label>
                      <div className="relative">
                        <Input
                          id="career-goal"
                          type="text"
                          placeholder="e.g., Data Scientist, Web Developer, UX Designer..."
                          value={careerGoal}
                          onChange={(e) => setCareerGoal(e.target.value)}
                          className="text-lg py-4 px-6 border-2 focus:border-primary rounded-xl"
                          onKeyPress={(e) => e.key === "Enter" && handleGenerateRoadmap()}
                        />
                        <Sparkles className="absolute right-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-primary" />
                      </div>
                    </div>

                    <Button
                      onClick={handleGenerateRoadmap}
                      disabled={isGenerating}
                      className="w-full py-4 text-lg font-semibold gradient-bg hover:opacity-90 transition-opacity rounded-xl shadow-lg"
                    >
                      {isGenerating ? (
                        <>
                          <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-3" />
                          Generating Your Roadmap...
                        </>
                      ) : (
                        <>
                          Generate My Roadmap
                          <ArrowRight className="ml-2 w-5 h-5" />
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Career Examples */}
              <div className="mt-8">
                <p className="text-muted-foreground mb-4">Or try one of these popular careers:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {careerExamples.map((career) => (
                    <Button
                      key={career}
                      variant="outline"
                      size="sm"
                      onClick={() => handleExampleClick(career)}
                      className="text-muted-foreground border-border hover:border-primary hover:text-primary transition-colors"
                    >
                      {career}
                    </Button>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 px-4 bg-card/50 backdrop-blur-sm">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Why Choose SkillMapper?</h2>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                We make career transitions simple with personalized guidance for any field
              </p>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-shadow h-full bg-card/50 backdrop-blur-sm">
                    <CardContent className="p-8 text-center">
                      <div className="w-16 h-16 gradient-bg rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                        <feature.icon className="w-8 h-8 text-white" />
                      </div>
                      <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials */}
        {/* Removed Success Stories section as requested */}

        {/* CTA Section */}
        <section className="py-16 px-4 bg-card/50 backdrop-blur-sm">
          <div className="max-w-4xl mx-auto text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="gradient-bg-soft rounded-3xl p-12"
            >
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">Ready to Start Your Journey?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join thousands of learners who are already mapping their way to their dream careers
              </p>
              <Button
                onClick={() => document.getElementById("career-goal")?.focus()}
                className="text-lg px-8 py-4 gradient-bg hover:opacity-90 transition-opacity rounded-xl shadow-lg"
              >
                Get Started Free
                <Sparkles className="ml-2 w-5 h-5" />
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-card/50 backdrop-blur-sm border-t">
          <div className="max-w-6xl mx-auto px-4 py-12">
            <div className="text-center">
              <div className="flex items-center justify-center space-x-3 mb-4">
                <div className="w-10 h-10 gradient-bg rounded-xl flex items-center justify-center">
                  <Map className="w-6 h-6 text-white -scale-x-100" />
                </div>
                <span className="text-xl font-bold gradient-text">SkillMapper</span>
              </div>
              <p className="text-muted-foreground mb-8">
                Empowering career transitions with personalized learning roadmaps for any field.
              </p>
              <div className="border-t pt-8">
                <p className="text-muted-foreground">&copy; 2025 SkillMapper. All rights reserved.</p>
              </div>
            </div>
          </div>
        </footer>

        {/* Difficulty Selector Modal */}
        <DifficultySelector
          isOpen={showDifficultySelector}
          onClose={() => setShowDifficultySelector(false)}
          onSelect={handleDifficultySelect}
          careerGoal={careerGoal}
        />
      </div>
      <style jsx global>{`
        .splash-animate-out {
          animation: splashSlideUp 0.7s cubic-bezier(0.4,0,0.2,1) forwards;
        }
        @keyframes splashSlideUp {
          0% { transform: translateY(0); opacity: 1; }
          100% { transform: translateY(-100vh); opacity: 0; }
        }
      `}</style>
    </div>
  )
}
