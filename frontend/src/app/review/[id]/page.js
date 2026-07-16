'use client';
import { useParams } from 'next/navigation';
import LoadingSpinner from '../../components/LoadingSpinner';

export default function ReviewDetailsPage() {
  const params = useParams();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h1 className="text-3xl font-bold mb-4">Review Details</h1>
      <p className="text-gray-500 mb-6">Showing analysis for Review ID: {params.id}</p>
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200">
        <h3 className="font-semibold text-lg text-green-600 mb-2">AI Feedback Summary</h3>
        <p className="text-gray-700">Your layout structure is looking great! No severe errors detected.</p>
      </div>
    </div>
  );
}