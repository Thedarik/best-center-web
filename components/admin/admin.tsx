// "use client"

// import React, { useEffect, useState } from "react"
// import { motion, AnimatePresence } from "framer-motion"
// import {
//   Award,
//   Bell,
//   BookOpen,
//   Building2,
//   ChevronDown,
//   Cloud,
//   Download,
//   FileText,
//   Grid,
//   Home,
//   MapPin,
//   Menu,
//   MoreHorizontal,
//   PanelLeft,
//   Phone,
//   Plus,
//   QrCode,
//   Search,
//   Settings,
//   Shield,
//   Star,
//   TrendingUp,
//   Users,
//   X,
//   Zap,
//   BarChart3,
//   Calendar,
//   CheckCircle,
//   Clock,
//   Eye,
//   Filter,
//   UserCheck,
//   Building,
//   GraduationCap,
//   Activity,
//   RefreshCw,
//   Download as DownloadIcon,
//   UserPlus,
//   FileCheck,
//   AlertTriangle,
//   Hash,
//   Globe,
//   Edit,
//   Trash2,
//   Upload,
//   Save,
//   User,
//   Mail,
//   BadgeCheck,
//   Target,
//   TrendingDown,
//   AlertCircle,
//   CheckSquare,
//   XCircle,
//   Clock3,
//   Calendar as CalendarIcon,
//   FileSpreadsheet,
//   PieChart,
//   BarChart,
//   Bookmark,
//   Archive,
//   SendHorizontal,
//   Copy,
//   Share2,
//   Headphones,
//   Mic,
//   PenTool,
//   MessageSquare,
//   PlayCircle,
//   Timer,
//   Brain,
//   Languages,
//   Flag,
// } from "lucide-react"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Progress } from "@/components/ui/progress"
// import { ScrollArea } from "@/components/ui/scroll-area"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
// import { cn } from "@/lib/utils"

// // TypeScript interfaces for IELTS
// interface IELTSAnalytics {
//   name: string
//   value: number | string
//   change: number | string
//   trend: "up" | "down"
//   icon: React.ReactNode
//   description: string
//   target: number
//   percentage: number
// }

// interface IELTSTest {
//   id: number
//   type: "Academic" | "General Training"
//   status: "scheduled" | "in_progress" | "completed" | "cancelled"
//   date: string
//   time: string
//   duration: string
//   testCenter: string
//   sections: {
//     listening: number | null
//     reading: number | null
//     writing: number | null
//     speaking: number | null
//   }
//   overallBand: number | null
//   registrationDate: string
//   examiner: string
//   category: string
// }

// interface Student {
//   id: number
//   name: string
//   email: string
//   phone: string
//   targetBand: number
//   currentLevel: string
//   testsCompleted: number
//   bestScore: number
//   registrationDate: string
//   lastActivity: string
//   status: "active" | "inactive" | "banned"
//   avatar: string
//   country: string
//   purpose: "Study" | "Immigration" | "Work" | "Other"
// }

// interface TestSession {
//   id: string
//   studentName: string
//   testType: "Academic" | "General Training"
//   startTime: string
//   duration: string
//   status: "scheduled" | "in_progress" | "completed" | "paused"
//   currentSection: "listening" | "reading" | "writing" | "speaking" | "break"
//   progress: number
//   timeRemaining: string
//   proctor: string
// }

// interface Activity {
//   id: number
//   type: "test_started" | "test_completed" | "registration" | "score_released"
//   message: string
//   time: string
//   icon: React.ReactNode
//   color: string
// }

// interface SidebarItem {
//   title: string
//   icon: React.ReactNode
//   badge?: string
//   isActive: boolean
//   onClick: () => void
// }

// interface SubMenuItem {
//   title: string
//   isActive: boolean
//   onClick: () => void
// }

// interface IELTSDashboardProps {
//   onLogout?: () => void
// }

// // Sample IELTS data
// const ieltsAnalytics: IELTSAnalytics[] = [
//   {
//     name: "Jami Imtihonchilar",
//     value: 1247,
//     change: 15,
//     trend: "up",
//     icon: <Users className="h-4 w-4" />,
//     description: "Ushbu oyda ro'yxatdan o'tgan",
//     target: 1500,
//     percentage: 83
//   },
//   {
//     name: "Faol Sessiyalar",
//     value: 89,
//     change: 12,
//     trend: "up",
//     icon: <PlayCircle className="h-4 w-4" />,
//     description: "Hozirda davom etayotgan",
//     target: 100,
//     percentage: 89
//   },
//   {
//     name: "O'rtacha Band",
//     value: "6.5",
//     change: "+0.3",
//     trend: "up",
//     icon: <Target className="h-4 w-4" />,
//     description: "Oxirgi 3 oyda",
//     target: 7,
//     percentage: 93
//   },
//   {
//     name: "Tugallangan Testlar",
//     value: 3247,
//     change: 198,
//     trend: "up",
//     icon: <CheckSquare className="h-4 w-4" />,
//     description: "Ushbu oyda",
//     target: 4000,
//     percentage: 81
//   },
// ]

// const ieltsTests: IELTSTest[] = [
//   {
//     id: 1,
//     type: "Academic",
//     status: "completed",
//     date: "2024-06-15",
//     time: "09:00",
//     duration: "2h 45m",
//     testCenter: "Tashkent Test Center",
//     sections: {
//       listening: 7.5,
//       reading: 8.0,
//       writing: 6.5,
//       speaking: 7.0
//     },
//     overallBand: 7.0,
//     registrationDate: "2024-05-15",
//     examiner: "John Smith",
//     category: "Academic"
//   },
//   {
//     id: 2,
//     type: "General Training",
//     status: "scheduled",
//     date: "2024-06-25",
//     time: "14:00",
//     duration: "2h 45m",
//     testCenter: "Samarkand Test Center",
//     sections: {
//       listening: null,
//       reading: null,
//       writing: null,
//       speaking: null
//     },
//     overallBand: null,
//     registrationDate: "2024-06-01",
//     examiner: "Sarah Johnson",
//     category: "General Training"
//   },
//   {
//     id: 3,
//     type: "Academic",
//     status: "in_progress",
//     date: "2024-06-18",
//     time: "10:30",
//     duration: "2h 45m",
//     testCenter: "Bukhara Test Center",
//     sections: {
//       listening: 6.5,
//       reading: 7.0,
//       writing: null,
//       speaking: null
//     },
//     overallBand: null,
//     registrationDate: "2024-05-20",
//     examiner: "Mike Davis",
//     category: "Academic"
//   }
// ]

