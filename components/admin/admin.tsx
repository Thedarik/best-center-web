"use client"

import React, { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award,
  Bell,
  BookOpen,
  Building2,
  ChevronDown,
  Cloud,
  Download,
  FileText,
  Grid,
  Home,
  MapPin,
  Menu,
  MoreHorizontal,
  PanelLeft,
  Phone,
  Plus,
  QrCode,
  Search,
  Settings,
  Shield,
  Star,
  TrendingUp,
  Users,
  X,
  Zap,
  BarChart3,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Filter,
  UserCheck,
  Building,
  GraduationCap,
  Activity,
  RefreshCw,
  Download as DownloadIcon,
  UserPlus,
  FileCheck,
  AlertTriangle,
  Hash,
  Globe,
  Edit,
  Trash2,
  Upload,
  Save,
  User,
  Mail,
  BadgeCheck,
  Target,
  TrendingDown,
  AlertCircle,
  CheckSquare,
  XCircle,
  Clock3,
  Calendar as CalendarIcon,
  FileSpreadsheet,
  PieChart,
  BarChart,
  Bookmark,
  Archive,
  SendHorizontal,
  Copy,
  Share2,
} from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { CertificateManagement } from "@/components/admin/CertificateManagement"
import { cn } from "@/lib/utils"

// TypeScript interfaces
interface AnalyticsData {
  name: string
  value: number | string
  change: number | string
  trend: "up" | "down"
  icon: React.ReactNode
  description: string
  target: number
  percentage: number
}

interface Course {
  id: number
  title: string
  description: string
  students: number
  totalStudents: number
  certificates: number
  startDate: string
  endDate: string
  status: "active" | "completed" | "upcoming"
  progress: number
  duration: string
  level: "Beginner" | "Intermediate" | "Advanced"
  category: string
  instructor: string
  lastActivity: string
  thumbnail: string
}

interface Student {
  id: number
  name: string
  email: string
  phone: string
  course: string
  progress: number
  enrollDate: string
  lastActivity: string
  status: "active" | "completed" | "pending"
  certificates: number
  attendance: number
  avatar: string
}

interface Certificate {
  id: string
  studentName: string
  course: string
  issueDate: string
  status: "issued" | "draft" | "pending"
  downloads: number
  qrScans: number
  validUntil: string
  score: number
  grade: string
  issueTime: string
}

interface Activity {
  id: number
  type: "student_enrolled" | "assignment_submitted" | "certificate_issued" | "course_completed"
  message: string
  time: string
  icon: React.ReactNode
  color: string
}

interface SidebarItem {
  title: string
  icon: React.ReactNode
  badge?: string
  isActive: boolean
  onClick: () => void
}

interface Assignment {
  title: string
  course: string
  submitted: number
  total: number
  deadline: string
  status: "active" | "completed"
}

interface ReportCard {
  title: string
  desc: string
  icon: React.ReactNode
  color: string
}

interface AdminDashboardProps {
  onLogout?: () => void
}

// Certificate Template interfaces
interface CertificateTemplate {
  id: number
  name: string
  description: string
  category: "Modern" | "Classic" | "Elegant" | "Minimal" | "Colorful"
  preview: string
  colors: {
    primary: string
    secondary: string
    accent: string
  }
  isActive: boolean
  downloads: number
  rating: number
  createdDate: string
}

