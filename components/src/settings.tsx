
"use client"

import React from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Activity, Bell, Building, Cloud, Edit, Eye, FileText, Shield, Target, Timer, Users, X, Settings as SettingsIcon } from "lucide-react"

interface SettingsProps {
  onLogout?: () => void
}

export default function Settings({ onLogout }: SettingsProps) {
  return (
    <div className="space-y-6">
      {/* Settings Header */}
      <div className="text-center space-y-4">
        <h2 className="text-2xl font-bold">Tizim Sozlamalari</h2>
        <p className="text-muted-foreground">IELTS platformasi va profil sozlamalarini boshqaring</p>

        <Card className="max-w-md mx-auto rounded-3xl border-2">
          <CardContent className="p-8 text-center space-y-4">
            <Avatar className="mx-auto h-24 w-24 border-4 border-primary/20">
              <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Admin" />
              <AvatarFallback className="text-xl">TA</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-lg">Test Administrator</h3>
              <p className="text-sm text-muted-foreground">IELTS Pro Platform</p>
              <p className="text-sm text-muted-foreground">admin@ieltspro.uz</p>
            </div>
            <div className="space-y-3 pt-4">
              <Button variant="outline" className="w-full rounded-2xl">
                <Edit className="mr-2 h-4 w-4" />
                Profilni Tahrirlash
              </Button>
              <Button variant="outline" className="w-full rounded-2xl">
                <Shield className="mr-2 h-4 w-4" />
                Xavfsizlik
              </Button>
              <Button variant="outline" className="w-full rounded-2xl">
                <SettingsIcon className="mr-2 h-4 w-4" />
                Test Sozlamalari
              </Button>
              <Button
                variant="outline"
                className="w-full rounded-2xl text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={onLogout}
              >
                <X className="mr-2 h-4 w-4" />
                Chiqish
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Platform Settings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="rounded-3xl border-2">
          <CardHeader>
            <CardTitle className="text-xl">Test Sozlamalari</CardTitle>
            <CardDescription>IELTS test parametrlarini sozlang</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Test Davomiyligi</p>
              <Button variant="secondary" className="w-full rounded-2xl">
                <Timer className="mr-2 h-4 w-4" />
                Vaqt Sozlamalari
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Baholash Mezoni</p>
              <Button variant="secondary" className="w-full rounded-2xl">
                <Target className="mr-2 h-4 w-4" />
                Band Score Sozlash
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Test Markazlari</p>
              <Button variant="secondary" className="w-full rounded-2xl">
                <Building className="mr-2 h-4 w-4" />
                Markazlarni Boshqarish
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-3xl border-2">
          <CardHeader>
            <CardTitle className="text-xl">Tizim Sozlamalari</CardTitle>
            <CardDescription>Umumiy platforma sozlamalarini boshqaring</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Bildirishnoma Sozlamalari</p>
              <Button variant="secondary" className="w-full rounded-2xl">
                <Bell className="mr-2 h-4 w-4" />
                Bildirishnomalar
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Ma'lumotlar Zahirasi</p>
              <Button variant="secondary" className="w-full rounded-2xl">
                <Cloud className="mr-2 h-4 w-4" />
                Backup Yaratish
              </Button>
            </div>
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">Proctoring Sozlamalari</p>
              <Button variant="secondary" className="w-full rounded-2xl">
                <Eye className="mr-2 h-4 w-4" />
                AI Proctor Sozlash
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* System Information */}
      <Card className="rounded-3xl border-2">
        <CardHeader>
          <CardTitle className="text-xl">Tizim Ma'lumotlari</CardTitle>
          <CardDescription>Platform holati va statistika</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <Activity className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-green-600">99.9%</h3>
              <p className="text-sm text-muted-foreground">Uptime</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-blue-600">1,247</h3>
              <p className="text-sm text-muted-foreground">Jami Foydalanuvchilar</p>
            </div>
            <div className="text-center space-y-2">
              <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <FileText className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-purple-600">3,247</h3>
              <p className="text-sm text-muted-foreground">Tugallangan Testlar</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
