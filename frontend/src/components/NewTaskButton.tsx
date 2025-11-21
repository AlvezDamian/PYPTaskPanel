import React from 'react';
import { useAuth } from '../contexts/AuthContext';

interface NewTaskButtonProps {
  onClick: () => void;
}

/**
 * NewTaskButton component
 * Button to trigger new task creation
 * Only visible to admin users
 */
const NewTaskButton: React.FC<NewTaskButtonProps> = ({ onClick }) => {
  const { user } = useAuth();
  const isAdmin = user?.role === 'ADMIN';

  if (!isAdmin) {
    return null;
  }

  return (
    <div className="w-full">
      <button
        onClick={onClick}
        className="w-full bg-paypros-primary text-white py-3 px-4 rounded-lg font-medium hover:bg-paypros-accent transition-colors focus:outline-none focus:ring-2 focus:ring-paypros-primary focus:ring-offset-2"
      >
        New Task
      </button>
      <div className="mt-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-xs text-blue-800 leading-relaxed">
          <strong>Note:</strong> Only admin users can create and delete tasks. Regular users can only change task status. Tasks can be assigned to specific users during creation.
        </p>
      </div>
    </div>
  );
};

export default NewTaskButton;
