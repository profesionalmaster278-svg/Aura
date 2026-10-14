import { pgTable, serial, text, integer, timestamp } from 'drizzle-orm/pg-core';

export const users = pgTable('users', {
  id: serial('id').primaryKey(),
  uid: text('uid').notNull().unique(),
  email: text('email').notNull(),
  createdAt: timestamp('created_at').defaultNow(),
});

export const hairConsultations = pgTable('hair_consultations', {
  id: serial('id').primaryKey(),
  userUid: text('user_uid').notNull(),
  ticketId: text('ticket_id').notNull(),
  clientName: text('client_name').notNull(),
  faceShape: text('face_shape').notNull(),
  selectedStyleName: text('selected_style_name').notNull(),
  styleCategory: text('style_category').notNull(),
  symmetryScore: integer('symmetry_score').notNull(),
  rebookingWeeks: integer('rebooking_weeks').notNull(),
  notes: text('notes'),
  technicalBriefJson: text('technical_brief_json'),
  createdAt: timestamp('created_at').defaultNow(),
});
