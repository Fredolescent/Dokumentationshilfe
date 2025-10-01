import { type Person, type WorkBehaviorCategory, type ActivityArea, type Activity, type Goal, type InsertActivity, type InsertPerson, type InsertActivityArea } from "@shared/schema";

const STORAGE_KEYS = {
  PERSONS: "dokumentationshilfe_persons",
  WORK_BEHAVIOR: "dokumentationshilfe_work_behavior",
  ACTIVITY_AREAS: "dokumentationshilfe_activity_areas",
  ACTIVITIES: "dokumentationshilfe_activities",
  GOALS: "dokumentationshilfe_goals",
  DOCUMENTING_PERSON: "dokumentationshilfe_documenting_person",
} as const;

export interface AppData {
  persons: Person[];
  workBehaviorCategories: WorkBehaviorCategory[];
  activityAreas: ActivityArea[];
  activities: Activity[];
  goals: Goal[];
}

// Legacy format interface (old app structure)
interface LegacyAppData {
  nameList?: string[];
  taetigkeiten?: { [bereichsname: string]: string[] };
  ziele?: Array<{ text: string; datum: string }>;
}

function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

// Initialize with default data if localStorage is empty (for non-behavior data)
function initializeDefaultData() {
  const defaultActivityAreas: ActivityArea[] = [
    { id: "1", name: "Montage", order: "0" },
    { id: "2", name: "Verpackung", order: "1" },
  ];

  const defaultActivities: Activity[] = [
    {
      id: "1",
      areaId: "1",
      title: "Materialvorbereitung",
      description: "Vorbereitung der Materialien für den Montageprozess",
      measure: "GL stellt erforderliches Material bereit und überprüft Vollständigkeit",
      order: "0",
    },
  ];

  // Note: Work behavior categories are initialized in getWorkBehaviorCategories()
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITY_AREAS)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_AREAS, JSON.stringify(defaultActivityAreas));
  }
  if (!localStorage.getItem(STORAGE_KEYS.ACTIVITIES)) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(defaultActivities));
  }
  if (!localStorage.getItem(STORAGE_KEYS.PERSONS)) {
    localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify([]));
  }
  if (!localStorage.getItem(STORAGE_KEYS.GOALS)) {
    localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify([]));
  }
}

// Initialize on module load
initializeDefaultData();

// Persons
export function getPersons(): Person[] {
  const data = localStorage.getItem(STORAGE_KEYS.PERSONS);
  if (!data) return [];
  
  const persons = JSON.parse(data) as Person[];
  
  // Migration: Add order field if missing
  let needsMigration = false;
  const migrated = persons.map((person, index) => {
    if (!(person as any).order) {
      needsMigration = true;
      return { ...person, order: String(index) };
    }
    return person;
  });
  
  // Save migrated data back to localStorage
  if (needsMigration) {
    localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(migrated));
  }
  
  return migrated;
}

export function addPerson(name: string): Person {
  const persons = getPersons();
  const newPerson: Person = { id: generateId(), name, order: String(persons.length) };
  persons.push(newPerson);
  localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(persons));
  return newPerson;
}

export function updatePerson(id: string, name: string): Person | null {
  const persons = getPersons();
  const index = persons.findIndex(p => p.id === id);
  if (index === -1) return null;
  persons[index].name = name;
  localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(persons));
  return persons[index];
}

export function deletePerson(id: string): boolean {
  const persons = getPersons();
  const filtered = persons.filter(p => p.id !== id);
  if (filtered.length === persons.length) return false;
  localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(filtered));
  
  // Also delete associated goals
  const goals = getGoals();
  const filteredGoals = goals.filter(g => g.personId !== id);
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filteredGoals));
  
  return true;
}

