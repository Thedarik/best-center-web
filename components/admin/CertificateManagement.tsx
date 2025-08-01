// "use client"

// import React, { useState } from "react"
// import { motion } from "framer-motion"
// import {
//     Award,
//     Download as DownloadIcon,
//     Eye,
//     Filter,
//     MoreHorizontal,
//     Plus,
//     QrCode,
//     Share2,
//     Star,
//     Palette,
//     CheckCircle,
//     Clock,
//     Edit,
//     Trash2,
//     Copy,
//     Heart,
//     TrendingUp,
//     X,
//     Calendar,
//     User,
//     BookOpen,
//     Save,
// } from "lucide-react"

// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
// import { Badge } from "@/components/ui/badge"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { CertificatePreview } from "@/components/admin/CertifikatePreview"
// import { cn } from "@/lib/utils"

// // Certificate Template interfaces
// interface CertificateTemplate {
//     id: number
//     name: string
//     description: string
//     category: "Modern" | "Classic" | "Elegant" | "Minimal" | "Colorful"
//     preview: string
//     colors: {
//         primary: string
//         secondary: string
//         accent: string
//     }
//     isActive: boolean
//     downloads: number
//     rating: number
//     createdDate: string
// }

// interface Certificate {
//     id: string
//     studentName: string
//     course: string
//     issueDate: string
//     status: "issued" | "draft" | "pending"
//     downloads: number
//     qrScans: number
//     validUntil: string
//     score: number
//     grade: string
//     issueTime: string
//     templateId: number
// }

// // Certificate templates data
// const certificateTemplates: CertificateTemplate[] = [
//     {
//         id: 1,
//         name: "Zamonaviy Gradient",
//         description: "Rangdor gradient dizayni bilan zamonaviy ko'rinish",
//         category: "Modern",
//         preview: "/placeholder.svg?height=300&width=400",
//         colors: {
//             primary: "#3B82F6",
//             secondary: "#8B5CF6",
//             accent: "#F59E0B"
//         },
//         isActive: true,
//         downloads: 156,
//         rating: 4.8,
//         createdDate: "2024-01-15"
//     },
//     {
//         id: 2,
//         name: "Klassik Elegant",
//         description: "An'anaviy va professional ko'rinish",
//         category: "Classic",
//         preview: "/placeholder.svg?height=300&width=400",
//         colors: {
//             primary: "#1F2937",
//             secondary: "#6B7280",
//             accent: "#D97706"
//         },
//         isActive: false,
//         downloads: 203,
//         rating: 4.9,
//         createdDate: "2024-02-10"
//     },
//     {
//         id: 3,
//         name: "Premium Gold",
//         description: "Oltin rangli hashamatli dizayn",
//         category: "Elegant",
//         preview: "/placeholder.svg?height=300&width=400",
//         colors: {
//             primary: "#B45309",
//             secondary: "#F59E0B",
//             accent: "#FCD34D"
//         },
//         isActive: false,
//         downloads: 89,
//         rating: 4.7,
//         createdDate: "2024-03-05"
//     },
//     {
//         id: 4,
//         name: "Minimal Clean",
//         description: "Sodda va toza minimalist uslub",
//         category: "Minimal",
//         preview: "/placeholder.svg?height=300&width=400",
//         colors: {
//             primary: "#000000",
//             secondary: "#6B7280",
//             accent: "#10B981"
//         },
//         isActive: false,
//         downloads: 127,
//         rating: 4.6,
//         createdDate: "2024-03-20"
//     },
//     {
//         id: 5,
//         name: "Rangdor Festival",
//         description: "Yorqin va quvnoq ranglar bilan",
//         category: "Colorful",
//         preview: "/placeholder.svg?height=300&width=400",
//         colors: {
//             primary: "#EC4899",
//             secondary: "#8B5CF6",
//             accent: "#06B6D4"
//         },
//         isActive: false,
//         downloads: 78,
//         rating: 4.5,
//         createdDate: "2024-04-01"
//     },
//     {
//         id: 6,
//         name: "Biznes Professional",
//         description: "Biznes muhiti uchun professional dizayn",
//         category: "Classic",
//         preview: "/placeholder.svg?height=300&width=400",
//         colors: {
//             primary: "#1E40AF",
//             secondary: "#3B82F6",
//             accent: "#EF4444"
//         },
//         isActive: false,
//         downloads: 234,
//         rating: 4.8,
//         createdDate: "2024-04-15"
//     }
// ]

