import React, { createContext, useContext } from 'react';

interface ProjectActionsContextType {
  openAddDocument: () => void;
}

const ProjectActionsContext = createContext<ProjectActionsContextType | null>(null);

export function ProjectActionsProvider({ 
  children, 
  openAddDocument 
}: { 
  children: React.ReactNode;
  openAddDocument: () => void;
}) {
  return (
    <ProjectActionsContext.Provider value={{ openAddDocument }}>
      {children}
    </ProjectActionsContext.Provider>
  );
}

export function useProjectActions() {
  const context = useContext(ProjectActionsContext);
  if (!context) {
    throw new Error('useProjectActions must be used within ProjectActionsProvider');
  }
  return context;
}
