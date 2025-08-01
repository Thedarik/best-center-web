// Local API for Listening Tests - Backend buzilganligi sababli
import { localStorageService, type LocalTestData, type LocalTestStats } from "@/lib/localStorageService"

// Types
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
      startTime?: number
      endTime?: number
    }>
  }>
}

export interface ListeningTestResponse {
  id: string
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

// Local API functions
export const listeningLocalAPI = {
  // Health check - always returns true for local
  healthCheck: async (): Promise<any> => {
    return {
      status: "healthy",
      message: "Local storage is working",
      timestamp: new Date().toISOString()
    }
  },

  // Test connection - always returns true for local
  testConnection: async (): Promise<boolean> => {
    return true
  },

  // Get all tests with filters
  getAllTests: async (filters?: {
    type?: string
    status?: string
    level?: string
  }): Promise<ListeningTestResponse[]> => {
    try {
      let tests = localStorageService.getListeningTests()
      
      // Apply filters
      if (filters?.type && filters.type !== 'all') {
        tests = tests.filter(test => test.type === filters.type)
      }
      if (filters?.status && filters.status !== 'all') {
        tests = tests.filter(test => test.status === filters.status)
      }
      if (filters?.level && filters.level !== 'all') {
        tests = tests.filter(test => test.level === filters.level)
      }

      // Convert to ListeningTestResponse format
      return tests.map(test => ({
        id: test.id,
        title: test.title,
        type: test.type,
        level: test.level,
        sections: test.sections_data?.length || 0,
        questions: test.sections_data?.reduce((total, section) => 
          total + (section.questions?.length || 0), 0) || 0,
        timeLimit: test.timeLimit || 30,
        status: test.status,
        attempts: test.attempts || 0,
        avgScore: test.avgScore || 0,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
        sections_data: test.sections_data || []
      }))
    } catch (error) {
      console.error('Error getting listening tests:', error)
      return []
    }
  },

  // Create new test
  createTest: async (testData: CreateListeningTestRequest): Promise<ListeningTestResponse> => {
    try {
      const newTest = localStorageService.saveListeningTest({
        title: testData.title,
        type: testData.type,
        level: testData.level,
        timeLimit: testData.timeLimit,
        status: 'Active',
        attempts: 0,
        avgScore: 0,
        sections_data: testData.sections_data
      })

      return {
        id: newTest.id,
        title: newTest.title,
        type: newTest.type,
        level: newTest.level,
        sections: newTest.sections_data?.length || 0,
        questions: newTest.sections_data?.reduce((total, section) => 
          total + (section.questions?.length || 0), 0) || 0,
        timeLimit: newTest.timeLimit,
        status: newTest.status,
        attempts: newTest.attempts,
        avgScore: newTest.avgScore,
        createdAt: newTest.createdAt,
        updatedAt: newTest.updatedAt,
        sections_data: newTest.sections_data
      }
    } catch (error) {
      console.error('Error creating listening test:', error)
      throw new Error('Test yaratishda xatolik yuz berdi')
    }
  },

  // Get test by ID
  getTestById: async (id: string): Promise<ListeningTestResponse | null> => {
    try {
      const tests = localStorageService.getListeningTests()
      const test = tests.find(t => t.id === id)
      
      if (!test) return null

      return {
        id: test.id,
        title: test.title,
        type: test.type,
        level: test.level,
        sections: test.sections_data?.length || 0,
        questions: test.sections_data?.reduce((total, section) => 
          total + (section.questions?.length || 0), 0) || 0,
        timeLimit: test.timeLimit || 30,
        status: test.status,
        attempts: test.attempts || 0,
        avgScore: test.avgScore || 0,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
        sections_data: test.sections_data || []
      }
    } catch (error) {
      console.error('Error getting test by ID:', error)
      return null
    }
  },

  // Update test
  updateTest: async (id: string, updates: Partial<CreateListeningTestRequest>): Promise<ListeningTestResponse | null> => {
    try {
      const updatedTest = localStorageService.updateListeningTest(id, updates)
      
      if (!updatedTest) return null

      return {
        id: updatedTest.id,
        title: updatedTest.title,
        type: updatedTest.type,
        level: updatedTest.level,
        sections: updatedTest.sections_data?.length || 0,
        questions: updatedTest.sections_data?.reduce((total, section) => 
          total + (section.questions?.length || 0), 0) || 0,
        timeLimit: updatedTest.timeLimit || 30,
        status: updatedTest.status,
        attempts: updatedTest.attempts || 0,
        avgScore: updatedTest.avgScore || 0,
        createdAt: updatedTest.createdAt,
        updatedAt: updatedTest.updatedAt,
        sections_data: updatedTest.sections_data || []
      }
    } catch (error) {
      console.error('Error updating test:', error)
      return null
    }
  },

  // Delete test
  deleteTest: async (id: string): Promise<boolean> => {
    try {
      return localStorageService.deleteListeningTest(id)
    } catch (error) {
      console.error('Error deleting test:', error)
      return false
    }
  },

  // Toggle test status
  toggleTestStatus: async (id: string): Promise<ListeningTestResponse | null> => {
    try {
      const test = await listeningLocalAPI.getTestById(id)
      if (!test) return null

      const newStatus = test.status === 'Active' ? 'Draft' : 'Active'
      const updatedTest = localStorageService.updateListeningTest(id, { status: newStatus })
      
      if (!updatedTest) return null

      return {
        id: updatedTest.id,
        title: updatedTest.title,
        type: updatedTest.type,
        level: updatedTest.level,
        sections: updatedTest.sections_data?.length || 0,
        questions: updatedTest.sections_data?.reduce((total, section) => 
          total + (section.questions?.length || 0), 0) || 0,
        timeLimit: updatedTest.timeLimit || 30,
        status: updatedTest.status,
        attempts: updatedTest.attempts || 0,
        avgScore: updatedTest.avgScore || 0,
        createdAt: updatedTest.createdAt,
        updatedAt: updatedTest.updatedAt,
        sections_data: updatedTest.sections_data || []
      }
    } catch (error) {
      console.error('Error toggling test status:', error)
      return null
    }
  },

  // Get test statistics
  getTestStats: async (): Promise<ListeningTestStats> => {
    try {
      return localStorageService.getListeningStats()
    } catch (error) {
      console.error('Error getting test stats:', error)
      return {
        totalTests: 0,
        activeTests: 0,
        totalAttempts: 0,
        averageScore: 0
      }
    }
  },

  // Submit test attempt
  submitAttempt: async (testId: string, attempt: ListeningAttemptRequest): Promise<void> => {
    try {
      localStorageService.saveTestAttempt(testId, 'listening', {
        score: attempt.score,
        timeSpent: attempt.timeSpent || 0,
        studentId: attempt.studentId,
        answers: []
      })

      // Update test statistics
      const test = await listeningLocalAPI.getTestById(testId)
      if (test) {
        const attempts = localStorageService.getTestAttempts(testId)
        const avgScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
        
        localStorageService.updateListeningTest(testId, {
          attempts: attempts.length,
          avgScore: avgScore
        })
      }
    } catch (error) {
      console.error('Error submitting attempt:', error)
      throw new Error('Test natijasini saqlashda xatolik')
    }
  },

  // Get test attempts
  getTestAttempts: async (testId: string): Promise<any[]> => {
    try {
      return localStorageService.getTestAttempts(testId)
    } catch (error) {
      console.error('Error getting test attempts:', error)
      return []
    }
  }
}

// Export for backward compatibility
export const listeningTestAPI = listeningLocalAPI 