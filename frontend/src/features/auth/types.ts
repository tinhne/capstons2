export interface Permission {
  name: string;
  description: string;
}

export interface Role {
  name: string;
  description: string;
  permissions: Permission[];
}

export interface User {
  id: string;
  email: string;
  name?: string; // Make name optional
  role: string;
  age?: number;
  gender?: string;
  address?: string;
  district?: string;
  city?: string;
  phone?: string;
  avatar?: string;
  status?: string;
  createdAt?: string;
  roles?: Role[];
}

export interface TokenPayload {
  sub: string;
  scope: string;
  iss: string;
  exp: number;
  iat: number;
  jti: string;
}

export interface LoginResponse {
  status: number;
  data: {
    token: string;
    authenticated: boolean;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export interface LoginCredentials {
  email: string;
  password: string;
}
