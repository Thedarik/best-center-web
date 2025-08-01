"use client"

import React, { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Wifi,
  WifiOff,
  RefreshCw,
  CheckCircle,
  XCircle,
  Loader2,
  Server
} from "lucide-react"
import { readingTestAPI } from "@/components/src/ielts_file/reading_file/readingTestAPI"

export default function ConnectionTest() {
  const [isConnected, setIsConnected] = useState<boolean | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [serverInfo, setServerInfo] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testConnection = async () => {
    setIsLoading(true)
    setError(null)
    
    try {
      // Health check qilish
      const healthData = await readingTestAPI.healthCheck()
      setServerInfo(healthData)
      setIsConnected(true)
      
      // Test ma'lumotlarini olishga harakat qilish
      await readingTestAPI.getAllTests()
      
    } catch (err: any) {
      console.error('Connection test failed:', err)
      setIsConnected(false)
      setError(err.message || 'Connection failed')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    testConnection()
  }, [])

  const getStatusColor = () => {
    if (isConnected === null) return "bg-gray-100 text-gray-800"
    return isConnected ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
  }

  const getStatusIcon = () => {
    if (isLoading) return <Loader2 className="h-4 w-4 animate-spin" />
    if (isConnected === null) return <Server className="h-4 w-4" />
    return isConnected ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />
  }

  const getStatusText = () => {
    if (isLoading) return "Tekshirilmoqda..."
    if (isConnected === null) return "Noma'lum"
    return isConnected ? "Ulangan" : "Ulanmagan"
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Server className="h-5 w-5" />
          API Connection Status
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm text-muted-foreground">Backend API:</span>
          <Badge className={getStatusColor()}>
            {getStatusIcon()}
            <span className="ml-2">{getStatusText()}</span>
          </Badge>
        </div>

        <div className="text-xs text-muted-foreground">
          <strong>API URL:</strong> {process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}
        </div>

        {serverInfo && (
          <div className="space-y-2">
            <div className="text-xs text-muted-foreground">
              <strong>Server:</strong> {serverInfo.message}
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Status:</strong> {serverInfo.status}
            </div>
            <div className="text-xs text-muted-foreground">
              <strong>Timestamp:</strong> {new Date(serverInfo.timestamp).toLocaleString()}
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <div className="text-sm text-red-800 font-medium">
              Xatolik:
            </div>
            <div className="text-xs text-red-600 mt-1">
              {error}
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Button 
            onClick={testConnection} 
            disabled={isLoading}
            className="w-full"
            variant={isConnected ? "outline" : "default"}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            {isLoading ? "Tekshirilmoqda..." : "Qayta tekshirish"}
          </Button>

          {!isConnected && !isLoading && (
            <div className="text-xs text-muted-foreground bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              <strong>Backend ishga tushirish:</strong>
              <br />
              1. <code className="bg-gray-100 px-1 rounded">pip install -r requirements.txt</code>
              <br />
              2. <code className="bg-gray-100 px-1 rounded">python main.py</code>
              <br />
              3. API: <code className="bg-gray-100 px-1 rounded">http://localhost:8000</code>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}