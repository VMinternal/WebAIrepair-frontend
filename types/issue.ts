import { PaginatedResponse } from './user'; 

export interface Device {
  id: string;
  model: string;
  name?: string;
}

export interface Part {
  id: string;
  name: string;
}

export interface Issue {
  id: string;
  title: string;
  description: string;
  causes?: string;
  solutions?: string;
  similarityScore?: number; // % of similarity returned when using AI Search.
  device?: Device;
  parts?: Part[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateIssueInput {
  title: string;
  description: string;
  causes?: string;
  solutions?: string;
  deviceId?: string;
  partIds?: string[];
}

export type UpdateIssueInput = Partial<CreateIssueInput>;