// const students: Student[] = [
//   {
//     id: 1,
//     name: "Abdullayev Jasur",
//     email: "jasur@gmail.com",
//     phone: "+998 90 123 45 67",
//     targetBand: 7.0,
//     currentLevel: "Intermediate",
//     testsCompleted: 3,
//     bestScore: 6.5,
//     registrationDate: "2024-01-15",
//     lastActivity: "2 soat oldin",
//     status: "active",
//     avatar: "/placeholder.svg?height=40&width=40",
//     country: "Uzbekistan",
//     purpose: "Study"
//   },
//   {
//     id: 2,
//     name: "Karimova Malika",
//     email: "malika@gmail.com",
//     phone: "+998 91 234 56 78",
//     targetBand: 8.0,
//     currentLevel: "Upper-Intermediate",
//     testsCompleted: 5,
//     bestScore: 7.5,
//     registrationDate: "2024-02-01",
//     lastActivity: "1 kun oldin",
//     status: "active",
//     avatar: "/placeholder.svg?height=40&width=40",
//     country: "Uzbekistan",
//     purpose: "Immigration"
//   },
//   {
//     id: 3,
//     name: "Smith John",
//     email: "john@gmail.com",
//     phone: "+1 555 123 4567",
//     targetBand: 6.5,
//     currentLevel: "Pre-Intermediate",
//     testsCompleted: 2,
//     bestScore: 5.5,
//     registrationDate: "2024-03-10",
//     lastActivity: "3 soat oldin",
//     status: "active",
//     avatar: "/placeholder.svg?height=40&width=40",
//     country: "USA",
//     purpose: "Work"
//   }
// ]

// const testSessions: TestSession[] = [
//   {
//     id: "SESS-2024-001",
//     studentName: "Abdullayev Jasur",
//     testType: "Academic",
//     startTime: "09:00",
//     duration: "2h 45m",
//     status: "in_progress",
//     currentSection: "reading",
//     progress: 65,
//     timeRemaining: "58m 23s",
//     proctor: "AI Proctor"
//   },
//   {
//     id: "SESS-2024-002",
//     studentName: "Karimova Malika",
//     testType: "General Training",
//     startTime: "14:00",
//     duration: "2h 45m",
//     status: "scheduled",
//     currentSection: "listening",
//     progress: 0,
//     timeRemaining: "2h 45m",
//     proctor: "Human Proctor"
//   }
// ]

// const recentActivities: Activity[] = [
//   {
//     id: 1,
//     type: "test_started",
//     message: "Abdullayev Jasur IELTS Academic testini boshladi",
//     time: "1 soat oldin",
//     icon: <PlayCircle className="h-4 w-4" />,
//     color: "text-blue-600"
//   },
//   {
//     id: 2,
//     type: "test_completed",
//     message: "Karimova Malika testni muvaffaqiyatli yakunladi (Band 7.5)",
//     time: "3 soat oldin",
//     icon: <CheckCircle className="h-4 w-4" />,
//     color: "text-green-600"
//   },
//   {
//     id: 3,
//     type: "registration",
//     message: "15 ta yangi o'quvchi ro'yxatdan o'tdi",
//     time: "5 soat oldin",
//     icon: <UserPlus className="h-4 w-4" />,
//     color: "text-purple-600"
//   },
//   {
//     id: 4,
//     type: "score_released",
//     message: "25 ta test natijasi e'lon qilindi",
//     time: "1 kun oldin",
//     icon: <Award className="h-4 w-4" />,
//     color: "text-emerald-600"
//   }
// ]

// type TabType = "dashboard" | "tests" | "listening" | "reading" | "writing" | "speaking" | "students" | "reports" | "settings"

// export default function IELTSDashboard({ onLogout }: IELTSDashboardProps) {
//   const [activeTab, setActiveTab] = useState<TabType>("dashboard")
//   const [sidebarOpen, setSidebarOpen] = useState<boolean>(true)
//   const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false)
//   const [notifications, setNotifications] = useState<number>(8)
//   const [searchQuery, setSearchQuery] = useState<string>("")
//   const [currentTime, setCurrentTime] = useState<Date>(new Date())

//   // Real-time clock
//   useEffect(() => {
//     const timer = setInterval(() => setCurrentTime(new Date()), 1000)
//     return () => clearInterval(timer)
//   }, [])

//   const sidebarItems: SidebarItem[] = [
//     {
//       title: "Dashboard",
//       icon: <Home />,
//       isActive: activeTab === "dashboard",
//       onClick: () => setActiveTab("dashboard")
//     },
//     {
//       title: "IELTS Test",
//       icon: <FileText />,
//       badge: "3",
//       isActive: activeTab === "tests" || activeTab === "listening" || activeTab === "reading" || activeTab === "writing" || activeTab === "speaking",
//       onClick: () => setActiveTab("tests")
//     },
//     {
//       title: "Imtihonchilar",
//       icon: <Users />,
//       badge: "1247",
//       isActive: activeTab === "students",
//       onClick: () => setActiveTab("students")
//     },
//     {
//       title: "Test Natijalari",
//       icon: <BarChart3 />,
//       isActive: activeTab === "reports",
//       onClick: () => setActiveTab("reports")
//     },
//     {
//       title: "Sozlamalar",
//       icon: <Settings />,
//       isActive: activeTab === "settings",
//       onClick: () => setActiveTab("settings")
//     },
//   ]

//   const ieltsSubMenu: SubMenuItem[] = [
//     {
//       title: "Listening",
//       isActive: activeTab === "listening",
//       onClick: () => setActiveTab("listening")
//     },
//     {
//       title: "Reading",
//       isActive: activeTab === "reading",
//       onClick: () => setActiveTab("reading")
//     },
//     {
//       title: "Writing",
//       isActive: activeTab === "writing",
//       onClick: () => setActiveTab("writing")
//     },
//     {
//       title: "Speaking",
//       isActive: activeTab === "speaking",
//       onClick: () => setActiveTab("speaking")
//     },
//   ]

//   const getStatusBadge = (status: string): React.ReactNode => {
//     const statusMap = {
//       scheduled: "Rejalashtirilgan",
//       in_progress: "Davom etmoqda",
//       completed: "Tugallangan",
//       cancelled: "Bekor qilingan",
//       active: "Faol",
//       inactive: "Nofaol",
//       banned: "Bloklangan",
//       paused: "Pauza"
//     }

