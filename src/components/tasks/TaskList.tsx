
import React from 'react';
import { Task } from '@/lib/types';
import { CheckCircle2, Circle, Clock, AlertTriangle } from 'lucide-react';

interface TaskListProps {
  tasks: Task[];
  title: string;
}

const TaskList: React.FC<TaskListProps> = ({ tasks, title }) => {
  // Status icon mapping
  const statusIcons = {
    'todo': <Circle className="h-4 w-4 text-slate-400" />,
    'in-progress': <Clock className="h-4 w-4 text-brand-500" />,
    'review': <AlertTriangle className="h-4 w-4 text-amber-500" />,
    'done': <CheckCircle2 className="h-4 w-4 text-emerald-500" />
  };
  
  // Priority classname mapping
  const priorityClasses = {
    'low': 'priority-low',
    'medium': 'priority-medium',
    'high': 'priority-high'
  };
  
  return (
    <div className="animate-fade-in">
      <h2 className="text-lg font-medium mb-4">{title}</h2>
      <div className="space-y-2">
        {tasks.map((task) => (
          <div 
            key={task.id}
            className="p-3 rounded-lg border border-border bg-card hover:shadow-sm transition-shadow"
          >
            <div className="flex items-start gap-3">
              <div className="mt-0.5">{statusIcons[task.status]}</div>
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <h3 className="font-medium">{task.title}</h3>
                  <span className={`text-xs ${priorityClasses[task.priority]}`}>
                    {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-2">{task.description}</p>
                <div className="flex items-center mt-2">
                  <span className={`status-pill status-${task.status}`}>
                    {task.status.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                  </span>
                  {task.dueDate && (
                    <span className="text-xs text-muted-foreground ml-2 flex items-center">
                      <Clock className="h-3 w-3 mr-1" />
                      {new Date(task.dueDate).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TaskList;
