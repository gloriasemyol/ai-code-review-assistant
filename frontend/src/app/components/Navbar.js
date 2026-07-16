'use client';
import Link from 'next/link';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user } = useAuth();

  return (
    <nav className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
      <Link href="/" className="font-bold text-xl text-blue-600">
        AI Code Reviewer
      </Link>
      <div className="flex gap-4 items-center">
        {user ? (
          <>
            <Link href="/dashboard" className="text-gray-600 hover:text-gray-900">Dashboard</Link>
            <Link href="/profile" className="text-gray-600 hover:text-gray-900">Profile</Link>
          </>
        ) : (
          <Link href="/login" className="bg-blue-600 text-white px-4 py-2 rounded-md">Login</Link>
        )}
      </div>
    </nav>
  );
}