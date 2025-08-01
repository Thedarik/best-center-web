// "use client"

// import React, { useState } from "react"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
// import { Input } from "@/components/ui/input"
// import { Label } from "@/components/ui/label"
// import { Textarea } from "@/components/ui/textarea"
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
// import { Badge } from "@/components/ui/badge"
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { Separator } from "@/components/ui/separator"
// import { 
//   Filter, 
//   Plus, 
//   Edit, 
//   Trash2, 
//   Eye, 
//   Clock, 
//   Users, 
//   BookOpen,
//   FileText,
//   Settings,
//   BarChart3,
//   Target,
//   CheckCircle,
//   XCircle,
//   AlertCircle
// } from "lucide-react"

// export default function ReadingAdmin() {
//   const [tests, setTests] = useState<Test[]>([
//     {
//       id: 1,
//       title: "Academic Reading Test 1",
//       type: "Academic",
//       level: "Intermediate",
//       passages: 3,
//       questions: 40,
//       timeLimit: 60,
//       status: "Active",
//       attempts: 156,
//       avgScore: 6.5,
//       createdAt: "2024-01-15",
//       passages_data: [
//         {
//           title: "Climate Change and Arctic Wildlife",
//           text: "The Arctic region has been experiencing unprecedented changes due to global warming. Scientists have observed that polar bears are struggling to find food as ice melts earlier each year. The warming temperatures have created significant challenges for wildlife adaptation.",
//           questions: [
//             {
//               type: "Multiple Choice",
//               question: "What is the main cause of Arctic ice melting?",
//               options: ["Solar radiation", "Global warming", "Ocean currents", "Wind patterns"],
//               correct: 1
//             },
//             {
//               type: "Sentence Completion",
//               question: "Complete the sentence using NO MORE THAN TWO WORDS from the passage:",
//               sentence: "Polar bears are struggling to find _____ as ice melts earlier.",
//               correctAnswer: "food",
//               wordLimit: 2
//             }
//           ]
//         }
//       ]
//     },
//     {
//       id: 2,
//       title: "General Training Reading Test 1",
//       type: "General Training",
//       level: "Beginner",
//       passages: 3,
//       questions: 40,
//       timeLimit: 60,
//       status: "Draft",
//       attempts: 0,
//       avgScore: 0,
//       createdAt: "2024-01-20",
//       passages_data: [] // Bo'sh array qo'shamiz
//     }
//   ])

//   const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
//   const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  
//   type Question = {
//     type: string
//     question: string
//     options?: string[]
//     correct?: number
//     sentence?: string
//     correctAnswer?: string
//     wordLimit?: number
//     truefalse?: string
//     headings?: string[]
//     matchingOptions?: string[]
//   }

//   type Passage = {
//     title: string
//     text: string
//     questions: Question[]
//   }

//   type Test = {
//     id: number
//     title: string
//     type: string
//     level: string
//     passages: number
//     questions: number
//     timeLimit: number
//     status: string
//     attempts: number
//     avgScore: number
//     createdAt: string
//     passages_data: Passage[] // Optional emas, har doim bo'lishi kerak
//   }

//   const [selectedTest, setSelectedTest] = useState<Test | null>(null)
//   const [filterType, setFilterType] = useState("all")
//   const [filterStatus, setFilterStatus] = useState("all")

//   type NewTestPassage = {
//     title: string
//     text: string
//     questions: Question[]
//   }

//   type NewTestType = {
//     title: string
//     type: string
//     level: string
//     timeLimit: number
//     passages: Passage[]
//   }

//   const [newTest, setNewTest] = useState<NewTestType>({
//     title: "",
//     type: "Academic",
//     level: "Intermediate",
//     timeLimit: 60,
//     passages: []
//   })

//   const [currentPassage, setCurrentPassage] = useState<{
//     title: string
//     text: string
//     questions: Question[]
//   }>({
//     title: "",
//     text: "",
//     questions: []
//   })

//   const [currentQuestion, setCurrentQuestion] = useState<Question>({
//     type: "Multiple Choice",
//     question: "",
//     options: ["", "", "", ""],
//     correct: 0,
//     sentence: "",
//     correctAnswer: "",
//     wordLimit: 2,
//     truefalse: "True",
//     headings: [""],
//     matchingOptions: [""]
//   })

//   const questionTypes = [
//     "Multiple Choice",
//     "True/False/Not Given",
//     "Yes/No/Not Given", 
//     "Matching Headings",
//     "Matching Information",
//     "Matching Features",
//     "Sentence Completion",
//     "Summary Completion",
//     "Short Answer Questions",
//     "Diagram Label Completion"
//   ]

//   const addQuestion = () => {
//     // Validate question before adding
//     if (!currentQuestion.question.trim()) {
//       alert("Iltimos savol matnini kiriting!")
//       return
//     }

//     // Additional validation based on question type
//     if (currentQuestion.type === "Multiple Choice") {
//       if (!currentQuestion.options?.every(opt => opt.trim())) {
//         alert("Barcha variantlarni to'ldiring!")
//         return
//       }
//     } else if (currentQuestion.type === "Sentence Completion") {
//       if (!currentQuestion.sentence?.trim() || !currentQuestion.correctAnswer?.trim()) {
//         alert("Jumla va to'g'ri javobni kiriting!")
//         return
//       }
//     }

//     setCurrentPassage(prev => ({
//       ...prev,
//       questions: [...prev.questions, { ...currentQuestion }]
//     }))
    
//     // Reset current question
//     setCurrentQuestion({
//       type: "Multiple Choice",
//       question: "",
//       options: ["", "", "", ""],
//       correct: 0,
//       sentence: "",
//       correctAnswer: "",
//       wordLimit: 2,
//       truefalse: "True",
//       headings: [""],
//       matchingOptions: [""]
//     })
//   }

//   const addPassage = () => {
//     // Validate passage before adding
//     if (!currentPassage.title.trim()) {
//       alert("Iltimos matn sarlavhasini kiriting!")
//       return
//     }
//     if (!currentPassage.text.trim()) {
//       alert("Iltimos matn mazmunini kiriting!")
//       return
//     }
//     if (currentPassage.questions.length === 0) {
//       alert("Kamida bitta savol qo'shing!")
//       return
//     }

//     setNewTest(prev => ({
//       ...prev,
//       passages: [...prev.passages, { ...currentPassage }]
//     }))
    
//     // Reset current passage
//     setCurrentPassage({
//       title: "",
//       text: "",
//       questions: []
//     })
//   }

//   const createTest = () => {
//     // Validate test before creating
//     if (!newTest.title.trim()) {
//       alert("Iltimos test nomini kiriting!")
//       return
//     }
//     if (newTest.passages.length === 0) {
//       alert("Kamida bitta matn qo'shing!")
//       return
//     }

