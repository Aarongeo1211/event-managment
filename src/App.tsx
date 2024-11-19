import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import { BadgeForm } from './components/BadgeForm';
import { EventForm } from './components/EventForm';
import { AttendanceScanner } from './components/AttendanceScanner';
import { AttendanceHistory } from './components/AttendanceHistory';
import { QrCode, Calendar, UserCheck, History } from 'lucide-react';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-white shadow-lg">
          <div className="max-w-7xl mx-auto px-4">
            <div className="flex justify-between h-16">
              <div className="flex space-x-8">
                <Link
                  to="/"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500"
                >
                  <QrCode className="w-5 h-5 mr-2" />
                  Create Badge
                </Link>
                <Link
                  to="/events"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500"
                >
                  <Calendar className="w-5 h-5 mr-2" />
                  Create Event
                </Link>
                <Link
                  to="/attendance"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500"
                >
                  <UserCheck className="w-5 h-5 mr-2" />
                  Record Attendance
                </Link>
                <Link
                  to="/history"
                  className="inline-flex items-center px-1 pt-1 text-gray-900 hover:text-gray-500"
                >
                  <History className="w-5 h-5 mr-2" />
                  View History
                </Link>
              </div>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <Routes>
            <Route path="/" element={<BadgeForm />} />
            <Route path="/events" element={<EventForm />} />
            <Route path="/attendance" element={<AttendanceScanner />} />
            <Route path="/history" element={<AttendanceHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;