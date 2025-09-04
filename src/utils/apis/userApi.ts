import { axiosInstance } from "@/lib/axios";
import type { ApiPaginatedResponse, FetchFunctionParams } from "@/types/commonTypes";
import { buildQueryParams, parseNewCommonResponse } from "@/utils/helpers/apiHelpers";
import type { User } from "@/types/entities/user";


export interface UserResponse {
  success: boolean;
  message: string;
  data: User[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

export interface SingleUserResponse {
  success: boolean;
  message: string;
  user: User;
}

export interface CreateUserRequest {
  fullName: string;
  email: string;
  password: string;
  role: 'user' | 'admin';
  phone?: string;
  phoneTwo?: string;
}

export interface UpdateUserRequest {
  fullName?: string;
  email?: string;
  phone?: string;
  phoneTwo?: string;
  isBlocked?: boolean;
  isVerified?: boolean;
}

export const adminFetchAllUsers = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<User>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/admin/users${query ? `?${query}` : ''}`);
  
  console.log("Raw backend response:", response.data);
  
  const parsed = parseNewCommonResponse<User>(response.data);
  console.log("Parsed response:", parsed);
  
  return parsed;
};

export const adminCreateUser = async (userData: CreateUserRequest) => {
  return await axiosInstance.post('/admin/users', userData);
};

export const adminFetchUserById = async (userId: string) => {
  return await axiosInstance.get(`/admin/users/${userId}`);
};

export const adminUpdateUser = async (userId: string, userData: UpdateUserRequest) => {
  return await axiosInstance.put(`/admin/users/${userId}`, userData);
};

export const adminDeleteUser = async (userId: string) => {
  return await axiosInstance.delete(`/admin/users/${userId}`);
};

export const adminFetchUserStats = async () => {
  return await axiosInstance.get('/admin/users/stats');
};

export const adminFetchAllJobs = async (params?: FetchFunctionParams): Promise<ApiPaginatedResponse<any>> => {
  const query = buildQueryParams(params);
  const response = await axiosInstance.get(`/user/jobs${query ? `?${query}` : ''}`);
  return parseNewCommonResponse<any>(response.data);
};