export function movePersonUp(id: string): boolean {
  const persons = getPersons();
  const sorted = persons.sort((a, b) => parseInt(a.order) - parseInt(b.order));
  const index = sorted.findIndex(p => p.id === id);
  
  if (index <= 0) return false; // Already at top or not found
  
  // Swap order values
  const temp = sorted[index].order;
  sorted[index].order = sorted[index - 1].order;
  sorted[index - 1].order = temp;
  
  localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(sorted));
  return true;
}

export function movePersonDown(id: string): boolean {
  const persons = getPersons();
  const sorted = persons.sort((a, b) => parseInt(a.order) - parseInt(b.order));
  const index = sorted.findIndex(p => p.id === id);
  
  if (index === -1 || index >= sorted.length - 1) return false; // Not found or already at bottom
  
  // Swap order values
  const temp = sorted[index].order;
  sorted[index].order = sorted[index + 1].order;
  sorted[index + 1].order = temp;
  
  localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(sorted));
  return true;
}

// Work Behavior Categories
export function getWorkBehaviorCategories(): WorkBehaviorCategory[] {
  const data = localStorage.getItem(STORAGE_KEYS.WORK_BEHAVIOR);
  let categories: WorkBehaviorCategory[] = data ? JSON.parse(data) : [];
  
  // Initialize with 18 default categories if localStorage is empty OR has legacy format
  // Legacy format: exactly 8 categories with 4 choices each (old system before editable categories)
  const isLegacyFormat = categories.length === 8 && 
                         categories.every(cat => cat.choices && cat.choices.length === 4);
  
  // Also reset if any category has invalid structure (not exactly 2 choices)
  const hasInvalidStructure = categories.some(cat => !cat.choices || cat.choices.length !== 2);
  
  const needsReset = !data || categories.length === 0 || isLegacyFormat || hasInvalidStructure;
  
  if (needsReset) {
    categories = getDefaultWorkBehaviorCategories();
    localStorage.setItem(STORAGE_KEYS.WORK_BEHAVIOR, JSON.stringify(categories));
  }
  
  // Migration: Add order field if missing
  let needsMigration = false;
  const migrated = categories.map((category, index) => {
    if (!(category as any).order) {
      needsMigration = true;
      return { ...category, order: String(index) } as any;
    }
    return category;
  });
  
  // Save migrated data back to localStorage
  if (needsMigration) {
    localStorage.setItem(STORAGE_KEYS.WORK_BEHAVIOR, JSON.stringify(migrated));
  }
  
  return migrated;
}