//     const colorMap = {
//       scheduled: "default",
//       in_progress: "secondary",
//       completed: "default",
//       cancelled: "destructive",
//       active: "default",
//       inactive: "secondary",
//       banned: "destructive",
//       paused: "secondary"
//     }

//     return (
//       <Badge
//         variant={colorMap[status as keyof typeof colorMap] as any}
//         className="rounded-xl text-xs"
//       >
//         {statusMap[status as keyof typeof statusMap] || status}
//       </Badge>
//     )
//   }

//   const getBandScoreColor = (score: number | null): string => {
//     if (!score) return "text-gray-500"
//     if (score >= 8) return "text-green-600"
//     if (score >= 6.5) return "text-blue-600"
//     if (score >= 5.5) return "text-yellow-600"
//     return "text-red-600"
//   }

//   const formatInitials = (name: string): string => {
//     return name.split(' ').map(n => n[0]).join('')
//   }

//   return (
//     <div className="relative min-h-screen overflow-hidden bg-background">
//       {/* Animated Background */}
//       <motion.div
//         className="absolute inset-0 -z-10 opacity-20"
//         animate={{
//           background: [
//             "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 25%, rgba(34, 197, 94, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
//             "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, rgba(34, 197, 94, 0.2) 25%, rgba(59, 130, 246, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
//             "radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.2) 25%, rgba(147, 51, 234, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
//           ],
//         }}
//         transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
//       />

//       {/* Mobile menu overlay */}
//       {mobileMenuOpen && (
//         <div
//           className="fixed inset-0 z-40 bg-black/50 md:hidden"
//           onClick={() => setMobileMenuOpen(false)}
//         />
//       )}

//       {/* Sidebar */}
//       <div className={cn(
//         "fixed inset-y-0 left-0 z-30 hidden w-72 transform border-r bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out md:block",
//         sidebarOpen ? "translate-x-0" : "-translate-x-full",
//       )}>
//         <div className="flex h-full flex-col">
//           {/* Header */}
//           <div className="p-6 border-b">
//             <div className="flex items-center gap-3 mb-4">
//               <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white shadow-lg">
//                 <Languages className="size-6" />
//               </div>
//               <div>
//                 <h2 className="font-bold text-lg">IELTS Pro</h2>
//                 <p className="text-xs text-muted-foreground">Online Test Platform</p>
//               </div>
//             </div>

//             <div className="text-xs text-muted-foreground mb-3">
//               {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
//             </div>

//             <div className="relative">
//               <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
//               <Input
//                 type="search"
//                 placeholder="Imtihonchi, test qidirish..."
//                 className="w-full rounded-2xl bg-muted/50 pl-9 pr-4 py-2"
//                 value={searchQuery}
//                 onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
//               />
//             </div>
//           </div>

//           {/* Navigation */}
//           <ScrollArea className="flex-1 px-4 py-2">
//             <div className="space-y-1">
//               {sidebarItems.map((item) => (
//                 <div key={item.title}>
//                   <button
//                     onClick={item.onClick}
//                     className={cn(
//                       "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
//                       item.isActive
//                         ? "bg-primary text-primary-foreground shadow-md"
//                         : "hover:bg-muted/70 hover:scale-[1.02]"
//                     )}
//                   >
//                     <div className="flex items-center gap-3">
//                       {item.icon}
//                       <span>{item.title}</span>
//                     </div>
//                     {item.badge && (
//                       <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
//                         {item.badge}
//                       </Badge>
//                     )}
//                   </button>
//                   {/* IELTS Test uchun yordamchi menyu */}
//                   {item.title === "IELTS Test" && (
//                     <AnimatePresence>
//                       {item.isActive && (
//                         <motion.div
//                           initial={{ height: 0, opacity: 0 }}
//                           animate={{ height: "auto", opacity: 1 }}
//                           exit={{ height: 0, opacity: 0 }}
//                           transition={{ duration: 0.3 }}
//                           className="ml-8 mt-1 space-y-1"
//                         >
//                           {ieltsSubMenu.map((subItem) => (
//                             <button
//                               key={subItem.title}
//                               onClick={subItem.onClick}
//                               className={cn(
//                                 "flex w-full items-center gap-3 rounded-xl px-4 py-2 text-sm transition-all duration-200",
//                                 subItem.isActive
//                                   ? "bg-primary/10 text-primary font-medium"
//                                   : "hover:bg-muted/50"
//                               )}
//                             >
//                               <div className="w-4 h-4" />
//                               <span>{subItem.title}</span>
//                             </button>
//                           ))}
//                         </motion.div>
//                       )}
//                     </AnimatePresence>
//                   )}
//                 </div>
//               ))}
//             </div>
//           </ScrollArea>

//           {/* Footer */}
//           <div className="border-t p-4">
//             <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-3">
//               <div className="flex items-center gap-3">
//                 <Avatar className="h-8 w-8 border-2 border-primary/20">
//                   <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Admin" />
//                   <AvatarFallback>TA</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <p className="text-sm font-medium">Test Administrator</p>
//                   <p className="text-xs text-muted-foreground">IELTS Pro</p>
//                 </div>
//               </div>
//               <Button variant="ghost" size="icon" onClick={onLogout} className="rounded-xl">
//                 <Settings className="h-4 w-4" />
//               </Button>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Main Content */}
//       <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-72" : "md:pl-0")}>
//         {/* Header */}
//         <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/80 backdrop-blur-md px-6">
//           <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
//             <Menu className="h-5 w-5" />
//           </Button>
//           <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
//             <PanelLeft className="h-5 w-5" />
//           </Button>

//           <div className="flex flex-1 items-center justify-between">
//             <div>
//               <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
//                 IELTS Pro - Admin Panel
//               </h1>
//               <p className="text-sm text-muted-foreground">IELTS online test platformasini boshqaring</p>
//             </div>

//             <div className="flex items-center gap-2">
//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button variant="ghost" size="icon" className="rounded-2xl">
//                       <RefreshCw className="h-5 w-5" />
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Ma'lumotlarni yangilash</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <TooltipProvider>
//                 <Tooltip>
//                   <TooltipTrigger asChild>
//                     <Button variant="ghost" size="icon" className="rounded-2xl relative">
//                       <Bell className="h-5 w-5" />
//                       {notifications > 0 && (
//                         <motion.span
//                           initial={{ scale: 0 }}
//                           animate={{ scale: 1 }}
//                           className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white"
//                         >
//                           {notifications}
//                         </motion.span>
//                       )}
//                     </Button>
//                   </TooltipTrigger>
//                   <TooltipContent>Bildirishnomalar</TooltipContent>
//                 </Tooltip>
//               </TooltipProvider>

