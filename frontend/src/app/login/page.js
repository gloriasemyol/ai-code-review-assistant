'use client';
import { useAuth } from '../context/AuthContext';

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Welcome Back</h2>
      <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
        Sign In to Continue
      </button>
    </div>
  );
}