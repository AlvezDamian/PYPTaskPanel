import React from 'react';
import { Task } from '../types/Task';
import Header from './Header';
import NavigationTabs from './NavigationTabs';
import NewTaskButton from './NewTaskButton';
import TaskSection from './TaskSection';
import BottomNavigation from './BottomNavigation';

interface MobileLayoutProps {
  tasks: Task[];
  onToggleComplete: (taskId: string) => Promise<void>;
  onTaskClick: (taskId: string) => void;
  onNewTask: () => void;
  onDelete?: (taskId: string) => Promise<void>;
  isAdmin?: boolean;
  activeTab: string;
  onTabChange: (tab: string) => void;
  activeNavItem: string;
  onNavItemClick: (item: string) => void;
}

/**
 * MobileLayout component
 * Responsive layout for mobile devices
 */
const MobileLayout: React.FC<MobileLayoutProps> = ({
  tasks,
  onToggleComplete,
  onTaskClick,
  onNewTask,
  onDelete,
  isAdmin,
  activeTab,
  onTabChange,
  activeNavItem,
  onNavItemClick,
}) => {
  const todoTasks = tasks.filter((task) => task.status === 'TODO');
  const doingTasks = tasks.filter((task) => task.status === 'DOING');
  const doneTasks = tasks.filter((task) => task.status === 'DONE');

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return (
          <div className="px-4 py-4">
            <NewTaskButton onClick={onNewTask} />
            <div className="mt-6 space-y-6">
              <TaskSection
                title="To Do"
                tasks={todoTasks}
                onToggleComplete={onToggleComplete}
                onTaskClick={onTaskClick}
                onDelete={onDelete}
                isAdmin={isAdmin}
              />
              <TaskSection
                title="In Progress"
                tasks={doingTasks}
                onToggleComplete={onToggleComplete}
                onTaskClick={onTaskClick}
                onDelete={onDelete}
                isAdmin={isAdmin}
              />
            </div>
          </div>
        );
      case 'calendar':
        return (
          <div className="px-4 py-4">
            <div className="bg-white rounded-lg p-6 text-center">
              <p className="text-gray-500">Calendar view coming soon</p>
            </div>
          </div>
        );
      case 'done':
        return (
          <div className="px-4 py-4">
            <TaskSection
              title="Done"
              tasks={doneTasks}
              onToggleComplete={onToggleComplete}
              onTaskClick={onTaskClick}
              onDelete={onDelete}
              isAdmin={isAdmin}
            />
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <Header />

      {/* Navigation Tabs */}
      <NavigationTabs activeTab={activeTab} onTabChange={onTabChange} />

      {/* Main Content */}
      <div className="flex-1">{renderContent()}</div>

      {/* Bottom Navigation */}
      <div className="fixed bottom-0 left-0 right-0 z-50">
        <BottomNavigation
          activeItem={activeNavItem}
          onItemClick={onNavItemClick}
        />
      </div>
    </div>
  );
};

export default MobileLayout;
