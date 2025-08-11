// API Service - Markaziy API boshqaruvi
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api';

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export class ApiService {
  private static async request<T>(
    endpoint: string, 
    options: RequestInit = {}
  ): Promise<ApiResponse<T>> {
    try {
      const url = `${API_BASE_URL}${endpoint}`;
      const config: RequestInit = {
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        ...options,
      };

      const response = await fetch(url, config);
      const data = await response.json();

      if (!response.ok) {
        return {
          success: false,
          error: data.detail || `HTTP ${response.status}: ${response.statusText}`,
        };
      }

      return {
        success: true,
        data,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Network error',
      };
    }
  }

  // Health check
  static async healthCheck(): Promise<ApiResponse> {
    return this.request('/health');
  }

  // Authentication
  static async login(username: string, password: string): Promise<ApiResponse> {
    return this.request('/auth/token', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
  }

  static async register(userData: any): Promise<ApiResponse> {
    return this.request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  }

  // Listening Tests
  static async getListeningTests(filters?: any): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, String(value));
        }
      });
    }
    
    const endpoint = `/listening-tests${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request(endpoint);
  }

  static async createListeningTest(testData: any): Promise<ApiResponse> {
    return this.request('/listening-tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  static async updateListeningTest(id: number, testData: any): Promise<ApiResponse> {
    return this.request(`/listening-tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });
  }

  static async deleteListeningTest(id: number): Promise<ApiResponse> {
    return this.request(`/listening-tests/${id}`, {
      method: 'DELETE',
    });
  }

  // Reading Tests
  static async getReadingTests(filters?: any): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, String(value));
        }
      });
    }
    
    const endpoint = `/reading-tests${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request(endpoint);
  }

  static async createReadingTest(testData: any): Promise<ApiResponse> {
    return this.request('/reading-tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  static async updateReadingTest(id: number, testData: any): Promise<ApiResponse> {
    return this.request(`/reading-tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });
  }

  static async deleteReadingTest(id: number): Promise<ApiResponse> {
    return this.request(`/reading-tests/${id}`, {
      method: 'DELETE',
    });
  }

  // Writing Tests
  static async getWritingTests(filters?: any): Promise<ApiResponse> {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value && value !== 'all') {
          params.append(key, String(value));
        }
      });
    }
    
    const endpoint = `/writing-tests${params.toString() ? `?${params.toString()}` : ''}`;
    return this.request(endpoint);
  }

  static async createWritingTest(testData: any): Promise<ApiResponse> {
    return this.request('/writing-tests', {
      method: 'POST',
      body: JSON.stringify(testData),
    });
  }

  static async updateWritingTest(id: number, testData: any): Promise<ApiResponse> {
    return this.request(`/writing-tests/${id}`, {
      method: 'PUT',
      body: JSON.stringify(testData),
    });
  }

  static async deleteWritingTest(id: number): Promise<ApiResponse> {
    return this.request(`/writing-tests/${id}`, {
      method: 'DELETE',
    });
  }

  // Statistics
  static async getListeningStats(): Promise<ApiResponse> {
    return this.request('/listening-tests/stats');
  }

  static async getReadingStats(): Promise<ApiResponse> {
    return this.request('/reading-tests/stats');
  }

  static async getWritingStats(): Promise<ApiResponse> {
    return this.request('/writing-tests/stats');
  }

  // Test Attempts
  static async submitTestAttempt(testId: number, attemptData: any): Promise<ApiResponse> {
    return this.request(`/listening-tests/${testId}/attempt`, {
      method: 'POST',
      body: JSON.stringify(attemptData),
    });
  }
}

// Hook for using API in React components
export const useApi = () => {
  return {
    healthCheck: ApiService.healthCheck,
    login: ApiService.login,
    register: ApiService.register,
    getListeningTests: ApiService.getListeningTests,
    createListeningTest: ApiService.createListeningTest,
    updateListeningTest: ApiService.updateListeningTest,
    deleteListeningTest: ApiService.deleteListeningTest,
    getReadingTests: ApiService.getReadingTests,
    createReadingTest: ApiService.createReadingTest,
    updateReadingTest: ApiService.updateReadingTest,
    deleteReadingTest: ApiService.deleteReadingTest,
    getWritingTests: ApiService.getWritingTests,
    createWritingTest: ApiService.createWritingTest,
    updateWritingTest: ApiService.updateWritingTest,
    deleteWritingTest: ApiService.deleteWritingTest,
    getListeningStats: ApiService.getListeningStats,
    getReadingStats: ApiService.getReadingStats,
    getWritingStats: ApiService.getWritingStats,
    submitTestAttempt: ApiService.submitTestAttempt,
  };
}; 