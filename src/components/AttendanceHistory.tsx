import React, { useState } from 'react';
import { db } from '../lib/db';
import { format } from 'date-fns';

export function AttendanceHistory() {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [history, setHistory] = useState<any[]>([]);
  const [attendee, setAttendee] = useState<any>(null);

  const searchHistory = async () => {
    try {
      const attendeeData = await db.attendees.get(badgeNumber);

      if (!attendeeData) {
        alert('Badge number not found');
        return;
      }

      setAttendee(attendeeData);

      const attendances = await db.attendances
        .where('badgeNumber')
        .equals(badgeNumber)
        .toArray();

      const eventsData = await Promise.all(
        attendances.map(async (attendance) => {
          const event = await db.events.get(attendance.eventId);
          return {
            name: event?.name,
            date: event?.date,
            timestamp: attendance.timestamp
          };
        })
      );

      setHistory(eventsData);
    } catch (error) {
      console.error('Error fetching history:', error);
      alert('Error fetching attendance history');
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Attendance History</h2>

      <div className="mb-6">
        <div className="flex gap-4">
          <input
            type="text"
            value={badgeNumber}
            onChange={(e) => setBadgeNumber(e.target.value)}
            placeholder="Enter badge number"
            className="flex-1 rounded-md border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
          />
          <button
            onClick={searchHistory}
            className="px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </div>
      </div>

      {attendee && (
        <div className="mb-6 p-4 bg-gray-50 rounded-md">
          <h3 className="text-lg font-medium text-gray-900">Attendee Information</h3>
          <p className="text-gray-600">Name: {attendee.name}</p>
          <p className="text-gray-600">Badge Number: {attendee.badgeNumber}</p>
        </div>
      )}

      {history.length > 0 && (
        <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Event</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Date</th>
                <th className="px-6 py-3 text-left text-sm font-semibold text-gray-900">Check-in Time</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 bg-white">
              {history.map((record, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 text-sm text-gray-900">{record.name}</td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {format(new Date(record.date), 'MMM d, yyyy')}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {format(new Date(record.timestamp), 'MMM d, yyyy h:mm a')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {attendee && history.length === 0 && (
        <p className="text-gray-600 text-center py-4">No attendance records found</p>
      )}
    </div>
  );
}