// Test Runner for IELTS Modules - Backend buzilganligi sababli
import { localStorageService } from "./localStorageService"
import { sampleDataService } from "./sampleDataService"

export interface TestResult {
  module: string
  status: 'passed' | 'failed' | 'skipped'
  message: string
  details?: any
}

export const testRunner = {
  // Run all tests
  async runAllTests(): Promise<TestResult[]> {
    const results: TestResult[] = []
    
    // Test Local Storage
    results.push(await testRunner.testLocalStorage())
    
    // Test Sample Data
    results.push(await testRunner.testSampleData())
    
    // Test Listening Module
    results.push(await testRunner.testListeningModule())
    
    // Test Reading Module
    results.push(await testRunner.testReadingModule())
    
    // Test Writing Module
    results.push(await testRunner.testWritingModule())
    
    return results
  },

  // Test Local Storage
  async testLocalStorage(): Promise<TestResult> {
    try {
      // Test basic operations
      const testData = {
        title: "Test Listening",
        type: "Academic",
        level: "Intermediate",
        timeLimit: 30,
        status: "Active",
        attempts: 0,
        avgScore: 0,
        sections_data: []
      }

      // Save test
      const savedTest = localStorageService.saveListeningTest(testData)
      if (!savedTest.id) {
        return {
          module: "Local Storage",
          status: "failed",
          message: "Failed to save test - no ID generated"
        }
      }

      // Retrieve test
      const retrievedTests = localStorageService.getListeningTests()
      const foundTest = retrievedTests.find(t => t.id === savedTest.id)
      if (!foundTest) {
        return {
          module: "Local Storage",
          status: "failed",
          message: "Failed to retrieve saved test"
        }
      }

      // Update test
      const updatedTest = localStorageService.updateListeningTest(savedTest.id, { title: "Updated Test" })
      if (!updatedTest || updatedTest.title !== "Updated Test") {
        return {
          module: "Local Storage",
          status: "failed",
          message: "Failed to update test"
        }
      }

      // Delete test
      const deleted = localStorageService.deleteListeningTest(savedTest.id)
      if (!deleted) {
        return {
          module: "Local Storage",
          status: "failed",
          message: "Failed to delete test"
        }
      }

      return {
        module: "Local Storage",
        status: "passed",
        message: "All local storage operations working correctly"
      }
    } catch (error) {
      return {
        module: "Local Storage",
        status: "failed",
        message: `Local storage test failed: ${error}`
      }
    }
  },

  // Test Sample Data
  async testSampleData(): Promise<TestResult> {
    try {
      // Clear existing data
      localStorageService.clearAllData()
      
      // Initialize sample data
      sampleDataService.initializeSampleData()
      
      // Check if sample data was created
      const listeningTests = localStorageService.getListeningTests()
      const readingTests = localStorageService.getReadingTests()
      const writingTests = localStorageService.getWritingTests()
      
      if (listeningTests.length === 0 && readingTests.length === 0 && writingTests.length === 0) {
        return {
          module: "Sample Data",
          status: "failed",
          message: "No sample data was created"
        }
      }

      return {
        module: "Sample Data",
        status: "passed",
        message: `Sample data created: ${listeningTests.length} listening, ${readingTests.length} reading, ${writingTests.length} writing tests`,
        details: {
          listening: listeningTests.length,
          reading: readingTests.length,
          writing: writingTests.length
        }
      }
    } catch (error) {
      return {
        module: "Sample Data",
        status: "failed",
        message: `Sample data test failed: ${error}`
      }
    }
  },

  // Test Listening Module
  async testListeningModule(): Promise<TestResult> {
    try {
      const { listeningLocalAPI } = await import("../components/src/ielts_file/listining_file/listeningLocalAPI")
      
      // Test connection
      const connection = await listeningLocalAPI.testConnection()
      if (!connection) {
        return {
          module: "Listening",
          status: "failed",
          message: "Listening API connection failed"
        }
      }

      // Test get all tests
      const tests = await listeningLocalAPI.getAllTests()
      if (!Array.isArray(tests)) {
        return {
          module: "Listening",
          status: "failed",
          message: "Failed to get listening tests"
        }
      }

      // Test get stats
      const stats = await listeningLocalAPI.getTestStats()
      if (!stats || typeof stats.totalTests !== 'number') {
        return {
          module: "Listening",
          status: "failed",
          message: "Failed to get listening stats"
        }
      }

      return {
        module: "Listening",
        status: "passed",
        message: `Listening module working: ${tests.length} tests, ${stats.totalTests} total tests`,
        details: {
          testsCount: tests.length,
          stats: stats
        }
      }
    } catch (error) {
      return {
        module: "Listening",
        status: "failed",
        message: `Listening module test failed: ${error}`
      }
    }
  },

  // Test Reading Module
  async testReadingModule(): Promise<TestResult> {
    try {
      const { readingLocalAPI } = await import("../components/src/ielts_file/reading_file/readingLocalAPI")
      
      // Test connection
      const connection = await readingLocalAPI.testConnection()
      if (!connection) {
        return {
          module: "Reading",
          status: "failed",
          message: "Reading API connection failed"
        }
      }

      // Test get all tests
      const tests = await readingLocalAPI.getAllTests()
      if (!Array.isArray(tests)) {
        return {
          module: "Reading",
          status: "failed",
          message: "Failed to get reading tests"
        }
      }

      // Test get stats
      const stats = await readingLocalAPI.getTestStats()
      if (!stats || typeof stats.totalTests !== 'number') {
        return {
          module: "Reading",
          status: "failed",
          message: "Failed to get reading stats"
        }
      }

      return {
        module: "Reading",
        status: "passed",
        message: `Reading module working: ${tests.length} tests, ${stats.totalTests} total tests`,
        details: {
          testsCount: tests.length,
          stats: stats
        }
      }
    } catch (error) {
      return {
        module: "Reading",
        status: "failed",
        message: `Reading module test failed: ${error}`
      }
    }
  },

  // Test Writing Module
  async testWritingModule(): Promise<TestResult> {
    try {
      const { writingLocalAPI } = await import("../components/src/ielts_file/writing_file/writingLocalAPI")
      
      // Test connection
      const connection = await writingLocalAPI.testConnection()
      if (!connection) {
        return {
          module: "Writing",
          status: "failed",
          message: "Writing API connection failed"
        }
      }

      // Test get all tests
      const tests = await writingLocalAPI.getAllTests()
      if (!Array.isArray(tests)) {
        return {
          module: "Writing",
          status: "failed",
          message: "Failed to get writing tests"
        }
      }

      // Test get stats
      const stats = await writingLocalAPI.getTestStats()
      if (!stats || typeof stats.totalTests !== 'number') {
        return {
          module: "Writing",
          status: "failed",
          message: "Failed to get writing stats"
        }
      }

      return {
        module: "Writing",
        status: "passed",
        message: `Writing module working: ${tests.length} tests, ${stats.totalTests} total tests`,
        details: {
          testsCount: tests.length,
          stats: stats
        }
      }
    } catch (error) {
      return {
        module: "Writing",
        status: "failed",
        message: `Writing module test failed: ${error}`
      }
    }
  },

  // Generate test report
  generateReport(results: TestResult[]): string {
    const passed = results.filter(r => r.status === 'passed').length
    const failed = results.filter(r => r.status === 'failed').length
    const total = results.length

    let report = `# IELTS System Test Report\n\n`
    report += `**Summary:** ${passed}/${total} tests passed\n\n`
    report += `## Test Results\n\n`

    results.forEach(result => {
      const statusIcon = result.status === 'passed' ? '✅' : result.status === 'failed' ? '❌' : '⏭️'
      report += `### ${statusIcon} ${result.module}\n`
      report += `- **Status:** ${result.status}\n`
      report += `- **Message:** ${result.message}\n`
      if (result.details) {
        report += `- **Details:** ${JSON.stringify(result.details, null, 2)}\n`
      }
      report += `\n`
    })

    return report
  }
} 