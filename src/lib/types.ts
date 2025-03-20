
export type UserRole = 'admin' | 'editor' | 'viewer';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
  skills?: string[];
  department?: string;
  title?: string;
  availability?: number; // Percentage of availability (0-100)
  workload?: number; // Current workload percentage (0-100)
}

export interface Comment {
  id: string;
  content: string;
  user: User;
  createdAt: string;
  updatedAt: string;
  attachments?: Attachment[];
}

export interface Attachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
  uploadedAt: string;
  uploadedBy: User;
}

export interface ChecklistItem {
  id: string;
  title: string;
  completed: boolean;
  assignee?: User;
  dueDate?: string;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  dueDate: string | null;
  assignees: User[];
  tags: string[];
  progress: number;
  createdAt: string;
  updatedAt: string;
  parentId?: string | null;
  subtasks?: Task[];
  dependencies?: string[]; // IDs of tasks this task depends on
  estimatedHours?: number;
  loggedHours?: number;
  comments?: Comment[];
  attachments?: Attachment[];
  checklist?: ChecklistItem[];
  recurrence?: {
    pattern: 'daily' | 'weekly' | 'monthly' | 'custom';
    interval: number;
    endDate?: string;
    endAfterOccurrences?: number;
  };
  customFields?: Record<string, any>;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  team: User[];
  tasks: Task[];
  dueDate: string | null;
  startDate: string;
  progress: number;
  createdAt: string;
  updatedAt: string;
  portfolio?: string; // Portfolio ID if part of a portfolio
  template?: boolean; // Whether this is a template
  customFields?: Record<string, any>;
  categories?: string[];
  status?: 'planned' | 'active' | 'on-hold' | 'completed' | 'cancelled';
}

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  projects: Project[];
  team: User[];
  progress: number;
  createdAt: string;
  updatedAt: string;
}

export interface Dashboard {
  recentProjects: Project[];
  upcomingTasks: Task[];
  teamActivity: Activity[];
  overdueTasks?: Task[];
  projectMetrics?: ProjectMetrics;
  teamMetrics?: TeamMetrics;
}

export interface ProjectMetrics {
  totalProjects: number;
  completedProjects: number;
  activeProjects: number;
  onHoldProjects: number;
  upcomingDeadlines: number;
  overdueTasks: number;
  averageTaskCompletion: number;
}

export interface TeamMetrics {
  totalMembers: number;
  averageWorkload: number;
  topContributors: User[];
  resourceUtilization: number;
}

export interface Activity {
  id: string;
  user: User;
  action: string;
  target: {
    type: 'project' | 'task' | 'comment' | 'portfolio';
    id: string;
    title: string;
  };
  timestamp: string;
}

export interface ViewSettings {
  id: string;
  name: string;
  type: 'kanban' | 'list' | 'timeline' | 'calendar' | 'dashboard';
  filters?: Record<string, any>;
  sortBy?: string;
  groupBy?: string;
  userId: string;
  isDefault?: boolean;
}

export interface GoogleIntegration {
  calendar: boolean;
  sheets: boolean;
  gmail: boolean;
  connected: boolean;
}

export interface AIRequest {
  prompt: string;
  context?: {
    projectId?: string;
    taskId?: string;
    userId?: string;
  };
}

export interface AIResponse {
  result: any;
  suggestions?: string[];
  analysis?: Record<string, any>;
}

export interface ExportOptions {
  format: 'pdf' | 'excel' | 'csv' | 'image' | 'ical' | 'json';
  includeComments?: boolean;
  includeAttachments?: boolean;
  dateRange?: {
    start: string;
    end: string;
  };
}