function getDefaultWorkBehaviorCategories(): WorkBehaviorCategory[] {
  return [
    { 
      id: "1", 
      category: "🧠 1. Konzentration", 
      choices: [
        "zeigt eine gute Konzentrationsfähigkeit.",
        "zeigt eine eingeschränkte Konzentrationsfähigkeit."
      ],
      order: "0"
    },
    { 
      id: "2", 
      category: "🔥 2. Motivation", 
      choices: [
        "arbeitet mit einer guten Motivation.",
        "zeigt eine geringe Motivation."
      ],
      order: "1"
    },
    { 
      id: "3", 
      category: "✓ 3. Sorgfalt", 
      choices: [
        "arbeitet sorgfältig und genau.",
        "arbeitet ungenau und wenig sorgfältig."
      ],
      order: "2"
    },
    { 
      id: "4", 
      category: "😊 4. Gemütslage", 
      choices: [
        "wirkt im Arbeitsalltag ausgeglichen und stabil.",
        "wirkt im Arbeitsalltag unausgeglichen oder labil."
      ],
      order: "3"
    },
    { 
      id: "5", 
      category: "👥 5. Teamfähigkeit", 
      choices: [
        "arbeitet gut und kooperativ im Team.",
        "zeigt Schwierigkeiten in der Zusammenarbeit im Team."
      ],
      order: "4"
    },
    { 
      id: "6", 
      category: "💬 6. Umgang mit Kritik", 
      choices: [
        "nimmt Kritik offen an und setzt Rückmeldungen um.",
        "zeigt Schwierigkeiten im Umgang mit Kritik."
      ],
      order: "5"
    },
    { 
      id: "7", 
      category: "⏰ 7. Pünktlichkeit", 
      choices: [
        "kommt pünktlich zur Arbeit.",
        "kommt verspätet zur Arbeit."
      ],
      order: "6"
    },
    { 
      id: "8", 
      category: "🏋️ 8. Durchhaltevermögen / Belastbarkeit", 
      choices: [
        "zeigt ein gutes Durchhaltevermögen und bleibt auch bei Belastung handlungsfähig.",
        "zeigt ein geringes Durchhaltevermögen und wirkt bei Belastung schnell überfordert."
      ],
      order: "7"
    },
    { 
      id: "9", 
      category: "😓 9. Frustrationstoleranz", 
      choices: [
        "geht mit Rückschlägen und Misserfolgen gelassen um.",
        "zeigt eine geringe Frustrationstoleranz und reagiert schnell entmutigt."
      ],
      order: "8"
    },
    { 
      id: "10", 
      category: "⚡ 10. Arbeitsgeschwindigkeit", 
      choices: [
        "arbeitet in einem angemessenen Tempo.",
        "arbeitet zu langsam / zu hastig."
      ],
      order: "9"
    },
    { 
      id: "11", 
      category: "✅ 11. Zuverlässigkeit", 
      choices: [
        "erledigt Aufgaben zuverlässig und gewissenhaft.",
        "erledigt Aufgaben unzuverlässig oder unvollständig."
      ],
      order: "10"
    },
    { 
      id: "12", 
      category: "📏 12. Einhaltung von Regeln und Anweisungen", 
      choices: [
        "hält sich an Regeln und befolgt Anweisungen.",
        "hat Schwierigkeiten, Regeln einzuhalten oder Anweisungen umzusetzen."
      ],
      order: "11"
    },
    { 
      id: "13", 
      category: "👋 13. Respektvoller Umgang", 
      choices: [
        "begegnet anderen freundlich und respektvoll.",
        "zeigt wenig Respekt im Umgang mit anderen."
      ],
      order: "12"
    },
    { 
      id: "14", 
      category: "🔄 14. Flexibilität / Anpassungsfähigkeit", 
      choices: [
        "passt sich flexibel an Veränderungen im Arbeitsablauf an.",
        "zeigt Schwierigkeiten bei der Anpassung an veränderte Arbeitsabläufe."
      ],
      order: "13"
    },
    { 
      id: "15", 
      category: "🚀 15. Eigeninitiative", 
      choices: [
        "erkennt und übernimmt Aufgaben eigenständig.",
        "benötigt häufig eine Aufforderung zur Übernahme von Aufgaben."
      ],
      order: "14"
    },
    { 
      id: "16", 
      category: "📚 16. Lernbereitschaft", 
      choices: [
        "zeigt Interesse und Bereitschaft, neue Fertigkeiten zu erlernen.",
        "zeigt wenig Interesse an der Erweiterung ihrer/seiner Fähigkeiten."
      ],
      order: "15"
    },
    { 
      id: "17", 
      category: "🧩 17. Problemlösungsfähigkeit", 
      choices: [
        "erkennt Probleme und findet eigenständig Lösungsansätze.",
        "zeigt Schwierigkeiten beim Erkennen und Lösen von Problemen."
      ],
      order: "16"
    },
    { 
      id: "18", 
      category: "🗣 18. Kommunikation", 
      choices: [
        "kommuniziert offen und klar.",
        "zeigt Unsicherheiten oder Zurückhaltung in der Kommunikation."
      ],
      order: "17"
    },
  ];
}

export function updateWorkBehaviorCategories(categories: WorkBehaviorCategory[]): void {
  localStorage.setItem(STORAGE_KEYS.WORK_BEHAVIOR, JSON.stringify(categories));
}

