"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  ArrowLeft,
  Clock,
  BookOpen,
  CheckCircle,
  XCircle,
  Eye,
  Play,
  Pause,
  RotateCcw,
  FileText,
  User,
  Target,
  Award,
  AlertTriangle
} from "lucide-react"

// Types
interface Question {
  type: string
  question: string
  options?: string[]
  correct?: number
  sentence?: string
  correctAnswer?: string
  wordLimit?: number
  truefalse?: string
  headings?: string[]
  matchingOptions?: string[]
  alternativeAnswers?: string[]
}

interface Passage {
  title: string
  text: string
  questions: Question[]
}

interface TestData {
  id: string
  title: string
  type: string
  level: string
  passages: number
  questions: number
  timeLimit: number
  status: string
  attempts: number
  avgScore: number
  createdAt: string
  updatedAt?: string
  passages_data: Passage[]
}

interface ReadingTestViewerProps {
  testData: TestData
  onBack: () => void
  mode?: 'preview' | 'practice' | 'exam'
}

export default function ReadingTestViewer({ testData, onBack, mode = 'preview' }: ReadingTestViewerProps) {
  const [currentPassage, setCurrentPassage] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [timeLeft, setTimeLeft] = useState(testData.timeLimit * 60) // seconds
  const [isRunning, setIsRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [view, setView] = useState<'overview' | 'passages' | 'questions' | 'results'>('overview')

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0 && mode === 'exam') {
      const timer = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            setIsRunning(false)
            handleSubmitTest()
            return 0
          }
          return prev - 1
        })
      }, 1000)
      
      return () => clearInterval(timer)
    }
  }, [isRunning, timeLeft, mode])

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  // Start test
  const startTest = () => {
    setIsRunning(true)
    setView('passages')
  }

  // Handle answer change
  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const key = `${currentPassage}-${questionIndex}`
    setAnswers(prev => ({
      ...prev,
      [key]: answer
    }))
  }

  // Calculate score
  const calculateScore = () => {
    let correctAnswers = 0
    let totalQuestions = 0

    testData.passages_data.forEach((passage, passageIndex) => {
      passage.questions.forEach((question, questionIndex) => {
        totalQuestions++
        const key = `${passageIndex}-${questionIndex}`
        const userAnswer = answers[key]?.toLowerCase().trim()

        if (question.type === "Multiple Choice") {
          if (parseInt(userAnswer) === question.correct) {
            correctAnswers++
          }
        } else if (question.type === "Sentence Completion") {
          const correctAnswer = question.correctAnswer?.toLowerCase().trim()
          const alternativeAnswers = question.alternativeAnswers?.map(ans => ans.toLowerCase().trim()) || []
          
          if (correctAnswer === userAnswer || alternativeAnswers.includes(userAnswer)) {
            correctAnswers++
          }
        } else if (question.type === "True/False/Not Given" || question.type === "Yes/No/Not Given") {
          if (userAnswer === question.truefalse?.toLowerCase()) {
            correctAnswers++
          }
        } else if (question.type === "Short Answer Questions") {
          if (userAnswer === question.correctAnswer?.toLowerCase().trim()) {
            correctAnswers++
          }
        }
      })
    })

    return Math.round((correctAnswers / totalQuestions) * 100)
  }

  // Submit test
  const handleSubmitTest = () => {
    const finalScore = calculateScore()
    setScore(finalScore)
    setShowResults(true)
    setView('results')
    setIsRunning(false)
  }

  // Reset test
  const resetTest = () => {
    setAnswers({})
    setTimeLeft(testData.timeLimit * 60)
    setIsRunning(false)
    setShowResults(false)
    setScore(0)
    setCurrentPassage(0)
    setCurrentQuestion(0)
    setView('overview')
  }

  // Render question based on type
  const renderQuestion = (question: Question, questionIndex: number) => {
    const key = `${currentPassage}-${questionIndex}`
    const currentAnswer = answers[key] || ""

    switch(question.type) {
      case "Multiple Choice":
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.question}</p>
            <RadioGroup
              value={currentAnswer}
              onValueChange={(value) => handleAnswerChange(questionIndex, value)}
            >
              {question.options?.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={optIndex.toString()} id={`q${questionIndex}-${optIndex}`} />
                  <Label htmlFor={`q${questionIndex}-${optIndex}`} className="flex-1">
                    {String.fromCharCode(65 + optIndex)}. {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "Sentence Completion":
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.question}</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm mb-2">
                <span className="font-medium">Complete the sentence:</span>
              </p>
              <p className="font-mono text-sm bg-white p-3 rounded border">
                {question.sentence}
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                Use NO MORE THAN {question.wordLimit} WORD(S) from the passage
              </p>
            </div>
            <Input
              placeholder="Your answer..."
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
              className="w-full"
            />
          </div>
        )

      case "True/False/Not Given":
      case "Yes/No/Not Given":
        const options = question.type === "True/False/Not Given" 
          ? ["True", "False", "Not Given"]
          : ["Yes", "No", "Not Given"]
        
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.question}</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm mb-2">
                <span className="font-medium">Statement:</span>
              </p>
              <p className="italic">{question.sentence}</p>
            </div>
            <RadioGroup
              value={currentAnswer}
              onValueChange={(value) => handleAnswerChange(questionIndex, value)}
            >
              {options.map((option, optIndex) => (
                <div key={optIndex} className="flex items-center space-x-2">
                  <RadioGroupItem value={option.toLowerCase()} id={`q${questionIndex}-${optIndex}`} />
                  <Label htmlFor={`q${questionIndex}-${optIndex}`}>
                    {option}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )

      case "Short Answer Questions":
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.question}</p>
            <p className="text-sm text-muted-foreground">
              Use NO MORE THAN {question.wordLimit} WORD(S) from the passage
            </p>
            <Input
              placeholder="Your answer..."
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
              className="w-full"
            />
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.question}</p>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Bu savol turi hali qo'llab-quvvatlanmaydi: {question.type}
              </AlertDescription>
            </Alert>
          </div>
        )
    }
  }

  // Overview view
  if (view === 'overview') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Button>
        </div>

        <Card className="rounded-3xl border-2">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl mb-2">{testData.title}</CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{testData.type}</Badge>
                  <Badge variant="secondary">{testData.level}</Badge>
                  <Badge className="bg-green-100 text-green-800">{testData.status}</Badge>
                </div>
                <CardDescription>
                  IELTS Reading test - {testData.passages} ta matn, {testData.questions} ta savol
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <BookOpen className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{testData.passages}</p>
                <p className="text-sm text-muted-foreground">Matnlar</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <Target className="h-8 w-8 text-green-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-green-600">{testData.questions}</p>
                <p className="text-sm text-muted-foreground">Savollar</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-orange-600">{testData.timeLimit}</p>
                <p className="text-sm text-muted-foreground">Daqiqa</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <User className="h-8 w-8 text-purple-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-purple-600">{testData.attempts}</p>
                <p className="text-sm text-muted-foreground">Urinishlar</p>
              </div>
            </div>

            <Separator />

            <div>
              <h3 className="text-lg font-semibold mb-4">Matnlar ro'yxati:</h3>
              <div className="space-y-3">
                {testData.passages_data.map((passage, index) => (
                  <Card key={index} className="rounded-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{index + 1}. {passage.title}</h4>
                          <p className="text-sm text-muted-foreground">
                            {passage.questions.length} ta savol
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentPassage(index)
                            setView('passages')
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ko'rish
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>

            <Separator />

            <div className="flex gap-4">
              <Button
                onClick={() => setView('passages')}
                variant="outline"
                className="flex-1"
              >
                <Eye className="h-4 w-4 mr-2" />
                Matnlarni Ko'rish
              </Button>
              {mode === 'practice' && (
                <Button
                  onClick={startTest}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Mashq Qilish
                </Button>
              )}
              {mode === 'exam' && (
                <Button
                  onClick={startTest}
                  className="flex-1"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Testni Boshlash
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Passages view
  if (view === 'passages') {
    const passage = testData.passages_data[currentPassage]
    
    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setView('overview')}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
            <div>
              <h2 className="text-xl font-bold">{testData.title}</h2>
              <p className="text-sm text-muted-foreground">
                Matn {currentPassage + 1} / {testData.passages_data.length}
              </p>
            </div>
          </div>
          
          {(mode === 'practice' || mode === 'exam') && (
            <div className="flex items-center gap-4">
              {mode === 'exam' && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-lg">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="font-mono text-red-600">{formatTime(timeLeft)}</span>
                </div>
              )}
              <Button
                variant={isRunning ? "outline" : "default"}
                onClick={() => setIsRunning(!isRunning)}
              >
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Passage Text */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>{passage.title}</CardTitle>
              <CardDescription>
                {passage.questions.length} ta savol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="whitespace-pre-wrap text-sm leading-relaxed">
                  {passage.text}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Savollar</CardTitle>
              <CardDescription>
                {passage.questions.length} ta savol
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {passage.questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{question.type}</Badge>
                      <span className="text-sm text-muted-foreground">
                        Savol {index + 1}
                      </span>
                    </div>
                    {renderQuestion(question, index)}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentPassage(Math.max(0, currentPassage - 1))}
            disabled={currentPassage === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Oldingi Matn
          </Button>

          <div className="flex items-center gap-2">
            {(mode === 'practice' || mode === 'exam') && (
              <Button onClick={handleSubmitTest} variant="default">
                <CheckCircle className="h-4 w-4 mr-2" />
                Testni Yakunlash
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentPassage(Math.min(testData.passages_data.length - 1, currentPassage + 1))}
            disabled={currentPassage === testData.passages_data.length - 1}
          >
            Keyingi Matn
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        </div>
      </div>
    )
  }

  // Results view
  if (view === 'results') {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setView('overview')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Button>
        </div>

        <Card className="rounded-3xl border-2">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-2xl">Test Yakunlandi!</CardTitle>
            <CardDescription>
              Sizning natijangiz
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">
                {score}%
              </div>
              <p className="text-muted-foreground">
                {testData.questions} savoldan {Math.round((score / 100) * testData.questions)} tasi to'g'ri
              </p>
            </div>

            <Progress value={score} className="h-3" />

            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <p className="text-2xl font-bold text-blue-600">{testData.questions}</p>
                <p className="text-sm text-muted-foreground">Jami Savollar</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">
                  {Math.round((score / 100) * testData.questions)}
                </p>
                <p className="text-sm text-muted-foreground">To'g'ri Javoblar</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={resetTest} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Qayta Urinish
              </Button>
              <Button onClick={() => setView('overview')} className="flex-1">
                <FileText className="h-4 w-4 mr-2" />
                Test Haqida
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}