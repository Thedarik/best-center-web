"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Eye, EyeOff, Lock, User, Shield, AlertCircle, CheckCircle } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface LoginPageProps {
  onAdminLogin: () => void      // Oddiy admin uchun
  onSuperAdminLogin: () => void // Super admin uchun
}

export function LoginPage({ onAdminLogin, onSuperAdminLogin }: LoginPageProps) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const [success, setSuccess] = useState(false)
  const [userType, setUserType] = useState<"admin" | "superadmin" | null>(null)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")
    setSuccess(false)
    setUserType(null)

    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500))

    // Check for different user types
    if (username === "admin" && password === "admin123") {
      setSuccess(true)
      setUserType("admin")
      setTimeout(() => {
        onAdminLogin() // Oddiy admin uchun admin.tsx sahifasiga yo'naltirish
      }, 1000)
    } else if (username === "superadmin" && password === "admin123") {
      setSuccess(true)
      setUserType("superadmin")
      setTimeout(() => {
        onSuperAdminLogin() // Super admin uchun certificate-dashboard.tsx sahifasiga yo'naltirish
      }, 1000)
    } else {
      setError("Foydalanuvchi nomi yoki parol noto'g'ri. Qaytadan urinib ko'ring.")
    }

    setIsLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background relative overflow-hidden">
      {/* Animated Background */}
      <motion.div
        className="absolute inset-0 -z-10"
        animate={{
          background: [
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 25%, rgba(34, 197, 94, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 80% 20%, rgba(147, 51, 234, 0.3) 0%, rgba(34, 197, 94, 0.2) 25%, rgba(59, 130, 246, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 40% 40%, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.2) 25%, rgba(147, 51, 234, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
            "radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.3) 0%, rgba(147, 51, 234, 0.2) 25%, rgba(34, 197, 94, 0.1) 50%, rgba(0, 0, 0, 0) 100%)",
          ],
        }}
        transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
      />

      {/* Floating Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-blue-500/10 to-purple-500/10 backdrop-blur-sm"
            animate={{
              x: [0, 120, 0],
              y: [0, -120, 0],
              rotate: [0, 180, 360],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 12 + i * 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            }}
            style={{
              left: `${5 + i * 12}%`,
              top: `${5 + i * 11}%`,
            }}
          />
        ))}
      </div>

      <div className="w-full max-w-md p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          {/* Logo and Brand */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5, type: "spring" }}
              className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br from-blue-600 via-purple-600 to-green-600 text-white shadow-2xl"
            >
              <Shield className="h-8 w-8" />
            </motion.div>

            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-3xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 bg-clip-text text-transparent"
            >
              CertifyUZ
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-muted-foreground mt-2"
            >
              Sertifikat Boshqaruv Tizimi
            </motion.p>
          </div>

          {/* Login Card */}
          <Card className="border-2 shadow-2xl bg-background/80 backdrop-blur-md rounded-3xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-2xl font-bold">Xush Kelibsiz</CardTitle>
              <CardDescription>
                Dashboard'ga kirish uchun login ma'lumotlaringizni kiriting
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleLogin} className="space-y-6">
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="border-red-200 bg-red-50/50 rounded-2xl">
                      <AlertCircle className="h-4 w-4 text-red-600" />
                      <AlertDescription className="text-red-800">
                        {error}
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {success && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Alert className="border-green-200 bg-green-50/50 rounded-2xl">
                      <CheckCircle className="h-4 w-4 text-green-600" />
                      <AlertDescription className="text-green-800">
                        {userType === "admin"
                          ? "Admin sifatida muvaffaqiyatli kirish! Admin panel'ga yo'naltirilmoqda..."
                          : "Super Admin sifatida muvaffaqiyatli kirish! Bosh panel'ga yo'naltirilmoqda..."
                        }
                      </AlertDescription>
                    </Alert>
                  </motion.div>
                )}

                {/* Username Field */}
                <div className="space-y-2">
                  <Label htmlFor="username" className="text-sm font-medium">
                    Foydalanuvchi nomi
                  </Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="username"
                      type="text"
                      placeholder="Foydalanuvchi nomingizni kiriting"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="pl-10 rounded-2xl border-2 focus:border-primary transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Password Field */}
                <div className="space-y-2">
                  <Label htmlFor="password" className="text-sm font-medium">
                    Parol
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Parolingizni kiriting"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10 pr-10 rounded-2xl border-2 focus:border-primary transition-colors"
                      required
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-1 h-8 w-8 rounded-xl"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4 text-muted-foreground" />
                      ) : (
                        <Eye className="h-4 w-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </div>

                {/* Login Button */}
                <Button
                  type="submit"
                  className="w-full rounded-2xl bg-gradient-to-r from-blue-600 via-purple-600 to-green-600 hover:from-blue-700 hover:via-purple-700 hover:to-green-700 text-white font-medium py-3 transition-all duration-300 transform hover:scale-[1.02] disabled:scale-100"
                  disabled={isLoading || success}
                >
                  {isLoading ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                      className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                    />
                  ) : success ? (
                    <>
                      <CheckCircle className="mr-2 h-4 w-4" />
                      {userType === "admin" ? "Admin Panel'ga kirish..." : "Super Admin Panel'ga kirish..."}
                    </>
                  ) : (
                    <>
                      <Lock className="mr-2 h-4 w-4" />
                      Kirish
                    </>
                  )}
                </Button>
              </form>

              {/* Demo Credentials Info */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
                className="mt-6 p-4 bg-muted/50 rounded-2xl border border-dashed border-muted-foreground/20"
              >
                <p className="text-xs text-muted-foreground text-center font-mono">
                  Test uchun:<br />
                  <span className="font-semibold text-blue-600">admin</span> / <span className="font-semibold">admin123</span> (Oddiy Admin)<br />
                  <span className="font-semibold text-purple-600">superadmin</span> / <span className="font-semibold">admin123</span> (Super Admin)
                </p>
              </motion.div>
            </CardContent>
          </Card>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="text-center mt-8"
          >
            <p className="text-xs text-muted-foreground">
              © 2025 CertifyUZ. Barcha huquqlar himoyalangan.
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}