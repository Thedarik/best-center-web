// listeningTestAPI.ts - Listening testlari uchun API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"

// Types - Listening testlari uchun
export interface CreateListeningTestRequest {
  title: string
  type: string
  level: string
  timeLimit: number
  sections_data: Array<{
    title: string
    audioUrl: string
    transcript?: string
    questions: Array<{
      type: string
      question: string
      options?: string[]
      correct?: number
      correctAnswer?: string
      wordLimit?: number
      alternativeAnswers?: string[]
      startTime?: number // Audio vaqti (soniyalarda)
      endTime?: number
    }>
  }>
}

export interface ListeningTestResponse {
  id: number
  title: string
  type: string
  level: string
  sections: number
  questions: number
  timeLimit: number
  status: string
  attempts: number
  avgScore: number
  createdAt: string
  updatedAt?: string
  sections_data: any[]
}

export interface ListeningTestStats {
  totalTests: number
  activeTests: number
  totalAttempts: number
  averageScore: number
}

export interface ListeningAttemptRequest {
  score: number
  timeSpent?: number
  studentId?: string
}

// Connection helper
export const checkConnection = async (): Promise<boolean> => {
  try {
    console.log("🔗 Checking backend connection...")
    const response = await fetch(`${API_BASE_URL.replace("/api", "")}/api/health`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      signal: AbortSignal.timeout(5000),
    })

    if (response.ok) {
      const data = await response.json()
      console.log("✅ Backend connected:", data.message)
      return true
    }

    console.warn("⚠️ Backend responded but not healthy")
    return false
  } catch (error) {
    console.error("❌ Backend connection failed:", error)
    return false
  }
}

