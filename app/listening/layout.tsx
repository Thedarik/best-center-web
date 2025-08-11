"use client"

import { useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowLeft, 
  Headphones, 
  Plus,
  List,
  Settings,
  BarChart3,
  Users,
  BookOpen,
  FileText,
  Mic
} from "lucide-react"

export default function ListeningLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  
  const handleBackToDashboard = () => {
    router.push("/")
  }

  const handleCreateTest = () => {
    router.push("/listening/create-test")
  }

  const handleBackToList = () => {
    router.push("/listening")
  }

  const menuItems = [
    {
      title: "Testlar Ro'yxati",
      path: "/listening",
      icon: List,
      active: pathname === "/listening"
    },
    {
      title: "Yangi Test",
      path: "/listening/create-test",
      icon: Plus,
      active: pathname === "/listening/create-test"
    },
    {
      title: "Statistika",
      path: "/listening/stats",
      icon: BarChart3,
      active: pathname === "/listening/stats"
    },
    {
      title: "Foydalanuvchilar",
      path: "/listening/users",
      icon: Users,
      active: pathname === "/listening/users"
    },
    {
      title: "Sozlamalar",
      path: "/listening/settings",
      icon: Settings,
      active: pathname === "/listening/settings"
    }
  ]

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center gap-3 mb-4">
            <Button variant="outline" size="sm" onClick={handleBackToDashboard}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              <Headphones className="h-3 w-3 mr-1" />
              Listening
            </Badge>
          </div>
          <h1 className="text-xl font-bold text-gray-900">IELTS Listening</h1>
          <p className="text-sm text-gray-600">Listening testlari va ma'lumotlari</p>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-4">
          <ul className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.path}>
                  <Button
                    variant={item.active ? "default" : "ghost"}
                    className={`w-full justify-start ${item.active ? "bg-blue-600 text-white" : "hover:bg-gray-100"}`}
                    onClick={() => router.push(item.path)}
                  >
                    <Icon className="h-4 w-4 mr-3" />
                    {item.title}
                  </Button>
                </li>
              )
            })}
          </ul>
        </nav>

        {/* Quick Actions */}
        <div className="p-4 border-t border-gray-200">
          <Button 
            onClick={handleCreateTest}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yangi Test Yaratish
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Bar */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {pathname !== "/listening" && (
                <Button variant="outline" onClick={handleBackToList}>
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Orqaga
                </Button>
              )}
              <h2 className="text-lg font-semibold text-gray-900">
                {pathname === "/listening" && "Testlar Ro'yxati"}
                {pathname === "/listening/create-test" && "Yangi Listening Test"}
                {pathname === "/listening/stats" && "Statistika"}
                {pathname === "/listening/users" && "Foydalanuvchilar"}
                {pathname === "/listening/settings" && "Sozlamalar"}
              </h2>
            </div>
            
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                <Mic className="h-3 w-3 mr-1" />
                Online
              </Badge>
            </div>
          </div>
        </div>

        {/* Page Content */}
        <div className="flex-1 p-6">
          {children}
        </div>
      </div>
    </div>
  )
}
