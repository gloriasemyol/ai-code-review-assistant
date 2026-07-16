"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <nav className="flex items-center justify-between px-8 py-4 bg-blue-600 text-white shadow-md">
      <Link href="/" className="text-xl font-bold">
        AI Code Review Assistant
      </Link>
      <div className="flex items-center gap-6">
        {user ? (
          <>
            <Link href="/dashboard" className="hover:underline">Dashboard</Link>
            <Link href="/new-review" className="hover:underline">New Review</Link>
            <Link href="/profile" className="hover:underline">Profile</Link>
            <span className="text-sm opacity-80">{user.email}</span>
            <button onClick={handleLogout} className="hover:underline">Logout</button>
          </>
        ) : (
          <>
            <Link href="/login" className="hover:underline">Login</Link>
            <Link href="/signup" className="hover:underline">Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
}