// Certificate templates data
const certificateTemplates: CertificateTemplate[] = [
  {
    id: 1,
    name: "Zamonaviy Gradient",
    description: "Rangdor gradient dizayni bilan zamonaviy ko'rinish",
    category: "Modern",
    preview: "/placeholder.svg?height=300&width=400",
    colors: {
      primary: "#3B82F6",
      secondary: "#8B5CF6",
      accent: "#F59E0B"
    },
    isActive: true,
    downloads: 156,
    rating: 4.8,
    createdDate: "2024-01-15"
  },
  {
    id: 2,
    name: "Klassik Elegant",
    description: "An'anaviy va professional ko'rinish",
    category: "Classic",
    preview: "/placeholder.svg?height=300&width=400",
    colors: {
      primary: "#1F2937",
      secondary: "#6B7280",
      accent: "#D97706"
    },
    isActive: false,
    downloads: 203,
    rating: 4.9,
    createdDate: "2024-02-10"
  },
  {
    id: 3,
    name: "Premium Gold",
    description: "Oltin rangli hashamatli dizayn",
    category: "Elegant",
    preview: "/placeholder.svg?height=300&width=400",
    colors: {
      primary: "#B45309",
      secondary: "#F59E0B",
      accent: "#FCD34D"
    },
    isActive: false,
    downloads: 89,
    rating: 4.7,
    createdDate: "2024-03-05"
  },
  {
    id: 4,
    name: "Minimal Clean",
    description: "Sodda va toza minimalist uslub",
    category: "Minimal",
    preview: "/placeholder.svg?height=300&width=400",
    colors: {
      primary: "#000000",
      secondary: "#6B7280",
      accent: "#10B981"
    },
    isActive: false,
    downloads: 127,
    rating: 4.6,
    createdDate: "2024-03-20"
  },
  {
    id: 5,
    name: "Rangdor Festival",
    description: "Yorqin va quvnoq ranglar bilan",
    category: "Colorful",
    preview: "/placeholder.svg?height=300&width=400",
    colors: {
      primary: "#EC4899",
      secondary: "#8B5CF6",
      accent: "#06B6D4"
    },
    isActive: false,
    downloads: 78,
    rating: 4.5,
    createdDate: "2024-04-01"
  },
  {
    id: 6,
    name: "Biznes Professional",
    description: "Biznes muhiti uchun professional dizayn",
    category: "Classic",
    preview: "/placeholder.svg?height=300&width=400",
    colors: {
      primary: "#1E40AF",
      secondary: "#3B82F6",
      accent: "#EF4444"
    },
    isActive: false,
    downloads: 234,
    rating: 4.8,
    createdDate: "2024-04-15"
  }
]

// Sample data with proper typing
const adminAnalytics: AnalyticsData[] = [
  {
    name: "Mening Sertifikatlarim",
    value: 247,
    change: 15,
    trend: "up",
    icon: <Award className="h-4 w-4" />,
    description: "Ushbu oyda berilgan",
    target: 300,
    percentage: 82
  },
  {
    name: "Faol O'quvchilar",
    value: 89,
    change: 12,
    trend: "up",
    icon: <Users className="h-4 w-4" />,
    description: "Joriy kurslar bo'yicha",
    target: 100,
    percentage: 89
  },
  {
    name: "QR Tekshirishlar",
    value: "1,247",
    change: "+198",
    trend: "up",
    icon: <QrCode className="h-4 w-4" />,
    description: "Sertifikatlar tekshirildi",
    target: 1500,
    percentage: 83
  },
  {
    name: "T Baeol Kurslar",
    value: 12,
    change: 3,
    trend: "up",
    icon: <CheckSquare className="h-4 w-4" />,
    description: "Ushbu oyda yakunlandi",
    target: 15,
    percentage: 80
  },
]

const adminCourses: Course[] = [
  {
    id: 1,
    title: "Frontend Development",
    description: "React, Next.js va TypeScript asoslari",
    students: 25,
    totalStudents: 30,
    certificates: 18,
    startDate: "2024-01-15",
    endDate: "2024-06-15",
    status: "active",
    progress: 75,
    duration: "5 oy",
    level: "Intermediate",
    category: "IT",
    instructor: "Admin User",
    lastActivity: "2 soat oldin",
    thumbnail: "/placeholder.svg?height=60&width=60"
  },
  {
    id: 2,
    title: "Digital Marketing",
    description: "SMM, SEO va kontentni boshqarish",
    students: 18,
    totalStudents: 20,
    certificates: 15,
    startDate: "2024-02-01",
    endDate: "2024-05-01",
    status: "completed",
    progress: 100,
    duration: "3 oy",
    level: "Beginner",
    category: "Marketing",
    instructor: "Admin User",
    lastActivity: "1 kun oldin",
    thumbnail: "/placeholder.svg?height=60&width=60"
  },
  {
    id: 3,
    title: "Graphic Design Basics",
    description: "Photoshop, Illustrator va dizayn printsiplari",
    students: 12,
    totalStudents: 25,
    certificates: 0,
    startDate: "2024-06-01",
    endDate: "2024-08-01",
    status: "upcoming",
    progress: 15,
    duration: "2 oy",
    level: "Beginner",
    category: "Design",
    instructor: "Admin User",
    lastActivity: "Hali boshlanmagan",
    thumbnail: "/placeholder.svg?height=60&width=60"
  },
]

