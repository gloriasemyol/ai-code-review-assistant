'use client';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import Link from 'next/link';

export default function DashboardPage() {
  const { user, loading } = useAuth();

  if (loading) return <LoadingSpinner />;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Your Dashboard</h1>
        <Link href="/new-review" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          New Code Review
        </Link>
      </div>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <p className="text-gray-600">No code reviews submitted yet. Click above to get started!</p>
      </div>
    </div>
  );
}