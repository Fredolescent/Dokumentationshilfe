import { useState, useEffect, useCallback } from "react";
import { Link } from "wouter";
import { ClipboardList, Briefcase, Target, HelpCircle, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { ThemeToggle } from "@/components/ThemeToggle";
import PersonSelector from "@/components/PersonSelector";
import TabNavigation from "@/components/TabNavigation";
import WorkBehaviorSelection, { type Selection } from "@/components/WorkBehaviorSelection";
import WorkBehaviorOutput from "@/components/WorkBehaviorOutput";
import ActivitySelection from "@/components/ActivitySelection";
import ActivityOutput from "@/components/ActivityOutput";
import GoalCard from "@/components/GoalCard";
import GoalForm, { type GoalFormData } from "@/components/GoalForm";
import HelpDialog from "@/components/HelpDialog";
import * as storage from "@/lib/storage";
import type { Person, WorkBehaviorCategory, ActivityArea, Activity, Goal } from "@shared/schema";

export default function Home() {
  const [activeTab, setActiveTab] = useState("behavior");
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [documentingPerson, setDocumentingPerson] = useState("");
  const [selectedWorkBehavior, setSelectedWorkBehavior] = useState<Selection[] | null>(null);
  const [selectedActivity, setSelectedActivity] = useState<Activity | null>(null);
  const [helpOpen, setHelpOpen] = useState(false);
  const [showGoalForm, setShowGoalForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const { toast } = useToast();

  const [persons, setPersons] = useState<Person[]>([]);
  const [workBehaviorCategories, setWorkBehaviorCategories] = useState<WorkBehaviorCategory[]>([]);
  const [activityAreas, setActivityAreas] = useState<ActivityArea[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);

  useEffect(() => {
    loadData();
    setDocumentingPerson(storage.getDocumentingPerson());
  }, []);

  const loadData = () => {
    setPersons(storage.getPersons());
    setWorkBehaviorCategories(storage.getWorkBehaviorCategories());
    setActivityAreas(storage.getActivityAreas());
    setActivities(storage.getActivities());
    setGoals(storage.getGoals());
  };

  const handleDocumentingPersonChange = (value: string) => {
    setDocumentingPerson(value);
    storage.setDocumentingPerson(value);
  };

  const tabs = [
    { id: "behavior", label: "Arbeitsverhalten", icon: <ClipboardList className="h-4 w-4" /> },
    { id: "activity", label: "Tätigkeiten", icon: <Briefcase className="h-4 w-4" /> },
    { id: "goals", label: "Ziele", icon: <Target className="h-4 w-4" /> },
  ];

  const selectedPerson = persons.find(p => p.id === selectedPersonId);
  const personGoals = goals.filter(g => g.personId === selectedPersonId);

  const handleWorkBehaviorSelectionsChange = useCallback((selections: Selection[]) => {
    setSelectedWorkBehavior(selections.length > 0 ? selections : null);
  }, []);

  const handleSelectActivity = (activity: Activity) => {
    if (!selectedPerson) {
      toast({ title: "Fehler", description: "Bitte wähle zuerst eine Person aus.", variant: "destructive" });
      return;
    }
    setSelectedActivity(activity);
  };

  const handleCopyText = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast({ title: "Kopiert!", description: `${label} wurde in die Zwischenablage kopiert.` });
  };

  const handleSubmitGoal = (data: GoalFormData) => {
    if (!selectedPersonId) return;

    if (editingGoal) {
      storage.updateGoal(editingGoal.id, data);
      toast({ title: "Ziel aktualisiert", description: "Das Ziel wurde erfolgreich aktualisiert." });
    } else {
      storage.addGoal({
        ...data,
        personId: selectedPersonId,
        dueDate: data.dueDate || null,
        status: "open",
      });
      toast({ title: "Ziel erstellt", description: "Das neue Ziel wurde erfolgreich erstellt." });
    }
    
    loadData();
    setShowGoalForm(false);
    setEditingGoal(null);
  };

  const handleEditGoal = (goal: Goal) => {
    setEditingGoal(goal);
    setShowGoalForm(true);
  };

  const handleDeleteGoal = (goalId: string) => {
    storage.deleteGoal(goalId);
    loadData();
    toast({ title: "Ziel gelöscht", description: "Das Ziel wurde erfolgreich gelöscht." });
  };

  const handleToggleGoalStatus = (goalId: string) => {
    const goal = goals.find(g => g.id === goalId);
    if (!goal) return;
    
    storage.updateGoal(goalId, {
      status: goal.status === "completed" ? "open" : "completed"
    });
    loadData();
    toast({ title: "Status geändert", description: "Der Zielstatus wurde aktualisiert." });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Dokumentationshilfe</h1>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                onClick={() => setHelpOpen(true)}
                data-testid="button-help"
              >
                <HelpCircle className="h-5 w-5" />
                <span>Hilfe</span>
              </Button>
              <Link href="/verwaltung">
                <Button variant="ghost" data-testid="button-settings">
                  <Settings className="h-5 w-5" />
                  <span>Verwaltung</span>
                </Button>
              </Link>
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Documenting Person */}
          <Card className="p-6">
            <label className="text-sm font-medium mb-2 block">
              Name der dokumentierenden Person
            </label>
            <Input
              placeholder="Vor- & Nachname"
              value={documentingPerson}
              onChange={(e) => handleDocumentingPersonChange(e.target.value)}
              data-testid="input-documenting-person"
            />
          </Card>

          {/* Person Selection */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Beschäftigte Person auswählen</h2>
            <PersonSelector
              persons={persons}
              selectedPersonId={selectedPersonId}
              onSelectPerson={setSelectedPersonId}
            />
          </Card>

          {/* Tabs */}
          {selectedPerson && (
            <>
              <TabNavigation tabs={tabs} activeTab={activeTab} onTabChange={setActiveTab} />

              {/* Tab Content */}
              {activeTab === "behavior" && (
                <>
                  <WorkBehaviorSelection
                    categories={workBehaviorCategories}
                    onSelectionsChange={handleWorkBehaviorSelectionsChange}
                  />
                  {selectedWorkBehavior && selectedPerson && (
                    <WorkBehaviorOutput
                      selections={selectedWorkBehavior}
                      personName={selectedPerson.name}
                      documentingPerson={documentingPerson}
                      categories={workBehaviorCategories}
                      onCopy={handleCopyText}
                    />
                  )}
                </>
              )}

              {activeTab === "activity" && (
                <>
                  <ActivitySelection
                    areas={activityAreas}
                    activities={activities}
                    onSelectActivity={handleSelectActivity}
                  />
                  {selectedActivity && selectedPerson && (
                    <ActivityOutput
                      activity={selectedActivity}
                      personName={selectedPerson.name}
                      documentingPerson={documentingPerson}
                      onCopy={handleCopyText}
                    />
                  )}
                </>
              )}

              {activeTab === "goals" && (
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <h2 className="text-lg font-semibold">Ziele für {selectedPerson.name}</h2>
                    <Button
                      onClick={() => {
                        setEditingGoal(null);
                        setShowGoalForm(true);
                      }}
                      data-testid="button-new-goal"
                    >
                      Neues Ziel
                    </Button>
                  </div>

                  {showGoalForm && (
                    <GoalForm
                      initialData={editingGoal ? {
                        title: editingGoal.title,
                        description: editingGoal.description,
                        measure: editingGoal.measure,
                        dueDate: editingGoal.dueDate || undefined,
                      } : undefined}
                      onSubmit={handleSubmitGoal}
                      onCancel={() => {
                        setShowGoalForm(false);
                        setEditingGoal(null);
                      }}
                    />
                  )}

                  {personGoals.length === 0 && !showGoalForm && (
                    <Card className="p-8 text-center">
                      <Target className="h-12 w-12 mx-auto mb-3 text-muted-foreground opacity-50" />
                      <p className="text-muted-foreground">
                        Noch keine Ziele vorhanden. Erstelle das erste Ziel!
                      </p>
                    </Card>
                  )}

                  {personGoals.map(goal => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      onEdit={handleEditGoal}
                      onDelete={handleDeleteGoal}
                      onToggleStatus={handleToggleGoalStatus}
                      onCopy={handleCopyText}
                    />
                  ))}
                </div>
              )}
            </>
          )}

          {!selectedPerson && (
            <Card className="p-12 text-center">
              <div className="max-w-md mx-auto">
                <ClipboardList className="h-16 w-16 mx-auto mb-4 text-muted-foreground opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Willkommen zur Dokumentationshilfe</h3>
                <p className="text-muted-foreground mb-4">
                  Wähle eine beschäftigte Person aus, um mit der Dokumentation zu beginnen.
                </p>
                {persons.length === 0 && (
                  <Link href="/verwaltung">
                    <Button data-testid="button-goto-management">
                      Zur Verwaltung
                    </Button>
                  </Link>
                )}
              </div>
            </Card>
          )}
        </div>
      </main>

      <HelpDialog open={helpOpen} onOpenChange={setHelpOpen} />
    </div>
  );
}
