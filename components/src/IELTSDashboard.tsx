
"use client"

import React, { useEffect, useState } from "react"
import { motion } from "framer-motion"
import {
  Bell,
  Menu,
  PanelLeft,
  RefreshCw,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { sampleDataService } from "@/lib/sampleDataService"
import Sidebar from "./Sidebar"
import Dashboard from "./dashboard"
import Tests from "./tests"
import Listening from "./ielts_file/listining_file/listening"
import Reading from "./ielts_file/reading"
import Writing from "./ielts_file/writing_file/writing"
import Speaking from "./ielts_file/speaking"
import Students from "./students"
import Reports from "./reports"
import Settings from "./settings"
import DataManagement from "./DataManagement"

interface IELTSDashboardProps {
  onLogout?: () => void
}

type TabType = "dashboard" | "tests" | "listening" | "reading" | "writing" | "speaking" | "students" | "reports" | "settings" | "data"

export default function IELTSDashboard({ onLogout }: IELTSDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<number>(8)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Initialize sample data on first load
  useEffect(() => {
    sampleDataService.initializeSampleData()
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-20"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 25%, rgba(34, 197, 94, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, rgba(34, 197, 94, 0.2) 25%, rgba(59, 130, 246, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.2) 25%, rgba(147, 51, 234, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
    <Sidebar
  activeTab={activeTab}
  setActiveTab={(tab: string) => setActiveTab(tab as TabType)}
  sidebarOpen={sidebarOpen}
  setSidebarOpen={setSidebarOpen}
  currentTime={currentTime}
  searchQuery={searchQuery}
  setSearchQuery={setSearchQuery}
  onLogout={onLogout}
/>

      {/* Main Content */}
      <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-72" : "md:pl-0")}>
        {/* Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/80 backdrop-blur-md px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <PanelLeft className="h-5 w-5" />
          </Button>

          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                IELTS Pro - Admin Panel
              </h1>
              <p className="text-sm text-muted-foreground">IELTS online test platformasini boshqaring</p>
            </div>

            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Ma'lumotlarni yangilash</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl relative">
                      <Bell className="h-5 w-5" />
                      {notifications > 0 && (
                        <motion.span
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
                        >
                          {notifications}
                        </motion.span>
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Bildirishnomalar</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
                <AvatarFallback>TA</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {activeTab === "dashboard" && <Dashboard />}
          {activeTab === "tests" && <Tests />}
          {activeTab === "listening" && <Listening />}
          {activeTab === "reading" && <Reading />}
          {activeTab === "writing" && <Writing />}
          {activeTab === "speaking" && <Speaking />}
          {activeTab === "students" && <Students />}
          {activeTab === "reports" && <Reports />}
          {activeTab === "settings" && <Settings onLogout={onLogout} />}
          {activeTab === "data" && <DataManagement />}
        </main>
      </div>
    </div>
  )
}