export function addWorkBehaviorCategory(category: string, positiveChoice: string, negativeChoice: string): WorkBehaviorCategory {
  const categories = getWorkBehaviorCategories();
  const newCategory: WorkBehaviorCategory = {
    id: generateId(),
    category,
    choices: [positiveChoice, negativeChoice],
    order: String(categories.length)
  } as any;
  categories.push(newCategory);
  localStorage.setItem(STORAGE_KEYS.WORK_BEHAVIOR, JSON.stringify(categories));
  return newCategory;
}

export function updateWorkBehaviorCategory(id: string, category: string, positiveChoice: string, negativeChoice: string): WorkBehaviorCategory | null {
  const categories = getWorkBehaviorCategories();
  const index = categories.findIndex(c => c.id === id);
  if (index === -1) return null;
  categories[index] = {
    ...categories[index],
    category,
    choices: [positiveChoice, negativeChoice]
  };
  localStorage.setItem(STORAGE_KEYS.WORK_BEHAVIOR, JSON.stringify(categories));
  return categories[index];
}

export function deleteWorkBehaviorCategory(id: string): boolean {
  const categories = getWorkBehaviorCategories();
  const filtered = categories.filter(c => c.id !== id);
  if (filtered.length === categories.length) return false;
  localStorage.setItem(STORAGE_KEYS.WORK_BEHAVIOR, JSON.stringify(filtered));
  return true;
}

export function moveWorkBehaviorCategoryUp(id: string): boolean {
  const categories = getWorkBehaviorCategories();
  const sorted = categories.sort((a: any, b: any) => parseInt(a.order || '0') - parseInt(b.order || '0'));
  const index = sorted.findIndex(c => c.id === id);
  
  if (index <= 0) return false;
  
  const temp = (sorted[index] as any).order;
  (sorted[index] as any).order = (sorted[index - 1] as any).order;
  (sorted[index - 1] as any).order = temp;
  
  localStorage.setItem(STORAGE_KEYS.WORK_BEHAVIOR, JSON.stringify(sorted));
  return true;
}

export function moveWorkBehaviorCategoryDown(id: string): boolean {
  const categories = getWorkBehaviorCategories();
  const sorted = categories.sort((a: any, b: any) => parseInt(a.order || '0') - parseInt(b.order || '0'));
  const index = sorted.findIndex(c => c.id === id);
  
  if (index === -1 || index >= sorted.length - 1) return false;
  
  const temp = (sorted[index] as any).order;
  (sorted[index] as any).order = (sorted[index + 1] as any).order;
  (sorted[index + 1] as any).order = temp;
  
  localStorage.setItem(STORAGE_KEYS.WORK_BEHAVIOR, JSON.stringify(sorted));
  return true;
}

// Activity Areas
export function getActivityAreas(): ActivityArea[] {
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVITY_AREAS);
  if (!data) return [];
  
  const areas = JSON.parse(data) as ActivityArea[];
  
  // Migration: Add order field if missing
  let needsMigration = false;
  const migrated = areas.map((area, index) => {
    if (!(area as any).order) {
      needsMigration = true;
      return { ...area, order: String(index) } as any;
    }
    return area;
  });
  
  // Save migrated data back to localStorage
  if (needsMigration) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITY_AREAS, JSON.stringify(migrated));
  }
  
  return migrated;
}

export function addActivityArea(name: string): ActivityArea {
  const areas = getActivityAreas();
  const newArea: ActivityArea = { id: generateId(), name, order: String(areas.length) } as any;
  areas.push(newArea);
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_AREAS, JSON.stringify(areas));
  return newArea;
}

export function updateActivityArea(id: string, name: string): ActivityArea | null {
  const areas = getActivityAreas();
  const index = areas.findIndex(a => a.id === id);
  if (index === -1) return null;
  areas[index].name = name;
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_AREAS, JSON.stringify(areas));
  return areas[index];
}