// // Sample certificates data
// const certificatesHistory: Certificate[] = [
//     {
//         id: "CERT-2024-001247",
//         studentName: "Karimova Malika",
//         course: "Digital Marketing",
//         issueDate: "2024-05-01",
//         status: "issued",
//         downloads: 5,
//         qrScans: 12,
//         validUntil: "2027-05-01",
//         score: 95,
//         grade: "A+",
//         issueTime: "2 kun oldin",
//         templateId: 1
//     },
//     {
//         id: "CERT-2024-001245",
//         studentName: "Abdullayev Jasur",
//         course: "Frontend Development",
//         issueDate: "2024-06-10",
//         status: "draft",
//         downloads: 0,
//         qrScans: 0,
//         validUntil: "2027-06-10",
//         score: 88,
//         grade: "A",
//         issueTime: "Tayyorlanmoqda",
//         templateId: 2
//     },
//     {
//         id: "CERT-2024-001243",
//         studentName: "Nazarova Dilnoza",
//         course: "Graphic Design",
//         issueDate: "2024-06-12",
//         status: "pending",
//         downloads: 0,
//         qrScans: 0,
//         validUntil: "2027-06-12",
//         score: 92,
//         grade: "A",
//         issueTime: "Kutilmoqda",
//         templateId: 3
//     }
// ]

// interface CertificateManagementProps {
//     className?: string
// }

// export function CertificateManagement({ className }: CertificateManagementProps) {
//     const [activeTemplateId, setActiveTemplateId] = useState<number>(1)
//     const [selectedCategory, setSelectedCategory] = useState<string>("all")
//     const [searchQuery, setSearchQuery] = useState<string>("")
//     const [isCreateModalOpen, setIsCreateModalOpen] = useState<boolean>(false)
//     const [activeTab, setActiveTab] = useState<string>("certificates")
//     const [certificates, setCertificates] = useState<Certificate[]>(certificatesHistory)
//     const [isLoading, setIsLoading] = useState<boolean>(false)
//     const [selectedCertificate, setSelectedCertificate] = useState<Certificate | null>(null)
//     const [isPreviewOpen, setIsPreviewOpen] = useState<boolean>(false)

//     // Form state for certificate creation
//     const [formData, setFormData] = useState({
//         firstName: "",
//         lastName: "",
//         courseName: "",
//         completionDate: "",
//         score: "",
//         grade: ""
//     })

//     // Form validation
//     const isFormValid = formData.firstName.trim() &&
//         formData.lastName.trim() &&
//         formData.courseName &&
//         formData.completionDate &&
//         formData.score &&
//         formData.grade

//     // Generate unique certificate ID
//     const generateCertificateId = (): string => {
//         const year = new Date().getFullYear()
//         const timestamp = Date.now().toString().slice(-6)
//         return `CERT-${year}-${timestamp}`
//     }

//     // Calculate grade based on score
//     const calculateGrade = (score: number): string => {
//         if (score >= 90) return "A+"
//         if (score >= 80) return "A"
//         if (score >= 70) return "B+"
//         if (score >= 60) return "B"
//         return "C"
//     }

//     const handleCreateCertificate = async () => {
//         if (!isFormValid) return

//         setIsLoading(true)

//         try {
//             // Simulate API call delay
//             await new Promise(resolve => setTimeout(resolve, 1500))

//             // Create new certificate object
//             const newCertificate: Certificate = {
//                 id: generateCertificateId(),
//                 studentName: `${formData.firstName} ${formData.lastName}`,
//                 course: formData.courseName,
//                 issueDate: formData.completionDate,
//                 status: "issued",
//                 downloads: 0,
//                 qrScans: 0,
//                 validUntil: new Date(new Date(formData.completionDate).getTime() + 3 * 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 3 years validity
//                 score: parseInt(formData.score),
//                 grade: formData.grade,
//                 issueTime: "Hozir",
//                 templateId: activeTemplateId
//             }

//             // Add to certificates list
//             setCertificates(prev => [newCertificate, ...prev])

//             // Reset form
//             setFormData({
//                 firstName: "",
//                 lastName: "",
//                 courseName: "",
//                 completionDate: "",
//                 score: "",
//                 grade: ""
//             })

