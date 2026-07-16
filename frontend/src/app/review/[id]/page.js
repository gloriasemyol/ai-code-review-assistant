'use client';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ReviewDetailsPage() {
  const params = useParams();
  const router = useRouter();

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Review Details</h1>
        <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Return to Dashboard
        </Link>
      </div>

      <p className="text-gray-500 mb-6">Analysis Results for Review Session: <strong className="text-gray-800">#{params.id}</strong></p>
      
      <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-6">
        <div>
          <h3 className="font-semibold text-lg text-red-600 mb-2">⚠️ Found 1 Issue:</h3>
          <div className="bg-red-50 border-l-4 border-red-500 p-4 font-mono text-sm">
            <p className="text-red-800">ReferenceError: "isActive" is not defined outside of the block scope.</p>
          </div>
        </div>

        <div>
          <h3 className="font-semibold text-lg text-green-600 mb-2">💡 Recommended Fix:</h3>
          <p className="text-gray-700">Use <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600">var</code> instead of <code className="bg-gray-100 px-1 py-0.5 rounded text-red-600">let</code> if you need block variables to leak out, or declare your variable globally outside the conditional wrapper.</p>
        </div>
      </div>
    </div>
  );
}