import React from 'react'
import { X, Download, Share2, Copy } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface CertificatePreviewProps {
  isOpen: boolean
  onClose: () => void
  certificate: {
    id: string
    studentName: string
    course: string
    issueDate: string
    score: number
    grade: string
  }
}

export function CertificatePreview({ isOpen, onClose, certificate }: CertificatePreviewProps) {
  const handleDownload = () => {
    // Download functionality - convert to PDF
    console.log('Downloading certificate:', certificate.id)
  }

  const handleShare = () => {
    // Share functionality
    console.log('Sharing certificate:', certificate.id)
  }

  const handleCopy = () => {
    // Copy certificate URL
    navigator.clipboard.writeText(`https://certifyuz.com/verify/${certificate.id}`)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl w-full max-h-[90vh] p-0 overflow-hidden rounded-3xl">
        {/* Header with actions */}
        <div className="flex items-center justify-between p-6 border-b bg-white/95 backdrop-blur-sm">
          <div>
            <h2 className="text-xl font-bold">Sertifikat Ko'rish</h2>
            <p className="text-sm text-muted-foreground">ID: {certificate.id}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={handleDownload} className="rounded-2xl">
              <Download className="h-4 w-4 mr-1" />
              PDF
            </Button>
            <Button variant="outline" size="sm" onClick={handleShare} className="rounded-2xl">
              <Share2 className="h-4 w-4 mr-1" />
              Ulashish
            </Button>
            <Button variant="outline" size="sm" onClick={handleCopy} className="rounded-2xl">
              <Copy className="h-4 w-4 mr-1" />
              Link
            </Button>
            <Button variant="ghost" size="sm" onClick={onClose} className="rounded-2xl">
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Certificate Preview - A4 Format */}
        <div className="p-8 bg-gray-100 overflow-auto">
          <div className="mx-auto bg-white shadow-2xl" style={{
            width: '794px',  // A4 width in pixels (96 DPI)
            height: '1123px', // A4 height in pixels (96 DPI)
            minHeight: '1123px'
          }}>
            {/* Certificate Content */}
            <div className="relative w-full h-full p-16 overflow-hidden">
              {/* Background Elements */}
              <div className="absolute inset-0">
                {/* Geometric shapes in background */}
                <div className="absolute top-0 right-0 w-96 h-96 opacity-10">
                  <svg viewBox="0 0 200 200" className="w-full h-full">
                    <defs>
                      <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#3B82F6" />
                        <stop offset="100%" stopColor="#8B5CF6" />
                      </linearGradient>
                    </defs>
                    <polygon points="100,20 180,60 180,140 100,180 20,140 20,60" fill="url(#grad1)" />
                  </svg>
                </div>
                
                {/* Left side geometric pattern */}
                <div className="absolute bottom-0 left-0 w-64 h-64 opacity-5">
                  <svg viewBox="0 0 100 100" className="w-full h-full">
                    <path d="M20,20 L80,20 L80,80 L20,80 Z M30,30 L70,30 L70,70 L30,70 Z M40,40 L60,40 L60,60 L40,60 Z" 
                          fill="currentColor" stroke="currentColor" strokeWidth="0.5"/>
                  </svg>
                </div>
              </div>

              {/* Header Logos */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center gap-4">
                  {/* IT PARK Logo Placeholder */}
                  <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-blue-500 rounded-2xl flex items-center justify-center text-white font-bold text-sm">
                    IT
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-medium text-gray-600">IT PARK</div>
                    <div className="text-xs text-gray-500">START local & GO global</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-600">MINISTRY OF</div>
                    <div className="text-xs text-gray-500">DIGITAL TECHNOLOGIES</div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                      UZ
                    </div>
                    <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center text-white font-bold text-xs">
                      CORP
                    </div>
                  </div>
                </div>
              </div>

              {/* Certificate Title */}
              <div className="text-center mb-12">
                <h1 className="text-5xl font-bold text-gray-800 tracking-wider mb-2">
                  CERTIFICATE
                </h1>
                <p className="text-xl text-gray-600 tracking-widest">
                  OF COMPLETION
                </p>
                <div className="w-32 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto mt-4"></div>
              </div>

              {/* Presented To Section */}
              <div className="text-center mb-8">
                <p className="text-lg font-medium text-gray-700 tracking-wider mb-6">
                  IS PRESENTED TO
                </p>
                
                {/* Student Name */}
                <div className="mb-8">
                  <h2 className="text-4xl font-serif italic text-gray-800 mb-2">
                    {certificate.studentName}
                  </h2>
                  <div className="w-96 h-0.5 bg-gray-300 mx-auto"></div>
                </div>

                {/* Course Info */}
                <div className="mb-12">
                  <p className="text-lg text-gray-700 mb-2">
                    Has successfully completed
                  </p>
                  <p className="text-2xl font-semibold text-gray-800 mb-4">
                    "{certificate.course}" course
                  </p>
                  
                  {/* Score and Grade */}
                  <div className="flex justify-center gap-8 mt-6">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">{certificate.score}</div>
                      <div className="text-sm text-gray-500">Score</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">{certificate.grade}</div>
                      <div className="text-sm text-gray-500">Grade</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer Section */}
              <div className="absolute bottom-16 left-16 right-16">
                <div className="flex justify-between items-end">
                  {/* Left Signature */}
                  <div className="text-center">
                    <div className="w-32 h-16 bg-blue-100 rounded-xl mb-2 flex items-center justify-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                        SEAL
                      </div>
                    </div>
                    <div className="text-sm font-semibold">ADHAM ABDULLAYEV</div>
                    <div className="text-xs text-gray-500">DIRECTOR OF IT PARK</div>
                  </div>

                  {/* Right side - QR and Date */}
                  <div className="text-center">
                    <div className="flex items-end gap-6">
                      {/* QR Code */}
                      <div>
                        <div className="w-20 h-20 bg-gray-200 border-2 border-gray-300 flex items-center justify-center mb-2">
                          <div className="text-xs text-gray-500">QR</div>
                        </div>
                        <div className="text-xs font-mono">{certificate.id}</div>
                      </div>
                      
                      {/* Date */}
                      <div>
                        <div className="text-right mb-4">
                          <div className="text-lg font-semibold">{certificate.issueDate}</div>
                          <div className="w-24 h-0.5 bg-gray-300"></div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-sm font-semibold mt-4">DAVRON MAMATOV</div>
                    <div className="text-xs text-gray-500">DIRECTOR OF UZCORP</div>
                  </div>
                </div>
              </div>

              {/* Decorative Elements */}
              <div className="absolute top-1/2 right-8 transform -translate-y-1/2 opacity-20">
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <path d="M60 20 L80 40 L60 60 L40 40 Z M60 60 L80 80 L60 100 L40 80 Z" 
                        fill="none" stroke="currentColor" strokeWidth="1"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}