"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
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
  AlertCircle,
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw
} from "lucide-react"

// Import API and components
import { readingTestAPI, TestResponse, CreateTestRequest } from "./readingTestAPI"
import CreateReadingTest from "./CreateReadingTest"

// Fallback mock data agar API ishlamasa
const MOCK_TESTS: TestResponse[] = [
  {
    id: 1,
    title: "Academic Reading Test 1 (Demo)",
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
        text: "The Arctic region has been experiencing unprecedented changes due to global warming. Scientists have observed that polar bears are struggling to find food as ice melts earlier each year.",
        questions: [
          {
            type: "Multiple Choice",
            question: "What is the main cause of Arctic ice melting?",
            options: ["Solar radiation", "Global warming", "Ocean currents", "Wind patterns"],
            correct: 1
          }
        ]
      }
    ]
  },
  {
    id: 2,
    title: "General Training Reading Test 1 (Demo)",
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
]

export default function ReadingAdminWithAPIImproved() {
  const [tests, setTests] = useState<TestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<TestResponse | null>(null)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [apiError, setApiError] = useState<string | null>(null)
  const [isOfflineMode, setIsOfflineMode] = useState(false)
  const [stats, setStats] = useState({
    totalTests: 0,
    activeTests: 0,
    totalAttempts: 0,
    averageScore: 0
  })

  // API server mavjudligini tekshirish
  const checkAPIConnection = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'}/health`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 sekund timeout
      })
      return response.ok
    } catch (error) {
      return false
    }
  }

  // Load tests when component mounts
  useEffect(() => {
    initializeData()
  }, [])

  const initializeData = async () => {
    const isAPIAvailable = await checkAPIConnection()
    
    if (isAPIAvailable) {
      setIsOfflineMode(false)
      loadTests()
      loadStats()
    } else {
      setIsOfflineMode(true)
      setApiError("API server bilan bog'lanish mumkin emas. Demo rejimda ishlamoqda.")
      // Use mock data
      setTests(MOCK_TESTS)
      calculateStatsFromTests(MOCK_TESTS)
      setLoading(false)
    }
  }

  const loadTests = async () => {
    try {
      setLoading(true)
      setApiError(null)
      const testsData = await readingTestAPI.getAllTests()
      setTests(testsData)
      setIsOfflineMode(false)
    } catch (error) {
      console.error('Error loading tests:', error)
      setApiError("Testlarni yuklashda xatolik yuz berdi. Demo ma'lumotlari ko'rsatilmoqda.")
      setIsOfflineMode(true)
      setTests(MOCK_TESTS)
      calculateStatsFromTests(MOCK_TESTS)
    } finally {
      setLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      const statsData = await readingTestAPI.getTestStats()
      setStats(statsData)
    } catch (error) {
      console.error('Error loading stats:', error)
      calculateStatsFromTests(tests)
    }
  }

  const calculateStatsFromTests = (testList: TestResponse[] = tests) => {
    const totalTests = testList.length
    const activeTests = testList.filter(t => t.status === "Active").length
    const totalAttempts = testList.reduce((sum, test) => sum + test.attempts, 0)
    const averageScore = testList.length > 0 
      ? testList.reduce((sum, test) => sum + test.avgScore, 0) / testList.length 
      : 0

    setStats({
      totalTests,
      activeTests,
      totalAttempts,
      averageScore
    })
  }

  // Handle test creation
  const handleTestCreate = async (testData: any) => {
    if (isOfflineMode) {
      // Offline mode - local state faqat
      const test: TestResponse = {
        id: Math.max(...tests.map(t => t.id), 0) + 1,
        ...testData,
        attempts: 0,
        avgScore: 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      
      setTests(prev => [...prev, test])
      calculateStatsFromTests([...tests, test])
      alert(`"${test.title}" testi local rejimda yaratildi! (API tayyor bo'lmagan)`)
      return
    }

    try {
      const createRequest: CreateTestRequest = {
        title: testData.title,
        type: testData.type,
        level: testData.level,
        timeLimit: testData.timeLimit,
        passages_data: testData.passages_data
      }

      const newTest = await readingTestAPI.createTest(createRequest)
      setTests(prev => [...prev, newTest])
      loadStats()
      alert(`"${newTest.title}" testi muvaffaqiyatli yaratildi!`)
    } catch (error) {
      console.error('Error creating test:', error)
      alert('Test yaratishda xatolik yuz berdi!')
      throw error
    }
  }

  // Delete test
  const deleteTest = async (id: number) => {
    if (!window.confirm("Rostdan ham bu testni o'chirmoqchimisiz?")) return

    if (isOfflineMode) {
      setTests(tests.filter(test => test.id !== id))
      calculateStatsFromTests(tests.filter(test => test.id !== id))
      alert('Test local rejimda o\'chirildi!')
      return
    }

    try {
      await readingTestAPI.deleteTest(id)
      setTests(tests.filter(test => test.id !== id))
      loadStats()
      alert('Test muvaffaqiyatli o\'chirildi!')
    } catch (error) {
      console.error('Error deleting test:', error)
      alert('Test o\'chirishda xatolik yuz berdi!')
    }
  }

  // Toggle test status
  const toggleStatus = async (id: number) => {
    if (isOfflineMode) {
      setTests(tests.map(test => 
        test.id === id 
          ? { ...test, status: test.status === "Active" ? "Draft" : "Active" }
          : test
      ))
      calculateStatsFromTests()
      return
    }

    try {
      const updatedTest = await readingTestAPI.toggleTestStatus(id)
      setTests(tests.map(test => 
        test.id === id ? updatedTest : test
      ))
      loadStats()
    } catch (error) {
      console.error('Error toggling test status:', error)
      alert('Test statusini o\'zgartirishda xatolik yuz berdi!')
    }
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

  const retryConnection = async () => {
    setLoading(true)
    await initializeData()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Testlar yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* API Status Alert */}
      {(apiError || isOfflineMode) && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{apiError || "Offline rejimda ishlamoqda"}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={retryConnection}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Qayta urinish
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Reading Testlari
            {isOfflineMode ? (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            ) : (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            )}
          </h2>
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
                <p className="text-2xl font-bold">{stats.totalTests}</p>
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
                <p className="text-2xl font-bold">{stats.activeTests}</p>
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
                <p className="text-2xl font-bold">{stats.totalAttempts}</p>
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
                <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">O'rtacha Ball</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}    
      <Card className="rounded-3xl border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reading Testlar Ro'yxati</span>
            <Button
              variant="outline"
              size="sm"
              onClick={isOfflineMode ? () => calculateStatsFromTests() : loadTests}
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Yangilash'
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            IELTS Reading testlari va ularning statistikasi ({filteredTests.length} ta test)
            {isOfflineMode && " - Demo rejimi"}
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
                          {isOfflineMode && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              Demo
                            </Badge>
                          )}
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
                          Yaratilgan: {new Date(test.createdAt).toLocaleDateString('uz-UZ')}
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
                                
                                {selectedTest.passages_data && selectedTest.passages_data.length > 0 ? (
                                  <div className="space-y-4">
                                    <h3 className="text-lg font-semibold">Matnlar va Savollar</h3>
                                    {selectedTest.passages_data.map((passage: any, index: number) => (
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
                                              {passage.questions?.map((question: any, qIndex: number) => (
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
                                                        {question.options.map((option: string, optIndex: number) => (
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
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
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