// // API functions for Reading Tests - Tuzatilgan versiya
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

import React from "react";

// // Types
// export interface CreateTestRequest {
//   title: string;
//   type: string;
//   level: string;
//   timeLimit: number;
//   passages_data: Array<{
//     title: string;
//     text: string;
//     questions: Array<{
//       type: string;
//       question: string;
//       options?: string[];
//       correct?: number;
//       sentence?: string;
//       correctAnswer?: string;
//       wordLimit?: number;
//       truefalse?: string;
//       headings?: string[];
//       matchingOptions?: string[];
//       alternativeAnswers?: string[]; // Qo'shildi
//     }>;
//   }>;
// }

// export interface TestResponse {
//   id: number;
//   title: string;
//   type: string;
//   level: string;
//   passages: number;
//   questions: number;
//   timeLimit: number;
//   status: string;
//   attempts: number;
//   avgScore: number;
//   createdAt: string;
//   passages_data: any[];
// }

// export interface TestStats {
//   totalTests: number;
//   activeTests: number;
//   totalAttempts: number;
//   averageScore: number;
// }

// // API Functions
// export const readingTestAPI = {
//   // Health check - tuzatilgan
//   healthCheck: async (): Promise<any> => {
//     try {
//       console.log('🏥 Health check ishlamoqda...');
//       const response = await fetch(`${API_BASE_URL}/health`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         signal: AbortSignal.timeout(10000) // 10 sekund timeout
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('✅ Health check muvaffaqiyatli:', result);
//       return result;
//     } catch (error) {
//       console.error('❌ Health check xatolik:', error);
//       throw error;
//     }
//   },

//   // Barcha testlarni olish - tuzatilgan
//   getAllTests: async (filters?: {
//     type?: string;
//     status?: string;
//     level?: string;
//   }): Promise<TestResponse[]> => {
//     try {
//       console.log('📚 Testlarni yuklash...');
//       let url = `${API_BASE_URL}/reading-tests`;
      
//       // Query parameters qo'shish
//       const params = new URLSearchParams();
//       if (filters?.type && filters.type !== 'all') {
//         params.append('type', filters.type);
//       }
//       if (filters?.status && filters.status !== 'all') {
//         params.append('status', filters.status);
//       }
//       if (filters?.level && filters.level !== 'all') {
//         params.append('level', filters.level);
//       }
      
//       if (params.toString()) {
//         url += `?${params.toString()}`;
//       }

//       console.log('📡 URL:', url);

//       const response = await fetch(url, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         signal: AbortSignal.timeout(15000) // 15 sekund timeout
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Response error:', response.status, errorText);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('✅ Testlar yuklandi:', result.length, 'ta test');
//       return result;
//     } catch (error) {
//       console.error('❌ Testlarni yuklashda xatolik:', error);
//       throw error;
//     }
//   },

//   // Yangi test yaratish - tuzatilgan
//   createTest: async (testData: CreateTestRequest): Promise<TestResponse> => {
//     try {
//       console.log('🆕 Yangi test yaratilmoqda:', testData.title);
//       console.log('📊 Test ma\'lumotlari:', {
//         title: testData.title,
//         type: testData.type,
//         level: testData.level,
//         passages: testData.passages_data.length,
//         questions: testData.passages_data.reduce((total, p) => total + p.questions.length, 0)
//       });

//       const response = await fetch(`${API_BASE_URL}/reading-tests`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(testData),
//         signal: AbortSignal.timeout(30000) // 30 sekund timeout
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Create error response:', response.status, errorText);
        
//         let errorDetail = `HTTP error! status: ${response.status}`;
//         try {
//           const errorData = JSON.parse(errorText);
//           errorDetail = errorData.detail || errorDetail;
//         } catch (e) {
//           // JSON parse qila olmasa, text ni ishlatamiz
//           errorDetail = errorText || errorDetail;
//         }
        
//         throw new Error(errorDetail);
//       }

//       const result = await response.json();
//       console.log('✅ Test yaratildi:', result);
//       return result;
//     } catch (error) {
//       console.error('❌ Test yaratishda xatolik:', error);
//       throw error;
//     }
//   },

