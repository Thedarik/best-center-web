"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  BarChart3,
  LineChart,
  PieChart,
  TrendingUp,
  TrendingDown,
  Users,
  BookOpen,
  Clock,
  Target,
  Award,
  Activity,
  Calendar,
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface AnalyticsData {
  overview: {
    totalTests: number
    totalStudents: number
    averageScore: number
    completionRate: number
  }
  trends: Array<{
    date: string
    testsTaken: number
    averageScore: number
    newStudents: number
  }>
  testPerformance: Array<{
    testType: string
    averageScore: number
    totalAttempts: number
    passRate: number
  }>
  studentProgress: Array<{
    studentId: string
    name: string
    testsCompleted: number
    averageScore: number
    lastActivity: string
    progress: number
  }>
}

export function AdvancedAnalytics() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    overview: {
      totalTests: 0,
      totalStudents: 0,
      averageScore: 0,
      completionRate: 0
    },
    trends: [],
    testPerformance: [],
    studentProgress: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Simulate data loading
    const loadData = async () => {
      setLoading(true)
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      setAnalyticsData({
        overview: {
          totalTests: 156,
          totalStudents: 1247,
          averageScore: 7.2,
          completionRate: 89.5
        },
        trends: [
          { date: '2024-01', testsTaken: 45, averageScore: 6.8, newStudents: 23 },
          { date: '2024-02', testsTaken: 52, averageScore: 7.1, newStudents: 31 },
          { date: '2024-03', testsTaken: 48, averageScore: 7.3, newStudents: 28 },
          { date: '2024-04', testsTaken: 61, averageScore: 7.5, newStudents: 35 },
          { date: '2024-05', testsTaken: 58, averageScore: 7.2, newStudents: 42 },
          { date: '2024-06', testsTaken: 67, averageScore: 7.4, newStudents: 38 }
        ],
        testPerformance: [
          { testType: 'Listening', averageScore: 7.1, totalAttempts: 456, passRate: 78.5 },
          { testType: 'Reading', averageScore: 6.9, totalAttempts: 423, passRate: 72.3 },
          { testType: 'Writing', averageScore: 6.7, totalAttempts: 389, passRate: 65.8 },
          { testType: 'Speaking', averageScore: 7.3, totalAttempts: 312, passRate: 81.2 }
        ],
        studentProgress: [
          { studentId: 'ST001', name: 'Aziza Karimova', testsCompleted: 8, averageScore: 7.8, lastActivity: '2024-06-15', progress: 85 },
          { studentId: 'ST002', name: 'Dilshod Rahimov', testsCompleted: 6, averageScore: 6.9, lastActivity: '2024-06-14', progress: 72 },
          { studentId: 'ST003', name: 'Malika Yusupova', testsCompleted: 10, averageScore: 8.1, lastActivity: '2024-06-16', progress: 95 },
          { studentId: 'ST004', name: 'Jasur Toshmatov', testsCompleted: 4, averageScore: 6.2, lastActivity: '2024-06-12', progress: 45 },
          { studentId: 'ST005', name: 'Nilufar Khamidova', testsCompleted: 7, averageScore: 7.5, lastActivity: '2024-06-13', progress: 78 }
        ]
      })
      
      setLoading(false)
    }

    loadData()
  }, [])

  const getTrendIcon = (current: number, previous: number) => {
    if (current > previous) {
      return <TrendingUp className="h-4 w-4 text-green-500" />
    } else if (current < previous) {
      return <TrendingDown className="h-4 w-4 text-red-500" />
    }
    return <Activity className="h-4 w-4 text-gray-500" />
  }

  const getScoreColor = (score: number) => {
    if (score >= 7.5) return 'text-green-600'
    if (score >= 6.5) return 'text-yellow-600'
    return 'text-red-600'
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Tests</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalTests}</div>
              <p className="text-xs text-muted-foreground">
                +12% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Students</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.totalStudents}</div>
              <p className="text-xs text-muted-foreground">
                +8% from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Average Score</CardTitle>
              <Target className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${getScoreColor(analyticsData.overview.averageScore)}`}>
                {analyticsData.overview.averageScore}
              </div>
              <p className="text-xs text-muted-foreground">
                +0.3 from last month
              </p>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Completion Rate</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{analyticsData.overview.completionRate}%</div>
              <Progress value={analyticsData.overview.completionRate} className="mt-2" />
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Detailed Analytics */}
      <Tabs defaultValue="trends" className="space-y-4">
        <TabsList>
          <TabsTrigger value="trends">Trends</TabsTrigger>
          <TabsTrigger value="performance">Test Performance</TabsTrigger>
          <TabsTrigger value="students">Student Progress</TabsTrigger>
        </TabsList>

        <TabsContent value="trends" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Monthly Trends</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.trends.map((trend, index) => (
                  <motion.div
                    key={trend.date}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <Calendar className="h-5 w-5 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{trend.date}</p>
                        <p className="text-sm text-muted-foreground">
                          {trend.testsTaken} tests taken
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="font-medium">{trend.averageScore}</p>
                        <p className="text-sm text-muted-foreground">Avg Score</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">+{trend.newStudents}</p>
                        <p className="text-sm text-muted-foreground">New Students</p>
                      </div>
                      {getTrendIcon(trend.testsTaken, index > 0 ? analyticsData.trends[index - 1].testsTaken : 0)}
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Test Performance by Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.testPerformance.map((performance, index) => (
                  <motion.div
                    key={performance.testType}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-2 rounded-full ${
                        performance.testType === 'Listening' ? 'bg-blue-100' :
                        performance.testType === 'Reading' ? 'bg-green-100' :
                        performance.testType === 'Writing' ? 'bg-yellow-100' : 'bg-purple-100'
                      }`}>
                        <BookOpen className={`h-4 w-4 ${
                          performance.testType === 'Listening' ? 'text-blue-600' :
                          performance.testType === 'Reading' ? 'text-green-600' :
                          performance.testType === 'Writing' ? 'text-yellow-600' : 'text-purple-600'
                        }`} />
                      </div>
                      <div>
                        <p className="font-medium">{performance.testType}</p>
                        <p className="text-sm text-muted-foreground">
                          {performance.totalAttempts} attempts
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-medium ${getScoreColor(performance.averageScore)}`}>
                          {performance.averageScore}
                        </p>
                        <p className="text-sm text-muted-foreground">Avg Score</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">{performance.passRate}%</p>
                        <p className="text-sm text-muted-foreground">Pass Rate</p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Top Student Progress</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.studentProgress.map((student, index) => (
                  <motion.div
                    key={student.studentId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 border rounded-lg"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-medium">
                          {student.name.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{student.name}</p>
                        <p className="text-sm text-muted-foreground">
                          {student.testsCompleted} tests completed
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className={`font-medium ${getScoreColor(student.averageScore)}`}>
                          {student.averageScore}
                        </p>
                        <p className="text-sm text-muted-foreground">Avg Score</p>
                      </div>
                      <div className="w-24">
                        <Progress value={student.progress} className="h-2" />
                        <p className="text-xs text-muted-foreground mt-1">
                          {student.progress}% complete
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
} 