
// "use client"

// import React from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Filter, Plus } from "lucide-react"

// export default function Writing() {
//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold">Writing Testlari</h2>
//           <p className="text-muted-foreground">IELTS Writing bo'limiga oid testlar va ma'lumotlar</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" className="rounded-2xl">
//             <Filter className="mr-2 h-4 w-4" />
//             Filtr
//           </Button>
//           <Button className="rounded-2xl">
//             <Plus className="mr-2 h-4 w-4" />
//             Yangi Writing Test
//           </Button>
//         </div>
//       </div>
//       <Card className="rounded-3xl border-2">
//         <CardHeader>
//           <CardTitle>Writing Testlar Ro'yxati</CardTitle>
//           <CardDescription>IELTS Writing testlari va ularning statistikasi</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-muted-foreground">
//             Hozircha Writing testlari uchun ma'lumotlar mavjud emas. Yangi test qo'shish uchun yuqoridagi tugmani bosing.
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }




"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Filter, Plus, Edit, Trash2, Users, Clock, Calendar, BookOpen, X, Loader2, BarChart3, Target, CheckCircle, AlertCircle } from "lucide-react"

// Import Local API
import { writingLocalAPI as writingTestAPI, type WritingTestResponse, type WritingTestStats } from "./writingLocalAPI"

// Local API integration for Writing tests

