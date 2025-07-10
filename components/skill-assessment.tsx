"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { CheckCircle, XCircle, Brain, Award, RotateCcw, ArrowRight, Lightbulb } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface Question {
  id: string
  question: string
  options: string[]
  correctAnswer: number
  explanation: string
  difficulty: "beginner" | "intermediate" | "advanced"
}

interface Assessment {
  id: string
  title: string
  description: string
  skill: string
  questions: Question[]
  passingScore: number
}

const mockAssessments: Assessment[] = [
  {
    id: "color-theory",
    title: "Color Theory Fundamentals",
    description: "Test your understanding of basic color theory principles",
    skill: "Color Theory",
    passingScore: 70,
    questions: [
      {
        id: "1",
        question: "Which colors are considered primary colors in traditional color theory?",
        options: ["Red, Blue, Yellow", "Red, Green, Blue", "Cyan, Magenta, Yellow", "Orange, Purple, Green"],
        correctAnswer: 0,
        explanation:
          "In traditional color theory, red, blue, and yellow are considered primary colors because they cannot be created by mixing other colors.",
        difficulty: "beginner",
      },
      {
        id: "2",
        question: "What is a complementary color scheme?",
        options: [
          "Colors that are next to each other on the color wheel",
          "Colors that are directly opposite each other on the color wheel",
          "Three colors equally spaced on the color wheel",
          "Different shades of the same color",
        ],
        correctAnswer: 1,
        explanation:
          "Complementary colors are directly opposite each other on the color wheel and create high contrast when used together.",
        difficulty: "intermediate",
      },
      {
        id: "3",
        question: "What does 'color temperature' refer to?",
        options: [
          "How bright or dark a color is",
          "How pure or saturated a color is",
          "Whether a color appears warm or cool",
          "The physical temperature of the color",
        ],
        correctAnswer: 2,
        explanation:
          "Color temperature refers to whether colors appear warm (reds, oranges, yellows) or cool (blues, greens, purples).",
        difficulty: "intermediate",
      },
    ],
  },
]

