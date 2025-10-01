import { useState, useEffect } from "react";
import { Link } from "wouter";
import { Plus, Edit2, Trash2, User, Briefcase, FileText, Download, Upload, ArrowLeft, ClipboardList, ArrowUp, ArrowDown } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { ThemeToggle } from "@/components/ThemeToggle";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import * as storage from "@/lib/storage";
import type { Person, ActivityArea, Activity, WorkBehaviorCategory } from "@shared/schema";

export default function Management() {
  const { toast } = useToast();
  const [persons, setPersons] = useState<Person[]>([]);
  const [activityAreas, setActivityAreas] = useState<ActivityArea[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [workBehaviorCategories, setWorkBehaviorCategories] = useState<WorkBehaviorCategory[]>([]);
  
  // Person Dialog
  const [personDialogOpen, setPersonDialogOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [personName, setPersonName] = useState("");
  
  // Activity Area Dialog
  const [areaDialogOpen, setAreaDialogOpen] = useState(false);
  const [editingArea, setEditingArea] = useState<ActivityArea | null>(null);
  const [areaName, setAreaName] = useState("");
  
  // Activity Dialog
  const [activityDialogOpen, setActivityDialogOpen] = useState(false);
  const [editingActivity, setEditingActivity] = useState<Activity | null>(null);
  const [activityForm, setActivityForm] = useState({
    areaId: "",
    title: "",
    description: "",
    measure: "",
  });
  
  // Work Behavior Category Dialog
  const [behaviorDialogOpen, setBehaviorDialogOpen] = useState(false);
  const [editingBehavior, setEditingBehavior] = useState<WorkBehaviorCategory | null>(null);
  const [behaviorForm, setBehaviorForm] = useState({
    category: "",
    positiveChoice: "",
    negativeChoice: "",
  });
  
  // Delete Dialog
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState<{ type: string; id: string; name: string } | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = () => {
    setPersons(storage.getPersons().sort((a, b) => parseInt(a.order) - parseInt(b.order)));
    setActivityAreas(storage.getActivityAreas().sort((a: any, b: any) => parseInt(a.order || '0') - parseInt(b.order || '0')));
    setActivities(storage.getActivities().sort((a: any, b: any) => parseInt(a.order || '0') - parseInt(b.order || '0')));
    setWorkBehaviorCategories(storage.getWorkBehaviorCategories().sort((a: any, b: any) => parseInt(a.order || '0') - parseInt(b.order || '0')));
  };

  // Person Management
  const handleSavePerson = () => {
    if (!personName.trim()) return;

    if (editingPerson) {
      storage.updatePerson(editingPerson.id, personName.trim());
      toast({ title: "Person aktualisiert", description: `${personName} wurde erfolgreich aktualisiert.` });
    } else {
      storage.addPerson(personName.trim());
      toast({ title: "Person hinzugefügt", description: `${personName} wurde erfolgreich hinzugefügt.` });
    }

    loadData();
    setPersonDialogOpen(false);
    setEditingPerson(null);
    setPersonName("");
  };

  const openPersonDialog = (person?: Person) => {
    if (person) {
      setEditingPerson(person);
      setPersonName(person.name);
    } else {
      setEditingPerson(null);
      setPersonName("");
    }
    setPersonDialogOpen(true);
  };

  // Activity Area Management
  const handleSaveArea = () => {
    if (!areaName.trim()) return;

    if (editingArea) {
      storage.updateActivityArea(editingArea.id, areaName.trim());
      toast({ title: "Bereich aktualisiert", description: `${areaName} wurde erfolgreich aktualisiert.` });
    } else {
      storage.addActivityArea(areaName.trim());
      toast({ title: "Bereich hinzugefügt", description: `${areaName} wurde erfolgreich hinzugefügt.` });
    }

    loadData();
    setAreaDialogOpen(false);
    setEditingArea(null);
    setAreaName("");
  };

  const openAreaDialog = (area?: ActivityArea) => {
    if (area) {
      setEditingArea(area);
      setAreaName(area.name);
    } else {
      setEditingArea(null);
      setAreaName("");
    }
    setAreaDialogOpen(true);
  };

  // Activity Management
  const handleSaveActivity = () => {
    if (!activityForm.areaId || !activityForm.title.trim() || !activityForm.description.trim()) return;

    if (editingActivity) {
      storage.updateActivity(editingActivity.id, activityForm);
      toast({ title: "Tätigkeit aktualisiert", description: "Die Tätigkeit wurde erfolgreich aktualisiert." });
    } else {
      storage.addActivity(activityForm);
      toast({ title: "Tätigkeit hinzugefügt", description: "Die Tätigkeit wurde erfolgreich hinzugefügt." });
    }

    loadData();
    setActivityDialogOpen(false);
    setEditingActivity(null);
    setActivityForm({ areaId: "", title: "", description: "", measure: "" });
  };

  const openActivityDialog = (activity?: Activity) => {
    if (activity) {
      setEditingActivity(activity);
      setActivityForm({
        areaId: activity.areaId,
        title: activity.title,
        description: activity.description,
        measure: activity.measure,
      });
    } else {
      setEditingActivity(null);
      setActivityForm({ 
        areaId: activityAreas[0]?.id || "", 
        title: "", 
        description: "", 
        measure: "" 
      });
    }
    setActivityDialogOpen(true);
  };

  // Work Behavior Category Management
  const handleSaveBehavior = () => {
    if (!behaviorForm.category.trim() || !behaviorForm.positiveChoice.trim() || !behaviorForm.negativeChoice.trim()) return;

    if (editingBehavior) {
      storage.updateWorkBehaviorCategory(
        editingBehavior.id,
        behaviorForm.category.trim(),
        behaviorForm.positiveChoice.trim(),
        behaviorForm.negativeChoice.trim()
      );
      toast({ title: "Kategorie aktualisiert", description: "Die Arbeitsverhalten-Kategorie wurde erfolgreich aktualisiert." });
    } else {
      storage.addWorkBehaviorCategory(
        behaviorForm.category.trim(),
        behaviorForm.positiveChoice.trim(),
        behaviorForm.negativeChoice.trim()
      );
      toast({ title: "Kategorie hinzugefügt", description: "Die Arbeitsverhalten-Kategorie wurde erfolgreich hinzugefügt." });
    }

    loadData();
    setBehaviorDialogOpen(false);
    setEditingBehavior(null);
    setBehaviorForm({ category: "", positiveChoice: "", negativeChoice: "" });
  };

  const openBehaviorDialog = (behavior?: WorkBehaviorCategory) => {
    if (behavior) {
      setEditingBehavior(behavior);
      setBehaviorForm({
        category: behavior.category,
        positiveChoice: behavior.choices[0] || "",
        negativeChoice: behavior.choices[1] || "",
      });
    } else {
      setEditingBehavior(null);
      setBehaviorForm({ category: "", positiveChoice: "", negativeChoice: "" });
    }
    setBehaviorDialogOpen(true);
  };

  // Delete Management
  const openDeleteDialog = (type: string, id: string, name: string) => {
    setDeleteTarget({ type, id, name });
    setDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deleteTarget) return;

    const { type, id, name } = deleteTarget;
    
    if (type === "person") {
      storage.deletePerson(id);
      toast({ title: "Person gelöscht", description: `${name} wurde gelöscht.` });
    } else if (type === "area") {
      storage.deleteActivityArea(id);
      toast({ title: "Bereich gelöscht", description: `${name} wurde gelöscht.` });
    } else if (type === "activity") {
      storage.deleteActivity(id);
      toast({ title: "Tätigkeit gelöscht", description: "Die Tätigkeit wurde gelöscht." });
    } else if (type === "behavior") {
      storage.deleteWorkBehaviorCategory(id);
      toast({ title: "Kategorie gelöscht", description: `${name} wurde gelöscht.` });
    }

    loadData();
    setDeleteDialogOpen(false);
    setDeleteTarget(null);
  };

  // Export / Import
  const handleExport = () => {
    const data = storage.exportAllData();
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `dokumentationshilfe-export-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    toast({ title: "Export erfolgreich", description: "Alle Daten wurden exportiert." });
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        storage.importAllData(data);
        loadData();
        toast({ title: "Import erfolgreich", description: "Alle Daten wurden importiert." });
      } catch (error) {
        toast({ 
          title: "Import fehlgeschlagen", 
          description: "Die Datei konnte nicht gelesen werden.",
          variant: "destructive" 
        });
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  };

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b bg-card">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="ghost" size="icon" data-testid="button-back-to-home">
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </Link>
              <h1 className="text-2xl font-bold">Verwaltung</h1>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="space-y-6">
          {/* Export / Import */}
          <Card>
            <CardHeader>
              <CardTitle>Daten Export & Import</CardTitle>
              <CardDescription>
                Exportiere alle Daten als JSON-Datei oder importiere zuvor exportierte Daten
              </CardDescription>
            </CardHeader>
            <CardContent className="flex gap-2">
              <Button onClick={handleExport} data-testid="button-export">
                <Download className="h-4 w-4 mr-2" />
                Daten exportieren
              </Button>
              <div>
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImport}
                  className="hidden"
                  id="import-file"
                  data-testid="input-import"
                />
                <Button asChild variant="outline" data-testid="button-import">
                  <label htmlFor="import-file" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Daten importieren
                  </label>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Management Tabs */}
          <Tabs defaultValue="persons" className="space-y-4">
            <TabsList>
              <TabsTrigger value="persons" data-testid="tab-persons">
                <User className="h-4 w-4 mr-2" />
                Personen
              </TabsTrigger>
              <TabsTrigger value="behavior" data-testid="tab-behavior">
                <ClipboardList className="h-4 w-4 mr-2" />
                Arbeitsverhalten
              </TabsTrigger>
              <TabsTrigger value="activities" data-testid="tab-activities">
                <FileText className="h-4 w-4 mr-2" />
                Tätigkeiten
              </TabsTrigger>
            </TabsList>

            {/* Persons */}
            <TabsContent value="persons">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Personen verwalten</CardTitle>
                      <CardDescription>
                        Füge neue Personen hinzu, bearbeite oder lösche bestehende
                      </CardDescription>
                    </div>
                    <Button onClick={() => openPersonDialog()} data-testid="button-add-person">
                      <Plus className="h-4 w-4 mr-2" />
                      Person hinzufügen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {persons.map((person, index) => (
                        <div
                          key={person.id}
                          className="flex items-center justify-between p-3 rounded-md border hover-elevate"
                          data-testid={`person-item-${person.id}`}
                        >
                          <span className="font-medium">{person.name}</span>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                storage.movePersonUp(person.id);
                                loadData();
                              }}
                              disabled={index === 0}
                              data-testid={`button-move-up-person-${person.id}`}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                storage.movePersonDown(person.id);
                                loadData();
                              }}
                              disabled={index === persons.length - 1}
                              data-testid={`button-move-down-person-${person.id}`}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openPersonDialog(person)}
                              data-testid={`button-edit-person-${person.id}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openDeleteDialog("person", person.id, person.name)}
                              data-testid={`button-delete-person-${person.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {persons.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <User className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Noch keine Personen vorhanden</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Work Behavior Categories */}
            <TabsContent value="behavior">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Arbeitsverhalten-Kategorien verwalten</CardTitle>
                      <CardDescription>
                        Verwalte die Kategorien für die Arbeitsverhalten-Dokumentation
                      </CardDescription>
                    </div>
                    <Button onClick={() => openBehaviorDialog()} data-testid="button-add-behavior">
                      <Plus className="h-4 w-4 mr-2" />
                      Kategorie hinzufügen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    <div className="space-y-2">
                      {workBehaviorCategories.map((behavior, index) => (
                        <div
                          key={behavior.id}
                          className="flex items-center justify-between p-4 rounded-md border hover-elevate"
                          data-testid={`behavior-item-${behavior.id}`}
                        >
                          <div className="flex-1">
                            <div className="font-medium mb-2">{behavior.category}</div>
                            <div className="text-sm text-muted-foreground space-y-1">
                              <div className="flex items-start gap-2">
                                <span className="text-green-600 dark:text-green-400 font-medium">+</span>
                                <span>{behavior.choices[0]}</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-red-600 dark:text-red-400 font-medium">−</span>
                                <span>{behavior.choices[1]}</span>
                              </div>
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                storage.moveWorkBehaviorCategoryUp(behavior.id);
                                loadData();
                              }}
                              disabled={index === 0}
                              data-testid={`button-move-up-behavior-${behavior.id}`}
                            >
                              <ArrowUp className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => {
                                storage.moveWorkBehaviorCategoryDown(behavior.id);
                                loadData();
                              }}
                              disabled={index === workBehaviorCategories.length - 1}
                              data-testid={`button-move-down-behavior-${behavior.id}`}
                            >
                              <ArrowDown className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openBehaviorDialog(behavior)}
                              data-testid={`button-edit-behavior-${behavior.id}`}
                            >
                              <Edit2 className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => openDeleteDialog("behavior", behavior.id, behavior.category)}
                              data-testid={`button-delete-behavior-${behavior.id}`}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      ))}
                      {workBehaviorCategories.length === 0 && (
                        <div className="text-center py-12 text-muted-foreground">
                          <ClipboardList className="h-12 w-12 mx-auto mb-3 opacity-50" />
                          <p>Noch keine Kategorien vorhanden</p>
                        </div>
                      )}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Activities with Accordion */}
            <TabsContent value="activities">
              <Card>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <div>
                      <CardTitle>Tätigkeiten verwalten</CardTitle>
                      <CardDescription>
                        Verwalte Tätigkeitsbereiche und deren Tätigkeiten
                      </CardDescription>
                    </div>
                    <Button onClick={() => openAreaDialog()} data-testid="button-add-area">
                      <Plus className="h-4 w-4 mr-2" />
                      Bereich hinzufügen
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-[500px]">
                    {activityAreas.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Briefcase className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Noch keine Tätigkeitsbereiche vorhanden</p>
                        <p className="text-sm mt-2">
                          Erstelle zuerst einen Tätigkeitsbereich
                        </p>
                      </div>
                    ) : (
                      <Accordion type="multiple" className="w-full">
                        {activityAreas.map((area, areaIndex) => {
                          const areaActivities = activities.filter(a => a.areaId === area.id);
                          return (
                            <AccordionItem key={area.id} value={area.id} data-testid={`area-item-${area.id}`}>
                              <div className="flex items-center gap-2 border rounded-md p-2 hover-elevate">
                                <AccordionTrigger className="hover:no-underline flex-1 py-0">
                                  <div className="flex items-center gap-3">
                                    <Briefcase className="h-4 w-4" />
                                    <span className="font-medium">{area.name}</span>
                                    <span className="text-sm text-muted-foreground">
                                      ({areaActivities.length} {areaActivities.length === 1 ? 'Tätigkeit' : 'Tätigkeiten'})
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <div className="flex gap-2 ml-auto" onClick={(e) => e.stopPropagation()}>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      storage.moveActivityAreaUp(area.id);
                                      loadData();
                                    }}
                                    disabled={areaIndex === 0}
                                    data-testid={`button-move-up-area-${area.id}`}
                                  >
                                    <ArrowUp className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => {
                                      storage.moveActivityAreaDown(area.id);
                                      loadData();
                                    }}
                                    disabled={areaIndex === activityAreas.length - 1}
                                    data-testid={`button-move-down-area-${area.id}`}
                                  >
                                    <ArrowDown className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openAreaDialog(area)}
                                    data-testid={`button-edit-area-${area.id}`}
                                  >
                                    <Edit2 className="h-4 w-4" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => openDeleteDialog("area", area.id, area.name)}
                                    data-testid={`button-delete-area-${area.id}`}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                              <AccordionContent>
                                <div className="space-y-2 pt-2">
                                  <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={() => {
                                      setActivityForm({ ...activityForm, areaId: area.id });
                                      openActivityDialog();
                                    }}
                                    data-testid={`button-add-activity-${area.id}`}
                                    className="mb-2"
                                  >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Tätigkeit hinzufügen
                                  </Button>
                                  {areaActivities.length === 0 ? (
                                    <div className="text-center py-6 text-muted-foreground">
                                      <FileText className="h-8 w-8 mx-auto mb-2 opacity-50" />
                                      <p className="text-sm">Noch keine Tätigkeiten in diesem Bereich</p>
                                    </div>
                                  ) : (
                                    <div className="space-y-2">
                                      {areaActivities.map((activity, activityIndex) => (
                                        <div
                                          key={activity.id}
                                          className="p-3 rounded-md border hover-elevate"
                                          data-testid={`activity-item-${activity.id}`}
                                        >
                                          <div className="flex items-start justify-between mb-2">
                                            <div className="flex-1">
                                              <h4 className="font-medium">{activity.title}</h4>
                                            </div>
                                            <div className="flex gap-2">
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                  storage.moveActivityUp(activity.id);
                                                  loadData();
                                                }}
                                                disabled={activityIndex === 0}
                                                data-testid={`button-move-up-activity-${activity.id}`}
                                              >
                                                <ArrowUp className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => {
                                                  storage.moveActivityDown(activity.id);
                                                  loadData();
                                                }}
                                                disabled={activityIndex === areaActivities.length - 1}
                                                data-testid={`button-move-down-activity-${activity.id}`}
                                              >
                                                <ArrowDown className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openActivityDialog(activity)}
                                                data-testid={`button-edit-activity-${activity.id}`}
                                              >
                                                <Edit2 className="h-4 w-4" />
                                              </Button>
                                              <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={() => openDeleteDialog("activity", activity.id, activity.title)}
                                                data-testid={`button-delete-activity-${activity.id}`}
                                              >
                                                <Trash2 className="h-4 w-4" />
                                              </Button>
                                            </div>
                                          </div>
                                          <p className="text-sm text-muted-foreground">{activity.description}</p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              </AccordionContent>
                            </AccordionItem>
                          );
                        })}
                      </Accordion>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      {/* Person Dialog */}
      <Dialog open={personDialogOpen} onOpenChange={setPersonDialogOpen}>
        <DialogContent data-testid="dialog-person">
          <DialogHeader>
            <DialogTitle>
              {editingPerson ? "Person bearbeiten" : "Person hinzufügen"}
            </DialogTitle>
            <DialogDescription>
              {editingPerson ? "Ändere den Namen der Person" : "Gib den Namen der neuen Person ein"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="person-name">Name</Label>
              <Input
                id="person-name"
                value={personName}
                onChange={(e) => setPersonName(e.target.value)}
                placeholder="Vor- & Nachname"
                onKeyDown={(e) => e.key === "Enter" && handleSavePerson()}
                data-testid="input-person-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setPersonDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSavePerson} data-testid="button-save-person">
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Work Behavior Category Dialog */}
      <Dialog open={behaviorDialogOpen} onOpenChange={setBehaviorDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-behavior">
          <DialogHeader>
            <DialogTitle>
              {editingBehavior ? "Kategorie bearbeiten" : "Kategorie hinzufügen"}
            </DialogTitle>
            <DialogDescription>
              Gib den Kategorienamen sowie die positive und negative Option ein
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="behavior-category">Kategorie</Label>
              <Input
                id="behavior-category"
                value={behaviorForm.category}
                onChange={(e) => setBehaviorForm({ ...behaviorForm, category: e.target.value })}
                placeholder="z.B. 🧠 1. Konzentration"
                data-testid="input-behavior-category"
              />
            </div>
            <div>
              <Label htmlFor="behavior-positive">Positive Option (+)</Label>
              <Input
                id="behavior-positive"
                value={behaviorForm.positiveChoice}
                onChange={(e) => setBehaviorForm({ ...behaviorForm, positiveChoice: e.target.value })}
                placeholder="z.B. zeigt gute Konzentrationsfähigkeit."
                data-testid="input-behavior-positive"
              />
            </div>
            <div>
              <Label htmlFor="behavior-negative">Negative Option (−)</Label>
              <Input
                id="behavior-negative"
                value={behaviorForm.negativeChoice}
                onChange={(e) => setBehaviorForm({ ...behaviorForm, negativeChoice: e.target.value })}
                placeholder="z.B. zeigt eingeschränkte Konzentrationsfähigkeit."
                data-testid="input-behavior-negative"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setBehaviorDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveBehavior} data-testid="button-save-behavior">
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Area Dialog */}
      <Dialog open={areaDialogOpen} onOpenChange={setAreaDialogOpen}>
        <DialogContent data-testid="dialog-area">
          <DialogHeader>
            <DialogTitle>
              {editingArea ? "Bereich bearbeiten" : "Bereich hinzufügen"}
            </DialogTitle>
            <DialogDescription>
              {editingArea ? "Ändere den Namen des Bereichs" : "Gib den Namen des neuen Bereichs ein"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="area-name">Name</Label>
              <Input
                id="area-name"
                value={areaName}
                onChange={(e) => setAreaName(e.target.value)}
                placeholder="Bereichsname"
                onKeyDown={(e) => e.key === "Enter" && handleSaveArea()}
                data-testid="input-area-name"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setAreaDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveArea} data-testid="button-save-area">
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Activity Dialog */}
      <Dialog open={activityDialogOpen} onOpenChange={setActivityDialogOpen}>
        <DialogContent className="max-w-2xl" data-testid="dialog-activity">
          <DialogHeader>
            <DialogTitle>
              {editingActivity ? "Tätigkeit bearbeiten" : "Tätigkeit hinzufügen"}
            </DialogTitle>
            <DialogDescription>
              Erfasse die Details der Tätigkeit
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <Label htmlFor="activity-area">Bereich</Label>
              <select
                id="activity-area"
                value={activityForm.areaId}
                onChange={(e) => setActivityForm({ ...activityForm, areaId: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                data-testid="select-activity-area"
              >
                <option value="">Bereich wählen</option>
                {activityAreas.map((area) => (
                  <option key={area.id} value={area.id}>
                    {area.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <Label htmlFor="activity-title">Titel</Label>
              <Input
                id="activity-title"
                value={activityForm.title}
                onChange={(e) => setActivityForm({ ...activityForm, title: e.target.value })}
                placeholder="Titel der Tätigkeit"
                data-testid="input-activity-title"
              />
            </div>
            <div>
              <Label htmlFor="activity-description">Beschreibung</Label>
              <Textarea
                id="activity-description"
                value={activityForm.description}
                onChange={(e) => setActivityForm({ ...activityForm, description: e.target.value })}
                placeholder="Beschreibung der Tätigkeit"
                rows={4}
                data-testid="textarea-activity-description"
              />
            </div>
            <div>
              <Label htmlFor="activity-measure">Maßnahme</Label>
              <Textarea
                id="activity-measure"
                value={activityForm.measure}
                onChange={(e) => setActivityForm({ ...activityForm, measure: e.target.value })}
                placeholder="Maßnahme oder Unterstützung"
                rows={3}
                data-testid="textarea-activity-measure"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setActivityDialogOpen(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSaveActivity} data-testid="button-save-activity">
              Speichern
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent data-testid="dialog-delete">
          <AlertDialogHeader>
            <AlertDialogTitle>Wirklich löschen?</AlertDialogTitle>
            <AlertDialogDescription>
              Möchtest du "{deleteTarget?.name}" wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Abbrechen</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} data-testid="button-confirm-delete">
              Löschen
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
