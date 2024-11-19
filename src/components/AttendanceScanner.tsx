import React, { useState, useEffect } from 'react';
import { QRScanner } from './QRScanner';
import { db } from '../lib/db';
import { useLiveQuery } from 'dexie-react-hooks';

export function AttendanceScanner() {
  const events = useLiveQuery(() => db.events.toArray());
  const [selectedEvent, setSelectedEvent] = useState('');
  const [badgeNumber, setBadgeNumber] = useState('');
  const [message, setMessage] = useState('');

  const handleScan = async (data: string) => {
    if (selectedEvent) {
      await recordAttendance(data);
    } else {
      setMessage('Please select an event first');
    }
  };

  const recordAttendance = async (badge: string) => {
    try {
      const attendee = await db.attendees.get(badge);
      if (!attendee) {
        setMessage('Invalid badge number');
        return;
      }

      const existing = await db.attendances
        .where(['badgeNumber', 'eventId'])
        .equals([badge, Number(selectedEvent)])
        .first();

      if (existing) {
        setMessage(`${attendee.name} has already attended this event`);
        return;
      }

      await db.attendances.add({
        badgeNumber: badge,
        eventId: Number(selectedEvent),
        timestamp: new Date()
      });
      setMessage(`Attendance recorded for ${attendee.name}`);
    } catch (error) {
      console.error('Error recording attendance:', error);
      setMessage('Error recording attendance');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Record Attendance</h2>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Select Event</label>
        <select
          value={selectedEvent}
          onChange={(e) => setSelectedEvent(e.target.value)}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        >
          <option value="">Select an event...</option>
          {events?.map((event) => (
            <option key={event.id} value={event.id}>
              {event.name} ({event.date})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-sm font-medium text-gray-700">Manual Entry</label>
        <div className="mt-1 flex rounded-md shadow-sm">
          <input
            type="text"
            value={badgeNumber}
            onChange={(e) => setBadgeNumber(e.target.value)}
            placeholder="Enter badge number"
            className="flex-1 rounded-l-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            onClick={() => handleScan(badgeNumber)}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-r-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Submit
          </button>
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Scan QR Code</h3>
        <QRScanner onScan={handleScan} />
      </div>

      {message && (
        <div className="mt-4 p-4 rounded-md bg-blue-50 text-blue-700">
          {message}
        </div>
      )}
    </div>
  );
}