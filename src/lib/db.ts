import Dexie, { Table } from 'dexie';

interface Attendee {
  badgeNumber: string;
  name: string;
  createdAt: Date;
}

interface Event {
  id?: number;
  name: string;
  date: string;
  description: string;
  createdAt: Date;
}

interface Attendance {
  id?: number;
  badgeNumber: string;
  eventId: number;
  timestamp: Date;
}

export class EventDatabase extends Dexie {
  attendees!: Table<Attendee, string>;
  events!: Table<Event, number>;
  attendances!: Table<Attendance, number>;

  constructor() {
    super('EventDatabase');
    this.version(1).stores({
      attendees: 'badgeNumber, name, createdAt',
      events: '++id, name, date, description, createdAt',
      attendances: '++id, badgeNumber, eventId, timestamp',
    });
  }
}

export const db = new EventDatabase();