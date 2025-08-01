// "use client"

// import React, { useState, useEffect } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Badge } from "@/components/ui/badge"
// import { Progress } from "@/components/ui/progress"
// import { Alert, AlertDescription } from "@/components/ui/alert"
// import { 
//   BookOpen, 
//   PenTool, 
//   Headphones, 
//   Mic,
//   User,
//   Clock,
//   Trophy,
//   ArrowRight,
//   LogOut,
//   Calendar,
//   Target,
//   TrendingUp,
//   Award,
//   Play,
//   Lock,
//   CheckCircle,
//   Star,
//   BarChart3
// } from "lucide-react"

// interface StudentData {
//   fullName: string
//   passportId: string
//   sessionStart: string
// }

// interface TestSection {
//   id: string
//   title: string
//   description: string
//   icon: React.ReactNode
//   status: 'available' | 'coming-soon' | 'completed'
//   testsCount: number
//   averageScore?: number
//   lastAttempt?: string
//   estimatedTime: string
//   difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
// }

// interface StudentDashboardProps {
//   studentData: StudentData
//   onLogout: () => void
//   onEnterSection: (sectionId: string) => void
// }

// export default function StudentDashboard({ 
//   studentData, 
//   onLogout, 
//   onEnterSection 
// }: StudentDashboardProps) {
//   const [recentActivity, setRecentActivity] = useState<any[]>([])
//   const [sessionTime, setSessionTime] = useState(0)

//   // Session timer
//   useEffect(() => {
//     const startTime = new Date(studentData.sessionStart).getTime()
//     const timer = setInterval(() => {
//       const now = new Date().getTime()
//       const elapsed = Math.floor((now - startTime) / 1000)
//       setSessionTime(elapsed)
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [studentData.sessionStart])

//   // Mock recent activity - real da API dan keladi
//   useEffect(() => {
//     // Load recent activity from sessionStorage or API
//     const savedActivity = sessionStorage.getItem(`activity_${studentData.passportId}`)
//     if (savedActivity) {
//       setRecentActivity(JSON.parse(savedActivity))
//     }
//   }, [studentData.passportId])

//   const testSections: TestSection[] = [
//     {
//       id: 'reading',
//       title: 'Reading',
//       description: 'Academic va General Training reading testlari',
//       icon: <BookOpen className="h-6 w-6" />,
//       status: 'available',
//       testsCount: 15,
//       averageScore: 6.5,
//       lastAttempt: '2024-01-19',
//       estimatedTime: '60 daqiqa',
//       difficulty: 'Intermediate'
//     },
//     {
//       id: 'writing',
//       title: 'Writing',
//       description: 'Task 1 va Task 2 writing testlari',
//       icon: <PenTool className="h-6 w-6" />,
//       status: 'coming-soon',
//       testsCount: 12,
//       estimatedTime: '60 daqiqa',
//       difficulty: 'Advanced'
//     },
//     {
//       id: 'listening',
//       title: 'Listening',
//       description: '4 qismli listening comprehension testlari',
//       icon: <Headphones className="h-6 w-6" />,
//       status: 'coming-soon',
//       testsCount: 20,
//       estimatedTime: '40 daqiqa',
//       difficulty: 'Intermediate'
//     },
//     {
//       id: 'speaking',
//       title: 'Speaking',
//       description: 'Interactive speaking practice va assessment',
//       icon: <Mic className="h-6 w-6" />,
//       status: 'coming-soon',
//       testsCount: 8,
//       estimatedTime: '15 daqiqa',
//       difficulty: 'Advanced'
//     }
//   ]

//   const formatSessionTime = (seconds: number) => {
//     const hours = Math.floor(seconds / 3600)
//     const minutes = Math.floor((seconds % 3600) / 60)
//     const secs = seconds % 60
    