//   // Testni yangilash
//   updateTest: async (id: number, testData: Partial<CreateTestRequest>): Promise<TestResponse> => {
//     try {
//       console.log('✏️ Test yangilanmoqda:', id);
//       const response = await fetch(`${API_BASE_URL}/reading-tests/${id}`, {
//         method: 'PUT',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(testData),
//         signal: AbortSignal.timeout(20000)
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Update error:', response.status, errorText);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('✅ Test yangilandi:', result);
//       return result;
//     } catch (error) {
//       console.error('❌ Test yangilashda xatolik:', error);
//       throw error;
//     }
//   },

//   // Test statusini o'zgartirish - tuzatilgan
//   toggleTestStatus: async (id: number): Promise<TestResponse> => {
//     try {
//       console.log('🔄 Status o\'zgartirilmoqda:', id);
//       const response = await fetch(`${API_BASE_URL}/reading-tests/${id}/toggle-status`, {
//         method: 'PATCH',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         signal: AbortSignal.timeout(10000)
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Toggle status error:', response.status, errorText);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('✅ Status o\'zgartirildi:', result);
//       return result;
//     } catch (error) {
//       console.error('❌ Status o\'zgartirishda xatolik:', error);
//       throw error;
//     }
//   },

//   // Testni o'chirish - tuzatilgan
//   deleteTest: async (id: number): Promise<void> => {
//     try {
//       console.log('🗑️ Test o\'chirilmoqda:', id);
//       const response = await fetch(`${API_BASE_URL}/reading-tests/${id}`, {
//         method: 'DELETE',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         signal: AbortSignal.timeout(10000)
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Delete error:', response.status, errorText);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       console.log('✅ Test o\'chirildi');
//     } catch (error) {
//       console.error('❌ Test o\'chirishda xatolik:', error);
//       throw error;
//     }
//   },

//   // Bitta testni olish
//   getTestById: async (id: number): Promise<TestResponse> => {
//     try {
//       console.log('🔍 Test qidirilmoqda:', id);
//       const response = await fetch(`${API_BASE_URL}/reading-tests/${id}`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         signal: AbortSignal.timeout(10000)
//       });

//       if (!response.ok) {
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('✅ Test topildi:', result);
//       return result;
//     } catch (error) {
//       console.error('❌ Test qidirishda xatolik:', error);
//       throw error;
//     }
//   },

//   // Test statistikalarini olish - tuzatilgan
//   getTestStats: async (): Promise<TestStats> => {
//     try {
//       console.log('📊 Statistika yuklanmoqda...');
      
//       const response = await fetch(`${API_BASE_URL}/reading-tests/stats`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         signal: AbortSignal.timeout(10000)
//       });

//       if (!response.ok) {
//         console.warn('⚠️ Stats API ishlamayapti, debug endpoint sinab ko\'ramiz...');
//         return await readingTestAPI.getDebugStats();
//       }

//       const result = await response.json();
//       console.log('✅ Statistika yuklandi:', result);
      
//       // Validate and normalize stats
//       const stats: TestStats = {
//         totalTests: Number(result.totalTests) || 0,
//         activeTests: Number(result.activeTests) || 0,
//         totalAttempts: Number(result.totalAttempts) || 0,
//         averageScore: Number(result.averageScore) || 0
//       };
      
//       return stats;
//     } catch (error) {
//       console.error('❌ Statistika yuklanmadi:', error);
//       console.log('🔄 Fallback stats ishlatilmoqda...');
//       return await readingTestAPI.getDebugStats();
//     }
//   },

//   // Debug stats (fallback)
//   getDebugStats: async (): Promise<TestStats> => {
//     try {
//       console.log('🐛 Debug stats yuklanmoqda...');
//       const response = await fetch(`${API_BASE_URL}/debug`, {
//         method: 'GET',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         signal: AbortSignal.timeout(5000)
//       });

//       if (response.ok) {
//         const debug = await response.json();
//         console.log('✅ Debug ma\'lumotlari:', debug);
        
