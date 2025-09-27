export type Role = 'ROLE_USER' | 'ROLE_ADMIN';

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  roles: Role[];
}

export interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  tokenType: string;
  expiresIn: number;
  profile: UserProfile;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  fullName: string;
}

export type RequestPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type RequestStatus = 'OPEN' | 'IN_PROGRESS' | 'RESOLVED' | 'CLOSED';

export interface RequestItem {
  id: number;
  title: string;
  description: string;
  priority: RequestPriority;
  status: RequestStatus;
  category?: string;
  attachmentUrl?: string;
  resolutionNote?: string;
  createdAt: string;
  updatedAt: string;
  requesterId: number;
  requesterName: string;
  assigneeId?: number;
  assigneeName?: string;
}

export interface CreateRequest {
  title: string;
  description: string;
  priority: RequestPriority;
  category?: string;
  attachmentUrl?: string;
}

export interface UpdateRequestStatus {
  status: RequestStatus;
  resolutionNote?: string;
  assigneeId?: number;
}

export interface UserSummary {
  id: number;
  fullName: string;
  email: string;
}

export interface RequestSummary {
  total: number;
  open: number;
  inProgress: number;
  resolved: number;
  closed: number;
  last7Days: number;
}

