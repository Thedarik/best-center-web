"use client"

import React, { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { studentExamAPI, StudentTest } from "@/components/src/ielts_file/studentExamAPI"
import {
  Headphones,
  BookOpen,
  PenTool,
  MessageSquare,
  Clock,
  User,
  Award,
  CheckCircle,
  AlertTriangle,
  Play,
  Pause,
  RotateCcw,
  ArrowLeft,
  ArrowRight,
  Volume2,
  Target,
  BarChart3,
  FileText,
  Eye,
  Loader2,
  CreditCard,
  UserCheck,
  Shield,
  VolumeX,
  SkipBack,
  SkipForward,
  Headphones as HeadphonesIcon,
  Database,
  Wifi,
  WifiOff,
  XCircle,
} from "lucide-react"

// Types
interface ExamSection {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  duration: number
  questions: number
  color: string
  bgColor: string
  status: "not-started" | "in-progress" | "completed"
  score?: number
}

interface Question {
  id: number
  type: string
  question: string
  options?: string[]
  correctAnswer?: string
  wordLimit?: number
  sentence?: string
  startTime?: number
  endTime?: number
  instructions?: string
  questionTitle?: string
  notesText?: string
}

export default function StudentExamPage() {
  const [currentView, setCurrentView] = useState<"overview" | "exam" | "results">("overview")
  const [selectedSection, setSelectedSection] = useState<ExamSection | null>(null)
  const [examData, setExamData] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [timeLeft, setTimeLeft] = useState(0)
  const [isRunning, setIsRunning] = useState(false)
  const [answers, setAnswers] = useState<{ [key: string | number]: any }>({})
  const [answersVersion, setAnswersVersion] = useState(0)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [showResults, setShowResults] = useState(false)
  const [examResults, setExamResults] = useState<any>(null)
  
  // Passport ID state
  const [showPassportModal, setShowPassportModal] = useState(true)
  const [passportId, setPassportId] = useState("")
  const [studentName, setStudentName] = useState("")
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Backend connection state
  const [backendConnected, setBackendConnected] = useState(false)
  const [availableTests, setAvailableTests] = useState<StudentTest[]>([])
  const [loadingTests, setLoadingTests] = useState(false)

  // Audio controls for listening
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [volume, setVolume] = useState(0.8)
  const [hasPlayed, setHasPlayed] = useState(false)
  const [showReadyModal, setShowReadyModal] = useState(false)
  const audioRef = React.useRef<HTMLAudioElement>(null)

  // IELTS Sections
  const ieltsSections: ExamSection[] = [
    {
      id: "listening",
      title: "Listening",
      description: "30 daqiqa, 40 ta savol. Audio fayllarni tinglab, savollarga javob bering.",
      icon: <Headphones className="h-8 w-8" />,
      duration: 30,
      questions: 40,
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      status: "not-started"
    },
    {
      id: "reading",
      title: "Reading",
      description: "60 daqiqa, 40 ta savol. Matnlarni o'qib, savollarga javob bering.",
      icon: <BookOpen className="h-8 w-8" />,
      duration: 60,
      questions: 40,
      color: "text-green-600",
      bgColor: "bg-green-50",
      status: "not-started"
    },
    {
      id: "writing",
      title: "Writing",
      description: "60 daqiqa, 2 ta vazifa. Task 1 va Task 2 bo'yicha yozuvlar.",
      icon: <PenTool className="h-8 w-8" />,
      duration: 60,
      questions: 2,
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      status: "not-started"
    },
    {
      id: "speaking",
      title: "Speaking",
      description: "11-14 daqiqa, 3 qism. Intervyu va muloqot qobiliyatlari.",
      icon: <MessageSquare className="h-8 w-8" />,
      duration: 14,
      questions: 3,
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      status: "not-started"
    }
  ]

  // Format passport ID with mask
  const formatPassportId = (value: string) => {
    const cleaned = value.replace(/[^A-Za-z0-9]/g, "")
    
    if (cleaned.length <= 2) {
      return cleaned.toUpperCase()
    } else if (cleaned.length <= 9) {
      const letters = cleaned.slice(0, 2).toUpperCase()
      const numbers = cleaned.slice(2)
      return `${letters} ${numbers}`
    } else {
      const letters = cleaned.slice(0, 2).toUpperCase()
      const numbers = cleaned.slice(2, 9)
      return `${letters} ${numbers}`
    }
  }

  // Handle passport ID input
  const handlePassportIdChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    const formatted = formatPassportId(value)
    setPassportId(formatted)
  }

  // Validate passport ID
  const validatePassportId = (id: string) => {
    const pattern = /^[A-Z]{2}\s\d{7}$/
    return pattern.test(id)
  }

  // Handle authentication
  const handleAuthentication = () => {
    if (!validatePassportId(passportId)) {
      alert("Iltimos, passport raqamini to'g'ri formatda kiriting: AA 1111111")
      return
    }
    
    if (!studentName.trim()) {
      alert("Iltimos, ismingizni kiriting")
      return
    }

    setIsAuthenticated(true)
    setShowPassportModal(false)
    
    localStorage.setItem("studentPassportId", passportId)
    localStorage.setItem("studentName", studentName)
  }

  // Check if user is already authenticated and load tests
  useEffect(() => {
    const savedPassportId = localStorage.getItem("studentPassportId")
    const savedStudentName = localStorage.getItem("studentName")
    
    if (savedPassportId && savedStudentName) {
      setPassportId(savedPassportId)
      setStudentName(savedStudentName)
      setIsAuthenticated(true)
      setShowPassportModal(false)
    }

    // Check backend connection and load tests
    const checkBackendAndLoadTests = async () => {
      try {
        setLoadingTests(true)
        const isConnected = await studentExamAPI.testConnection()
        setBackendConnected(isConnected)
        
        if (isConnected) {
          const tests = await studentExamAPI.getAvailableTests()
          setAvailableTests(tests)
          console.log("✅ Tests loaded:", tests.length)
        }
      } catch (error) {
        console.error("❌ Error loading tests:", error)
        setBackendConnected(false)
      } finally {
        setLoadingTests(false)
      }
    }

    checkBackendAndLoadTests()
  }, [])

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

  // Start exam
  const startExam = async (section: ExamSection) => {
    setSelectedSection(section)
    setTimeLeft(section.duration * 60)
    setIsRunning(true)
    setCurrentView("exam")
    setCurrentQuestion(0)
    setAnswers({})
    setShowResults(false)
    setHasPlayed(false)
    
    // Show ready modal for listening section
    if (section.id === "listening") {
      setShowReadyModal(true)
      return
    }
    
    setLoading(true)
    
    try {
      // Try to get test from backend first
      if (backendConnected && availableTests.length > 0) {
        const testForSection = availableTests.find(test => test.type === section.id)
        if (testForSection) {
          const testData = await studentExamAPI.getTestById(testForSection.id, section.id)
          if (testData) {
            setExamData({
              id: testData.id,
              section: section.id,
              questions: testData.questions,
              startTime: new Date().toISOString(),
              testData: testData
            })
            setLoading(false)
            return
          }
        }
      }
      
      // Fallback to mock data if no backend test available
      setTimeout(() => {
        setExamData({
          id: `exam-${Date.now()}`,
          section: section.id,
          questions: generateMockQuestions(section.id),
          startTime: new Date().toISOString()
        })
        setLoading(false)
      }, 1000)
    } catch (error) {
      console.error("❌ Error loading test:", error)
      // Fallback to mock data
      setTimeout(() => {
        setExamData({
          id: `exam-${Date.now()}`,
          section: section.id,
          questions: generateMockQuestions(section.id),
          startTime: new Date().toISOString()
        })
        setLoading(false)
      }, 1000)
    }
  }

  // Generate mock questions based on section
  const generateMockQuestions = (sectionId: string) => {
    const questions = []
    
    switch (sectionId) {
      case "listening":
        for (let i = 1; i <= 40; i++) {
          const questionType = i <= 10 ? "Multiple Choice" : i <= 20 ? "Form Completion" : i <= 30 ? "Note Completion" : "Sentence Completion"
          const question: any = {
            id: i,
            type: questionType,
            question: `Listening Question ${i}`,
            options: i <= 10 ? ["A", "B", "C", "D"] : undefined,
            correctAnswer: i <= 10 ? "A" : `answer${i}`,
            wordLimit: i <= 10 ? undefined : 2
          }
          
          if (questionType === "Sentence Completion") {
            // Yangi format uchun mock data
            question.questionTitle = "The Dead Sea Scrolls"
            question.instructions = "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 1-5 on your answer sheet."
            question.notesText = `Discovery:
• Qumran, 1945/7
• three Bedouin shepherds in their teens were near an opening on side of cliff
• heard a noise of breaking when one teenager threw a [1]
• teenagers went into the [2] and found a number of containers made of [3]

The scrolls:
• date from between 150 BCE and 70 CE
• thought to have been written by group of people known as the [4]
• written mainly in the [5] language
• most are on religious topics, written using ink on parchment or papyrus`
            question.gap1 = "stone"
            question.gap2 = "cave"
            question.gap3 = "clay"
            question.gap4 = "Essenes"
            question.gap5 = "Hebrew"
          }
          
          questions.push(question)
        }
        break
      case "reading":
        for (let i = 1; i <= 40; i++) {
          const questionType = i <= 13 ? "Multiple Choice" : i <= 26 ? "True/False/Not Given" : i <= 35 ? "Matching" : "Sentence Completion"
          const question: any = {
            id: i,
            type: questionType,
            question: `Reading Question ${i}`,
            options: i <= 13 ? ["A", "B", "C", "D"] : undefined,
            correctAnswer: i <= 13 ? "A" : i <= 26 ? "True" : `match${i}`,
            wordLimit: i <= 13 ? undefined : 2
          }
          
          if (questionType === "Sentence Completion") {
            question.questionTitle = "Climate Change Effects"
            question.instructions = "Complete the sentences below. Choose NO MORE THAN TWO WORDS from the passage for each answer."
            question.notesText = `Global Impact:
• The climate change is affecting [1] around the world
• Scientists predict [2] will increase by 2°C by 2050
• Many species are [3] due to habitat loss
• Governments are implementing [4] to reduce emissions
• Renewable energy sources like [5] are becoming more popular`
            question.gap1 = "ecosystems"
            question.gap2 = "temperatures"
            question.gap3 = "endangered"
            question.gap4 = "policies"
            question.gap5 = "solar"
          }
          
          questions.push(question)
        }
        break
      case "writing":
        questions.push(
          {
            id: 1,
            type: "Task 1",
            question: "The chart below shows the percentage of households in different income brackets in three countries in 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
            wordLimit: 150,
            timeLimit: 20
          },
          {
            id: 2,
            type: "Task 2",
            question: "Some people believe that the best way to reduce crime is to give longer prison sentences. Others believe that there are better alternative ways. Discuss both views and give your opinion.",
            wordLimit: 250,
            timeLimit: 40
          }
        )
        break
      case "speaking":
        questions.push(
          {
            id: 1,
            type: "Part 1",
            question: "Let's talk about your hometown. Where is your hometown? What's it like? What do you like most about it?",
            timeLimit: 4
          },
          {
            id: 2,
            type: "Part 2",
            question: "Describe a place you would like to visit. You should say: where it is, how you know about it, what you would do there, and explain why you would like to visit this place.",
            timeLimit: 2
          },
          {
            id: 3,
            type: "Part 3",
            question: "Let's discuss travel and tourism. What are the benefits of traveling? How has tourism changed in recent years? What impact does tourism have on local communities?",
            timeLimit: 5
          }
        )
        break
    }
    
    return questions
  }

  // Handle answer change
  const handleAnswerChange = (questionId: number | string, answer: any) => {
    setAnswers(prev => {
      const newAnswers = {
        ...prev,
        [questionId]: answer
      }
      return newAnswers
    })
    setAnswersVersion(prev => prev + 1)
  }

  // Handle ready confirmation for listening
  const handleReadyConfirm = async () => {
    setShowReadyModal(false)
    
    setLoading(true)
    
    try {
      // Try to get test from backend first
      if (backendConnected && availableTests.length > 0) {
        const testForSection = availableTests.find(test => test.type === "listening")
        if (testForSection) {
          const testData = await studentExamAPI.getTestById(testForSection.id, "listening")
          if (testData) {
            setExamData({
              id: testData.id,
              section: "listening",
              questions: testData.questions,
              startTime: new Date().toISOString(),
              testData: testData
            })
            setLoading(false)
            
            // Auto-start audio after a short delay
            setTimeout(() => {
              if (audioRef.current) {
                audioRef.current.play()
              }
            }, 500)
            return
          }
        }
      }
      
      // Fallback to mock data
      setTimeout(() => {
        setExamData({
          id: `exam-${Date.now()}`,
          section: selectedSection?.id || "listening",
          questions: generateMockQuestions(selectedSection?.id || "listening"),
          startTime: new Date().toISOString()
        })
        setLoading(false)
        
        // Auto-start audio after a short delay
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play()
          }
        }, 500)
      }, 1000)
    } catch (error) {
      console.error("❌ Error loading listening test:", error)
      // Fallback to mock data
      setTimeout(() => {
        setExamData({
          id: `exam-${Date.now()}`,
          section: selectedSection?.id || "listening",
          questions: generateMockQuestions(selectedSection?.id || "listening"),
          startTime: new Date().toISOString()
        })
        setLoading(false)
        
        // Auto-start audio after a short delay
        setTimeout(() => {
          if (audioRef.current) {
            audioRef.current.play()
          }
        }, 500)
      }, 1000)
    }
  }

  // Submit exam
  const handleSubmitExam = async () => {
    setIsRunning(false)
    setShowResults(true)
    
    const score = calculateScore()
    const timeSpent = (selectedSection?.duration || 0) * 60 - timeLeft
    const results = {
      section: selectedSection?.id,
      score,
      totalQuestions: examData?.questions?.length || 0,
      correctAnswers: Math.round((score / 100) * (examData?.questions?.length || 0)),
      timeSpent,
      completedAt: new Date().toISOString()
    }
    
    setExamResults(results)
    setCurrentView("results")

    // Submit to backend if connected and we have test data
    if (backendConnected && examData?.testData) {
      try {
        const success = await studentExamAPI.submitTestAttempt({
          testId: examData.testData.id,
          testType: selectedSection?.id || "",
          studentId: passportId,
          studentName: studentName,
          score,
          timeSpent,
          answers,
          completedAt: new Date().toISOString()
        })
        
        if (success) {
          console.log("✅ Test attempt submitted to backend")
        } else {
          console.warn("⚠️ Failed to submit test attempt to backend")
        }
      } catch (error) {
        console.error("❌ Error submitting test attempt:", error)
      }
    }
  }

  // Calculate score
  const calculateScore = () => {
    if (!examData?.questions) return 0
    
    let correctAnswers = 0
    let totalPossibleAnswers = 0
    
    examData.questions.forEach((question: any) => {
      if (question.type === "Sentence Completion") {
        // Sentence Completion uchun har bir gap alohida hisoblanadi
        for (let gapNumber = 1; gapNumber <= 5; gapNumber++) {
          const gapKey = `${question.id}_gap${gapNumber}`
          const userAnswer = answers[gapKey]
          const correctAnswer = question[`gap${gapNumber}`]
          
          if (correctAnswer) {
            totalPossibleAnswers++
            if (userAnswer && userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()) {
              correctAnswers++
            }
          }
        }
      } else {
        // Boshqa savol turlari uchun oddiy hisoblash
        totalPossibleAnswers++
        const userAnswer = answers[question.id]
        if (userAnswer && userAnswer === question.correctAnswer) {
          correctAnswers++
        }
      }
    })
    
    return totalPossibleAnswers > 0 ? Math.round((correctAnswers / totalPossibleAnswers) * 100) : 0
  }

  // Reset exam
  const resetExam = () => {
    setCurrentView("overview")
    setSelectedSection(null)
    setExamData(null)
    setTimeLeft(0)
    setIsRunning(false)
    setAnswers({})
    setCurrentQuestion(0)
    setShowResults(false)
    setExamResults(null)
  }

  // Timer effect
  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsRunning(false)
            handleSubmitExam()
            return 0
          }
          return prev - 1
        })
      }, 1000)

      return () => clearInterval(timer)
    }
  }, [isRunning, timeLeft])

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
  }, [currentQuestion])

  // Render question based on type
  const renderQuestion = (question: Question) => {
    switch (question.type) {
      case "Multiple Choice":
        return (
          <div className="space-y-4">
            <div className="bg-white border border-gray-300">
              {/* Header with Instructions */}
              <div className="bg-gray-100 p-4 border-b border-gray-300">
                <p className="text-sm font-semibold text-gray-800">
                  Choose the correct answer from the options A, B, C, or D.
                </p>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">Multiple Choice Questions</h2>
                </div>
                
                {/* Question */}
                <div className="border border-gray-300 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-green-600 text-white rounded flex items-center justify-center">
                      <span className="text-xs font-semibold">{currentQuestion + 1}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Question</h3>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-800 leading-relaxed">{question.question}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {question.options?.map((option, index) => (
                      <div key={index} className="group">
                        <div 
                          key={`${question.id}-${option}-${answersVersion}-${answers[question.id] === option}`}
                          onClick={() => handleAnswerChange(question.id, option)}
                          className={`flex items-center p-3 border rounded cursor-pointer transition-all duration-300 ${
                            answers[question.id] === option 
                              ? "border-green-500 bg-green-100 shadow-md scale-[1.02]" 
                              : "border-gray-300 hover:border-green-400 hover:bg-green-50"
                          }`}
                          style={{ userSelect: 'none' }}
                        >
                          <div className={`w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center ${
                            answers[question.id] === option 
                              ? "border-green-500" 
                              : "border-gray-300 group-hover:border-green-500"
                          }`}>
                            <div className={`w-2 h-2 bg-green-500 rounded-full ${
                              answers[question.id] === option ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            } transition-opacity`}></div>
                          </div>
                          <div className="flex-1">
                            <span className="font-semibold text-gray-700 mr-2 text-sm">{String.fromCharCode(65 + index)}.</span>
                            <span className="text-gray-800 text-sm">{option}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "Sentence Completion":
        return (
          <div className="space-y-4">
            <div className="bg-white border border-gray-300">
              {/* Header with Instructions */}
              <div className="bg-gray-100 p-4 border-b border-gray-300">
                <p className="text-sm font-semibold text-gray-800">
                  {question.instructions || "Complete the notes below. Choose ONE WORD ONLY from the passage for each answer. Write your answers in boxes 1-5 on your answer sheet."}
                </p>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">
                    {question.questionTitle || "Complete the notes"}
                  </h2>
                </div>
                
                {/* Notes with gaps */}
                <div className="border border-gray-300 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center">
                      <span className="text-xs font-semibold">1</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Notes Completion</h3>
                  </div>
                  
                  <div className="mb-4">
                    <pre className="text-sm text-gray-800 leading-relaxed whitespace-pre-wrap font-mono">
                      {question.notesText || question.question}
                    </pre>
                  </div>
                  
                  {/* Answer boxes */}
                  <div className="space-y-3">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {[1, 2, 3, 4, 5].map((gapNumber) => (
                        <div key={gapNumber} className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-red-600 text-white rounded flex items-center justify-center flex-shrink-0">
                            <span className="text-xs font-semibold">{gapNumber}</span>
                          </div>
                          <Input
                            value={answers[`${question.id}_gap${gapNumber}`] || ""}
                            onChange={(e) => handleAnswerChange(`${question.id}_gap${gapNumber}`, e.target.value)}
                            placeholder="Type your answer..."
                            className="w-full h-8 text-sm border border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded"
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
            </div>
          </div>
        )

      case "Form Completion":
      case "Note Completion":
      case "Table Completion":
        return (
          <div className="space-y-4">
            <div className="bg-white border border-gray-300">
              {/* Header with Instructions */}
              <div className="bg-gray-100 p-3 border-b border-gray-300">
                <p className="text-xs font-semibold text-gray-800">
                  Write <span className="text-red-600 font-bold">NO MORE THAN TWO WORDS AND/OR A NUMBER</span> for each answer.
                </p>
              </div>
              
              <div className="p-4">
                <div className="text-center mb-4">
                  <h2 className="text-base font-bold text-gray-900 mb-1">Cycling holiday in Austria</h2>
                </div>
                
                {/* Example Section */}
                <div className="bg-gray-50 p-3 border border-gray-300 mb-4">
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-xs font-medium text-gray-700">Example:</p>
                      <p className="text-xs text-gray-600">Most suitable holiday lasts</p>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-700">Answer:</p>
                      <p className="text-xs font-bold text-gray-900">10 days</p>
                    </div>
                  </div>
                </div>
                
                {/* Questions Grid */}
                <div className="space-y-3">
                  {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                    <div key={num} className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center flex-shrink-0">
                        <span className="text-xs font-semibold">{num}</span>
                      </div>
                      <div className="flex-1">
                        <p className="text-xs text-gray-800 mb-1">
                          {num === 1 && "Holiday begins on"}
                          {num === 2 && "No more than"}
                          {num === 3 && "Each day, group cycles"}
                          {num === 4 && "Some of the hotels have a"}
                          {num === 5 && "Holiday costs £"}
                          {num === 6 && "All food included except"}
                          {num === 7 && "Essential to bring a"}
                          {num === 8 && "Discount possible on equipment at www."}
                          {num === 9 && "Possible that the"}
                          {num === 10 && "Guided tour of a"}
                          {num === 1 && " people in cycling group."}
                          {num === 2 && " people in cycling group."}
                          {num === 3 && " on average."}
                          {num === 4 && ""}
                          {num === 5 && " per person without flights."}
                          {num === 6 && ""}
                          {num === 7 && ""}
                          {num === 8 && ".com"}
                          {num === 9 && " may change."}
                          {num === 10 && " is arranged."}
                        </p>
                        <Input
                          value={answers[`${question.id}-${num}`] || ""}
                          onChange={(e) => handleAnswerChange(`${question.id}-${num}`, e.target.value)}
                          placeholder={`${num}`}
                          className="w-20 h-6 text-center border border-gray-400 focus:border-blue-500 focus:ring-1 focus:ring-blue-200 rounded text-xs"
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )

      case "True/False/Not Given":
        return (
          <div className="space-y-4">
            <div className="bg-white border border-gray-300">
              {/* Header with Instructions */}
              <div className="bg-gray-100 p-4 border-b border-gray-300">
                <p className="text-sm font-semibold text-gray-800">
                  Do the following statements agree with the information given in the text? Choose:
                </p>
                <div className="mt-2 space-y-1 text-xs text-gray-700">
                  <p><strong>TRUE</strong> - if the statement agrees with the information</p>
                  <p><strong>FALSE</strong> - if the statement contradicts the information</p>
                  <p><strong>NOT GIVEN</strong> - if there is no information on this</p>
                </div>
              </div>
              
              <div className="p-6">
                <div className="text-center mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-2">True/False/Not Given</h2>
                </div>
                
                {/* Question */}
                <div className="border border-gray-300 p-4">
                  <div className="flex items-center gap-2 mb-3">
                    <div className="w-6 h-6 bg-orange-600 text-white rounded flex items-center justify-center">
                      <span className="text-xs font-semibold">{currentQuestion + 1}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-900">Statement</h3>
                  </div>
                  
                  <div className="mb-4">
                    <p className="text-sm text-gray-800 leading-relaxed">{question.question}</p>
                  </div>
                  
                  <div className="space-y-2">
                    {["True", "False", "Not Given"].map((option) => (
                      <div key={option} className="group">
                        <div 
                          key={`${question.id}-${option}-${answersVersion}-${answers[question.id] === option}`}
                          onClick={() => handleAnswerChange(question.id, option)}
                          className={`flex items-center p-3 border rounded cursor-pointer transition-all duration-300 ${
                            answers[question.id] === option 
                              ? "border-orange-500 bg-orange-100 shadow-md scale-[1.02]" 
                              : "border-gray-300 hover:border-orange-400 hover:bg-orange-50"
                          }`}
                          style={{ userSelect: 'none' }}
                        >
                          <div className={`w-4 h-4 border-2 rounded-full mr-3 flex items-center justify-center ${
                            answers[question.id] === option 
                              ? "border-orange-500" 
                              : "border-gray-300 group-hover:border-orange-500"
                          }`}>
                            <div className={`w-2 h-2 bg-orange-500 rounded-full ${
                              answers[question.id] === option ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                            } transition-opacity`}></div>
                          </div>
                          <span className="text-gray-800 font-medium text-sm">{option}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case "Task 1":
      case "Task 2":
        return (
          <div className="space-y-4">
            <div className="bg-white rounded-xl p-8 border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                  <span className="text-indigo-600 font-semibold text-sm">{currentQuestion + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{question.type}</h3>
              </div>
              
              <div className="mb-6">
                <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl border-2 border-indigo-200">
                  <div className="flex items-center gap-2 mb-3">
                    <PenTool className="h-5 w-5 text-indigo-600" />
                    <span className="text-sm font-medium text-indigo-700">Writing Task:</span>
                  </div>
                  <p className="text-lg text-gray-800 leading-relaxed">{question.question}</p>
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Your essay:
                  </Label>
                  <Textarea
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Write your essay here..."
                    className="min-h-[400px] text-lg border-2 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 rounded-lg"
                  />
                </div>
                
                {question.wordLimit && (
                  <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <Target className="h-4 w-4 text-blue-600" />
                    <p className="text-sm font-medium text-blue-800">
                      Write at least {question.wordLimit} words
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
            <div className="bg-white rounded-xl p-8 border shadow-sm">
              <div className="flex items-center gap-2 mb-6">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-gray-600 font-semibold text-sm">{currentQuestion + 1}</span>
                </div>
                <h3 className="text-xl font-semibold text-gray-900">{question.type}</h3>
              </div>
              
              <div className="mb-6">
                <p className="text-lg text-gray-800 leading-relaxed">{question.question}</p>
              </div>
              
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                    Your answer:
                  </Label>
                  <Textarea
                    value={answers[question.id] || ""}
                    onChange={(e) => handleAnswerChange(question.id, e.target.value)}
                    placeholder="Write your answer here..."
                    className="min-h-[200px] text-lg border-2 focus:border-gray-500 focus:ring-2 focus:ring-gray-200 rounded-lg"
                  />
                </div>
              </div>
            </div>
          </div>
        )
    }
  }

  // Passport Modal
  if (showPassportModal) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md"
        >
          <Card className="rounded-3xl border-2 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">IELTS Exam</CardTitle>
              <CardDescription>
                Davom etish uchun ma'lumotlaringizni kiriting
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div>
                  <Label htmlFor="passport" className="text-sm font-medium">
                    Passport raqami
                  </Label>
                  <div className="relative mt-1">
                    <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="passport"
                      type="text"
                      placeholder="AA 1111111"
                      value={passportId}
                      onChange={handlePassportIdChange}
                      className="pl-10"
                      maxLength={10}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Format: AA 1111111
                  </p>
                </div>

                <div>
                  <Label htmlFor="name" className="text-sm font-medium">
                    Ismingiz
                  </Label>
                  <div className="relative mt-1">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="Ismingizni kiriting"
                      value={studentName}
                      onChange={(e) => setStudentName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>
              </div>

              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Bu ma'lumotlar exam natijalaringiz bilan bog'lanish uchun ishlatiladi.
                </AlertDescription>
              </Alert>

              <Button 
                onClick={handleAuthentication}
                className="w-full"
                disabled={!validatePassportId(passportId) || !studentName.trim()}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Davom etish
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Ready Modal for Listening
  if (showReadyModal) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md mx-4"
        >
          <Card className="rounded-3xl border-2 shadow-2xl">
            <CardHeader className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <Headphones className="h-8 w-8 text-blue-600" />
              </div>
              <CardTitle className="text-2xl">Are you ready?</CardTitle>
              <CardDescription>
                Audio will start automatically when you click "Yes".
                <br />
                Make sure your headphones are connected and volume is set.
                <br />
                <span className="text-red-600 font-medium">⚠️ Audio can only be played once!</span>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button 
                onClick={handleReadyConfirm}
                className="w-full"
                size="lg"
              >
                <Play className="h-4 w-4 mr-2" />
                Yes, I'm ready
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

  // Overview view
  if (currentView === "overview") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-8"
          >
            <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
              IELTS Exam
            </h1>
            <p className="text-xl text-muted-foreground">
              Xalqaro ingliz tili darajasi testi
            </p>
            {studentName && (
              <div className="mt-4 flex items-center justify-center gap-2">
                <User className="h-5 w-5 text-blue-600" />
                <span className="text-lg font-medium">{studentName}</span>
                <Badge variant="outline" className="ml-2">
                  {passportId}
                </Badge>
              </div>
            )}
            
            {/* Backend Status */}
            <div className="mt-4 flex items-center justify-center gap-2">
              {loadingTests ? (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Loading tests...</span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  {backendConnected ? (
                    <div className="flex items-center gap-2 text-sm text-green-600">
                      <Wifi className="h-4 w-4" />
                      <span>Connected to backend</span>
                      <Badge variant="outline" className="text-green-600 border-green-300">
                        {availableTests.length} tests available
                      </Badge>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-sm text-orange-600">
                      <WifiOff className="h-4 w-4" />
                      <span>Using offline mode</span>
                      <Badge variant="outline" className="text-orange-600 border-orange-300">
                        Demo tests
                      </Badge>
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>

          {/* Section Selection */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {ieltsSections.map((section, index) => {
              // Find backend test for this section
              const backendTest = availableTests.find(test => test.type === section.id)
              
              return (
                <motion.div
                  key={section.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 + index * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Card className={`rounded-3xl border-2 cursor-pointer transition-all duration-300 hover:shadow-lg ${section.bgColor}`}>
                    <CardHeader className="text-center">
                      <div className={`mx-auto w-16 h-16 rounded-full ${section.bgColor} flex items-center justify-center mb-4`}>
                        <div className={section.color}>
                          {section.icon}
                        </div>
                      </div>
                      <CardTitle className="text-xl">{section.title}</CardTitle>
                      <CardDescription className="text-sm">
                        {section.description}
                      </CardDescription>
                      
                      {/* Backend Test Info */}
                      {backendTest && (
                        <div className="mt-2">
                          <Badge variant="outline" className="text-xs text-green-600 border-green-300">
                            <Database className="h-3 w-3 mr-1" />
                            {backendTest.title}
                          </Badge>
                        </div>
                      )}
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="text-center p-2 bg-white/50 rounded">
                          <Clock className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="font-medium">
                            {backendTest ? backendTest.timeLimit : section.duration} min
                          </p>
                        </div>
                        <div className="text-center p-2 bg-white/50 rounded">
                          <Target className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
                          <p className="font-medium">
                            {backendTest ? backendTest.questions?.length || 0 : section.questions} savol
                          </p>
                        </div>
                      </div>
                       
                      <Button 
                        className="w-full" 
                        onClick={() => startExam(section)}
                      >
                        {backendTest ? "Start Real Test" : "Start Demo"}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              )
            })}
          </motion.div>
        </div>
      </div>
    )
  }

  // Exam view
  if (currentView === "exam" && selectedSection && examData) {
    const currentQ = examData.questions[currentQuestion]
    
    return (
      <div className="min-h-screen bg-gray-100">
        {/* Header - Real IELTS CD Style */}
        <div className="bg-gray-900 text-white border-b border-gray-700 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <Button 
                  variant="outline" 
                  onClick={resetExam} 
                  size="sm" 
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 hover:text-white text-xs"
                >
                  <ArrowLeft className="h-3 w-3 mr-1" />
                  Exit
                </Button>
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 bg-blue-600 rounded flex items-center justify-center">
                    <span className="text-white font-bold text-xs">IELTS</span>
                  </div>
                  <div>
                    <h1 className="text-sm font-semibold text-white">{selectedSection.title.toUpperCase()}</h1>
                    <p className="text-xs text-gray-400">
                      Question {currentQuestion + 1} of {examData.questions.length}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-3">
                <div className={`flex items-center gap-1 px-2 py-1 rounded text-white ${
                  timeLeft <= 300 ? 'bg-red-700 animate-pulse' : 'bg-red-600'
                }`}>
                  <Clock className="h-3 w-3" />
                  <span className="font-mono text-xs font-bold">{formatTime(timeLeft)}</span>
                  {timeLeft <= 300 && (
                    <span className="text-xs ml-1">⚠️</span>
                  )}
                </div>
                <Button 
                  variant="outline" 
                  onClick={() => setIsRunning(!isRunning)}
                  size="sm"
                  className="border-gray-600 text-gray-300 hover:bg-gray-700 h-7 w-7 p-0"
                >
                  {isRunning ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <div className="h-screen flex">
          {/* Loading State */}
          {loading && (
            <div className="flex items-center justify-center w-full">
              <div className="text-center">
                <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
                <p className="text-muted-foreground">Loading exam...</p>
              </div>
            </div>
          )}

          {/* Exam Content */}
          {!loading && currentQ && (
            <div className="flex w-full bg-white">
              {/* Main Content - Real IELTS CD Style */}
              <div className="flex-1 bg-white border-r border-gray-300 h-screen overflow-y-auto">
                {/* Audio Player for Listening */}
                {selectedSection.id === "listening" && (
                  <div className="bg-gray-100 p-3 border-b border-gray-300">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <HeadphonesIcon className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-gray-800">Audio Player</span>
                        <span className="text-xs text-red-600 font-medium">(One-time play only)</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button 
                          size="sm" 
                          onClick={togglePlayPause} 
                          className={`rounded-full w-8 h-8 p-0 ${
                            isPlaying || hasPlayed 
                              ? "bg-gray-400 cursor-not-allowed" 
                              : "bg-blue-600 hover:bg-blue-700"
                          } text-white`}
                          disabled={isPlaying || hasPlayed}
                        >
                          {isPlaying ? <Pause className="h-3 w-3" /> : hasPlayed ? <VolumeX className="h-3 w-3" /> : <Play className="h-3 w-3" />}
                        </Button>
                        <span className="text-xs text-gray-600 font-mono">
                          {isPlaying ? "Playing..." : hasPlayed ? "Audio played" : "Auto-starting..."}
                        </span>
                      </div>
                    </div>
                    <audio
                      ref={audioRef}
                      src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav"
                      onPlay={() => {
                        setIsPlaying(true)
                        setHasPlayed(true)
                      }}
                      onPause={() => setIsPlaying(false)}
                      onEnded={() => setIsPlaying(false)}
                    />
                  </div>
                )}

                {/* Reading Passage for Reading */}
                {selectedSection.id === "reading" && (
                  <div className="bg-gray-100 p-3 border-b border-gray-300">
                    <div className="flex items-center gap-2 mb-2">
                      <BookOpen className="h-4 w-4 text-green-600" />
                      <span className="text-sm font-semibold text-gray-800">Reading Passage</span>
                    </div>
                    <div className="bg-white p-3 border border-gray-300 max-h-80 overflow-y-auto">
                      <h3 className="text-base font-semibold mb-3 text-gray-900">Cycling Holiday in Austria</h3>
                      <div className="text-xs text-gray-700 leading-relaxed space-y-2">
                        <p>
                          Austria offers some of the most spectacular cycling routes in Europe, with routes suitable for all levels of experience. The cycling holiday in Austria typically begins in early summer, around June, when the weather is most favorable for outdoor activities.
                        </p>
                        <p>
                          Group sizes are carefully managed to ensure a personal experience, with no more than 12 people in each cycling group. This allows for better interaction between participants and ensures that everyone receives individual attention from the guides.
                        </p>
                        <p>
                          Each day, the group cycles approximately 45 kilometers on average, taking in the stunning Alpine scenery and stopping at picturesque villages along the way. The routes are designed to be challenging but achievable, with plenty of rest stops and photo opportunities.
                        </p>
                        <p>
                          Accommodation is carefully selected to provide comfort after a day of cycling. Some of the hotels have a swimming pool, perfect for relaxing tired muscles, while others offer spa facilities. All accommodations are family-run establishments that provide authentic Austrian hospitality.
                        </p>
                        <p>
                          The holiday costs £1,200 per person without flights, which includes all accommodation, guided tours, and most meals. The package is designed to be comprehensive, covering everything except alcoholic beverages, which are available for purchase at each location.
                        </p>
                        <p>
                          Essential equipment includes a helmet, which is mandatory for all participants. Safety is our top priority, and we provide high-quality helmets for those who don't bring their own. Additionally, participants can get a discount on equipment at www.cycleaustria.com, our partner website.
                        </p>
                        <p>
                          Weather conditions in the Alps can be unpredictable, so it's possible that the route may change at short notice to ensure safety and enjoyment. Our experienced guides monitor conditions daily and make adjustments as necessary.
                        </p>
                        <p>
                          As part of the cultural experience, a guided tour of a local castle is arranged, providing insight into the rich history of the region. This is included in the package and offers a welcome break from cycling while enriching the overall experience.
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Reading Passage for Reading */}
                {selectedSection.id === "reading" && (
                  <Card className="mb-6">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <BookOpen className="h-5 w-5" />
                        Reading Passage
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="prose prose-sm max-w-none">
                        <h3 className="text-lg font-semibold mb-4">Cycling Holiday in Austria</h3>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          Austria offers some of the most spectacular cycling routes in Europe, with routes suitable for all levels of experience. The cycling holiday in Austria typically begins in early summer, around June, when the weather is most favorable for outdoor activities.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          Group sizes are carefully managed to ensure a personal experience, with no more than 12 people in each cycling group. This allows for better interaction between participants and ensures that everyone receives individual attention from the guides.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          Each day, the group cycles approximately 45 kilometers on average, taking in the stunning Alpine scenery and stopping at picturesque villages along the way. The routes are designed to be challenging but achievable, with plenty of rest stops and photo opportunities.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          Accommodation is carefully selected to provide comfort after a day of cycling. Some of the hotels have a swimming pool, perfect for relaxing tired muscles, while others offer spa facilities. All accommodations are family-run establishments that provide authentic Austrian hospitality.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          The holiday costs £1,200 per person without flights, which includes all accommodation, guided tours, and most meals. The package is designed to be comprehensive, covering everything except alcoholic beverages, which are available for purchase at each location.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          Essential equipment includes a helmet, which is mandatory for all participants. Safety is our top priority, and we provide high-quality helmets for those who don't bring their own. Additionally, participants can get a discount on equipment at www.cycleaustria.com, our partner website.
                        </p>
                        <p className="text-gray-700 leading-relaxed mb-4">
                          Weather conditions in the Alps can be unpredictable, so it's possible that the route may change at short notice to ensure safety and enjoyment. Our experienced guides monitor conditions daily and make adjustments as necessary.
                        </p>
                        <p className="text-gray-700 leading-relaxed">
                          As part of the cultural experience, a guided tour of a local castle is arranged, providing insight into the rich history of the region. This is included in the package and offers a welcome break from cycling while enriching the overall experience.
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                )}

                {/* Question - Real IELTS CD Style */}
                <div className="p-4 flex-1 overflow-y-auto">
                  <div className="mb-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 bg-blue-600 text-white rounded flex items-center justify-center">
                        <span className="text-xs font-semibold">{currentQuestion + 1}</span>
                      </div>
                      <span className="text-xs font-semibold text-gray-700">Question {currentQuestion + 1}</span>
                    </div>
                    {selectedSection.id === "writing" && (
                      <div className="text-xs text-gray-500">
                        Word count: {answers[currentQ.id]?.split(' ').length || 0}
                      </div>
                    )}
                  </div>
                  {renderQuestion(currentQ)}
                </div>
              </div>

              {/* Sidebar - Real IELTS CD Style */}
              <div className="w-80 bg-gray-100 border-l border-gray-300 h-screen overflow-y-auto">
                {/* Progress */}
                <div className="p-3 border-b border-gray-300">
                  <div className="flex items-center gap-2 mb-2">
                    <BarChart3 className="h-3 w-3 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-800">Progress</span>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <div className="flex justify-between text-xs mb-1">
                        <span className="text-gray-600">Answered</span>
                        <span className="font-semibold text-gray-800">{Object.keys(answers).length} / {examData.questions.length}</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-1">
                        <div 
                          className="bg-blue-600 h-1 rounded-full" 
                          style={{ width: `${(Object.keys(answers).length / examData.questions.length) * 100}%` }}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-1">
                      <div className="text-center p-1 bg-green-100 rounded border">
                        <p className="font-bold text-sm text-green-700">{Object.keys(answers).length}</p>
                        <p className="text-xs text-green-600">Answered</p>
                      </div>
                      <div className="text-center p-1 bg-blue-100 rounded border">
                        <p className="font-bold text-sm text-blue-700">{examData.questions.length - Object.keys(answers).length}</p>
                        <p className="text-xs text-blue-600">Remaining</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Navigation */}
                <div className="p-3 border-b border-gray-300">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-3 w-3 text-gray-600" />
                    <span className="text-sm font-semibold text-gray-800">Navigation</span>
                  </div>
                  <div className="grid grid-cols-6 gap-1">
                    {examData.questions.map((q: any, index: number) => (
                      <Button
                        key={q.id}
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentQuestion(index)}
                        className={`h-6 w-6 p-0 text-xs font-medium rounded border ${
                          currentQuestion === index 
                            ? "bg-blue-600 text-white border-blue-600" 
                            : answers[q.id] 
                              ? "bg-green-100 text-green-700 border-green-300" 
                              : "bg-white text-gray-600 border-gray-300 hover:bg-gray-50"
                        }`}
                      >
                        {index + 1}
                      </Button>
                    ))}
                  </div>
                  <div className="mt-2 flex items-center justify-center gap-2 text-xs text-gray-500">
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-blue-600 rounded"></div>
                      <span>Current</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-green-500 rounded"></div>
                      <span>Answered</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <div className="w-1.5 h-1.5 bg-gray-300 rounded"></div>
                      <span>Unanswered</span>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-3">
                  <div className="space-y-1">
                    <Button 
                      variant="outline" 
                      onClick={() => setCurrentQuestion(Math.max(0, currentQuestion - 1))}
                      disabled={currentQuestion === 0}
                      className="w-full border-gray-300 hover:bg-gray-100 text-gray-700 text-xs"
                      size="sm"
                    >
                      <ArrowLeft className="h-3 w-3 mr-1" />
                      Previous
                    </Button>
                    
                    <Button 
                      onClick={() => setCurrentQuestion(Math.min(examData.questions.length - 1, currentQuestion + 1))}
                      disabled={currentQuestion === examData.questions.length - 1}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs"
                      size="sm"
                    >
                      Next
                      <ArrowRight className="h-3 w-3 ml-1" />
                    </Button>
                    
                    <Separator />
                    
                    <Button 
                      onClick={handleSubmitExam}
                      className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold text-xs"
                      size="sm"
                    >
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Submit Test
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  // Results view
  if (currentView === "results" && examResults) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="container mx-auto px-4 py-8">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl mx-auto"
          >
            <Card className="rounded-3xl border-2">
              <CardHeader className="text-center">
                <div className="mx-auto w-20 h-20 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Award className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-3xl">Test Completed!</CardTitle>
                <CardDescription>
                  {selectedSection?.title} section results
                </CardDescription>
              </CardHeader>
              
              <CardContent className="space-y-6">
                {/* Score Display */}
                <div className="text-center">
                  <div className="text-6xl font-bold text-green-600 mb-2">{examResults.score}%</div>
                  <p className="text-muted-foreground">
                    {examResults.totalQuestions} questions, {examResults.correctAnswers} correct
                  </p>
                </div>

                <Progress value={examResults.score} className="h-3" />

                {/* Statistics */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <p className="text-2xl font-bold text-blue-600">{examResults.totalQuestions}</p>
                    <p className="text-sm text-muted-foreground">Total Questions</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <p className="text-2xl font-bold text-green-600">{examResults.correctAnswers}</p>
                    <p className="text-sm text-muted-foreground">Correct Answers</p>
                  </div>
                </div>

                {/* Detailed Results for Sentence Completion */}
                {examData?.questions?.some((q: any) => q.type === "Sentence Completion") && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-gray-900">Detailed Results</h3>
                    {examData.questions.map((question: any) => {
                      if (question.type === "Sentence Completion") {
                        return (
                          <div key={question.id} className="border rounded-lg p-4 bg-gray-50">
                            <h4 className="font-semibold text-gray-900 mb-3">
                              {question.questionTitle || "Sentence Completion"}
                            </h4>
                            <div className="space-y-2">
                              {[1, 2, 3, 4, 5].map((gapNumber) => {
                                const gapKey = `${question.id}_gap${gapNumber}`
                                const userAnswer = answers[gapKey]
                                const correctAnswer = question[`gap${gapNumber}`]
                                
                                if (!correctAnswer) return null
                                
                                const isCorrect = userAnswer && 
                                  userAnswer.toLowerCase().trim() === correctAnswer.toLowerCase().trim()
                                
                                return (
                                  <div key={gapNumber} className="flex items-center gap-3">
                                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                                      isCorrect ? 'bg-green-500' : 'bg-red-500'
                                    }`}>
                                      <span className="text-white text-xs font-semibold">{gapNumber}</span>
                                    </div>
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium">Your answer:</span>
                                        <span className={`text-sm ${isCorrect ? 'text-green-600' : 'text-red-600'}`}>
                                          {userAnswer || 'No answer'}
                                        </span>
                                      </div>
                                      {!isCorrect && (
                                        <div className="flex items-center gap-2 mt-1">
                                          <span className="text-sm font-medium">Correct:</span>
                                          <span className="text-sm text-green-600">{correctAnswer}</span>
                                        </div>
                                      )}
                                    </div>
                                    {isCorrect ? (
                                      <CheckCircle className="h-4 w-4 text-green-500" />
                                    ) : (
                                      <XCircle className="h-4 w-4 text-red-500" />
                                    )}
                                  </div>
                                )
                              })}
                            </div>
                          </div>
                        )
                      }
                      return null
                    })}
                  </div>
                )}

                {/* Time Spent */}
                <div className="text-center p-4 bg-orange-50 rounded-lg">
                  <Clock className="h-8 w-8 text-orange-600 mx-auto mb-2" />
                  <p className="text-lg font-medium">Time Spent</p>
                  <p className="text-2xl font-bold text-orange-600">{formatTime(examResults.timeSpent)}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button onClick={resetExam} variant="outline" className="flex-1">
                    <RotateCcw className="h-4 w-4 mr-2" />
                    Try Again
                  </Button>
                  <Button onClick={() => setCurrentView("overview")} className="flex-1">
                    <Eye className="h-4 w-4 mr-2" />
                    Other Sections
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    )
  }

  return null
} 