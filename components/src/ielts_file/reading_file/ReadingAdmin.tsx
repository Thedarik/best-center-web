"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  Users, 
  BookOpen,
  FileText,
  BarChart3,
  Target,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react"

// Import the new component
import CreateReadingTest from "./CreateReadingTest"

// Types (keep your existing types)
type Question = {
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
}

type Passage = {
  title: string
  text: string
  questions: Question[]
}

type Test = {
  id: number
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
  passages_data: Passage[]
}

export default function ReadingAdmin() {
  const [tests, setTests] = useState<Test[]>([
    {
      id: 1,
      title: "Academic Reading Test 1",
      type: "Academic",
      level: "Intermediate",
      passages: 3,
      questions: 40,
      timeLimit: 60,
      status: "Active",
      attempts: 156,
      avgScore: 6.5,
      createdAt: "2024-01-15",
      passages_data: [
        {
          title: "Climate Change and Arctic Wildlife",
          text: "The Arctic region has been experiencing unprecedented changes due to global warming. Scientists have observed that polar bears are struggling to find food as ice melts earlier each year. The warming temperatures have created significant challenges for wildlife adaptation.",
          questions: [
            {
              type: "Multiple Choice",
              question: "What is the main cause of Arctic ice melting?",
              options: ["Solar radiation", "Global warming", "Ocean currents", "Wind patterns"],
              correct: 1
            },
            {
              type: "Sentence Completion",
              question: "Complete the sentence using NO MORE THAN TWO WORDS from the passage:",
              sentence: "Polar bears are struggling to find _____ as ice melts earlier.",
              correctAnswer: "food",
              wordLimit: 2
            }
          ]
        }
      ]
    },
    {
      id: 2,
      title: "General Training Reading Test 1",
      type: "General Training",
      level: "Beginner",
      passages: 3,
      questions: 40,
      timeLimit: 60,
      status: "Draft",
      attempts: 0,
      avgScore: 0,
      createdAt: "2024-01-20",
      passages_data: []
    }
  ])

  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")

  // Handle test creation from the CreateReadingTest component
  const handleTestCreate = async (testData: any) => {
    const test: Test = {
      id: Math.max(...tests.map(t => t.id), 0) + 1,
      ...testData,
      attempts: 0,
      avgScore: 0,
      createdAt: new Date().toISOString().split('T')[0]
    }
    
    // Add test to the list
    setTests(prev => [...prev, test])
    
    // Show success message
    alert(`"${test.title}" testi muvaffaqiyatli yaratildi!`)
  }

  const deleteTest = (id: number) => {
    if (window.confirm("Rostdan ham bu testni o'chirmoqchimisiz?")) {
      setTests(tests.filter(test => test.id !== id))
    }
  }

  const toggleStatus = (id: number) => {
    setTests(tests.map(test => 
      test.id === id 
        ? { ...test, status: test.status === "Active" ? "Draft" : "Active" }
        : test
    ))
  }

  const filteredTests = tests.filter(test => {
    const typeMatch = filterType === "all" || test.type === filterType
    const statusMatch = filterStatus === "all" || test.status === filterStatus
    return typeMatch && statusMatch
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Draft": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "Academic" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Reading Testlari</h2>
          <p className="text-muted-foreground">IELTS Reading bo'limiga oid testlar va ma'lumotlar</p>
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] rounded-2xl">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha Turlar</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="General Training">General Training</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[120px] rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha Status</SelectItem>
              <SelectItem value="Active">Faol</SelectItem>
              <SelectItem value="Draft">Qoralama</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            className="rounded-2xl"
            onClick={() => setIsCreateDialogOpen(true)}
          >
            <Plus className="mr-2 h-4 w-4" />
            Yangi Reading Test
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{tests.length}</p>
                <p className="text-sm text-muted-foreground">Jami Testlar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{tests.filter(t => t.status === "Active").length}</p>
                <p className="text-sm text-muted-foreground">Faol Testlar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{tests.reduce((sum, test) => sum + test.attempts, 0)}</p>
                <p className="text-sm text-muted-foreground">Jami Urinishlar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">
                  {tests.length > 0 ? (tests.reduce((sum, test) => sum + test.avgScore, 0) / tests.length).toFixed(1) : '0.0'}
                </p>
                <p className="text-sm text-muted-foreground">O'rtacha Ball</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}    
      <Card className="rounded-3xl border-2">
        <CardHeader>
          <CardTitle>Reading Testlar Ro'yxati</CardTitle>
          <CardDescription>
            IELTS Reading testlari va ularning statistikasi ({filteredTests.length} ta test)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground mt-2">
                {filterType !== "all" || filterStatus !== "all" 
                  ? "Filter shartlariga mos test topilmadi."
                  : "Hech qanday test topilmadi. Yangi test yaratish uchun yuqoridagi tugmani bosing."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTests.map((test) => (
                <Card key={test.id} className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{test.title}</h3>
                          <Badge className={getTypeColor(test.type)}>{test.type}</Badge>
                          <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                          <Badge variant="secondary">{test.level}</Badge>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{test.passages} ta matn</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{test.questions} ta savol</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{test.timeLimit} daqiqa</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{test.attempts} urinish</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            <span>{test.avgScore.toFixed(1)} o'rtacha ball</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Yaratilgan: {test.createdAt}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedTest(test)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>{selectedTest?.title}</DialogTitle>
                              <DialogDescription>Test tafsilotlari va savollar</DialogDescription>
                            </DialogHeader>
                            {selectedTest && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Test Turi</Label>
                                    <div className="mt-1">
                                      <Badge className={getTypeColor(selectedTest.type)}>{selectedTest.type}</Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Status</Label>
                                    <div className="mt-1">
                                      <Badge className={getStatusColor(selectedTest.status)}>{selectedTest.status}</Badge>
                                    </div>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Daraja</Label>
                                    <p className="mt-1">{selectedTest.level}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Vaqt Chegarasi</Label>
                                    <p className="mt-1">{selectedTest.timeLimit} daqiqa</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">Urinishlar Soni</Label>
                                    <p className="mt-1">{selectedTest.attempts}</p>
                                  </div>
                                  <div>
                                    <Label className="text-sm text-muted-foreground">O'rtacha Ball</Label>
                                    <p className="mt-1">{selectedTest.avgScore.toFixed(1)}</p>
                                  </div>
                                </div>
                                
                                <Separator />
                                
                                {selectedTest.passages_data.length > 0 ? (
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Matnlar va Savollar</h3>
                                    {selectedTest.passages_data.map((passage, index) => (
                                      <Card key={index} className="rounded-lg">
                                        <CardHeader>
                                          <CardTitle className="text-base">
                                            {index + 1}. {passage.title}
                                          </CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                          <div className="space-y-4">
                                            <div>
                                              <Label className="text-sm font-medium text-muted-foreground">Matn:</Label>
                                              <div className="mt-1 p-3 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto">
                                                {passage.text}
                                              </div>
                                            </div>
                                            
                                            <div className="space-y-3">
                                              <Label className="text-sm font-medium">
                                                Savollar ({passage.questions?.length || 0} ta)
                                              </Label>
                                              {passage.questions?.map((question, qIndex) => (
                                                <div key={qIndex} className="p-3 border rounded">
                                                  <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                      <Badge variant="outline">{question.type}</Badge>
                                                      <span className="text-xs text-muted-foreground">
                                                        Savol {qIndex + 1}
                                                      </span>
                                                    </div>
                                                    <p className="text-sm font-medium">{question.question}</p>
                                                    
                                                    {question.type === "Multiple Choice" && question.options && (
                                                      <div className="space-y-1 ml-4">
                                                        {question.options.map((option, optIndex) => (
                                                          <div key={optIndex} className="flex items-center gap-2">
                                                            <span className="text-xs text-muted-foreground w-4">
                                                              {String.fromCharCode(65 + optIndex)}.
                                                            </span>
                                                            <span className={`text-xs ${question.correct === optIndex ? 'font-bold text-green-600' : ''}`}>
                                                              {option}
                                                            </span>
                                                            {question.correct === optIndex && (
                                                              <CheckCircle className="h-3 w-3 text-green-600" />
                                                            )}
                                                          </div>
                                                        ))}
                                                      </div>
                                                    )}
                                                    
                                                    {question.type === "Sentence Completion" && (
                                                      <div className="space-y-1 ml-4">
                                                        <div className="text-xs">
                                                          <span className="text-muted-foreground">Jumla:</span>
                                                          <span className="ml-1 font-mono bg-gray-100 px-1 rounded">
                                                            {question.sentence}
                                                          </span>
                                                        </div>
                                                        <div className="text-xs">
                                                          <span className="text-muted-foreground">To'g'ri javob:</span>
                                                          <span className="ml-1 font-bold text-green-600">
                                                            {question.correctAnswer}
                                                          </span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                          So'z chegarasi: {question.wordLimit} so'z
                                                        </div>
                                                      </div>
                                                    )}
                                                    
                                                    {(question.type === "True/False/Not Given" || question.type === "Yes/No/Not Given") && (
                                                      <div className="space-y-1 ml-4">
                                                        <div className="text-xs">
                                                          <span className="text-muted-foreground">Bayonot:</span>
                                                          <span className="ml-1 italic">
                                                            {question.sentence}
                                                          </span>
                                                        </div>
                                                        <div className="text-xs">
                                                          <span className="text-muted-foreground">To'g'ri javob:</span>
                                                          <span className="ml-1 font-bold text-green-600">
                                                            {question.truefalse}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}
                                                    
                                                    {question.type === "Short Answer Questions" && (
                                                      <div className="space-y-1 ml-4">
                                                        <div className="text-xs">
                                                          <span className="text-muted-foreground">To'g'ri javob:</span>
                                                          <span className="ml-1 font-bold text-green-600">
                                                            {question.correctAnswer}
                                                          </span>
                                                        </div>
                                                        <div className="text-xs text-muted-foreground">
                                                          So'z chegarasi: {question.wordLimit} so'z
                                                        </div>
                                                      </div>
                                                    )}

                                                    {question.type === "Matching Headings" && (
                                                      <div className="space-y-1 ml-4">
                                                        <div className="text-xs">
                                                          <span className="text-muted-foreground">Sarlavhalar:</span>
                                                          <div className="mt-1 text-xs font-mono bg-gray-100 p-2 rounded">
                                                            {question.headings?.join('\n')}
                                                          </div>
                                                        </div>
                                                        <div className="text-xs">
                                                          <span className="text-muted-foreground">To'g'ri javob:</span>
                                                          <span className="ml-1 font-bold text-green-600">
                                                            {question.correctAnswer}
                                                          </span>
                                                        </div>
                                                      </div>
                                                    )}
                                                  </div>
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                        </CardContent>
                                      </Card>
                                    ))}
                                  </div>
                                ) : (
                                  <div className="text-center py-6">
                                    <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
                                    <p className="text-sm text-muted-foreground mt-2">
                                      Bu testda matnlar mavjud emas
                                    </p>
                                  </div>
                                )}
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>
                        
                        <Button variant="outline" size="sm">
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant={test.status === "Active" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => toggleStatus(test.id)}
                        >
                          {test.status === "Active" ? (
                            <>
                              <AlertCircle className="h-4 w-4" />
                            </>
                          ) : (
                            <>
                              <CheckCircle className="h-4 w-4" />
                            </>
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteTest(test.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Reading Test Component */}
      <CreateReadingTest
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTestCreate={handleTestCreate}
      />
    </div>
  )
}