//     const test: Test = {
//       id: Math.max(...tests.map(t => t.id), 0) + 1, // Generate unique ID
//       title: newTest.title,
//       type: newTest.type,
//       level: newTest.level,
//       passages: newTest.passages.length,
//       questions: newTest.passages.reduce((total, passage) => total + passage.questions.length, 0),
//       timeLimit: newTest.timeLimit,
//       status: "Draft",
//       attempts: 0,
//       avgScore: 0,
//       createdAt: new Date().toISOString().split('T')[0],
//       passages_data: newTest.passages // Optional belgisini olib tashladik
//     }
    
//     // Add test to the list - BU JUDA MUHIM!
//     setTests(prev => [...prev, test])
    
//     // Reset form
//     setNewTest({
//       title: "",
//       type: "Academic", 
//       level: "Intermediate",
//       timeLimit: 60,
//       passages: []
//     })
    
//     // Close dialog
//     setIsCreateDialogOpen(false)
    
//     // Show success message
//     alert(`"${test.title}" testi muvaffaqiyatli yaratildi!`)
//   }

//   const deleteTest = (id: number) => {
//     if (window.confirm("Rostdan ham bu testni o'chirmoqchimisiz?")) {
//       setTests(tests.filter(test => test.id !== id))
//     }
//   }

//   const toggleStatus = (id: number) => {
//     setTests(tests.map(test => 
//       test.id === id 
//         ? { ...test, status: test.status === "Active" ? "Draft" : "Active" }
//         : test
//     ))
//   }

//   const filteredTests = tests.filter(test => {
//     const typeMatch = filterType === "all" || test.type === filterType
//     const statusMatch = filterStatus === "all" || test.status === filterStatus
//     return typeMatch && statusMatch
//   })

//   const getStatusColor = (status: string) => {
//     switch(status) {
//       case "Active": return "bg-green-100 text-green-800"
//       case "Draft": return "bg-yellow-100 text-yellow-800"
//       default: return "bg-gray-100 text-gray-800"
//     }
//   }

//   const getTypeColor = (type: string) => {
//     return type === "Academic" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
//   }

//   const renderQuestionInput = () => {
//     switch(currentQuestion.type) {
//       case "Multiple Choice":
//         return (
//           <div className="space-y-2">
//             <Label>Javob Variantlari</Label>
//             {currentQuestion.options?.map((option, index) => (
//               <div key={index} className="flex gap-2 items-center">
//                 <Input 
//                   placeholder={`Variant ${index + 1}`}
//                   value={option}
//                   onChange={(e) => {
//                     const newOptions = [...(currentQuestion.options || [])]
//                     newOptions[index] = e.target.value
//                     setCurrentQuestion({...currentQuestion, options: newOptions})
//                   }}
//                 />
//                 <Button 
//                   type="button"
//                   variant={currentQuestion.correct === index ? "default" : "outline"}
//                   size="sm"
//                   onClick={() => setCurrentQuestion({...currentQuestion, correct: index})}
//                 >
//                   {currentQuestion.correct === index ? <CheckCircle className="h-4 w-4" /> : <XCircle className="h-4 w-4" />}
//                 </Button>
//               </div>
//             ))}
//           </div>
//         )

//       case "Sentence Completion":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Jumla (bo'sh joyni _____ bilan belgilang)</Label>
//               <Textarea 
//                 placeholder="The plant grows best in _____ conditions and requires regular watering."
//                 value={currentQuestion.sentence}
//                 onChange={(e) => setCurrentQuestion({...currentQuestion, sentence: e.target.value})}
//                 className="min-h-[100px]"
//               />
//               <p className="text-xs text-muted-foreground">
//                 💡 Maslahat: Bo'sh joyni _____ (uch yoki besh ta chiziqcha) bilan belgilang
//               </p>
//             </div>
            
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>To'g'ri Javob</Label>
//                 <Input 
//                   placeholder="sunny"
//                   value={currentQuestion.correctAnswer}
//                   onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>So'z Chegarasi</Label>
//                 <Select 
//                   value={currentQuestion.wordLimit?.toString()} 
//                   onValueChange={(value) => setCurrentQuestion({...currentQuestion, wordLimit: parseInt(value)})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="1">NO MORE THAN ONE WORD</SelectItem>
//                     <SelectItem value="2">NO MORE THAN TWO WORDS</SelectItem>
//                     <SelectItem value="3">NO MORE THAN THREE WORDS</SelectItem>
//                     <SelectItem value="4">NO MORE THAN FOUR WORDS</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
            
//             <div className="p-3 bg-gray-50 rounded-lg">
//               <Label className="text-sm font-medium">Ko'rinishi:</Label>
//               <p className="mt-1 text-sm">
//                 <span className="font-medium">Savol:</span> {currentQuestion.sentence || "Jumla kiritilmagan"}
//               </p>
//               <p className="text-xs text-muted-foreground mt-1">
//                 Talaba _____ joyiga javob yozadi ({currentQuestion.wordLimit} so'zdan ortiq emas)
//               </p>
//             </div>
//           </div>
//         )

//       case "True/False/Not Given":
//       case "Yes/No/Not Given":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Bayonot (Statement)</Label>
//               <Textarea 
//                 placeholder="Arctic ice is melting faster than expected."
//                 value={currentQuestion.sentence}
//                 onChange={(e) => setCurrentQuestion({...currentQuestion, sentence: e.target.value})}
//                 className="min-h-[80px]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>To'g'ri Javob</Label>
//               <Select 
//                 value={currentQuestion.truefalse} 
//                 onValueChange={(value) => setCurrentQuestion({...currentQuestion, truefalse: value})}
//               >
//                 <SelectTrigger>
//                   <SelectValue />
//                 </SelectTrigger>
//                 <SelectContent>
//                   {currentQuestion.type === "True/False/Not Given" ? (
//                     <>
//                       <SelectItem value="True">True</SelectItem>
//                       <SelectItem value="False">False</SelectItem>
//                       <SelectItem value="Not Given">Not Given</SelectItem>
//                     </>
//                   ) : (
//                     <>
//                       <SelectItem value="Yes">Yes</SelectItem>
//                       <SelectItem value="No">No</SelectItem>
//                       <SelectItem value="Not Given">Not Given</SelectItem>
//                     </>
//                   )}
//                 </SelectContent>
//               </Select>
//             </div>
//             <div className="p-3 bg-blue-50 rounded-lg">
//               <p className="text-sm text-blue-800">
//                 <strong>Eslatma:</strong> Talaba matnni o'qib, ushbu bayonot to'g'ri, noto'g'ri yoki umuman aytilmaganligini aniqlaydi.
//               </p>
//             </div>
//           </div>
//         )

