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
  name: string;
  age: number;
  gender: string;
  address: string;
  district: string;
  city: string;
  roles: Role[];
}

export interface LoginResponse {
  code: number;
  result: {
    user: User;
    token: string;
  };
}

export interface LoginCredentials {
  email: string;
  password: string;
}