const students: Student[] = [
  {
    id: 1,
    name: "Abdullayev Jasur",
    email: "jasur@gmail.com",
    phone: "+998 90 123 45 67",
    course: "Frontend Development",
    progress: 85,
    enrollDate: "2024-01-15",
    lastActivity: "2 soat oldin",
    status: "active",
    certificates: 1,
    attendance: 92,
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: 2,
    name: "Karimova Malika",
    email: "malika@gmail.com",
    phone: "+998 91 234 56 78",
    course: "Digital Marketing",
    progress: 100,
    enrollDate: "2024-02-01",
    lastActivity: "1 kun oldin",
    status: "completed",
    certificates: 1,
    attendance: 98,
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: 3,
    name: "Rakhmonov Bekzod",
    email: "bekzod@gmail.com",
    phone: "+998 92 345 67 89",
    course: "Frontend Development",
    progress: 45,
    enrollDate: "2024-01-20",
    lastActivity: "5 soat oldin",
    status: "active",
    certificates: 0,
    attendance: 78,
    avatar: "/placeholder.svg?height=40&width=40"
  },
  {
    id: 4,
    name: "Nazarova Dilnoza",
    email: "dilnoza@gmail.com",
    phone: "+998 93 456 78 90",
    course: "Graphic Design Basics",
    progress: 15,
    enrollDate: "2024-06-01",
    lastActivity: "1 soat oldin",
    status: "active",
    certificates: 0,
    attendance: 89,
    avatar: "/placeholder.svg?height=40&width=40"
  },
]

const certificatesHistory: Certificate[] = [
  {
    id: "CERT-2024-001247",
    studentName: "Karimova Malika",
    course: "Digital Marketing",
    issueDate: "2024-05-01",
    status: "issued",
    downloads: 5,
    qrScans: 12,
    validUntil: "2027-05-01",
    score: 95,
    grade: "A+",
    issueTime: "2 kun oldin"
  },
  {
    id: "CERT-2024-001245",
    studentName: "Abdullayev Jasur",
    course: "Frontend Development",
    issueDate: "2024-06-10",
    status: "draft",
    downloads: 0,
    qrScans: 0,
    validUntil: "2027-06-10",
    score: 88,
    grade: "A",
    issueTime: "Tayyorlanmoqda"
  },
]

const recentActivities: Activity[] = [
  {
    id: 1,
    type: "student_enrolled",
    message: "Nazarova Dilnoza 'Graphic Design' kursiga yozildi",
    time: "1 soat oldin",
    icon: <UserPlus className="h-4 w-4" />,
    color: "text-blue-600"
  },
  {
    id: 2,
    type: "assignment_submitted",
    message: "Abdullayev Jasur 5-topshiriqni yubordi",
    time: "2 soat oldin",
    icon: <FileCheck className="h-4 w-4" />,
    color: "text-green-600"
  },
  {
    id: 3,
    type: "certificate_issued",
    message: "Karimova Malika uchun sertifikat berildi",
    time: "2 kun oldin",
    icon: <Award className="h-4 w-4" />,
    color: "text-purple-600"
  },
  {
    id: 4,
    type: "course_completed",
    message: "Digital Marketing kursi yakunlandi",
    time: "3 kun oldin",
    icon: <CheckSquare className="h-4 w-4" />,
    color: "text-emerald-600"
  },
]

const assignments: Assignment[] = [
  { title: "React Components Yaratish", course: "Frontend Development", submitted: 15, total: 25, deadline: "2024-06-20", status: "active" },
  { title: "SMM Strategiya Rejasi", course: "Digital Marketing", submitted: 18, total: 18, deadline: "2024-06-15", status: "completed" },
  { title: "Logo Dizayni", course: "Graphic Design", submitted: 5, total: 12, deadline: "2024-06-25", status: "active" },
]

