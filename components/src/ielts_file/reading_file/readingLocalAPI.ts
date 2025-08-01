// Local API for Reading Tests - Backend buzilganligi sababli
import { localStorageService, type LocalTestData, type LocalTestStats } from "@/lib/localStorageService"

// Types
export interface CreateTestRequest {
  title: string
  type: string
  level: string
  timeLimit: number
  passages_data: Array<{
    title: string
    text: string
    questions: Array<{
      type: string
      question: string
      options?: string[]
      correct?: number
      sentence?: string
      correctAnswer?: string
      wordLimit?: number
      truefalse?: string
      headings?: string[]
      matchingOptions?: string[]
      alternativeAnswers?: string[]
    }>
  }>
}

export interface TestResponse {
  id: string
  title: string
  type: string
  level: string
  passages: number
  questions: number
  timeLimit: number
  status: string
  attempts: number
  avgScore: number
  createdAt: string
  updatedAt?: string
  passages_data: any[]
}

export interface TestStats {
  totalTests: number
  activeTests: number
  totalAttempts: number
  averageScore: number
}

export interface AttemptRequest {
  score: number
  timeSpent?: number
  studentId?: string
}

// Local API functions
export const readingLocalAPI = {
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
  }): Promise<TestResponse[]> => {
    try {
      let tests = localStorageService.getReadingTests()
      
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

      // Convert to TestResponse format
      return tests.map(test => ({
        id: test.id,
        title: test.title,
        type: test.type,
        level: test.level,
        passages: test.passages_data?.length || 0,
        questions: test.passages_data?.reduce((total, passage) => 
          total + (passage.questions?.length || 0), 0) || 0,
        timeLimit: test.timeLimit || 60,
        status: test.status,
        attempts: test.attempts || 0,
        avgScore: test.avgScore || 0,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
        passages_data: test.passages_data || []
      }))
    } catch (error) {
      console.error('Error getting reading tests:', error)
      return []
    }
  },

  // Create new test
  createTest: async (testData: CreateTestRequest): Promise<TestResponse> => {
    try {
      const newTest = localStorageService.saveReadingTest({
        title: testData.title,
        type: testData.type,
        level: testData.level,
        timeLimit: testData.timeLimit,
        status: 'Active',
        attempts: 0,
        avgScore: 0,
        passages_data: testData.passages_data
      })

      return {
        id: newTest.id,
        title: newTest.title,
        type: newTest.type,
        level: newTest.level,
        passages: newTest.passages_data?.length || 0,
        questions: newTest.passages_data?.reduce((total, passage) => 
          total + (passage.questions?.length || 0), 0) || 0,
        timeLimit: newTest.timeLimit,
        status: newTest.status,
        attempts: newTest.attempts,
        avgScore: newTest.avgScore,
        createdAt: newTest.createdAt,
        updatedAt: newTest.updatedAt,
        passages_data: newTest.passages_data
      }
    } catch (error) {
      console.error('Error creating reading test:', error)
      throw new Error('Test yaratishda xatolik yuz berdi')
    }
  },

  // Get test by ID
  getTestById: async (id: string): Promise<TestResponse | null> => {
    try {
      const tests = localStorageService.getReadingTests()
      const test = tests.find(t => t.id === id)
      
      if (!test) return null

      return {
        id: test.id,
        title: test.title,
        type: test.type,
        level: test.level,
        passages: test.passages_data?.length || 0,
        questions: test.passages_data?.reduce((total, passage) => 
          total + (passage.questions?.length || 0), 0) || 0,
        timeLimit: test.timeLimit || 60,
        status: test.status,
        attempts: test.attempts || 0,
        avgScore: test.avgScore || 0,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
        passages_data: test.passages_data || []
      }
    } catch (error) {
      console.error('Error getting test by ID:', error)
      return null
    }
  },

  // Update test
  updateTest: async (id: string, updates: Partial<CreateTestRequest>): Promise<TestResponse | null> => {
    try {
      const updatedTest = localStorageService.updateReadingTest(id, updates)
      
      if (!updatedTest) return null

      return {
        id: updatedTest.id,
        title: updatedTest.title,
        type: updatedTest.type,
        level: updatedTest.level,
        passages: updatedTest.passages_data?.length || 0,
        questions: updatedTest.passages_data?.reduce((total, passage) => 
          total + (passage.questions?.length || 0), 0) || 0,
        timeLimit: updatedTest.timeLimit || 60,
        status: updatedTest.status,
        attempts: updatedTest.attempts || 0,
        avgScore: updatedTest.avgScore || 0,
        createdAt: updatedTest.createdAt,
        updatedAt: updatedTest.updatedAt,
        passages_data: updatedTest.passages_data || []
      }
    } catch (error) {
      console.error('Error updating test:', error)
      return null
    }
  },

  // Delete test
  deleteTest: async (id: string): Promise<boolean> => {
    try {
      return localStorageService.deleteReadingTest(id)
    } catch (error) {
      console.error('Error deleting test:', error)
      return false
    }
  },

  // Toggle test status
  toggleTestStatus: async (id: string): Promise<TestResponse | null> => {
    try {
      const test = await readingLocalAPI.getTestById(id)
      if (!test) return null

      const newStatus = test.status === 'Active' ? 'Draft' : 'Active'
      const updatedTest = localStorageService.updateReadingTest(id, { status: newStatus })
      
      if (!updatedTest) return null

      return {
        id: updatedTest.id,
        title: updatedTest.title,
        type: updatedTest.type,
        level: updatedTest.level,
        passages: updatedTest.passages_data?.length || 0,
        questions: updatedTest.passages_data?.reduce((total, passage) => 
          total + (passage.questions?.length || 0), 0) || 0,
        timeLimit: updatedTest.timeLimit || 60,
        status: updatedTest.status,
        attempts: updatedTest.attempts || 0,
        avgScore: updatedTest.avgScore || 0,
        createdAt: updatedTest.createdAt,
        updatedAt: updatedTest.updatedAt,
        passages_data: updatedTest.passages_data || []
      }
    } catch (error) {
      console.error('Error toggling test status:', error)
      return null
    }
  },

  // Get test statistics
  getTestStats: async (): Promise<TestStats> => {
    try {
      return localStorageService.getReadingStats()
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
  submitAttempt: async (testId: string, attempt: AttemptRequest): Promise<void> => {
    try {
      localStorageService.saveTestAttempt(testId, 'reading', {
        score: attempt.score,
        timeSpent: attempt.timeSpent || 0,
        studentId: attempt.studentId,
        answers: []
      })

      // Update test statistics
      const test = await readingLocalAPI.getTestById(testId)
      if (test) {
        const attempts = localStorageService.getTestAttempts(testId)
        const avgScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
        
        localStorageService.updateReadingTest(testId, {
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
export const readingTestAPI = readingLocalAPI 