export function deleteActivityArea(id: string): boolean {
  const areas = getActivityAreas();
  const filtered = areas.filter(a => a.id !== id);
  if (filtered.length === areas.length) return false;
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_AREAS, JSON.stringify(filtered));
  
  // Also delete associated activities
  const activities = getActivities();
  const filteredActivities = activities.filter(a => a.areaId !== id);
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(filteredActivities));
  
  return true;
}

export function moveActivityAreaUp(id: string): boolean {
  const areas = getActivityAreas();
  const sorted = areas.sort((a: any, b: any) => parseInt(a.order || '0') - parseInt(b.order || '0'));
  const index = sorted.findIndex(a => a.id === id);
  
  if (index <= 0) return false;
  
  const temp = (sorted[index] as any).order;
  (sorted[index] as any).order = (sorted[index - 1] as any).order;
  (sorted[index - 1] as any).order = temp;
  
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_AREAS, JSON.stringify(sorted));
  return true;
}

export function moveActivityAreaDown(id: string): boolean {
  const areas = getActivityAreas();
  const sorted = areas.sort((a: any, b: any) => parseInt(a.order || '0') - parseInt(b.order || '0'));
  const index = sorted.findIndex(a => a.id === id);
  
  if (index === -1 || index >= sorted.length - 1) return false;
  
  const temp = (sorted[index] as any).order;
  (sorted[index] as any).order = (sorted[index + 1] as any).order;
  (sorted[index + 1] as any).order = temp;
  
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_AREAS, JSON.stringify(sorted));
  return true;
}

// Activities
export function getActivities(): Activity[] {
  const data = localStorage.getItem(STORAGE_KEYS.ACTIVITIES);
  if (!data) return [];
  
  const activities = JSON.parse(data) as Activity[];
  
  // Migration: Add order field if missing
  let needsMigration = false;
  const migrated = activities.map((activity, index) => {
    if (!(activity as any).order) {
      needsMigration = true;
      return { ...activity, order: String(index) } as any;
    }
    return activity;
  });
  
  // Save migrated data back to localStorage
  if (needsMigration) {
    localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(migrated));
  }
  
  return migrated;
}

export function addActivity(activity: InsertActivity): Activity {
  const activities = getActivities();
  const newActivity: Activity = { ...activity, id: generateId(), order: String(activities.length) } as any;
  activities.push(newActivity);
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  return newActivity;
}

export function updateActivity(id: string, updates: Partial<Omit<Activity, "id">>): Activity | null {
  const activities = getActivities();
  const index = activities.findIndex(a => a.id === id);
  if (index === -1) return null;
  activities[index] = { ...activities[index], ...updates };
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(activities));
  return activities[index];
}

export function deleteActivity(id: string): boolean {
  const activities = getActivities();
  const filtered = activities.filter(a => a.id !== id);
  if (filtered.length === activities.length) return false;
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(filtered));
  return true;
}

export function moveActivityUp(id: string): boolean {
  const activities = getActivities();
  const activity = activities.find(a => a.id === id);
  if (!activity) return false;
  
  // Get only activities in the same area
  const sameAreaActivities = activities
    .filter(a => a.areaId === activity.areaId)
    .sort((a: any, b: any) => parseInt(a.order || '0') - parseInt(b.order || '0'));
  
  const index = sameAreaActivities.findIndex(a => a.id === id);
  if (index <= 0) return false;
  
  // Swap order values
  const temp = (sameAreaActivities[index] as any).order;
  (sameAreaActivities[index] as any) = { ...sameAreaActivities[index], order: (sameAreaActivities[index - 1] as any).order };
  (sameAreaActivities[index - 1] as any) = { ...sameAreaActivities[index - 1], order: temp };
  
  // Update the full activities array with the modified activities
  const updatedActivities = activities.map(a => {
    const updated = sameAreaActivities.find(sa => sa.id === a.id);
    return updated || a;
  });
  
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updatedActivities));
  return true;
}

