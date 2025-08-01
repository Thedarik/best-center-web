
// "use client"

// import React from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Filter, Plus } from "lucide-react"

// export default function Listening() {
//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold">Listening Testlari</h2>
//           <p className="text-muted-foreground">IELTS Listening bo'limiga oid testlar va ma'lumotlar</p>
//         </div>
//         <div className="flex gap-2">
//           <Button variant="outline" className="rounded-2xl">
//             <Filter className="mr-2 h-4 w-4" />
//             Filtr
//           </Button>
//           <Button className="rounded-2xl">
//             <Plus className="mr-2 h-4 w-4" />
//             Yangi Listening Test
//           </Button>
//         </div>a
//       </div>
//       <Card className="rounded-3xl border-2">
//         <CardHeader>
//           <CardTitle>Listening Testlar Ro'yxati</CardTitle>
//           <CardDescription>IELTS Listening testlari va ularning statistikasi</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <p className="text-muted-foreground">
//             Hozircha Listening testlari uchun ma'lumotlar mavjud emas. Yangi test qo'shish uchun yuqoridagi tugmani bosing.
//           </p>
//         </CardContent>
//       </Card>
//     </div>
//   )
// }






"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Filter,
  Plus,
  Edit,
  Trash2,
  Eye,
  Clock,
  Users,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw,
  Play,
  Volume2,
  Headphones,
} from "lucide-react"

// Import Local API va components
import {
  listeningLocalAPI as listeningTestAPI,
  type ListeningTestResponse,
  type CreateListeningTestRequest,
  type ListeningTestStats,
} from "./listeningLocalAPI"
import CreateListeningTest from "./CreateListeningTest"
import ListeningTestViewer from "./ListeningTestViewer"

