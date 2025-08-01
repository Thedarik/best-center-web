"use client"

import React, { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Home,
  FileText,
  Users,
  BarChart3,
  Settings,
  Languages,
  Search,
  Database,
} from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ScrollArea } from "@/components/ui/scroll-area"
import { cn } from "@/lib/utils"

interface SidebarItem {
  title: string
  icon: React.ReactNode
  badge?: string
  isActive: boolean
  onClick: () => void
}

interface SubMenuItem {
  title: string
  isActive: boolean
  onClick: () => void
}

interface SidebarProps {
  activeTab: string
  setActiveTab: (tab: string) => void
  sidebarOpen: boolean
  setSidebarOpen: (open: boolean) => void
  currentTime: Date
  searchQuery: string
  setSearchQuery: (query: string) => void
  onLogout?: () => void
}

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarOpen,
  setSidebarOpen,
  currentTime,
  searchQuery,
  setSearchQuery,
  onLogout,
}: SidebarProps) {
  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: <Home />,
      isActive: activeTab === "dashboard",
      onClick: () => setActiveTab("dashboard"),
    },
    {
      title: "IELTS Test",
      icon: <FileText />,
      badge: "3",
      isActive:
        activeTab === "tests" ||
        activeTab === "listening" ||
        activeTab === "reading" ||
        activeTab === "writing" ||
        activeTab === "speaking",
      onClick: () => setActiveTab("tests"),
    },
    {
      title: "Imtihonchilar",
      icon: <Users />,
      badge: "1247",
      isActive: activeTab === "students",
      onClick: () => setActiveTab("students"),
    },
    {
      title: "Test Natijalari",
      icon: <BarChart3 />,
      isActive: activeTab === "reports",
      onClick: () => setActiveTab("reports"),
    },
    {
      title: "Sozlamalar",
      icon: <Settings />,
      isActive: activeTab === "settings",
      onClick: () => setActiveTab("settings"),
    },
    {
      title: "Ma'lumotlar",
      icon: <Database />,
      isActive: activeTab === "data",
      onClick: () => setActiveTab("data"),
    },
  ]

  const ieltsSubMenu: SubMenuItem[] = [
    {
      title: "Listening",
      isActive: activeTab === "listening",
      onClick: () => setActiveTab("listening"),
    },
    {
      title: "Reading",
      isActive: activeTab === "reading",
      onClick: () => setActiveTab("reading"),
    },
    {
      title: "Writing",
      isActive: activeTab === "writing",
      onClick: () => setActiveTab("writing"),
    },
    {
      title: "Speaking",
      isActive: activeTab === "speaking",
      onClick: () => setActiveTab("speaking"),
    },
  ]

  return (
    <div
      className={cn(
        "fixed inset-y-0 left-0 z-30 hidden w-72 transform border-r bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out md:block",
        sidebarOpen ? "translate-x-0" : "-translate-x-full"
      )}
    >
      <div className="flex h-full flex-col">
        {/* Header */}
        <div className="p-6 border-b">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white shadow-lg">
              <Languages className="size-6" />
            </div>
            <div>
              <h2 className="font-bold text-lg">IELTS Pro</h2>
              <p className="text-xs text-muted-foreground">Online Test Platform</p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground mb-3">
            {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Imtihonchi, test qidirish..."
              className="w-full rounded-2xl bg-muted/50 pl-9 pr-4 py-2"
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setSearchQuery(e.target.value)
              }
            />
          </div>
        </div>

        {/* Navigation */}
        <ScrollArea className="flex-1 px-4 py-2">
          <div className="space-y-1">
            {sidebarItems.map((item) => (
              <div key={item.title}>
                <button
                  onClick={item.onClick}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    item.isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted/70 hover:scale-[1.02]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge
                      variant="secondary"
                      className="rounded-full px-2 py-0.5 text-xs"
                    >
                      {item.badge}
                    </Badge>
                  )}
                </button>
                {/* IELTS Test uchun yordamchi menyu */}
                {item.title === "IELTS Test" && (
                  <AnimatePresence>
                    {item.isActive && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                        className="ml-8 mt-1 space-y-1"
                      >
                        {ieltsSubMenu.map((subItem) => (
                          <button
                            key={subItem.title}
                            onClick={subItem.onClick}
                            className={cn(
                              "flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm transition-all duration-200",
                              subItem.isActive
                                ? "bg-primary/10 text-primary font-medium"
                                : "hover:bg-muted/50"
                            )}
                          >
                            <div className="w-4 h-4" />
                            <span>{subItem.title}</span>
                          </button>
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>

        {/* Footer */}
        <div className="border-t p-4">
          <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-3">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8 border-2 border-primary/20">
                <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                <AvatarFallback>TA</AvatarFallback>
              </Avatar>
              <div>
                <p className="text-sm font-medium">Test Administrator</p>
                <p className="text-xs text-muted-foreground">IELTS Pro</p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={onLogout}
              className="rounded-xl"
            >
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}


