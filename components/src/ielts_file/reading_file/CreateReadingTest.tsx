"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Plus, 
  Trash2, 
  CheckCircle,
  XCircle,
  AlertTriangle,
  Info
} from "lucide-react"

// Types
type Question = {
  type: string
  question: string
  options?: string[]
  correct?: number
  sentence?: string
  correctAnswer?: string // Always string
  wordLimit?: number
  truefalse?: string
  headings?: string[]
  matchingOptions?: string[]
  alternativeAnswers?: string[] // Alternative correct answers
}

type Passage = {
  title: string
  text: string
  questions: Question[]
}

type NewTestType = {
  title: string
  type: string
  level: string
  timeLimit: number
  passages: Passage[]
}

interface CreateReadingTestProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onTestCreate: (test: any) => void
}

export default function CreateReadingTest({ isOpen, onOpenChange, onTestCreate }: CreateReadingTestProps) {
  const [newTest, setNewTest] = useState<NewTestType>({
    title: "",
    type: "Academic",
    level: "Intermediate",
    timeLimit: 60,
    passages: []
  })

  const [currentPassage, setCurrentPassage] = useState<{
    title: string
    text: string
    questions: Question[]
  }>({
    title: "",
    text: "",
    questions: []
  })

  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    type: "Multiple Choice",
    question: "",
    options: ["", "", "", ""],
    correct: 0,
    sentence: "",
    correctAnswer: "",
    wordLimit: 2,
    truefalse: "True",
    headings: [""],
    matchingOptions: [""],
    alternativeAnswers: []
  })

  const questionTypes = [
    "Multiple Choice",
    "True/False/Not Given",
    "Yes/No/Not Given", 
    "Matching Headings",
    "Matching Information",
    "Matching Features",
    "Sentence Completion",
    "Summary Completion",
    "Short Answer Questions",
    "Diagram Label Completion"
  ]

  // Helper function to validate and format blanks
  const validateSentenceCompletion = (sentence: string) => {
    const blankCount = (sentence.match(/_{3,}/g) || []).length
    const hasValidBlanks = blankCount > 0
    const suggestions = []

    if (!hasValidBlanks) {
      suggestions.push("Bo'sh joylarni kamida 3 ta pastki chiziq (_____) bilan belgilang")
    }

    if (blankCount > 3) {
      suggestions.push("3 tadan ko'p bo'sh joy tavsiya etilmaydi")
    }

    return {
      isValid: hasValidBlanks,
      blankCount,
      suggestions
    }
  }

  // Helper function to auto-format blanks
  const autoFormatBlanks = (text: string) => {
    // Replace any sequence of 2 or more underscores with exactly 5 underscores
    return text.replace(/_{2,}/g, '_____')
  }

  // Helper function to split answers and clean them
  const processAnswers = (answerText: string) => {
    if (!answerText || !answerText.trim()) return []
    
    // Split by comma, semicolon, or "or"
    const answers = answerText
      .split(/[,;]|\s+or\s+/i)
      .map(answer => answer.trim().toLowerCase())
      .filter(answer => answer.length > 0)
    
    return [...new Set(answers)] // Remove duplicates
  }

  const addQuestion = () => {
    // Validate question before adding
    if (!currentQuestion.question.trim()) {
      alert("Iltimos savol matnini kiriting!")
      return
    }

    // Additional validation based on question type
    if (currentQuestion.type === "Multiple Choice") {
      if (!currentQuestion.options?.every(opt => opt.trim())) {
        alert("Barcha variantlarni to'ldiring!")
        return
      }
    } else if (currentQuestion.type === "Sentence Completion") {
      const validation = validateSentenceCompletion(currentQuestion.sentence || "")
      if (!validation.isValid) {
        alert("Jumla matnida kamida bitta bo'sh joy (_____)  bo'lishi kerak!")
        return
      }
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

      // Update question with processed data
      const updatedQuestion = {
        ...currentQuestion,
        sentence: autoFormatBlanks(currentQuestion.sentence || ""),
        correctAnswer: processedAnswers[0], // Primary answer
        alternativeAnswers: processedAnswers.slice(1) // Alternative answers
      }
      
      setCurrentPassage(prev => ({
        ...prev,
        questions: [...prev.questions, updatedQuestion]
      }))
      
      // Reset current question
      setCurrentQuestion({
        type: "Multiple Choice",
        question: "",
        options: ["", "", "", ""],
        correct: 0,
        sentence: "",
        correctAnswer: "",
        wordLimit: 2,
        truefalse: "True",
        headings: [""],
        matchingOptions: [""],
        alternativeAnswers: []
      })
      return
    }

    setCurrentPassage(prev => ({
      ...prev,
      questions: [...prev.questions, { ...currentQuestion }]
    }))
    
    // Reset current question
    setCurrentQuestion({
      type: "Multiple Choice",
      question: "",
      options: ["", "", "", ""],
      correct: 0,
      sentence: "",
      correctAnswer: "",
      wordLimit: 2,
      truefalse: "True",
      headings: [""],
      matchingOptions: [""],
      alternativeAnswers: []
    })
  }

  const addPassage = () => {
    // Validate passage before adding
    if (!currentPassage.title.trim()) {
      alert("Iltimos matn sarlavhasini kiriting!")
      return
    }
    if (!currentPassage.text.trim()) {
      alert("Iltimos matn mazmunini kiriting!")
      return
    }
    if (currentPassage.questions.length === 0) {
      alert("Kamida bitta savol qo'shing!")
      return
    }

    setNewTest(prev => ({
      ...prev,
      passages: [...prev.passages, { ...currentPassage }]
    }))
    
    // Reset current passage
    setCurrentPassage({
      title: "",
      text: "",
      questions: []
    })
  }

  const createTest = async () => {
    // Validate test before creating
    if (!newTest.title.trim()) {
      alert("Iltimos test nomini kiriting!")
      return
    }
    if (newTest.passages.length === 0) {
      alert("Kamida bitta matn qo'shing!")
      return
    }

    const testData = {
      title: newTest.title,
      type: newTest.type,
      level: newTest.level,
      passages: newTest.passages.length,
      questions: newTest.passages.reduce((total, passage) => total + passage.questions.length, 0),
      timeLimit: newTest.timeLimit,
      status: "Draft",
      passages_data: newTest.passages
    }
    
    try {
      // Call the parent function to handle test creation
      await onTestCreate(testData)
      
      // Reset form
      setNewTest({
        title: "",
        type: "Academic", 
        level: "Intermediate",
        timeLimit: 60,
        passages: []
      })
      
      // Close dialog
      onOpenChange(false)
      
    } catch (error) {
      console.error("Test yaratishda xatolik:", error)
      alert("Test yaratishda xatolik yuz berdi!")
    }
  }

  const renderQuestionInput = () => {
    switch(currentQuestion.type) {
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
                    setCurrentQuestion({...currentQuestion, options: newOptions})
                  }}
                />
                <Button 
                  type="button"
                  variant={currentQuestion.correct === index ? "default" : "outline"}
                  size="sm"
                  onClick={() => setCurrentQuestion({...currentQuestion, correct: index})}
                >
                  {currentQuestion.correct === index ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
                </Button>
              </div>
            ))}
          </div>
        )

      case "Sentence Completion":
        const sentenceValidation = currentQuestion.sentence ? validateSentenceCompletion(currentQuestion.sentence) : null
        
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Jumla (bo'sh joyni _____ bilan belgilang)</Label>
              <Textarea 
                placeholder="The plant grows best in _____ conditions and requires regular watering."
                value={currentQuestion.sentence}
                onChange={(e) => setCurrentQuestion({...currentQuestion, sentence: e.target.value})}
                className="min-h-[100px]"
              />
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Info className="h-3 w-3" />
                  <span>Bo'sh joyni kamida 3 ta pastki chiziq (_____)  bilan belgilang</span>
                </div>
                <Button 
                  type="button" 
                  variant="outline" 
                  size="sm"
                  onClick={() => {
                    const formatted = autoFormatBlanks(currentQuestion.sentence || "")
                    setCurrentQuestion({...currentQuestion, sentence: formatted})
                  }}
                >
                  Avtomatik Formatlash
                </Button>
              </div>
              
              {sentenceValidation && !sentenceValidation.isValid && (
                <Alert className="border-orange-200 bg-orange-50">
                  <AlertTriangle className="h-4 w-4 text-orange-600" />
                  <AlertDescription className="text-orange-800">
                    {sentenceValidation.suggestions.join(", ")}
                  </AlertDescription>
                </Alert>
              )}
              
              {sentenceValidation && sentenceValidation.isValid && (
                <Alert className="border-green-200 bg-green-50">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-800">
                    {sentenceValidation.blankCount} ta bo'sh joy topildi ✓
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>To'g'ri Javob(lar)</Label>
                <Textarea 
                  placeholder="sunny, warm, bright"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                  className="min-h-[60px]"
                />
                <p className="text-xs text-muted-foreground">
                  💡 Bir nechta to'g'ri javob bo'lsa, vergul bilan ajrating: "sunny, warm, bright"
                </p>
              </div>
              <div className="space-y-2">
                <Label>So'z Chegarasi</Label>
                <Select 
                  value={currentQuestion.wordLimit?.toString()} 
                  onValueChange={(value) => setCurrentQuestion({...currentQuestion, wordLimit: parseInt(value)})}
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
            
            {/* Advanced Preview */}
            <div className="p-4 bg-gray-50 rounded-lg space-y-3">
              <Label className="text-sm font-medium">Ko'rinishi:</Label>
              <div className="space-y-2">
                <p className="text-sm">
                  <span className="font-medium">Savol:</span> {currentQuestion.question || "Savol kiritilmagan"}
                </p>
                <p className="text-sm">
                  <span className="font-medium">Jumla:</span> {currentQuestion.sentence || "Jumla kiritilmagan"}
                </p>
                <p className="text-xs text-muted-foreground">
                  Talaba _____ joyiga javob yozadi ({currentQuestion.wordLimit} so'zdan ortiq emas)
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

      case "True/False/Not Given":
      case "Yes/No/Not Given":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Bayonot (Statement)</Label>
              <Textarea 
                placeholder="Arctic ice is melting faster than expected."
                value={currentQuestion.sentence}
                onChange={(e) => setCurrentQuestion({...currentQuestion, sentence: e.target.value})}
                className="min-h-[80px]"
              />
            </div>
            <div className="space-y-2">
              <Label>To'g'ri Javob</Label>
              <Select 
                value={currentQuestion.truefalse} 
                onValueChange={(value) => setCurrentQuestion({...currentQuestion, truefalse: value})}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {currentQuestion.type === "True/False/Not Given" ? (
                    <>
                      <SelectItem value="True">True</SelectItem>
                      <SelectItem value="False">False</SelectItem>
                      <SelectItem value="Not Given">Not Given</SelectItem>
                    </>
                  ) : (
                    <>
                      <SelectItem value="Yes">Yes</SelectItem>
                      <SelectItem value="No">No</SelectItem>
                      <SelectItem value="Not Given">Not Given</SelectItem>
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>
            <div className="p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Eslatma:</strong> Talaba matnni o'qib, ushbu bayonot to'g'ri, noto'g'ri yoki umuman aytilmaganligini aniqlaydi.
              </p>
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
                  placeholder="5 PM"
                  value={currentQuestion.correctAnswer}
                  onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>So'z Chegarasi</Label>
                <Select 
                  value={currentQuestion.wordLimit?.toString()} 
                  onValueChange={(value) => setCurrentQuestion({...currentQuestion, wordLimit: parseInt(value)})}
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
          </div>
        )

      case "Matching Headings":
        return (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Sarlavhalar Ro'yxati</Label>
              <p className="text-sm text-muted-foreground">Har bir sarlavhani alohida qatorga yozing</p>
              <Textarea 
                placeholder={`i. The importance of water conservation\nii. Methods of reducing energy consumption\niii. Environmental benefits of recycling\niv. Future challenges in sustainability`}
                value={currentQuestion.headings?.join('\n')}
                onChange={(e) => setCurrentQuestion({...currentQuestion, headings: e.target.value.split('\n')})}
                className="min-h-[120px]"
              />
            </div>
            <div className="space-y-2">
              <Label>To'g'ri Moslik (Paragraf tartib raqami)</Label>
              <Input 
                placeholder="2 (ikkinchi sarlavha to'g'ri)"
                value={currentQuestion.correctAnswer}
                onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
              />
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
          <DialogTitle>Yangi Reading Test Yaratish</DialogTitle>
          <DialogDescription>
            IELTS Reading testi uchun ma'lumotlarni kiriting
          </DialogDescription>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Asosiy Ma'lumotlar</TabsTrigger>
            <TabsTrigger value="passages">Matnlar</TabsTrigger>
            <TabsTrigger value="preview">Ko'rish</TabsTrigger>
          </TabsList>
          
          <TabsContent value="basic" className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Test Nomi</Label>
                <Input 
                  placeholder="Reading Test 1"
                  value={newTest.title}
                  onChange={(e) => setNewTest({...newTest, title: e.target.value})}
                />
              </div>
              <div className="space-y-2">
                <Label>Test Turi</Label>
                <Select value={newTest.type} onValueChange={(value) => setNewTest({...newTest, type: value})}>
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
                <Select value={newTest.level} onValueChange={(value) => setNewTest({...newTest, level: value})}>
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
                  onChange={(e) => setNewTest({...newTest, timeLimit: parseInt(e.target.value) || 60})}
                  min="1"
                  max="180"
                />
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="passages" className="space-y-4">
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold">Matn Qo'shish</h3>
                <Badge variant="outline">{newTest.passages.length} ta matn qo'shilgan</Badge>
              </div>
              
              <div className="space-y-4 p-4 border rounded-lg">
                <div className="space-y-2">
                  <Label>Matn Sarlavhasi</Label>
                  <Input 
                    placeholder="Climate Change and Arctic Wildlife"
                    value={currentPassage.title}
                    onChange={(e) => setCurrentPassage({...currentPassage, title: e.target.value})}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label>Matn Matni</Label>
                  <Textarea 
                    placeholder="Matn mazmunini kiriting..."
                    className="min-h-[200px]"
                    value={currentPassage.text}
                    onChange={(e) => setCurrentPassage({...currentPassage, text: e.target.value})}
                  />
                </div>
                
                <Separator />
                
                <div className="space-y-4">
                  <h4 className="font-medium">Savollar ({currentPassage.questions.length} ta)</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Savol Turi</Label>
                      <Select value={currentQuestion.type} onValueChange={(value) => setCurrentQuestion({...currentQuestion, type: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {questionTypes.map(type => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
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
                        onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
                      />
                    </div>
                  )}
                  
                  {renderQuestionInput()}
                  
                  <Button onClick={addQuestion} variant="outline" size="sm">
                    <Plus className="mr-2 h-4 w-4" />
                    Savol Qo'shish
                  </Button>

                  {/* Display added questions */}
                  {currentPassage.questions.length > 0 && (
                    <div className="space-y-2">
                      <Label className="text-sm font-medium">Qo'shilgan Savollar:</Label>
                      {currentPassage.questions.map((q, index) => (
                        <div key={index} className="p-3 bg-gray-50 rounded border">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <Badge variant="outline" className="mb-2">{q.type}</Badge>
                              <p className="text-sm font-medium">{q.question}</p>
                              {q.sentence && (
                                <p className="text-xs text-muted-foreground mt-1">
                                  Jumla: {q.sentence}
                                </p>
                              )}
                              {q.correctAnswer && (
                                <div className="mt-2">
                                  <span className="text-xs text-green-600 font-medium">To'g'ri: </span>
                                  <Badge variant="outline" className="text-green-700 border-green-300 text-xs">
                                    {q.correctAnswer}
                                  </Badge>
                                  {q.alternativeAnswers && q.alternativeAnswers.length > 0 && (
                                    <span className="ml-2">
                                      {q.alternativeAnswers.map((alt, idx) => (
                                        <Badge key={idx} variant="outline" className="text-green-600 border-green-200 text-xs ml-1">
                                          {alt}
                                        </Badge>
                                      ))}
                                    </span>
                                  )}
                                </div>
                              )}
                            </div>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => {
                                const updatedQuestions = [...currentPassage.questions]
                                updatedQuestions.splice(index, 1)
                                setCurrentPassage({...currentPassage, questions: updatedQuestions})
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
                    onClick={addPassage} 
                    disabled={!currentPassage.title || !currentPassage.text || currentPassage.questions.length === 0}
                  >
                    <Plus className="mr-2 h-4 w-4" />
                    Matnni Saqlash
                  </Button>
                </div>
              </div>

              {/* Display added passages */}
              {newTest.passages.length > 0 && (
                <div className="space-y-3">
                  <Label className="text-sm font-medium">Qo'shilgan Matnlar:</Label>
                  {newTest.passages.map((passage, index) => (
                    <Card key={index} className="rounded-lg">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-medium">{passage.title}</h4>
                            <p className="text-sm text-muted-foreground">
                              {passage.questions.length} ta savol
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {passage.text.substring(0, 100)}...
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => {
                              const updatedPassages = [...newTest.passages]
                              updatedPassages.splice(index, 1)
                              setNewTest({...newTest, passages: updatedPassages})
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
                <Label className="text-sm text-muted-foreground">Matnlar va Savollar</Label>
                {newTest.passages.length === 0 ? (
                  <p className="text-sm text-muted-foreground mt-2">Hech qanday matn qo'shilmagan</p>
                ) : (
                  newTest.passages.map((passage, index) => (
                    <div key={index} className="mt-2 p-3 border rounded">
                      <h4 className="font-medium">{passage.title}</h4>
                      <p className="text-sm text-muted-foreground">{passage.questions.length} ta savol</p>
                      <div className="mt-2 space-y-1">
                        {passage.questions.map((q, qIndex) => (
                          <div key={qIndex} className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs">{q.type}</Badge>
                            <span className="text-xs text-muted-foreground">
                              {q.question.substring(0, 50)}...
                            </span>
                            {q.type === "Sentence Completion" && q.correctAnswer && (
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
                <Button 
                  onClick={createTest} 
                  disabled={!newTest.title.trim() || newTest.passages.length === 0}
                >
                  Test Yaratish
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}