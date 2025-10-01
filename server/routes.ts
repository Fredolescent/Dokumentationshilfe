import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertPersonSchema, 
  insertActivityAreaSchema, 
  insertActivitySchema,
  insertGoalSchema 
} from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {
  // Persons
  app.get("/api/persons", async (_req, res) => {
    const persons = await storage.getPersons();
    res.json(persons);
  });

  app.post("/api/persons", async (req, res) => {
    try {
      const personData = insertPersonSchema.parse(req.body);
      const person = await storage.createPerson(personData);
      res.json(person);
    } catch (error) {
      res.status(400).json({ error: "Invalid person data" });
    }
  });

  app.patch("/api/persons/:id", async (req, res) => {
    const person = await storage.updatePerson(req.params.id, req.body);
    if (!person) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json(person);
  });

  app.delete("/api/persons/:id", async (req, res) => {
    const deleted = await storage.deletePerson(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Person not found" });
    }
    res.json({ success: true });
  });

  // Activity Areas
  app.get("/api/activity-areas", async (_req, res) => {
    const areas = await storage.getActivityAreas();
    res.json(areas);
  });

  app.post("/api/activity-areas", async (req, res) => {
    try {
      const areaData = insertActivityAreaSchema.parse(req.body);
      const area = await storage.createActivityArea(areaData);
      res.json(area);
    } catch (error) {
      res.status(400).json({ error: "Invalid area data" });
    }
  });

  app.delete("/api/activity-areas/:id", async (req, res) => {
    const deleted = await storage.deleteActivityArea(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Area not found" });
    }
    res.json({ success: true });
  });

  // Activities
  app.get("/api/activities", async (_req, res) => {
    const activities = await storage.getActivities();
    res.json(activities);
  });

  app.get("/api/activities/area/:areaId", async (req, res) => {
    const activities = await storage.getActivitiesByArea(req.params.areaId);
    res.json(activities);
  });

  app.post("/api/activities", async (req, res) => {
    try {
      const activityData = insertActivitySchema.parse(req.body);
      const activity = await storage.createActivity(activityData);
      res.json(activity);
    } catch (error) {
      res.status(400).json({ error: "Invalid activity data" });
    }
  });

  app.patch("/api/activities/:id", async (req, res) => {
    const activity = await storage.updateActivity(req.params.id, req.body);
    if (!activity) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.json(activity);
  });

  app.delete("/api/activities/:id", async (req, res) => {
    const deleted = await storage.deleteActivity(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Activity not found" });
    }
    res.json({ success: true });
  });

  // Work Behavior Categories
  app.get("/api/work-behavior-categories", async (_req, res) => {
    const categories = await storage.getWorkBehaviorCategories();
    res.json(categories);
  });

  // Goals
  app.get("/api/goals", async (_req, res) => {
    const goals = await storage.getGoals();
    res.json(goals);
  });

  app.get("/api/goals/person/:personId", async (req, res) => {
    const goals = await storage.getGoalsByPerson(req.params.personId);
    res.json(goals);
  });

  app.post("/api/goals", async (req, res) => {
    try {
      const goalData = insertGoalSchema.parse(req.body);
      const goal = await storage.createGoal(goalData);
      res.json(goal);
    } catch (error) {
      res.status(400).json({ error: "Invalid goal data" });
    }
  });

  app.patch("/api/goals/:id", async (req, res) => {
    const goal = await storage.updateGoal(req.params.id, req.body);
    if (!goal) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.json(goal);
  });

  app.delete("/api/goals/:id", async (req, res) => {
    const deleted = await storage.deleteGoal(req.params.id);
    if (!deleted) {
      return res.status(404).json({ error: "Goal not found" });
    }
    res.json({ success: true });
  });

  const httpServer = createServer(app);
  return httpServer;
}