export default function ListeningWithBackend() {
  // State management
  const [tests, setTests] = useState<ListeningTestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editingTest, setEditingTest] = useState<ListeningTestResponse | null>(null)
  const [selectedTest, setSelectedTest] = useState<ListeningTestResponse | null>(null)
  const [viewMode, setViewMode] = useState<"list" | "viewer">("list")
  const [testViewerMode, setTestViewerMode] = useState<"preview" | "practice" | "exam">("preview")
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [apiError, setApiError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [toggleLoading, setToggleLoading] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState<ListeningTestStats>({
    totalTests: 0,
    activeTests: 0,
    totalAttempts: 0,
    averageScore: 0,
  })

  // Connection check
  const checkConnection = async () => {
    try {
      const connected = await listeningTestAPI.testConnection()
      setIsOnline(connected)
      if (connected) {
        setApiError(null)
      } else {
        setApiError("Backend bilan bog'lanish mumkin emas")
      }
      return connected
    } catch (error) {
      setIsOnline(false)
      setApiError("Server xatoligi")
      return false
    }
  }

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      setApiError(null)

      const connected = await checkConnection()
      if (!connected) {
        throw new Error("Backend connection failed")
      }

      // Load tests and stats in parallel
      const [testsData, statsData] = await Promise.all([
        listeningTestAPI.getAllTests({
          type: filterType !== "all" ? filterType : undefined,
          status: filterStatus !== "all" ? filterStatus : undefined,
        }),
        listeningTestAPI.getTestStats(),
      ])

      setTests(testsData)
      setStats(statsData)
      setIsOnline(true)
    } catch (error) {
      console.error("Error loading data:", error)
      setApiError(error instanceof Error ? error.message : "Ma'lumotlarni yuklashda xatolik")
      setIsOnline(false)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadData()
  }, [])

  // Reload when filters change
  useEffect(() => {
    if (isOnline) {
      loadData()
    }
  }, [filterType, filterStatus])

  // Handle test creation
  const handleTestCreate = async (testData: any) => {
    try {
      const createRequest: CreateListeningTestRequest = {
        title: testData.title,
        type: testData.type,
        level: testData.level,
        timeLimit: testData.timeLimit,
        sections_data: testData.sections_data,
      }

      const newTest = await listeningTestAPI.createTest(createRequest)

      // Update local state
      setTests((prev) => [newTest, ...prev])

      // Reload stats
      const newStats = await listeningTestAPI.getTestStats()
      setStats(newStats)

      // Show success message
      alert(`"${newTest.title}" testi muvaffaqiyatli yaratildi!`)
    } catch (error) {
      console.error("Error creating test:", error)
      const errorMessage = error instanceof Error ? error.message : "Test yaratishda xatolik yuz berdi!"
      alert(`Xatolik: ${errorMessage}`)
      throw error
    }
  }

  // Handle test editing
  const handleEditTest = (test: ListeningTestResponse) => {
    setEditingTest(test)
    setIsEditDialogOpen(true)
  }

  // Handle test update
  const handleTestUpdate = async (testData: any) => {
    if (!editingTest) return

    try {
      const updateRequest: CreateListeningTestRequest = {
        title: testData.title,
        type: testData.type,
        level: testData.level,
        timeLimit: testData.timeLimit,
        sections_data: testData.sections_data,
      }

      const updatedTest = await listeningTestAPI.updateTest(editingTest.id, updateRequest)

      if (!updatedTest) {
        throw new Error("Test yangilashda xatolik yuz berdi")
      }

      // Update local state
      setTests((prev) => prev.map((test) => (test.id === editingTest.id ? updatedTest : test)))

      // Reload stats
      const newStats = await listeningTestAPI.getTestStats()
      setStats(newStats)

      // Close dialog and reset
      setIsEditDialogOpen(false)
      setEditingTest(null)

      // Show success message
      alert(`"${updatedTest.title}" testi muvaffaqiyatli yangilandi!`)
    } catch (error) {
      console.error("Error updating test:", error)
      const errorMessage = error instanceof Error ? error.message : "Test yangilashda xatolik yuz berdi!"
      alert(`Xatolik: ${errorMessage}`)
      throw error
    }
  }

  // Delete test
  const deleteTest = async (id: string) => {
    if (!window.confirm("Rostdan ham bu testni o'chirmoqchimisiz?")) return

    try {
      await listeningTestAPI.deleteTest(id)
      setTests(tests.filter((test) => test.id !== id))

      // Reload stats
      const newStats = await listeningTestAPI.getTestStats()
      setStats(newStats)

      alert("Test muvaffaqiyatli o'chirildi!")
    } catch (error) {
      console.error("Error deleting test:", error)
      alert("Test o'chirishda xatolik yuz berdi!")
    }
  }

  // Toggle test status
  const toggleStatus = async (id: string) => {
    if (toggleLoading.has(id)) return

    try {
      setToggleLoading((prev) => new Set([...prev, id]))

      const updatedTest = await listeningTestAPI.toggleTestStatus(id)
      if (updatedTest) {
        setTests(tests.map((test) => (test.id === id ? updatedTest : test)))
      }

      // Reload stats
      const newStats = await listeningTestAPI.getTestStats()
      setStats(newStats)
    } catch (error) {
      console.error("Error toggling test status:", error)
      alert("Test statusini o'zgartirishda xatolik yuz berdi!")
    } finally {
      setToggleLoading((prev) => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  // Handle test view
  const handleViewTest = (test: ListeningTestResponse, mode: "preview" | "practice" | "exam" = "preview") => {
    setSelectedTest(test)
    setTestViewerMode(mode)
    setViewMode("viewer")
  }

  // Back to list
  const handleBackToList = () => {
    setViewMode("list")
    setSelectedTest(null)
  }

  // Retry connection
  const retryConnection = async () => {
    setLoading(true)
    await loadData()
  }

  const filteredTests = tests.filter((test) => {
    const typeMatch = filterType === "all" || test.type === filterType
    const statusMatch = filterStatus === "all" || test.status === filterStatus
    return typeMatch && statusMatch
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Draft":
        return "bg-yellow-100 text-yellow-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "Academic" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
  }

  // Show test viewer if selected
  if (viewMode === "viewer" && selectedTest) {
    return <ListeningTestViewer testData={selectedTest} onBack={handleBackToList} mode={testViewerMode} />
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Backend bilan bog'lanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Alert */}
      {(apiError || isOnline === false) && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{apiError || "Backend bilan bog'lanish yo'q"}</span>
            <Button variant="outline" size="sm" onClick={retryConnection} disabled={loading}>
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
              Qayta urinish
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Headphones className="h-8 w-8 text-blue-600" />
            Listening Testlari
            {isOnline === true ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            ) : isOnline === false ? (
              <Badge variant="outline" className="text-red-600 border-red-600">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            ) : (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Checking...
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">IELTS Listening bo'limiga oid testlar va ma'lumotlar</p>
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

          <Button className="rounded-2xl" onClick={() => setIsCreateDialogOpen(true)} disabled={isOnline === false}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi Listening Test
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Volume2 className="h-8 w-8 text-blue-600" />
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
            <span>Listening Testlar Ro'yxati</span>
            <Button variant="outline" size="sm" onClick={loadData} disabled={loading || isOnline === false}>
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Yangilash"}
            </Button>
          </CardTitle>
          <CardDescription>
            IELTS Listening testlari va ularning statistikasi ({filteredTests.length} ta test)
            {isOnline === false && " - Offline rejimi"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTests.length === 0 ? (
            <div className="text-center py-8">
              <Headphones className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground mt-2">
                {filterType !== "all" || filterStatus !== "all"
                  ? "Filter shartlariga mos test topilmadi."
                  : isOnline === false
                    ? "Backend bilan bog'lanib bo'lmayapti."
                    : "Hech qanday test topilmadi. Yangi test yaratish uchun yuqoridagi tugmani bosing."}
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
                          {isOnline === false && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              Cached
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <Volume2 className="h-4 w-4" />
                            <span>{test.sections} ta bo'lim</span>
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
                          Yaratilgan: {new Date(test.createdAt).toLocaleDateString("uz-UZ")}
                          {test.updatedAt && test.updatedAt !== test.createdAt && (
                            <span> • Yangilangan: {new Date(test.updatedAt).toLocaleDateString("uz-UZ")}</span>
                          )}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        {/* View Test Button */}
                        <Button variant="default" size="sm" onClick={() => handleViewTest(test, "preview")}>
                          <Eye className="h-4 w-4 mr-2" />
                          Ko'rish
                        </Button>

                        {/* Practice Button */}
                        <Button variant="outline" size="sm" onClick={() => handleViewTest(test, "practice")}>
                          <Play className="h-4 w-4" />
                        </Button>

                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => handleEditTest(test)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>

                        <Button
                          variant={test.status === "Active" ? "default" : "outline"}
                          size="sm"
                          onClick={() => toggleStatus(test.id)}
                          disabled={toggleLoading.has(test.id) || isOnline === false}
                        >
                          {toggleLoading.has(test.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : test.status === "Active" ? (
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
                          disabled={isOnline === false}
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

      {/* Create Listening Test Component */}
      <CreateListeningTest
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTestCreate={handleTestCreate}
      />

      {/* Edit Listening Test Component */}
      {editingTest && (
        <CreateListeningTest
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          onTestCreate={handleTestUpdate}
          editingTest={editingTest}
          mode="edit"
        />
      )}
    </div>
  )
}
