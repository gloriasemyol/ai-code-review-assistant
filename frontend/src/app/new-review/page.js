"use client";
import { useState } from "react";

export default function NewReview() {
  const [projectName, setProjectName] = useState("");
  const [code, setCode] = useState("");
  const [fileName, setFileName] = useState("");
  const [language, setLanguage] = useState("javascript");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  // Runs when user selects a file
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      setCode(event.target.result); // puts file's text content into our textarea
    };
    reader.readAsText(file);
  };

  const handleSubmit = async () => {
    if (!code.trim()) {
      setMessage("Please paste code or upload a file first.");
      return;
    }
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch("http://localhost:5000/api/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "512a783e-2ff1-4074-8ed0-0641eabfe018", // Your real user UUID
          project_name: projectName || "Untitled Project",
          code_content: code,
          file_name: fileName || "pasted-code.txt",
          language,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setMessage("✅ Code submitted successfully!");
      setCode("");
      setFileName("");
      setProjectName("");
    } catch (err) {
      setMessage("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-6">Submit Code for Review</h1>

      <input
        type="text"
        placeholder="Project name (optional)"
        value={projectName}
        onChange={(e) => setProjectName(e.target.value)}
        className="w-full border rounded p-2 mb-4"
      />

      <label className="block mb-2 font-medium">Upload a file:</label>
      <input
        type="file"
        accept=".js,.py,.ts,.java,.txt"
        onChange={handleFileUpload}
        className="mb-4"
      />

      <label className="block mb-2 font-medium">Or paste your code below:</label>
      <textarea
        value={code}
        onChange={(e) => setCode(e.target.value)}
        rows={12}
        placeholder="Paste your code here..."
        className="w-full border rounded p-2 font-mono text-sm mb-4"
      />

      <select
        value={language}
        onChange={(e) => setLanguage(e.target.value)}
        className="border rounded p-2 mb-4"
      >
        <option value="javascript">JavaScript</option>
        <option value="python">Python</option>
        <option value="typescript">TypeScript</option>
        <option value="java">Java</option>
      </select>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="block w-full bg-blue-600 text-white py-2 rounded font-semibold hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Analyze Code"}
      </button>

      {message && <p className="mt-4 text-center">{message}</p>}
    </div>
  );
}