export default function Writing() {
  // State management
  const [tests, setTests] = useState<WritingTestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState<WritingTestStats>({
    totalTests: 0,
    activeTests: 0,
    totalAttempts: 0,
    averageScore: 0
  })
  const [filterType, setFilterType] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newTest, setNewTest] = useState({
    title: "",
    type: "Task 1",
    category: "Academic",
    prompt: "",
    instructions: "",
    timeLimit: 20,
    wordLimit: 150,
    criteria: {
      taskAchievement: 25,
      coherenceCohesion: 25,
      lexicalResource: 25,
      grammaticalRange: 25
    }
  })

  // Load data on component mount
  useEffect(() => {
    loadData()
  }, [])

  // Load data function
  const loadData = async () => {
    try {
      setLoading(true)
      const [testsData, statsData] = await Promise.all([
        writingTestAPI.getAllTests({
          type: filterType !== "all" ? filterType : undefined,
          category: filterCategory !== "all" ? filterCategory : undefined
        }),
        writingTestAPI.getTestStats()
      ])
      setTests(testsData)
      setStats(statsData)
    } catch (error) {
      console.error('Error loading writing data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Reload when filters change
  useEffect(() => {
    if (!loading) {
      loadData()
    }
  }, [filterType, filterCategory])

  // Filtrlash funksiyasi
  const filteredTests = tests.filter(test => {
    const typeMatch = filterType === "all" || test.type === filterType
    const categoryMatch = filterCategory === "all" || test.category === filterCategory
    return typeMatch && categoryMatch
  })

  // Test o'chirish
  const handleDeleteTest = async (id: string) => {
    if (!window.confirm("Rostdan ham bu testni o'chirmoqchimisiz?")) return

    try {
      await writingTestAPI.deleteTest(id)
      setTests(tests.filter(test => test.id !== id))
      
      // Reload stats
      const newStats = await writingTestAPI.getTestStats()
      setStats(newStats)
      
      alert("Test muvaffaqiyatli o'chirildi!")
    } catch (error) {
      console.error("Error deleting test:", error)
      alert("Test o'chirishda xatolik yuz berdi!")
    }
  }

  // Yangi test yaratish
  const handleCreateTest = async () => {
    if (!newTest.title || !newTest.type || !newTest.category || !newTest.prompt) {
      alert("Iltimos, barcha majburiy maydonlarni to'ldiring!")
      return
    }

    try {
      const createRequest = {
        title: newTest.title,
        type: newTest.type as "Task 1" | "Task 2",
        category: newTest.category as "Academic" | "General Training",
        prompt: newTest.prompt,
        instructions: newTest.instructions,
        timeLimit: newTest.timeLimit,
        wordLimit: newTest.wordLimit,
        criteria: newTest.criteria
      }

      const newTestResponse = await writingTestAPI.createTest(createRequest)
      setTests([newTestResponse, ...tests])
      
      // Reload stats
      const newStats = await writingTestAPI.getTestStats()
      setStats(newStats)
      
      setIsCreateModalOpen(false)
      setNewTest({
        title: "",
        type: "Task 1",
        category: "Academic",
        prompt: "",
        instructions: "",
        timeLimit: 20,
        wordLimit: 150,
        criteria: {
          taskAchievement: 25,
          coherenceCohesion: 25,
          lexicalResource: 25,
          grammaticalRange: 25
        }
      })
      
      alert(`"${newTestResponse.title}" testi muvaffaqiyatli yaratildi!`)
    } catch (error) {
      console.error("Error creating test:", error)
      alert("Test yaratishda xatolik yuz berdi!")
    }
  }

  // Modal yopish
  const handleCloseModal = () => {
    setIsCreateModalOpen(false)
    setNewTest({
      title: "",
      type: "Task 1",
      category: "Academic",
      prompt: "",
      instructions: "",
      timeLimit: 20,
      wordLimit: 150,
      criteria: {
        taskAchievement: 25,
        coherenceCohesion: 25,
        lexicalResource: 25,
        grammaticalRange: 25
      }
    })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Writing testlari yuklanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header bo'limi */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-green-600" />
            Writing Testlari
            <Badge variant="outline" className="text-green-600 border-green-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Local
            </Badge>
          </h2>
          <p className="text-muted-foreground">IELTS Writing bo'limiga oid testlar va ma'lumotlar</p>
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] rounded-2xl">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha Turlar</SelectItem>
              <SelectItem value="Task 1">Task 1</SelectItem>
              <SelectItem value="Task 2">Task 2</SelectItem>
            </SelectContent>
          </Select>

          <Select value={filterCategory} onValueChange={setFilterCategory}>
            <SelectTrigger className="w-[120px] rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha Kategoriyalar</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="General Training">General Training</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
            <DialogTrigger asChild>
              <Button className="rounded-2xl">
                <Plus className="mr-2 h-4 w-4" />
                Yangi Writing Test
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Yangi Writing Test Yaratish</DialogTitle>
                <DialogDescription>
                  IELTS Writing testi uchun barcha kerakli ma'lumotlarni kiriting
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4">
                {/* Test nomi */}
                <div className="grid gap-2">
                  <Label htmlFor="title">Test Nomi *</Label>
                  <Input
                    id="title"
                    placeholder="Masalan: Academic Writing Task 1 - Line Graph"
                    value={newTest.title}
                    onChange={(e) => setNewTest({...newTest, title: e.target.value})}
                  />
                </div>

                {/* Test turi va kategoriyasi */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="type">Test Turi *</Label>
                    <Select value={newTest.type} onValueChange={(value) => setNewTest({...newTest, type: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Task 1">Task 1</SelectItem>
                        <SelectItem value="Task 2">Task 2</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="category">Kategoriya *</Label>
                    <Select value={newTest.category} onValueChange={(value) => setNewTest({...newTest, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Tanlang" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Academic">Academic</SelectItem>
                        <SelectItem value="General">General Training</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Vaqt va so'zlar chegarasi */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="grid gap-2">
                    <Label htmlFor="timeLimit">Davomiyligi (daqiqa) *</Label>
                    <Input
                      id="timeLimit"
                      type="number"
                      placeholder="20"
                      value={newTest.timeLimit}
                      onChange={(e) => setNewTest({...newTest, timeLimit: parseInt(e.target.value) || 20})}
                    />
                  </div>

                  <div className="grid gap-2">
                    <Label htmlFor="wordLimit">So'zlar chegarasi</Label>
                    <Input
                      id="wordLimit"
                      type="number"
                      placeholder="150"
                      value={newTest.wordLimit}
                      onChange={(e) => setNewTest({...newTest, wordLimit: parseInt(e.target.value) || 150})}
                    />
                  </div>
                </div>

                {/* Prompt */}
                <div className="grid gap-2">
                  <Label htmlFor="prompt">Writing Prompt *</Label>
                  <Textarea
                    id="prompt"
                    placeholder="Masalan: The chart below shows the percentage of households in different income brackets..."
                    value={newTest.prompt}
                    onChange={(e) => setNewTest({...newTest, prompt: e.target.value})}
                    rows={4}
                  />
                </div>

                {/* Instructions */}
                <div className="grid gap-2">
                  <Label htmlFor="instructions">Ko'rsatmalar</Label>
                  <Textarea
                    id="instructions"
                    placeholder="Masalan: Write at least 150 words. You should spend about 20 minutes on this task."
                    value={newTest.instructions}
                    onChange={(e) => setNewTest({...newTest, instructions: e.target.value})}
                    rows={2}
                  />
                </div>

                {/* Tavsif */}
                <div className="grid gap-2">
                  <Label htmlFor="description">Qisqa Tavsif</Label>
                  <Input
                    id="description"
                    placeholder="Test haqida qisqa ma'lumot"
                    value={newTest.description}
                    onChange={(e) => setNewTest({...newTest, description: e.target.value})}
                  />
                </div>

                {/* Ko'rsatmalar */}
                <div className="grid gap-2">
                  <Label htmlFor="instructions">Ko'rsatmalar</Label>
                  <Textarea
                    id="instructions"
                    placeholder="O'quvchilar uchun ko'rsatmalar yozing..."
                    value={newTest.instructions}
                    onChange={(e) => setNewTest({...newTest, instructions: e.target.value})}
                    rows={3}
                  />
                </div>


              </div>

              <DialogFooter>
                <Button variant="outline" onClick={handleCloseModal}>
                  Bekor qilish
                </Button>
                <Button onClick={handleCreateTest}>
                  Test Yaratish
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-green-600" />
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
              <CheckCircle className="h-8 w-8 text-blue-600" />
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



      {/* Filtr tugmalari */}
      <div className="flex flex-wrap gap-2">
        <Button 
          variant={filterType === "all" ? "default" : "outline"}
          size="sm"
          className="rounded-2xl"
          onClick={() => setFilterType("all")}
        >
          Barchasi
        </Button>
        <Button 
          variant={filterType === "Task 1" ? "default" : "outline"}
          size="sm"
          className="rounded-2xl"
          onClick={() => setFilterType("Task 1")}
        >
          Task 1
        </Button>
        <Button 
          variant={filterType === "Task 2" ? "default" : "outline"}
          size="sm"
          className="rounded-2xl"
          onClick={() => setFilterType("Task 2")}
        >
          Task 2
        </Button>
        <Button 
          variant={filterCategory === "Academic" ? "default" : "outline"}
          size="sm"
          className="rounded-2xl"
          onClick={() => setFilterCategory("Academic")}
        >
          Academic
        </Button>
        <Button 
          variant={filterCategory === "General" ? "default" : "outline"}
          size="sm"
          className="rounded-2xl"
          onClick={() => setFilterCategory("General")}
        >
          General Training
        </Button>
      </div>

      {/* Testlar ro'yxati */}
      <Card className="rounded-3xl border-2">
        <CardHeader>
          <CardTitle>Writing Testlar Ro'yxati</CardTitle>
          <CardDescription>IELTS Writing testlari va ularning statistikasi</CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTests.length === 0 ? (
            <div className="text-center py-8">
              <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground text-lg mb-2">
                Hech qanday test topilmadi
              </p>
              <p className="text-muted-foreground text-sm">
                Yangi test qo'shish uchun yuqoridagi tugmani bosing.
              </p>
            </div>
          ) : (
            <div className="grid gap-4">
              {filteredTests.map((test) => (
                <Card key={test.id} className="rounded-2xl border hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-semibold">{test.title}</h3>
                          <Badge variant="outline" className="rounded-full">
                            {test.type}
                          </Badge>
                          <Badge 
                            variant={test.category === "Academic" ? "default" : "secondary"}
                            className="rounded-full"
                          >
                            {test.category}
                          </Badge>
                        </div>
                        <p className="text-muted-foreground text-sm mb-4">{test.prompt?.substring(0, 100)}...</p>
                        
                        <div className="flex flex-wrap gap-4 text-sm">
                          <div className="flex items-center gap-1">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              Yaratilgan: {new Date(test.createdAt).toLocaleDateString('uz-UZ')}
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">{test.timeLimit} daqiqa</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4 text-muted-foreground" />
                            <span className="text-muted-foreground">
                              {test.attempts} urinish
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <span className="text-muted-foreground">O'rtacha ball:</span>
                            <span className="font-semibold text-green-600">{test.avgScore.toFixed(1)}</span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" className="rounded-xl">
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="rounded-xl text-red-600 hover:text-red-700"
                          onClick={() => handleDeleteTest(test.id)}
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
    </div>
  )
}