//             // Close modal
//             setIsCreateModalOpen(false)

//             // Switch to certificates tab to show the new certificate
//             setActiveTab("certificates")

//             // Success notification (you can replace this with a proper toast)
//             alert(`Sertifikat muvaffaqiyatli yaratildi!\nID: ${newCertificate.id}\nTalaba: ${newCertificate.studentName}`)

//         } catch (error) {
//             console.error("Sertifikat yaratishda xatolik:", error)
//             alert("Sertifikat yaratishda xatolik yuz berdi. Qaytadan urinib ko'ring.")
//         } finally {
//             setIsLoading(false)
//         }
//     }

//     // Handle certificate preview
//     const handlePreviewCertificate = (certificate: Certificate) => {
//         setSelectedCertificate(certificate)
//         setIsPreviewOpen(true)
//     }

//     // Auto-calculate grade when score changes
//     const handleScoreChange = (value: string) => {
//         setFormData(prev => {
//             const newScore = parseInt(value)
//             const autoGrade = !isNaN(newScore) ? calculateGrade(newScore) : ""
//             return {
//                 ...prev,
//                 score: value,
//                 grade: autoGrade
//             }
//         })
//     }

//     const getStatusBadge = (status: string): React.ReactNode => {
//         const statusMap = {
//             issued: "Berilgan",
//             draft: "Tayyorlanmoqda",
//             pending: "Kutilmoqda"
//         }

//         return (
//             <Badge
//                 variant={status === "issued" ? "default" : "secondary"}
//                 className="rounded-xl text-xs"
//             >
//                 {statusMap[status as keyof typeof statusMap] || status}
//             </Badge>
//         )
//     }

//     const filteredTemplates = certificateTemplates.filter(template => {
//         const matchesCategory = selectedCategory === "all" || template.category === selectedCategory
//         const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//             template.description.toLowerCase().includes(searchQuery.toLowerCase())
//         return matchesCategory && matchesSearch
//     })

//     const categories = ["all", "Modern", "Classic", "Elegant", "Minimal", "Colorful"]

//     return (
//         <div className={cn("space-y-6", className)}>
//             {/* Header */}
//             <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                 <div>
//                     <h2 className="text-2xl font-bold">Sertifikat Boshqaruvi</h2>
//                     <p className="text-muted-foreground">Sertifikat shablon va berilgan sertifikatlarni boshqaring</p>
//                 </div>
//                 <div className="flex gap-2">
//                     <Button variant="outline" className="rounded-2xl">
//                         <Filter className="mr-2 h-4 w-4" />
//                         Filtr
//                     </Button>

//                     {/* Certificate Creation Modal */}
//                     <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
//                         <DialogTrigger asChild>
//                             <Button className="rounded-2xl">
//                                 <Plus className="mr-2 h-4 w-4" />
//                                 Sertifikat Berish
//                             </Button>
//                         </DialogTrigger>
//                         <DialogContent className="sm:max-w-md rounded-3xl">
//                             <DialogHeader>
//                                 <DialogTitle className="text-xl font-bold text-center">
//                                     Yangi Sertifikat Berish
//                                 </DialogTitle>
//                             </DialogHeader>

//                             <div className="space-y-6 py-4">
//                                 {/* Student Name */}
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="firstName">Ism</Label>
//                                         <Input
//                                             id="firstName"
//                                             placeholder="Talabaning ismi"
//                                             value={formData.firstName}
//                                             onChange={(e) => setFormData(prev => ({ ...prev, firstName: e.target.value }))}
//                                             className="rounded-2xl"
//                                         />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="lastName">Familya</Label>
//                                         <Input
//                                             id="lastName"
//                                             placeholder="Talabaning familyasi"
//                                             value={formData.lastName}
//                                             onChange={(e) => setFormData(prev => ({ ...prev, lastName: e.target.value }))}
//                                             className="rounded-2xl"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Course Name */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="courseName">Kurs nomi</Label>
//                                     <Select onValueChange={(value) => setFormData(prev => ({ ...prev, courseName: value }))}>
//                                         <SelectTrigger className="rounded-2xl">
//                                             <SelectValue placeholder="Kurs nomini tanlang" />
//                                         </SelectTrigger>
//                                         <SelectContent>
//                                             <SelectItem value="frontend">Frontend Development</SelectItem>
//                                             <SelectItem value="backend">Backend Development</SelectItem>
//                                             <SelectItem value="fullstack">Full Stack Development</SelectItem>
//                                             <SelectItem value="mobile">Mobile Development</SelectItem>
//                                             <SelectItem value="design">UI/UX Design</SelectItem>
//                                             <SelectItem value="marketing">Digital Marketing</SelectItem>
//                                             <SelectItem value="data">Data Science</SelectItem>
//                                         </SelectContent>
//                                     </Select>
//                                 </div>

