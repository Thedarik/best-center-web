"use client"

import { useState, useEffect } from "react"
import { CertificateDashboard } from "@/components/superadmin/super_admin_page" 
import { AdminDashboard } from "@/components/admin/admin"
import { LoginPage } from "@/components/login"

type UserType = 'admin' | 'superadmin' | null

export default function Home() {
  const [userType, setUserType] = useState<UserType>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is already logged in (from localStorage)
  useEffect(() => {
    const authStatus = localStorage.getItem('certifyuz_auth')
    const savedUserType = localStorage.getItem('certifyuz_user_type') as UserType
    
    if (authStatus === 'true' && savedUserType) {
      setUserType(savedUserType)
    }
    setIsLoading(false)
  }, [])

  // ✅ Oddiy admin login function
  const handleAdminLogin = () => {
    setUserType('admin')
    localStorage.setItem('certifyuz_auth', 'true')
    localStorage.setItem('certifyuz_user_type', 'admin')
  }

  // ✅ Super admin login function  
  const handleSuperAdminLogin = () => {
    setUserType('superadmin')
    localStorage.setItem('certifyuz_auth', 'true')
    localStorage.setItem('certifyuz_user_type', 'superadmin')
  }

  // ✅ Logout function
  const handleLogout = () => {
    setUserType(null)
    localStorage.removeItem('certifyuz_auth')
    localStorage.removeItem('certifyuz_user_type')
  }

  // Loading state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <main className="overflow-hidden">  
      {/* Login Page */}
      {!userType && (
        <LoginPage 
          onAdminLogin={handleAdminLogin}           // ✅ Oddiy admin uchun
          onSuperAdminLogin={handleSuperAdminLogin} // ✅ Super admin uchun
        />
      )}

      {/* Admin Dashboard (oddiy admin) */}
      {userType === 'admin' && (
        <AdminDashboard onLogout={handleLogout} />
      )}
      
      {/* Certificate Dashboard (super admin) */}
      {userType === 'superadmin' && (
        <CertificateDashboard onLogout={handleLogout} />
      )}
    </main>
  )
}