"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Slider } from "@/components/ui/slider"
import {
  ArrowLeft,
  Clock,
  Volume2,
  CheckCircle,
  Eye,
  Play,
  Pause,
  RotateCcw,
  FileText,
  User,
  Target,
  Award,
  AlertTriangle,
  SkipBack,
  SkipForward,
  VolumeX,
  Headphones,
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
  const [timeLeft, setTimeLeft] = useState(testData.timeLimit * 60) // seconds
  const [isRunning, setIsRunning] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [score, setScore] = useState(0)
  const [view, setView] = useState<"overview" | "sections" | "questions" | "results">("overview")

  // Audio controls
  const audioRef = useRef<HTMLAudioElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [playbackRate, setPlaybackRate] = useState(1)

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

  // Format time
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    return `${minutes.toString().padStart(2, "0")}:${remainingSeconds.toString().padStart(2, "0")}`
  }

  // Audio controls
  const togglePlayPause = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
    } else {
      audio.play()
    }
    setIsPlaying(!isPlaying)
  }

  const seekTo = (time: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.currentTime = time
      setCurrentTime(time)
    }
  }

  const changeVolume = (newVolume: number[]) => {
    const audio = audioRef.current
    if (audio) {
      audio.volume = newVolume[0]
      setVolume(newVolume[0])
    }
  }

  const changePlaybackRate = (rate: number) => {
    const audio = audioRef.current
    if (audio) {
      audio.playbackRate = rate
      setPlaybackRate(rate)
    }
  }

  // Start test
  const startTest = () => {
    setIsRunning(true)
    setView("sections")
  }

  // Handle answer change
  const handleAnswerChange = (questionIndex: number, answer: string) => {
    const key = `${currentSection}-${questionIndex}`
    setAnswers((prev) => ({
      ...prev,
      [key]: answer,
    }))
  }

  // Calculate score
  const calculateScore = () => {
    let correctAnswers = 0
    let totalQuestions = 0

    testData.sections_data.forEach((section, sectionIndex) => {
      section.questions.forEach((question, questionIndex) => {
        totalQuestions++
        const key = `${sectionIndex}-${questionIndex}`
        const userAnswer = answers[key]?.toLowerCase().trim()

        if (question.type === "Multiple Choice") {
          if (Number.parseInt(userAnswer) === question.correct) {
            correctAnswers++
          }
        } else if (
          ["Form Completion", "Note Completion", "Table Completion", "Sentence Completion"].includes(question.type)
        ) {
          const correctAnswer = question.correctAnswer?.toLowerCase().trim()
          const alternativeAnswers = question.alternativeAnswers?.map((ans) => ans.toLowerCase().trim()) || []

          if (correctAnswer === userAnswer || alternativeAnswers.includes(userAnswer)) {
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
    setView("results")
    setIsRunning(false)
  }

  // Reset test
  const resetTest = () => {
    setAnswers({})
    setTimeLeft(testData.timeLimit * 60)
    setIsRunning(false)
    setShowResults(false)
    setScore(0)
    setCurrentSection(0)
    setCurrentQuestion(0)
    setView("overview")
    setIsPlaying(false)
    setCurrentTime(0)
  }

  // Render question based on type
  const renderQuestion = (question: ListeningQuestion, questionIndex: number) => {
    const key = `${currentSection}-${questionIndex}`
    const currentAnswer = answers[key] || ""

    switch (question.type) {
      case "Multiple Choice":
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.question}</p>
            <RadioGroup value={currentAnswer} onValueChange={(value) => handleAnswerChange(questionIndex, value)}>
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

      case "Form Completion":
      case "Note Completion":
      case "Table Completion":
      case "Sentence Completion":
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.question}</p>
            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">
                Use NO MORE THAN {question.wordLimit} WORD(S) from the recording
              </p>
              {question.startTime !== undefined && question.endTime !== undefined && (
                <div className="flex items-center gap-2 text-xs text-blue-600 mb-2">
                  <Clock className="h-3 w-3" />
                  <span>
                    Listen from {formatTime(question.startTime)} to {formatTime(question.endTime)}
                  </span>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => seekTo(question.startTime || 0)}
                    className="h-6 px-2 text-xs"
                  >
                    Go to
                  </Button>
                </div>
              )}
            </div>
            <Input
              placeholder="Your answer..."
              value={currentAnswer}
              onChange={(e) => handleAnswerChange(questionIndex, e.target.value)}
              className="w-full"
            />
          </div>
        )

      case "Short Answer Questions":
        return (
          <div className="space-y-4">
            <p className="font-medium">{question.question}</p>
            <p className="text-sm text-muted-foreground">
              Use NO MORE THAN {question.wordLimit} WORD(S) from the recording
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
              <AlertDescription>Bu savol turi hali qo'llab-quvvatlanmaydi: {question.type}</AlertDescription>
            </Alert>
          </div>
        )
    }
  }

  // Overview view
  if (view === "overview") {
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
                <CardTitle className="text-2xl mb-2 flex items-center gap-2">
                  <Headphones className="h-8 w-8 text-blue-600" />
                  {testData.title}
                </CardTitle>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{testData.type}</Badge>
                  <Badge variant="secondary">{testData.level}</Badge>
                  <Badge className="bg-green-100 text-green-800">{testData.status}</Badge>
                </div>
                <CardDescription>
                  IELTS Listening test - {testData.sections} ta bo'lim, {testData.questions} ta savol
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <Volume2 className="h-8 w-8 text-blue-600 mx-auto mb-2" />
                <p className="text-2xl font-bold text-blue-600">{testData.sections}</p>
                <p className="text-sm text-muted-foreground">Bo'limlar</p>
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
              <h3 className="text-lg font-semibold mb-4">Bo'limlar ro'yxati:</h3>
              <div className="space-y-3">
                {testData.sections_data.map((section, index) => (
                  <Card key={index} className="rounded-lg">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">
                            {index + 1}. {section.title}
                          </h4>
                          <p className="text-sm text-muted-foreground">{section.questions.length} ta savol</p>
                          <div className="flex items-center gap-2 mt-1">
                            <Volume2 className="h-3 w-3 text-blue-600" />
                            <span className="text-xs text-muted-foreground">Audio mavjud</span>
                          </div>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentSection(index)
                            setView("sections")
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
              <Button onClick={() => setView("sections")} variant="outline" className="flex-1">
                <Eye className="h-4 w-4 mr-2" />
                Bo'limlarni Ko'rish
              </Button>
              {mode === "practice" && (
                <Button onClick={startTest} className="flex-1">
                  <Play className="h-4 w-4 mr-2" />
                  Mashq Qilish
                </Button>
              )}
              {mode === "exam" && (
                <Button onClick={startTest} className="flex-1">
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

  // Sections view
  if (view === "sections") {
    const section = testData.sections_data[currentSection]

    return (
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="outline" onClick={() => setView("overview")}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Orqaga
            </Button>
            <div>
              <h2 className="text-xl font-bold">{testData.title}</h2>
              <p className="text-sm text-muted-foreground">
                Bo'lim {currentSection + 1} / {testData.sections_data.length}
              </p>
            </div>
          </div>

          {(mode === "practice" || mode === "exam") && (
            <div className="flex items-center gap-4">
              {mode === "exam" && (
                <div className="flex items-center gap-2 px-3 py-1 bg-red-50 rounded-lg">
                  <Clock className="h-4 w-4 text-red-600" />
                  <span className="font-mono text-red-600">{formatTime(timeLeft)}</span>
                </div>
              )}
              <Button variant={isRunning ? "outline" : "default"} onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
              </Button>
            </div>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Audio Player */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Volume2 className="h-5 w-5" />
                {section.title}
              </CardTitle>
              <CardDescription>Audio player va boshqaruv elementlari</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Audio Element */}
              <audio
                ref={audioRef}
                src={section.audioUrl}
                onPlay={() => setIsPlaying(true)}
                onPause={() => setIsPlaying(false)}
              />

              {/* Main Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button variant="outline" size="sm" onClick={() => seekTo(Math.max(0, currentTime - 10))}>
                  <SkipBack className="h-4 w-4" />
                </Button>

                <Button size="lg" onClick={togglePlayPause} className="rounded-full w-12 h-12">
                  {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
                </Button>

                <Button variant="outline" size="sm" onClick={() => seekTo(Math.min(duration, currentTime + 10))}>
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>

              {/* Progress Bar */}
              <div className="space-y-2">
                <Slider
                  value={[currentTime]}
                  max={duration}
                  step={1}
                  onValueChange={(value) => seekTo(value[0])}
                  className="w-full"
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>{formatTime(currentTime)}</span>
                  <span>{formatTime(duration)}</span>
                </div>
              </div>

              {/* Volume Control */}
              <div className="flex items-center gap-2">
                <VolumeX className="h-4 w-4" />
                <Slider value={[volume]} max={1} step={0.1} onValueChange={changeVolume} className="flex-1" />
                <Volume2 className="h-4 w-4" />
              </div>

              {/* Playback Speed */}
              <div className="flex items-center gap-2">
                <Label className="text-sm">Tezlik:</Label>
                <div className="flex gap-1">
                  {[0.75, 1, 1.25, 1.5].map((rate) => (
                    <Button
                      key={rate}
                      variant={playbackRate === rate ? "default" : "outline"}
                      size="sm"
                      onClick={() => changePlaybackRate(rate)}
                    >
                      {rate}x
                    </Button>
                  ))}
                </div>
              </div>

              {/* Transcript (if available) */}
              {section.transcript && (
                <div className="mt-4">
                  <Label className="text-sm font-medium">Transkripsiya:</Label>
                  <div className="mt-2 p-3 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto">
                    {section.transcript}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Questions */}
          <Card className="rounded-3xl">
            <CardHeader>
              <CardTitle>Savollar</CardTitle>
              <CardDescription>{section.questions.length} ta savol</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {section.questions.map((question, index) => (
                  <div key={index} className="p-4 border rounded-lg">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="outline">{question.type}</Badge>
                      <span className="text-sm text-muted-foreground">Savol {index + 1}</span>
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
            onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
            disabled={currentSection === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Oldingi Bo'lim
          </Button>

          <div className="flex items-center gap-2">
            {(mode === "practice" || mode === "exam") && (
              <Button onClick={handleSubmitTest} variant="default">
                <CheckCircle className="h-4 w-4 mr-2" />
                Testni Yakunlash
              </Button>
            )}
          </div>

          <Button
            variant="outline"
            onClick={() => setCurrentSection(Math.min(testData.sections_data.length - 1, currentSection + 1))}
            disabled={currentSection === testData.sections_data.length - 1}
          >
            Keyingi Bo'lim
            <ArrowLeft className="h-4 w-4 ml-2 rotate-180" />
          </Button>
        </div>
      </div>
    )
  }

  // Results view
  if (view === "results") {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button variant="outline" onClick={() => setView("overview")}>
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
            <CardDescription>Sizning natijangiz</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-6xl font-bold text-green-600 mb-2">{score}%</div>
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
                <p className="text-2xl font-bold text-green-600">{Math.round((score / 100) * testData.questions)}</p>
                <p className="text-sm text-muted-foreground">To'g'ri Javoblar</p>
              </div>
            </div>

            <div className="flex gap-4">
              <Button onClick={resetTest} variant="outline" className="flex-1 bg-transparent">
                <RotateCcw className="h-4 w-4 mr-2" />
                Qayta Urinish
              </Button>
              <Button onClick={() => setView("overview")} className="flex-1">
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
