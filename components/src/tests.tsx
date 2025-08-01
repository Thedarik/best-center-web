
"use client"

import React from "react"
import { motion } from "framer-motion"
import { BookOpen, Edit, Eye, FileText, Filter, Headphones, Mic, PenTool, Plus } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

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

const getStatusBadge = (status: string): React.ReactNode => {
  const statusMap = {
    scheduled: "Rejalashtirilgan",
    in_progress: "Davom etmoqda",
    completed: "Tugallangan",
    cancelled: "Bekor qilingan",
  }

  const colorMap = {
    scheduled: "default",
    in_progress: "secondary",
    completed: "default",
    cancelled: "destructive",
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

export default function Tests() {
  return (
    <div className="space-y-6">
      {/* Tests Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">IELTS Testlari</h2>
          <p className="text-muted-foreground">Barcha IELTS testlarini boshqaring va nazorat qiling</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-2xl">
            <Filter className="mr-2 h-4 w-4" />
            Filtr
          </Button>
          <Button className="rounded-2xl">
            <Plus className="mr-2 h-4 w-4" />
            Yangi Test Rejalashtirish
          </Button>
        </div>
      </div>

      {/* Test Type Tabs */}
      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-4 rounded-2xl">
          <TabsTrigger value="all" className="rounded-xl">Barchasi</TabsTrigger>
          <TabsTrigger value="academic" className="rounded-xl">Academic</TabsTrigger>
          <TabsTrigger value="general" className="rounded-xl">General Training</TabsTrigger>
          <TabsTrigger value="scheduled" className="rounded-xl">Rejalashtirilgan</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {ieltsTests.map((test, index) => (
              <motion.div
                key={test.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-3">
                        <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                          <FileText className="h-8 w-8 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">{test.type}</CardTitle>
                          {getStatusBadge(test.status)}
                        </div>
                      </div>
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Test Center</span>
                        <span className="font-medium">{test.testCenter}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Sana</span>
                        <span className="font-medium">{test.date}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Vaqt</span>
                        <span className="font-medium">{test.time}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Davomiyligi</span>
                        <span className="font-medium">{test.duration}</span>
                      </div>
                    </div>

                    {test.overallBand && (
                      <div className="pt-4 border-t">
                        <div className="text-center mb-3">
                          <p className={cn("text-3xl font-bold", getBandScoreColor(test.overallBand))}>
                            {test.overallBand}
                          </p>
                          <p className="text-sm text-muted-foreground">Overall Band Score</p>
                        </div>

                        <div className="grid grid-cols-4 gap-4 text-center">
                          <div className="space-y-1">
                            <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
                              <Headphones className="h-4 w-4 mx-auto text-blue-600" />
                            </div>
                            <p className={cn("text-sm font-bold", getBandScoreColor(test.sections.listening))}>
                              {test.sections.listening || "-"}
                            </p>
                            <p className="text-xs text-muted-foreground">Listening</p>
                          </div>
                          <div className="space-y-1">
                            <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
                              <BookOpen className="h-4 w-4 mx-auto text-green-600" />
                            </div>
                            <p className={cn("text-sm font-bold", getBandScoreColor(test.sections.reading))}>
                              {test.sections.reading || "-"}
                            </p>
                            <p className="text-xs text-muted-foreground">Reading</p>
                          </div>
                          <div className="space-y-1">
                            <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
                              <PenTool className="h-4 w-4 mx-auto text-purple-600" />
                            </div>
                            <p className={cn("text-sm font-bold", getBandScoreColor(test.sections.writing))}>
                              {test.sections.writing || "-"}
                            </p>
                            <p className="text-xs text-muted-foreground">Writing</p>
                          </div>
                          <div className="space-y-1">
                            <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
                              <Mic className="h-4 w-4 mx-auto text-orange-600" />
                            </div>
                            <p className={cn("text-sm font-bold", getBandScoreColor(test.sections.speaking))}>
                              {test.sections.speaking || "-"}
                            </p>
                            <p className="text-xs text-muted-foreground">Speaking</p>
                          </div>
                        </div>
                      </div>
                    )}
                  </CardContent>

                  <CardFooter className="flex gap-2">
                    <Button variant="secondary" className="flex-1 rounded-2xl">
                      <Eye className="mr-2 h-4 w-4" />
                      Batafsil
                    </Button>
                    <Button variant="outline" className="flex-1 rounded-2xl">
                      <Edit className="mr-2 h-4 w-4" />
                      Tahrirlash
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
