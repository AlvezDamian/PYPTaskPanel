import React from 'react';
import { Task } from '../types/Task';
import TaskCard from './TaskCard';

interface TaskSectionProps {
  title: string;
  tasks: Task[];
  onToggleComplete: (taskId: string) => Promise<void>;
  onTaskClick: (taskId: string) => void;
  onDelete?: (taskId: string) => Promise<void>;
  isAdmin?: boolean;
}

/**
 * TaskSection component
 * Displays a section of tasks grouped by status
 */
const TaskSection: React.FC<TaskSectionProps> = ({
  title,
  tasks,
  onToggleComplete,
  onTaskClick,
  onDelete,
  isAdmin,
}) => {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-3">{title}</h2>
      <div className="space-y-3">
        {tasks.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-6 text-center">
            <p className="text-gray-500 text-sm">No tasks in this section</p>
          </div>
        ) : (
          tasks.map((task) => (
            <TaskCard
              key={task.id}
              task={task}
              onToggleComplete={onToggleComplete}
              onTaskClick={onTaskClick}
              onDelete={onDelete}
              isAdmin={isAdmin}
            />
          ))
        )}
      </div>
    </div>
  );
};

export default TaskSection;
