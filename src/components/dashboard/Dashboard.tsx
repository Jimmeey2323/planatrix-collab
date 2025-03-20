import React from 'react';
import { Calendar, CheckCheck, Clock, LayoutGrid, Plus, Users } from 'lucide-react';
import ProjectCard from '@/components/projects/ProjectCard';
import TaskList from '@/components/tasks/TaskList';
import { Link, useNavigate } from 'react-router-dom';
import { Project, Task, User, Activity } from '@/lib/types';
import { Button } from '@/components/ui/button';

// Mock data for demo purposes
const mockTeam: User[] = [
  { id: '1', name: 'Alex Morgan', email: 'alex@example.com', avatar: '', role: 'admin' },
  { id: '2', name: 'Jamie Smith', email: 'jamie@example.com', avatar: '', role: 'editor' },
  { id: '3', name: 'Taylor Johnson', email: 'taylor@example.com', avatar: '', role: 'viewer' },
  { id: '4', name: 'Casey Wilson', email: 'casey@example.com', avatar: '', role: 'editor' },
];

const mockTasks: Task[] = [
  {
    id: '1',
    title: 'Design project dashboard',
    description: 'Create wireframes and UI designs for the project dashboard',
    status: 'done',
    priority: 'high',
    dueDate: '2023-12-01',
    assignees: [mockTeam[0], mockTeam[1]],
    tags: ['design', 'UI/UX'],
    progress: 100,
    createdAt: '2023-11-25',
    updatedAt: '2023-11-30',
  },
  {
    id: '2',
    title: 'Implement user authentication',
    description: 'Set up user authentication with role-based permissions',
    status: 'in-progress',
    priority: 'high',
    dueDate: '2023-12-10',
    assignees: [mockTeam[2]],
    tags: ['backend', 'security'],
    progress: 60,
    createdAt: '2023-11-28',
    updatedAt: '2023-12-05',
  },
  {
    id: '3',
    title: 'Create database schema',
    description: 'Design and implement database schema for the application',
    status: 'review',
    priority: 'medium',
    dueDate: '2023-12-08',
    assignees: [mockTeam[3]],
    tags: ['database', 'backend'],
    progress: 90,
    createdAt: '2023-11-27',
    updatedAt: '2023-12-04',
  },
  {
    id: '4',
    title: 'API integration testing',
    description: 'Test all API endpoints and ensure proper error handling',
    status: 'todo',
    priority: 'medium',
    dueDate: '2023-12-15',
    assignees: [mockTeam[1], mockTeam[2]],
    tags: ['testing', 'backend'],
    progress: 0,
    createdAt: '2023-12-01',
    updatedAt: '2023-12-01',
  },
  {
    id: '5',
    title: 'Setup CI/CD pipeline',
    description: 'Configure continuous integration and deployment pipeline',
    status: 'todo',
    priority: 'low',
    dueDate: '2023-12-20',
    assignees: [mockTeam[0]],
    tags: ['devops'],
    progress: 0,
    createdAt: '2023-12-02',
    updatedAt: '2023-12-02',
  }
];

const mockProjects: Project[] = [
  {
    id: '1',
    title: 'Website Redesign',
    description: 'Complete overhaul of the company website with new branding',
    team: mockTeam,
    tasks: mockTasks.slice(0, 3),
    dueDate: '2023-12-31',
    startDate: '2023-11-01',
    progress: 65,
    createdAt: '2023-11-01',
    updatedAt: '2023-12-05',
  },
  {
    id: '2',
    title: 'Mobile App Development',
    description: 'Create a mobile app for both Android and iOS platforms',
    team: mockTeam.slice(1, 4),
    tasks: mockTasks.slice(3, 5),
    dueDate: '2024-01-15',
    startDate: '2023-11-15',
    progress: 30,
    createdAt: '2023-11-15',
    updatedAt: '2023-12-03',
  },
  {
    id: '3',
    title: 'Marketing Campaign',
    description: 'Q1 2024 marketing campaign for product launch',
    team: mockTeam.slice(0, 2),
    tasks: [],
    dueDate: '2024-02-28',
    startDate: '2023-12-01',
    progress: 10,
    createdAt: '2023-12-01',
    updatedAt: '2023-12-03',
  }
];

