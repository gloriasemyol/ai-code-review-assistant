"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Dashboard() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      // FIX: Changed "test-user-123" to your real valid UUID!
      const res = await fetch("http://localhost:5000/api/projects/512a783e-2ff1-4074-8ed0-0641eabfe018");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading your reviews...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Your Reviews</h1>
        <Link
          href="/new-review"
          className="bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
        >
          + New Review
        </Link>
      </div>

      {projects.length === 0 ? (
        <p className="text-gray-500">You haven't submitted any code yet.</p>
      ) : (
        <div className="space-y-4">
          {projects.map((project) => (
            <Link
              key={project.id}
              href={`/review/${project.id}`}
              className="block border rounded p-4 hover:bg-gray-50 transition"
            >
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="font-semibold">
                    {project.project_name || "Untitled Project"}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {project.file_name} · {project.language}
                  </p>
                </div>
                <span className="text-sm text-gray-400">
                  {new Date(project.created_at).toLocaleDateString()}
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}