
import React from 'react';
import { Calendar, MoreHorizontal } from 'lucide-react';
import { Project } from '@/lib/types';
import AvatarStack from "@/components/ui/AvatarStack";
import { formatDistanceToNow } from 'date-fns';

interface ProjectCardProps {
  project: Project;
}

const ProjectCard: React.FC<ProjectCardProps> = ({ project }) => {
  const daysLeft = project.dueDate 
    ? formatDistanceToNow(new Date(project.dueDate), { addSuffix: true })
    : 'No deadline';
    
  // Get task stats
  const totalTasks = project.tasks.length;
  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  const completionPercentage = totalTasks > 0 
    ? Math.round((completedTasks / totalTasks) * 100) 
    : 0;
    
  return (
    <div className="rounded-xl bg-card border border-border p-5 hover:shadow-md transition-shadow animate-scale-in">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="font-medium text-lg text-card-foreground">{project.title}</h3>
          <p className="text-sm text-muted-foreground line-clamp-2 mt-1">{project.description}</p>
        </div>
        
        <button className="h-8 w-8 rounded-full flex items-center justify-center text-muted-foreground hover:bg-muted transition-colors">
          <MoreHorizontal className="h-5 w-5" />
        </button>
      </div>
      
      <div className="mt-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium">{completionPercentage}% Complete</span>
          <span className="text-xs text-muted-foreground">{completedTasks}/{totalTasks} tasks</span>
        </div>
        
        <div className="w-full h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-brand-500 rounded-full"
            style={{ width: `${completionPercentage}%` }}
          ></div>
        </div>
      </div>
      
      <div className="mt-6 flex items-center justify-between">
        <div className="flex items-center text-muted-foreground text-xs">
          <Calendar className="h-3.5 w-3.5 mr-1.5" />
          <span>{daysLeft}</span>
        </div>
        
        <AvatarStack users={project.team} size="sm" />
      </div>
    </div>
  );
};

export default ProjectCard;
