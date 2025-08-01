// Sample Data Service - Backend buzilganligi sababli test ma'lumotlari
import { localStorageService } from "./localStorageService"

export const sampleDataService = {
  // Initialize sample data if no data exists
  initializeSampleData: () => {
    const listeningTests = localStorageService.getListeningTests()
    const readingTests = localStorageService.getReadingTests()
    const writingTests = localStorageService.getWritingTests()

    if (listeningTests.length === 0) {
      sampleDataService.createSampleListeningTests()
    }

    if (readingTests.length === 0) {
      sampleDataService.createSampleReadingTests()
    }

    if (writingTests.length === 0) {
      sampleDataService.createSampleWritingTests()
    }
  },

  // Sample Listening Tests
  createSampleListeningTests: () => {
    const sampleTests = [
      {
        title: "Academic Listening Test 1 - University Life",
        type: "Academic",
        level: "Intermediate",
        timeLimit: 30,
        status: "Active",
        attempts: 0,
        avgScore: 0,
        sections_data: [
          {
            title: "Section 1: Campus Tour",
            audioUrl: "https://example.com/audio1.mp3",
            transcript: "Welcome to our university campus tour. Today we'll be exploring the main facilities...",
            questions: [
              {
                type: "Multiple Choice",
                question: "What is the main purpose of this tour?",
                options: ["To show historical buildings", "To introduce campus facilities", "To promote the university", "To guide new students"],
                correct: 1
              },
              {
                type: "Form Completion",
                question: "Complete the form with NO MORE THAN TWO WORDS:",
                sentence: "The library opens at _____ on weekdays.",
                correctAnswer: "8 AM",
                wordLimit: 2
              }
            ]
          }
        ]
      },
      {
        title: "General Training Listening Test 1 - Job Interview",
        type: "General Training",
        level: "Beginner",
        timeLimit: 25,
        status: "Active",
        attempts: 0,
        avgScore: 0,
        sections_data: [
          {
            title: "Section 1: Interview Questions",
            audioUrl: "https://example.com/audio2.mp3",
            transcript: "Good morning, thank you for coming to the interview today...",
            questions: [
              {
                type: "Multiple Choice",
                question: "What position is the candidate applying for?",
                options: ["Manager", "Assistant", "Engineer", "Teacher"],
                correct: 1
              }
            ]
          }
        ]
      }
    ]

    sampleTests.forEach(test => {
      localStorageService.saveListeningTest(test)
    })

    console.log("✅ Sample listening tests created")
  },

  // Sample Reading Tests
  createSampleReadingTests: () => {
    const sampleTests = [
      {
        title: "Academic Reading Test 1 - Climate Change",
        type: "Academic",
        level: "Advanced",
        timeLimit: 60,
        status: "Active",
        attempts: 0,
        avgScore: 0,
        passages_data: [
          {
            title: "The Impact of Climate Change on Arctic Wildlife",
            text: "The Arctic region has been experiencing unprecedented changes due to global warming. Scientists have observed that polar bears are struggling to find food as ice melts earlier each year. The warming temperatures have created significant challenges for wildlife adaptation. Research indicates that many species are being forced to migrate to new areas or face extinction. The melting of sea ice has particularly affected marine mammals that depend on ice for hunting and breeding. Conservation efforts are being implemented worldwide to address these challenges.",
            questions: [
              {
                type: "Multiple Choice",
                question: "What is the main cause of Arctic ice melting?",
                options: ["Solar radiation", "Global warming", "Ocean currents", "Wind patterns"],
                correct: 1
              },
              {
                type: "True/False",
                question: "Polar bears are adapting well to climate change.",
                truefalse: "False"
              },
              {
                type: "Sentence Completion",
                question: "Complete the sentence using NO MORE THAN TWO WORDS from the passage:",
                sentence: "Polar bears are struggling to find _____ as ice melts earlier.",
                correctAnswer: "food",
                wordLimit: 2
              }
            ]
          }
        ]
      },
      {
        title: "General Training Reading Test 1 - Travel Guide",
        type: "General Training",
        level: "Intermediate",
        timeLimit: 60,
        status: "Active",
        attempts: 0,
        avgScore: 0,
        passages_data: [
          {
            title: "Travel Tips for Southeast Asia",
            text: "Southeast Asia offers a diverse range of experiences for travelers. From the bustling streets of Bangkok to the serene beaches of Bali, there's something for everyone. When planning your trip, consider the monsoon season which typically runs from May to October. Local transportation options include tuk-tuks, motorbikes, and public buses. Street food is a highlight of the region, but always ensure it's prepared in hygienic conditions. Respect local customs and dress modestly when visiting temples.",
            questions: [
              {
                type: "Multiple Choice",
                question: "What should travelers consider when planning a trip to Southeast Asia?",
                options: ["Currency exchange", "Monsoon season", "Flight prices", "Hotel bookings"],
                correct: 1
              },
              {
                type: "Matching",
                question: "Match the transportation method with its description:",
                headings: ["Tuk-tuk", "Motorbike", "Public bus"],
                matchingOptions: ["Three-wheeled taxi", "Personal transport", "Mass transit"]
              }
            ]
          }
        ]
      }
    ]

    sampleTests.forEach(test => {
      localStorageService.saveReadingTest(test)
    })

    console.log("✅ Sample reading tests created")
  },

  // Sample Writing Tests
  createSampleWritingTests: () => {
    const sampleTests = [
      {
        title: "Academic Writing Task 1 - Bar Chart",
        type: "Task 1",
        category: "Academic",
        prompt: "The chart below shows the percentage of households in different income brackets in three countries in 2020. Summarize the information by selecting and reporting the main features, and make comparisons where relevant.",
        instructions: "Write at least 150 words. You should spend about 20 minutes on this task.",
        timeLimit: 20,
        wordLimit: 150,
        status: "Active",
        attempts: 0,
        avgScore: 0,
        criteria: {
          taskAchievement: 25,
          coherenceCohesion: 25,
          lexicalResource: 25,
          grammaticalRange: 25
        }
      },
      {
        title: "Academic Writing Task 2 - Education",
        type: "Task 2",
        category: "Academic",
        prompt: "Some people believe that universities should focus more on practical skills rather than theoretical knowledge. To what extent do you agree or disagree with this statement?",
        instructions: "Write at least 250 words. You should spend about 40 minutes on this task.",
        timeLimit: 40,
        wordLimit: 250,
        status: "Active",
        attempts: 0,
        avgScore: 0,
        criteria: {
          taskAchievement: 25,
          coherenceCohesion: 25,
          lexicalResource: 25,
          grammaticalRange: 25
        }
      },
      {
        title: "General Training Task 1 - Formal Letter",
        type: "Task 1",
        category: "General Training",
        prompt: "You recently purchased a product from an online store, but it arrived damaged. Write a letter to the customer service department complaining about the issue and requesting a replacement or refund.",
        instructions: "Write at least 150 words. You should spend about 20 minutes on this task.",
        timeLimit: 20,
        wordLimit: 150,
        status: "Active",
        attempts: 0,
        avgScore: 0,
        criteria: {
          taskAchievement: 25,
          coherenceCohesion: 25,
          lexicalResource: 25,
          grammaticalRange: 25
        }
      }
    ]

    sampleTests.forEach(test => {
      localStorageService.saveWritingTest(test)
    })

    console.log("✅ Sample writing tests created")
  },

  // Clear all sample data
  clearSampleData: () => {
    localStorageService.clearAllData()
    console.log("✅ All sample data cleared")
  },

  // Export sample data
  exportSampleData: () => {
    return localStorageService.exportData()
  },

  // Import sample data
  importSampleData: (jsonData: string) => {
    return localStorageService.importData(jsonData)
  }
} 