//       case "Short Answer Questions":
//         return (
//           <div className="space-y-4">
//             <div className="grid grid-cols-2 gap-4">
//               <div className="space-y-2">
//                 <Label>To'g'ri Javob</Label>
//                 <Input 
//                   placeholder="5 PM"
//                   value={currentQuestion.correctAnswer}
//                   onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
//                 />
//               </div>
//               <div className="space-y-2">
//                 <Label>So'z Chegarasi</Label>
//                 <Select 
//                   value={currentQuestion.wordLimit?.toString()} 
//                   onValueChange={(value) => setCurrentQuestion({...currentQuestion, wordLimit: parseInt(value)})}
//                 >
//                   <SelectTrigger>
//                     <SelectValue />
//                   </SelectTrigger>
//                   <SelectContent>
//                     <SelectItem value="1">NO MORE THAN ONE WORD</SelectItem>
//                     <SelectItem value="2">NO MORE THAN TWO WORDS</SelectItem>
//                     <SelectItem value="3">NO MORE THAN THREE WORDS</SelectItem>
//                     <SelectItem value="4">NO MORE THAN FOUR WORDS</SelectItem>
//                   </SelectContent>
//                 </Select>
//               </div>
//             </div>
//           </div>
//         )

//       case "Matching Headings":
//         return (
//           <div className="space-y-4">
//             <div className="space-y-2">
//               <Label>Sarlavhalar Ro'yxati</Label>
//               <p className="text-sm text-muted-foreground">Har bir sarlavhani alohida qatorga yozing</p>
//               <Textarea 
//                 placeholder={`i. The importance of water conservation\nii. Methods of reducing energy consumption\niii. Environmental benefits of recycling\niv. Future challenges in sustainability`}
//                 value={currentQuestion.headings?.join('\n')}
//                 onChange={(e) => setCurrentQuestion({...currentQuestion, headings: e.target.value.split('\n')})}
//                 className="min-h-[120px]"
//               />
//             </div>
//             <div className="space-y-2">
//               <Label>To'g'ri Moslik (Paragraf tartib raqami)</Label>
//               <Input 
//                 placeholder="2 (ikkinchi sarlavha to'g'ri)"
//                 value={currentQuestion.correctAnswer}
//                 onChange={(e) => setCurrentQuestion({...currentQuestion, correctAnswer: e.target.value})}
//               />
//             </div>
//           </div>
//         )

//       default:
//         return (
//           <div className="p-4 bg-yellow-50 rounded-lg">
//             <p className="text-sm text-yellow-800">
//               Bu savol turi uchun interfeys hali tayyor emas. Iltimos, boshqa savol turini tanlang.
//             </p>
//           </div>
//         )
//     }
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h2 className="text-2xl font-bold">Reading Testlari</h2>
//           <p className="text-muted-foreground">IELTS Reading bo'limiga oid testlar va ma'lumotlar</p>
//         </div>
//         <div className="flex gap-2">
//           <Select value={filterType} onValueChange={setFilterType}>
//             <SelectTrigger className="w-[140px] rounded-2xl">
//               <Filter className="mr-2 h-4 w-4" />
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Barcha Turlar</SelectItem>
//               <SelectItem value="Academic">Academic</SelectItem>
//               <SelectItem value="General Training">General Training</SelectItem>
//             </SelectContent>
//           </Select>
          
//           <Select value={filterStatus} onValueChange={setFilterStatus}>
//             <SelectTrigger className="w-[120px] rounded-2xl">
//               <SelectValue />
//             </SelectTrigger>
//             <SelectContent>
//               <SelectItem value="all">Barcha Status</SelectItem>
//               <SelectItem value="Active">Faol</SelectItem>
//               <SelectItem value="Draft">Qoralama</SelectItem>
//             </SelectContent>
//           </Select>

//           <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
//             <DialogTrigger asChild>
//               <Button className="rounded-2xl">
//                 <Plus className="mr-2 h-4 w-4" />
//                 Yangi Reading Test
//               </Button>
//             </DialogTrigger>
//             <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//               <DialogHeader>
//                 <DialogTitle>Yangi Reading Test Yaratish</DialogTitle>
//                 <DialogDescription>
//                   IELTS Reading testi uchun ma'lumotlarni kiriting
//                 </DialogDescription>
//               </DialogHeader>
              
//               <Tabs defaultValue="basic" className="w-full">
//                 <TabsList className="grid w-full grid-cols-3">
//                   <TabsTrigger value="basic">Asosiy Ma'lumotlar</TabsTrigger>
//                   <TabsTrigger value="passages">Matnlar</TabsTrigger>
//                   <TabsTrigger value="preview">Ko'rish</TabsTrigger>
//                 </TabsList>
                
//                 <TabsContent value="basic" className="space-y-4">
//                   <div className="grid grid-cols-2 gap-4">
//                     <div className="space-y-2">
//                       <Label>Test Nomi</Label>
//                       <Input 
//                         placeholder="Reading Test 1"
//                         value={newTest.title}
//                         onChange={(e) => setNewTest({...newTest, title: e.target.value})}
//                       />
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Test Turi</Label>
//                       <Select value={newTest.type} onValueChange={(value) => setNewTest({...newTest, type: value})}>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Academic">Academic</SelectItem>
//                           <SelectItem value="General Training">General Training</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Qiyinchilik Darajasi</Label>
//                       <Select value={newTest.level} onValueChange={(value) => setNewTest({...newTest, level: value})}>
//                         <SelectTrigger>
//                           <SelectValue />
//                         </SelectTrigger>
//                         <SelectContent>
//                           <SelectItem value="Beginner">Boshlang'ich</SelectItem>
//                           <SelectItem value="Intermediate">O'rta</SelectItem>
//                           <SelectItem value="Advanced">Yuqori</SelectItem>
//                         </SelectContent>
//                       </Select>
//                     </div>
//                     <div className="space-y-2">
//                       <Label>Vaqt Chegarasi (daqiqa)</Label>
//                       <Input 
//                         type="number"
//                         value={newTest.timeLimit}
//                         onChange={(e) => setNewTest({...newTest, timeLimit: parseInt(e.target.value) || 60})}
//                         min="1"
//                         max="180"
//                       />
//                     </div>
//                   </div>
//                 </TabsContent>
                
//                 <TabsContent value="passages" className="space-y-4">
//                   <div className="space-y-4">
//                     <div className="flex justify-between items-center">
//                       <h3 className="text-lg font-semibold">Matn Qo'shish</h3>
//                       <Badge variant="outline">{newTest.passages.length} ta matn qo'shilgan</Badge>
//                     </div>
                    
