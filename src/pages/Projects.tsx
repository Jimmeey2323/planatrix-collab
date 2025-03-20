import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Search, Filter, Grid3X3, List } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useProjects } from '@/hooks/use-projects';
import ProjectCard from '@/components/projects/ProjectCard';
import { CreateProjectDialog } from '@/components/projects/CreateProjectDialog';
import { Project } from '@/lib/types';
import AvatarStack from "@/components/ui/AvatarStack";

const Projects: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { useGetProjects } = useProjects();
  const { data: projects, isLoading, error } = useGetProjects();
  
  const filteredProjects = projects?.filter(project => 
    project.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    project.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-6 space-y-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl font-bold">Projects</h1>
        
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          New Project
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input 
            placeholder="Search projects..." 
            className="pl-10"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        
        <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-start">
          <Button variant="outline" size="sm">
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          
          <div className="flex border rounded-md overflow-hidden">
            <Button 
              variant={viewMode === 'grid' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-none"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4" />
            </Button>
            <Button 
              variant={viewMode === 'list' ? 'default' : 'ghost'} 
              size="sm" 
              className="rounded-none"
              onClick={() => setViewMode('list')}
            >
              <List className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
      
      {isLoading ? (
        <div className="flex justify-center p-12">
          <div className="animate-spin h-8 w-8 border-4 border-brand-500 rounded-full border-t-transparent"></div>
        </div>
      ) : error ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <h3 className="text-lg font-medium mb-2">Error loading projects</h3>
          <p className="text-muted-foreground">Please try again later</p>
        </div>
      ) : filteredProjects?.length === 0 ? (
        <div className="text-center py-12 border border-dashed border-border rounded-lg">
          <h3 className="text-lg font-medium mb-2">No projects found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? 'Try a different search term' : 'Get started by creating your first project'}
          </p>
          {!searchQuery && (
            <Button onClick={() => setIsCreateDialogOpen(true)}>
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          )}
        </div>
      ) : (
        <div className={viewMode === 'grid' 
          ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6" 
          : "space-y-4"
        }>
          {filteredProjects?.map((project) => (
            viewMode === 'grid' ? (
              <Link to={`/projects/${project.id}`} key={project.id} className="block">
                <ProjectCard project={project} />
              </Link>
            ) : (
              <ProjectListItem key={project.id} project={project} />
            )
          ))}
        </div>
      )}

      <CreateProjectDialog 
        isOpen={isCreateDialogOpen} 
        onClose={() => setIsCreateDialogOpen(false)}
      />
    </div>
  );
};

interface ProjectListItemProps {
  project: Project;
}

const ProjectListItem: React.FC<ProjectListItemProps> = ({ project }) => {
  const completedTasks = project.tasks.filter(task => task.status === 'done').length;
  const totalTasks = project.tasks.length;
  const percentComplete = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  return (
    <Link 
      to={`/projects/${project.id}`} 
      className="block p-4 border border-border rounded-lg bg-card hover:shadow-md transition-shadow"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-medium">{project.title}</h3>
            <span className={`px-2 py-0.5 text-xs font-medium rounded-full ${
              project.status === 'active' ? 'bg-green-100 text-green-800' :
              project.status === 'on-hold' ? 'bg-amber-100 text-amber-800' :
              project.status === 'completed' ? 'bg-blue-100 text-blue-800' :
              'bg-slate-100 text-slate-800'
            }`}>
              {project.status ? project.status.charAt(0).toUpperCase() + project.status.slice(1) : 'Planned'}
            </span>
          </div>
          <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{project.description}</p>
        </div>
        
        <div className="flex items-center gap-8">
          <div>
            <div className="text-xs text-muted-foreground mb-1">{percentComplete}% Complete</div>
            <div className="w-32 h-2 bg-secondary rounded-full overflow-hidden">
              <div 
                className="h-full bg-brand-500 rounded-full"
                style={{ width: `${percentComplete}%` }}
              ></div>
            </div>
          </div>
          
          <div className="flex items-center">
            {project.team.length > 0 && (
              <AvatarStack users={project.team} size="sm" limit={3} />
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default Projects;
