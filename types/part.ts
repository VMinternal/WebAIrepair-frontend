import { Device } from './device';
import { Issue } from './issue';

export interface Part {
  id: string;
  name: string;
  slug?: string;
  description?: string;
  price?: number;
  warrantyPeriod?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  deviceId?: string; //Foreign Key directly from Postgres
  devices?: Device[]; //// Object relation when using JOIN / include
  issues?: Issue[];
}

export interface CreatePartInput {
  name: string;
  slug?: string;
  description?: string;
  price?: number;
  warrantyPeriod?: string;
  deviceIds?: string[];
  issueIds?: string[];
}

export type UpdatePartInput = Partial<CreatePartInput>;

