
export type UserRole = 'admin' | 'editor' | 'viewer';

export type TaskStatus = 'todo' | 'in-progress' | 'review' | 'done';

export type TaskPriority = 'low' | 'medium' | 'high';

export interface User {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: UserRole;
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
}

export interface Dashboard {
  recentProjects: Project[];
  upcomingTasks: Task[];
  teamActivity: Activity[];
}

export interface Activity {
  id: string;
  user: User;
  action: string;
  target: {
    type: 'project' | 'task' | 'comment';
    id: string;
    title: string;
  };
  timestamp: string;
}
