"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  Award,
  Bell,
  BookOpen,
  Bookmark,
  Brush,
  Camera,
  ChevronDown,
  Cloud,
  Code,
  Crown,
  Download,
  FileText,
  Grid,
  Heart,
  Home,
  ImageIcon,
  Layers,
  LayoutGrid,
  Lightbulb,
  Menu,
  MessageSquare,
  Palette,
  PanelLeft,
  Play,
  Plus,
  Search,
  Settings,
  Share2,
  Sparkles,
  Star,
  Trash,
  TrendingUp,
  Users,
  Video,
  Wand2,
  Clock,
  Eye,
  Archive,
  ArrowUpDown,
  MoreHorizontal,
  Type,
  CuboidIcon,
  X,
  Zap,
  BarChart3,
  Calendar,
  Target,
  RefreshCw,
  Rocket,
  CheckCircle,
  Timer,
  Activity,
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

// Yangilangan sample data
const apps = [
  {
    name: "PixelMaster Pro",
    icon: <ImageIcon className="text-violet-500" />,
    description: "Advanced image editing with AI enhancement",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
    rating: 4.9,
    downloads: "50K+",
    version: "2.1.0"
  },
  {
    name: "VectorCraft",
    icon: <Brush className="text-orange-500" />,
    description: "Professional vector graphics with smart tools",
    category: "Creative",
    recent: true,
    new: false,
    progress: 100,
    rating: 4.8,
    downloads: "35K+",
    version: "1.8.5"
  },
  {
    name: "VideoStudio Elite",
    icon: <Video className="text-pink-500" />,
    description: "4K video editing with motion tracking",
    category: "Video",
    recent: true,
    new: false,
    progress: 100,
    rating: 4.7,
    downloads: "42K+",
    version: "3.2.1"
  },
  {
    name: "MotionFX Pro",
    icon: <Sparkles className="text-blue-500" />,
    description: "Advanced VFX and particle systems",
    category: "Video",
    recent: false,
    new: false,
    progress: 100,
    rating: 4.6,
    downloads: "28K+",
    version: "2.0.3"
  },
  {
    name: "PageDesigner",
    icon: <Layers className="text-red-500" />,
    description: "Responsive web page design tool",
    category: "Creative",
    recent: false,
    new: false,
    progress: 100,
    rating: 4.5,
    downloads: "33K+",
    version: "1.9.2"
  },
  {
    name: "UXFlow Studio",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    description: "Complete UX/UI design workflow",
    category: "Design",
    recent: false,
    new: true,
    progress: 85,
    rating: 4.8,
    downloads: "15K+",
    version: "1.0.0-beta"
  },
  {
    name: "PhotoLab Pro",
    icon: <Camera className="text-teal-500" />,
    description: "RAW processing with AI filters",
    category: "Photography",
    recent: false,
    new: false,
    progress: 100,
    rating: 4.7,
    downloads: "67K+",
    version: "4.1.2"
  },
  {
    name: "DocMaster Pro",
    icon: <FileText className="text-red-600" />,
    description: "Advanced document design platform",
    category: "Document",
    recent: false,
    new: false,
    progress: 100,
    rating: 4.4,
    downloads: "89K+",
    version: "3.5.1"
  },
  {
    name: "WebCanvas 2.0",
    icon: <Code className="text-emerald-500" />,
    description: "No-code web development platform",
    category: "Web",
    recent: false,
    new: true,
    progress: 70,
    rating: 4.9,
    downloads: "12K+",
    version: "2.0.0-alpha"
  },
  {
    name: "3DStudio Max",
    icon: <CuboidIcon className="text-indigo-500" />,
    description: "Professional 3D modeling suite",
    category: "3D",
    recent: false,
    new: true,
    progress: 60,
    rating: 4.8,
    downloads: "21K+",
    version: "1.5.0-beta"
  },
]

// Yangilangan recent files
const recentFiles = [
  {
    name: "Brand Redesign 2025.pxm",
    app: "PixelMaster Pro",
    modified: "15 minutes ago",
    icon: <ImageIcon className="text-violet-500" />,
    shared: true,
    size: "28.3 MB",
    collaborators: 5,
    status: "Active",
    thumbnail: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Mobile App UI.vec",
    app: "VectorCraft",
    modified: "1 hour ago",
    icon: <Brush className="text-orange-500" />,
    shared: true,
    size: "12.7 MB",
    collaborators: 3,
    status: "Review",
    thumbnail: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Product Demo Video.vid",
    app: "VideoStudio Elite",
    modified: "2 hours ago",
    icon: <Video className="text-pink-500" />,
    shared: false,
    size: "2.1 GB",
    collaborators: 0,
    status: "Rendering",
    thumbnail: "/placeholder.svg?height=40&width=40"
  },
  {
    name: "Landing Page Design.uxf",
    app: "UXFlow Studio",
    modified: "Yesterday",
    icon: <LayoutGrid className="text-fuchsia-500" />,
    shared: true,
    size: "24.5 MB",
    collaborators: 7,
    status: "Completed",
    thumbnail: "/placeholder.svg?height=40&width=40"
  },
]