//               <Avatar className="h-9 w-9 border-2 border-primary/20">
//                 <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Admin" />
//                 <AvatarFallback>TA</AvatarFallback>
//               </Avatar>
//             </div>
//           </div>
//         </header>

//         <main className="flex-1 p-6">
//           {activeTab === "dashboard" && (
//             <>
//               {/* Welcome Section */}
//               <motion.div
//                 initial={{ opacity: 0, y: 20 }}
//                 animate={{ opacity: 1, y: 0 }}
//                 transition={{ duration: 0.5 }}
//                 className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 p-8 text-white relative"
//               >
//                 <div className="relative z-10">
//                   <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
//                     <div className="space-y-4">
//                       <div className="flex items-center gap-3">
//                         <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">
//                           <Languages className="h-3 w-3 mr-1" />
//                           IELTS Pro
//                         </Badge>
//                         <Badge className="bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 rounded-xl">
//                           <Activity className="h-3 w-3 mr-1" />
//                           89 Faol Sessiya
//                         </Badge>
//                       </div>
//                       <h2 className="text-3xl font-bold">
//                         IELTS Administrator Dashboard! 📝
//                       </h2>
//                       <p className="max-w-[600px] text-white/80">
//                         Bugun 89 ta test sessiyasi davom etmoqda va 15 ta yangi imtihonchi ro'yxatdan o'tdi. Barcha testlar muvaffaqiyatli olib borilmoqda.
//                       </p>
//                       <div className="flex flex-wrap gap-3">
//                         <Button className="rounded-2xl bg-white text-purple-700 hover:bg-white/90">
//                           <Plus className="mr-2 h-4 w-4" />
//                           Yangi Test Rejalashtirish
//                         </Button>
//                         <Button variant="outline" className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10">
//                           <PlayCircle className="mr-2 h-4 w-4" />
//                           Faol Sessiyalar
//                         </Button>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </motion.div>

//               {/* Analytics Cards */}
//               <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
//                 {ieltsAnalytics.map((item, index) => (
//                   <motion.div
//                     key={item.name}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.5, delay: index * 0.1 }}
//                   >
//                     <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
//                       <CardContent className="p-6">
//                         <div className="flex items-center justify-between mb-4">
//                           <div className="p-2 rounded-xl bg-primary/10">
//                             {item.icon}
//                           </div>
//                           <Badge variant={item.trend === "up" ? "default" : "secondary"} className="rounded-xl">
//                             <TrendingUp className="h-3 w-3 mr-1" />
//                             {item.change}
//                           </Badge>
//                         </div>
//                         <div className="space-y-2">
//                           <p className="text-2xl font-bold">{item.value}</p>
//                           <p className="text-sm text-muted-foreground">{item.name}</p>
//                           <p className="text-xs text-muted-foreground">{item.description}</p>
//                           <Progress value={item.percentage} className="h-2" />
//                           <p className="text-xs text-muted-foreground">
//                             {item.percentage}% dan {item.target} maqsad
//                           </p>
//                         </div>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>

//               <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
//                 {/* Recent Activities */}
//                 <div className="lg:col-span-2">
//                   <Card className="rounded-3xl border-2">
//                     <CardHeader>
//                       <div className="flex items-center justify-between">
//                         <div>
//                           <CardTitle className="text-xl">Oxirgi Faoliyatlar</CardTitle>
//                           <CardDescription>Eng so'nggi test natijalari va faoliyatlar</CardDescription>
//                         </div>
//                         <Button variant="outline" className="rounded-2xl">
//                           <Eye className="mr-2 h-4 w-4" />
//                           Barchasini Ko'rish
//                         </Button>
//                       </div>
//                     </CardHeader>
//                     <CardContent>
//                       <div className="space-y-4">
//                         {recentActivities.map((activity, index) => (
//                           <motion.div
//                             key={activity.id}
//                             initial={{ opacity: 0, x: -20 }}
//                             animate={{ opacity: 1, x: 0 }}
//                             transition={{ duration: 0.3, delay: index * 0.1 }}
//                             className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20"
//                           >
//                             <div className={cn("p-2 rounded-xl bg-muted", activity.color)}>
//                               {activity.icon}
//                             </div>

//                             <div className="flex-1 min-w-0">
//                               <p className="text-sm">{activity.message}</p>
//                               <p className="text-xs text-muted-foreground">{activity.time}</p>
//                             </div>
//                           </motion.div>
//                         ))}
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>

//                 {/* Live Test Statistics */}
//                 <div>
//                   <Card className="rounded-3xl border-2">
//                     <CardHeader>
//                       <CardTitle className="text-xl">Jonli Test Statistikasi</CardTitle>
//                       <CardDescription>Hozirgi sessiyalar</CardDescription>
//                     </CardHeader>
//                     <CardContent className="space-y-4">
//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm text-muted-foreground">Listening davom etmoqda</span>
//                           <span className="font-semibold">23</span>
//                         </div>
//                         <Progress value={26} className="h-2" />
//                       </div>

//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm text-muted-foreground">Reading sessiyalar</span>
//                           <span className="font-semibold">31</span>
//                         </div>
//                         <Progress value={35} className="h-2" />
//                       </div>

//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm text-muted-foreground">Writing jarayonida</span>
//                           <span className="font-semibold">18</span>
//                         </div>
//                         <Progress value={20} className="h-2" />
//                       </div>

//                       <div className="space-y-3">
//                         <div className="flex justify-between items-center">
//                           <span className="text-sm text-muted-foreground">Speaking sessiyalar</span>
//                           <span className="font-semibold">17</span>
//                         </div>
//                         <Progress value={19} className="h-2" />
//                       </div>

//                       <div className="pt-4 border-t">
//                         <Button variant="secondary" className="w-full rounded-2xl">
//                           <PlayCircle className="mr-2 h-4 w-4" />
//                           Faol Sessiyalarni Ko'rish
//                         </Button>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 </div>
//               </div>

