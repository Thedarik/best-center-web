// Local Storage Service for IELTS Tests
// Backend buzilganligi sababli local storage orqali ma'lumotlarni saqlash

export interface LocalTestData {
  id: string
  title: string
  type: string
  level: string
  status: string
  createdAt: string
  updatedAt: string
  attempts: number
  avgScore: number
  [key: string]: any
}

export interface LocalTestStats {
  totalTests: number
  activeTests: number
  totalAttempts: number
  averageScore: number
}

class LocalStorageService {
  private readonly STORAGE_KEYS = {
    LISTENING_TESTS: 'ielts_listening_tests',
    READING_TESTS: 'ielts_reading_tests', 
    WRITING_TESTS: 'ielts_writing_tests',
    TEST_ATTEMPTS: 'ielts_test_attempts',
    SETTINGS: 'ielts_settings'
  }

  // Generic CRUD operations
  private getItem<T>(key: string): T[] {
    try {
      const item = localStorage.getItem(key)
      return item ? JSON.parse(item) : []
    } catch (error) {
      console.error(`Error reading from localStorage (${key}):`, error)
      return []
    }
  }

  private setItem<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data))
    } catch (error) {
      console.error(`Error writing to localStorage (${key}):`, error)
    }
  }

  // Generate unique ID
  private generateId(): string {
    return Date.now().toString(36) + Math.random().toString(36).substr(2)
  }

  // Listening Tests
  getListeningTests(): LocalTestData[] {
    return this.getItem<LocalTestData>(this.STORAGE_KEYS.LISTENING_TESTS)
  }

  saveListeningTest(test: Omit<LocalTestData, 'id' | 'createdAt' | 'updatedAt'>): LocalTestData {
    const tests = this.getListeningTests()
    const newTest: LocalTestData = {
      ...test,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    tests.unshift(newTest)
    this.setItem(this.STORAGE_KEYS.LISTENING_TESTS, tests)
    return newTest
  }

  updateListeningTest(id: string, updates: Partial<LocalTestData>): LocalTestData | null {
    const tests = this.getListeningTests()
    const index = tests.findIndex(test => test.id === id)
    
    if (index === -1) return null
    
    tests[index] = {
      ...tests[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.setItem(this.STORAGE_KEYS.LISTENING_TESTS, tests)
    return tests[index]
  }

  deleteListeningTest(id: string): boolean {
    const tests = this.getListeningTests()
    const filteredTests = tests.filter(test => test.id !== id)
    
    if (filteredTests.length === tests.length) return false
    
    this.setItem(this.STORAGE_KEYS.LISTENING_TESTS, filteredTests)
    return true
  }

  // Reading Tests
  getReadingTests(): LocalTestData[] {
    return this.getItem<LocalTestData>(this.STORAGE_KEYS.READING_TESTS)
  }

  saveReadingTest(test: Omit<LocalTestData, 'id' | 'createdAt' | 'updatedAt'>): LocalTestData {
    const tests = this.getReadingTests()
    const newTest: LocalTestData = {
      ...test,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    tests.unshift(newTest)
    this.setItem(this.STORAGE_KEYS.READING_TESTS, tests)
    return newTest
  }

  updateReadingTest(id: string, updates: Partial<LocalTestData>): LocalTestData | null {
    const tests = this.getReadingTests()
    const index = tests.findIndex(test => test.id === id)
    
    if (index === -1) return null
    
    tests[index] = {
      ...tests[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.setItem(this.STORAGE_KEYS.READING_TESTS, tests)
    return tests[index]
  }

  deleteReadingTest(id: string): boolean {
    const tests = this.getReadingTests()
    const filteredTests = tests.filter(test => test.id !== id)
    
    if (filteredTests.length === tests.length) return false
    
    this.setItem(this.STORAGE_KEYS.READING_TESTS, filteredTests)
    return true
  }

  // Writing Tests
  getWritingTests(): LocalTestData[] {
    return this.getItem<LocalTestData>(this.STORAGE_KEYS.WRITING_TESTS)
  }

  saveWritingTest(test: Omit<LocalTestData, 'id' | 'createdAt' | 'updatedAt'>): LocalTestData {
    const tests = this.getWritingTests()
    const newTest: LocalTestData = {
      ...test,
      id: this.generateId(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    tests.unshift(newTest)
    this.setItem(this.STORAGE_KEYS.WRITING_TESTS, tests)
    return newTest
  }

  updateWritingTest(id: string, updates: Partial<LocalTestData>): LocalTestData | null {
    const tests = this.getWritingTests()
    const index = tests.findIndex(test => test.id === id)
    
    if (index === -1) return null
    
    tests[index] = {
      ...tests[index],
      ...updates,
      updatedAt: new Date().toISOString()
    }
    
    this.setItem(this.STORAGE_KEYS.WRITING_TESTS, tests)
    return tests[index]
  }

  deleteWritingTest(id: string): boolean {
    const tests = this.getWritingTests()
    const filteredTests = tests.filter(test => test.id !== id)
    
    if (filteredTests.length === tests.length) return false
    
    this.setItem(this.STORAGE_KEYS.WRITING_TESTS, filteredTests)
    return true
  }

  // Test Attempts
  saveTestAttempt(testId: string, testType: 'listening' | 'reading' | 'writing', attempt: {
    score: number
    timeSpent: number
    studentId?: string
    answers: any[]
  }): void {
    const attempts = this.getItem<any>(this.STORAGE_KEYS.TEST_ATTEMPTS)
    const newAttempt = {
      id: this.generateId(),
      testId,
      testType,
      ...attempt,
      createdAt: new Date().toISOString()
    }
    
    attempts.unshift(newAttempt)
    this.setItem(this.STORAGE_KEYS.TEST_ATTEMPTS, attempts)
  }

  getTestAttempts(testId: string): any[] {
    const attempts = this.getItem<any>(this.STORAGE_KEYS.TEST_ATTEMPTS)
    return attempts.filter(attempt => attempt.testId === testId)
  }

  // Statistics
  getListeningStats(): LocalTestStats {
    const tests = this.getListeningTests()
    const attempts = this.getItem<any>(this.STORAGE_KEYS.TEST_ATTEMPTS)
    const listeningAttempts = attempts.filter(a => a.testType === 'listening')
    
    return {
      totalTests: tests.length,
      activeTests: tests.filter(t => t.status === 'Active').length,
      totalAttempts: listeningAttempts.length,
      averageScore: listeningAttempts.length > 0 
        ? listeningAttempts.reduce((sum, a) => sum + a.score, 0) / listeningAttempts.length 
        : 0
    }
  }

  getReadingStats(): LocalTestStats {
    const tests = this.getReadingTests()
    const attempts = this.getItem<any>(this.STORAGE_KEYS.TEST_ATTEMPTS)
    const readingAttempts = attempts.filter(a => a.testType === 'reading')
    
    return {
      totalTests: tests.length,
      activeTests: tests.filter(t => t.status === 'Active').length,
      totalAttempts: readingAttempts.length,
      averageScore: readingAttempts.length > 0 
        ? readingAttempts.reduce((sum, a) => sum + a.score, 0) / readingAttempts.length 
        : 0
    }
  }

  getWritingStats(): LocalTestStats {
    const tests = this.getWritingTests()
    const attempts = this.getItem<any>(this.STORAGE_KEYS.TEST_ATTEMPTS)
    const writingAttempts = attempts.filter(a => a.testType === 'writing')
    
    return {
      totalTests: tests.length,
      activeTests: tests.filter(t => t.status === 'Active').length,
      totalAttempts: writingAttempts.length,
      averageScore: writingAttempts.length > 0 
        ? writingAttempts.reduce((sum, a) => sum + a.score, 0) / writingAttempts.length 
        : 0
    }
  }

  // Settings
  getSettings(): any {
    try {
      const settings = localStorage.getItem(this.STORAGE_KEYS.SETTINGS)
      return settings ? JSON.parse(settings) : {}
    } catch (error) {
      console.error('Error reading settings:', error)
      return {}
    }
  }

  saveSettings(settings: any): void {
    try {
      localStorage.setItem(this.STORAGE_KEYS.SETTINGS, JSON.stringify(settings))
    } catch (error) {
      console.error('Error saving settings:', error)
    }
  }

  // Clear all data (for testing)
  clearAllData(): void {
    Object.values(this.STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key)
    })
  }

  // Export/Import data
  exportData(): string {
    const data = {
      listeningTests: this.getListeningTests(),
      readingTests: this.getReadingTests(),
      writingTests: this.getWritingTests(),
      attempts: this.getItem<any>(this.STORAGE_KEYS.TEST_ATTEMPTS),
      settings: this.getSettings(),
      exportedAt: new Date().toISOString()
    }
    return JSON.stringify(data, null, 2)
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData)
      
      if (data.listeningTests) this.setItem(this.STORAGE_KEYS.LISTENING_TESTS, data.listeningTests)
      if (data.readingTests) this.setItem(this.STORAGE_KEYS.READING_TESTS, data.readingTests)
      if (data.writingTests) this.setItem(this.STORAGE_KEYS.WRITING_TESTS, data.writingTests)
      if (data.attempts) this.setItem(this.STORAGE_KEYS.TEST_ATTEMPTS, data.attempts)
      if (data.settings) this.saveSettings(data.settings)
      
      return true
    } catch (error) {
      console.error('Error importing data:', error)
      return false
    }
  }
}

export const localStorageService = new LocalStorageService() 