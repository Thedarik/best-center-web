"use client"

import { useEffect, useState } from "react"
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
import { cn } from "@/lib/utils"

// Sample data for certificate management system
const analyticsData = [
  { 
    name: "O'quv Markazlari", 
    value: 87, 
    change: +12, 
    trend: "up", 
    icon: <Building2 className="h-4 w-4" />,
    description: "Shartnoma qilgan markazlar"
  },
  { 
    name: "Admin Foydalanuvchilar", 
    value: 145, 
    change: +23, 
    trend: "up", 
    icon: <UserCheck className="h-4 w-4" />,
    description: "Yaratilgan adminlar"
  },
  { 
    name: "Sertifikatlar", 
    value: "12,458", 
    change: "+1,247", 
    trend: "up", 
    icon: <Award className="h-4 w-4" />,
    description: "Umumiy sertifikatlar"
  },
  { 
    name: "QR Skanlar", 
    value: "48,692", 
    change: "+3,821", 
    trend: "up", 
    icon: <QrCode className="h-4 w-4" />,
    description: "Tekshirishlar soni"
  },
]

// O'quv markazlari ma'lumotlari
const educationCenters = [
  {
    id: 1,
    name: "IT Academy Tashkent",
    type: "IT Ta'lim",
    region: "Toshkent",
    district: "Chilonzor",
    phone: "+998 90 123 45 67",
    admins: 3,
    certificates: 1247,
    status: "active",
    contractDate: "2024-01-15",
    lastActivity: "2 soat oldin",
    qrScans: 4521,
    logo: "/placeholder.svg?height=40&width=40"
  },
  {
    id: 2,
    name: "English Plus Center",
    type: "Til Ta'limi",
    region: "Samarqand",
    district: "Samarqand",
    phone: "+998 91 234 56 78",
    admins: 2,
    certificates: 892,
    status: "active",
    contractDate: "2024-02-20",
    lastActivity: "1 kun oldin",
    qrScans: 2341,
    logo: "/placeholder.svg?height=40&width=40"
  },
  {
    id: 3,
    name: "Pro Skills Academy",
    type: "Kasbiy Ta'lim",
    region: "Farg'ona",
    district: "Farg'ona",
    phone: "+998 92 345 67 89",
    admins: 4,
    certificates: 567,
    status: "pending",
    contractDate: "2024-06-10",
    lastActivity: "3 kun oldin",
    qrScans: 1892,
    logo: "/placeholder.svg?height=40&width=40"
  },
  {
    id: 4,
    name: "Digital Marketing Hub",
    type: "Marketing",
    region: "Andijon",
    district: "Andijon",
    phone: "+998 93 456 78 90",
    admins: 2,
    certificates: 334,
    status: "active",
    contractDate: "2024-03-05",
    lastActivity: "5 soat oldin",
    qrScans: 987,
    logo: "/placeholder.svg?height=40&width=40"
  },
]

// Oxirgi sertifikatlar
const recentCertificates = [
  {
    id: "CERT-2024-001247",
    studentName: "Abdullayev Jasur Akramovich",
    centerName: "IT Academy Tashkent",
    course: "Full Stack Development",
    completionDate: "2024-06-15",
    district: "Chilonzor",
    phone: "+998 90 123 45 67",
    status: "verified",
    qrScanned: 5,
    issueTime: "15 daqiqa oldin"
  },
  {
    id: "CERT-2024-001246",
    studentName: "Karimova Malika Azizovna",
    centerName: "English Plus Center",
    course: "IELTS Preparation",
    completionDate: "2024-06-15",
    district: "Samarqand",
    phone: "+998 91 234 56 78",
    status: "verified",
    qrScanned: 2,
    issueTime: "32 daqiqa oldin"
  },
  {
    id: "CERT-2024-001245",
    studentName: "Rakhmonov Bekzod Shavkatovich",
    centerName: "Pro Skills Academy",
    course: "Graphic Design",
    completionDate: "2024-06-14",
    district: "Farg'ona",
    phone: "+998 92 345 67 89",
    status: "pending",
    qrScanned: 0,
    issueTime: "1 soat oldin"
  },
]