export function SkillAssessment() {
  const [selectedAssessment, setSelectedAssessment] = useState<Assessment | null>(null)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string>("")
  const [answers, setAnswers] = useState<number[]>([])
  const [showExplanation, setShowExplanation] = useState(false)
  const [assessmentComplete, setAssessmentComplete] = useState(false)
  const [score, setScore] = useState(0)
  const { toast } = useToast()

  const startAssessment = (assessment: Assessment) => {
    setSelectedAssessment(assessment)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setSelectedAnswer("")
    setShowExplanation(false)
    setAssessmentComplete(false)
    setScore(0)
  }

  const submitAnswer = () => {
    if (!selectedAnswer || !selectedAssessment) return

    const answerIndex = Number.parseInt(selectedAnswer)
    const newAnswers = [...answers, answerIndex]
    setAnswers(newAnswers)
    setShowExplanation(true)

    // Calculate score if this is the last question
    if (currentQuestionIndex === selectedAssessment.questions.length - 1) {
      const correctAnswers = newAnswers.reduce((count, answer, index) => {
        return count + (answer === selectedAssessment.questions[index].correctAnswer ? 1 : 0)
      }, 0)
      const finalScore = Math.round((correctAnswers / selectedAssessment.questions.length) * 100)
      setScore(finalScore)

      setTimeout(() => {
        setAssessmentComplete(true)
        toast({
          title: finalScore >= selectedAssessment.passingScore ? "Assessment Passed! 🎉" : "Assessment Complete",
          description: `You scored ${finalScore}%. ${finalScore >= selectedAssessment.passingScore ? "Great job!" : "Keep studying and try again!"}`,
        })
      }, 2000)
    }
  }

  const nextQuestion = () => {
    if (!selectedAssessment) return

    if (currentQuestionIndex < selectedAssessment.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1)
      setSelectedAnswer("")
      setShowExplanation(false)
    }
  }

  const resetAssessment = () => {
    setSelectedAssessment(null)
    setCurrentQuestionIndex(0)
    setAnswers([])
    setSelectedAnswer("")
    setShowExplanation(false)
    setAssessmentComplete(false)
    setScore(0)
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

  if (!selectedAssessment) {
    return (
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold gradient-text">Skill Assessments</h2>
          <p className="text-muted-foreground">Test your knowledge and track your progress</p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {mockAssessments.map((assessment, index) => (
            <motion.div
              key={assessment.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card className="gradient-border hover:shadow-lg transition-shadow cursor-pointer">
                <div className="gradient-border-content">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-2">
                          <Brain className="w-5 h-5 text-blue-500" />
                          <span>{assessment.title}</span>
                        </CardTitle>
                        <CardDescription className="mt-2">{assessment.description}</CardDescription>
                      </div>
                      <Badge className="gradient-bg-soft text-primary">{assessment.skill}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <span>{assessment.questions.length} questions</span>
                      <span>Passing score: {assessment.passingScore}%</span>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {assessment.questions.map((q) => (
                        <Badge key={q.id} className={getDifficultyColor(q.difficulty)}>
                          {q.difficulty}
                        </Badge>
                      ))}
                    </div>

                    <Button onClick={() => startAssessment(assessment)} className="w-full gradient-bg">
                      <Brain className="w-4 h-4 mr-2" />
                      Start Assessment
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    )
  }

  if (assessmentComplete) {
    return (
      <div className="space-y-6">
        <Card className="gradient-border">
          <div className="gradient-border-content">
            <CardContent className="p-8 text-center">
              <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", stiffness: 200 }}>
                {score >= selectedAssessment.passingScore ? (
                  <Award className="w-16 h-16 text-yellow-500 mx-auto mb-4" />
                ) : (
                  <Brain className="w-16 h-16 text-blue-500 mx-auto mb-4" />
                )}
              </motion.div>

              <h2 className="text-2xl font-bold mb-2">
                {score >= selectedAssessment.passingScore ? "Congratulations!" : "Assessment Complete"}
              </h2>

              <div className="text-4xl font-bold gradient-text mb-4">{score}%</div>

              <p className="text-muted-foreground mb-6">
                You answered{" "}
                {answers.reduce(
                  (count, answer, index) =>
                    count + (answer === selectedAssessment.questions[index].correctAnswer ? 1 : 0),
                  0,
                )}{" "}
                out of {selectedAssessment.questions.length} questions correctly.
              </p>

              {score >= selectedAssessment.passingScore ? (
                <Badge className="bg-green-500 text-white mb-6">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Passed!
                </Badge>
              ) : (
                <Badge className="bg-yellow-500 text-white mb-6">
                  <XCircle className="w-4 h-4 mr-1" />
                  Keep Studying
                </Badge>
              )}

              <div className="flex justify-center space-x-4">
                <Button onClick={resetAssessment} variant="outline">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Try Another Assessment
                </Button>
                <Button onClick={() => startAssessment(selectedAssessment)} className="gradient-bg">
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Retake Assessment
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Detailed Results */}
        <Card className="gradient-border">
          <div className="gradient-border-content">
            <CardHeader>
              <CardTitle>Detailed Results</CardTitle>
              <CardDescription>Review your answers and explanations</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedAssessment.questions.map((question, index) => {
                const userAnswer = answers[index]
                const isCorrect = userAnswer === question.correctAnswer

                return (
                  <div key={question.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <div className="flex items-center space-x-2">
                        <Badge className={getDifficultyColor(question.difficulty)}>{question.difficulty}</Badge>
                        {isCorrect ? (
                          <CheckCircle className="w-5 h-5 text-green-500" />
                        ) : (
                          <XCircle className="w-5 h-5 text-red-500" />
                        )}
                      </div>
                    </div>

                    <p className="mb-3">{question.question}</p>

                    <div className="space-y-2 mb-3">
                      {question.options.map((option, optionIndex) => (
                        <div
                          key={optionIndex}
                          className={`p-2 rounded text-sm ${
                            optionIndex === question.correctAnswer
                              ? "bg-green-100 text-green-800 border border-green-300"
                              : optionIndex === userAnswer && !isCorrect
                                ? "bg-red-100 text-red-800 border border-red-300"
                                : "bg-gray-50"
                          }`}
                        >
                          {option}
                          {optionIndex === question.correctAnswer && (
                            <span className="ml-2 text-green-600">✓ Correct</span>
                          )}
                          {optionIndex === userAnswer && !isCorrect && (
                            <span className="ml-2 text-red-600">✗ Your answer</span>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="bg-blue-50 p-3 rounded-lg">
                      <div className="flex items-start space-x-2">
                        <Lightbulb className="w-4 h-4 text-blue-500 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-blue-800 mb-1">Explanation</p>
                          <p className="text-sm text-blue-700">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </div>
        </Card>
      </div>
    )
  }

  const currentQuestion = selectedAssessment.questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / selectedAssessment.questions.length) * 100

  return (
    <div className="space-y-6">
      {/* Progress Header */}
      <Card className="gradient-border">
        <div className="gradient-border-content">
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xl font-bold">{selectedAssessment.title}</h2>
              <Badge className={getDifficultyColor(currentQuestion.difficulty)}>{currentQuestion.difficulty}</Badge>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-muted-foreground">
                <span>
                  Question {currentQuestionIndex + 1} of {selectedAssessment.questions.length}
                </span>
                <span>{Math.round(progress)}% complete</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Question Card */}
      <Card className="gradient-border">
        <div className="gradient-border-content">
          <CardHeader>
            <CardTitle className="text-lg">{currentQuestion.question}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <RadioGroup value={selectedAnswer} onValueChange={setSelectedAnswer}>
              {currentQuestion.options.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                  <Label htmlFor={`option-${index}`} className="flex-1 cursor-pointer">
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>

            <AnimatePresence>
              {showExplanation && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="border-t pt-4"
                >
                  <div
                    className={`p-4 rounded-lg ${
                      Number.parseInt(selectedAnswer) === currentQuestion.correctAnswer
                        ? "bg-green-50 border border-green-200"
                        : "bg-red-50 border border-red-200"
                    }`}
                  >
                    <div className="flex items-start space-x-2">
                      {Number.parseInt(selectedAnswer) === currentQuestion.correctAnswer ? (
                        <CheckCircle className="w-5 h-5 text-green-500 mt-0.5" />
                      ) : (
                        <XCircle className="w-5 h-5 text-red-500 mt-0.5" />
                      )}
                      <div>
                        <p
                          className={`font-medium mb-2 ${
                            Number.parseInt(selectedAnswer) === currentQuestion.correctAnswer
                              ? "text-green-800"
                              : "text-red-800"
                          }`}
                        >
                          {Number.parseInt(selectedAnswer) === currentQuestion.correctAnswer
                            ? "Correct!"
                            : `Incorrect. The correct answer is: ${currentQuestion.options[currentQuestion.correctAnswer]}`}
                        </p>
                        <p
                          className={`text-sm ${
                            Number.parseInt(selectedAnswer) === currentQuestion.correctAnswer
                              ? "text-green-700"
                              : "text-red-700"
                          }`}
                        >
                          {currentQuestion.explanation}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex justify-between">
              <Button onClick={resetAssessment} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Exit Assessment
              </Button>

              {!showExplanation ? (
                <Button onClick={submitAnswer} disabled={!selectedAnswer} className="gradient-bg">
                  Submit Answer
                </Button>
              ) : (
                <Button
                  onClick={nextQuestion}
                  className="gradient-bg"
                  disabled={currentQuestionIndex === selectedAssessment.questions.length - 1}
                >
                  {currentQuestionIndex === selectedAssessment.questions.length - 1 ? (
                    "View Results"
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </>
                  )}
                </Button>
              )}
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  )
}