//     if (hours > 0) {
//       return `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
//     }
//     return `${minutes}:${secs.toString().padStart(2, '0')}`
//   }

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case 'available': return 'bg-green-100 text-green-800 border-green-300'
//       case 'coming-soon': return 'bg-yellow-100 text-yellow-800 border-yellow-300'
//       case 'completed': return 'bg-blue-100 text-blue-800 border-blue-300'
//       default: return 'bg-gray-100 text-gray-800 border-gray-300'
//     }
//   }

//   const getDifficultyColor = (difficulty: string) => {
//     switch(difficulty) {
//       case 'Beginner': return 'bg-green-100 text-green-700'
//       case 'Intermediate': return 'bg-yellow-100 text-yellow-700'
//       case 'Advanced': return 'bg-red-100 text-red-700'
//       default: return 'bg-gray-100 text-gray-700'
//     }
//   }

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
//       {/* Header */}
//       <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
//         <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
//           <div className="flex items-center justify-between h-16">
//             <div className="flex items-center gap-4">
//               <div className="w-10 h-10 bg-blue-600 rounded-2xl flex items-center justify-center">
//                 <BookOpen className="h-5 w-5 text-white" />
//               </div>
//               <div>
//                 <h1 className="text-xl font-bold text-gray-900">IELTS Test Portal</h1>
//                 <p className="text-sm text-gray-600">Student Dashboard</p>
//               </div>
//             </div>

//             <div className="flex items-center gap-4">
//               <div className="text-right">
//                 <p className="text-sm font-medium text-gray-900">{studentData.fullName}</p>
//                 <p className="text-xs text-gray-600">ID: {studentData.passportId}</p>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={onLogout}
//                 className="rounded-2xl"
//               >
//                 <LogOut className="h-4 w-4 mr-2" />
//                 Chiqish
//               </Button>
//             </div>
//           </div>
//         </div>
//       </header>

//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
//         {/* Welcome Section */}
//         <div className="mb-8">
//           <h2 className="text-3xl font-bold text-gray-900 mb-2">
//             Xush kelibsiz, {studentData.fullName.split(' ')[0]}! 👋
//           </h2>
//           <p className="text-gray-600">
//             IELTS testlarini boshlash uchun quyidagi bo'limlardan birini tanlang
//           </p>
//         </div>

//         <div className="grid lg:grid-cols-3 gap-8">
//           {/* Main Content - Test Sections */}
//           <div className="lg:col-span-2 space-y-6">
//             <div>
//               <h3 className="text-xl font-semibold text-gray-900 mb-4">Test Bo'limlari</h3>
//               <div className="grid gap-4">
//                 {testSections.map((section) => (
//                   <Card key={section.id} className="rounded-3xl border-2 hover:shadow-lg transition-all duration-200">
//                     <CardContent className="p-6">
//                       <div className="flex items-center justify-between">
//                         <div className="flex items-center gap-4">
//                           <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${
//                             section.status === 'available' 
//                               ? 'bg-blue-100 text-blue-600' 
//                               : 'bg-gray-100 text-gray-400'
//                           }`}>
//                             {section.icon}
//                           </div>
                          
//                           <div className="space-y-1">
//                             <div className="flex items-center gap-3">
//                               <h4 className="text-lg font-semibold text-gray-900">{section.title}</h4>
//                               <Badge className={getStatusColor(section.status)}>
//                                 {section.status === 'available' ? 'Mavjud' : 
//                                  section.status === 'coming-soon' ? 'Tez kunda' : 'Tugatilgan'}
//                               </Badge>
//                               <Badge variant="outline" className={getDifficultyColor(section.difficulty)}>
//                                 {section.difficulty}
//                               </Badge>
//                             </div>
//                             <p className="text-sm text-gray-600">{section.description}</p>
                            
//                             <div className="flex items-center gap-4 text-xs text-gray-500">
//                               <div className="flex items-center gap-1">
//                                 <Target className="h-3 w-3" />
//                                 <span>{section.testsCount} ta test</span>
//                               </div>
//                               <div className="flex items-center gap-1">
//                                 <Clock className="h-3 w-3" />
//                                 <span>{section.estimatedTime}</span>
//                               </div>
//                               {section.averageScore && (
//                                 <div className="flex items-center gap-1">
//                                   <Star className="h-3 w-3" />
//                                   <span>O'rtacha: {section.averageScore}</span>
//                                 </div>
//                               )}
//                             </div>
//                           </div>
//                         </div>

