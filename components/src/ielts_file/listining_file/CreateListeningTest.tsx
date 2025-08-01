"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Plus, Trash2, CheckCircle, XCircle, Volume2, Play, Pause } from "lucide-react"

// Types
type ListeningQuestion = {
  type: string
  question: string
  options?: string[]
  correct?: number
  correctAnswer?: string
  wordLimit?: number
  alternativeAnswers?: string[]
  startTime?: number // Audio vaqti (soniyalarda)
  endTime?: number
}

type ListeningSection = {
  title: string
  audioUrl: string
  transcript?: string
  questions: ListeningQuestion[]
}

type NewListeningTestType = {
  title: string
  type: string
  level: string
  timeLimit: number
  sections: ListeningSection[]
}

interface CreateListeningTestProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onTestCreate: (test: any) => void
  editingTest?: any
  mode?: "create" | "edit"
}

export default function CreateListeningTest({ isOpen, onOpenChange, onTestCreate, editingTest, mode = "create" }: CreateListeningTestProps) {
  const [newTest, setNewTest] = useState<NewListeningTestType>({
    title: "",
    type: "Academic",
    level: "Intermediate",
    timeLimit: 30,
    sections: [],
  })

  const [currentSection, setCurrentSection] = useState<{
    title: string
    audioUrl: string
    transcript: string
    questions: ListeningQuestion[]
  }>({
    title: "",
    audioUrl: "",
    transcript: "",
    questions: [],
  })

  const [currentQuestion, setCurrentQuestion] = useState<ListeningQuestion>({
    type: "Multiple Choice",
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    correctAnswer: "",
    wordLimit: 2,
    alternativeAnswers: [],
    startTime: 0,
    endTime: 0,
  })

  const [audioFile, setAudioFile] = useState<File | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [audioElement, setAudioElement] = useState<HTMLAudioElement | null>(null)

  // Initialize form with editing data
  useEffect(() => {
    if (mode === "edit" && editingTest) {
      setNewTest({
        title: editingTest.title,
        type: editingTest.type,
        level: editingTest.level,
        timeLimit: editingTest.timeLimit,
        sections: editingTest.sections_data || [],
      })
    } else {
      // Reset form for create mode
      setNewTest({
        title: "",
        type: "Academic",
        level: "Intermediate",
        timeLimit: 30,
        sections: [],
      })
    }
  }, [mode, editingTest, isOpen])

  const questionTypes = [
    "Multiple Choice",
    "Form Completion",
    "Note Completion",
    "Table Completion",
    "Flow-chart Completion",
    "Summary Completion",
    "Sentence Completion",
    "Short Answer Questions",
    "Matching",
    "Plan/Map/Diagram Labelling",
  ]

  // Handle audio file upload
  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith("audio/")) {
      setAudioFile(file)
      const audioUrl = URL.createObjectURL(file)
      setCurrentSection((prev) => ({
        ...prev,
        audioUrl: audioUrl,
      }))

      // Create audio element for playback
      const audio = new Audio(audioUrl)
      setAudioElement(audio)
    } else {
      alert("Iltimos, audio fayl tanlang!")
    }
  }

  // Play/pause audio
  const toggleAudio = () => {
    if (audioElement) {
      if (isPlaying) {
        audioElement.pause()
      } else {
        audioElement.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  // Helper function to process answers
  const processAnswers = (answerText: string) => {
    if (!answerText || !answerText.trim()) return []

    const answers = answerText
      .split(/[,;]|\s+or\s+/i)
      .map((answer) => answer.trim().toLowerCase())
      .filter((answer) => answer.length > 0)

    return [...new Set(answers)]
  }

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert("Iltimos savol matnini kiriting!")
      return
    }

    // Additional validation based on question type
    if (currentQuestion.type === "Multiple Choice") {
      if (!currentQuestion.options?.every((opt) => opt.trim())) {
        alert("Barcha variantlarni to'ldiring!")
        return
      }
    } else if (
      ["Form Completion", "Note Completion", "Table Completion", "Sentence Completion"].includes(currentQuestion.type)
    ) {
      if (!currentQuestion.correctAnswer || !currentQuestion.correctAnswer.trim()) {
        alert("To'g'ri javobni kiriting!")
        return
      }

      // Process multiple answers
      const processedAnswers = processAnswers(currentQuestion.correctAnswer)
      if (processedAnswers.length === 0) {
        alert("Kamida bitta to'g'ri javob kiriting!")
        return
      }

      const updatedQuestion = {
        ...currentQuestion,
        correctAnswer: processedAnswers[0],
        alternativeAnswers: processedAnswers.slice(1),
      }

      setCurrentSection((prev) => ({
        ...prev,
        questions: [...prev.questions, updatedQuestion],
      }))

      // Reset current question
      setCurrentQuestion({
        type: "Multiple Choice",
        question: "",
        options: ["", "", "", ""],
        correct: 0,
        correctAnswer: "",
        wordLimit: 2,
        alternativeAnswers: [],
        startTime: 0,
        endTime: 0,
      })
      return
    }

    setCurrentSection((prev) => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion }],
    }))

    // Reset current question
    setCurrentQuestion({
      type: "Multiple Choice",
      question: "",
      options: ["", "", "", ""],
      correct: 0,
      correctAnswer: "",
      wordLimit: 2,
      alternativeAnswers: [],
      startTime: 0,
      endTime: 0,
    })
  }

  const addSection = () => {
    if (!currentSection.title.trim()) {
      alert("Iltimos bo'lim sarlavhasini kiriting!")
      return
    }
    if (!currentSection.audioUrl) {
      alert("Iltimos audio fayl yuklang!")
      return
    }
    if (currentSection.questions.length === 0) {
      alert("Kamida bitta savol qo'shing!")
      return
    }

    setNewTest((prev) => ({
      ...prev,
      sections: [...prev.sections, { ...currentSection }],
    }))

    // Reset current section
    setCurrentSection({
      title: "",
      audioUrl: "",
      transcript: "",
      questions: [],
    })
    setAudioFile(null)
    setAudioElement(null)
    setIsPlaying(false)
  }

  const createTest = async () => {
    if (!newTest.title.trim()) {
      alert("Iltimos test nomini kiriting!")
      return
    }
    if (newTest.sections.length === 0) {
      alert("Kamida bitta bo'lim qo'shing!")
      return
    }

    const testData = {
      title: newTest.title,
      type: newTest.type,
      level: newTest.level,
      sections: newTest.sections.length,
      questions: newTest.sections.reduce((total, section) => total + section.questions.length, 0),
      timeLimit: newTest.timeLimit,
      status: "Draft",
      sections_data: newTest.sections,
    }

    try {
      await onTestCreate(testData)

      // Reset form
      setNewTest({
        title: "",
        type: "Academic",
        level: "Intermediate",
        timeLimit: 30,
        sections: [],
      })

      // Close dialog
      onOpenChange(false)
    } catch (error) {
      console.error("Test saqlashda xatolik:", error)
      alert("Test saqlashda xatolik yuz berdi!")
    }
  }

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case "Multiple Choice":
        return (
          <div className="space-y-2">
            <Label>Javob Variantlari</Label>
            {currentQuestion.options?.map((option, index) => (
              <div key={index} className="flex gap-2 items-center">
                <Input
                  placeholder={`Variant ${index + 1}`}
                  value={option}
                  onChange={(e) => {
                    const newOptions = [...(currentQuestion.options || [])]
                    newOptions[index] = e.target.value
                    setCurrentQuestion({ ...currentQuestion, options: newOptions })
                  }}
                />
                <Button
                  type="button"
                  variant={currentQuestion.correct === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestion({ ...currentQuestion, correct: index })}
                >
                  {currentQuestion.correct === index ? (
                    <CheckCircle className="h-4 w-4" />
                  ) : (
                    <XCircle className="h-4 w-4" />
                  )}
                </Button>
              </div>
            ))}
          </div>
        )

      case "Form Completion":
      case "Note Completion":
      case "Table Completion":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>To'g'ri Javob(lar)</Label>
                <Textarea
                  placeholder="manager, supervisor, boss"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                  className="min-h-[60px]"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Bir nechta to'g'ri javob bo'lsa, vergul bilan ajrating
                </p>
              </div>
              <div className="space-y-2">
                <Label>So'z Chegarasi</Label>
                <Select
                  value={currentQuestion.wordLimit?.toString()}
                  onValueChange={(value) =>
                    setCurrentQuestion({ ...currentQuestion, wordLimit: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">NO MORE THAN ONE WORD</SelectItem>
                    <SelectItem value="2">NO MORE THAN TWO WORDS</SelectItem>
                    <SelectItem value="3">NO MORE THAN THREE WORDS</SelectItem>
                    <SelectItem value="4">NO MORE THAN FOUR WORDS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Audio timing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Boshlanish vaqti (soniya)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={currentQuestion.startTime}
                  onChange={(e) =>
                    setCurrentQuestion({ ...currentQuestion, startTime: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tugash vaqti (soniya)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={currentQuestion.endTime}
                  onChange={(e) =>
                    setCurrentQuestion({ ...currentQuestion, endTime: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <Label className="text-sm font-medium">Ko'rinishi:</Label>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Savol:</span> {currentQuestion.question || "Savol kiritilmagan"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Audio: {currentQuestion.startTime}s - {currentQuestion.endTime}s
                </p>

                {currentQuestion.correctAnswer && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-xs">
                    <span className="font-medium text-green-800">To'g'ri javoblar:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {processAnswers(currentQuestion.correctAnswer).map((answer, index) => (
                        <Badge key={index} variant="outline" className="text-green-700 border-green-300">
                          {answer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )

      case "Sentence Completion":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Gap to'ldirish savoli</Label>
              <Input
                placeholder="Durbek ___ my brother"
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                className="font-mono"
              />
              <p className="text-xs text-muted-foreground">
                💡 Underscore (___) yoki gap belgisi ishlatib, to'ldiriladigan joyni belgilang
              </p>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>To'g'ri Javob(lar)</Label>
                <Textarea
                  placeholder="is, was, will be"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                  className="min-h-[60px]"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Bir nechta to'g'ri javob bo'lsa, vergul bilan ajrating
                </p>
              </div>
              <div className="space-y-2">
                <Label>So'z Chegarasi</Label>
                <Select
                  value={currentQuestion.wordLimit?.toString()}
                  onValueChange={(value) =>
                    setCurrentQuestion({ ...currentQuestion, wordLimit: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">NO MORE THAN ONE WORD</SelectItem>
                    <SelectItem value="2">NO MORE THAN TWO WORDS</SelectItem>
                    <SelectItem value="3">NO MORE THAN THREE WORDS</SelectItem>
                    <SelectItem value="4">NO MORE THAN FOUR WORDS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Audio timing */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Boshlanish vaqti (soniya)</Label>
                <Input
                  type="number"
                  placeholder="0"
                  value={currentQuestion.startTime}
                  onChange={(e) =>
                    setCurrentQuestion({ ...currentQuestion, startTime: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Tugash vaqti (soniya)</Label>
                <Input
                  type="number"
                  placeholder="30"
                  value={currentQuestion.endTime}
                  onChange={(e) =>
                    setCurrentQuestion({ ...currentQuestion, endTime: Number.parseInt(e.target.value) || 0 })
                  }
                />
              </div>
            </div>

            {/* Preview */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <Label className="text-sm font-medium">Ko'rinishi:</Label>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Savol:</span> {currentQuestion.question || "Savol kiritilmagan"}
                </p>
                {currentQuestion.question && (
                  <div className="p-3 bg-blue-50 rounded border">
                    <p className="text-sm font-mono">
                      {currentQuestion.question.replace(/___/g, '_____')}
                    </p>
                  </div>
                )}
                <p className="text-xs text-muted-foreground">
                  Audio: {currentQuestion.startTime}s - {currentQuestion.endTime}s
                </p>

                {currentQuestion.correctAnswer && (
                  <div className="mt-2 p-2 bg-green-100 rounded text-xs">
                    <span className="font-medium text-green-800">To'g'ri javoblar:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {processAnswers(currentQuestion.correctAnswer).map((answer, index) => (
                        <Badge key={index} variant="outline" className="text-green-700 border-green-300">
                          {answer}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
                 )

      case "Short Answer Questions":
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>To'g'ri Javob</Label>
                <Input
                  placeholder="library"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({ ...currentQuestion, correctAnswer: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>So'z Chegarasi</Label>
                <Select
                  value={currentQuestion.wordLimit?.toString()}
                  onValueChange={(value) =>
                    setCurrentQuestion({ ...currentQuestion, wordLimit: Number.parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">NO MORE THAN ONE WORD</SelectItem>
                    <SelectItem value="2">NO MORE THAN TWO WORDS</SelectItem>
                    <SelectItem value="3">NO MORE THAN THREE WORDS</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        )

      default:
        return (
          <div className="p-4 bg-yellow-50 rounded-lg">
            <p className="text-sm text-yellow-800">
              Bu savol turi uchun interfeys hali tayyor emas. Iltimos, boshqa savol turini tanlang.
            </p>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Volume2 className="h-5 w-5" />
            {mode === "edit" ? "Listening Testni Tahrirlash" : "Yangi Listening Test Yaratish"}
          </DialogTitle>
          <DialogDescription>
            {mode === "edit" ? "IELTS Listening testini tahrirlash" : "IELTS Listening testi uchun ma'lumotlarni kiriting"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Asosiy Ma'lumotlar</TabsTrigger>
            <TabsTrigger value="sections">Bo'limlar</TabsTrigger>
            <TabsTrigger value="preview">Ko'rish</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Test Nomi</Label>
                <Input
                  placeholder="Listening Test 1"
                  value={newTest.title}
                  onChange={(e) => setNewTest({ ...newTest, title: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Test Turi</Label>
                <Select value={newTest.type} onValueChange={(value) => setNewTest({ ...newTest, type: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Academic">Academic</SelectItem>
                    <SelectItem value="General Training">General Training</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Qiyinchilik Darajasi</Label>
                <Select value={newTest.level} onValueChange={(value) => setNewTest({ ...newTest, level: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Beginner">Boshlang'ich</SelectItem>
                    <SelectItem value="Intermediate">O'rta</SelectItem>
                    <SelectItem value="Advanced">Yuqori</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Vaqt Chegarasi (daqiqa)</Label>
                <Input
                  type="number"
                  value={newTest.timeLimit}
                  onChange={(e) => setNewTest({ ...newTest, timeLimit: Number.parseInt(e.target.value) || 30 })}
                  min="1"
                  max="60"
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="sections" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Bo'lim Qo'shish</h3>
                <Badge variant="outline">{newTest.sections.length} ta bo'lim qo'shilgan</Badge>
              </div>

              <div className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Bo'lim Sarlavhasi</Label>
                  <Input
                    placeholder="Section 1: Conversation about booking"
                    value={currentSection.title}
                    onChange={(e) => setCurrentSection({ ...currentSection, title: e.target.value })}
                  />
                </div>

                {/* Audio Upload */}
                <div className="space-y-2">
                  <Label>Audio Fayl</Label>
                  <div className="flex items-center gap-2">
                    <Input type="file" accept="audio/*" onChange={handleAudioUpload} className="flex-1" />
                    {audioElement && (
                      <Button type="button" variant="outline" size="sm" onClick={toggleAudio}>
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                  {audioFile && <p className="text-sm text-green-600">✓ {audioFile.name} yuklandi</p>}
                </div>

                {/* Transcript (optional) */}
                <div className="space-y-2">
                  <Label>Transkripsiya (ixtiyoriy)</Label>
                  <Textarea
                    placeholder="Audio matnini kiriting..."
                    className="min-h-[100px]"
                    value={currentSection.transcript}
                    onChange={(e) => setCurrentSection({ ...currentSection, transcript: e.target.value })}
                  />
                </div>

                <Separator />

                <div className="space-y-4">
                  <h4 className="font-medium">Savollar ({currentSection.questions.length} ta)</h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Savol Turi</Label>
                      <Select
                        value={currentQuestion.type}
                        onValueChange={(value) => setCurrentQuestion({ ...currentQuestion, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypes.map((type) => (
                            <SelectItem key={type} value={type}>
                              {type}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {currentQuestion.type !== "Sentence Completion" && (
                    <div className="space-y-2">
                      <Label>Savol</Label>
                      <Textarea
                        placeholder="Savolni kiriting..."
                        value={currentQuestion.question}
                        onChange={(e) => setCurrentQuestion({ ...currentQuestion, question: e.target.value })}
                      />
                    </div>
                  )}

                  {renderQuestionInput()}

                  <Button onClick={addQuestion} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Savol Qo'shish
                  </Button>

                  {/* Display added questions */}
                  {currentSection.questions.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Qo'shilgan Savollar:</Label>
                      {currentSection.questions.map((q, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded border">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Badge variant="outline" className="mb-2">
                                {q.type}
                              </Badge>
                              <p className="text-sm font-medium">{q.question}</p>
                              {q.correctAnswer && (
                                <div className="mt-2">
                                  <span className="text-xs text-green-600 font-medium">To'g'ri: </span>
                                  <Badge variant="outline" className="text-green-700 border-green-300 text-xs">
                                    {q.correctAnswer}
                                  </Badge>
                                  {q.alternativeAnswers && q.alternativeAnswers.length > 0 && (
                                    <span className="ml-2">
                                      {q.alternativeAnswers.map((alt, idx) => (
                                        <Badge
                                          key={idx}
                                          variant="outline"
                                          className="text-green-600 border-green-200 text-xs ml-1"
                                        >
                                          {alt}
                                        </Badge>
                                      ))}
                                    </span>
                                  )}
                                </div>
                              )}
                              {q.startTime !== undefined && q.endTime !== undefined && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Audio: {q.startTime}s - {q.endTime}s
                                </p>
                              )}
                            </div>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                const updatedQuestions = [...currentSection.questions]
                                updatedQuestions.splice(index, 1)
                                setCurrentSection({ ...currentSection, questions: updatedQuestions })
                              }}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex justify-end">
                  <Button
                    onClick={addSection}
                    disabled={
                      !currentSection.title || !currentSection.audioUrl || currentSection.questions.length === 0
                    }
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Bo'limni Saqlash
                  </Button>
                </div>
              </div>

              {/* Display added sections */}
              {newTest.sections.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Qo'shilgan Bo'limlar:</Label>
                  {newTest.sections.map((section, index) => (
                    <Card key={index} className="rounded-lg">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{section.title}</h4>
                            <p className="text-sm text-muted-foreground">{section.questions.length} ta savol</p>
                            <div className="flex items-center gap-2 mt-1">
                              <Volume2 className="h-3 w-3 text-blue-600" />
                              <span className="text-xs text-muted-foreground">Audio yuklangan</span>
                            </div>
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const updatedSections = [...newTest.sections]
                              updatedSections.splice(index, 1)
                              setNewTest({ ...newTest, sections: updatedSections })
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </TabsContent>

          <TabsContent value="preview" className="space-y-4">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Test Haqida</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm text-muted-foreground">Nomi</Label>
                  <p className="font-medium">{newTest.title || "Noma'lum"}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Turi</Label>
                  <Badge>{newTest.type}</Badge>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Daraja</Label>
                  <p className="font-medium">{newTest.level}</p>
                </div>
                <div>
                  <Label className="text-sm text-muted-foreground">Vaqt</Label>
                  <p className="font-medium">{newTest.timeLimit} daqiqa</p>
                </div>
              </div>

              <Separator />

              <div>
                <Label className="text-sm text-muted-foreground">Bo'limlar va Savollar</Label>
                {newTest.sections.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-2">Hech qanday bo'lim qo'shilmagan</p>
                ) : (
                  newTest.sections.map((section, index) => (
                    <div key={index} className="mt-2 p-3 border rounded">
                      <h4 className="font-medium">{section.title}</h4>
                      <p className="text-sm text-muted-foreground">{section.questions.length} ta savol</p>
                      <div className="mt-2 space-y-1">
                        {section.questions.map((q, qIndex) => (
                          <div key={qIndex} className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">
                              {q.type}
                            </Badge>
                            <span className="text-xs text-muted-foreground">{q.question.substring(0, 50)}...</span>
                            {q.type === "Form Completion" && q.correctAnswer && (
                              <div className="ml-auto">
                                <Badge variant="outline" className="text-green-700 border-green-300 text-xs">
                                  {q.correctAnswer}
                                </Badge>
                                {q.alternativeAnswers && q.alternativeAnswers.length > 0 && (
                                  <span className="text-xs text-muted-foreground ml-1">
                                    +{q.alternativeAnswers.length}
                                  </span>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" onClick={() => onOpenChange(false)}>
                  Bekor Qilish
                </Button>
                <Button onClick={createTest} disabled={!newTest.title.trim() || newTest.sections.length === 0}>
                  {mode === "edit" ? "Testni Yangilash" : "Test Yaratish"}
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
