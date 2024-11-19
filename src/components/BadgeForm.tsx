import React, { useState } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { db } from '../lib/db';

export function BadgeForm() {
  const [badgeNumber, setBadgeNumber] = useState('');
  const [name, setName] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      await db.attendees.add({
        badgeNumber,
        name,
        createdAt: new Date()
      });
      setSuccess(true);
    } catch (error) {
      console.error('Error creating badge:', error);
      alert('Error creating badge. Badge number might already exist.');
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Create Badge</h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Badge Number</label>
          <input
            type="text"
            value={badgeNumber}
            onChange={(e) => setBadgeNumber(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Create Badge
        </button>
      </form>

      {success && (
        <div className="mt-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Your QR Code:</h3>
          <div className="flex justify-center">
            <QRCodeSVG value={badgeNumber} size={200} />
          </div>
          <p className="mt-2 text-sm text-gray-600 text-center">
            Badge Number: {badgeNumber}
          </p>
        </div>
      )}
    </div>
  );
}