//                     <div className="space-y-4 p-4 border rounded-lg">
//                       <div className="space-y-2">
//                         <Label>Matn Sarlavhasi</Label>
//                         <Input 
//                           placeholder="Climate Change and Arctic Wildlife"
//                           value={currentPassage.title}
//                           onChange={(e) => setCurrentPassage({...currentPassage, title: e.target.value})}
//                         />
//                       </div>
                      
//                       <div className="space-y-2">
//                         <Label>Matn Matni</Label>
//                         <Textarea 
//                           placeholder="Matn mazmunini kiriting..."
//                           className="min-h-[200px]"
//                           value={currentPassage.text}
//                           onChange={(e) => setCurrentPassage({...currentPassage, text: e.target.value})}
//                         />
//                       </div>
                      
//                       <Separator />
                      
//                       <div className="space-y-4">
//                         <h4 className="font-medium">Savollar ({currentPassage.questions.length} ta)</h4>
                        
//                         <div className="grid grid-cols-2 gap-4">
//                           <div className="space-y-2">
//                             <Label>Savol Turi</Label>
//                             <Select value={currentQuestion.type} onValueChange={(value) => setCurrentQuestion({...currentQuestion, type: value})}>
//                               <SelectTrigger>
//                                 <SelectValue />
//                               </SelectTrigger>
//                               <SelectContent>
//                                 {questionTypes.map(type => (
//                                   <SelectItem key={type} value={type}>{type}</SelectItem>
//                                 ))}
//                               </SelectContent>
//                             </Select>
//                           </div>
//                         </div>
                        
//                         <div className="space-y-2">
//                           <Label>Savol</Label>
//                           <Textarea 
//                             placeholder="Savolni kiriting..."
//                             value={currentQuestion.question}
//                             onChange={(e) => setCurrentQuestion({...currentQuestion, question: e.target.value})}
//                           />
//                         </div>
                        
//                         {renderQuestionInput()}
                        
//                         <Button onClick={addQuestion} variant="outline" size="sm">
//                           <Plus className="mr-2 h-4 w-4" />
//                           Savol Qo'shish
//                         </Button>

//                         {/* Display added questions */}
//                         {currentPassage.questions.length > 0 && (
//                           <div className="space-y-2">
//                             <Label className="text-sm font-medium">Qo'shilgan Savollar:</Label>
//                             {currentPassage.questions.map((q, index) => (
//                               <div key={index} className="p-3 bg-gray-50 rounded border">
//                                 <div className="flex justify-between items-start">
//                                   <div className="flex-1">
//                                     <Badge variant="outline" className="mb-2">{q.type}</Badge>
//                                     <p className="text-sm font-medium">{q.question}</p>
//                                     {q.sentence && (
//                                       <p className="text-xs text-muted-foreground mt-1">
//                                         Jumla: {q.sentence}
//                                       </p>
//                                     )}
//                                   </div>
//                                   <Button 
//                                     variant="outline" 
//                                     size="sm"
//                                     onClick={() => {
//                                       const updatedQuestions = [...currentPassage.questions]
//                                       updatedQuestions.splice(index, 1)
//                                       setCurrentPassage({...currentPassage, questions: updatedQuestions})
//                                     }}
//                                   >
//                                     <Trash2 className="h-4 w-4" />
//                                   </Button>
//                                 </div>
//                               </div>
//                             ))}
//                           </div>
//                         )}
//                       </div>
                      
//                       <div className="flex justify-end">
//                         <Button 
//                           onClick={addPassage} 
//                           disabled={!currentPassage.title || !currentPassage.text || currentPassage.questions.length === 0}
//                         >
//                           <Plus className="mr-2 h-4 w-4" />
//                           Matnni Saqlash
//                         </Button>
//                       </div>
//                     </div>

//                     {/* Display added passages */}
//                     {newTest.passages.length > 0 && (
//                       <div className="space-y-3">
//                         <Label className="text-sm font-medium">Qo'shilgan Matnlar:</Label>
//                         {newTest.passages.map((passage, index) => (
//                           <Card key={index} className="rounded-lg">
//                             <CardContent className="p-4">
//                               <div className="flex justify-between items-start">
//                                 <div>
//                                   <h4 className="font-medium">{passage.title}</h4>
//                                   <p className="text-sm text-muted-foreground">
//                                     {passage.questions.length} ta savol
//                                   </p>
//                                   <p className="text-xs text-muted-foreground">
//                                     {passage.text.substring(0, 100)}...
//                                   </p>
//                                 </div>
//                                 <Button 
//                                   variant="outline" 
//                                   size="sm"
//                                   onClick={() => {
//                                     const updatedPassages = [...newTest.passages]
//                                     updatedPassages.splice(index, 1)
//                                     setNewTest({...newTest, passages: updatedPassages})
//                                   }}
//                                 >
//                                   <Trash2 className="h-4 w-4" />
//                                 </Button>
//                               </div>
//                             </CardContent>
//                           </Card>
//                         ))}
//                       </div>
//                     )}
//                   </div>
//                 </TabsContent>
                
//                 <TabsContent value="preview" className="space-y-4">
//                   <div className="space-y-4">
//                     <h3 className="text-lg font-semibold">Test Haqida</h3>
//                     <div className="grid grid-cols-2 gap-4">
//                       <div>
//                         <Label className="text-sm text-muted-foreground">Nomi</Label>
//                         <p className="font-medium">{newTest.title || "Noma'lum"}</p>
//                       </div>
//                       <div>
//                         <Label className="text-sm text-muted-foreground">Turi</Label>
//                         <Badge className={getTypeColor(newTest.type)}>{newTest.type}</Badge>
//                       </div>
//                       <div>
//                         <Label className="text-sm text-muted-foreground">Daraja</Label>
//                         <p className="font-medium">{newTest.level}</p>
//                       </div>
//                       <div>
//                         <Label className="text-sm text-muted-foreground">Vaqt</Label>
//                         <p className="font-medium">{newTest.timeLimit} daqiqa</p>
//                       </div>
//                     </div>
                    
//                     <Separator />
                    
//                     <div>
//                       <Label className="text-sm text-muted-foreground">Matnlar va Savollar</Label>
//                       {newTest.passages.length === 0 ? (
//                         <p className="text-sm text-muted-foreground mt-2">Hech qanday matn qo'shilmagan</p>
//                       ) : (
//                         newTest.passages.map((passage, index) => (
//                           <div key={index} className="mt-2 p-3 border rounded">
//                             <h4 className="font-medium">{passage.title}</h4>
//                             <p className="text-sm text-muted-foreground">{passage.questions.length} ta savol</p>
//                             <div className="mt-2 space-y-1">
//                               {passage.questions.map((q, qIndex) => (
//                                 <div key={qIndex} className="flex items-center gap-2">
//                                   <Badge variant="outline" className="text-xs">{q.type}</Badge>
//                                   <span className="text-xs text-muted-foreground">
//                                     {q.question.substring(0, 50)}...
//                                   </span>
//                                 </div>
//                               ))}
//                             </div>
//                           </div>
//                         ))
//                       )}
//                     </div>
                    