// Analytics data
const analyticsData = [
  { name: "Projects", value: 24, change: +12, trend: "up", icon: <Layers className="h-4 w-4" /> },
  { name: "Files", value: 189, change: +23, trend: "up", icon: <FileText className="h-4 w-4" /> },
  { name: "Storage", value: "12.4 GB", change: "2.1 GB", trend: "up", icon: <Cloud className="h-4 w-4" /> },
  { name: "Team", value: 8, change: +2, trend: "up", icon: <Users className="h-4 w-4" /> },
]

// Activity feed
const activityFeed = [
  {
    id: 1,
    user: "Sarah Chen",
    action: "shared",
    target: "Brand Guidelines",
    time: "5 min ago",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "share"
  },
  {
    id: 2,
    user: "Alex Morgan",
    action: "completed",
    target: "Logo Animation",
    time: "1 hour ago",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "complete"
  },
  {
    id: 3,
    user: "Team Design",
    action: "started",
    target: "Website Redesign",
    time: "2 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "start"
  },
  {
    id: 4,
    user: "Michael Rodriguez",
    action: "uploaded",
    target: "Product Photos",
    time: "3 hours ago",
    avatar: "/placeholder.svg?height=32&width=32",
    type: "upload"
  },
]

export function DesignaliCreative() {
  const [progress, setProgress] = useState(0)
  const [notifications, setNotifications] = useState(7)
  const [activeTab, setActiveTab] = useState("home")
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentTime, setCurrentTime] = useState(new Date())

  // Real-time clock
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  // Simulate progress loading
  useEffect(() => {
    const timer = setTimeout(() => setProgress(100), 1000)
    return () => clearTimeout(timer)
  }, [])

  // Enhanced sidebar items
  const sidebarItems = [
    {
      title: "Dashboard",
      icon: <Home />,
      isActive: true,
      badge: null,
    },
    {
      title: "Apps",
      icon: <Grid />,
      badge: "3",
      items: [
        { title: "All Apps", url: "#" },
        { title: "Recent", url: "#" },
        { title: "Updates", url: "#", badge: "3" },
        { title: "Installed", url: "#" },
      ],
    },
    {
      title: "Files",
      icon: <FileText />,
      badge: "12",
      items: [
        { title: "Recent", url: "#" },
        { title: "Shared with me", url: "#", badge: "5" },
        { title: "Favorites", url: "#" },
        { title: "Trash", url: "#" },
      ],
    },
    {
      title: "Projects",
      icon: <Layers />,
      badge: "4",
      items: [
        { title: "Active Projects", url: "#", badge: "4" },
        { title: "Archived", url: "#" },
        { title: "Templates", url: "#" },
      ],
    },
    {
      title: "Analytics",
      icon: <BarChart3 />,
      badge: null,
    },
    {
      title: "Learn",
      icon: <BookOpen />,
      items: [
        { title: "Tutorials", url: "#" },
        { title: "Courses", url: "#" },
        { title: "Webinars", url: "#" },
        { title: "Resources", url: "#" },
      ],
    },
    {
      title: "Community",
      icon: <Users />,
      items: [
        { title: "Explore", url: "#" },
        { title: "Following", url: "#" },
        { title: "Challenges", url: "#" },
        { title: "Events", url: "#" },
      ],
    },
  ]

  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({})

  const toggleExpanded = (title: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [title]: !prev[title],
    }))
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-background">
      {/* Enhanced animated gradient background */}
      <motion.div
        className="absolute inset-0 -z-10 opacity-30"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(120, 41, 190, 0.4) 0%, rgba(53, 71, 125, 0.3) 25%, rgba(233, 30, 99, 0.2) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 80% 20%, rgba(233, 30, 99, 0.4) 0%, rgba(81, 45, 168, 0.3) 25%, rgba(76, 175, 80, 0.2) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 40% 40%, rgba(76, 175, 80, 0.4) 0%, rgba(32, 119, 188, 0.3) 25%, rgba(120, 41, 190, 0.2) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 20% 80%, rgba(120, 41, 190, 0.4) 0%, rgba(53, 71, 125, 0.3) 25%, rgba(233, 30, 99, 0.2) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{ duration: 25, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Enhanced Sidebar */}
      <div className={cn(
        "fixed inset-y-0 left-0 z-30 hidden w-72 transform border-r bg-background/95 backdrop-blur-sm transition-transform duration-300 ease-in-out md:block",
        sidebarOpen ? "translate-x-0" : "-translate-x-full",
      )}>
        <div className="flex h-full flex-col">
          {/* Enhanced Header */}
          <div className="p-6 border-b">
            <div className="flex items-center gap-3 mb-4">
              <div className="flex aspect-square size-12 items-center justify-center rounded-2xl bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-600 text-white shadow-lg">
                <Wand2 className="size-6" />
              </div>
              <div>
                <h2 className="font-bold text-lg">Designali</h2>
                <p className="text-xs text-muted-foreground">Creative Suite Pro</p>
              </div>
            </div>
            
            {/* Time display */}
            <div className="text-xs text-muted-foreground mb-3">
              {currentTime.toLocaleTimeString()} • {currentTime.toLocaleDateString()}
            </div>

            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input 
                type="search" 
                placeholder="Search everything..." 
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
                <div key={item.title} className="mb-1">
                  <button
                    className={cn(
                      "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-sm font-medium transition-all duration-200",
                      item.isActive 
                        ? "bg-primary text-primary-foreground shadow-md" 
                        : "hover:bg-muted/70 hover:scale-[1.02]",
                    )}
                    onClick={() => item.items && toggleExpanded(item.title)}
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {item.badge && (
                        <Badge variant="secondary" className="rounded-full px-2 py-0.5 text-xs">
                          {item.badge}
                        </Badge>
                      )}
                      {item.items && (
                        <ChevronDown
                          className={cn(
                            "h-4 w-4 transition-transform duration-200",
                            expandedItems[item.title] ? "rotate-180" : "",
                          )}
                        />
                      )}
                    </div>
                  </button>

                  <AnimatePresence>
                    {item.items && expandedItems[item.title] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-1 ml-6 space-y-1 border-l-2 border-muted pl-4">
                          {item.items.map((subItem) => (
                            <a
                              key={subItem.title}
                              href={subItem.url}
                              className="flex items-center justify-between rounded-xl px-3 py-2 text-sm hover:bg-muted/50 transition-colors"
                            >
                              {subItem.title}
                              {subItem.badge && (
                                <Badge variant="outline" className="rounded-full px-2 py-0.5 text-xs">
                                  {subItem.badge}
                                </Badge>
                              )}
                            </a>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </ScrollArea>

          {/* Enhanced Footer */}
          <div className="border-t p-4">
            <div className="space-y-3">
              <Button variant="ghost" className="w-full justify-start gap-3 rounded-2xl">
                <Settings className="h-5 w-5" />
                <span>Settings</span>
              </Button>
              
              {/* User Profile */}
              <div className="flex items-center justify-between rounded-2xl bg-muted/50 p-3">
                <div className="flex items-center gap-3">
                  <Avatar className="h-8 w-8 border-2 border-primary/20">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">John Doe</p>
                    <p className="text-xs text-muted-foreground">Pro Member</p>
                  </div>
                </div>
                <Badge className="bg-gradient-to-r from-amber-500 to-orange-500 text-white">
                  Pro
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className={cn("min-h-screen transition-all duration-300 ease-in-out", sidebarOpen ? "md:pl-72" : "md:pl-0")}>
        {/* Enhanced Header */}
        <header className="sticky top-0 z-10 flex h-16 items-center gap-3 border-b bg-background/80 backdrop-blur-md px-6">
          <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="hidden md:flex" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <PanelLeft className="h-5 w-5" />
          </Button>
          
          <div className="flex flex-1 items-center justify-between">
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Creative Dashboard
              </h1>
              <p className="text-sm text-muted-foreground">Welcome back, John!</p>
            </div>
            
            {/* Enhanced header actions */}
            <div className="flex items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <RefreshCw className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Sync</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <Cloud className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Cloud Storage</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button variant="ghost" size="icon" className="rounded-2xl">
                      <MessageSquare className="h-5 w-5" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>Messages</TooltipContent>
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
                  <TooltipContent>Notifications</TooltipContent>
                </Tooltip>
              </TooltipProvider>

              <Avatar className="h-9 w-9 border-2 border-primary/20">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        <main className="flex-1 p-6">
          {/* Welcome Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8 overflow-hidden rounded-3xl bg-gradient-to-r from-violet-600 via-indigo-600 to-blue-600 p-8 text-white relative"
          >
            <div className="relative z-10">
              <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Badge className="bg-white/20 text-white hover:bg-white/30 rounded-xl">
                      <Crown className="h-3 w-3 mr-1" />
                      Premium
                    </Badge>
                    <Badge className="bg-emerald-500/20 text-emerald-100 hover:bg-emerald-500/30 rounded-xl">
                      <Zap className="h-3 w-3 mr-1" />
                      24 Active Projects
                    </Badge>
                  </div>
                  <h2 className="text-3xl font-bold">Good {new Date().getHours() < 12 ? 'Morning' : new Date().getHours() < 18 ? 'Afternoon' : 'Evening'}, John!</h2>
                  <p className="max-w-[600px] text-white/80">
                    You have 3 pending reviews and 5 new collaboration requests. Ready to create something amazing today?
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button className="rounded-2xl bg-white text-indigo-700 hover:bg-white/90">
                      <Rocket className="mr-2 h-4 w-4" />
                      Start New Project
                    </Button>
                    <Button variant="outline" className="rounded-2xl bg-transparent border-white text-white hover:bg-white/10">
                      <Play className="mr-2 h-4 w-4" />
                      Watch Tutorial
                    </Button>
                  </div>
                </div>
                <div className="hidden lg:block">
                  <motion.div
                    animate={{ 
                      rotate: 360,
                      scale: [1, 1.1, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 50, repeat: Number.POSITIVE_INFINITY, ease: "linear" },
                      scale: { duration: 4, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }
                    }}
                    className="relative h-40 w-40"
                  >
                    {[...Array(5)].map((_, i) => (
                      <div 
                        key={i}
                        className={`absolute rounded-full bg-white/10 backdrop-blur-md`}
                        style={{
                          inset: `${i * 8}px`,
                          opacity: 0.8 - i * 0.15
                        }}
                      />
                    ))}
                  </motion.div>
                </div>
              </div>
            </div>
            
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-1/2 h-full opacity-10">
              <div className="grid grid-cols-8 gap-2 h-full w-full p-4">
                {[...Array(64)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="bg-white rounded"
                    animate={{ opacity: [0.3, 0.8, 0.3] }}
                    transition={{ 
                      duration: 2, 
                      repeat: Number.POSITIVE_INFINITY, 
                      delay: i * 0.1 
                    }}
                  />
                ))}
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
                        +{item.change}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{item.value}</p>
                      <p className="text-sm text-muted-foreground">{item.name}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
            {/* Recent Files Enhanced */}
            <div className="lg:col-span-2">
              <Card className="rounded-3xl border-2">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="text-xl">Recent Files</CardTitle>
                      <CardDescription>Your latest creative work</CardDescription>
                    </div>
                    <Button variant="outline" className="rounded-2xl">
                      <Eye className="mr-2 h-4 w-4" />
                      View All
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentFiles.map((file, index) => (
                      <motion.div
                        key={file.name}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        className="flex items-center gap-4 p-4 rounded-2xl hover:bg-muted/50 transition-colors border border-transparent hover:border-primary/20"
                      >
                        <div className="relative">
                          <div className="h-12 w-12 rounded-xl bg-muted overflow-hidden">
                            <img 
                              src={file.thumbnail} 
                              alt={file.name}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="absolute -bottom-1 -right-1 h-6 w-6 rounded-lg bg-muted flex items-center justify-center">
                            {file.icon}
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <p className="font-medium truncate">{file.name}</p>
                            <Badge 
                              variant={file.status === "Active" ? "default" : file.status === "Review" ? "secondary" : "outline"} 
                              className="rounded-xl text-xs"
                            >
                              {file.status}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>{file.app}</span>
                            <span>•</span>
                            <span>{file.modified}</span>
                            <span>•</span>
                            <span>{file.size}</span>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {file.shared && (
                            <div className="flex items-center gap-1">
                              <Users className="h-4 w-4 text-muted-foreground" />
                              <span className="text-sm text-muted-foreground">{file.collaborators}</span>
                            </div>
                          )}
                          <Button variant="ghost" size="sm" className="rounded-xl">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
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
                  <CardTitle className="text-xl">Activity Feed</CardTitle>
                  <CardDescription>Real-time team updates</CardDescription>
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
                        <Avatar className="h-8 w-8">
                          <AvatarImage src={activity.avatar} alt={activity.user} />
                          <AvatarFallback>{activity.user.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm">
                            <span className="font-medium">{activity.user}</span>
                            <span className="text-muted-foreground"> {activity.action} </span>
                            <span className="font-medium">{activity.target}</span>
                          </p>
                          <p className="text-xs text-muted-foreground">{activity.time}</p>
                        </div>
                        <div className={cn(
                          "h-2 w-2 rounded-full",
                          activity.type === "share" && "bg-blue-500",
                          activity.type === "complete" && "bg-green-500",
                          activity.type === "start" && "bg-orange-500",
                          activity.type === "upload" && "bg-purple-500",
                        )} />
                      </motion.div>
                    ))}
                  </div>
                  <Button variant="ghost" className="w-full mt-4 rounded-2xl">
                    View All Activity
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Quick Actions */}
          <Card className="rounded-3xl border-2 mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Quick Actions</CardTitle>
              <CardDescription>Jump start your creative process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                {[
                  { name: "New Design", icon: <Brush />, color: "from-orange-500 to-red-500" },
                  { name: "Edit Photo", icon: <Camera />, color: "from-teal-500 to-cyan-500" },
                  { name: "Create Video", icon: <Video />, color: "from-pink-500 to-rose-500" },
                  { name: "3D Model", icon: <CuboidIcon />, color: "from-indigo-500 to-purple-500" },
                  { name: "Typography", icon: <Type />, color: "from-amber-500 to-orange-500" },
                  { name: "Collaborate", icon: <Users />, color: "from-green-500 to-emerald-500" },
                ].map((action, index) => (
                  <motion.div
                    key={action.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <Button
                      variant="outline"
                      className="h-24 w-full flex-col gap-2 rounded-2xl border-2 hover:border-primary/50 hover:scale-105 transition-all duration-200"
                    >
                      <div className={cn("p-3 rounded-xl bg-gradient-to-r text-white", action.color)}>
                        {action.icon}
                      </div>
                      <span className="text-sm font-medium">{action.name}</span>
                    </Button>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Featured Apps Section */}
          <Card className="rounded-3xl border-2">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Featured Apps</CardTitle>
                  <CardDescription>Discover powerful creative tools</CardDescription>
                </div>
                <Button variant="outline" className="rounded-2xl">
                  <Grid className="mr-2 h-4 w-4" />
                  View All Apps
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {apps.slice(0, 8).map((app, index) => (
                  <motion.div
                    key={app.name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ scale: 1.02, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="overflow-hidden rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-muted">
                            {app.icon}
                          </div>
                          <div className="flex items-center gap-1">
                            {app.new && <Badge className="rounded-xl bg-emerald-500">New</Badge>}
                            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-2xl">
                              <Star className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                        <div>
                          <CardTitle className="text-lg leading-tight">{app.name}</CardTitle>
                          <Badge variant="outline" className="rounded-xl text-xs mt-1">
                            {app.category}
                          </Badge>
                        </div>
                      </CardHeader>
                      <CardContent className="pb-2">
                        <CardDescription className="mb-3">{app.description}</CardDescription>
                        
                        <div className="flex items-center justify-between text-xs text-muted-foreground mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                            <span>{app.rating}</span>
                          </div>
                          <span>{app.downloads}</span>
                          <span>v{app.version}</span>
                        </div>

                        {app.progress < 100 && (
                          <div className="space-y-2">
                            <div className="flex items-center justify-between text-sm">
                              <span>Installation</span>
                              <span>{app.progress}%</span>
                            </div>
                            <Progress value={app.progress} className="h-2 rounded-xl" />
                          </div>
                        )}
                      </CardContent>
                      <CardFooter className="flex gap-2">
                        <Button 
                          variant={app.progress < 100 ? "secondary" : "default"} 
                          className="flex-1 rounded-2xl"
                        >
                          {app.progress < 100 ? (
                            <>
                              <Timer className="mr-2 h-4 w-4" />
                              Installing...
                            </>
                          ) : (
                            <>
                              <Rocket className="mr-2 h-4 w-4" />
                              Launch
                            </>
                          )}
                        </Button>
                        <Button variant="outline" size="icon" className="rounded-2xl">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </CardFooter>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </CardContent>
          </Card>
        </main>
      </div>
    </div>
  )
}