//               {/* Recent IELTS Tests */}
//               <Card className="rounded-3xl border-2">
//                 <CardHeader>
//                   <div className="flex items-center justify-between">
//                     <div>
//                       <CardTitle className="text-xl">Oxirgi IELTS Testlari</CardTitle>
//                       <CardDescription>Eng so'nggi o'tkazilgan va rejalashtirilgan testlar</CardDescription>
//                     </div>
//                     <Button variant="outline" className="rounded-2xl">
//                       <FileText className="mr-2 h-4 w-4" />
//                       Barcha Testlar
//                     </Button>
//                   </div>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                     {ieltsTests.map((test, index) => (
//                       <motion.div
//                         key={test.id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: index * 0.05 }}
//                         whileHover={{ scale: 1.02, y: -5 }}
//                       >
//                         <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300">
//                           <CardHeader className="pb-3">
//                             <div className="flex items-center gap-3 mb-2">
//                               <div className="h-12 w-12 rounded-2xl bg-primary/10 flex items-center justify-center">
//                                 <FileText className="h-6 w-6 text-primary" />
//                               </div>
//                               <div className="flex-1 min-w-0">
//                                 <CardTitle className="text-base leading-tight">{test.type}</CardTitle>
//                                 {getStatusBadge(test.status)}
//                               </div>
//                             </div>
//                           </CardHeader>
//                           <CardContent className="pb-3 space-y-3">
//                             <div className="space-y-2">
//                               <div className="flex justify-between text-sm">
//                                 <span className="text-muted-foreground">Test Center:</span>
//                                 <span className="font-medium text-xs">{test.testCenter}</span>
//                               </div>
//                               <div className="flex justify-between text-sm">
//                                 <span className="text-muted-foreground">Sana va Vaqt:</span>
//                                 <span className="font-medium text-xs">{test.date} - {test.time}</span>
//                               </div>
//                               <div className="flex justify-between text-sm">
//                                 <span className="text-muted-foreground">Examiner:</span>
//                                 <span className="font-medium text-xs">{test.examiner}</span>
//                               </div>
//                             </div>

//                             {test.overallBand && (
//                               <div className="pt-2 border-t">
//                                 <div className="text-center">
//                                   <p className={cn("text-2xl font-bold", getBandScoreColor(test.overallBand))}>
//                                     {test.overallBand}
//                                   </p>
//                                   <p className="text-xs text-muted-foreground">Overall Band</p>
//                                 </div>
//                               </div>
//                             )}

//                             {test.sections.listening && (
//                               <div className="grid grid-cols-4 gap-2 text-xs">
//                                 <div className="text-center">
//                                   <p className={cn("font-bold", getBandScoreColor(test.sections.listening))}>
//                                     {test.sections.listening || "-"}
//                                   </p>
//                                   <p className="text-muted-foreground">L</p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className={cn("font-bold", getBandScoreColor(test.sections.reading))}>
//                                     {test.sections.reading || "-"}
//                                   </p>
//                                   <p className="text-muted-foreground">R</p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className={cn("font-bold", getBandScoreColor(test.sections.writing))}>
//                                     {test.sections.writing || "-"}
//                                   </p>
//                                   <p className="text-muted-foreground">W</p>
//                                 </div>
//                                 <div className="text-center">
//                                   <p className={cn("font-bold", getBandScoreColor(test.sections.speaking))}>
//                                     {test.sections.speaking || "-"}
//                                   </p>
//                                   <p className="text-muted-foreground">S</p>
//                                 </div>
//                               </div>
//                             )}
//                           </CardContent>
//                           <CardFooter className="flex gap-2 pt-3">
//                             <Button variant="secondary" className="flex-1 rounded-2xl text-xs">
//                               <Eye className="mr-1 h-3 w-3" />
//                               Batafsil
//                             </Button>
//                             <Button variant="outline" size="icon" className="rounded-2xl">
//                               <MoreHorizontal className="h-3 w-3" />
//                             </Button>
//                           </CardFooter>
//                         </Card>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             </>
//           )}

//           {activeTab === "tests" && (
//             <div className="space-y-6">
//               {/* Tests Header */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold">IELTS Testlari</h2>
//                   <p className="text-muted-foreground">Barcha IELTS testlarini boshqaring va nazorat qiling</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline" className="rounded-2xl">
//                     <Filter className="mr-2 h-4 w-4" />
//                     Filtr
//                   </Button>
//                   <Button className="rounded-2xl">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Yangi Test Rejalashtirish
//                   </Button>
//                 </div>
//               </div>

//               {/* Test Type Tabs */}
//               <Tabs defaultValue="all" className="w-full">
//                 <TabsList className="grid w-full grid-cols-4 rounded-2xl">
//                   <TabsTrigger value="all" className="rounded-xl">Barchasi</TabsTrigger>
//                   <TabsTrigger value="academic" className="rounded-xl">Academic</TabsTrigger>
//                   <TabsTrigger value="general" className="rounded-xl">General Training</TabsTrigger>
//                   <TabsTrigger value="scheduled" className="rounded-xl">Rejalashtirilgan</TabsTrigger>
//                 </TabsList>

//                 <TabsContent value="all" className="space-y-4">
//                   <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
//                     {ieltsTests.map((test, index) => (
//                       <motion.div
//                         key={test.id}
//                         initial={{ opacity: 0, y: 20 }}
//                         animate={{ opacity: 1, y: 0 }}
//                         transition={{ duration: 0.3, delay: index * 0.1 }}
//                       >
//                         <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
//                           <CardHeader>
//                             <div className="flex items-start justify-between">
//                               <div className="flex items-center gap-3">
//                                 <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
//                                   <FileText className="h-8 w-8 text-primary" />
//                                 </div>
//                                 <div>
//                                   <CardTitle className="text-lg">{test.type}</CardTitle>
//                                   {getStatusBadge(test.status)}
//                                 </div>
//                               </div>
//                             </div>
//                           </CardHeader>

//                           <CardContent className="space-y-4">
//                             <div className="space-y-2">
//                               <div className="flex justify-between text-sm">
//                                 <span className="text-muted-foreground">Test Center</span>
//                                 <span className="font-medium">{test.testCenter}</span>
//                               </div>
//                               <div className="flex justify-between text-sm">
//                                 <span className="text-muted-foreground">Sana</span>
//                                 <span className="font-medium">{test.date}</span>
//                               </div>
//                               <div className="flex justify-between text-sm">
//                                 <span className="text-muted-foreground">Vaqt</span>
//                                 <span className="font-medium">{test.time}</span>
//                               </div>
//                               <div className="flex justify-between text-sm">
//                                 <span className="text-muted-foreground">Davomiyligi</span>
//                                 <span className="font-medium">{test.duration}</span>
//                               </div>
//                             </div>

//                             {test.overallBand && (
//                               <div className="pt-4 border-t">
//                                 <div className="text-center mb-3">
//                                   <p className={cn("text-3xl font-bold", getBandScoreColor(test.overallBand))}>
//                                     {test.overallBand}
//                                   </p>
//                                   <p className="text-sm text-muted-foreground">Overall Band Score</p>
//                                 </div>