//                     <div className="flex justify-end gap-2">
//                       <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
//                         Bekor Qilish
//                       </Button>
//                       <Button 
//                         onClick={createTest} 
//                         disabled={!newTest.title.trim() || newTest.passages.length === 0}
//                       >
//                         Test Yaratish
//                       </Button>
//                     </div>
//                   </div>
//                 </TabsContent>
//               </Tabs>
//             </DialogContent>
//           </Dialog>
//         </div>
//       </div>

//       {/* Statistics Cards */}
//       <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
//         <Card className="rounded-3xl">
//           <CardContent className="p-6">
//             <div className="flex items-center space-x-2">
//               <BookOpen className="h-8 w-8 text-blue-600" />
//               <div>
//                 <p className="text-2xl font-bold">{tests.length}</p>
//                 <p className="text-sm text-muted-foreground">Jami Testlar</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card className="rounded-3xl">
//           <CardContent className="p-6">
//             <div className="flex items-center space-x-2">
//               <CheckCircle className="h-8 w-8 text-green-600" />
//               <div>
//                 <p className="text-2xl font-bold">{tests.filter(t => t.status === "Active").length}</p>
//                 <p className="text-sm text-muted-foreground">Faol Testlar</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card className="rounded-3xl">
//           <CardContent className="p-6">
//             <div className="flex items-center space-x-2">
//               <Users className="h-8 w-8 text-purple-600" />
//               <div>
//                 <p className="text-2xl font-bold">{tests.reduce((sum, test) => sum + test.attempts, 0)}</p>
//                 <p className="text-sm text-muted-foreground">Jami Urinishlar</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
        
//         <Card className="rounded-3xl">
//           <CardContent className="p-6">
//             <div className="flex items-center space-x-2">
//               <BarChart3 className="h-8 w-8 text-orange-600" />
//               <div>
//                 <p className="text-2xl font-bold">
//                   {tests.length > 0 ? (tests.reduce((sum, test) => sum + test.avgScore, 0) / tests.length).toFixed(1) : '0.0'}
//                 </p>
//                 <p className="text-sm text-muted-foreground">O'rtacha Ball</p>
//               </div>
//             </div>
//           </CardContent>
//         </Card>
//       </div>

//       {/* Tests List */}    
//       <Card className="rounded-3xl border-2">
//         <CardHeader>
//           <CardTitle>Reading Testlar Ro'yxati</CardTitle>
//           <CardDescription>
//             IELTS Reading testlari va ularning statistikasi ({filteredTests.length} ta test)
//           </CardDescription>
//         </CardHeader>
//         <CardContent>
//           {filteredTests.length === 0 ? (
//             <div className="text-center py-8">
//               <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
//               <p className="text-muted-foreground mt-2">
//                 {filterType !== "all" || filterStatus !== "all" 
//                   ? "Filter shartlariga mos test topilmadi."
//                   : "Hech qanday test topilmadi. Yangi test yaratish uchun yuqoridagi tugmani bosing."
//                 }
//               </p>
//             </div>
//           ) : (
//             <div className="space-y-4">
//               {filteredTests.map((test) => (
//                 <Card key={test.id} className="rounded-2xl">
//                   <CardContent className="p-6">
//                     <div className="flex items-center justify-between">
//                       <div className="space-y-2">
//                         <div className="flex items-center gap-2">
//                           <h3 className="text-lg font-semibold">{test.title}</h3>
//                           <Badge className={getTypeColor(test.type)}>{test.type}</Badge>
//                           <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
//                           <Badge variant="secondary">{test.level}</Badge>
//                         </div>
//                         <div className="flex items-center gap-4 text-sm text-muted-foreground">
//                           <div className="flex items-center gap-1">
//                             <FileText className="h-4 w-4" />
//                             <span>{test.passages} ta matn</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Target className="h-4 w-4" />
//                             <span>{test.questions} ta savol</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Clock className="h-4 w-4" />
//                             <span>{test.timeLimit} daqiqa</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <Users className="h-4 w-4" />
//                             <span>{test.attempts} urinish</span>
//                           </div>
//                           <div className="flex items-center gap-1">
//                             <BarChart3 className="h-4 w-4" />
//                             <span>{test.avgScore.toFixed(1)} o'rtacha ball</span>
//                           </div>
//                         </div>
//                         <p className="text-xs text-muted-foreground">
//                           Yaratilgan: {test.createdAt}
//                         </p>
//                       </div>
                      
//                       <div className="flex items-center gap-2">
//                         <Dialog>
//                           <DialogTrigger asChild>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               onClick={() => setSelectedTest(test)}
//                             >
//                               <Eye className="h-4 w-4" />
//                             </Button>
//                           </DialogTrigger>
//                           <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
//                             <DialogHeader>
//                               <DialogTitle>{selectedTest?.title}</DialogTitle>
//                               <DialogDescription>Test tafsilotlari va savollar</DialogDescription>
//                             </DialogHeader>
//                             {selectedTest && (
//                               <div className="space-y-4">
//                                 <div className="grid grid-cols-2 gap-4">
//                                   <div>
//                                     <Label className="text-sm text-muted-foreground">Test Turi</Label>
//                                     <div className="mt-1">
//                                       <Badge className={getTypeColor(selectedTest.type)}>{selectedTest.type}</Badge>
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <Label className="text-sm text-muted-foreground">Status</Label>
//                                     <div className="mt-1">
//                                       <Badge className={getStatusColor(selectedTest.status)}>{selectedTest.status}</Badge>
//                                     </div>
//                                   </div>
//                                   <div>
//                                     <Label className="text-sm text-muted-foreground">Daraja</Label>
//                                     <p className="mt-1">{selectedTest.level}</p>
//                                   </div>
//                                   <div>
//                                     <Label className="text-sm text-muted-foreground">Vaqt Chegarasi</Label>
//                                     <p className="mt-1">{selectedTest.timeLimit} daqiqa</p>
//                                   </div>
//                                   <div>
//                                     <Label className="text-sm text-muted-foreground">Urinishlar Soni</Label>
//                                     <p className="mt-1">{selectedTest.attempts}</p>
//                                   </div>
//                                   <div>
//                                     <Label className="text-sm text-muted-foreground">O'rtacha Ball</Label>
//                                     <p className="mt-1">{selectedTest.avgScore.toFixed(1)}</p>
//                                   </div>
//                                 </div>
                                
//                                 <Separator />
                                
