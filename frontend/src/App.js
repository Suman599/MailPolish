import React, { useState } from 'react';
import EmailToneImprover from './components/EmailToneImprover';

export default function App() {
  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white px-6 py-4 shadow-lg">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">AI Email Tone Improver</h1>
          
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="bg-white w-full max-w-3xl p-8 rounded-2xl shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">
            Paste your email below and improve its tone instantly
          </h2>
          <EmailToneImprover />
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-blue-600 text-white text-center py-4 mt-auto">
        <p className="text-sm">© 2025 Mailpolish, Powered By Gemini Pro. All rights reserved.</p>
      </footer>
    </div>
  );
}