// Activity feed
const activityFeed = [
  {
    id: 1,
    type: "certificate",
    message: "IT Academy Tashkent tomonidan 15 ta yangi sertifikat kiritildi",
    time: "10 daqiqa oldin",
    icon: <Award className="h-4 w-4" />,
    color: "text-green-600"
  },
  {
    id: 2,
    type: "center",
    message: "Creative Design Center yangi shartnoma imzoladi",
    time: "1 soat oldin",
    icon: <Building2 className="h-4 w-4" />,
    color: "text-blue-600"
  },
  {
    id: 3,
    type: "admin",
    message: "English Plus Center uchun yangi admin yaratildi",
    time: "2 soat oldin",
    icon: <UserPlus className="h-4 w-4" />,
    color: "text-purple-600"
  },
  {
    id: 4,
    type: "verification",
    message: "25 ta sertifikat QR kod orqali tekshirildi",
    time: "3 soat oldin",
    icon: <QrCode className="h-4 w-4" />,
    color: "text-orange-600"
  },
]

interface CertificateDashboardProps {
  onLogout?: () => void
}

export function CertificateDashboard({ onLogout }: CertificateDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState(8)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <Home />,
      isActive: activeTab === "dashboard",
      onClick: () => setActiveTab("dashboard")
    },
    {
      title: "O'quv Markazlari",
      icon: <Building2 />,
      badge: "87",
      isActive: activeTab === "centers",
      onClick: () => setActiveTab("centers")
    },
    {
      title: "Adminlar",
      icon: <UserCheck />,
      badge: "145",
      isActive: activeTab === "admins",
      onClick: () => setActiveTab("admins")
    },
    {
      title: "Sertifikatlar",
      icon: <Award />,
      badge: "12.4K",
      isActive: activeTab === "certificates",
      onClick: () => setActiveTab("certificates")
    },
    {
      title: "QR Tekshirish",
      icon: <QrCode />,
      isActive: activeTab === "verification",
      onClick: () => setActiveTab("verification")
    },
    {
      title: "Analytics",
      icon: <BarChart3 />,
      isActive: activeTab === "analytics",
      onClick: () => setActiveTab("analytics")
    },
    {
      title: "Sozlamalar",
      icon: <Settings />,
      isActive: activeTab === "settings",
      onClick: () => setActiveTab("settings")
    },
  ]

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
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
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
                <Shield className="size-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">CertifyUZ</h2>
                <p className="text-xs text-muted-foreground">Sertifikat Boshqaruv Tizimi</p>
              </div>
            </div>
            
            <div className="text-xs text-muted-foreground mb-3">
              {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Qidirish..." 
                className="w-full rounded-2xl bg-muted/50 pl-9 pr-4 py-2"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
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
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Super Admin" />
                  <AvatarFallback>SA</AvatarFallback>
                </Avatar>
                <div>
                  <p className="text-sm font-medium">Super Admin</p>
                  <p className="text-xs text-muted-foreground">Tizim Boshqaruvchisi</p>
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
                Sertifikat Boshqaruv Tizimi
              </h1>
              <p className="text-sm text-muted-foreground">Uzbekiston uchun yagona sertifikat platformasi</p>
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
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Super Admin" />
                <AvatarFallback>SA</AvatarFallback>
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
                          <Shield className="h-3 w-3 mr-1" />
                          Super Admin
                        </Badge>
                        <Badge className="bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 rounded-xl">
                          <Activity className="h-3 w-3 mr-1" />
                          87 Faol Markaz
                        </Badge>
                      </div>
                      <h2 className="text-3xl font-bold">
                        Salom, Super Admin! 👋
                      </h2>
                      <p className="max-w-[600px] text-white/80">
                        Bugun 15 ta yangi sertifikat kiritildi va 48 ta QR kod skanlandı. Barcha markazlar faol ishlayapti.
                      </p>
                      <div className="flex flex-wrap gap-3">
                        <Button className="rounded-2xl bg-white text-purple-700 hover:bg-white/90">
                          <Plus className="mr-2 h-4 w-4" />
                          Yangi Markaz Qo'shish
                        </Button>
                        <Button variant="outline" className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10">
                          <DownloadIcon className="mr-2 h-4 w-4" />
                          Hisobot Yuklab Olish
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Analytics Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {analyticsData.map((item, index) => (
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
                        <div>
                          <p className="text-2xl font-bold">{item.value}</p>
                          <p className="text-sm text-muted-foreground">{item.name}</p>
                          <p className="text-xs text-muted-foreground mt-1">{item.description}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
                {/* Recent Certificates */}
                <div className="lg:col-span-2">
                  <Card className="rounded-3xl border-2">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <div>
                          <CardTitle className="text-xl">Oxirgi Sertifikatlar</CardTitle>
                          <CardDescription>Eng so'nggi kiritilgan sertifikatlar</CardDescription>
                        </div>
                        <Button variant="outline" className="rounded-2xl">
                          <Eye className="mr-2 h-4 w-4" />
                          Barchasini Ko'rish
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {recentCertificates.map((cert, index) => (
                          <motion.div
                            key={cert.id}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20"
                          >
                            <div className="relative">
                              <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center">
                                <Award className="h-6 w-6 text-primary" />
                              </div>
                              <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
                                <Hash className="h-3 w-3" />
                              </div>
                            </div>
                            
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-2 mb-1">
                                <p className="font-medium truncate">{cert.studentName}</p>
                                <Badge 
                                  variant={cert.status === "verified" ? "default" : "secondary"} 
                                  className="rounded-xl text-xs"
                                >
                                  {cert.status === "verified" ? "Tasdiqlangan" : "Kutilmoqda"}
                                </Badge>
                              </div>
                              <div className="text-sm text-muted-foreground">
                                <p>{cert.course} • {cert.centerName}</p>
                                <p className="flex items-center gap-4 mt-1">
                                  <span>{cert.completionDate}</span>
                                  <span>•</span>
                                  <span className="flex items-center gap-1">
                                    <QrCode className="h-3 w-3" />
                                    {cert.qrScanned} marta skanerlangladi
                                  </span>
                                </p>
                              </div>
                            </div>
                            
                            <div className="text-xs text-muted-foreground">
                              {cert.issueTime}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>

                {/* Activity Feed */}
                <div>
                  <Card className="rounded-3xl border-2">
                    <CardHeader>
                      <CardTitle className="text-xl">Faoliyat Tarixlari</CardTitle>
                      <CardDescription>Real-vaqt yangilanishlar</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {activityFeed.map((activity, index) => (
                          <motion.div
                            key={activity.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.3, delay: index * 0.1 }}
                            className="flex items-start gap-3"
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
                      <Button variant="ghost" className="w-full mt-4 rounded-2xl">
                        Barcha Faoliyatni Ko'rish
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              </div>

              {/* Top Education Centers */}
              <Card className="rounded-3xl border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Eng Faol O'quv Markazlari</CardTitle>
                      <CardDescription>Eng ko'p sertifikat bergan markazlar</CardDescription>
                    </div>
                    <Button variant="outline" className="rounded-2xl">
                      <Building2 className="mr-2 h-4 w-4" />
                      Barcha Markazlar
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {educationCenters.slice(0, 4).map((center, index) => (
                      <motion.div
                        key={center.id}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{ scale: 1.02, y: -5 }}
                      >
                        <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
                          <CardHeader className="pb-3">
                            <div className="flex items-center gap-3 mb-2">
                              <Avatar className="h-10 w-10">
                                <AvatarImage src={center.logo} alt={center.name} />
                                <AvatarFallback>{center.name.charAt(0)}</AvatarFallback>
                              </Avatar>
                              <div className="flex-1 min-w-0">
                                <CardTitle className="text-base leading-tight truncate">{center.name}</CardTitle>
                                <Badge variant="outline" className="rounded-xl text-xs mt-1">
                                  {center.type}
                                </Badge>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pb-3 space-y-3">
                            <div className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-1 text-muted-foreground">
                                <MapPin className="h-3 w-3" />
                                <span>{center.district}</span>
                              </div>
                              <Badge 
                                variant={center.status === "active" ? "default" : "secondary"} 
                                className="rounded-xl text-xs"
                              >
                                {center.status === "active" ? "Faol" : "Kutilmoqda"}
                              </Badge>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Sertifikatlar</p>
                                <p className="font-semibold">{center.certificates.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">QR Skanlar</p>
                                <p className="font-semibold">{center.qrScans.toLocaleString()}</p>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="text-muted-foreground">Adminlar</p>
                                <p className="font-semibold">{center.admins} nafar</p>
                              </div>
                              <div>
                                <p className="text-muted-foreground">Oxirgi faollik</p>
                                <p className="font-semibold text-xs">{center.lastActivity}</p>
                              </div>
                            </div>
                          </CardContent>
                          <CardFooter className="flex gap-2 pt-3">
                            <Button variant="secondary" className="flex-1 rounded-2xl text-xs">
                              <Eye className="mr-1 h-3 w-3" />
                              Ko'rish
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

          {activeTab === "centers" && (
            <div className="space-y-6">
              {/* Centers Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">O'quv Markazlari</h2>
                  <p className="text-muted-foreground">Shartnoma qilgan barcha o'quv markazlari</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" className="rounded-2xl">
                    <Filter className="mr-2 h-4 w-4" />
                    Filtr
                  </Button>
                  <Button className="rounded-2xl">
                    <Plus className="mr-2 h-4 w-4" />
                    Yangi Markaz
                  </Button>
                </div>
              </div>

              {/* Centers Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {educationCenters.map((center, index) => (
                  <motion.div
                    key={center.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                  >
                    <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                      <CardHeader>
                        <div className="flex items-start justify-between">
                          <div className="flex items-center gap-3">
                            <Avatar className="h-12 w-12">
                              <AvatarImage src={center.logo} alt={center.name} />
                              <AvatarFallback>{center.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <CardTitle className="text-lg">{center.name}</CardTitle>
                              <Badge variant="outline" className="rounded-xl text-xs mt-1">
                                {center.type}
                              </Badge>
                            </div>
                          </div>
                          <Badge 
                            variant={center.status === "active" ? "default" : "secondary"} 
                            className="rounded-xl"
                          >
                            {center.status === "active" ? "Faol" : "Kutilmoqda"}
                          </Badge>
                        </div>
                      </CardHeader>
                      
                      <CardContent className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Hudud</p>
                            <p className="font-medium">{center.region}</p>
                          </div>
                          <div className="space-y-1">
                            <p className="text-sm text-muted-foreground">Tuman</p>
                            <p className="font-medium">{center.district}</p>
                          </div>
                        </div>
                        
                        <div className="space-y-1">
                          <p className="text-sm text-muted-foreground">Telefon</p>
                          <p className="font-medium">{center.phone}</p>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-4 pt-2 border-t">
                          <div className="text-center">
                            <p className="text-lg font-bold text-primary">{center.admins}</p>
                            <p className="text-xs text-muted-foreground">Adminlar</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-green-600">{center.certificates}</p>
                            <p className="text-xs text-muted-foreground">Sertifikatlar</p>
                          </div>
                          <div className="text-center">
                            <p className="text-lg font-bold text-blue-600">{center.qrScans}</p>
                            <p className="text-xs text-muted-foreground">QR Skanlar</p>
                          </div>
                        </div>
                      </CardContent>
                      
                      <CardFooter className="flex gap-2">
                        <Button variant="secondary" className="flex-1 rounded-2xl">
                          <Eye className="mr-2 h-4 w-4" />
                          Batafsil
                        </Button>
                        <Button variant="outline" className="flex-1 rounded-2xl">
                          <UserPlus className="mr-2 h-4 w-4" />
                          Admin Qo'shish
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "certificates" && (
            <div className="space-y-6">
              {/* Certificates Header */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold">Sertifikatlar</h2>
                  <p className="text-muted-foreground">Barcha kiritilgan sertifikatlar ro'yxati</p>
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
                </div>
              </div>

              {/* Certificates Table */}
              <Card className="rounded-3xl border-2">
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="border-b bg-muted/50">
                        <tr>
                          <th className="text-left p-4 font-medium">Sertifikat ID</th>
                          <th className="text-left p-4 font-medium">Talaba F.I.Sh</th>
                          <th className="text-left p-4 font-medium">O'quv Markazi</th>
                          <th className="text-left p-4 font-medium">Yo'nalish</th>
                          <th className="text-left p-4 font-medium">Sana</th>
                          <th className="text-left p-4 font-medium">Holat</th>
                          <th className="text-left p-4 font-medium">QR Skanlar</th>
                          <th className="text-left p-4 font-medium">Amallar</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y">
                        {recentCertificates.map((cert) => (
                          <tr key={cert.id} className="hover:bg-muted/50 transition-colors">
                            <td className="p-4">
                              <code className="text-xs bg-muted px-2 py-1 rounded">{cert.id}</code>
                            </td>
                            <td className="p-4 font-medium">{cert.studentName}</td>
                            <td className="p-4">{cert.centerName}</td>
                            <td className="p-4">{cert.course}</td>
                            <td className="p-4">{cert.completionDate}</td>
                            <td className="p-4">
                              <Badge 
                                variant={cert.status === "verified" ? "default" : "secondary"} 
                                className="rounded-xl"
                              >
                                {cert.status === "verified" ? "Tasdiqlangan" : "Kutilmoqda"}
                              </Badge>
                            </td>
                            <td className="p-4">
                              <div className="flex items-center gap-1">
                                <QrCode className="h-4 w-4 text-primary" />
                                <span>{cert.qrScanned}</span>
                              </div>
                            </td>
                            <td className="p-4">
                              <div className="flex gap-1">
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                                  <Eye className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
                                  <DownloadIcon className="h-4 w-4" />
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {activeTab === "verification" && (
            <div className="space-y-6">
              {/* QR Verification Section */}
              <div className="text-center space-y-4">
                <h2 className="text-2xl font-bold">QR Kod Tekshirish</h2>
                <p className="text-muted-foreground">Sertifikat haqiqiyligini QR kod orqali tekshiring</p>
                
                <Card className="max-w-md mx-auto rounded-3xl border-2 border-dashed border-primary/50">
                  <CardContent className="p-8 text-center space-y-4">
                    <div className="mx-auto w-24 h-24 rounded-2xl bg-primary/10 flex items-center justify-center">
                      <QrCode className="h-12 w-12 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold">QR Kodni Skanerlang</h3>
                      <p className="text-sm text-muted-foreground">Kamera yoki QR kod raqamini kiriting</p>
                    </div>
                    <div className="space-y-3">
                      <Input 
                        placeholder="QR kod raqamini kiriting..."
                        className="rounded-2xl"
                      />
                      <Button className="w-full rounded-2xl">
                        <Search className="mr-2 h-4 w-4" />
                        Tekshirish
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Recent Verifications */}
              <Card className="rounded-3xl border-2">
                <CardHeader>
                  <CardTitle className="text-xl">Oxirgi Tekshirishlar</CardTitle>
                  <CardDescription>QR kod orqali amalga oshirilgan tekshirishlar</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between p-4 rounded-2xl bg-muted/50">
                        <div className="flex items-center gap-3">
                          <div className="h-10 w-10 rounded-xl bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-5 w-5 text-green-600" />
                          </div>
                          <div>
                            <p className="font-medium">CERT-2024-00124{i}</p>
                            <p className="text-sm text-muted-foreground">{i + 2} daqiqa oldin</p>
                          </div>
                        </div>
                        <Badge variant="default" className="rounded-xl">
                          Haqiqiy
                        </Badge>
                      </div>
                    ))}
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