//                                 {selectedTest.passages_data.length > 0 ? (
//                                   <div className="space-y-4">
//                                     <h3 className="text-lg font-semibold">Matnlar va Savollar</h3>
//                                     {selectedTest.passages_data.map((passage, index) => (
//                                       <Card key={index} className="rounded-lg">
//                                         <CardHeader>
//                                           <CardTitle className="text-base">
//                                             {index + 1}. {passage.title}
//                                           </CardTitle>
//                                         </CardHeader>
//                                         <CardContent>
//                                           <div className="space-y-4">
//                                             <div>
//                                               <Label className="text-sm font-medium text-muted-foreground">Matn:</Label>
//                                               <div className="mt-1 p-3 bg-gray-50 rounded text-sm max-h-32 overflow-y-auto">
//                                                 {passage.text}
//                                               </div>
//                                             </div>
                                            
//                                             <div className="space-y-3">
//                                               <Label className="text-sm font-medium">
//                                                 Savollar ({passage.questions?.length || 0} ta)
//                                               </Label>
//                                               {passage.questions?.map((question, qIndex) => (
//                                                 <div key={qIndex} className="p-3 border rounded">
//                                                   <div className="space-y-2">
//                                                     <div className="flex items-center gap-2">
//                                                       <Badge variant="outline">{question.type}</Badge>
//                                                       <span className="text-xs text-muted-foreground">
//                                                         Savol {qIndex + 1}
//                                                       </span>
//                                                     </div>
//                                                     <p className="text-sm font-medium">{question.question}</p>
                                                    
//                                                     {question.type === "Multiple Choice" && question.options && (
//                                                       <div className="space-y-1 ml-4">
//                                                         {question.options.map((option, optIndex) => (
//                                                           <div key={optIndex} className="flex items-center gap-2">
//                                                             <span className="text-xs text-muted-foreground w-4">
//                                                               {String.fromCharCode(65 + optIndex)}.
//                                                             </span>
//                                                             <span className={`text-xs ${question.correct === optIndex ? 'font-bold text-green-600' : ''}`}>
//                                                               {option}
//                                                             </span>
//                                                             {question.correct === optIndex && (
//                                                               <CheckCircle className="h-3 w-3 text-green-600" />
//                                                             )}
//                                                           </div>
//                                                         ))}
//                                                       </div>
//                                                     )}
                                                    
//                                                     {question.type === "Sentence Completion" && (
//                                                       <div className="space-y-1 ml-4">
//                                                         <div className="text-xs">
//                                                           <span className="text-muted-foreground">Jumla:</span>
//                                                           <span className="ml-1 font-mono bg-gray-100 px-1 rounded">
//                                                             {question.sentence}
//                                                           </span>
//                                                         </div>
//                                                         <div className="text-xs">
//                                                           <span className="text-muted-foreground">To'g'ri javob:</span>
//                                                           <span className="ml-1 font-bold text-green-600">
//                                                             {question.correctAnswer}
//                                                           </span>
//                                                         </div>
//                                                         <div className="text-xs text-muted-foreground">
//                                                           So'z chegarasi: {question.wordLimit} so'z
//                                                         </div>
//                                                       </div>
//                                                     )}
                                                    
//                                                     {(question.type === "True/False/Not Given" || question.type === "Yes/No/Not Given") && (
//                                                       <div className="space-y-1 ml-4">
//                                                         <div className="text-xs">
//                                                           <span className="text-muted-foreground">Bayonot:</span>
//                                                           <span className="ml-1 italic">
//                                                             {question.sentence}
//                                                           </span>
//                                                         </div>
//                                                         <div className="text-xs">
//                                                           <span className="text-muted-foreground">To'g'ri javob:</span>
//                                                           <span className="ml-1 font-bold text-green-600">
//                                                             {question.truefalse}
//                                                           </span>
//                                                         </div>
//                                                       </div>
//                                                     )}
                                                    
//                                                     {question.type === "Short Answer Questions" && (
//                                                       <div className="space-y-1 ml-4">
//                                                         <div className="text-xs">
//                                                           <span className="text-muted-foreground">To'g'ri javob:</span>
//                                                           <span className="ml-1 font-bold text-green-600">
//                                                             {question.correctAnswer}
//                                                           </span>
//                                                         </div>
//                                                         <div className="text-xs text-muted-foreground">
//                                                           So'z chegarasi: {question.wordLimit} so'z
//                                                         </div>
//                                                       </div>
//                                                     )}

//                                                     {question.type === "Matching Headings" && (
//                                                       <div className="space-y-1 ml-4">
//                                                         <div className="text-xs">
//                                                           <span className="text-muted-foreground">Sarlavhalar:</span>
//                                                           <div className="mt-1 text-xs font-mono bg-gray-100 p-2 rounded">
//                                                             {question.headings?.join('\n')}
//                                                           </div>
//                                                         </div>
//                                                         <div className="text-xs">
//                                                           <span className="text-muted-foreground">To'g'ri javob:</span>
//                                                           <span className="ml-1 font-bold text-green-600">
//                                                             {question.correctAnswer}
//                                                           </span>
//                                                         </div>
//                                                       </div>
//                                                     )}
//                                                   </div>
//                                                 </div>
//                                               ))}
//                                             </div>
//                                           </div>
//                                         </CardContent>
//                                       </Card>
//                                     ))}
//                                   </div>
//                                 ) : (
//                                   <div className="text-center py-6">
//                                     <FileText className="mx-auto h-8 w-8 text-muted-foreground" />
//                                     <p className="text-sm text-muted-foreground mt-2">
//                                       Bu testda matnlar mavjud emas
//                                     </p>
//                                   </div>
//                                 )}
//                               </div>
//                             )}
//                           </DialogContent>
//                         </Dialog>
                        
//                         <Button variant="outline" size="sm">
//                           <Edit className="h-4 w-4" />
//                         </Button>
                        
//                         <Button 
//                           variant={test.status === "Active" ? "default" : "outline"} 
//                           size="sm"
//                           onClick={() => toggleStatus(test.id)}
//                         >
//                           {test.status === "Active" ? (
//                             <>
//                               <AlertCircle className="h-4 w-4" />
//                             </>
//                           ) : (
//                             <>
//                               <CheckCircle className="h-4 w-4" />
//                             </>
//                           )}
//                         </Button>
                        
//                         <Button 
//                           variant="outline" 
//                           size="sm" 
//                           onClick={() => deleteTest(test.id)}
//                           className="hover:bg-red-50 hover:text-red-600"
//                         >
//                           <Trash2 className="h-4 w-4" />
//                         </Button>
//                       </div>
//                     </div>
//                   </CardContent>
//                 </Card>
//               ))}
//             </div>
//           )}
//         </CardContent>
//       </Card>
//     </div>
//   )
// }






