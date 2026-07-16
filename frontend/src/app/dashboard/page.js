'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState([]);

  // Route Protection
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  // Load code history from local storage on client side
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedHistory = JSON.parse(localStorage.getItem('codeReviews') || '[]');
      setHistory(storedHistory);
    }
  }, []);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Your Dashboard</h1>
          <p className="text-gray-500 text-sm mt-1">Review, analyze, and inspect your repository codes.</p>
        </div>
        <Link href="/new-review" className="bg-blue-600 text-white px-5 py-2.5 rounded-md hover:bg-blue-700 font-medium transition">
          + New Code Review
        </Link>
      </div>

      {history.length === 0 ? (
        <div className="bg-white p-12 text-center rounded-lg shadow-sm border border-gray-200">
          <p className="text-gray-500 text-lg mb-4">No code reviews submitted yet.</p>
          <Link href="/new-review" className="text-blue-600 hover:underline font-semibold">
            Run your very first AI analysis now →
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          <h2 className="text-xl font-bold text-gray-800">Recent Reviews ({history.length})</h2>
          <div className="grid gap-4">
            {history.map((review) => (
              <Link 
                key={review.id} 
                href={`/review/${review.id}`}
                className="block bg-white p-5 rounded-lg shadow-sm border border-gray-200 hover:border-blue-500 hover:shadow-md transition group"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition truncate max-w-lg">
                      {review.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-1">Review Session ID: #{review.id}</p>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-gray-500">{review.date}</span>
                    <span className="block text-xs font-semibold text-green-600 mt-1">Analyzed ✓</span>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}