//                                 <div className="grid grid-cols-4 gap-4 text-center">
//                                   <div className="space-y-1">
//                                     <div className="p-2 rounded-xl bg-blue-100 dark:bg-blue-900/30">
//                                       <Headphones className="h-4 w-4 mx-auto text-blue-600" />
//                                     </div>
//                                     <p className={cn("text-sm font-bold", getBandScoreColor(test.sections.listening))}>
//                                       {test.sections.listening || "-"}
//                                     </p>
//                                     <p className="text-xs text-muted-foreground">Listening</p>
//                                   </div>
//                                   <div className="space-y-1">
//                                     <div className="p-2 rounded-xl bg-green-100 dark:bg-green-900/30">
//                                       <BookOpen className="h-4 w-4 mx-auto text-green-600" />
//                                     </div>
//                                     <p className={cn("text-sm font-bold", getBandScoreColor(test.sections.reading))}>
//                                       {test.sections.reading || "-"}
//                                     </p>
//                                     <p className="text-xs text-muted-foreground">Reading</p>
//                                   </div>
//                                   <div className="space-y-1">
//                                     <div className="p-2 rounded-xl bg-purple-100 dark:bg-purple-900/30">
//                                       <PenTool className="h-4 w-4 mx-auto text-purple-600" />
//                                     </div>
//                                     <p className={cn("text-sm font-bold", getBandScoreColor(test.sections.writing))}>
//                                       {test.sections.writing || "-"}
//                                     </p>
//                                     <p className="text-xs text-muted-foreground">Writing</p>
//                                   </div>
//                                   <div className="space-y-1">
//                                     <div className="p-2 rounded-xl bg-orange-100 dark:bg-orange-900/30">
//                                       <Mic className="h-4 w-4 mx-auto text-orange-600" />
//                                     </div>
//                                     <p className={cn("text-sm font-bold", getBandScoreColor(test.sections.speaking))}>
//                                       {test.sections.speaking || "-"}
//                                     </p>
//                                     <p className="text-xs text-muted-foreground">Speaking</p>
//                                   </div>
//                                 </div>
//                               </div>
//                             )}
//                           </CardContent>

//                           <CardFooter className="flex gap-2">
//                             <Button variant="secondary" className="flex-1 rounded-2xl">
//                               <Eye className="mr-2 h-4 w-4" />
//                               Batafsil
//                             </Button>
//                             <Button variant="outline" className="flex-1 rounded-2xl">
//                               <Edit className="mr-2 h-4 w-4" />
//                               Tahrirlash
//                             </Button>
//                           </CardFooter>
//                         </Card>
//                       </motion.div>
//                     ))}
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </div>
//           )}

