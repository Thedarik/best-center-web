"use client"

import React from "react"
import { motion } from "framer-motion"
import {
  Activity,
  CheckSquare,
  Eye,
  FileText,
  Languages,
  MoreHorizontal,
  PlayCircle,
  Plus,
  Target,
  TrendingUp,
  Users,
} from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

interface IELTSAnalytics {
  name: string
  value: number | string
  change: number | string
  trend: "up" | "down"
  icon: React.ReactNode
  description: string
  target: number
  percentage: number
}

interface IELTSTest {
  id: number
  type: "Academic" | "General Training"
  status: "scheduled" | "in_progress" | "completed" | "cancelled"
  date: string
  time: string
  duration: string
  testCenter: string
  sections: {
    listening: number | null
    reading: number | null
    writing: number | null
    speaking: number | null
  }
  overallBand: number | null
  registrationDate: string
  examiner: string
  category: string
}

interface Activity {
  id: number
  type: "test_started" | "test_completed" | "registration" | "score_released"
  message: string
  time: string
  icon: React.ReactNode
  color: string
}

const ieltsAnalytics: IELTSAnalytics[] = [
  {
    name: "Jami Imtihonchilar",
    value: 1247,
    change: 15,
    trend: "up",
    icon: <Users className="h-4 w-4" />,
    description: "Ushbu oyda ro'yxatdan o'tgan",
    target: 1500,
    percentage: 83,
  },
  {
    name: "Faol Sessiyalar",
    value: 89,
    change: 12,
    trend: "up",
    icon: <PlayCircle className="h-4 w-4" />,
    description: "Hozirda davom etayotgan",
    target: 100,
    percentage: 89,
  },
  {
    name: "O'rtacha Band",
    value: "6.5",
    change: "+0.3",
    trend: "up",
    icon: <Target className="h-4 w-4" />,
    description: "Oxirgi 3 oyda",
    target: 7,
    percentage: 93,
  },
  {
    name: "Tugallangan Testlar",
    value: 3247,
    change: 198,
    trend: "up",
    icon: <CheckSquare className="h-4 w-4" />,
    description: "Ushbu oyda",
    target: 4000,
    percentage: 81,
  },
]

const ieltsTests: IELTSTest[] = [
  {
    id: 1,
    type: "Academic",
    status: "completed",
    date: "2024-06-15",
    time: "09:00",
    duration: "2h 45m",
    testCenter: "Tashkent Test Center",
    sections: {
      listening: 7.5,
      reading: 8.0,
      writing: 6.5,
      speaking: 7.0,
    },
    overallBand: 7.0,
    registrationDate: "2024-05-15",
    examiner: "John Smith",
    category: "Academic",
  },
  {
    id: 2,
    type: "General Training",
    status: "scheduled",
    date: "2024-06-25",
    time: "14:00",
    duration: "2h 45m",
    testCenter: "Samarkand Test Center",
    sections: {
      listening: null,
      reading: null,
      writing: null,
      speaking: null,
    },
    overallBand: null,
    registrationDate: "2024-06-01",
    examiner: "Sarah Johnson",
    category: "General Training",
  },
  {
    id: 3,
    type: "Academic",
    status: "in_progress",
    date: "2024-06-18",
    time: "10:30",
    duration: "2h 45m",
    testCenter: "Bukhara Test Center",
    sections: {
      listening: 6.5,
      reading: 7.0,
      writing: null,
      speaking: null,
    },
    overallBand: null,
    registrationDate: "2024-05-20",
    examiner: "Mike Davis",
    category: "Academic",
  },
]

