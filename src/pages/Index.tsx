
import React, { useState } from 'react';
import Navbar from '@/components/layout/Navbar';
import Sidebar from '@/components/layout/Sidebar';
import Dashboard from '@/components/dashboard/Dashboard';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useLocation } from 'react-router-dom';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useProjects } from '@/hooks/use-projects';

const Index: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { useCreateProject } = useProjects();
  const createProjectMutation = useCreateProject();
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  // Extract the current tab from URL or default to dashboard
  const getCurrentTab = () => {
    const path = location.pathname.split('/')[1] || 'dashboard';
    return path;
  };

  const handleTabChange = (value: string) => {
    navigate(`/${value}`);
  };

  const handleNewProject = () => {
    navigate('/projects');
    // Add a small delay to ensure navigation completes
    setTimeout(() => {
      // Find the "New Project" button and click it
      const newProjectBtn = document.querySelector('button:has(.lucide-plus)') as HTMLButtonElement;
      if (newProjectBtn) {
        newProjectBtn.click();
      }
    }, 100);
  };
  
  return (
    <div className="flex h-screen w-full overflow-hidden bg-background">
      <Sidebar />
      <div className="flex flex-col flex-1 overflow-hidden">
        <Navbar />
        <main className="flex-1 overflow-auto custom-scrollbar">
          <div className="p-6 space-y-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-semibold capitalize">{getCurrentTab()}</h1>
              <Button onClick={handleNewProject} className="bg-brand-500 hover:bg-brand-600 transition-colors">
                <Plus className="h-4 w-4 mr-1.5" />
                New Project
              </Button>
            </div>
            
            <Tabs value={getCurrentTab()} onValueChange={handleTabChange} className="w-full">
              <TabsList className="mb-4">
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                <TabsTrigger value="projects">Projects</TabsTrigger>
                <TabsTrigger value="calendar">Calendar</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
                <TabsTrigger value="messages">Messages</TabsTrigger>
                <TabsTrigger value="team">Team</TabsTrigger>
                <TabsTrigger value="settings">Settings</TabsTrigger>
              </TabsList>
              
              <TabsContent value="dashboard">
                <Dashboard />
              </TabsContent>
              
              <TabsContent value="projects">
                {/* Projects content is rendered directly via route */}
                <div className="text-center py-12 text-muted-foreground">
                  Please use the Projects page to view and manage projects
                </div>
              </TabsContent>
              
              <TabsContent value="calendar">
                <div className="border border-border rounded-lg p-8 text-center">
                  <h2 className="text-xl font-medium mb-4">Calendar View</h2>
                  <p className="text-muted-foreground mb-4">
                    This feature will be implemented in a future update.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="timeline">
                <div className="border border-border rounded-lg p-8 text-center">
                  <h2 className="text-xl font-medium mb-4">Timeline View</h2>
                  <p className="text-muted-foreground mb-4">
                    This feature will be implemented in a future update.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="messages">
                <div className="border border-border rounded-lg p-8 text-center">
                  <h2 className="text-xl font-medium mb-4">Messages</h2>
                  <p className="text-muted-foreground mb-4">
                    This feature will be implemented in a future update.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="team">
                <div className="border border-border rounded-lg p-8 text-center">
                  <h2 className="text-xl font-medium mb-4">Team Management</h2>
                  <p className="text-muted-foreground mb-4">
                    This feature will be implemented in a future update.
                  </p>
                </div>
              </TabsContent>
              
              <TabsContent value="settings">
                <div className="border border-border rounded-lg p-8 text-center">
                  <h2 className="text-xl font-medium mb-4">Settings</h2>
                  <p className="text-muted-foreground mb-4">
                    This feature will be implemented in a future update.
                  </p>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </div>
    </div>
  );
};

export default Index;
