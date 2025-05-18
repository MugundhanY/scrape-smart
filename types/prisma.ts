/**
 * Type definitions for Prisma models used across the application.
 * These are generated manually to avoid import issues with Prisma client
 * and to provide better type safety.
 */

export interface Workflow {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  definition: string;
  executionPlan: string | null;
  creditsCost: number;
  cron: string | null;
  status: string;
  lastRunAt: Date | null;
  lastRunId: string | null;
  lastRunStatus: string | null;
  nextRunAt: Date | null;
  createdAt: Date;
  updatedAt: Date;
  executions?: WorkflowExecution[];
}

export interface WorkflowExecution {
  id: string;
  workflowId: string;
  userId: string;
  trigger: string;
  status: string;
  createdAt: Date;
  startedAt?: Date | null;
  completedAt?: Date | null;
  definition: string;
  creditsConsumed: number;
  phases?: ExecutionPhase[];
  workflow?: Workflow;
}

export interface ExecutionPhase {
  id: string;
  userId: string;
  status: string;
  number: number;
  node: string;
  name: string;
  startedAt?: Date | null;
  completedAt?: Date | null;
  inputs?: string | null;
  outputs?: string | null;
  creditsConsumed?: number | null;
  workflowExecutionId: string;
  execution?: WorkflowExecution;
  logs?: ExecutionLog[];
}

export interface ExecutionLog {
  id: string;
  logLevel: string;
  message: string;
  timestamp: Date;
  executionPhaseId: string;
  executionPhase?: ExecutionPhase;
}

export interface Credential {
  id: string;
  userId: string;
  name: string;
  value: string;
  createdAt: Date;
}

export interface UserPurchase {
  id: string;
  userId: string;
  stripeId: string;
  description: string;
  amount: number;
  currency: string;
  date: Date;
}

export interface User {
  id: string;
  name: string | null;
  email: string | null;
  emailVerified: Date | null;
  image: string | null;
  password: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserPreference {
  id: string;
  userId: string;
  emailNotifications: boolean;
  workflowAlerts: boolean;
  marketingEmails: boolean;
  createdAt: Date;
  updatedAt: Date;
}
