
"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Download as DownloadIcon, Eye, Filter, Mail, MoreHorizontal, UserPlus, Flag } from "lucide-react"
import { cn } from "@/lib/utils"

interface Student {
  id: number
  name: string
  email: string
  phone: string
  targetBand: number
  currentLevel: string
  testsCompleted: number
  bestScore: number
  registrationDate: string
  lastActivity: string
  status: "active" | "inactive" | "banned"
  avatar: string
  country: string
  purpose: "Study" | "Immigration" | "Work" | "Other"
}

const students: Student[] = [
  {
    id: 1,
    name: "Abdullayev Jasur",
    email: "jasur@gmail.com",
    phone: "+998 90 123 45 67",
    targetBand: 7.0,
    currentLevel: "Intermediate",
    testsCompleted: 3,
    bestScore: 6.5,
    registrationDate: "2024-01-15",
    lastActivity: "2 soat oldin",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "Uzbekistan",
    purpose: "Study",
  },
  {
    id: 2,
    name: "Karimova Malika",
    email: "malika@gmail.com",
    phone: "+998 91 234 56 78",
    targetBand: 8.0,
    currentLevel: "Upper-Intermediate",
    testsCompleted: 5,
    bestScore: 7.5,
    registrationDate: "2024-02-01",
    lastActivity: "1 kun oldin",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "Uzbekistan",
    purpose: "Immigration",
  },
  {
    id: 3,
    name: "Smith John",
    email: "john@gmail.com",
    phone: "+1 555 123 4567",
    targetBand: 6.5,
    currentLevel: "Pre-Intermediate",
    testsCompleted: 2,
    bestScore: 5.5,
    registrationDate: "2024-03-10",
    lastActivity: "3 soat oldin",
    status: "active",
    avatar: "/placeholder.svg?height=40&width=40",
    country: "USA",
    purpose: "Work",
  },
]

const getStatusBadge = (status: string): React.ReactNode => {
  const statusMap = {
    active: "Faol",
    inactive: "Nofaol",
    banned: "Bloklangan",
  }

  const colorMap = {
    active: "default",
    inactive: "secondary",
    banned: "destructive",
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

const formatInitials = (name: string): string => {
  return name.split(" ").map((n) => n[0]).join("")
}

export default function Students() {
  return (
    <div className="space-y-6">
      {/* Students Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Imtihonchilar</h2>
          <p className="text-muted-foreground">Barcha IELTS imtihonchilari ro'yxati va ularning natijalari</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="rounded-2xl">
            <Filter className="mr-2 h-4 w-4" />
            Filtr
          </Button>
          <Button variant="outline" className="rounded-2xl">
            <DownloadIcon className="mr-2 h-4 w-4" />
            Export
          </Button>
          <Button className="rounded-2xl">
            <UserPlus className="mr-2 h-4 w-4" />
            Yangi Ro'yxat
          </Button>
        </div>
      </div>

      {/* Students Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {students.map((student, index) => (
          <motion.div
            key={student.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-12 w-12 border-2 border-primary/20">
                    <AvatarImage src={student.avatar} alt={student.name} />
                    <AvatarFallback>{formatInitials(student.name)}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-base leading-tight truncate">{student.name}</CardTitle>
                    <div className="flex items-center gap-2">
                      <Flag className="h-3 w-3" />
                      <span className="text-xs text-muted-foreground">{student.country}</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  {getStatusBadge(student.status)}
                  <Badge variant="outline" className="rounded-xl text-xs">
                    {student.purpose}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="space-y-3">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Maqsad Band</p>
                    <p className={cn("font-bold text-lg", getBandScoreColor(student.targetBand))}>
                      {student.targetBand}
                    </p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Eng Yaxshi</p>
                    <p className={cn("font-bold text-lg", getBandScoreColor(student.bestScore))}>
                      {student.bestScore}
                    </p>
                  </div>
                </div>

                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Hozirgi Daraja</p>
                  <p className="font-medium text-sm">{student.currentLevel}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Testlar</p>
                    <p className="font-semibold">{student.testsCompleted}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Oxirgi faollik</p>
                    <p className="font-medium text-xs">{student.lastActivity}</p>
                  </div>
                </div>
              </CardContent>

              <CardFooter className="flex gap-2 pt-3">
                <Button variant="secondary" className="flex-1 rounded-2xl text-xs">
                  <Eye className="mr-1 h-3 w-3" />
                  Profil
                </Button>
                <Button variant="outline" size="icon" className="rounded-2xl">
                  <Mail className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="icon" className="rounded-2xl">
                  <MoreHorizontal className="h-3 w-3" />
                </Button>
              </CardFooter>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
