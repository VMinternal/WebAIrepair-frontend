
export type { PaginatedResponse, PaginationMeta } from './common';

// Authorization Enum
export enum UserRole {
  USER = 'user',
  TECHNICIAN = 'technician',
  ADMIN = 'admin',
}

// Data types returned by the User from the Backend
export interface User {
  id: string;
  email: string;
  fullname?: string;
  role: UserRole;
  isActive: boolean;
  createdAt?: string;
}

// Data types to send when creating a new user.
export interface CreateUserInput {
  email: string;
  password: string;
  fullname?: string; 
  role?: UserRole;
  isActive?: boolean;
}

// Data type for updating User (allows submission with missing fields)
export type UpdateUserInput = Partial<CreateUserInput>;