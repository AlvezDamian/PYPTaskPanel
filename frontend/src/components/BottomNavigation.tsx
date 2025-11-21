import React from "react";

interface BottomNavigationProps {
  activeItem: string;
  onItemClick: (item: string) => void;
}

const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeItem,
  onItemClick,
}) => {
  const items = [
    { id: "tasks", label: "Tasks", icon: "📋" },
    { id: "calendar", label: "Calendar", icon: "📅" },
    { id: "projects", label: "Projets", icon: "📁" },
    { id: "search", label: "Search", icon: "🔍" },
  ];

  return (
    <nav className="bg-white border-t border-gray-200 px-4 py-2">
      <div className="flex justify-around">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onItemClick(item.id)}
            className={`flex flex-col items-center py-2 px-3 rounded-lg transition-colors ${
              activeItem === item.id
                ? "text-blue-600 bg-blue-50"
                : "text-gray-500 hover:text-gray-700"
            }`}
          >
            <span className="text-lg mb-1">{item.icon}</span>
            <span className="text-xs font-medium">{item.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNavigation;