const recentActivities: Activity[] = [
  {
    id: 1,
    type: "test_started",
    message: "Abdullayev Jasur IELTS Academic testini boshladi",
    time: "1 soat oldin",
    icon: <PlayCircle className="h-4 w-4" />,
    color: "text-blue-600",
  },
  {
    id: 2,
    type: "test_completed",
    message: "Karimova Malika testni muvaffaqyatli yakunladi (Band 7.5)",
    time: "3 soat oldin",
    icon: <CheckSquare className="h-4 w-4" />,
    color: "text-green-600",
  },
  {
    id: 3,
    type: "registration",
    message: "15 ta yangi o'quvchi ro'yxatdan o'tdi",
    time: "5 soat oldin",
    icon: <Users className="h-4 w-4" />,
    color: "text-purple-600",
  },
  {
    id: 4,
    type: "score_released",
    message: "25 ta test natijasi e'lon qilindi",
    time: "1 kun oldin",
    icon: <CheckSquare className="h-4 w-4" />,
    color: "text-emerald-600",
  },
]

const getStatusBadge = (status: string): React.ReactNode => {
  const statusMap = {
    scheduled: "Rejalashtirilgan",
    in_progress: "Davom etmoqda",
    completed: "Tugallangan",
    cancelled: "Bekor qilingan",
    active: "Faol",
    inactive: "Nofaol",
    banned: "Bloklangan",
    paused: "Pauza",
  }

  const colorMap = {
    scheduled: "default",
    in_progress: "secondary",
    completed: "default",
    cancelled: "destructive",
    active: "default",
    inactive: "secondary",
    banned: "destructive",
    paused: "secondary",
  }

  return (
    <Badge
      variant={colorMap[status as keyof typeof colorMap] as any}
      className="rounded-xl text-xs"
    >
      {statusMap[status as keyof typeof statusMap] || status}
    </Badge>
  )
}

const getBandScoreColor = (score: number | null): string => {
  if (!score) return "text-gray-500"
  if (score >= 8) return "text-green-600"
  if (score >= 6.5) return "text-blue-600"
  if (score >= 5.5) return "text-yellow-600"
  return "text-red-600"
}