const mockActivity: Activity[] = [
  {
    id: '1',
    user: mockTeam[0],
    action: 'completed',
    target: {
      type: 'task',
      id: '1',
      title: 'Design project dashboard'
    },
    timestamp: '2023-12-05T14:30:00Z'
  },
  {
    id: '2',
    user: mockTeam[2],
    action: 'updated',
    target: {
      type: 'task',
      id: '2',
      title: 'Implement user authentication'
    },
    timestamp: '2023-12-05T12:15:00Z'
  },
  {
    id: '3',
    user: mockTeam[1],
    action: 'created',
    target: {
      type: 'project',
      id: '3',
      title: 'Marketing Campaign'
    },
    timestamp: '2023-12-03T09:45:00Z'
  }
];

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  // Add safe fallbacks to prevent errors
  const safeProjects = mockProjects || [];
  const safeTasks = mockTasks || [];
  
  const handleNewProject = () => {
    navigate('/projects');
  };
  
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <DashboardCard 
          icon={<LayoutGrid className="h-5 w-5 text-brand-500" />}
          title="Total Projects"
          value={safeProjects.length.toString()}
          trend="+2 this month"
          trendUp={true}
        />
        <DashboardCard 
          icon={<CheckCheck className="h-5 w-5 text-emerald-500" />}
          title="Completed Tasks"
          value={safeTasks.filter(t => t.status === 'done').length.toString()}
          trend="+5 this week"
          trendUp={true}
        />
        <DashboardCard 
          icon={<Clock className="h-5 w-5 text-amber-500" />}
          title="Tasks In Progress"
          value={safeTasks.filter(t => t.status === 'in-progress').length.toString()}
          trend="On track"
          trendUp={null}
        />
        <DashboardCard 
          icon={<Users className="h-5 w-5 text-indigo-500" />}
          title="Team Members"
          value={(mockTeam || []).length.toString()}
          trend="+1 this week"
          trendUp={true}
        />
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Recent Projects</h2>
              <Button 
                variant="link" 
                onClick={() => navigate('/projects')} 
                className="text-sm text-brand-600 hover:text-brand-700 font-medium"
              >
                View All
              </Button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {safeProjects.map(project => (
                <Link key={project.id} to={`/projects/${project.id}`}>
                  <ProjectCard project={project} />
                </Link>
              ))}
            </div>
          </div>
          
          <div>
            <TaskList tasks={safeTasks} title="Your Tasks" />
          </div>
        </div>
        
        <div className="lg:col-span-1">
          <div className="rounded-xl bg-card border border-border p-5">
            <h2 className="text-xl font-medium mb-4">Recent Activity</h2>
            <div className="space-y-4">
              {(mockActivity || []).map(activity => (
                <ActivityItem key={activity.id} activity={activity} />
              ))}
            </div>
          </div>
          
          <div className="rounded-xl bg-card border border-border p-5 mt-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium">Upcoming</h2>
              <Button
                variant="link"
                onClick={() => navigate('/calendar')}
                className="text-sm text-brand-600 hover:text-brand-700 font-medium flex items-center"
              >
                <Calendar className="h-4 w-4 mr-1" />
                View Calendar
              </Button>
            </div>
            <div className="space-y-3">
              {mockTasks
                .filter(task => task.dueDate && new Date(task.dueDate) > new Date())
                .sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
                .slice(0, 3)
                .map(task => (
                  <div key={task.id} className="flex items-center p-2 hover:bg-muted rounded-md transition-colors">
                    <div className="h-8 w-8 rounded-full bg-brand-100 flex items-center justify-center mr-3">
                      <Clock className="h-4 w-4 text-brand-700" />
                    </div>
                    <div>
                      <h3 className="text-sm font-medium">{task.title}</h3>
                      <p className="text-xs text-muted-foreground">
                        Due {new Date(task.dueDate!).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                ))
              }
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  trend: string;
  trendUp: boolean | null;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ 
  icon, 
  title, 
  value, 
  trend, 
  trendUp 
}) => {
  let trendColor = 'text-muted-foreground';
  
  if (trendUp === true) {
    trendColor = 'text-emerald-500';
  } else if (trendUp === false) {
    trendColor = 'text-red-500';
  }
  
  return (
    <div className="bg-card border border-border rounded-xl p-5 animate-slide-in-bottom">
      <div className="flex justify-between items-start">
        <div className="h-10 w-10 rounded-lg bg-muted flex items-center justify-center">
          {icon}
        </div>
      </div>
      <div className="mt-4">
        <h3 className="text-sm font-medium text-muted-foreground">{title}</h3>
        <p className="text-2xl font-semibold mt-1">{value}</p>
        <p className={`text-xs mt-1 ${trendColor}`}>{trend}</p>
      </div>
    </div>
  );
};

interface ActivityItemProps {
  activity: Activity;
}

const ActivityItem: React.FC<ActivityItemProps> = ({ activity }) => {
  // Format timestamp to relative time
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    
    if (diffMins < 60) {
      return `${diffMins} min ago`;
    } else if (diffMins < 24 * 60) {
      return `${Math.floor(diffMins / 60)} hours ago`;
    } else {
      return `${Math.floor(diffMins / (60 * 24))} days ago`;
    }
  };
  
  // Action color mapping
  const actionColor = () => {
    switch (activity.action) {
      case 'completed':
        return 'bg-emerald-100 text-emerald-700';
      case 'created':
        return 'bg-brand-100 text-brand-700';
      case 'updated':
        return 'bg-amber-100 text-amber-700';
      default:
        return 'bg-slate-100 text-slate-700';
    }
  };
  
  return (
    <div className="flex items-start">
      <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center overflow-hidden mt-1 mr-3">
        {activity.user.avatar ? (
          <img 
            src={activity.user.avatar} 
            alt={activity.user.name} 
            className="h-full w-full object-cover"
          />
        ) : (
          <Users className="h-4 w-4 text-muted-foreground" />
        )}
      </div>
      <div className="flex-1">
        <p className="text-sm">
          <span className="font-medium">{activity.user.name}</span>{' '}
          <span className={`px-1.5 py-0.5 rounded-full text-xs ${actionColor()}`}>
            {activity.action}
          </span>{' '}
          <span className="text-muted-foreground">{activity.target.type}</span>{' '}
          <span className="font-medium">{activity.target.title}</span>
        </p>
        <p className="text-xs text-muted-foreground mt-1">
          {formatTime(activity.timestamp)}
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
