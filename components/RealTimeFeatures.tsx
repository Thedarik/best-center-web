"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, Users, Activity, Clock, Wifi, WifiOff } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

interface RealTimeData {
  onlineUsers: number
  activeTests: number
  recentActivity: Array<{
    id: string
    type: 'test_started' | 'test_completed' | 'user_login' | 'test_created'
    message: string
    timestamp: string
    user?: string
  }>
  systemStatus: 'online' | 'offline' | 'maintenance'
}

export function RealTimeFeatures() {
  const [realTimeData, setRealTimeData] = useState<RealTimeData>({
    onlineUsers: 0,
    activeTests: 0,
    recentActivity: [],
    systemStatus: 'online'
  })
  const [isConnected, setIsConnected] = useState(true)

  // Simulate real-time data updates
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeData(prev => ({
        ...prev,
        onlineUsers: Math.floor(Math.random() * 50) + 10,
        activeTests: Math.floor(Math.random() * 20) + 5,
        recentActivity: [
          {
            id: Date.now().toString(),
            type: 'test_started',
            message: 'Yangi test boshlandi',
            timestamp: new Date().toISOString(),
            user: 'Student_' + Math.floor(Math.random() * 1000)
          },
          ...prev.recentActivity.slice(0, 4)
        ]
      }))
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'test_started':
        return <Activity className="h-4 w-4 text-blue-500" />
      case 'test_completed':
        return <Clock className="h-4 w-4 text-green-500" />
      case 'user_login':
        return <Users className="h-4 w-4 text-purple-500" />
      case 'test_created':
        return <Bell className="h-4 w-4 text-orange-500" />
      default:
        return <Activity className="h-4 w-4" />
    }
  }

  const getActivityColor = (type: string) => {
    switch (type) {
      case 'test_started':
        return 'bg-blue-50 text-blue-700 border-blue-200'
      case 'test_completed':
        return 'bg-green-50 text-green-700 border-green-200'
      case 'user_login':
        return 'bg-purple-50 text-purple-700 border-purple-200'
      case 'test_created':
        return 'bg-orange-50 text-orange-700 border-orange-200'
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200'
    }
  }

  return (
    <div className="space-y-6">
      {/* Real-time Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isConnected ? (
              <Wifi className="h-5 w-5 text-green-500" />
            ) : (
              <WifiOff className="h-5 w-5 text-red-500" />
            )}
            Real-time Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
              <div>
                <p className="text-sm text-blue-600">Online Users</p>
                <p className="text-2xl font-bold text-blue-800">{realTimeData.onlineUsers}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
              <div>
                <p className="text-sm text-green-600">Active Tests</p>
                <p className="text-2xl font-bold text-green-800">{realTimeData.activeTests}</p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-purple-50 rounded-lg">
              <div>
                <p className="text-sm text-purple-600">System Status</p>
                <p className="text-2xl font-bold text-purple-800 capitalize">{realTimeData.systemStatus}</p>
              </div>
              <div className={`h-3 w-3 rounded-full ${
                realTimeData.systemStatus === 'online' ? 'bg-green-500' : 
                realTimeData.systemStatus === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
              }`} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Recent Activity
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <AnimatePresence>
              {realTimeData.recentActivity.map((activity, index) => (
                <motion.div
                  key={activity.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  className={`flex items-center gap-3 p-3 rounded-lg border ${getActivityColor(activity.type)}`}
                >
                  {getActivityIcon(activity.type)}
                  <div className="flex-1">
                    <p className="text-sm font-medium">{activity.message}</p>
                    {activity.user && (
                      <p className="text-xs opacity-75">by {activity.user}</p>
                    )}
                  </div>
                  <Badge variant="secondary" className="text-xs">
                    {new Date(activity.timestamp).toLocaleTimeString()}
                  </Badge>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </CardContent>
      </Card>

      {/* Connection Status */}
      <Card>
        <CardHeader>
          <CardTitle>Connection Status</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Wifi className="h-5 w-5 text-green-500" />
              ) : (
                <WifiOff className="h-5 w-5 text-red-500" />
              )}
              <span className={isConnected ? 'text-green-600' : 'text-red-600'}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsConnected(!isConnected)}
            >
              {isConnected ? 'Disconnect' : 'Connect'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 