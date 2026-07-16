'use client';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import LoadingSpinner from '../components/LoadingSpinner';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading, logout } = useAuth();
  const router = useRouter();
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState('');

  // Update default name if user metadata exists
  useEffect(() => {
    if (user) {
      setDisplayName(user.user_metadata?.full_name || user.email?.split('@')[0] || 'Developer');
    }
  }, [user]);

  // Protect route
  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  if (loading) return <LoadingSpinner />;
  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const handleSaveName = () => {
    setIsEditing(false);
    // Here is where you would hook up a backend api call to update Supabase metadata if needed
    alert(`Name updated to: ${displayName}`);
  };

  return (
    <div className="max-w-md mx-auto mt-12 p-6 bg-white rounded-lg shadow-md border border-gray-200">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Account Profile</h1>
        <button 
          onClick={handleLogout}
          className="text-sm font-semibold text-red-600 hover:text-red-800 hover:underline"
        >
          Logout
        </button>
      </div>

      <div className="space-y-6">
        <div className="border-b border-gray-100 pb-4">
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Display Name
          </label>
          <div className="flex items-center justify-between">
            {isEditing ? (
              <div className="flex gap-2 w-full">
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="border border-gray-300 rounded px-2 py-1 text-sm flex-1 focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
                <button 
                  onClick={handleSaveName}
                  className="bg-green-600 text-white text-xs px-3 py-1 rounded hover:bg-green-700"
                >
                  Save
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-gray-800 text-lg font-medium">{displayName}</span>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-gray-400 hover:text-blue-600 p-1"
                  title="Edit Name"
                >
                  ✏️
                </button>
              </div>
            )}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1">
            Email Address
          </label>
          <p className="text-gray-700 font-medium">{user.email}</p>
        </div>
      </div>
    </div>
  );
}