//           {activeTab === "listening" && (
//             <div className="space-y-6">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold">Listening Testlari</h2>
//                   <p className="text-muted-foreground">IELTS Listening bo'limiga oid testlar va ma'lumotlar</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline" className="rounded-2xl">
//                     <Filter className="mr-2 h-4 w-4" />
//                     Filtr
//                   </Button>
//                   <Button className="rounded-2xl">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Yangi Listening Test
//                   </Button>
//                 </div>
//               </div>
//               <Card className="rounded-3xl border-2">
//                 <CardHeader>
//                   <CardTitle>Listening Testlar Ro'yxati</CardTitle>
//                   <CardDescription>IELTS Listening testlari va ularning statistikasi</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground">Hozircha Listening testlari uchun ma'lumotlar mavjud emas. Yangi test qo'shish uchun yuqoridagi tugmani bosing.</p>
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {activeTab === "reading" && (
//             <div className="space-y-6">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold">Reading Testlari</h2>
//                   <p className="text-muted-foreground">IELTS Reading bo'limiga oid testlar va ma'lumotlar</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline" className="rounded-2xl">
//                     <Filter className="mr-2 h-4 w-4" />
//                     Filtr
//                   </Button>
//                   <Button className="rounded-2xl">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Yangi Reading Test
//                   </Button>
//                 </div>
//               </div>
//               <Card className="rounded-3xl border-2">
//                 <CardHeader>
//                   <CardTitle>Reading Testlar Ro'yxati</CardTitle>
//                   <CardDescription>IELTS Reading testlari va ularning statistikasi</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground">Hozircha Reading testlari uchun ma'lumotlar mavjud emas. Yangi test qo'shish uchun yuqoridagi tugmani bosing.</p>
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {activeTab === "writing" && (
//             <div className="space-y-6">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold">Writing Testlari</h2>
//                   <p className="text-muted-foreground">IELTS Writing bo'limiga oid testlar va ma'lumotlar</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline" className="rounded-2xl">
//                     <Filter className="mr-2 h-4 w-4" />
//                     Filtr
//                   </Button>
//                   <Button className="rounded-2xl">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Yangi Writing Test
//                   </Button>
//                 </div>
//               </div>
//               <Card className="rounded-3xl border-2">
//                 <CardHeader>
//                   <CardTitle>Writing Testlar Ro'yxati</CardTitle>
//                   <CardDescription>IELTS Writing testlari va ularning statistikasi</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground">Hozircha Writing testlari uchun ma'lumotlar mavjud emas. Yangi test qo'shish uchun yuqoridagi tugmani bosing.</p>
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {activeTab === "speaking" && (
//             <div className="space-y-6">
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold">Speaking Testlari</h2>
//                   <p className="text-muted-foreground">IELTS Speaking bo'limiga oid testlar va ma'lumotlar</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline" className="rounded-2xl">
//                     <Filter className="mr-2 h-4 w-4" />
//                     Filtr
//                   </Button>
//                   <Button className="rounded-2xl">
//                     <Plus className="mr-2 h-4 w-4" />
//                     Yangi Speaking Test
//                   </Button>
//                 </div>
//               </div>
//               <Card className="rounded-3xl border-2">
//                 <CardHeader>
//                   <CardTitle>Speaking Testlar Ro'yxati</CardTitle>
//                   <CardDescription>IELTS Speaking testlari va ularning statistikasi</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <p className="text-muted-foreground">Hozircha Speaking testlari uchun ma'lumotlar mavjud emas. Yangi test qo'shish uchun yuqoridagi tugmani bosing.</p>
//                 </CardContent>
//               </Card>
//             </div>
//           )}

//           {activeTab === "students" && (
//             <div className="space-y-6">
//               {/* Students Header */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold">Imtihonchilar</h2>
//                   <p className="text-muted-foreground">Barcha IELTS imtihonchilari ro'yxati va ularning natijalari</p>
//                 </div>
//                 <div className="flex gap-2">
//                   <Button variant="outline" className="rounded-2xl">
//                     <Filter className="mr-2 h-4 w-4" />
//                     Filtr
//                   </Button>
//                   <Button variant="outline" className="rounded-2xl">
//                     <DownloadIcon className="mr-2 h-4 w-4" />
//                     Export
//                   </Button>
//                   <Button className="rounded-2xl">
//                     <UserPlus className="mr-2 h-4 w-4" />
//                     Yangi Ro'yxat
//                   </Button>
//                 </div>
//               </div>

//               {/* Students Grid */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//                 {students.map((student, index) => (
//                   <motion.div
//                     key={student.id}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                   >
//                     <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
//                       <CardHeader className="pb-3">
//                         <div className="flex items-center gap-3">
//                           <Avatar className="h-12 w-12 border-2 border-primary/20">
//                             <AvatarImage src={student.avatar} alt={student.name} />
//                             <AvatarFallback>{formatInitials(student.name)}</AvatarFallback>
//                           </Avatar>
//                           <div className="flex-1 min-w-0">
//                             <CardTitle className="text-base leading-tight truncate">{student.name}</CardTitle>
//                             <div className="flex items-center gap-2">
//                               <Flag className="h-3 w-3" />
//                               <span className="text-xs text-muted-foreground">{student.country}</span>
//                             </div>
//                           </div>
//                         </div>
//                         <div className="flex justify-between items-center">
//                           {getStatusBadge(student.status)}
//                           <Badge variant="outline" className="rounded-xl text-xs">
//                             {student.purpose}
//                           </Badge>
//                         </div>
//                       </CardHeader>

//                       <CardContent className="space-y-3">
//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                           <div>
//                             <p className="text-muted-foreground">Maqsad Band</p>
//                             <p className={cn("font-bold text-lg", getBandScoreColor(student.targetBand))}>
//                               {student.targetBand}
//                             </p>
//                           </div>
//                           <div>
//                             <p className="text-muted-foreground">Eng Yaxshi</p>
//                             <p className={cn("font-bold text-lg", getBandScoreColor(student.bestScore))}>
//                               {student.bestScore}
//                             </p>
//                           </div>
//                         </div>

//                         <div className="space-y-1">
//                           <p className="text-sm text-muted-foreground">Hozirgi Daraja</p>
//                           <p className="font-medium text-sm">{student.currentLevel}</p>
//                         </div>

//                         <div className="grid grid-cols-2 gap-4 text-sm">
//                           <div>
//                             <p className="text-muted-foreground">Testlar</p>
//                             <p className="font-semibold">{student.testsCompleted}</p>
//                           </div>
//                           <div>
//                             <p className="text-muted-foreground">Oxirgi faollik</p>
//                             <p className="font-medium text-xs">{student.lastActivity}</p>
//                           </div>
//                         </div>
//                       </CardContent>

//                       <CardFooter className="flex gap-2 pt-3">
//                         <Button variant="secondary" className="flex-1 rounded-2xl text-xs">
//                           <Eye className="mr-1 h-3 w-3" />
//                           Profil
//                         </Button>
//                         <Button variant="outline" size="icon" className="rounded-2xl">
//                           <Mail className="h-3 w-3" />
//                         </Button>
//                         <Button variant="outline" size="icon" className="rounded-2xl">
//                           <MoreHorizontal className="h-3 w-3" />
//                         </Button>
//                       </CardFooter>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === "reports" && (
//             <div className="space-y-6">
//               {/* Reports Header */}
//               <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                   <h2 className="text-2xl font-bold">Test Natijalari</h2>
//                   <p className="text-muted-foreground">IELTS test natijalari va statistik ma'lumotlar</p>
//                 </div>
//                 <Button className="rounded-2xl">
//                   <DownloadIcon className="mr-2 h-4 w-4" />
//                   Hisobot Eksport
//                 </Button>
//               </div>

//               {/* Report Cards */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                 {[
//                   { title: "Band Score Tahlili", desc: "Barcha band scorlar statistikasi", icon: <Target className="h-6 w-6" />, color: "bg-blue-500" },
//                   { title: "Test Samaradorligi", desc: "Tugallash va muvaffaqiyat ko'rsatkichi", icon: <TrendingUp className="h-6 w-6" />, color: "bg-green-500" },
//                   { title: "Sectionlar Tahlili", desc: "L/R/W/S bo'yicha batafsil", icon: <BarChart3 className="h-6 w-6" />, color: "bg-purple-500" },
//                   { title: "Imtihonchilar Hisoboti", desc: "Davomad va rivojlanish", icon: <Users className="h-6 w-6" />, color: "bg-orange-500" },
//                   { title: "Test Markazlari", desc: "Markazlar bo'yicha statistika", icon: <Building className="h-6 w-6" />, color: "bg-emerald-500" },
//                   { title: "Vaqt Tahlili", desc: "Test davomiyligi va samaradorlik", icon: <Clock className="h-6 w-6" />, color: "bg-pink-500" },
//                 ].map((report, index) => (
//                   <motion.div
//                     key={index}
//                     initial={{ opacity: 0, y: 20 }}
//                     animate={{ opacity: 1, y: 0 }}
//                     transition={{ duration: 0.3, delay: index * 0.1 }}
//                   >
//                     <Card className="rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer">
//                       <CardContent className="p-6">
//                         <div className="flex items-center gap-4 mb-4">
//                           <div className={cn("p-3 rounded-2xl text-white", report.color)}>
//                             {report.icon}
//                           </div>
//                           <div>
//                             <h3 className="font-semibold">{report.title}</h3>
//                             <p className="text-sm text-muted-foreground">{report.desc}</p>
//                           </div>
//                         </div>
//                         <Button variant="secondary" className="w-full rounded-2xl">
//                           <Eye className="mr-2 h-4 w-4" />
//                           Hisobotni Ko'rish
//                         </Button>
//                       </CardContent>
//                     </Card>
//                   </motion.div>
//                 ))}
//               </div>

//               {/* Quick Stats */}
//               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
//                 {[
//                   { title: "O'rtacha Overall Band", value: "6.5", change: "+0.3", trend: "up" },
//                   { title: "Eng Ko'p Ball", value: "8.5", change: "Academic", trend: "up" },
//                   { title: "Tugallash Foizi", value: "94%", change: "+2%", trend: "up" },
//                   { title: "Qayta Test Foizi", value: "23%", change: "-5%", trend: "down" },
//                 ].map((stat, index) => (
//                   <Card key={index} className="rounded-3xl border-2">
//                     <CardContent className="p-6 text-center">
//                       <h3 className="text-2xl font-bold mb-2">{stat.value}</h3>
//                       <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
//                       <Badge variant={stat.trend === "up" ? "default" : "secondary"} className="rounded-xl text-xs">
//                         {stat.trend === "up" ? <TrendingUp className="h-3 w-3 mr-1" /> : <TrendingDown className="h-3 w-3 mr-1" />}
//                         {stat.change}
//                       </Badge>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           )}

//           {activeTab === "settings" && (
//             <div className="space-y-6">
//               {/* Settings Header */}
//               <div className="text-center space-y-4">
//                 <h2 className="text-2xl font-bold">Tizim Sozlamalari</h2>
//                 <p className="text-muted-foreground">IELTS platformasi va profil sozlamalarini boshqaring</p>

//                 <Card className="max-w-md mx-auto rounded-3xl border-2">
//                   <CardContent className="p-8 text-center space-y-4">
//                     <Avatar className="mx-auto h-24 w-24 border-4 border-primary/20">
//                       <AvatarImage src="/placeholder.svg?height=96&width=96" alt="Admin" />
//                       <AvatarFallback className="text-xl">TA</AvatarFallback>
//                     </Avatar>
//                     <div>
//                       <h3 className="font-semibold text-lg">Test Administrator</h3>
//                       <p className="text-sm text-muted-foreground">IELTS Pro Platform</p>
//                       <p className="text-sm text-muted-foreground">admin@ieltspro.uz</p>
//                     </div>
//                     <div className="space-y-3 pt-4">
//                       <Button variant="outline" className="w-full rounded-2xl">
//                         <Edit className="mr-2 h-4 w-4" />
//                         Profilni Tahrirlash
//                       </Button>
//                       <Button variant="outline" className="w-full rounded-2xl">
//                         <Shield className="mr-2 h-4 w-4" />
//                         Xavfsizlik
//                       </Button>
//                       <Button variant="outline" className="w-full rounded-2xl">
//                         <Settings className="mr-2 h-4 w-4" />
//                         Test Sozlamalari
//                       </Button>
//                       <Button
//                         variant="outline"
//                         className="w-full rounded-2xl text-red-600 hover:text-red-700 hover:bg-red-50"
//                         onClick={onLogout}
//                       >
//                         <X className="mr-2 h-4 w-4" />
//                         Chiqish
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* Platform Settings */}
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                 <Card className="rounded-3xl border-2">
//                   <CardHeader>
//                     <CardTitle className="text-xl">Test Sozlamalari</CardTitle>
//                     <CardDescription>IELTS test parametrlarini sozlang</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <p className="text-sm text-muted-foreground">Test Davomiyligi</p>
//                       <Button variant="secondary" className="w-full rounded-2xl">
//                         <Timer className="mr-2 h-4 w-4" />
//                         Vaqt Sozlamalari
//                       </Button>
//                     </div>
//                     <div className="space-y-2">
//                       <p className="text-sm text-muted-foreground">Baholash Mezoni</p>
//                       <Button variant="secondary" className="w-full rounded-2xl">
//                         <Target className="mr-2 h-4 w-4" />
//                         Band Score Sozlash
//                       </Button>
//                     </div>
//                     <div className="space-y-2">
//                       <p className="text-sm text-muted-foreground">Test Markazlari</p>
//                       <Button variant="secondary" className="w-full rounded-2xl">
//                         <Building className="mr-2 h-4 w-4" />
//                         Markazlarni Boshqarish
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>

//                 <Card className="rounded-3xl border-2">
//                   <CardHeader>
//                     <CardTitle className="text-xl">Tizim Sozlamalari</CardTitle>
//                     <CardDescription>Umumiy platforma sozlamalarini boshqaring</CardDescription>
//                   </CardHeader>
//                   <CardContent className="space-y-4">
//                     <div className="space-y-2">
//                       <p className="text-sm text-muted-foreground">Bildirishnoma Sozlamalari</p>
//                       <Button variant="secondary" className="w-full rounded-2xl">
//                         <Bell className="mr-2 h-4 w-4" />
//                         Bildirishnomalar
//                       </Button>
//                     </div>
//                     <div className="space-y-2">
//                       <p className="text-sm text-muted-foreground">Ma'lumotlar Zahirasi</p>
//                       <Button variant="secondary" className="w-full rounded-2xl">
//                         <Cloud className="mr-2 h-4 w-4" />
//                         Backup Yaratish
//                       </Button>
//                     </div>
//                     <div className="space-y-2">
//                       <p className="text-sm text-muted-foreground">Proctoring Sozlamalari</p>
//                       <Button variant="secondary" className="w-full rounded-2xl">
//                         <Eye className="mr-2 h-4 w-4" />
//                         AI Proctor Sozlash
//                       </Button>
//                     </div>
//                   </CardContent>
//                 </Card>
//               </div>

//               {/* System Information */}
//               <Card className="rounded-3xl border-2">
//                 <CardHeader>
//                   <CardTitle className="text-xl">Tizim Ma'lumotlari</CardTitle>
//                   <CardDescription>Platform holati va statistika</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                   <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//                     <div className="text-center space-y-2">
//                       <div className="mx-auto w-12 h-12 rounded-2xl bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
//                         <Activity className="h-6 w-6 text-green-600" />
//                       </div>
//                       <h3 className="text-xl font-bold text-green-600">99.9%</h3>
//                       <p className="text-sm text-muted-foreground">Uptime</p>
//                     </div>
//                     <div className="text-center space-y-2">
//                       <div className="mx-auto w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
//                         <Users className="h-6 w-6 text-blue-600" />
//                       </div>
//                       <h3 className="text-xl font-bold text-blue-600">1,247</h3>
//                       <p className="text-sm text-muted-foreground">Jami Foydalanuvchilar</p>
//                     </div>
//                     <div className="text-center space-y-2">
//                       <div className="mx-auto w-12 h-12 rounded-2xl bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
//                         <FileText className="h-6 w-6 text-purple-600" />
//                       </div>
//                       <h3 className="text-xl font-bold text-purple-600">3,247</h3>
//                       <p className="text-sm text-muted-foreground">Tugallangan Testlar</p>
//                     </div>
//                   </div>
//                 </CardContent>
//               </Card>
//             </div>
//           )}
//         </main>
//       </div>
//     </div>
//   )
// }