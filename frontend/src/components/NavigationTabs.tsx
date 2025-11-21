import React from "react";

interface NavigationTabsProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const NavigationTabs: React.FC<NavigationTabsProps> = ({
  activeTab,
  onTabChange,
}) => {
  const tabs = [
    { id: "tasks", label: "Tasks" },
    { id: "calendar", label: "Calendar" },
    { id: "done", label: "Done" },
  ];

  return (
    <div className="bg-white px-4 py-3">
      <div className="flex space-x-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default NavigationTabs;

