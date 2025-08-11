// studentExamAPI.ts - Student exam uchun API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "https://eduflix.uz/api"

// Types - Student exam uchun
export interface StudentTest {
  id: number
  title: string
  type: string
  level: string
  timeLimit: number
  status: string
  sections_data: any[]
  questions: any[]
}

export interface StudentTestAttempt {
  testId: number
  studentId: string
  studentName: string
  score: number
  timeSpent: number
  answers: { [key: string]: any }
  completedAt: string
}

// Enhanced API functions
export const studentExamAPI = {
  // Get available tests for students
  getAvailableTests: async (): Promise<StudentTest[]> => {
    try {
      console.log("📚 Fetching available tests...")
      
      // Get tests from all sections
      const [listeningTests, readingTests, writingTests] = await Promise.all([
        fetch(`${API_BASE_URL}/listening-tests?status=active`).then(res => res.json()),
        fetch(`${API_BASE_URL}/reading-tests?status=active`).then(res => res.json()),
        fetch(`${API_BASE_URL}/writing-tests?status=active`).then(res => res.json())
      ])

      // Combine and format tests
      const allTests: StudentTest[] = [
        ...listeningTests.map((test: any) => ({
          ...test,
          type: 'listening',
          questions: test.sections_data?.flatMap((section: any) => section.questions || []) || []
        })),
        ...readingTests.map((test: any) => ({
          ...test,
          type: 'reading',
          questions: test.passages_data?.flatMap((passage: any) => passage.questions || []) || []
        })),
        ...writingTests.map((test: any) => ({
          ...test,
          type: 'writing',
          questions: test.criteria?.map((criterion: any, index: number) => ({
            id: index + 1,
            type: `Task ${index + 1}`,
            question: criterion.description,
            wordLimit: criterion.wordLimit,
            timeLimit: criterion.timeLimit
          })) || []
        }))
      ]

      console.log("✅ Available tests fetched:", allTests.length)
      return allTests
    } catch (error) {
      console.error("❌ Error fetching available tests:", error)
      return []
    }
  },

  // Get test by ID
  getTestById: async (testId: number, testType: string): Promise<StudentTest | null> => {
    try {
      console.log(`📖 Fetching test ${testId} (${testType})...`)
      
      const response = await fetch(`${API_BASE_URL}/${testType}-tests/${testId}`)
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const test = await response.json()
      
      // Format test data for student view
      const formattedTest: StudentTest = {
        ...test,
        type: testType,
        questions: testType === 'listening' 
          ? test.sections_data?.flatMap((section: any) => section.questions || []) || []
          : testType === 'reading'
          ? test.passages_data?.flatMap((passage: any) => passage.questions || []) || []
          : test.criteria?.map((criterion: any, index: number) => ({
              id: index + 1,
              type: `Task ${index + 1}`,
              question: criterion.description,
              wordLimit: criterion.wordLimit,
              timeLimit: criterion.timeLimit
            })) || []
      }

      console.log("✅ Test fetched successfully")
      return formattedTest
    } catch (error) {
      console.error("❌ Error fetching test:", error)
      return null
    }
  },

  // Submit test attempt
  submitTestAttempt: async (attempt: StudentTestAttempt): Promise<boolean> => {
    try {
      console.log("📝 Submitting test attempt...")
      
      const response = await fetch(`${API_BASE_URL}/${attempt.testType}-tests/${attempt.testId}/attempt`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          score: attempt.score,
          timeSpent: attempt.timeSpent,
          studentId: attempt.studentId,
          studentName: attempt.studentName,
          answers: attempt.answers
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      console.log("✅ Test attempt submitted successfully")
      return true
    } catch (error) {
      console.error("❌ Error submitting test attempt:", error)
      return false
    }
  },

  // Health check
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

  // Test connection
  testConnection: async (): Promise<boolean> => {
    try {
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
} 