export default function Dashboard() {
  return (
    <>
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-8 text-white relative"
      >
        <div className="relative z-10">
          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">
                  <Languages className="h-3 w-3 mr-1" />
                  IELTS Pro
                </Badge>
                <Badge className="bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 rounded-xl">
                  <Activity className="h-3 w-3 mr-1" />
                  89 Faol Sessiya
                </Badge>
              </div>
              <h2 className="text-3xl font-bold">IELTS Administrator Dashboard! 📝</h2>
              <p className="max-w-[600px] text-white/80">
                Bugun 89 ta test sessiyasi davom etmoqda va 15 ta yangi imtihonchi ro'yxatdan o'tdi. Barcha testlar muvaffaqiyatli olib borilmoqda.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button className="rounded-2xl bg-white text-purple-700 hover:bg-white/90">
                  <Plus className="mr-2 h-4 w-4" />
                  Yangi Test Rejalashtirish
                </Button>
                <Button variant="outline" className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Faol Sessiyalar
                </Button>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Analytics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {ieltsAnalytics.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="p-2 rounded-xl bg-primary/10">{item.icon}</div>
                  <Badge variant={item.trend === "up" ? "default" : "secondary"} className="rounded-xl">
                    <TrendingUp className="h-3 w-3 mr-1" />
                    {item.change}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <p className="text-2xl font-bold">{item.value}</p>
                  <p className="text-sm text-muted-foreground">{item.name}</p>
                  <p className="text-xs text-muted-foreground">{item.description}</p>
                  <Progress value={item.percentage} className="h-2" />
                  <p className="text-xs text-muted-foreground">
                    {item.percentage}% dan {item.target} maqsad
                  </p>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <Card className="rounded-3xl border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Oxirgi Faoliyatlar</CardTitle>
                  <CardDescription>Eng so'nggi test natijalari va faoliyatlar</CardDescription>
                </div>
                <Button variant="outline" className="rounded-2xl">
                  <Eye className="mr-2 h-4 w-4" />
                  Barchasini Ko'rish
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentActivities.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20"
                  >
                    <div className={cn("p-2 rounded-xl bg-muted", activity.color)}>
                      {activity.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm">{activity.message}</p>
                      <p className="text-xs text-muted-foreground">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Live Test Statistics */}
        <div>
          <Card className="rounded-3xl border-2">
            <CardHeader>
              <CardTitle className="text-xl">Jonli Test Statistikasi</CardTitle>
              <CardDescription>Hozirgi sessiyalar</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Listening davom etmoqda</span>
                  <span className="font-semibold">23</span>
                </div>
                <Progress value={26} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Reading sessiyalar</span>
                  <span className="font-semibold">31</span>
                </div>
                <Progress value={35} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Writing jarayonida</span>
                  <span className="font-semibold">18</span>
                </div>
                <Progress value={20} className="h-2" />
              </div>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Speaking sessiyalar</span>
                  <span className="font-semibold">17</span>
                </div>
                <Progress value={19} className="h-2" />
              </div>
              <div className="pt-4 border-t">
                <Button variant="secondary" className="w-full rounded-2xl">
                  <PlayCircle className="mr-2 h-4 w-4" />
                  Faol Sessiyalarni Ko'rish
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Recent IELTS Tests */}
      <Card className="rounded-3xl border-2">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Oxirgi IELTS Testlari</CardTitle>
              <CardDescription>Eng so'nggi o'tkazilgan va rejalashtirilgan testlar</CardDescription>
            </div>
            <Button variant="outline" className="rounded-2xl">
              <FileText className="mr-2 h-4 w-4" />
              Barcha Testlar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ieltsTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
                whileHover={{ scale: 1.02, y: -5 }}
              >
                <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                  <CardHeader className="pb-3">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <CardTitle className="text-base leading-tight">{test.type}</CardTitle>
                        {getStatusBadge(test.status)}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="pb-3 space-y-3">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Test Center:</span>
                        <span className="font-medium text-xs">{test.testCenter}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sana va Vaqt:</span>
                        <span className="font-medium text-xs">{test.date} - {test.time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Examiner:</span>
                        <span className="font-medium text-xs">{test.examiner}</span>
                      </div>
                    </div>
                    {test.overallBand && (
                      <div className="pt-2 border-t">
                        <div className="text-center">
                          <p className={cn("text-2xl font-bold", getBandScoreColor(test.overallBand))}>
                            {test.overallBand}
                          </p>
                          <p className="text-xs text-muted-foreground">Overall Band</p>
                        </div>
                      </div>
                    )}
                    {test.sections.listening && (
                      <div className="grid grid-cols-4 gap-2 text-xs">
                        <div className="text-center">
                          <p className={cn("font-bold", getBandScoreColor(test.sections.listening))}>
                            {test.sections.listening || "-"}
                          </p>
                          <p className="text-muted-foreground">L</p>
                        </div>
                        <div className="text-center">
                          <p className={cn("font-bold", getBandScoreColor(test.sections.reading))}>
                            {test.sections.reading || "-"}
                          </p>
                          <p className="text-muted-foreground">R</p>
                        </div>
                        <div className="text-center">
                          <p className={cn("font-bold", getBandScoreColor(test.sections.writing))}>
                            {test.sections.writing || "-"}
                          </p>
                          <p className="text-muted-foreground">W</p>
                        </div>
                        <div className="text-center">
                          <p className={cn("font-bold", getBandScoreColor(test.sections.speaking))}>
                            {test.sections.speaking || "-"}
                          </p>
                          <p className="text-muted-foreground">S</p>
                        </div>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="flex gap-2 pt-3">
                    <Button variant="secondary" className="flex-1 rounded-2xl text-xs">
                      <Eye className="mr-1 h-3 w-3" />
                      Batafsil
                    </Button>
                    <Button variant="outline" size="icon" className="rounded-2xl">
                      <MoreHorizontal className="h-3 w-3" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  )
}