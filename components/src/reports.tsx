
"use client"

import React from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Building, Clock, Download as DownloadIcon, Eye, Target, TrendingUp, TrendingDown, Users, BarChart3 } from "lucide-react"
import { cn } from "@/lib/utils"

export default function Reports() {
  return (
    <div className="space-y-6">
      {/* Reports Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold">Test Natijalari</h2>
          <p className="text-muted-foreground">IELTS test natijalari va statistik ma'lumotlar</p>
        </div>
        <Button className="rounded-2xl">
          <DownloadIcon className="mr-2 h-4 w-4" />
          Hisobot Eksport
        </Button>
      </div>

      {/* Report Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[
          { title: "Band Score Tahlili", desc: "Barcha band scorlar statistikasi", icon: <Target className="h-6 w-6" />, color: "bg-blue-500" },
          { title: "Test Samaradorligi", desc: "Tugallash va muvaffaqiyat ko'rsatkichi", icon: <TrendingUp className="h-6 w-6" />, color: "bg-green-500" },
          { title: "Sectionlar Tahlili", desc: "L/R/W/S bo'yicha batafsil", icon: <BarChart3 className="h-6 w-6" />, color: "bg-purple-500" },
          { title: "Imtihonchilar Hisoboti", desc: "Davomad va rivojlanish", icon: <Users className="h-6 w-6" />, color: "bg-orange-500" },
          { title: "Test Markazlari", desc: "Markazlar bo'yicha statistika", icon: <Building className="h-6 w-6" />, color: "bg-emerald-500" },
          { title: "Vaqt Tahlili", desc: "Test davomiyligi va samaradorlik", icon: <Clock className="h-6 w-6" />, color: "bg-pink-500" },
        ].map((report, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
              <CardContent className="p-6">
                <div className="flex items-center gap-4 mb-4">
                  <div className={cn("p-3 rounded-2xl text-white", report.color)}>
                    {report.icon}
                  </div>
                  <div>
                    <h3 className="font-semibold">{report.title}</h3>
                    <p className="text-sm text-muted-foreground">{report.desc}</p>
                  </div>
                </div>
                <Button variant="secondary" className="w-full rounded-2xl">
                  <Eye className="mr-2 h-4 w-4" />
                  Hisobotni Ko'rish
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { title: "O'rtacha Overall Band", value: "6.5", change: "+0.3", trend: "up" },
          { title: "Eng Ko'p Ball", value: "8.5", change: "Academic", trend: "up" },
          { title: "Tugallash Foizi", value: "94%", change: "+2%", trend: "up" },
          { title: "Qayta Test Foizi", value: "23%", change: "-5%", trend: "down" },
        ].map((stat, index) => (
          <Card key={index} className="rounded-3xl border-2">
            <CardContent className="p-6 text-center">
              <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
              <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
              <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="rounded-xl text-xs">
                {stat.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
                {stat.change}
              </Badge>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