export function moveActivityDown(id: string): boolean {
  const activities = getActivities();
  const activity = activities.find(a => a.id === id);
  if (!activity) return false;
  
  // Get only activities in the same area
  const sameAreaActivities = activities
    .filter(a => a.areaId === activity.areaId)
    .sort((a: any, b: any) => parseInt(a.order || '0') - parseInt(b.order || '0'));
  
  const index = sameAreaActivities.findIndex(a => a.id === id);
  if (index === -1 || index >= sameAreaActivities.length - 1) return false;
  
  // Swap order values
  const temp = (sameAreaActivities[index] as any).order;
  (sameAreaActivities[index] as any) = { ...sameAreaActivities[index], order: (sameAreaActivities[index + 1] as any).order };
  (sameAreaActivities[index + 1] as any) = { ...sameAreaActivities[index + 1], order: temp };
  
  // Update the full activities array with the modified activities
  const updatedActivities = activities.map(a => {
    const updated = sameAreaActivities.find(sa => sa.id === a.id);
    return updated || a;
  });
  
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(updatedActivities));
  return true;
}

// Goals
export function getGoals(): Goal[] {
  const data = localStorage.getItem(STORAGE_KEYS.GOALS);
  return data ? JSON.parse(data) : [];
}

export function getGoalsByPerson(personId: string): Goal[] {
  return getGoals().filter(g => g.personId === personId);
}

export function addGoal(goal: Omit<Goal, "id" | "completedAt">): Goal {
  const goals = getGoals();
  const newGoal: Goal = { 
    ...goal, 
    id: generateId(),
    completedAt: null,
    status: goal.status || "open",
    dueDate: goal.dueDate || null,
  };
  goals.push(newGoal);
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  return newGoal;
}

export function updateGoal(id: string, updates: Partial<Omit<Goal, "id">>): Goal | null {
  const goals = getGoals();
  const index = goals.findIndex(g => g.id === id);
  if (index === -1) return null;
  
  const updatedGoal = { ...goals[index], ...updates };
  
  // If status is being changed to completed, set completedAt
  if (updates.status === "completed" && goals[index].status !== "completed") {
    updatedGoal.completedAt = new Date();
  } else if (updates.status === "open" && goals[index].status === "completed") {
    updatedGoal.completedAt = null;
  }
  
  goals[index] = updatedGoal;
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(goals));
  return goals[index];
}

export function deleteGoal(id: string): boolean {
  const goals = getGoals();
  const filtered = goals.filter(g => g.id !== id);
  if (filtered.length === goals.length) return false;
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(filtered));
  return true;
}

// Export all data
export function exportAllData(): AppData {
  return {
    persons: getPersons(),
    workBehaviorCategories: getWorkBehaviorCategories(),
    activityAreas: getActivityAreas(),
    activities: getActivities(),
    goals: getGoals(),
  };
}

// Check if data is in legacy format
function isLegacyFormat(data: any): data is LegacyAppData {
  return data && 'nameList' in data && Array.isArray(data.nameList);
}

// Helper function to create slug from text
function createSlug(text: string): string {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
}

// Helper function to convert DD.MM.YYYY to YYYY-MM-DD
function convertDateFormat(dateStr: string): string {
  const parts = dateStr.split('.');
  if (parts.length !== 3) return '';
  const [day, month, year] = parts;
  return `${year}-${month.padStart(2, '0')}-${day.padStart(2, '0')}`;
}

