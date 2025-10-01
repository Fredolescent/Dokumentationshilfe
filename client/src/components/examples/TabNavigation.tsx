import { useState } from "react";
import { ClipboardList, Briefcase, Target } from "lucide-react";
import TabNavigation from "../TabNavigation";

export default function TabNavigationExample() {
  const [activeTab, setActiveTab] = useState("behavior");

  const tabs = [
    { id: "behavior", label: "Arbeitsverhalten", icon: <ClipboardList className="h-4 w-4" /> },
    { id: "activity", label: "Tätigkeiten", icon: <Briefcase className="h-4 w-4" /> },
    { id: "goals", label: "Ziele", icon: <Target className="h-4 w-4" /> },
  ];

  return (
    <div className="p-6 max-w-4xl">
      <TabNavigation
        tabs={tabs}
        activeTab={activeTab}
        onTabChange={(tabId) => {
          setActiveTab(tabId);
          console.log("Tab changed to:", tabId);
        }}
      />
      <div className="mt-6 p-4 border rounded-lg">
        <p className="text-sm text-muted-foreground">Active tab: {activeTab}</p>
      </div>
    </div>
  );
}