//                                 {/* Completion Date */}
//                                 <div className="space-y-2">
//                                     <Label htmlFor="completionDate">Tamomlagan sanasi</Label>
//                                     <Input
//                                         id="completionDate"
//                                         type="date"
//                                         value={formData.completionDate}
//                                         onChange={(e) => setFormData(prev => ({ ...prev, completionDate: e.target.value }))}
//                                         className="rounded-2xl"
//                                     />
//                                 </div>

//                                 {/* Score and Grade */}
//                                 <div className="grid grid-cols-2 gap-3">
//                                     <div className="space-y-2">
//                                         <Label htmlFor="score">Ball (100 dan)</Label>
//                                         <Input
//                                             id="score"
//                                             type="number"
//                                             placeholder="85"
//                                             min="0"
//                                             max="100"
//                                             value={formData.score}
//                                             onChange={(e) => handleScoreChange(e.target.value)}
//                                             className="rounded-2xl"
//                                         />
//                                     </div>
//                                     <div className="space-y-2">
//                                         <Label htmlFor="grade">Baho (avtomatik)</Label>
//                                         <Input
//                                             id="grade"
//                                             value={formData.grade}
//                                             readOnly
//                                             placeholder="Ball kiritganda avtomatik"
//                                             className="rounded-2xl bg-muted/50"
//                                         />
//                                     </div>
//                                 </div>

//                                 {/* Active Template Info */}
//                                 <div className="p-4 bg-muted/50 rounded-2xl">
//                                     <div className="flex items-center gap-3">
//                                         <div className="p-2 bg-primary/10 rounded-xl">
//                                             <Palette className="h-4 w-4 text-primary" />
//                                         </div>
//                                         <div>
//                                             <p className="font-medium text-sm">Faol shablon</p>
//                                             <p className="text-xs text-muted-foreground">
//                                                 {certificateTemplates.find(t => t.isActive)?.name || "Zamonaviy Gradient"}
//                                             </p>
//                                         </div>
//                                     </div>
//                                 </div>

//                                 {/* Action Buttons */}
//                                 <div className="flex gap-3 pt-2">
//                                     <Button
//                                         variant="outline"
//                                         onClick={() => setIsCreateModalOpen(false)}
//                                         className="flex-1 rounded-2xl"
//                                     >
//                                         Bekor qilish
//                                     </Button>
//                                     <Button
//                                         onClick={handleCreateCertificate}
//                                         className="flex-1 rounded-2xl"
//                                         disabled={!isFormValid || isLoading}
//                                     >
//                                         {isLoading ? (
//                                             <>
//                                                 <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
//                                                 Yaratilmoqda...
//                                             </>
//                                         ) : (
//                                             <>
//                                                 <Save className="mr-2 h-4 w-4" />
//                                                 Sertifikat Berish
//                                             </>
//                                         )}
//                                     </Button>
//                                 </div>
//                             </div>
//                         </DialogContent>
//                     </Dialog>
//                 </div>
//             </div>

//             {/* Tabs - Kichik va ixcham */}
//             <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
//                 <div className="flex justify-center">
//                     <TabsList className="inline-flex h-9 items-center justify-center rounded-2xl bg-muted p-1 text-muted-foreground">
//                         <TabsTrigger value="certificates" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
//                             <Award className="mr-1.5 h-3 w-3" />
//                             Berilganlar ({certificates.length})
//                         </TabsTrigger>
//                         <TabsTrigger value="templates" className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-3 py-1 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow">
//                             <Palette className="mr-1.5 h-3 w-3" />
//                             Shablonlar ({certificateTemplates.length})
//                         </TabsTrigger>
//                     </TabsList>
//                 </div>

