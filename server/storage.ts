import { randomUUID } from "crypto";
import type {
  Person,
  InsertPerson,
  ActivityArea,
  InsertActivityArea,
  Activity,
  InsertActivity,
  WorkBehaviorCategory,
  InsertWorkBehaviorCategory,
  Goal,
  InsertGoal,
} from "@shared/schema";

export interface IStorage {
  // Persons
  getPersons(): Promise<Person[]>;
  getPerson(id: string): Promise<Person | undefined>;
  createPerson(person: InsertPerson): Promise<Person>;
  updatePerson(id: string, person: Partial<InsertPerson>): Promise<Person | undefined>;
  deletePerson(id: string): Promise<boolean>;

  // Activity Areas
  getActivityAreas(): Promise<ActivityArea[]>;
  createActivityArea(area: InsertActivityArea): Promise<ActivityArea>;
  deleteActivityArea(id: string): Promise<boolean>;

  // Activities
  getActivities(): Promise<Activity[]>;
  getActivitiesByArea(areaId: string): Promise<Activity[]>;
  createActivity(activity: InsertActivity): Promise<Activity>;
  updateActivity(id: string, activity: Partial<InsertActivity>): Promise<Activity | undefined>;
  deleteActivity(id: string): Promise<boolean>;

  // Work Behavior Categories
  getWorkBehaviorCategories(): Promise<WorkBehaviorCategory[]>;

  // Goals
  getGoals(): Promise<Goal[]>;
  getGoalsByPerson(personId: string): Promise<Goal[]>;
  createGoal(goal: InsertGoal): Promise<Goal>;
  updateGoal(id: string, goal: Partial<InsertGoal>): Promise<Goal | undefined>;
  deleteGoal(id: string): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private persons: Map<string, Person>;
  private activityAreas: Map<string, ActivityArea>;
  private activities: Map<string, Activity>;
  private workBehaviorCategories: Map<string, WorkBehaviorCategory>;
  private goals: Map<string, Goal>;

  constructor() {
    this.persons = new Map();
    this.activityAreas = new Map();
    this.activities = new Map();
    this.workBehaviorCategories = new Map();
    this.goals = new Map();
    
    // Initialize with default work behavior categories
    this.initializeDefaultData();
  }

  private initializeDefaultData() {
    // Default work behavior categories based on original app
    const defaultCategories = [
      {
        id: randomUUID(),
        category: "Arbeitstempo",
        choices: ["zügig", "angemessen", "langsam", "unregelmäßig"]
      },
      {
        id: randomUUID(),
        category: "Arbeitsqualität",
        choices: ["sorgfältig", "genau", "ungenau", "nachlässig"]
      },
      {
        id: randomUUID(),
        category: "Selbstständigkeit",
        choices: ["eigenständig", "mit Anleitung", "mit Unterstützung", "unselbstständig"]
      },
      {
        id: randomUUID(),
        category: "Konzentration",
        choices: ["konzentriert", "ablenkbar", "wechselhaft", "unkonzentriert"]
      }
    ];

    defaultCategories.forEach(cat => {
      this.workBehaviorCategories.set(cat.id, cat);
    });
  }

  // Persons
  async getPersons(): Promise<Person[]> {
    return Array.from(this.persons.values()).sort((a, b) => 
      a.order.localeCompare(b.order)
    );
  }

  async getPerson(id: string): Promise<Person | undefined> {
    return this.persons.get(id);
  }

  async createPerson(insertPerson: InsertPerson): Promise<Person> {
    const id = randomUUID();
    const person: Person = { 
      ...insertPerson, 
      id,
      order: String(this.persons.size)
    };
    this.persons.set(id, person);
    return person;
  }

  async updatePerson(id: string, updates: Partial<InsertPerson>): Promise<Person | undefined> {
    const person = this.persons.get(id);
    if (!person) return undefined;
    const updated = { ...person, ...updates };
    this.persons.set(id, updated);
    return updated;
  }

  async deletePerson(id: string): Promise<boolean> {
    return this.persons.delete(id);
  }

  // Activity Areas
  async getActivityAreas(): Promise<ActivityArea[]> {
    return Array.from(this.activityAreas.values());
  }

  async createActivityArea(area: InsertActivityArea): Promise<ActivityArea> {
    const id = randomUUID();
    const activityArea: ActivityArea = { ...area, id };
    this.activityAreas.set(id, activityArea);
    return activityArea;
  }

  async deleteActivityArea(id: string): Promise<boolean> {
    // Also delete all activities in this area
    const activities = await this.getActivitiesByArea(id);
    activities.forEach(activity => this.activities.delete(activity.id));
    return this.activityAreas.delete(id);
  }

  // Activities
  async getActivities(): Promise<Activity[]> {
    return Array.from(this.activities.values());
  }

  async getActivitiesByArea(areaId: string): Promise<Activity[]> {
    return Array.from(this.activities.values()).filter(
      activity => activity.areaId === areaId
    );
  }

  async createActivity(activity: InsertActivity): Promise<Activity> {
    const id = randomUUID();
    const newActivity: Activity = { ...activity, id };
    this.activities.set(id, newActivity);
    return newActivity;
  }

  async updateActivity(id: string, updates: Partial<InsertActivity>): Promise<Activity | undefined> {
    const activity = this.activities.get(id);
    if (!activity) return undefined;
    const updated = { ...activity, ...updates };
    this.activities.set(id, updated);
    return updated;
  }

  async deleteActivity(id: string): Promise<boolean> {
    return this.activities.delete(id);
  }

  // Work Behavior Categories
  async getWorkBehaviorCategories(): Promise<WorkBehaviorCategory[]> {
    return Array.from(this.workBehaviorCategories.values());
  }

  // Goals
  async getGoals(): Promise<Goal[]> {
    return Array.from(this.goals.values());
  }

  async getGoalsByPerson(personId: string): Promise<Goal[]> {
    return Array.from(this.goals.values()).filter(
      goal => goal.personId === personId
    );
  }

  async createGoal(goal: InsertGoal): Promise<Goal> {
    const id = randomUUID();
    const newGoal: Goal = { 
      ...goal, 
      id, 
      dueDate: goal.dueDate || null,
      status: goal.status || "open",
      completedAt: null 
    };
    this.goals.set(id, newGoal);
    return newGoal;
  }

  async updateGoal(id: string, updates: Partial<InsertGoal>): Promise<Goal | undefined> {
    const goal = this.goals.get(id);
    if (!goal) return undefined;
    const updated = { ...goal, ...updates };
    
    // Set completedAt timestamp if status changes to completed
    if (updates.status === "completed" && goal.status !== "completed") {
      updated.completedAt = new Date();
    } else if (updates.status === "open") {
      updated.completedAt = null;
    }
    
    this.goals.set(id, updated);
    return updated;
  }

  async deleteGoal(id: string): Promise<boolean> {
    return this.goals.delete(id);
  }
}

export const storage = new MemStorage();
