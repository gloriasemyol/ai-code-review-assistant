"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Profile() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.push("/login");
  }, [user, loading]);

  if (loading || !user) return <p className="text-center mt-10">Loading...</p>;

  return (
    <div className="max-w-sm mx-auto mt-20 p-6">
      <h1 className="text-2xl font-bold mb-6">Profile</h1>
      <p className="mb-2"><span className="text-gray-500">Name:</span> {user.user_metadata?.name || "N/A"}</p>
      <p className="mb-6"><span className="text-gray-500">Email:</span> {user.email}</p>
      <button
        onClick={() => { logout(); router.push("/login"); }}
        className="w-full bg-red-600 text-white py-2 rounded font-semibold hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );
}