//                 {/* Templates Tab */}
//                 <TabsContent value="templates" className="space-y-6">
//                     {/* Search and Filters */}
//                     <div className="flex flex-col sm:flex-row gap-4">
//                         <div className="relative flex-1">
//                             <Input
//                                 type="search"
//                                 placeholder="Shablon qidirish..."
//                                 value={searchQuery}
//                                 onChange={(e) => setSearchQuery(e.target.value)}
//                                 className="rounded-2xl pl-4 pr-4"
//                             />
//                         </div>
//                         <div className="flex gap-2 overflow-x-auto">
//                             {categories.map((category) => (
//                                 <Button
//                                     key={category}
//                                     variant={selectedCategory === category ? "default" : "outline"}
//                                     size="sm"
//                                     className="rounded-2xl whitespace-nowrap"
//                                     onClick={() => setSelectedCategory(category)}
//                                 >
//                                     {category === "all" ? "Barchasi" : category}
//                                 </Button>
//                             ))}
//                         </div>
//                     </div>

//                     {/* Templates Grid */}
//                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//                         {filteredTemplates.map((template, index) => (
//                             <motion.div
//                                 key={template.id}
//                                 initial={{ opacity: 0, y: 20 }}
//                                 animate={{ opacity: 1, y: 0 }}
//                                 transition={{ duration: 0.3, delay: index * 0.1 }}
//                             >
//                                 <Card className={cn(
//                                     "rounded-3xl border-2 hover:border-primary/50 transition-all duration-300 hover:shadow-lg cursor-pointer",
//                                     template.isActive && "ring-2 ring-primary ring-offset-2"
//                                 )}>
//                                     <CardHeader className="pb-3">
//                                         <div className="relative">
//                                             <div className="aspect-video rounded-2xl overflow-hidden bg-muted mb-3">
//                                                 <img
//                                                     src={template.preview}
//                                                     alt={template.name}
//                                                     className="w-full h-full object-cover"
//                                                 />
//                                                 {template.isActive && (
//                                                     <div className="absolute top-2 right-2">
//                                                         <Badge className="bg-green-500 hover:bg-green-600 rounded-xl">
//                                                             <CheckCircle className="h-3 w-3 mr-1" />
//                                                             Faol
//                                                         </Badge>
//                                                     </div>
//                                                 )}
//                                             </div>

//                                             <div className="flex items-start justify-between">
//                                                 <div className="flex-1">
//                                                     <CardTitle className="text-lg leading-tight">{template.name}</CardTitle>
//                                                     <Badge variant="outline" className="rounded-xl text-xs mt-1">
//                                                         {template.category}
//                                                     </Badge>
//                                                 </div>

//                                                 <div className="flex items-center gap-1 ml-2">
//                                                     <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
//                                                     <span className="text-sm font-medium">{template.rating}</span>
//                                                 </div>
//                                             </div>
//                                         </div>
//                                     </CardHeader>

//                                     <CardContent className="pb-3 space-y-3">
//                                         <p className="text-sm text-muted-foreground line-clamp-2">
//                                             {template.description}
//                                         </p>

//                                         {/* Color Palette */}
//                                         <div className="flex items-center gap-2">
//                                             <span className="text-xs text-muted-foreground">Ranglar:</span>
//                                             <div className="flex gap-1">
//                                                 {Object.values(template.colors).map((color, idx) => (
//                                                     <div
//                                                         key={idx}
//                                                         className="w-4 h-4 rounded-full border border-border"
//                                                         style={{ backgroundColor: color }}
//                                                     />
//                                                 ))}
//                                             </div>
//                                         </div>

//                                         {/* Stats */}
//                                         <div className="flex justify-between text-xs text-muted-foreground">
//                                             <div className="flex items-center gap-1">
//                                                 <DownloadIcon className="h-3 w-3" />
//                                                 <span>{template.downloads}</span>
//                                             </div>
//                                             <span>{template.createdDate}</span>
//                                         </div>
//                                     </CardContent>