//         const stats: TestStats = {
//           totalTests: debug.tests_count || 0,
//           activeTests: Math.min(debug.tests_count || 0, 1),
//           totalAttempts: 100,
//           averageScore: 6.5
//         };
        
//         console.log('📊 Debug stats:', stats);
//         return stats;
//       }
      
//       throw new Error('Debug endpoint failed');
//     } catch (error) {
//       console.error('❌ Debug stats ham ishlamadi:', error);
//       console.log('🔄 Default stats qaytarilmoqda...');
      
//       // Last resort - default stats
//       return {
//         totalTests: 0,
//         activeTests: 0,
//         totalAttempts: 0,
//         averageScore: 0.0
//       };
//     }
//   },

//   // Test urinishini qayd qilish
//   recordTestAttempt: async (id: number, score: number): Promise<any> => {
//     try {
//       console.log('📝 Test urinishi qayd qilinmoqda:', id, score);
//       const response = await fetch(`${API_BASE_URL}/reading-tests/${id}/attempt?score=${score}`, {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         signal: AbortSignal.timeout(10000)
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error('❌ Record attempt error:', response.status, errorText);
//         throw new Error(`HTTP error! status: ${response.status}`);
//       }

//       const result = await response.json();
//       console.log('✅ Urinish qayd qilindi:', result);
//       return result;
//     } catch (error) {
//       console.error('❌ Urinish qayd qilishda xatolik:', error);
//       throw error;
//     }
//   },

//   // API server bilan bog'lanishni tekshirish
//   testConnection: async (): Promise<boolean> => {
//     try {
//       console.log('🔗 Backend bilan bog\'lanish tekshirilmoqda...');
      
//       // Root endpoint'ni sinab ko'ramiz
//       const rootResponse = await fetch(`${API_BASE_URL.replace('/api', '')}/`, {
//         method: 'GET',
//         signal: AbortSignal.timeout(5000)
//       });

//       if (rootResponse.ok) {
//         console.log('✅ Root endpoint ishlamoqda');
        
//         // Health endpoint'ni ham sinab ko'ramiz
//         try {
//           await readingTestAPI.healthCheck();
//           console.log('✅ API to\'liq ishlamoqda');
//           return true;
//         } catch (healthError) {
//           console.warn('⚠️ Health check ishlamadi, lekin server javob berdi');
//           return true; // Server ishlamoqda, faqat health endpoint muammoli
//         }
//       }
      
//       return false;
//     } catch (error) {
//       console.error('❌ Backend bilan bog\'lanib bo\'lmadi:', error);
//       return false;
//     }
//   },

//   // Advanced debug info
//   getFullDebugInfo: async (): Promise<any> => {
//     try {
//       const [rootTest, healthTest, debugTest] = await Promise.allSettled([
//         fetch(`${API_BASE_URL.replace('/api', '')}/`),
//         fetch(`${API_BASE_URL}/health`),
//         fetch(`${API_BASE_URL}/debug`)
//       ]);

//       return {
//         apiBaseUrl: API_BASE_URL,
//         rootEndpoint: rootTest.status === 'fulfilled' ? await rootTest.value.text() : 'FAILED',
//         healthEndpoint: healthTest.status === 'fulfilled' ? 'OK' : 'FAILED', 
//         debugEndpoint: debugTest.status === 'fulfilled' ? 'OK' : 'FAILED',
//         timestamp: new Date().toISOString()
//       };
//     } catch (error) {
//       return {
//         error: error instanceof Error ? error.message : String(error),
//         apiBaseUrl: API_BASE_URL,
//         timestamp: new Date().toISOString()
//       };
//     }
//   }
// };

// // Custom hook for using API with React
// export const useReadingTestAPI = () => {
//   return readingTestAPI;
// };








// readingTestAPI.ts - Yangilangan versiya
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

