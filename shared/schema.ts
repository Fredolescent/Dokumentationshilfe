import { sql } from "drizzle-orm";
import { pgTable, text, varchar, timestamp, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Person (beschäftigte Person)
export const persons = pgTable("persons", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  order: text("order").notNull().default("0"),
});

export const insertPersonSchema = createInsertSchema(persons).omit({
  id: true,
  order: true,
});

export type InsertPerson = z.infer<typeof insertPersonSchema>;
export type Person = typeof persons.$inferSelect;

// Activity Area (Bereich)
export const activityAreas = pgTable("activity_areas", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  name: text("name").notNull(),
  order: text("order").notNull().default("0"),
});

export const insertActivityAreaSchema = createInsertSchema(activityAreas).omit({
  id: true,
  order: true,
});

export type InsertActivityArea = z.infer<typeof insertActivityAreaSchema>;
export type ActivityArea = typeof activityAreas.$inferSelect;

// Activity (Tätigkeit)
export const activities = pgTable("activities", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  areaId: varchar("area_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  measure: text("measure").notNull(), // Maßnahme
  order: text("order").notNull().default("0"),
});

export const insertActivitySchema = createInsertSchema(activities).omit({
  id: true,
  order: true,
});

export type InsertActivity = z.infer<typeof insertActivitySchema>;
export type Activity = typeof activities.$inferSelect;

// Work Behavior Category (Arbeitsverhalten Kategorie)
export const workBehaviorCategories = pgTable("work_behavior_categories", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  category: text("category").notNull(),
  choices: text("choices").array().notNull(),
  order: text("order").notNull().default("0"),
});

export const insertWorkBehaviorCategorySchema = createInsertSchema(workBehaviorCategories).omit({
  id: true,
  order: true,
});

export type InsertWorkBehaviorCategory = z.infer<typeof insertWorkBehaviorCategorySchema>;
export type WorkBehaviorCategory = typeof workBehaviorCategories.$inferSelect;

// Goal (Ziel)
export const goals = pgTable("goals", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  personId: varchar("person_id").notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  measure: text("measure").notNull(),
  dueDate: text("due_date"),
  status: text("status").notNull().default("open"), // open | completed
  order: text("order").notNull().default("0"),
  completedAt: timestamp("completed_at"),
});

export const insertGoalSchema = createInsertSchema(goals).omit({
  id: true,
  order: true,
  completedAt: true,
});

export type InsertGoal = z.infer<typeof insertGoalSchema>;
export type Goal = typeof goals.$inferSelect;