//                                     <CardFooter className="flex gap-2 pt-3">
//                                         <Button
//                                             variant={template.isActive ? "secondary" : "default"}
//                                             className="flex-1 rounded-2xl"
//                                             onClick={() => setActiveTemplateId(template.id)}
//                                         >
//                                             {template.isActive ? (
//                                                 <>
//                                                     <CheckCircle className="mr-2 h-4 w-4" />
//                                                     Faol Shablon
//                                                 </>
//                                             ) : (
//                                                 <>
//                                                     <CheckCircle className="mr-2 h-4 w-4" />
//                                                     Tanlash
//                                                 </>
//                                             )}
//                                         </Button>
//                                         <Button variant="outline" size="icon" className="rounded-2xl">
//                                             <Eye className="h-4 w-4" />
//                                         </Button>
//                                         <Button variant="outline" size="icon" className="rounded-2xl">
//                                             <MoreHorizontal className="h-4 w-4" />
//                                         </Button>
//                                     </CardFooter>
//                                 </Card>
//                             </motion.div>
//                         ))}
//                     </div>
//                 </TabsContent>

//                 {/* Certificates Tab */}
//                 <TabsContent value="certificates" className="space-y-6">
//                     {/* Certificates Table */}
//                     <Card className="rounded-3xl border-2">
//                         <CardContent className="p-0">
//                             <div className="overflow-x-auto">
//                                 <table className="w-full">
//                                     <thead className="border-b bg-muted/50">
//                                         <tr>
//                                             <th className="text-left p-4 font-medium">Sertifikat ID</th>
//                                             <th className="text-left p-4 font-medium">O'quvchi</th>
//                                             <th className="text-left p-4 font-medium">Kurs</th>
//                                             <th className="text-left p-4 font-medium">Ball/Baho</th>
//                                             <th className="text-left p-4 font-medium">Berilgan sana</th>
//                                             <th className="text-left p-4 font-medium">Holat</th>
//                                             <th className="text-left p-4 font-medium">QR Skanlar</th>
//                                             <th className="text-left p-4 font-medium">Amallar</th>
//                                         </tr>
//                                     </thead>
//                                     <tbody className="divide-y">
//                                         {certificates.map((cert) => (
//                                             <tr key={cert.id} className="hover:bg-muted/50 transition-colors">
//                                                 <td className="p-4">
//                                                     <code className="text-xs bg-muted px-2 py-1 rounded">{cert.id}</code>
//                                                 </td>
//                                                 <td className="p-4 font-medium">{cert.studentName}</td>
//                                                 <td className="p-4">{cert.course}</td>
//                                                 <td className="p-4">
//                                                     <div className="flex items-center gap-2">
//                                                         <span className="font-semibold">{cert.score}</span>
//                                                         <Badge variant="outline" className="rounded-xl text-xs">
//                                                             {cert.grade}
//                                                         </Badge>
//                                                     </div>
//                                                 </td>
//                                                 <td className="p-4">{cert.issueDate}</td>
//                                                 <td className="p-4">
//                                                     {getStatusBadge(cert.status)}
//                                                 </td>
//                                                 <td className="p-4">
//                                                     <div className="flex items-center gap-1">
//                                                         <QrCode className="h-4 w-4 text-primary" />
//                                                         <span>{cert.qrScans}</span>
//                                                     </div>
//                                                 </td>
//                                                 <td className="p-4">
//                                                     <div className="flex gap-1">
//                                                         <Button
//                                                             variant="ghost"
//                                                             size="icon"
//                                                             className="h-8 w-8 rounded-xl"
//                                                             onClick={() => handlePreviewCertificate(cert)}
//                                                         >
//                                                             <Eye className="h-4 w-4" />
//                                                         </Button>
//                                                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
//                                                             <DownloadIcon className="h-4 w-4" />
//                                                         </Button>
//                                                         <Button variant="ghost" size="icon" className="h-8 w-8 rounded-xl">
//                                                             <Share2 className="h-4 w-4" />
//                                                         </Button>
//                                                     </div>
//                                                 </td>
//                                             </tr>
//                                         ))}
//                                     </tbody>
//                                 </table>
//                             </div>
//                         </CardContent>
//                     </Card>
//                 </TabsContent>
//             </Tabs>

//             {/* Certificate Preview Modal */}
//             {selectedCertificate && (
//                 <CertificatePreview
//                     isOpen={isPreviewOpen}
//                     onClose={() => {
//                         setIsPreviewOpen(false)
//                         setSelectedCertificate(null)
//                     }}
//                     certificate={selectedCertificate}
//                 />
//             )}
//         </div>
//     )
// }