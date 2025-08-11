"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Plus,
  Trash2,
  Save,
  Eye,
  Upload,
  Volume2,
  FileAudio,
  AlertTriangle,
  CheckCircle,
  X,
  Play,
  Pause,
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
  [key: string]: any // For dynamic gap properties
}

interface ListeningSection {
  title: string
  audioUrl: string
  transcript?: string
  questions: ListeningQuestion[]
}

interface CreateListeningTestProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onTestCreate: (testData: any) => void
  editingTest?: any
  mode?: "create" | "edit"
}

export default function CreateListeningTest({
  isOpen,
  onOpenChange,
  onTestCreate,
  editingTest,
  mode = "create"
}: CreateListeningTestProps) {
  // Test metadata
  const [testTitle, setTestTitle] = useState("")
  const [testType, setTestType] = useState("Academic")
  const [testLevel, setTestLevel] = useState("Intermediate")
  const [timeLimit, setTimeLimit] = useState(30)

  // Sections
  const [sections, setSections] = useState<ListeningSection[]>([])
  const [currentSection, setCurrentSection] = useState<ListeningSection>({
    title: "",
    audioUrl: "",
    transcript: "",
    questions: []
  })

  // Current question
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
    instructions: "",
    questionTitle: "",
    notesText: "",
  })

  // Audio preview
  const [audioPreview, setAudioPreview] = useState<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)

  // Load editing data
  useEffect(() => {
    if (editingTest && mode === "edit") {
      setTestTitle(editingTest.title || "")
      setTestType(editingTest.type || "Academic")
      setTestLevel(editingTest.level || "Intermediate")
      setTimeLimit(editingTest.timeLimit || 30)
      setSections(editingTest.sections_data || [])
    }
  }, [editingTest, mode])

  const handleAudioUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const url = URL.createObjectURL(file)
      setCurrentSection(prev => ({ ...prev, audioUrl: url }))
      
      // Create audio preview
      const audio = new Audio(url)
      setAudioPreview(audio)
    }
  }

  const toggleAudioPreview = () => {
    if (audioPreview) {
      if (isPlaying) {
        audioPreview.pause()
      } else {
        audioPreview.play()
      }
      setIsPlaying(!isPlaying)
    }
  }

  const addQuestion = () => {
    if (!currentQuestion.question.trim()) {
      alert("Iltimos savol matnini kiriting!")
      return
    }

    if (currentQuestion.type === "Multiple Choice") {
      if (!currentQuestion.options || !currentQuestion.options.every(opt => opt.trim())) {
        alert("Iltimos barcha variantlarni to'ldiring!")
        return
      }
      if (currentQuestion.correct === undefined) {
        alert("Iltimos to'g'ri javobni belgilang!")
        return
      }
      setCurrentSection((prev) => ({
        ...prev,
        questions: [...prev.questions, { ...currentQuestion }],
      }))
      setCurrentQuestion({
        type: "Multiple Choice", question: "", options: ["", "", "", ""], correct: 0, correctAnswer: "",
        wordLimit: 2, alternativeAnswers: [], startTime: 0, endTime: 0,
        instructions: "", questionTitle: "", notesText: "",
      })
      return
    } else if (currentQuestion.type === "Sentence Completion") {
      if (!currentQuestion.questionTitle || !currentQuestion.questionTitle.trim()) {
        alert("Iltimos savol sarlavhasini kiriting!")
        return
      }
      if (!currentQuestion.instructions || !currentQuestion.instructions.trim()) {
        alert("Iltimos yo'riqnomani kiriting!")
        return
      }
      if (!currentQuestion.notesText || !currentQuestion.notesText.trim()) {
        alert("Iltimos eslatmalar matnini kiriting!")
        return
      }
      let hasGapAnswers = false
      for (let i = 1; i <= 5; i++) {
        const gapAnswer = currentQuestion[`gap${i}`]
        if (gapAnswer && gapAnswer.trim()) {
          hasGapAnswers = true
          break
        }
      }
      if (!hasGapAnswers) {
        alert("Iltimos kamida bitta gap javobini kiriting!")
        return
      }
      setCurrentSection((prev) => ({
        ...prev,
        questions: [...prev.questions, { ...currentQuestion }],
      }))
      setCurrentQuestion({
        type: "Multiple Choice", question: "", options: ["", "", "", ""], correct: 0, correctAnswer: "",
        wordLimit: 2, alternativeAnswers: [], startTime: 0, endTime: 0,
        instructions: "", questionTitle: "", notesText: "",
      })
      return
    } else {
      if (!currentQuestion.correctAnswer || !currentQuestion.correctAnswer.trim()) {
        alert("Iltimos to'g'ri javobni kiriting!")
        return
      }
      setCurrentSection((prev) => ({
        ...prev,
        questions: [...prev.questions, { ...currentQuestion }],
      }))
      setCurrentQuestion({
        type: "Multiple Choice", question: "", options: ["", "", "", ""], correct: 0, correctAnswer: "",
        wordLimit: 2, alternativeAnswers: [], startTime: 0, endTime: 0,
        instructions: "", questionTitle: "", notesText: "",
      })
    }
  }

  const addSection = () => {
    if (!currentSection.title.trim()) {
      alert("Iltimos bo'lim sarlavhasini kiriting!")
      return
    }
    if (!currentSection.audioUrl.trim()) {
      alert("Iltimos audio fayl yuklang!")
      return
    }
    if (currentSection.questions.length === 0) {
      alert("Kamida bitta savol qo'shing!")
      return
    }
    setSections([...sections, currentSection])
    setCurrentSection({
      title: "",
      audioUrl: "",
      transcript: "",
      questions: []
    })
  }

  const createTest = () => {
    if (!testTitle.trim()) {
      alert("Iltimos test sarlavhasini kiriting!")
      return
    }
    if (sections.length === 0) {
      alert("Kamida bitta bo'lim qo'shing!")
      return
    }

    // Validate all sections and questions
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      if (!section.title.trim()) {
        alert(`Bo'lim ${i + 1}: Iltimos bo'lim sarlavhasini kiriting!`)
        return
      }
      if (!section.audioUrl.trim()) {
        alert(`Bo'lim ${i + 1}: Iltimos audio fayl yuklang!`)
        return
      }
      if (section.questions.length === 0) {
        alert(`Bo'lim ${i + 1}: Kamida bitta savol qo'shing!`)
        return
      }
      for (let j = 0; j < section.questions.length; j++) {
        const question = section.questions[j]
        if (question.type === "Sentence Completion") {
          if (!question.questionTitle || !question.questionTitle.trim()) {
            alert(`Bo'lim ${i + 1}, Savol ${j + 1}: Iltimos savol sarlavhasini kiriting!`)
            return
          }
          if (!question.instructions || !question.instructions.trim()) {
            alert(`Bo'lim ${i + 1}, Savol ${j + 1}: Iltimos yo'riqnomani kiriting!`)
            return
          }
          if (!question.notesText || !question.notesText.trim()) {
            alert(`Bo'lim ${i + 1}, Savol ${j + 1}: Iltimos eslatmalar matnini kiriting!`)
            return
          }
          let hasGapAnswers = false
          for (let k = 1; k <= 5; k++) {
            const gapAnswer = question[`gap${k}`]
            if (gapAnswer && gapAnswer.trim()) {
              hasGapAnswers = true
              break
            }
          }
          if (!hasGapAnswers) {
            alert(`Bo'lim ${i + 1}, Savol ${j + 1}: Iltimos kamida bitta gap javobini kiriting!`)
            return
          }
        } else if (question.type === "Multiple Choice") {
          if (!question.options || !question.options.every(opt => opt.trim())) {
            alert(`Bo'lim ${i + 1}, Savol ${j + 1}: Iltimos barcha variantlarni to'ldiring!`)
            return
          }
          if (question.correct === undefined) {
            alert(`Bo'lim ${i + 1}, Savol ${j + 1}: Iltimos to'g'ri javobni belgilang!`)
            return
          }
        } else {
          if (!question.correctAnswer || !question.correctAnswer.trim()) {
            alert(`Bo'lim ${i + 1}, Savol ${j + 1}: Iltimos to'g'ri javobni kiriting!`)
            return
          }
        }
      }
    }

    const newTest = {
      title: testTitle,
      type: testType,
      level: testLevel,
      timeLimit: timeLimit,
      sections_data: sections,
      status: "Draft"
    }

    onTestCreate(newTest)
  }

  const renderQuestionInput = () => {
    switch (currentQuestion.type) {
      case "Multiple Choice":
        return (
          <div className="space-y-4">
            <div>
              <Label>Savol matni</Label>
              <Textarea
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Savol matnini kiriting..."
                rows={3}
              />
            </div>
            
            <div>
              <Label>Variantlar</Label>
              <div className="space-y-2">
                {currentQuestion.options?.map((option, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="correct"
                      checked={currentQuestion.correct === index}
                      onChange={() => setCurrentQuestion(prev => ({ ...prev, correct: index }))}
                      className="w-4 h-4"
                    />
                    <Input
                      value={option}
                      onChange={(e) => {
                        const newOptions = [...(currentQuestion.options || [])]
                        newOptions[index] = e.target.value
                        setCurrentQuestion(prev => ({ ...prev, options: newOptions }))
                      }}
                      placeholder={`Variant ${String.fromCharCode(65 + index)}`}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "Sentence Completion":
        return (
          <div className="space-y-4">
            <div>
              <Label>Savol sarlavhasi</Label>
              <Input
                value={currentQuestion.questionTitle}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, questionTitle: e.target.value }))}
                placeholder="Savol sarlavhasini kiriting..."
              />
            </div>
            
            <div>
              <Label>Yo'riqnoma</Label>
              <Textarea
                value={currentQuestion.instructions}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, instructions: e.target.value }))}
                placeholder="Yo'riqnomani kiriting..."
                rows={2}
              />
            </div>
            
            <div>
              <Label>Eslatmalar matni</Label>
              <Textarea
                value={currentQuestion.notesText}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, notesText: e.target.value }))}
                placeholder="Eslatmalar matnini kiriting..."
                rows={6}
              />
            </div>
            
            <div>
              <Label>Gap javoblari</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4, 5].map((gapNumber) => (
                  <div key={gapNumber} className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-red-600 text-white rounded flex items-center justify-center">
                      <span className="text-xs font-semibold">{gapNumber}</span>
                    </div>
                    <Input
                      value={currentQuestion[`gap${gapNumber}`] || ""}
                      onChange={(e) => setCurrentQuestion(prev => ({ ...prev, [`gap${gapNumber}`]: e.target.value }))}
                      placeholder="Javob..."
                    />
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <Label>So'zlar chegarasi</Label>
              <Input
                type="number"
                value={currentQuestion.wordLimit}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, wordLimit: parseInt(e.target.value) }))}
                min={1}
                max={10}
              />
            </div>
          </div>
        )

      default:
        return (
          <div className="space-y-4">
            <div>
              <Label>Savol matni</Label>
              <Textarea
                value={currentQuestion.question}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, question: e.target.value }))}
                placeholder="Savol matnini kiriting..."
                rows={3}
              />
            </div>
            
            <div>
              <Label>To'g'ri javob</Label>
              <Input
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion(prev => ({ ...prev, correctAnswer: e.target.value }))}
                placeholder="To'g'ri javobni kiriting..."
              />
            </div>
          </div>
        )
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">
            {mode === "edit" ? "Listening Testni Tahrirlash" : "Yangi Listening Test Yaratish"}
          </DialogTitle>
          <DialogDescription>
            IELTS Listening testini yarating va sozlang
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Left Column - Test Configuration */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Test Ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Test sarlavhasi</Label>
                  <Input
                    value={testTitle}
                    onChange={(e) => setTestTitle(e.target.value)}
                    placeholder="Test sarlavhasini kiriting..."
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Test turi</Label>
                    <Select value={testType} onValueChange={setTestType}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="General Training">General Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label>Daraja</Label>
                    <Select value={testLevel} onValueChange={setTestLevel}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Beginner">Beginner</SelectItem>
                        <SelectItem value="Intermediate">Intermediate</SelectItem>
                        <SelectItem value="Advanced">Advanced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div>
                  <Label>Vaqt chegarasi (daqiqa)</Label>
                  <Input
                    type="number"
                    value={timeLimit}
                    onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                    min={10}
                    max={120}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Section */}
            <Card>
              <CardHeader>
                <CardTitle>Bo'lim Ma'lumotlari</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Bo'lim sarlavhasi</Label>
                  <Input
                    value={currentSection.title}
                    onChange={(e) => setCurrentSection(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Bo'lim sarlavhasini kiriting..."
                  />
                </div>
                
                <div>
                  <Label>Audio fayl</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      type="file"
                      accept="audio/*"
                      onChange={handleAudioUpload}
                      className="flex-1"
                    />
                    {currentSection.audioUrl && (
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={toggleAudioPreview}
                      >
                        {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      </Button>
                    )}
                  </div>
                </div>
                
                <div>
                  <Label>Transkript (ixtiyoriy)</Label>
                  <Textarea
                    value={currentSection.transcript}
                    onChange={(e) => setCurrentSection(prev => ({ ...prev, transcript: e.target.value }))}
                    placeholder="Audio transkriptini kiriting..."
                    rows={4}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Current Question */}
            <Card>
              <CardHeader>
                <CardTitle>Savol Qo'shish</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>Savol turi</Label>
                  <Select
                    value={currentQuestion.type}
                    onValueChange={(value) => setCurrentQuestion(prev => ({ ...prev, type: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Multiple Choice">Multiple Choice</SelectItem>
                      <SelectItem value="Sentence Completion">Sentence Completion</SelectItem>
                      <SelectItem value="Form Completion">Form Completion</SelectItem>
                      <SelectItem value="Table Completion">Table Completion</SelectItem>
                      <SelectItem value="Flow-chart Completion">Flow-chart Completion</SelectItem>
                      <SelectItem value="Summary Completion">Summary Completion</SelectItem>
                      <SelectItem value="Note Completion">Note Completion</SelectItem>
                      <SelectItem value="Labeling a Map">Labeling a Map</SelectItem>
                      <SelectItem value="Labeling a Plan">Labeling a Plan</SelectItem>
                      <SelectItem value="Labeling a Diagram">Labeling a Diagram</SelectItem>
                      <SelectItem value="Matching">Matching</SelectItem>
                      <SelectItem value="Short Answer">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                {renderQuestionInput()}
                
                <Button onClick={addQuestion} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Savol Qo'shish
                </Button>
              </CardContent>
            </Card>

            <Button onClick={addSection} className="w-full">
              <Plus className="h-4 w-4 mr-2" />
              Bo'lim Qo'shish
            </Button>
          </div>

          {/* Right Column - Preview and Sections */}
          <div className="space-y-6">
            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Ko'rinish</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <h3 className="text-lg font-semibold">{testTitle || "Test sarlavhasi"}</h3>
                    <p className="text-sm text-muted-foreground">
                      {testType} • {testLevel} • {timeLimit} daqiqa
                    </p>
                  </div>
                  
                  <Separator />
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Bo'limlar:</span>
                      <Badge>{sections.length}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium">Jami savollar:</span>
                      <Badge>
                        {sections.reduce((total, section) => total + section.questions.length, 0)}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Sections List */}
            <Card>
              <CardHeader>
                <CardTitle>Bo'limlar</CardTitle>
              </CardHeader>
              <CardContent>
                {sections.length === 0 ? (
                  <p className="text-muted-foreground text-center py-4">
                    Hozircha bo'limlar yo'q
                  </p>
                ) : (
                  <div className="space-y-4">
                    {sections.map((section, sectionIndex) => (
                      <div key={sectionIndex} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-semibold">Bo'lim {sectionIndex + 1}: {section.title}</h4>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSections(sections.filter((_, i) => i !== sectionIndex))
                            }}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <FileAudio className="h-4 w-4" />
                            <span>Audio: {section.audioUrl ? "Yuklangan" : "Yo'q"}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Savollar: {section.questions.length}</span>
                          </div>
                          
                          {/* Questions Preview */}
                          <div className="space-y-1">
                            {section.questions.map((question, questionIndex) => (
                              <div key={questionIndex} className="flex items-center gap-2 text-sm">
                                <div className="w-4 h-4 bg-blue-100 text-blue-600 rounded flex items-center justify-center">
                                  <span className="text-xs">{questionIndex + 1}</span>
                                </div>
                                <span className="text-muted-foreground">{question.type}</span>
                                {question.questionTitle && (
                                  <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                                    {question.questionTitle}
                                  </span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Current Section Questions */}
            {currentSection.questions.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle>Joriy Bo'lim Savollari</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {currentSection.questions.map((question, questionIndex) => (
                      <div key={questionIndex} className="flex items-center justify-between p-2 border rounded">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-blue-600 text-white rounded flex items-center justify-center">
                            <span className="text-xs">{questionIndex + 1}</span>
                          </div>
                          <span className="text-sm">{question.type}</span>
                          {question.questionTitle && (
                            <span className="text-xs bg-red-100 text-red-600 px-2 py-1 rounded">
                              {question.questionTitle}
                            </span>
                          )}
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setCurrentSection(prev => ({
                              ...prev,
                              questions: prev.questions.filter((_, i) => i !== questionIndex)
                            }))
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-4 pt-6 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Bekor qilish
          </Button>
          <Button onClick={createTest}>
            <Save className="h-4 w-4 mr-2" />
            {mode === "edit" ? "Yangilash" : "Test Yaratish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
