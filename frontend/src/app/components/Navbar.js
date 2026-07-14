"use client";
   import Link from "next/link";

   export default function Navbar() {
     return (
       <nav className="flex items-center justify-between px-8 py-4 bg-blue-600 text-white shadow-md">
         <Link href="/" className="text-xl font-bold">
           AI Code Review Assistant
         </Link>
         <div className="flex gap-6">
           <Link href="/dashboard" className="hover:underline">Dashboard</Link>
           <Link href="/new-review" className="hover:underline">New Review</Link>
           <Link href="/profile" className="hover:underline">Profile</Link>
           <Link href="/login" className="hover:underline">Login</Link>
           <Link href="/signup" className="hover:underline">Sign Up</Link>
         </div>
       </nav>
     );
   }