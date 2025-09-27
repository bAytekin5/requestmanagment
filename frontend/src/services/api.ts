import axios from 'axios';
import {
  AuthResponse,
  CreateRequest,
  LoginRequest,
  RegisterRequest,
  RequestItem,
  RequestSummary,
  UpdateRequestStatus,
  UserSummary,
} from '../types';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL ?? 'http://localhost:8080/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
});

export const setAuthToken = (token: string | null) => {
  if (token) {
    api.defaults.headers.common.Authorization = `Bearer ${token}`;
  } else {
    delete api.defaults.headers.common.Authorization;
  }
};

const extractData = async <T>(promise: Promise<{ data: T }>) => {
  try {
    const res = await promise;
    return res.data;
  } catch (error: any) {
    if (error?.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    if (error?.response?.status === 401) {
      throw new Error('Oturumunuz geçerli değil. Lütfen tekrar giriş yapın.');
    }
    if (error?.response?.status === 403) {
      throw new Error('Bu işlemi yapmak için yetkiniz yok.');
    }
    throw error;
  }
};

export const login = (data: LoginRequest) => extractData(api.post<AuthResponse>('/auth/login', data));

export const register = (data: RegisterRequest) => extractData(api.post<AuthResponse>('/auth/register', data));

export const fetchRequests = (params?: Record<string, unknown>) =>
  extractData(api.get<{ content: RequestItem[] }>('/requests', { params })).then((payload) => payload.content);

export const createRequest = (data: CreateRequest) => extractData(api.post<RequestItem>('/requests', data));

export const updateRequestStatus = (id: number, data: UpdateRequestStatus) =>
  extractData(api.put<RequestItem>(`/requests/${id}/status`, data));

export const fetchAdmins = () => extractData(api.get<UserSummary[]>('/requests/admins'));

export const fetchSummary = () => extractData(api.get<RequestSummary>('/requests/summary'));

