import { db, isCloudSqlConfigured } from './index.ts';
import { users, hairConsultations } from './schema.ts';
import { eq, desc } from 'drizzle-orm';

// In-memory cache for development fallback
const memoryConsultations: any[] = [];

export async function getOrCreateUser(uid: string, email: string) {
  if (!isCloudSqlConfigured()) {
    return { id: 1, uid, email, createdAt: new Date() };
  }
  try {
    const existing = await db.select().from(users).where(eq(users.uid, uid)).limit(1);
    if (existing.length > 0) {
      return existing[0];
    }
    const inserted = await db.insert(users).values({ uid, email }).returning();
    return inserted[0];
  } catch (error) {
    console.warn('Cloud SQL getOrCreateUser fallback:', error);
    return { id: 1, uid, email, createdAt: new Date() };
  }
}

export async function saveConsultationRecord(record: {
  userUid: string;
  ticketId: string;
  clientName: string;
  faceShape: string;
  selectedStyleName: string;
  styleCategory: string;
  symmetryScore: number;
  rebookingWeeks: number;
  notes?: string;
  technicalBriefJson?: string;
}) {
  const item = {
    id: Date.now(),
    userUid: record.userUid,
    ticketId: record.ticketId,
    clientName: record.clientName,
    faceShape: record.faceShape,
    selectedStyleName: record.selectedStyleName,
    styleCategory: record.styleCategory,
    symmetryScore: record.symmetryScore,
    rebookingWeeks: record.rebookingWeeks,
    notes: record.notes || '',
    technicalBriefJson: record.technicalBriefJson || '{}',
    createdAt: new Date(),
  };

  if (!isCloudSqlConfigured()) {
    memoryConsultations.unshift(item);
    return item;
  }

  try {
    const inserted = await db.insert(hairConsultations).values({
      userUid: record.userUid,
      ticketId: record.ticketId,
      clientName: record.clientName,
      faceShape: record.faceShape,
      selectedStyleName: record.selectedStyleName,
      styleCategory: record.styleCategory,
      symmetryScore: record.symmetryScore,
      rebookingWeeks: record.rebookingWeeks,
      notes: record.notes || '',
      technicalBriefJson: record.technicalBriefJson || '{}',
    }).returning();
    return inserted[0];
  } catch (error) {
    console.warn('Cloud SQL saveConsultationRecord fallback:', error);
    memoryConsultations.unshift(item);
    return item;
  }
}

export async function getConsultationRecords(userUid?: string) {
  if (!isCloudSqlConfigured()) {
    if (userUid) {
      return memoryConsultations.filter(c => c.userUid === userUid);
    }
    return memoryConsultations;
  }

  try {
    if (userUid) {
      return await db.select().from(hairConsultations).where(eq(hairConsultations.userUid, userUid)).orderBy(desc(hairConsultations.createdAt));
    }
    return await db.select().from(hairConsultations).orderBy(desc(hairConsultations.createdAt));
  } catch (error) {
    console.warn('Cloud SQL getConsultationRecords fallback:', error);
    return memoryConsultations;
  }
}
