import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api/v1';

class APIClient {
  client: AxiosInstance;
  token: string | null = localStorage.getItem('access_token');

  constructor() {
    this.client = axios.create({
      baseURL: API_BASE_URL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add token to requests
    this.client.interceptors.request.use((config) => {
      if (this.token) {
        config.headers.Authorization = `Bearer ${this.token}`;
      }
      return config;
    });
  }

  setToken(token: string) {
    this.token = token;
    localStorage.setItem('access_token', token);
  }

  clearToken() {
    this.token = null;
    localStorage.removeItem('access_token');
  }

  // Auth endpoints
  async register(data: any) {
    return this.client.post('/auth/register', data);
  }

  async login(email: string, password: string) {
    const response = await this.client.post('/auth/login', { email, password });
    this.setToken(response.data.access_token);
    return response.data;
  }

  async getCurrentUser() {
    return this.client.post('/auth/me', { token: this.token });
  }

  // Farmer endpoints
  async getFarmers(statusFilter?: string) {
    return this.client.get('/farmers/', { params: { status_filter: statusFilter } });
  }

  async getFarmer(farmerId: number) {
    return this.client.get(`/farmers/${farmerId}`);
  }

  async createFarmer(data: any) {
    return this.client.post('/farmers/', data);
  }

  async updateFarmer(farmerId: number, data: any) {
    return this.client.put(`/farmers/${farmerId}`, data);
  }

  async updateFarmerStatus(farmerId: number, status: string) {
    return this.client.patch(`/farmers/${farmerId}/status`, {}, { params: { status } });
  }

  async getPriorityFarmers(limit: number = 10) {
    return this.client.get('/farmers/priority-list/top10', { params: { limit } });
  }

  // Soil endpoints
  async createSoilTest(farmerId: number, data: any) {
    return this.client.post(`/soil/${farmerId}/test`, data);
  }

  async getLatestSoilTest(farmerId: number) {
    return this.client.get(`/soil/${farmerId}/test/latest`);
  }

  async getSoilHistory(farmerId: number) {
    return this.client.get(`/soil/${farmerId}/test/history`);
  }

  // Recommendation endpoints
  async generateRecommendation(farmerId: number, data: any) {
    return this.client.post(`/recommendations/${farmerId}/generate`, data);
  }

  async getFarmerRecommendations(farmerId: number) {
    return this.client.get(`/recommendations/${farmerId}`);
  }

  async getRecommendation(recommendationId: number) {
    return this.client.get(`/recommendations/recommendation/${recommendationId}`);
  }

  async generateWhatsAppMessage(recommendationId: number, language: string = 'ta') {
    return this.client.post(`/recommendations/${recommendationId}/whatsapp-message`, {}, { params: { language } });
  }

  async markRecommendationSent(recommendationId: number) {
    return this.client.patch(`/recommendations/${recommendationId}/mark-sent`);
  }

  async confirmFarmerAction(recommendationId: number) {
    return this.client.patch(`/recommendations/${recommendationId}/confirm-received`);
  }

  // Stats endpoints
  async getAdvisorStats(advisorId: number) {
    return this.client.get(`/stats/advisor/${advisorId}`);
  }
}

export default new APIClient();
