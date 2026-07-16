"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../context/AuthContext";

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const router = useRouter();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [languageFilter, setLanguageFilter] = useState("all");

  useEffect(() => {
    if (!authLoading && !user) {
      router.push("/login");
      return;
    }
    if (user) fetchProjects();
  }, [user, authLoading]);

  const fetchProjects = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${user.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      setProjects(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (projectId) => {
    if (!confirm("Delete this review? This cannot be undone.")) return;
    try {
      const res = await fetch(`http://localhost:5000/api/projects/${projectId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete");
      setProjects(projects.filter((p) => p.id !== projectId));
    } catch (err) {
      alert(err.message);
    }
  };

  const filteredProjects = projects.filter((p) => {
    const matchesSearch = (p.project_name || "").toLowerCase().includes(search.toLowerCase());
    const matchesLanguage = languageFilter === "all" || p.language === languageFilter;
    return matchesSearch && matchesLanguage;
  });

  if (authLoading || loading) return <p className="text-center mt-10">Loading...</p>;
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

      <div className="flex gap-3 mb-6">
        <input
          type="text"
          placeholder="Search by project name..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="flex-1 border rounded p-2"
        />
        <select
          value={languageFilter}
          onChange={(e) => setLanguageFilter(e.target.value)}
          className="border rounded p-2"
        >
          <option value="all">All languages</option>
          <option value="javascript">JavaScript</option>
          <option value="python">Python</option>
          <option value="typescript">TypeScript</option>
          <option value="java">Java</option>
        </select>
      </div>

      {filteredProjects.length === 0 ? (
        <p className="text-gray-500">No reviews match your search.</p>
      ) : (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <div key={project.id} className="border rounded p-4 hover:bg-gray-50 transition flex items-center justify-between">
              <Link href={`/review/${project.id}`} className="flex-1">
                <h2 className="font-semibold">{project.project_name || "Untitled Project"}</h2>
                <p className="text-sm text-gray-500">
                  {project.file_name} · {project.language} · {new Date(project.created_at).toLocaleDateString()}
                </p>
              </Link>
              <button
                onClick={() => handleDelete(project.id)}
                className="text-red-600 text-sm hover:underline ml-4"
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}