// "use client"

// import React from "react"

// // API bilan ishlash uchun
// import ReadingAdminWithAPI from "./reading_file/ReadingAdminWithAPI"

// // Local versiya (backup uchun):
// // import ReadingAdmin from "./reading_file/ReadingAdmin"

// export default function ReadingPage() {
//   return (
//     <div className="container mx-auto py-6">
//       {/* API bilan ishlaydigan versiya */}
//       <ReadingAdminWithAPI />
      
//       {/* Agar API ishlamasa, quyidagini ishlatishingiz mumkin:
//       <ReadingAdmin />
//       */}
//     </div>
//   )
// }




// "use client"

// import React from "react"

// // Yangilangan API versiyasini import qiling
// import ReadingAdminWithAPIUpdated from "./reading_file/ReadingAdminWithAPI"

// // Eski versiya (backup uchun):
// // import ReadingAdminWithAPI from "./reading_file/ReadingAdminWithAPI"
// // import ReadingAdmin from "./reading_file/ReadingAdmin"

// export default function ReadingPage() {
//   return (
//     <div className="container mx-auto py-6">
//       {/* Yangilangan versiya - test viewer bilan */}
//       <ReadingAdminWithAPIUpdated />
      
//       {/* Agar yangi versiya ishlamasa, eskisini ishlatishingiz mumkin:
//       <ReadingAdminWithAPI />
//       */}
//     </div>
//   )
// }






// reading.tsx - Backendga bog'langan versiya
"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { 
  Filter, 
  Plus, 
  Edit, 
  Trash2, 
  Eye, 
  Clock, 
  Users, 
  BookOpen,
  FileText,
  BarChart3,
  Target,
  CheckCircle,
  AlertCircle,
  Loader2,
  Wifi,
  WifiOff,
  RefreshCw,
  Play,
  Settings
} from "lucide-react"

// Import API va components
import { readingLocalAPI as readingTestAPI, TestResponse, CreateTestRequest, TestStats } from "./reading_file/readingLocalAPI"
import CreateReadingTest from "./reading_file/CreateReadingTest"
import ReadingTestViewer from "./reading_file/ReadingTestViewer"

