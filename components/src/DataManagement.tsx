"use client"

import React, { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { 
  Download, 
  Upload, 
  Trash2, 
  RefreshCw, 
  Database, 
  FileText, 
  CheckCircle, 
  AlertTriangle,
  Loader2,
  Copy,
  Save,
  Archive
} from "lucide-react"
import { localStorageService } from "@/lib/localStorageService"
import { sampleDataService } from "@/lib/sampleDataService"
import { testRunner } from "@/lib/testRunner"

export default function DataManagement() {
  const [loading, setLoading] = useState(false)
  const [testResults, setTestResults] = useState<any[]>([])
  const [dataStats, setDataStats] = useState({
    listening: 0,
    reading: 0,
    writing: 0,
    total: 0
  })

  // Load data statistics
  const loadDataStats = () => {
    const listening = localStorageService.getListeningTests().length
    const reading = localStorageService.getReadingTests().length
    const writing = localStorageService.getWritingTests().length
    
    setDataStats({
      listening,
      reading,
      writing,
      total: listening + reading + writing
    })
  }

  // Export data
  const handleExportData = async () => {
    try {
      setLoading(true)
      const data = localStorageService.exportData()
      
      // Create and download file
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `ielts-data-${new Date().toISOString().split('T')[0]}.json`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
      
      alert("Ma'lumotlar muvaffaqiyatli eksport qilindi!")
    } catch (error) {
      console.error("Export error:", error)
      alert("Eksport qilishda xatolik yuz berdi!")
    } finally {
      setLoading(false)
    }
  }

  // Import data
  const handleImportData = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    try {
      setLoading(true)
      const text = await file.text()
      const success = localStorageService.importData(text)
      
      if (success) {
        loadDataStats()
        alert("Ma'lumotlar muvaffaqiyatli import qilindi!")
      } else {
        alert("Import qilishda xatolik yuz berdi!")
      }
    } catch (error) {
      console.error("Import error:", error)
      alert("Import qilishda xatolik yuz berdi!")
    } finally {
      setLoading(false)
    }
  }

  // Clear all data
  const handleClearData = () => {
    if (!window.confirm("Rostdan ham barcha ma'lumotlarni o'chirmoqchimisiz? Bu amalni qaytarib bo'lmaydi!")) {
      return
    }

    try {
      localStorageService.clearAllData()
      loadDataStats()
      alert("Barcha ma'lumotlar o'chirildi!")
    } catch (error) {
      console.error("Clear data error:", error)
      alert("Ma'lumotlarni o'chirishda xatolik yuz berdi!")
    }
  }

  // Initialize sample data
  const handleInitializeSampleData = () => {
    try {
      sampleDataService.initializeSampleData()
      loadDataStats()
      alert("Namuna ma'lumotlar yaratildi!")
    } catch (error) {
      console.error("Sample data error:", error)
      alert("Namuna ma'lumotlarni yaratishda xatolik yuz berdi!")
    }
  }

  // Run system tests
  const handleRunTests = async () => {
    try {
      setLoading(true)
      const results = await testRunner.runAllTests()
      setTestResults(results)
      
      const passed = results.filter(r => r.status === 'passed').length
      const total = results.length
      
      alert(`Test natijalari: ${passed}/${total} test muvaffaqiyatli o'tdi!`)
    } catch (error) {
      console.error("Test error:", error)
      alert("Testlarni o'tkazishda xatolik yuz berdi!")
    } finally {
      setLoading(false)
    }
  }

  // Load stats on component mount
  React.useEffect(() => {
    loadDataStats()
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'bg-green-100 text-green-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-yellow-100 text-yellow-800'
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8 text-blue-600" />
            Ma'lumotlar Boshqaruvi
            <Badge variant="outline" className="text-blue-600 border-blue-600">
              <CheckCircle className="h-3 w-3 mr-1" />
              Local
            </Badge>
          </h2>
          <p className="text-muted-foreground">IELTS test ma'lumotlarini boshqarish va tahlil qilish</p>
        </div>
      </div>

      {/* Data Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{dataStats.total}</p>
                <p className="text-sm text-muted-foreground">Jami Testlar</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Archive className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{dataStats.listening}</p>
                <p className="text-sm text-muted-foreground">Listening</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <FileText className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{dataStats.reading}</p>
                <p className="text-sm text-muted-foreground">Reading</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Save className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{dataStats.writing}</p>
                <p className="text-sm text-muted-foreground">Writing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Management Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Export/Import Section */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Download className="h-5 w-5" />
              Ma'lumotlarni Eksport/Import
            </CardTitle>
            <CardDescription>
              Ma'lumotlarni fayl sifatida saqlash yoki yuklash
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleExportData} 
              disabled={loading || dataStats.total === 0}
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Download className="h-4 w-4 mr-2" />}
              Ma'lumotlarni Eksport Qilish
            </Button>
            
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                disabled={loading}
              />
              <Button variant="outline" className="w-full" disabled={loading}>
                {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Upload className="h-4 w-4 mr-2" />}
                Ma'lumotlarni Import Qilish
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Data Operations Section */}
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Ma'lumotlar Operatsiyalari
            </CardTitle>
            <CardDescription>
              Ma'lumotlarni boshqarish va tizim testlari
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button 
              onClick={handleInitializeSampleData}
              disabled={loading}
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
              Namuna Ma'lumotlar Yaratish
            </Button>
            
            <Button 
              onClick={handleRunTests}
              disabled={loading}
              variant="outline"
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle className="h-4 w-4 mr-2" />}
              Tizim Testlarini O'tkazish
            </Button>
            
            <Button 
              onClick={handleClearData}
              disabled={loading || dataStats.total === 0}
              variant="destructive"
              className="w-full"
            >
              {loading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Trash2 className="h-4 w-4 mr-2" />}
              Barcha Ma'lumotlarni O'chirish
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Test Results */}
      {testResults.length > 0 && (
        <Card className="rounded-3xl">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5" />
              Test Natijalari
            </CardTitle>
            <CardDescription>
              Tizim testlarining natijalari
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-3">
                    {result.status === 'passed' ? (
                      <CheckCircle className="h-5 w-5 text-green-600" />
                    ) : (
                      <AlertTriangle className="h-5 w-5 text-red-600" />
                    )}
                    <div>
                      <p className="font-medium">{result.module}</p>
                      <p className="text-sm text-muted-foreground">{result.message}</p>
                    </div>
                  </div>
                  <Badge className={getStatusColor(result.status)}>
                    {result.status}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Information Alert */}
      <Alert className="border-blue-200 bg-blue-50">
        <Database className="h-4 w-4" />
        <AlertDescription>
          <strong>Ma'lumot:</strong> Barcha ma'lumotlar brauzerning local storage da saqlanadi. 
          Backend bilan bog'lanish yo'qligi sababli ma'lumotlar faqat local kompyuteringizda saqlanadi.
        </AlertDescription>
      </Alert>
    </div>
  )
} 