// Convert legacy format to new format
function convertLegacyData(legacyData: LegacyAppData): AppData {
  // Convert nameList to persons with IDs and order
  // Filter out empty/whitespace-only names and create deterministic IDs
  const persons: Person[] = (legacyData.nameList || [])
    .map(name => name.trim())
    .filter(name => name.length > 0)
    .map((name, index) => ({
      id: `legacy-${index}-${createSlug(name)}`,
      name: name,
      order: String(index),
    }));

  // Read existing categories from localStorage instead of calling getter
  // This preserves any customizations and avoids reentry issues
  const existingCategoriesData = localStorage.getItem(STORAGE_KEYS.WORK_BEHAVIOR);
  const existingCategories = existingCategoriesData ? JSON.parse(existingCategoriesData) : [];

  // Convert taetigkeiten (activities) from legacy format
  const activityAreas: any[] = [];
  const activities: any[] = [];
  
  if (legacyData.taetigkeiten && typeof legacyData.taetigkeiten === 'object') {
    const bereichNames = Object.keys(legacyData.taetigkeiten).filter(key => key.trim().length > 0);
    
    bereichNames.forEach((bereichName, areaIndex) => {
      const areaSlug = createSlug(bereichName);
      const areaId = `legacy-area-${areaIndex}-${areaSlug}`;
      
      // Create activity area
      activityAreas.push({
        id: areaId,
        name: bereichName.trim(),
        order: String(areaIndex),
      });
      
      // Create activities for this area
      const taetigkeiten = legacyData.taetigkeiten?.[bereichName];
      if (Array.isArray(taetigkeiten)) {
        taetigkeiten
          .filter(t => t && t.trim().length > 0)
          .forEach((taetigkeit, activityIndex) => {
            const activitySlug = createSlug(taetigkeit);
            activities.push({
              id: `legacy-activity-${areaIndex}-${activityIndex}-${activitySlug}`,
              areaId: areaId,
              title: taetigkeit.trim(),
              description: taetigkeit.trim(),
              measure: "",
              order: String(activityIndex),
            });
          });
      }
    });
  }

  // Convert ziele (goals) from legacy format
  const goals: any[] = [];
  
  if (legacyData.ziele && Array.isArray(legacyData.ziele)) {
    legacyData.ziele
      .filter(ziel => ziel && ziel.text && ziel.text.trim().length > 0)
      .forEach((ziel, index) => {
        const goalSlug = createSlug(ziel.text);
        const dueDate = ziel.datum ? convertDateFormat(ziel.datum) : null;
        
        goals.push({
          id: `legacy-goal-${index}-${goalSlug}`,
          personId: "",
          title: ziel.text.trim(),
          description: "",
          measure: "",
          dueDate: dueDate,
          status: "open",
          completedAt: null,
          order: String(index),
        });
      });
  }

  return {
    persons,
    workBehaviorCategories: existingCategories,
    activityAreas,
    activities,
    goals,
  };
}

// Import all data (supports both new and legacy formats)
export function importAllData(data: AppData | LegacyAppData): void {
  let normalizedData: AppData;

  // Check if this is legacy format and convert if necessary
  if (isLegacyFormat(data)) {
    normalizedData = convertLegacyData(data);
  } else {
    normalizedData = data as AppData;
  }

  // Import the normalized data
  localStorage.setItem(STORAGE_KEYS.PERSONS, JSON.stringify(normalizedData.persons || []));
  localStorage.setItem(STORAGE_KEYS.WORK_BEHAVIOR, JSON.stringify(normalizedData.workBehaviorCategories || []));
  localStorage.setItem(STORAGE_KEYS.ACTIVITY_AREAS, JSON.stringify(normalizedData.activityAreas || []));
  localStorage.setItem(STORAGE_KEYS.ACTIVITIES, JSON.stringify(normalizedData.activities || []));
  localStorage.setItem(STORAGE_KEYS.GOALS, JSON.stringify(normalizedData.goals || []));
}

// Documenting Person
export function getDocumentingPerson(): string {
  return localStorage.getItem(STORAGE_KEYS.DOCUMENTING_PERSON) || "";
}

export function setDocumentingPerson(name: string): void {
  localStorage.setItem(STORAGE_KEYS.DOCUMENTING_PERSON, name);
}

// Clear all data
export function clearAllData(): void {
  Object.values(STORAGE_KEYS).forEach(key => localStorage.removeItem(key));
  initializeDefaultData();
}
