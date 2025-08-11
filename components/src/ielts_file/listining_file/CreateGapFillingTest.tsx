"use client"

import { useState } from "react"
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
  FileText,
  AlertTriangle,
  CheckCircle,
  X,
  Settings,
  List,
} from "lucide-react"

// Types
interface GapFillingQuestion {
  id: number
  gapNumber: number
  correctAnswer: string
  alternativeAnswers?: string[]
  wordLimit?: number
}

interface GapFillingSection {
  title: string
  content: string
  questions: GapFillingQuestion[]
}

interface CreateGapFillingTestProps {
  isOpen?: boolean
  onOpenChange?: (open: boolean) => void
  onTestCreate?: (testData: any) => void
  onCancel?: () => void
  onTestCreated?: () => void
  editingTest?: any
  mode?: "create" | "edit"
}

export default function CreateGapFillingTest({
  isOpen,
  onOpenChange,
  onTestCreate,
  onCancel,
  onTestCreated,
  editingTest,
  mode = "create"
}: CreateGapFillingTestProps) {
  // Test metadata
  const [testTitle, setTestTitle] = useState("")
  const [testType, setTestType] = useState("Academic")
  const [testLevel, setTestLevel] = useState("Intermediate")
  const [timeLimit, setTimeLimit] = useState(30)
  const [totalGaps, setTotalGaps] = useState(5)
  const [instructions, setInstructions] = useState("Complete the notes below.")
  const [wordLimitInstruction, setWordLimitInstruction] = useState("Choose ONE WORD ONLY from the passage for each answer.")
  const [answerSheetInstruction, setAnswerSheetInstruction] = useState("Write your answers in boxes 1-5 on your answer sheet.")

  // Sections
  const [sections, setSections] = useState<GapFillingSection[]>([
    {
      title: "Discovery",
      content: "Qumran, 1945/7\n• three Bedouin shepherds in their teens were near an opening on side of cliff\n• heard a noise of breaking when one teenager threw a [1]\n• teenagers went into the [2] and found a number of containers made of [3]",
      questions: [
        { id: 1, gapNumber: 1, correctAnswer: "", wordLimit: 1 },
        { id: 2, gapNumber: 2, correctAnswer: "", wordLimit: 1 },
        { id: 3, gapNumber: 3, correctAnswer: "", wordLimit: 1 }
      ]
    },
    {
      title: "The scrolls",
      content: "• date from between 150 BCE and 70 CE\n• thought to have been written by group of people known as the [4]\n• written mainly in the [5] language\n• most are on religious topics, written using ink on parchment or papyrus",
      questions: [
        { id: 4, gapNumber: 4, correctAnswer: "", wordLimit: 1 },
        { id: 5, gapNumber: 5, correctAnswer: "", wordLimit: 1 }
      ]
    }
  ])

  const [currentSection, setCurrentSection] = useState<GapFillingSection>({
    title: "",
    content: "",
    questions: []
  })

  const [editingSectionIndex, setEditingSectionIndex] = useState<number | null>(null)

  // Preview mode
  const [previewMode, setPreviewMode] = useState(false)

  // Handle section changes
  const handleSectionChange = (index: number, field: keyof GapFillingSection, value: any) => {
    const newSections = [...sections]
    newSections[index] = { ...newSections[index], [field]: value }
    
    // If content changed, auto-update questions
    if (field === 'content') {
      const gapMatches = value.match(/\[(\d+)\]/g)
      if (gapMatches) {
        const questions = gapMatches.map((match, qIndex) => {
          const gapNumber = parseInt(match.replace(/[\[\]]/g, ''))
          // Try to preserve existing answers
          const existingQuestion = newSections[index].questions.find(q => q.gapNumber === gapNumber)
          return {
            id: existingQuestion?.id || Date.now() + qIndex,
            gapNumber,
            correctAnswer: existingQuestion?.correctAnswer || "",
            wordLimit: existingQuestion?.wordLimit || 1
          }
        })
        newSections[index].questions = questions
      } else {
        newSections[index].questions = []
      }
    }
    
    setSections(newSections)
  }



  // Get next available gap number
  const getNextGapNumber = () => {
    const allGaps = sections.flatMap(section => section.questions.map(q => q.gapNumber))
    return allGaps.length > 0 ? Math.max(...allGaps) + 1 : 1
  }

  // Validate content format
  const validateContent = (content: string) => {
    const gapMatches = content.match(/\[(\d+)\]/g)
    if (!gapMatches) {
      return { isValid: false, message: "Matnda hech qanday gap topilmadi. [1], [2] formatini ishlating." }
    }
    
    const gapNumbers = gapMatches.map(match => parseInt(match.replace(/[\[\]]/g, '')))
    const duplicates = gapNumbers.filter((num, index) => gapNumbers.indexOf(num) !== index)
    
    if (duplicates.length > 0) {
      return { isValid: false, message: `Takroriy gap raqamlari: ${duplicates.join(", ")}` }
    }
    
    return { isValid: true, message: "" }
  }

  // Remove section
  const removeSection = (index: number) => {
    const newSections = sections.filter((_, i) => i !== index)
    setSections(newSections)
  }

  // Add question to section
  const addQuestionToSection = (sectionIndex: number) => {
    const section = sections[sectionIndex]
    const newGapNumber = Math.max(...section.questions.map(q => q.gapNumber), 0) + 1
    const newQuestion: GapFillingQuestion = {
      id: Date.now(),
      gapNumber: newGapNumber,
      correctAnswer: "",
      wordLimit: 1
    }
    
    const newSections = [...sections]
    newSections[sectionIndex].questions.push(newQuestion)
    setSections(newSections)
  }

  // Remove question from section
  const removeQuestionFromSection = (sectionIndex: number, questionIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions.splice(questionIndex, 1)
    setSections(newSections)
  }

  // Update question
  const updateQuestion = (sectionIndex: number, questionIndex: number, field: keyof GapFillingQuestion, value: any) => {
    const newSections = [...sections]
    newSections[sectionIndex].questions[questionIndex] = {
      ...newSections[sectionIndex].questions[questionIndex],
      [field]: value
    }
    setSections(newSections)
  }

  // Create test
  const createTest = () => {
    if (!testTitle.trim()) {
      alert("Test nomini kiriting")
      return
    }

    // Validate sections
    if (sections.length === 0) {
      alert("Kamida bitta bo'lim qo'shishingiz kerak")
      return
    }

    // Validate content format
    for (let i = 0; i < sections.length; i++) {
      const section = sections[i]
      if (!section.content.trim()) {
        alert(`${i + 1}-bo'limda matn yo'q`)
        return
      }
      
      const validation = validateContent(section.content)
      if (!validation.isValid) {
        alert(`${i + 1}-bo'limda: ${validation.message}`)
        return
      }
    }

    // Auto-generate questions from content if none exist
    const updatedSections = sections.map(section => {
      if (section.questions.length === 0) {
        // Extract gap numbers from content [1], [2], etc.
        const gapMatches = section.content.match(/\[(\d+)\]/g)
        if (gapMatches) {
          const questions = gapMatches.map((match, index) => {
            const gapNumber = parseInt(match.replace(/[\[\]]/g, ''))
            return {
              id: Date.now() + index,
              gapNumber,
              correctAnswer: "",
              wordLimit: 1
            }
          })
          return { ...section, questions }
        }
      }
      return section
    })

    // Validate all questions have answers
    const allQuestions = updatedSections.flatMap(section => section.questions)
    const unansweredQuestions = allQuestions.filter(q => !q.correctAnswer.trim())
    
    if (unansweredQuestions.length > 0) {
      alert(`Hali javob berilmagan savollar: ${unansweredQuestions.map(q => q.gapNumber).join(", ")}`)
      return
    }

    const testData = {
      title: testTitle,
      type: "Gap Filling",
      testType,
      testLevel,
      timeLimit,
      instructions,
      wordLimitInstruction,
      answerSheetInstruction,
      totalGaps: allQuestions.length,
      sections: updatedSections,
      createdAt: new Date().toISOString(),
      status: "Active"
    }

    if (onTestCreate) {
      onTestCreate(testData)
    }
  }

  // Get total word count
  const getTotalWordCount = () => {
    return sections.reduce((total, section) => {
      const sectionWords = section.content.split(/\s+/).filter(word => word.trim()).length
      return total + sectionWords
    }, 0)
  }

  // Get gap statistics
  const getGapStats = () => {
    const allQuestions = sections.flatMap(section => section.questions)
    const answered = allQuestions.filter(q => q.correctAnswer.trim()).length
    const total = allQuestions.length
    return { answered, total, percentage: total > 0 ? Math.round((answered / total) * 100) : 0 }
  }

  // Preview render
  const renderPreview = () => {
    return (
      <div className="space-y-6">
        {/* Instructions */}
        <div className="p-4 bg-muted/30 rounded-lg border-l-4 border-l-primary">
          <p className="font-medium text-ielts-dark mb-2">{instructions}</p>
          <p className="text-sm text-ielts-red font-medium">
            {wordLimitInstruction}
          </p>
          <p className="text-sm text-muted-foreground mt-1">
            {answerSheetInstruction}
          </p>
        </div>

        {/* Test Content */}
        <div className="p-6 border-2 border-muted rounded-lg bg-background">
          <h3 className="text-lg font-bold text-ielts-red mb-4 text-center">
            {testTitle || "Test Title"}
          </h3>
          
          <div className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex}>
                {section.title && (
                  <h4 className="font-bold text-ielts-red mb-2">
                    {section.title}
                  </h4>
                )}
                
                <div className="space-y-2">
                  {section.content.split('\n').filter(line => line.trim()).map((line, lineIndex) => (
                    <div key={lineIndex} className="flex items-start gap-2">
                      {line.trim().startsWith('•') && (
                        <span className="text-muted-foreground mt-1">•</span>
                      )}
                      <p className="text-sm leading-relaxed flex-1">
                        {line.replace('•', '').trim().split(/(\[(\d+)\])/).map((part, partIndex) => {
                          const gapMatch = part.match(/\[(\d+)\]/);
                          if (gapMatch) {
                            const gapNumber = parseInt(gapMatch[1]);
                            return (
                              <span key={partIndex} className="inline-flex items-center">
                                <Input
                                  type="text"
                                  value=""
                                  readOnly
                                  className="w-24 h-8 mx-1 text-center border-2 border-muted-foreground/30"
                                  placeholder={gapNumber.toString()}
                                />
                              </span>
                            );
                          }
                          return <span key={partIndex}>{part}</span>;
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Gap Summary */}
        <div className="p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-primary">Gap Ma'lumotlari</h4>
            <div className="text-sm text-muted-foreground">
              {getGapStats().answered}/{getGapStats().total} javob berilgan ({getGapStats().percentage}%)
            </div>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {sections.flatMap(section => section.questions).map((question, index) => (
              <div key={index} className={`text-center p-2 rounded border ${
                question.correctAnswer.trim() 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="font-bold text-primary">Gap {question.gapNumber}</div>
                <div className={`text-xs ${
                  question.correctAnswer.trim() ? 'text-green-600' : 'text-red-600'
                }`}>
                  {question.correctAnswer.trim() || "Javob kiritilmagan"}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  // Edit mode render
  const renderEditMode = () => {
    return (
      <div className="space-y-6">
        {/* Test Metadata */}
        <Card>
          <CardHeader>
            <CardTitle>Test Ma'lumotlari</CardTitle>
            <CardDescription>Gap-filling test asosiy ma'lumotlari</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="testTitle">Test Nomi</Label>
                <Input
                  id="testTitle"
                  value={testTitle}
                  onChange={(e) => setTestTitle(e.target.value)}
                  placeholder="Masalan: The Dead Sea Scrolls"
                />
              </div>
              <div>
                <Label htmlFor="testType">Test Turi</Label>
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
                <Label htmlFor="testLevel">Daraja</Label>
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
              <div>
                <Label htmlFor="timeLimit">Vaqt Chegarasi (minut)</Label>
                <Input
                  id="timeLimit"
                  type="number"
                  value={timeLimit}
                  onChange={(e) => setTimeLimit(parseInt(e.target.value))}
                  min="1"
                  max="120"
                />
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="instructions">Asosiy Ko'rsatma</Label>
                <Input
                  id="instructions"
                  value={instructions}
                  onChange={(e) => setInstructions(e.target.value)}
                  placeholder="Masalan: Complete the notes below."
                />
              </div>
              <div>
                <Label htmlFor="wordLimitInstruction">So'z Chegarasi Ko'rsatmasi</Label>
                <Input
                  id="wordLimitInstruction"
                  value={wordLimitInstruction}
                  onChange={(e) => setWordLimitInstruction(e.target.value)}
                  placeholder="Masalan: Choose ONE WORD ONLY from the passage for each answer."
                />
              </div>
              <div>
                <Label htmlFor="answerSheetInstruction">Javob Varag'i Ko'rsatmasi</Label>
                <Input
                  id="answerSheetInstruction"
                  value={answerSheetInstruction}
                  onChange={(e) => setAnswerSheetInstruction(e.target.value)}
                  placeholder="Masalan: Write your answers in boxes 1-5 on your answer sheet."
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Help Section */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Gap-Filling Format Ko'rsatmasi
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <h5 className="font-semibold mb-2">To'g'ri Format:</h5>
                <div className="text-sm space-y-1 text-green-600">
                  <p>• heard a noise when teenager threw a [1]</p>
                  <p>• teenagers went into the [2]</p>
                  <p>• found containers made of [3]</p>
                </div>
              </div>
              <div>
                <h5 className="font-semibold mb-2">Noto'g'ri Format:</h5>
                <div className="text-sm space-y-1 text-red-600">
                  <p>• heard a noise when teenager threw a 1</p>
                  <p>• teenagers went into the 2</p>
                  <p>• found containers made of 3</p>
                </div>
              </div>
            </div>
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm">
                <strong>Eslatma:</strong> Gap raqamlari [1], [2], [3] formatida bo'lishi kerak. 
                Matn o'zgarishida savollar avtomatik yangilanadi. Har bir gap uchun to'g'ri javobni kiriting.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Test Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Test Ma'lumotlari</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-3 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">
                  {sections.length}
                </div>
                <div className="text-sm text-blue-600">Bo'limlar</div>
              </div>
              <div className="text-center p-3 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">
                  {getGapStats().total}
                </div>
                <div className="text-sm text-green-600">Jami Gap</div>
              </div>
              <div className="text-center p-3 bg-amber-50 rounded-lg">
                <div className="text-2xl font-bold text-amber-600">
                  {getGapStats().answered}
                </div>
                <div className="text-sm text-amber-600">Javob Berilgan</div>
              </div>
              <div className="text-center p-3 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">
                  {timeLimit}
                </div>
                <div className="text-sm text-purple-600">Daqiqa</div>
              </div>
            </div>
            
            {/* Progress Bar */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Test tayyorlanishi</span>
                <span>{getGapStats().percentage}%</span>
              </div>
              <div className="w-full bg-muted rounded-full h-2">
                <div 
                  className="bg-primary h-2 rounded-full transition-all duration-300"
                  style={{ width: `${getGapStats().percentage}%` }}
                ></div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sections */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Bo'limlar</CardTitle>
                <CardDescription>Test bo'limlari va savollar</CardDescription>
              </div>
              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const nextGap = getNextGapNumber()
                    const newSection: GapFillingSection = {
                      title: "New Section",
                      content: `• [${nextGap}]`,
                      questions: [{
                        id: Date.now(),
                        gapNumber: nextGap,
                        correctAnswer: "",
                        wordLimit: 1
                      }]
                    }
                    setSections([...sections, newSection])
                  }}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Bo'lim Qo'shish
                </Button>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const nextGap = getNextGapNumber()
                    const newSection: GapFillingSection = {
                      title: "Notes",
                      content: `• [${nextGap}]\n• [${nextGap + 1}]\n• [${nextGap + 2}]`,
                      questions: [
                        { id: Date.now(), gapNumber: nextGap, correctAnswer: "", wordLimit: 1 },
                        { id: Date.now() + 1, gapNumber: nextGap + 1, correctAnswer: "", wordLimit: 1 },
                        { id: Date.now() + 2, gapNumber: nextGap + 2, correctAnswer: "", wordLimit: 1 }
                      ]
                    }
                    setSections([...sections, newSection])
                  }}
                >
                  <List className="h-4 w-4 mr-2" />
                  Notes Template
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {sections.map((section, sectionIndex) => (
              <div key={sectionIndex} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-semibold">Bo'lim {sectionIndex + 1}</h4>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => removeSection(sectionIndex)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <Label>Bo'lim Sarlavhasi</Label>
                    <Input
                      value={section.title}
                      onChange={(e) => handleSectionChange(sectionIndex, 'title', e.target.value)}
                      placeholder="Masalan: Discovery"
                    />
                  </div>

                  <div>
                    <Label>Bo'lim Mazmuni</Label>
                    <Textarea
                      value={section.content}
                      onChange={(e) => handleSectionChange(sectionIndex, 'content', e.target.value)}
                      placeholder={`Masalan:
Qumran, 1945/7
• three Bedouin shepherds in their teens were near an opening on side of cliff
• heard a noise of breaking when one teenager threw a [1]
• teenagers went into the [2] and found a number of containers made of [3]`}
                      rows={6}
                    />
                    {section.content && (
                      <div className="mt-2">
                        {(() => {
                          const validation = validateContent(section.content)
                          return validation.isValid ? (
                            <p className="text-xs text-green-600">✓ Matn formati to'g'ri</p>
                          ) : (
                            <p className="text-xs text-red-600">⚠ {validation.message}</p>
                          )
                        })()}
                      </div>
                    )}
                    <p className="text-xs text-muted-foreground mt-1">
                      Bo'sh joylar uchun [1], [2] formatini ishlating. Har bir qator yangi qator bilan ajratilgan bo'lishi kerak. Bullet pointlar uchun "•" belgisini ishlating.
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <Label>Savollar</Label>
                      <Button
                        size="sm"
                        onClick={() => addQuestionToSection(sectionIndex)}
                      >
                        <Plus className="h-4 w-4 mr-2" />
                        Savol Qo'shish
                      </Button>
                    </div>

                    <div className="space-y-2">
                      {section.questions.map((question, questionIndex) => (
                        <div key={questionIndex} className="flex items-center gap-2 p-2 border rounded">
                          <Badge variant="outline">Gap {question.gapNumber}</Badge>
                          <Input
                            placeholder="To'g'ri javob"
                            value={question.correctAnswer}
                            onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'correctAnswer', e.target.value)}
                            className="flex-1"
                          />
                          <Input
                            type="number"
                            placeholder="So'z chegarasi"
                            value={question.wordLimit}
                            onChange={(e) => updateQuestion(sectionIndex, questionIndex, 'wordLimit', parseInt(e.target.value))}
                            className="w-20"
                            min="1"
                            max="5"
                          />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => removeQuestionFromSection(sectionIndex, questionIndex)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "edit" ? "Gap-Filling Testni Tahrirlash" : "Yangi Gap-Filling Test Yaratish"}
          </DialogTitle>
          <DialogDescription>
            IELTS Listening gap-filling test turini yarating. Bu test bir nechta bo'sh joylarni to'ldirish savollarini o'z ichiga oladi.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Mode Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={!previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(false)}
            >
              <Settings className="h-4 w-4 mr-2" />
              Tahrirlash
            </Button>
            <Button
              variant={previewMode ? "default" : "outline"}
              size="sm"
              onClick={() => setPreviewMode(true)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Ko'rish
            </Button>
          </div>

          {previewMode ? renderPreview() : renderEditMode()}
        </div>

        <div className="flex justify-end gap-2 pt-4 border-t">
          <Button variant="outline" onClick={onCancel}>
            Bekor qilish
          </Button>
          <Button 
            variant="outline" 
            onClick={() => {
              const sampleData = {
                title: "The Dead Sea Scrolls",
                type: "Gap Filling",
                testType: "Academic",
                testLevel: "Intermediate",
                timeLimit: 30,
                instructions: "Complete the notes below.",
                wordLimitInstruction: "Choose ONE WORD ONLY from the passage for each answer.",
                answerSheetInstruction: "Write your answers in boxes 1-5 on your answer sheet.",
                sections: [
                  {
                    title: "Discovery",
                    content: "Qumran, 1945/7\n• three Bedouin shepherds in their teens were near an opening on side of cliff\n• heard a noise of breaking when one teenager threw a [1]\n• teenagers went into the [2] and found a number of containers made of [3]",
                    questions: [
                      { id: 1, gapNumber: 1, correctAnswer: "stone", wordLimit: 1 },
                      { id: 2, gapNumber: 2, correctAnswer: "cave", wordLimit: 1 },
                      { id: 3, gapNumber: 3, correctAnswer: "clay", wordLimit: 1 }
                    ]
                  },
                  {
                    title: "The scrolls",
                    content: "• date from between 150 BCE and 70 CE\n• thought to have been written by group of people known as the [4]\n• written mainly in the [5] language\n• most are on religious topics, written using ink on parchment or papyrus",
                    questions: [
                      { id: 4, gapNumber: 4, correctAnswer: "Essenes", wordLimit: 1 },
                      { id: 5, gapNumber: 5, correctAnswer: "Hebrew", wordLimit: 1 }
                    ]
                  }
                ]
              }
              
              setTestTitle(sampleData.title)
              setTestType(sampleData.testType)
              setTestLevel(sampleData.testLevel)
              setTimeLimit(sampleData.timeLimit)
              setInstructions(sampleData.instructions)
              setWordLimitInstruction(sampleData.wordLimitInstruction)
              setAnswerSheetInstruction(sampleData.answerSheetInstruction)
              setSections(sampleData.sections)
            }}
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            Namuna Yuklash
          </Button>
          <Button onClick={createTest} disabled={!testTitle.trim()}>
            <Save className="h-4 w-4 mr-2" />
            {mode === "edit" ? "Yangilash" : "Yaratish"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
