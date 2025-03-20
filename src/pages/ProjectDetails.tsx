
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useProjects } from '@/hooks/use-projects';
import { useTasks } from '@/hooks/use-tasks';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Edit, 
  MoreHorizontal, 
  Plus, 
  Trash2, 
  Users
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, parseISO } from 'date-fns';
import AvatarStack from '@/components/ui/AvatarStack';
import TaskList from '@/components/tasks/TaskList';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useToast } from '@/hooks/use-toast';
import { KanbanBoard } from '@/components/projects/KanbanBoard';
import { ProjectTimeline } from '@/components/projects/ProjectTimeline';
import { EditProjectDialog } from '@/components/projects/EditProjectDialog';
import { CreateTaskDialog } from '@/components/tasks/CreateTaskDialog';

const ProjectDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [isEditProjectOpen, setIsEditProjectOpen] = useState(false);
  const [isCreateTaskOpen, setIsCreateTaskOpen] = useState(false);
  
  const { useGetProject, useDeleteProject } = useProjects();
  const { useGetProjectTasks } = useTasks();
  
  const { data: project, isLoading: projectLoading, error: projectError } = useGetProject(id || '');
  const { data: tasks, isLoading: tasksLoading } = useGetProjectTasks(id || '');
  const deleteProjectMutation = useDeleteProject();
  
  const handleDeleteProject = () => {
    if (!project) return;
    
    if (window.confirm(`Are you sure you want to delete "${project.title}"? This action cannot be undone.`)) {
      deleteProjectMutation.mutate(project.id, {
        onSuccess: () => {
          navigate('/projects');
        }
      });
    }
  };

  if (projectLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)]">
        <div className="animate-spin h-8 w-8 border-4 border-brand-500 rounded-full border-t-transparent"></div>
      </div>
    );
  }
  
  if (projectError || !project) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-4rem)]">
        <h2 className="text-2xl font-bold mb-2">Project not found</h2>
        <p className="text-muted-foreground mb-4">The project you're looking for doesn't exist or you don't have access to it.</p>
        <Button onClick={() => navigate('/projects')}>Back to Projects</Button>
      </div>
    );
  }

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'No date set';
    try {
      return format(parseISO(dateString), 'PPP');
    } catch (error) {
      return 'Invalid date';
    }
  };
  
  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter(task => task.status === 'done').length || 0;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;
  
  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold">{project.title}</h1>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'on-hold' ? 'bg-amber-100 text-amber-800' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-slate-100 text-slate-800'
            }`}>
              {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Planned'}
            </span>
          </div>
          <p className="text-muted-foreground mt-1">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsCreateTaskOpen(true)}
          >
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
          
          <Button 
            variant="outline" 
            size="sm" 
            className="flex items-center gap-1"
            onClick={() => setIsEditProjectOpen(true)}
          >
            <Edit className="h-4 w-4" />
            Edit
          </Button>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-9 w-9 p-0">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onSelect={() => toast({ title: "Export Project", description: "Export functionality will be implemented in the next phase." })}>
                Export Project
              </DropdownMenuItem>
              <DropdownMenuItem onSelect={() => toast({ title: "Duplicate Project", description: "Duplicate functionality will be implemented in the next phase." })}>
                Duplicate Project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem 
                className="text-red-600" 
                onSelect={handleDeleteProject}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete Project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-4 bg-card border border-border rounded-lg flex flex-col">
          <div className="text-muted-foreground text-sm font-medium">Start Date</div>
          <div className="flex items-center mt-1">
            <Calendar className="h-4 w-4 mr-2 text-slate-500" />
            <span>{formatDate(project.startDate)}</span>
          </div>
        </div>
        
        <div className="p-4 bg-card border border-border rounded-lg flex flex-col">
          <div className="text-muted-foreground text-sm font-medium">Due Date</div>
          <div className="flex items-center mt-1">
            <Clock className="h-4 w-4 mr-2 text-slate-500" />
            <span>{formatDate(project.dueDate)}</span>
          </div>
        </div>
        
        <div className="p-4 bg-card border border-border rounded-lg flex flex-col">
          <div className="text-muted-foreground text-sm font-medium">Team</div>
          <div className="flex items-center mt-1">
            <Users className="h-4 w-4 mr-2 text-slate-500" />
            {project.team.length > 0 ? (
              <div className="flex items-center">
                <AvatarStack users={project.team} size="sm" />
                <span className="ml-2">{project.team.length} members</span>
              </div>
            ) : (
              <span>No team members</span>
            )}
          </div>
        </div>
      </div>

      <div className="bg-card border border-border rounded-lg p-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Progress</h3>
            <div className="flex items-center gap-2 mt-1">
              <CheckCircle2 className="h-4 w-4 text-green-500" />
              <span>{completedTasks} of {totalTasks} tasks completed</span>
            </div>
          </div>
          <span className="text-2xl font-bold mt-2 sm:mt-0">{percentComplete}%</span>
        </div>
        <Progress value={percentComplete} className="h-2" />
      </div>

      <Tabs defaultValue="list" className="mt-6">
        <TabsList className="mb-4">
          <TabsTrigger value="list">List</TabsTrigger>
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
        </TabsList>
        
        <TabsContent value="list" className="mt-0">
          {tasksLoading ? (
            <div className="flex justify-center p-8">
              <div className="animate-spin h-8 w-8 border-4 border-brand-500 rounded-full border-t-transparent"></div>
            </div>
          ) : tasks && tasks.length > 0 ? (
            <TaskList tasks={tasks} title="" />
          ) : (
            <div className="text-center py-12 border border-dashed border-border rounded-lg">
              <h3 className="text-lg font-medium mb-2">No tasks yet</h3>
              <p className="text-muted-foreground mb-4">Get started by creating your first task</p>
              <Button onClick={() => setIsCreateTaskOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Task
              </Button>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="kanban" className="mt-0">
          <KanbanBoard tasks={tasks || []} projectId={project.id} />
        </TabsContent>
        
        <TabsContent value="timeline" className="mt-0">
          <ProjectTimeline tasks={tasks || []} project={project} />
        </TabsContent>
      </Tabs>

      {isEditProjectOpen && (
        <EditProjectDialog 
          project={project} 
          isOpen={isEditProjectOpen} 
          onClose={() => setIsEditProjectOpen(false)} 
        />
      )}
      
      {isCreateTaskOpen && (
        <CreateTaskDialog 
          projectId={project.id}
          isOpen={isCreateTaskOpen} 
          onClose={() => setIsCreateTaskOpen(false)} 
        />
      )}
    </div>
  );
};

export default ProjectDetails;
