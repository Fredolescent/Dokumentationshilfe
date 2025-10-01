import { Button } from "@/components/ui/button";

export type Tab = {
  id: string;
  label: string;
  icon?: React.ReactNode;
};

interface TabNavigationProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
}

export default function TabNavigation({ tabs, activeTab, onTabChange }: TabNavigationProps) {
  return (
    <div className="flex gap-2 p-1 bg-muted rounded-lg">
      {tabs.map((tab) => (
        <Button
          key={tab.id}
          variant={activeTab === tab.id ? "default" : "ghost"}
          className="flex-1"
          onClick={() => onTabChange(tab.id)}
          data-testid={`tab-${tab.id}`}
        >
          {tab.icon && <span className="mr-2">{tab.icon}</span>}
          {tab.label}
        </Button>
      ))}
    </div>
  );
}
