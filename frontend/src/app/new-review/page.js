'use client';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function NewReviewPage() {
  const [code, setCode] = useState('');
  const [analyzing, setAnalyzing] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!code.trim()) return alert("Please paste some code first!");
    
    setAnalyzing(true);

    // Simulate sending code to backend
    setTimeout(() => {
      setAnalyzing(false);
      // Generate a random ID for this review session
      const mockReviewId = Math.floor(100000 + Math.random() * 900000);
      router.push(`/review/${mockReviewId}`);
    }, 2000); // 2 seconds simulated analysis time
  };

  return (
    <div className="max-w-3xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Submit Code for Review</h1>
        <Link href="/dashboard" className="text-gray-600 hover:text-blue-600 flex items-center gap-1">
          ← Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <textarea
          value={code}
          onChange={(e) => setCode(e.target.value)}
          placeholder="Paste your JS code here..."
          rows={10}
          disabled={analyzing}
          className="w-full p-4 border border-gray-300 rounded-md font-mono text-sm focus:ring-2 focus:ring-blue-500 focus:outline-none disabled:bg-gray-100"
        />
        
        <div className="flex gap-4">
          <button 
            type="submit" 
            disabled={analyzing}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:bg-blue-400"
          >
            {analyzing ? 'Analyzing Code...' : 'Analyze Code'}
          </button>
        </div>
      </form>
    </div>
  );
}