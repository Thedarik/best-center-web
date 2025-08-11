"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Menu,
  X,
  Home,
  BookOpen,
  Users,
  BarChart3,
  Settings,
  Bell,
  Search,
  ChevronDown,
  ChevronUp,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface MobileOptimizedProps {
  children?: React.ReactNode
}

export function MobileOptimized({ children }: MobileOptimizedProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("dashboard")
  const [isScrolled, setIsScrolled] = useState(false)

  // Handle scroll for header styling
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth > 768) {
        setIsMobileMenuOpen(false)
        setIsSearchOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const menuItems = [
    { id: "dashboard", label: "Dashboard", icon: Home },
    { id: "tests", label: "Tests", icon: BookOpen },
    { id: "students", label: "Students", icon: Users },
    { id: "analytics", label: "Analytics", icon: BarChart3 },
    { id: "settings", label: "Settings", icon: Settings },
  ]

  const quickActions = [
    { label: "Create Test", action: () => console.log("Create Test") },
    { label: "Add Student", action: () => console.log("Add Student") },
    { label: "View Reports", action: () => console.log("View Reports") },
  ]

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <motion.header
        className={cn(
          "fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b transition-all duration-300",
          isScrolled && "shadow-lg"
        )}
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center justify-between px-4 py-3">
          {/* Logo */}
          <motion.div
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">C</span>
            </div>
            <span className="font-bold text-lg hidden sm:block">CertifyUZ</span>
          </motion.div>

          {/* Search Bar */}
          <AnimatePresence>
            {isSearchOpen && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: 0 }}
                className="absolute left-0 right-0 mx-4"
              >
                <Input
                  placeholder="Search..."
                  className="w-full"
                  autoFocus
                  onBlur={() => setIsSearchOpen(false)}
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
              className="md:hidden"
            >
              <Search className="h-4 w-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="relative"
            >
              <Bell className="h-4 w-4" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 p-0 text-xs">
                3
              </Badge>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden"
            >
              {isMobileMenuOpen ? (
                <X className="h-4 w-4" />
              ) : (
                <Menu className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 h-full w-80 bg-background border-l z-50 md:hidden"
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-lg font-semibold">Menu</h2>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Navigation Menu */}
                <nav className="space-y-2">
                  {menuItems.map((item) => {
                    const Icon = item.icon
                    return (
                      <motion.button
                        key={item.id}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          setActiveSection(item.id)
                          setIsMobileMenuOpen(false)
                        }}
                        className={cn(
                          "w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors",
                          activeSection === item.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </motion.button>
                    )
                  })}
                </nav>

                {/* Quick Actions */}
                <div className="mt-8">
                  <h3 className="text-sm font-medium text-muted-foreground mb-3">
                    Quick Actions
                  </h3>
                  <div className="space-y-2">
                    {quickActions.map((action, index) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ x: 4 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => {
                          action.action()
                          setIsMobileMenuOpen(false)
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2 rounded-lg text-left hover:bg-muted transition-colors"
                      >
                        <span className="text-sm">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Main Content */}
      <main className="pt-16 md:pt-0">
        {/* Mobile Content Wrapper */}
        <div className="md:hidden">
          {/* Mobile Dashboard Cards */}
          <div className="p-4 space-y-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Quick Stats</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">156</div>
                      <div className="text-sm text-muted-foreground">Total Tests</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">1,247</div>
                      <div className="text-sm text-muted-foreground">Students</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Mobile Navigation Tabs */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <CardContent className="p-0">
                  <div className="flex overflow-x-auto scrollbar-hide">
                    {menuItems.map((item) => {
                      const Icon = item.icon
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={cn(
                            "flex flex-col items-center gap-2 px-6 py-4 min-w-[80px] transition-colors",
                            activeSection === item.id
                              ? "bg-primary text-primary-foreground"
                              : "hover:bg-muted"
                          )}
                        >
                          <Icon className="h-5 w-5" />
                          <span className="text-xs">{item.label}</span>
                        </button>
                      )
                    })}
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Recent Activity</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {[
                      { action: "New test created", time: "2 min ago", user: "Admin" },
                      { action: "Student completed test", time: "5 min ago", user: "Student_123" },
                      { action: "Report generated", time: "10 min ago", user: "System" },
                    ].map((activity, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center justify-between p-3 bg-muted/50 rounded-lg"
                      >
                        <div>
                          <p className="text-sm font-medium">{activity.action}</p>
                          <p className="text-xs text-muted-foreground">
                            by {activity.user}
                          </p>
                        </div>
                        <span className="text-xs text-muted-foreground">
                          {activity.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Desktop Content */}
        <div className="hidden md:block">
          {children}
        </div>
      </main>
    </div>
  )
} 