// Enhanced API functions
export const listeningTestAPI = {
  // Health check with detailed info
  healthCheck: async (): Promise<any> => {
    try {
      console.log("🏥 Health check...")
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Health check successful:", result)
      return result
    } catch (error) {
      console.error("❌ Health check failed:", error)
      throw error
    }
  },

  // Get all tests with enhanced filtering and pagination
  getAllTests: async (filters?: {
    type?: string
    status?: string
    level?: string
    limit?: number
    offset?: number
  }): Promise<ListeningTestResponse[]> => {
    try {
      console.log("🎧 Fetching listening tests with filters:", filters)

      const params = new URLSearchParams()
      if (filters?.type && filters.type !== "all") params.append("type", filters.type)
      if (filters?.status && filters.status !== "all") params.append("status", filters.status)
      if (filters?.level && filters.level !== "all") params.append("level", filters.level)
      if (filters?.limit) params.append("limit", filters.limit.toString())
      if (filters?.offset) params.append("offset", filters.offset.toString())

      const url = `${API_BASE_URL}/listening-tests${params.toString() ? `?${params.toString()}` : ""}`
      console.log("📡 Request URL:", url)

      const response = await fetch(url, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(15000),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ API Error:", response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Listening tests loaded successfully:", result.length, "tests")
      return result
    } catch (error) {
      console.error("❌ Error loading listening tests:", error)
      throw error
    }
  },

  // Create test with enhanced validation
  createTest: async (testData: CreateListeningTestRequest): Promise<ListeningTestResponse> => {
    try {
      console.log("🆕 Creating listening test:", testData.title)
      console.log("📊 Test details:", {
        title: testData.title,
        type: testData.type,
        level: testData.level,
        sections: testData.sections_data.length,
        totalQuestions: testData.sections_data.reduce((total, s) => total + s.questions.length, 0),
      })

      const response = await fetch(`${API_BASE_URL}/listening-tests`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(testData),
        signal: AbortSignal.timeout(30000),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Create listening test error:", response.status, errorText)

        let errorDetail = `HTTP error! status: ${response.status}`
        try {
          const errorData = JSON.parse(errorText)
          errorDetail = errorData.detail || errorData.message || errorDetail
        } catch (e) {
          errorDetail = errorText || errorDetail
        }

        throw new Error(errorDetail)
      }

      const result = await response.json()
      console.log("✅ Listening test created successfully:", result)
      return result
    } catch (error) {
      console.error("❌ Error creating listening test:", error)
      throw error
    }
  },

  // Get single test
  getTestById: async (id: number): Promise<ListeningTestResponse> => {
    try {
      console.log("🔍 Fetching listening test by ID:", id)
      const response = await fetch(`${API_BASE_URL}/listening-tests/${id}`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Listening test with ID ${id} not found`)
        }
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Listening test found:", result)
      return result
    } catch (error) {
      console.error("❌ Error fetching listening test:", error)
      throw error
    }
  },

  // Update test
  updateTest: async (id: number, updateData: Partial<CreateListeningTestRequest>): Promise<ListeningTestResponse> => {
    try {
      console.log("✏️ Updating listening test:", id)
      const response = await fetch(`${API_BASE_URL}/listening-tests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
        signal: AbortSignal.timeout(20000),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Listening test updated:", result)
      return result
    } catch (error) {
      console.error("❌ Error updating listening test:", error)
      throw error
    }
  },

  // Toggle test status
  toggleTestStatus: async (id: number): Promise<ListeningTestResponse> => {
    try {
      console.log("🔄 Toggling listening test status:", id)
      const response = await fetch(`${API_BASE_URL}/listening-tests/${id}/toggle-status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Listening test status toggled:", result)
      return result
    } catch (error) {
      console.error("❌ Error toggling listening test status:", error)
      throw error
    }
  },

  // Delete test
  deleteTest: async (id: number): Promise<void> => {
    try {
      console.log("🗑️ Deleting listening test:", id)
      const response = await fetch(`${API_BASE_URL}/listening-tests/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ Listening test deleted successfully")
    } catch (error) {
      console.error("❌ Error deleting listening test:", error)
      throw error
    }
  },

  // Get statistics
  getTestStats: async (): Promise<ListeningTestStats> => {
    try {
      console.log("📊 Fetching listening statistics...")

      const response = await fetch(`${API_BASE_URL}/listening-tests/stats`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        console.warn("⚠️ Listening stats API failed, using fallback")
        return {
          totalTests: 0,
          activeTests: 0,
          totalAttempts: 0,
          averageScore: 0.0,
        }
      }

      const result = await response.json()
      console.log("✅ Listening statistics loaded:", result)

      return {
        totalTests: Number(result.totalTests) || 0,
        activeTests: Number(result.activeTests) || 0,
        totalAttempts: Number(result.totalAttempts) || 0,
        averageScore: Number(result.averageScore) || 0,
      }
    } catch (error) {
      console.error("❌ Error loading listening statistics:", error)
      return {
        totalTests: 0,
        activeTests: 0,
        totalAttempts: 0,
        averageScore: 0.0,
      }
    }
  },

  // Record test attempt
  recordTestAttempt: async (id: number, attemptData: ListeningAttemptRequest): Promise<any> => {
    try {
      console.log("📝 Recording listening test attempt:", id, attemptData)
      const response = await fetch(`${API_BASE_URL}/listening-tests/${id}/attempt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(attemptData),
        signal: AbortSignal.timeout(10000),
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error("❌ Record listening attempt error:", response.status, errorText)
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      console.log("✅ Listening attempt recorded:", result)
      return result
    } catch (error) {
      console.error("❌ Error recording listening attempt:", error)
      throw error
    }
  },

  // Test connection utility
  testConnection: async (): Promise<boolean> => {
    return await checkConnection()
  },

  // Get debug info
  getDebugInfo: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/debug`, {
        method: "GET",
        signal: AbortSignal.timeout(5000),
      })

      if (response.ok) {
        return await response.json()
      }
      return null
    } catch (error) {
      console.error("Debug info failed:", error)
      return null
    }
  },
}

// Export default
export default listeningTestAPI
