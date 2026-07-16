'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';

export default function NewReviewPage() {
  const [code, setCode] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    alert('Code submitted for AI analysis!');
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-6">Submit Code for Review</h1>
      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your code block here..."
          rows={10}
          className="w-full p-4 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
        <button type="submit" className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700">
          Analyze Code
        </button>
      </form>
    </div>
  );
}