export default function ReadingWithBackend() {
  // State management
  const [tests, setTests] = useState<TestResponse[]>([])
  const [loading, setLoading] = useState(true)
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)
  const [selectedTest, setSelectedTest] = useState<TestResponse | null>(null)
  const [viewMode, setViewMode] = useState<'list' | 'viewer'>('list')
  const [testViewerMode, setTestViewerMode] = useState<'preview' | 'practice' | 'exam'>('preview')
  const [filterType, setFilterType] = useState("all")
  const [filterStatus, setFilterStatus] = useState("all")
  const [apiError, setApiError] = useState<string | null>(null)
  const [isOnline, setIsOnline] = useState<boolean | null>(null)
  const [toggleLoading, setToggleLoading] = useState<Set<string>>(new Set())
  const [stats, setStats] = useState<TestStats>({
    totalTests: 0,
    activeTests: 0,
    totalAttempts: 0,
    averageScore: 0
  })

  // Connection check
  const checkConnection = async () => {
    try {
      const connected = await readingTestAPI.testConnection()
      setIsOnline(connected)
      if (connected) {
        setApiError(null)
      } else {
        setApiError("Backend bilan bog'lanish mumkin emas")
      }
      return connected
    } catch (error) {
      setIsOnline(false)
      setApiError("Server xatoligi")
      return false
    }
  }

  // Load data
  const loadData = async () => {
    try {
      setLoading(true)
      setApiError(null)
      
      const connected = await checkConnection()
      if (!connected) {
        throw new Error("Backend connection failed")
      }

      // Load tests and stats in parallel
      const [testsData, statsData] = await Promise.all([
        readingTestAPI.getAllTests({
          type: filterType !== "all" ? filterType : undefined,
          status: filterStatus !== "all" ? filterStatus : undefined
        }),
        readingTestAPI.getTestStats()
      ])

      setTests(testsData)
      setStats(statsData)
      setIsOnline(true)
      
    } catch (error) {
      console.error('Error loading data:', error)
      setApiError(error instanceof Error ? error.message : "Ma'lumotlarni yuklashda xatolik")
      setIsOnline(false)
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadData()
  }, [])

  // Reload when filters change
  useEffect(() => {
    if (isOnline) {
      loadData()
    }
  }, [filterType, filterStatus])

  // Handle test creation
  const handleTestCreate = async (testData: any) => {
    try {
      const createRequest: CreateTestRequest = {
        title: testData.title,
        type: testData.type,
        level: testData.level,
        timeLimit: testData.timeLimit,
        passages_data: testData.passages_data
      }

      const newTest = await readingTestAPI.createTest(createRequest)
      
      // Update local state
      setTests(prev => [newTest, ...prev])
      
      // Reload stats
      const newStats = await readingTestAPI.getTestStats()
      setStats(newStats)
      
      // Show success message
      alert(`"${newTest.title}" testi muvaffaqiyatli yaratildi!`)
      
    } catch (error) {
      console.error('Error creating test:', error)
      const errorMessage = error instanceof Error ? error.message : 'Test yaratishda xatolik yuz berdi!'
      alert(`Xatolik: ${errorMessage}`)
      throw error
    }
  }

  // Delete test
  const deleteTest = async (id: number) => {
    if (!window.confirm("Rostdan ham bu testni o'chirmoqchimisiz?")) return

    try {
      await readingTestAPI.deleteTest(id)
      setTests(tests.filter(test => test.id !== id))
      
      // Reload stats
      const newStats = await readingTestAPI.getTestStats()
      setStats(newStats)
      
      alert('Test muvaffaqiyatli o\'chirildi!')
    } catch (error) {
      console.error('Error deleting test:', error)
      alert('Test o\'chirishda xatolik yuz berdi!')
    }
  }

  // Toggle test status
  const toggleStatus = async (id: number) => {
    if (toggleLoading.has(id)) return
    
    try {
      setToggleLoading(prev => new Set([...prev, id]))
      
      const updatedTest = await readingTestAPI.toggleTestStatus(id)
      setTests(tests.map(test => 
        test.id === id ? updatedTest : test
      ))
      
      // Reload stats
      const newStats = await readingTestAPI.getTestStats()
      setStats(newStats)
      
    } catch (error) {
      console.error('Error toggling test status:', error)
      alert('Test statusini o\'zgartirishda xatolik yuz berdi!')
    } finally {
      setToggleLoading(prev => {
        const newSet = new Set(prev)
        newSet.delete(id)
        return newSet
      })
    }
  }

  // Handle test view
  const handleViewTest = (test: TestResponse, mode: 'preview' | 'practice' | 'exam' = 'preview') => {
    setSelectedTest(test)
    setTestViewerMode(mode)
    setViewMode('viewer')
  }

  // Back to list
  const handleBackToList = () => {
    setViewMode('list')
    setSelectedTest(null)
  }

  // Retry connection
  const retryConnection = async () => {
    setLoading(true)
    await loadData()
  }

  const filteredTests = tests.filter(test => {
    const typeMatch = filterType === "all" || test.type === filterType
    const statusMatch = filterStatus === "all" || test.status === filterStatus
    return typeMatch && statusMatch
  })

  const getStatusColor = (status: string) => {
    switch(status) {
      case "Active": return "bg-green-100 text-green-800"
      case "Draft": return "bg-yellow-100 text-yellow-800"
      default: return "bg-gray-100 text-gray-800"
    }
  }

  const getTypeColor = (type: string) => {
    return type === "Academic" ? "bg-blue-100 text-blue-800" : "bg-purple-100 text-purple-800"
  }

  // Show test viewer if selected
  if (viewMode === 'viewer' && selectedTest) {
    return (
      <ReadingTestViewer
        testData={selectedTest}
        onBack={handleBackToList}
        mode={testViewerMode}
      />
    )
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Backend bilan bog'lanmoqda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Connection Status Alert */}
      {(apiError || isOnline === false) && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <WifiOff className="h-4 w-4" />
          <AlertDescription className="flex items-center justify-between">
            <span>{apiError || "Backend bilan bog'lanish yo'q"}</span>
            <Button 
              variant="outline" 
              size="sm"
              onClick={retryConnection}
              disabled={loading}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
              Qayta urinish
            </Button>
          </AlertDescription>
        </Alert>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-2">
            Reading Testlari
            {isOnline === true ? (
              <Badge variant="outline" className="text-green-600 border-green-600">
                <Wifi className="h-3 w-3 mr-1" />
                Online
              </Badge>
            ) : isOnline === false ? (
              <Badge variant="outline" className="text-red-600 border-red-600">
                <WifiOff className="h-3 w-3 mr-1" />
                Offline
              </Badge>
            ) : (
              <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                Checking...
              </Badge>
            )}
          </h2>
          <p className="text-muted-foreground">IELTS Reading bo'limiga oid testlar va ma'lumotlar</p>
        </div>
        <div className="flex gap-2">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-[140px] rounded-2xl">
              <Filter className="mr-2 h-4 w-4" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha Turlar</SelectItem>
              <SelectItem value="Academic">Academic</SelectItem>
              <SelectItem value="General Training">General Training</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-[120px] rounded-2xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Barcha Status</SelectItem>
              <SelectItem value="Active">Faol</SelectItem>
              <SelectItem value="Draft">Qoralama</SelectItem>
            </SelectContent>
          </Select>

          <Button 
            className="rounded-2xl"
            onClick={() => setIsCreateDialogOpen(true)}
            disabled={isOnline === false}
          >
            <Plus className="mr-2 h-4 w-4" />
            Yangi Reading Test
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BookOpen className="h-8 w-8 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalTests}</p>
                <p className="text-sm text-muted-foreground">Jami Testlar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{stats.activeTests}</p>
                <p className="text-sm text-muted-foreground">Faol Testlar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <Users className="h-8 w-8 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{stats.totalAttempts}</p>
                <p className="text-sm text-muted-foreground">Jami Urinishlar</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="rounded-3xl">
          <CardContent className="p-6">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-8 w-8 text-orange-600" />
              <div>
                <p className="text-2xl font-bold">{stats.averageScore.toFixed(1)}</p>
                <p className="text-sm text-muted-foreground">O'rtacha Ball</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tests List */}    
      <Card className="rounded-3xl border-2">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Reading Testlar Ro'yxati</span>
            <Button
              variant="outline"
              size="sm"
              onClick={loadData}
              disabled={loading || isOnline === false}
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                'Yangilash'
              )}
            </Button>
          </CardTitle>
          <CardDescription>
            IELTS Reading testlari va ularning statistikasi ({filteredTests.length} ta test)
            {isOnline === false && " - Offline rejimi"}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {filteredTests.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="mx-auto h-12 w-12 text-muted-foreground" />
              <p className="text-muted-foreground mt-2">
                {filterType !== "all" || filterStatus !== "all" 
                  ? "Filter shartlariga mos test topilmadi."
                  : isOnline === false
                  ? "Backend bilan bog'lanib bo'lmayapti."
                  : "Hech qanday test topilmadi. Yangi test yaratish uchun yuqoridagi tugmani bosing."
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredTests.map((test) => (
                <Card key={test.id} className="rounded-2xl">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <h3 className="text-lg font-semibold">{test.title}</h3>
                          <Badge className={getTypeColor(test.type)}>{test.type}</Badge>
                          <Badge className={getStatusColor(test.status)}>{test.status}</Badge>
                          <Badge variant="secondary">{test.level}</Badge>
                          {isOnline === false && (
                            <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                              Cached
                            </Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <FileText className="h-4 w-4" />
                            <span>{test.passages} ta matn</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>{test.questions} ta savol</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            <span>{test.timeLimit} daqiqa</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Users className="h-4 w-4" />
                            <span>{test.attempts} urinish</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <BarChart3 className="h-4 w-4" />
                            <span>{test.avgScore.toFixed(1)} o'rtacha ball</span>
                          </div>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          Yaratilgan: {new Date(test.createdAt).toLocaleDateString('uz-UZ')}
                          {test.updatedAt && test.updatedAt !== test.createdAt && (
                            <span> • Yangilangan: {new Date(test.updatedAt).toLocaleDateString('uz-UZ')}</span>
                          )}
                        </p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        {/* View Test Button */}
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => handleViewTest(test, 'preview')}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Ko'rish
                        </Button>

                        {/* Practice Button */}
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleViewTest(test, 'practice')}
                        >
                          <Play className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm"
                          disabled={isOnline === false}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        
                        <Button 
                          variant={test.status === "Active" ? "default" : "outline"} 
                          size="sm"
                          onClick={() => toggleStatus(test.id)}
                          disabled={toggleLoading.has(test.id) || isOnline === false}
                        >
                          {toggleLoading.has(test.id) ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : test.status === "Active" ? (
                            <AlertCircle className="h-4 w-4" />
                          ) : (
                            <CheckCircle className="h-4 w-4" />
                          )}
                        </Button>
                        
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => deleteTest(test.id)}
                          className="hover:bg-red-50 hover:text-red-600"
                          disabled={isOnline === false}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Reading Test Component */}
      <CreateReadingTest
        isOpen={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onTestCreate={handleTestCreate}
      />
    </div>
  )
}