"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Progress } from "@/components/ui/progress"
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react"
import {
  ArrowLeft,
  Clock,
  Volume2,
  Play,
  Pause,
  RotateCcw,
  Award,
  Eye,
  SkipBack,
  SkipForward,
} from "lucide-react"

// Types
interface ListeningQuestion {
  type: string
  question: string
  options?: string[]
  correct?: number
  correctAnswer?: string
  wordLimit?: number
  alternativeAnswers?: string[]
  startTime?: number
  endTime?: number
  instructions?: string
  questionTitle?: string
  notesText?: string
}

interface ListeningSection {
  title: string
  audioUrl: string
  transcript?: string
  questions: ListeningQuestion[]
}

interface ListeningTestData {
  id: string
  title: string
  type: string
  level: string
  sections: number
  questions: number
  timeLimit: number
  status: string
  attempts: number
  avgScore: number
  createdAt: string
  updatedAt?: string
  sections_data: ListeningSection[]
}

interface ListeningTestViewerProps {
  testData: ListeningTestData
  onBack: () => void
  mode?: "preview" | "practice" | "exam"
}

export default function ListeningTestViewer({ testData, onBack, mode = "preview" }: ListeningTestViewerProps) {
  const [currentSection, setCurrentSection] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<{ [key: string]: string }>({})
  const [timeLeft, setTimeLeft] = useState(testData.timeLimit * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [score, setScore] = useState(0)
  const [view, setView] = useState<"overview" | "test" | "results">("overview")

  // Audio controls
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0 && mode === "exam") {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
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

  // Audio event listeners
  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    const updateTime = () => setCurrentTime(audio.currentTime)
    const updateDuration = () => setDuration(audio.duration)
    const handleEnded = () => setIsPlaying(false)

    audio.addEventListener("timeupdate", updateTime)
    audio.addEventListener("loadedmetadata", updateDuration)
    audio.addEventListener("ended", handleEnded)

    return () => {
      audio.removeEventListener("timeupdate", updateTime)
      audio.removeEventListener("loadedmetadata", updateDuration)
      audio.removeEventListener("ended", handleEnded)
    }
  }, [currentSection])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const togglePlayPause = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause()
      } else {
        audioRef.current.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const startTest = () => {
    setView("test")
    setIsRunning(true)
    if (audioRef.current) {
      audioRef.current.play()
      setIsPlaying(true)
    }
  }

  const handleAnswerChange = (questionIndex: number, answer: string) => {
    setAnswers(prev => ({
      ...prev,
      [questionIndex]: answer
    }))
  }

  const calculateScore = () => {
    if (!testData.sections_data || testData.sections_data.length === 0) return 0
    
    let correctAnswers = 0
    let totalQuestions = 0
    
    testData.sections_data.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        const answerKey = `${sectionIndex}_${questionIndex}`
        const userAnswer = answers[answerKey]
        
        if (question.type === "Sentence Completion") {
          // Sentence Completion uchun har bir gap alohida hisoblanadi
          for (let gapNumber = 1; gapNumber <= 5; gapNumber++) {
            const gapKey = `${answerKey}_gap${gapNumber}`
            const userGapAnswer = answers[gapKey]
            const correctGapAnswer = question[`gap${gapNumber}`]
            
            if (correctGapAnswer) {
              totalQuestions++
              if (userGapAnswer && userGapAnswer.toLowerCase().trim() === correctGapAnswer.toLowerCase().trim()) {
                correctAnswers++
              }
            }
          }
        } else {
          totalQuestions++
          if (userAnswer && userAnswer === question.correctAnswer) {
            correctAnswers++
          }
        }
      })
    })
    
    return totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0
  }

  const handleSubmitTest = () => {
    setIsRunning(false)
    const finalScore = calculateScore()
    setScore(finalScore)
    setView("results")
  }

  const resetTest = () => {
    setCurrentSection(0)
    setCurrentQuestion(0)
    setAnswers({})
    setTimeLeft(testData.timeLimit * 60)
    setIsRunning(false)
    setScore(0)
    setView("overview")
  }

  const renderQuestion = (question: ListeningQuestion, questionIndex: number) => {
    const answerKey = `${currentSection}_${questionIndex}`

    switch (question.type) {
      case "Multiple Choice":
        return (
          <div className="space-y-4">
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center">
                  <span className="text-xs font-semibold">{questionIndex + 1}</span>
                </div>
                <h3 className="text-lg font-semibold">Multiple Choice</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{question.question}</p>
              </div>
              
              <RadioGroup
                value={answers[answerKey] || ""}
                onValueChange={(value) => handleAnswerChange(questionIndex, value)}
              >
                <div className="space-y-3">
                  {question.options?.map((option, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <RadioGroupItem value={option} id={`${answerKey}_${index}`} />
                      <Label htmlFor={`${answerKey}_${index}`} className="text-sm">
                        {String.fromCharCode(65 + index)}. {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        )

      case "Sentence Completion":
        return (
          <div className="space-y-4">
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center">
                  <span className="text-xs font-semibold">{questionIndex + 1}</span>
                </div>
                <h3 className="text-lg font-semibold">Notes Completion</h3>
              </div>
              
              {question.instructions && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded">
                  <p className="text-sm text-red-800">{question.instructions}</p>
                </div>
              )}
              
              {question.questionTitle && (
                <h4 className="text-lg font-bold text-blue-600 mb-4">{question.questionTitle}</h4>
              )}
              
              {question.notesText && (
                <div className="mb-6 p-4 bg-gray-50 border rounded">
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap font-mono">
                    {question.notesText}
                  </pre>
                </div>
              )}
              
              <div className="space-y-3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[1, 2, 3, 4, 5].map((gapNumber) => (
                    <div key={gapNumber} className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-red-600 text-white rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold">{gapNumber}</span>
                      </div>
                      <Input
                        value={answers[`${answerKey}_gap${gapNumber}`] || ""}
                        onChange={(e) => handleAnswerChange(`${questionIndex}_gap${gapNumber}`, e.target.value)}
                        placeholder="Type your answer..."
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
                
                {question.wordLimit && (
                  <div className="flex items-center gap-2 p-2 bg-amber-50 rounded border border-amber-200">
                    <AlertTriangle className="h-3 w-3 text-amber-600" />
                    <p className="text-xs font-medium text-amber-800">
                      NO MORE THAN {question.wordLimit} WORD{question.wordLimit > 1 ? 'S' : ''}
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div className="bg-white border border-gray-300 rounded-lg p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center">
                  <span className="text-xs font-semibold">{questionIndex + 1}</span>
                </div>
                <h3 className="text-lg font-semibold">{question.type}</h3>
              </div>
              
              <div className="mb-4">
                <p className="text-gray-800 leading-relaxed">{question.question}</p>
              </div>
              
              <Input
                value={answers[answerKey] || ""}
                onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
                placeholder="Type your answer..."
                className="w-full"
              />
            </div>
          </div>
        )
    }
  }

  // Overview view
  if (view === "overview") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Button>
          <Badge variant="outline" className="text-sm">
            {mode === "exam" ? "Exam Mode" : mode === "practice" ? "Practice Mode" : "Preview Mode"}
          </Badge>
        </div>

        <Card className="rounded-3xl border-2">
          <CardHeader className="text-center">
            <CardTitle className="text-3xl">{testData.title}</CardTitle>
            <CardDescription>
              {testData.type} • {testData.level} • {testData.sections} sections • {testData.questions} questions
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Test Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Clock className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{formatTime(testData.timeLimit * 60)}</p>
                <p className="text-sm text-muted-foreground">Time Limit</p>
              </div>
              
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-2xl font-bold text-green-600">{testData.sections}</p>
                <p className="text-sm text-muted-foreground">Sections</p>
              </div>
              
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <p className="text-2xl font-bold text-purple-600">{testData.questions}</p>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">{testData.attempts}</p>
                <p className="text-sm text-muted-foreground">Attempts</p>
              </div>
            </div>

            {/* Audio Player */}
            {testData.sections_data && testData.sections_data.length > 0 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Audio Preview</h3>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <audio ref={audioRef} src={testData.sections_data[0].audioUrl} />
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={togglePlayPause}
                      className="w-12 h-12 rounded-full"
                    >
                      {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                    </Button>
                    
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>{formatTime(currentTime)}</span>
                        <span>{formatTime(duration)}</span>
                      </div>
                      <Progress value={(currentTime / duration) * 100} className="h-2" />
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Start Test Button */}
            <div className="text-center">
              <Button onClick={startTest} size="lg" className="px-8 py-3">
                <Play className="h-5 w-5 mr-2" />
                {mode === "exam" ? "Start Exam" : mode === "practice" ? "Start Practice" : "Start Preview"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Test view
  if (view === "test") {
    const currentSectionData = testData.sections_data?.[currentSection]
    const currentQuestionData = currentSectionData?.questions?.[currentQuestion]

    if (!currentSectionData || !currentQuestionData) {
      return (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Test ma'lumotlari topilmadi</p>
        </div>
      )
    }

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Button>
          
          <div className="flex items-center gap-4">
            {mode === "exam" && (
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-red-600" />
                <span className="font-semibold text-red-600">{formatTime(timeLeft)}</span>
              </div>
            )}
            
            <Badge variant="outline">
              Section {currentSection + 1} of {testData.sections}
            </Badge>
          </div>
        </div>

        {/* Audio Player */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <audio ref={audioRef} src={currentSectionData.audioUrl} />
          <div className="flex items-center gap-4">
            <Button
              variant="outline"
              size="icon"
              onClick={togglePlayPause}
              className="w-12 h-12 rounded-full"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            
            <div className="flex-1">
              <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
              <Progress value={(currentTime / duration) * 100} className="h-2" />
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="space-y-4">
          {renderQuestion(currentQuestionData, currentQuestion)}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="outline"
            onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
            disabled={currentQuestion === 0}
          >
            <SkipBack className="h-4 w-4 mr-2" />
            Previous
          </Button>
          
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {currentSectionData.questions.length}
            </span>
          </div>
          
          <Button
            onClick={() => {
              if (currentQuestion < currentSectionData.questions.length - 1) {
                setCurrentQuestion(currentQuestion + 1)
              } else {
                handleSubmitTest()
              }
            }}
          >
            {currentQuestion < currentSectionData.questions.length - 1 ? (
              <>
                Next
                <SkipForward className="h-4 w-4 ml-2" />
              </>
            ) : (
              <>
                Submit Test
                <CheckCircle className="h-4 w-4 ml-2" />
              </>
            )}
          </Button>
        </div>
      </div>
    )
  }

  // Results view
  if (view === "results") {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="outline" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Orqaga
          </Button>
        </div>

        <Card className="rounded-3xl border-2">
          <CardHeader className="text-center">
            <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
              <Award className="h-10 w-10 text-green-600" />
            </div>
            <CardTitle className="text-3xl">Test Completed!</CardTitle>
            <CardDescription>
              {testData.title} - Results
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Score Display */}
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">{score}%</div>
              <p className="text-muted-foreground">
                {testData.questions} questions completed
              </p>
            </div>

            <Progress value={score} className="h-3" />

            {/* Actions */}
            <div className="flex gap-4">
              <Button onClick={resetTest} variant="outline" className="flex-1">
                <RotateCcw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={onBack} className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Back to List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return null
}