//                         <div className="flex items-center gap-2">
//                           {section.status === 'available' ? (
//                             <Button
//                               onClick={() => onEnterSection(section.id)}
//                               className="rounded-2xl bg-blue-600 hover:bg-blue-700"
//                             >
//                               <Play className="h-4 w-4 mr-2" />
//                               Boshlash
//                             </Button>
//                           ) : (
//                             <Button
//                               disabled
//                               variant="outline"
//                               className="rounded-2xl"
//                             >
//                               <Lock className="h-4 w-4 mr-2" />
//                               Tez kunda
//                             </Button>
//                           )}
//                         </div>
//                       </div>
//                     </CardContent>
//                   </Card>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* Sidebar - Stats and Info */}
//           <div className="space-y-6">
//             {/* Session Info */}
//             <Card className="rounded-3xl border-2">
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <User className="h-5 w-5" />
//                   Session Ma'lumotlari
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-2">
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Session davomiyligi:</span>
//                     <span className="font-medium">{formatSessionTime(sessionTime)}</span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">Boshlangan vaqt:</span>
//                     <span className="font-medium">
//                       {new Date(studentData.sessionStart).toLocaleTimeString('uz-UZ', {
//                         hour: '2-digit',
//                         minute: '2-digit'
//                       })}
//                     </span>
//                   </div>
//                   <div className="flex justify-between text-sm">
//                     <span className="text-gray-600">ID:</span>
//                     <span className="font-mono font-medium">{studentData.passportId}</span>
//                   </div>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Quick Stats */}
//             <Card className="rounded-3xl border-2">
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <BarChart3 className="h-5 w-5" />
//                   Tezkor Statistika
//                 </CardTitle>
//               </CardHeader>
//               <CardContent className="space-y-4">
//                 <div className="space-y-3">
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">Mavjud testlar</span>
//                     <span className="text-lg font-bold text-blue-600">15</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">Tugatilgan</span>
//                     <span className="text-lg font-bold text-green-600">0</span>
//                   </div>
//                   <div className="flex items-center justify-between">
//                     <span className="text-sm text-gray-600">Umumiy progress</span>
//                     <span className="text-lg font-bold text-purple-600">0%</span>
//                   </div>
//                 </div>
//                 <Progress value={0} className="h-2" />
//               </CardContent>
//             </Card>

//             {/* Latest Achievement */}
//             <Card className="rounded-3xl border-2 bg-gradient-to-br from-yellow-50 to-orange-50">
//               <CardHeader>
//                 <CardTitle className="text-lg flex items-center gap-2">
//                   <Trophy className="h-5 w-5 text-yellow-600" />
//                   Motivatsiya
//                 </CardTitle>
//               </CardHeader>
//               <CardContent>
//                 <div className="text-center space-y-2">
//                   <Award className="h-12 w-12 text-yellow-600 mx-auto" />
//                   <p className="text-sm font-medium">Birinchi testni boshlang!</p>
//                   <p className="text-xs text-gray-600">
//                     Reading bo'limidan boshlashni tavsiya qilamiz
//                   </p>
//                 </div>
//               </CardContent>
//             </Card>

//             {/* Tips */}
//             <Alert className="border-blue-200 bg-blue-50 rounded-2xl">
//               <TrendingUp className="h-4 w-4 text-blue-600" />
//               <AlertDescription className="text-blue-800">
//                 <strong>Maslahat:</strong> Reading testlardan boshlang. Bu eng muhim va asosiy bo'lim hisoblanadi.
//               </AlertDescription>
//             </Alert>
//           </div>
//         </div>
//       </div>
//     </div>
//   )
// }