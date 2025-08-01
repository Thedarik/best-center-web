// Local API for Writing Tests - Backend buzilganligi sababli
import { localStorageService, type LocalTestData, type LocalTestStats } from "@/lib/localStorageService"

// Types
export interface CreateWritingTestRequest {
  title: string
  type: "Task 1" | "Task 2"
  category: "Academic" | "General Training"
  prompt: string
  instructions: string
  timeLimit: number
  wordLimit: number
  criteria: {
    taskAchievement: number
    coherenceCohesion: number
    lexicalResource: number
    grammaticalRange: number
  }
}

export interface WritingTestResponse {
  id: string
  title: string
  type: string
  category: string
  prompt: string
  instructions: string
  timeLimit: number
  wordLimit: number
  status: string
  attempts: number
  avgScore: number
  createdAt: string
  updatedAt?: string
  criteria: {
    taskAchievement: number
    coherenceCohesion: number
    lexicalResource: number
    grammaticalRange: number
  }
}

export interface WritingTestStats {
  totalTests: number
  activeTests: number
  totalAttempts: number
  averageScore: number
}

export interface WritingAttemptRequest {
  score: number
  timeSpent?: number
  studentId?: string
  essay?: string
}

// Local API functions
export const writingLocalAPI = {
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
    category?: string
    status?: string
  }): Promise<WritingTestResponse[]> => {
    try {
      let tests = localStorageService.getWritingTests()
      
      // Apply filters
      if (filters?.type && filters.type !== 'all') {
        tests = tests.filter(test => test.type === filters.type)
      }
      if (filters?.category && filters.category !== 'all') {
        tests = tests.filter(test => test.category === filters.category)
      }
      if (filters?.status && filters.status !== 'all') {
        tests = tests.filter(test => test.status === filters.status)
      }

      // Convert to WritingTestResponse format
      return tests.map(test => ({
        id: test.id,
        title: test.title,
        type: test.type,
        category: test.category,
        prompt: test.prompt,
        instructions: test.instructions,
        timeLimit: test.timeLimit || 60,
        wordLimit: test.wordLimit || 250,
        status: test.status,
        attempts: test.attempts || 0,
        avgScore: test.avgScore || 0,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
        criteria: test.criteria || {
          taskAchievement: 25,
          coherenceCohesion: 25,
          lexicalResource: 25,
          grammaticalRange: 25
        }
      }))
    } catch (error) {
      console.error('Error getting writing tests:', error)
      return []
    }
  },

  // Create new test
  createTest: async (testData: CreateWritingTestRequest): Promise<WritingTestResponse> => {
    try {
      const newTest = localStorageService.saveWritingTest({
        title: testData.title,
        type: testData.type,
        category: testData.category,
        prompt: testData.prompt,
        instructions: testData.instructions,
        timeLimit: testData.timeLimit,
        wordLimit: testData.wordLimit,
        status: 'Active',
        attempts: 0,
        avgScore: 0,
        criteria: testData.criteria
      })

      return {
        id: newTest.id,
        title: newTest.title,
        type: newTest.type,
        category: newTest.category,
        prompt: newTest.prompt,
        instructions: newTest.instructions,
        timeLimit: newTest.timeLimit,
        wordLimit: newTest.wordLimit,
        status: newTest.status,
        attempts: newTest.attempts,
        avgScore: newTest.avgScore,
        createdAt: newTest.createdAt,
        updatedAt: newTest.updatedAt,
        criteria: newTest.criteria
      }
    } catch (error) {
      console.error('Error creating writing test:', error)
      throw new Error('Test yaratishda xatolik yuz berdi')
    }
  },

  // Get test by ID
  getTestById: async (id: string): Promise<WritingTestResponse | null> => {
    try {
      const tests = localStorageService.getWritingTests()
      const test = tests.find(t => t.id === id)
      
      if (!test) return null

      return {
        id: test.id,
        title: test.title,
        type: test.type,
        category: test.category,
        prompt: test.prompt,
        instructions: test.instructions,
        timeLimit: test.timeLimit || 60,
        wordLimit: test.wordLimit || 250,
        status: test.status,
        attempts: test.attempts || 0,
        avgScore: test.avgScore || 0,
        createdAt: test.createdAt,
        updatedAt: test.updatedAt,
        criteria: test.criteria || {
          taskAchievement: 25,
          coherenceCohesion: 25,
          lexicalResource: 25,
          grammaticalRange: 25
        }
      }
    } catch (error) {
      console.error('Error getting test by ID:', error)
      return null
    }
  },

  // Update test
  updateTest: async (id: string, updates: Partial<CreateWritingTestRequest>): Promise<WritingTestResponse | null> => {
    try {
      const updatedTest = localStorageService.updateWritingTest(id, updates)
      
      if (!updatedTest) return null

      return {
        id: updatedTest.id,
        title: updatedTest.title,
        type: updatedTest.type,
        category: updatedTest.category,
        prompt: updatedTest.prompt,
        instructions: updatedTest.instructions,
        timeLimit: updatedTest.timeLimit || 60,
        wordLimit: updatedTest.wordLimit || 250,
        status: updatedTest.status,
        attempts: updatedTest.attempts || 0,
        avgScore: updatedTest.avgScore || 0,
        createdAt: updatedTest.createdAt,
        updatedAt: updatedTest.updatedAt,
        criteria: updatedTest.criteria || {
          taskAchievement: 25,
          coherenceCohesion: 25,
          lexicalResource: 25,
          grammaticalRange: 25
        }
      }
    } catch (error) {
      console.error('Error updating test:', error)
      return null
    }
  },

  // Delete test
  deleteTest: async (id: string): Promise<boolean> => {
    try {
      return localStorageService.deleteWritingTest(id)
    } catch (error) {
      console.error('Error deleting test:', error)
      return false
    }
  },

  // Toggle test status
  toggleTestStatus: async (id: string): Promise<WritingTestResponse | null> => {
    try {
      const test = await writingLocalAPI.getTestById(id)
      if (!test) return null

      const newStatus = test.status === 'Active' ? 'Draft' : 'Active'
      const updatedTest = localStorageService.updateWritingTest(id, { status: newStatus })
      
      if (!updatedTest) return null

      return {
        id: updatedTest.id,
        title: updatedTest.title,
        type: updatedTest.type,
        category: updatedTest.category,
        prompt: updatedTest.prompt,
        instructions: updatedTest.instructions,
        timeLimit: updatedTest.timeLimit || 60,
        wordLimit: updatedTest.wordLimit || 250,
        status: updatedTest.status,
        attempts: updatedTest.attempts || 0,
        avgScore: updatedTest.avgScore || 0,
        createdAt: updatedTest.createdAt,
        updatedAt: updatedTest.updatedAt,
        criteria: updatedTest.criteria || {
          taskAchievement: 25,
          coherenceCohesion: 25,
          lexicalResource: 25,
          grammaticalRange: 25
        }
      }
    } catch (error) {
      console.error('Error toggling test status:', error)
      return null
    }
  },

  // Get test statistics
  getTestStats: async (): Promise<WritingTestStats> => {
    try {
      return localStorageService.getWritingStats()
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
  submitAttempt: async (testId: string, attempt: WritingAttemptRequest): Promise<void> => {
    try {
      localStorageService.saveTestAttempt(testId, 'writing', {
        score: attempt.score,
        timeSpent: attempt.timeSpent || 0,
        studentId: attempt.studentId,
        essay: attempt.essay,
        answers: []
      })

      // Update test statistics
      const test = await writingLocalAPI.getTestById(testId)
      if (test) {
        const attempts = localStorageService.getTestAttempts(testId)
        const avgScore = attempts.reduce((sum, a) => sum + a.score, 0) / attempts.length
        
        localStorageService.updateWritingTest(testId, {
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
export const writingTestAPI = writingLocalAPI 