// Types - backendga mos ravishda yangilangan
export interface CreateTestRequest {
  title: string;
  type: string;
  level: string;
  timeLimit: number;
  passages_data: Array<{
    title: string;
    text: string;
    questions: Array<{
      type: string;
      question: string;
      options?: string[];
      correct?: number;
      sentence?: string;
      correctAnswer?: string;
      wordLimit?: number;
      truefalse?: string;
      headings?: string[];
      matchingOptions?: string[];
      alternativeAnswers?: string[];
    }>;
  }>;
}

export interface TestResponse {
  id: number;
  title: string;
  type: string;
  level: string;
  passages: number;
  questions: number;
  timeLimit: number;
  status: string;
  attempts: number;
  avgScore: number;
  createdAt: string;
  updatedAt?: string;
  passages_data: any[];
}

export interface TestStats {
  totalTests: number;
  activeTests: number;
  totalAttempts: number;
  averageScore: number;
}

export interface AttemptRequest {
  score: number;
  timeSpent?: number;
  studentId?: string;
}

// Connection helper
export const checkConnection = async (): Promise<boolean> => {
  try {
    console.log('🔗 Checking backend connection...');
    const response = await fetch(`${API_BASE_URL.replace('/api', '')}/api/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ Backend connected:', data.message);
      return true;
    }
    
    console.warn('⚠️ Backend responded but not healthy');
    return false;
  } catch (error) {
    console.error('❌ Backend connection failed:', error);
    return false;
  }
};

// Enhanced API functions
export const readingTestAPI = {
  // Health check with detailed info
  healthCheck: async (): Promise<any> => {
    try {
      console.log('🏥 Health check...');
      const response = await fetch(`${API_BASE_URL}/health`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Health check successful:', result);
      return result;
    } catch (error) {
      console.error('❌ Health check failed:', error);
      throw error;
    }
  },

  // Get all tests with enhanced filtering and pagination
  getAllTests: async (filters?: {
    type?: string;
    status?: string;
    level?: string;
    limit?: number;
    offset?: number;
  }): Promise<TestResponse[]> => {
    try {
      console.log('📚 Fetching tests with filters:', filters);
      
      const params = new URLSearchParams();
      if (filters?.type && filters.type !== 'all') params.append('type', filters.type);
      if (filters?.status && filters.status !== 'all') params.append('status', filters.status);
      if (filters?.level && filters.level !== 'all') params.append('level', filters.level);
      if (filters?.limit) params.append('limit', filters.limit.toString());
      if (filters?.offset) params.append('offset', filters.offset.toString());
      
      const url = `${API_BASE_URL}/reading-tests${params.toString() ? `?${params.toString()}` : ''}`;
      console.log('📡 Request URL:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(15000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ API Error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Tests loaded successfully:', result.length, 'tests');
      return result;
    } catch (error) {
      console.error('❌ Error loading tests:', error);
      throw error;
    }
  },

  // Create test with enhanced validation
  createTest: async (testData: CreateTestRequest): Promise<TestResponse> => {
    try {
      console.log('🆕 Creating test:', testData.title);
      console.log('📊 Test details:', {
        title: testData.title,
        type: testData.type,
        level: testData.level,
        passages: testData.passages_data.length,
        totalQuestions: testData.passages_data.reduce((total, p) => total + p.questions.length, 0)
      });

      const response = await fetch(`${API_BASE_URL}/reading-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testData),
        signal: AbortSignal.timeout(30000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Create test error:', response.status, errorText);
        
        let errorDetail = `HTTP error! status: ${response.status}`;
        try {
          const errorData = JSON.parse(errorText);
          errorDetail = errorData.detail || errorData.message || errorDetail;
        } catch (e) {
          errorDetail = errorText || errorDetail;
        }
        
        throw new Error(errorDetail);
      }

      const result = await response.json();
      console.log('✅ Test created successfully:', result);
      return result;
    } catch (error) {
      console.error('❌ Error creating test:', error);
      throw error;
    }
  },

  // Get single test
  getTestById: async (id: number): Promise<TestResponse> => {
    try {
      console.log('🔍 Fetching test by ID:', id);
      const response = await fetch(`${API_BASE_URL}/reading-tests/${id}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error(`Test with ID ${id} not found`);
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Test found:', result);
      return result;
    } catch (error) {
      console.error('❌ Error fetching test:', error);
      throw error;
    }
  },

  // Update test
  updateTest: async (id: number, updateData: Partial<CreateTestRequest>): Promise<TestResponse> => {
    try {
      console.log('✏️ Updating test:', id);
      const response = await fetch(`${API_BASE_URL}/reading-tests/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateData),
        signal: AbortSignal.timeout(20000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Test updated:', result);
      return result;
    } catch (error) {
      console.error('❌ Error updating test:', error);
      throw error;
    }
  },

  // Toggle test status
  toggleTestStatus: async (id: number): Promise<TestResponse> => {
    try {
      console.log('🔄 Toggling test status:', id);
      const response = await fetch(`${API_BASE_URL}/reading-tests/${id}/toggle-status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Status toggled:', result);
      return result;
    } catch (error) {
      console.error('❌ Error toggling status:', error);
      throw error;
    }
  },

  // Delete test
  deleteTest: async (id: number): Promise<void> => {
    try {
      console.log('🗑️ Deleting test:', id);
      const response = await fetch(`${API_BASE_URL}/reading-tests/${id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log('✅ Test deleted successfully');
    } catch (error) {
      console.error('❌ Error deleting test:', error);
      throw error;
    }
  },

  // Get statistics
  getTestStats: async (): Promise<TestStats> => {
    try {
      console.log('📊 Fetching statistics...');
      
      const response = await fetch(`${API_BASE_URL}/reading-tests/stats`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        console.warn('⚠️ Stats API failed, using fallback');
        return {
          totalTests: 0,
          activeTests: 0,
          totalAttempts: 0,
          averageScore: 0.0
        };
      }

      const result = await response.json();
      console.log('✅ Statistics loaded:', result);
      
      return {
        totalTests: Number(result.totalTests) || 0,
        activeTests: Number(result.activeTests) || 0,
        totalAttempts: Number(result.totalAttempts) || 0,
        averageScore: Number(result.averageScore) || 0
      };
    } catch (error) {
      console.error('❌ Error loading statistics:', error);
      return {
        totalTests: 0,
        activeTests: 0,
        totalAttempts: 0,
        averageScore: 0.0
      };
    }
  },

  // Record test attempt
  recordTestAttempt: async (id: number, attemptData: AttemptRequest): Promise<any> => {
    try {
      console.log('📝 Recording test attempt:', id, attemptData);
      const response = await fetch(`${API_BASE_URL}/reading-tests/${id}/attempt`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(attemptData),
        signal: AbortSignal.timeout(10000)
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Record attempt error:', response.status, errorText);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('✅ Attempt recorded:', result);
      return result;
    } catch (error) {
      console.error('❌ Error recording attempt:', error);
      throw error;
    }
  },

  // Test connection utility
  testConnection: async (): Promise<boolean> => {
    return await checkConnection();
  },

  // Get debug info
  getDebugInfo: async (): Promise<any> => {
    try {
      const response = await fetch(`${API_BASE_URL}/debug`, {
        method: 'GET',
        signal: AbortSignal.timeout(5000)
      });

      if (response.ok) {
        return await response.json();
      }
      return null;
    } catch (error) {
      console.error('Debug info failed:', error);
      return null;
    }
  }
};

// Connection status hook
export const useConnectionStatus = () => {
  const [isConnected, setIsConnected] = React.useState<boolean | null>(null);
  const [isChecking, setIsChecking] = React.useState(false);

  const checkStatus = async () => {
    setIsChecking(true);
    try {
      const connected = await checkConnection();
      setIsConnected(connected);
    } catch (error) {
      setIsConnected(false);
    } finally {
      setIsChecking(false);
    }
  };

  React.useEffect(() => {
    checkStatus();
    
    // Periodic check every 30 seconds
    const interval = setInterval(checkStatus, 30000);
    return () => clearInterval(interval);
  }, []);

  return { isConnected, isChecking, checkStatus };
};

// Export default
export default readingTestAPI;