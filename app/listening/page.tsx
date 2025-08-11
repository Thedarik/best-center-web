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
  ArrowLeft,
  ArrowRight,
  Pause,
  SkipBack,
  SkipForward,
  List
} from "lucide-react"

// Import Local API va components
import {
  listeningLocalAPI as listeningTestAPI,
  type ListeningTestResponse,
  type CreateListeningTestRequest,
  type ListeningTestStats,
} from "@/components/src/ielts_file/listining_file/listeningLocalAPI"
import { useRouter } from "next/navigation"

export default function ListeningPage() {
  const router = useRouter()
  
  // State management
  const [tests, setTests] = useState<ListeningTestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [apiError, setApiError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState<boolean | null>(null)

  // Check connection status
  const checkConnection = async () => {
    try {
      const response = await listeningTestAPI.healthCheck()
      setIsOnline(true)
      setApiError(null)
    } catch (error) {
      setIsOnline(false)
      setApiError("Backend bilan bog'lanish yo'q")
    }
  }

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      const response = await listeningTestAPI.getAllTests()
      setTests(response || [])
      setApiError(null)
    } catch (error) {
      console.error("Ma'lumotlarni yuklashda xatolik:", error)
      setApiError("Ma'lumotlarni yuklashda xatolik yuz berdi")
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    checkConnection()
    loadData()
  }, [])

  const handleCreateTest = () => {
    router.push("/listening/create-test")
  }

  const handleEditTest = (test: ListeningTestResponse) => {
    router.push(`/listening/edit-test/${test.id}`)
  }

  const handleViewTest = (test: ListeningTestResponse, mode: "preview" | "practice" | "exam" = "preview") => {
    router.push(`/listening/test/${test.id}?mode=${mode}`)
  }

  const deleteTest = async (id: string) => {
    if (confirm("Bu testni o'chirishni xohlaysizmi?")) {
      try {
        await listeningTestAPI.deleteTest(id)
        await loadData()
      } catch (error) {
        console.error("Testni o'chirishda xatolik:", error)
      }
    }
  }

  const toggleStatus = async (id: string) => {
    try {
      const test = tests.find(t => t.id === id)
      if (test) {
        const newStatus = test.status === "Active" ? "Draft" : "Active"
        await listeningTestAPI.updateTest(id, { status: newStatus })
        await loadData()
      }
    } catch (error) {
      console.error("Statusni o'zgartirishda xatolik:", error)
    }
  }

  const retryConnection = async () => {
    await checkConnection()
    await loadData()
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200"
      case "Draft":
        return "bg-yellow-100 text-yellow-800 border-yellow-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Academic":
        return "bg-blue-100 text-blue-800 border-blue-200"
      case "General Training":
        return "bg-purple-100 text-purple-800 border-purple-200"
      default:
        return "bg-gray-100 text-gray-800 border-gray-200"
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Ma'lumotlar yuklanmoqda...</p>
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

      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Headphones className="h-8 w-8 text-blue-600" />
            IELTS Listening Testlari
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
                <Loader2 className="h-3 w-3 animate-spin" />
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
            <SelectTrigger className="w-[140px] rounded-2xl">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha Statuslar</SelectItem>
              <SelectItem value="Active">Active</SelectItem>
              <SelectItem value="Draft">Draft</SelectItem>
            </SelectContent>
          </Select>
          <Button className="rounded-2xl" onClick={handleCreateTest}>
            <Plus className="mr-2 h-4 w-4" />
            Yangi Listening Test
          </Button>
        </div>
      </div>

      {/* Test Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-2xl border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <BarChart3 className="h-6 w-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{tests.length}</p>
                <p className="text-sm text-muted-foreground">Jami Testlar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {tests.filter(t => t.status === "Active").length}
                </p>
                <p className="text-sm text-muted-foreground">Faol Testlar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {tests.reduce((total, test) => total + test.attempts, 0)}
                </p>
                <p className="text-sm text-muted-foreground">Jami Urinishlar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-2">
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">
                  {tests.length > 0 
                    ? Math.round(tests.reduce((total, test) => total + test.avgScore, 0) / tests.length)
                    : 0}%
                </p>
                <p className="text-sm text-muted-foreground">O'rtacha Ball</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}
      <Card className="rounded-2xl border-2">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <List className="h-5 w-5" />
            Testlar Ro'yxati
          </CardTitle>
          <CardDescription>
            Barcha IELTS Listening testlari va ularning ma'lumotlari
          </CardDescription>
        </CardHeader>
        <CardContent>
          {tests.length === 0 ? (
            <div className="text-center py-12">
              <Headphones className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Hali testlar yaratilmagan</h3>
              <p className="text-gray-600 mb-4">Birinchi listening testini yarating va o'quvchilar uchun tayyorlang</p>
              <Button onClick={handleCreateTest}>
                <Plus className="h-4 w-4 mr-2" />
                Birinchi Testni Yaratish
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              {tests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                      <Headphones className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{test.title}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge variant="outline" className={getTypeColor(test.type)}>
                          {test.type}
                        </Badge>
                        <Badge variant="outline" className={getStatusColor(test.status)}>
                          {test.status}
                        </Badge>
                        <span className="text-sm text-gray-500">
                          {test.sections} bo'lim • {test.questions} savol
                        </span>
                      </div>
                      <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                        <span>Daraja: {test.level}</span>
                        <span>Vaqt: {test.timeLimit} daq</span>
                        <span>Yaratilgan: {new Date(test.createdAt).toLocaleDateString('uz-UZ')}</span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="text-right mr-4">
                      <p className="text-sm text-muted-foreground">Urinishlar</p>
                      <p className="font-semibold">{test.attempts}</p>
                    </div>
                    <div className="text-right mr-4">
                      <p className="text-sm text-muted-foreground">O'rtacha</p>
                      <p className="font-semibold">{test.avgScore}%</p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTest(test, "preview")}
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        Ko'rish
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTest(test, "practice")}
                      >
                        <Play className="h-4 w-4 mr-1" />
                        Amaliyot
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewTest(test, "exam")}
                      >
                        <Clock className="h-4 w-4 mr-1" />
                        Imtihon
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditTest(test)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleStatus(test.id)}
                      >
                        {test.status === "Active" ? "Faol" : "Draft"}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteTest(test.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