const reportCards: ReportCard[] = [
  { title: "O'quvchilar Hisoboti", desc: "Davomad va rivojlanish", icon: <Users className="h-6 w-6" />, color: "bg-blue-500" },
  { title: "Kurslar Samaradorligi", desc: "Tugallash ko'rsatkichi", icon: <BookOpen className="h-6 w-6" />, color: "bg-green-500" },
  { title: "Sertifikatlar Statistikasi", desc: "Berilgan sertifikatlar", icon: <Award className="h-6 w-6" />, color: "bg-purple-500" },
  { title: "Topshiriqlar Tahlili", desc: "Baholash natijalari", icon: <FileCheck className="h-6 w-6" />, color: "bg-orange-500" },
  { title: "Moliyaviy Hisobot", desc: "To'lovlar va daromad", icon: <BarChart3 className="h-6 w-6" />, color: "bg-emerald-500" },
  { title: "Umumiy Ko'rsatkichlar", desc: "Barcha metrikalar", icon: <PieChart className="h-6 w-6" />, color: "bg-pink-500" },
]

type TabType = "dashboard" | "courses" | "students" | "certificates" | "assignments" | "reports" | "settings"

// ✅ ASOSIY O'ZGARISH: Bu yerda export qilish kerak
export function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<TabType>("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
  const [notifications, setNotifications] = useState<number>(5)
  const [searchQuery, setSearchQuery] = useState<string>("")
  const [currentTime, setCurrentTime] = useState<Date>(new Date())

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const sidebarItems: SidebarItem[] = [
    {
      title: "Dashboard",
      icon: <Home />,
      isActive: activeTab === "dashboard",
      onClick: () => setActiveTab("dashboard")
    },
    {
      title: "Mening Kurslari",
      icon: <BookOpen />,
      badge: "3",
      isActive: activeTab === "courses",
      onClick: () => setActiveTab("courses")
    },
    {
      title: "O'quvchilar",
      icon: <Users />,
      badge: "89",
      isActive: activeTab === "students",
      onClick: () => setActiveTab("students")
    },
    {
      title: "Sertifikatlar",
      icon: <Award />,
      badge: "247",
      isActive: activeTab === "certificates",
      onClick: () => setActiveTab("certificates")
    },
    {
      title: "Topshiriqlar",
      icon: <FileCheck />,
      isActive: activeTab === "assignments",
      onClick: () => setActiveTab("assignments")
    },
    {
      title: "Hisobotlar",
      icon: <BarChart3 />,
      isActive: activeTab === "reports",
      onClick: () => setActiveTab("reports")
    },
    {
      title: "Sozlamalar",
      icon: <Settings />,
      isActive: activeTab === "settings",
      onClick: () => setActiveTab("settings")
    },
  ]

  const getStatusBadge = (status: string): React.ReactNode => {
    const statusMap = {
      active: "Faol",
      completed: "Tugallangan",
      upcoming: "Boshlanmagan",
      pending: "Kutilmoqda",
      issued: "Berilgan",
      draft: "Tayyorlanmoqda"
    }

    return (
      <Badge
        variant={status === "active" || status === "issued" ? "default" : "secondary"}
        className="rounded-xl text-xs"
      >
        {statusMap[status as keyof typeof statusMap] || status}
      </Badge>
    )
  }

  const formatInitials = (name: string): string => {
    return name.split(' ').map(n => n[0]).join('')
  }

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
      <div className={cn(
        "fixed inset-y-0 left-0 z-30 hidden w-72 transform border-r bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out md:block",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white shadow-lg">
                <GraduationCap className="size-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">CertifyUZ Admin</h2>
                <p className="text-xs text-muted-foreground">O'quv Markazi Boshqaruvi</p>
              </div>
            </div>

            <div className="text-xs text-muted-foreground mb-3">
              {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="O'quvchi, kurs qidirish..."
                className="w-full rounded-2xl bg-muted/50 pl-9 pr-4 py-2"
                value={searchQuery}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Navigation */}
          <ScrollArea className="flex-1 px-4 py-2">
            <div className="space-y-1">
              {sidebarItems.map((item) => (
                <button
                  key={item.title}
                  onClick={item.onClick}
                  className={cn(
                    "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                    item.isActive
                      ? "bg-primary text-primary-foreground shadow-md"
                      : "hover:bg-muted/70 hover:scale-[1.02]",
                  )}
                >
                  <div className="flex items-center gap-3">
                    {item.icon}
                    <span>{item.title}</span>
                  </div>
                  {item.badge && (
                    <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                      {item.badge}
                    </Badge>
                  )}
                </button>
              ))}
            </div>
          </ScrollArea>

          {/* Footer */}
          <div className="border-t p-4">
            <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-3">
              <div className="flex items-center gap-3">
                <Avatar className="h-8 w-8 border-2 border-primary/20">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
                  <AvatarFallback>AU</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Admin User</p>
                  <p className="text-xs text-muted-foreground">IT Academy Tashkent</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" onClick={onLogout} className="rounded-xl">
                <Settings className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

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
                Admin Panel - IT Academy Tashkent
              </h1>
              <p className="text-sm text-muted-foreground">O'quv jarayonini boshqaring va nazorat qiling</p>
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
                <AvatarFallback>AU</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {activeTab === "dashboard" && (
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
                          <GraduationCap className="h-3 w-3 mr-1" />
                          Admin
                        </Badge>
                        <Badge className="bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 rounded-xl">
                          <Activity className="h-3 w-3 mr-1" />
                          3 Faol Kurs
                        </Badge>
                      </div>
                      <h2 className="text-3xl font-bold">
                        Salom, Admin! 🎓
                      </h2>
                      <p className="max-w-[600px] text-white/80">
                        Bugun 5 ta yangi o'quvchi qo'shildi va 3 ta topshiriq yuborildi. Barcha kurslar muvaffaqiyatli davom etmoqda.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button className="rounded-2xl bg-white text-purple-700 hover:bg-white/90">
                          <Plus className="mr-2 h-4 w-4" />
                          Yangi Kurs Qo'shish
                        </Button>
                        <Button variant="outline" className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10">
                          <Award className="mr-2 h-4 w-4" />
                          Sertifikat Berish
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {adminAnalytics.map((item, index) => (
                  <motion.div
                    key={item.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="p-2 rounded-xl bg-primary/10">
                            {item.icon}
                          </div>
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
                          <CardDescription>Eng so'nggi o'zgarishlar va yangilanishlar</CardDescription>
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

                {/* Quick Stats */}
                <div>
                  <Card className="rounded-3xl border-2">
                    <CardHeader>
                      <CardTitle className="text-xl">Tezkor Statistika</CardTitle>
                      <CardDescription>Asosiy ko'rsatkichlar</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Bugungi davomad</span>
                          <span className="font-semibold">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">Topshiriqlar bajarildi</span>
                          <span className="font-semibold">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>

                      <div className="space-y-3">
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">O'rtacha baho</span>
                          <span className="font-semibold text-green-600">4.8</span>
                        </div>
                        <Progress value={96} className="h-2" />
                      </div>

                      <div className="pt-4 border-t">
                        <Button variant="secondary" className="w-full rounded-2xl">
                          <BarChart3 className="mr-2 h-4 w-4" />
                          Batafsil Hisobot
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Active Courses */}
              <Card className="rounded-3xl border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Faol Kurslar</CardTitle>
                      <CardDescription>Hozirda olib borilayotgan kurslar</CardDescription>
                    </div>
                    <Button variant="outline" className="rounded-2xl">
                      <BookOpen className="mr-2 h-4 w-4" />
                      Barcha Kurslar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {adminCourses.map((course, index) => (
                      <motion.div
                        key={course.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3 mb-2">
                              <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                                <BookOpen className="h-6 w-6 text-primary" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base leading-tight truncate">{course.title}</CardTitle>
                                {getStatusBadge(course.status)}
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3 space-y-3">
                            <p className="text-sm text-muted-foreground line-clamp-2">{course.description}</p>

                            <div className="space-y-2">
                              <div className="flex justify-between text-xs text-muted-foreground">
                                <span>O'quvchilar: {course.students}/{course.totalStudents}</span>
                                <span>{course.progress}%</span>
                              </div>
                              <Progress value={course.progress} className="h-2" />
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Davomiyligi</p>
                                <p className="font-semibold">{course.duration}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Daraja</p>
                                <p className="font-semibold">{course.level}</p>
                              </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Sertifikatlar</p>
                                <p className="font-semibold">{course.certificates}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Kategoriya</p>
                                <p className="font-semibold">{course.category}</p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex gap-2 pt-3">
                            <Button variant="secondary" className="flex-1 rounded-2xl text-xs">
                              <Eye className="mr-1 h-3 w-3" />
                              Boshqarish
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
          )}

          {activeTab === "courses" && (
            <div className="space-y-6">
              {/* Courses Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Mening Kurslarim</h2>
                  <p className="text-muted-foreground">Barcha kurslarni boshqaring va nazorat qiling</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-2xl">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtr
                  </Button>
                  <Button className="rounded-2xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Yangi Kurs
                  </Button>
                </div>
              </div>

              {/* Courses Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                {adminCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                              <BookOpen className="h-8 w-8 text-primary" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{course.title}</CardTitle>
                              {getStatusBadge(course.status)}
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground mt-2">{course.description}</p>
                      </CardHeader>

                      <CardContent className="space-y-4">
                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">O'quvchilar</span>
                            <span className="font-medium">{course.students}/{course.totalStudents}</span>
                          </div>
                          <Progress value={(course.students / course.totalStudents) * 100} className="h-2" />
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Kurs jarayoni</span>
                            <span className="font-medium">{course.progress}%</span>
                          </div>
                          <Progress value={course.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 pt-2 border-t">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Boshlanish</p>
                            <p className="font-medium text-xs">{course.startDate}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Tugash</p>
                            <p className="font-medium text-xs">{course.endDate}</p>
                          </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">{course.certificates}</p>
                            <p className="text-xs text-muted-foreground">Sertifikatlar</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">{course.duration}</p>
                            <p className="text-xs text-muted-foreground">Davomiyligi</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-purple-600">{course.level}</p>
                            <p className="text-xs text-muted-foreground">Daraja</p>
                          </div>
                        </div>
                      </CardContent>

                      <CardFooter className="flex gap-2">
                        <Button variant="secondary" className="flex-1 rounded-2xl">
                          <Eye className="mr-2 h-4 w-4" />
                          Boshqarish
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
            </div>
          )}

          {activeTab === "students" && (
            <div className="space-y-6">
              {/* Students Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">O'quvchilar</h2>
                  <p className="text-muted-foreground">Barcha o'quvchilar ro'yxati va ularning rivojlanishi</p>
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
                    O'quvchi Qo'shish
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
                            {getStatusBadge(student.status)}
                          </div>
                        </div>
                      </CardHeader>

                      <CardContent className="space-y-3">
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Kurs</p>
                          <p className="font-medium text-sm">{student.course}</p>
                        </div>

                        <div className="space-y-2">
                          <div className="flex justify-between text-sm">
                            <span className="text-muted-foreground">Rivojlanish</span>
                            <span className="font-medium">{student.progress}%</span>
                          </div>
                          <Progress value={student.progress} className="h-2" />
                        </div>

                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">Davomad</p>
                            <p className="font-semibold">{student.attendance}%</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">Sertifikatlar</p>
                            <p className="font-semibold">{student.certificates}</p>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Oxirgi faollik</p>
                          <p className="font-medium text-xs">{student.lastActivity}</p>
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
          )}

          {activeTab === "certificates" && (
            <CertificateManagement />
          )}

          {activeTab === "assignments" && (
            <div className="space-y-6">
              {/* Assignments Section */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Topshiriqlar Boshqaruvi</h2>
                <p className="text-muted-foreground">Topshiriqlarni yarating, tekshiring va baholang</p>

                <div className="flex justify-center gap-4">
                  <Button className="rounded-2xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Yangi Topshiriq
                  </Button>
                  <Button variant="outline" className="rounded-2xl">
                    <FileCheck className="mr-2 h-4 w-4" />
                    Tekshirish Kerak
                  </Button>
                </div>
              </div>

              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                {[
                  { title: "Jami Topshiriqlar", value: "24", icon: <FileText className="h-5 w-5" />, color: "text-blue-600" },
                  { title: "Tekshirish Kutmoqda", value: "8", icon: <Clock className="h-5 w-5" />, color: "text-yellow-600" },
                  { title: "Baholangan", value: "16", icon: <CheckCircle className="h-5 w-5" />, color: "text-green-600" },
                  { title: "O'rtacha Ball", value: "87", icon: <Target className="h-5 w-5" />, color: "text-purple-600" },
                ].map((stat, index) => (
                  <Card key={index} className="rounded-3xl border-2 text-center">
                    <CardContent className="p-6">
                      <div className={cn("mx-auto w-12 h-12 rounded-2xl bg-muted flex items-center justify-center mb-3", stat.color)}>
                        {stat.icon}
                      </div>
                      <h3 className="text-2xl font-bold">{stat.value}</h3>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Assignments List */}
              <Card className="rounded-3xl border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Oxirgi Topshiriqlar</CardTitle>
                  <CardDescription>Eng so'nggi yaratilgan va yuborilgan topshiriqlar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {assignments.map((assignment, index) => (
                      <div key={index} className="flex items-center justify-between p-4 rounded-2xl border hover:bg-muted/50 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
                            <FileCheck className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{assignment.title}</h4>
                            <p className="text-sm text-muted-foreground">{assignment.course}</p>
                            <p className="text-xs text-muted-foreground">Muddat: {assignment.deadline}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="font-medium">{assignment.submitted}/{assignment.total}</p>
                          <p className="text-sm text-muted-foreground">Yuborildi</p>
                          {getStatusBadge(assignment.status)}
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "reports" && (
            <div className="space-y-6">
              {/* Reports Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Hisobotlar va Tahlillar</h2>
                  <p className="text-muted-foreground">O'quv jarayoni va natijalar bo'yicha batafsil ma'lumotlar</p>
                </div>
                <Button className="rounded-2xl">
                  <DownloadIcon className="mr-2 h-4 w-4" />
                  Hisobot Eksport Qilish
                </Button>
              </div>

              {/* Report Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {reportCards.map((report, index) => (
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
            </div>
          )}

          {activeTab === "settings" && (
            <div className="space-y-6">
              {/* Settings Header */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">Sozlamalar</h2>
                <p className="text-muted-foreground">Profilingizni va tizim sozlamalarini boshqaring</p>

                <Card className="max-w-md mx-auto rounded-3xl border-2">
                  <CardContent className="p-8 text-center space-y-4">
                    <Avatar className="mx-auto h-24 w-24 border-4 border-primary/20">
                      <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Admin" />
                      <AvatarFallback className="text-xl">AU</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-semibold text-lg">Admin User</h3>
                      <p className="text-sm text-muted-foreground">IT Academy Tashkent</p>
                      <p className="text-sm text-muted-foreground">admin@itacademy.uz</p>
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
                        <Settings className="mr-2 h-4 w-4" />
                        Tizim Sozlamalari
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

              {/* Additional Settings Options */}
              <Card className="max-w-md mx-auto rounded-3xl border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Tizim Sozlamalari</CardTitle>
                  <CardDescription>Umumiy platforma sozlamalarini boshqaring</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Bildirishnoma Sozlamalari</p>
                    <Button variant="secondary" className="w-full rounded-2xl">
                      <Bell className="mr-2 h-4 w-4" />
                      Bildirishnomalarni Sozlash
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Ma'lumotlar Zahirasi</p>
                    <Button variant="secondary" className="w-full rounded-2xl">
                      <Cloud className="mr-2 h-4 w-4" />
                      Zahira Nusxasini Yaratish
                    </Button>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Tashkilot Ma'lumotlari</p>
                    <Button variant="secondary" className="w-full rounded-2xl">
                      <Building className="mr-2 h-4 w-4" />
                      Tashkilotni Tahrirlash
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}