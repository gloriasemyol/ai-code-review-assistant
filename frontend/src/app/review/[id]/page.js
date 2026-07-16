"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";

const severityColor = {
  High: "bg-red-100 text-red-700 border-red-300",
  Medium: "bg-yellow-100 text-yellow-700 border-yellow-300",
  Low: "bg-blue-100 text-blue-700 border-blue-300",
};

export default function ReviewResults() {
  const { id } = useParams(); // grabs the [id] from the URL
  const [review, setReview] = useState(null);
  const [findings, setFindings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      fetchReview();
    }
  }, [id]);

  const fetchReview = async () => {
    try {
      setLoading(true);
      setError("");
      
      const res = await fetch(`http://localhost:5000/api/reviews/project/${id}`);
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error);
      
      setReview(data.review);
      setFindings(data.findings || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <p className="text-center mt-10">Loading results...</p>;
  if (error) return <p className="text-center mt-10 text-red-600">Error: {error}</p>;

  return (
    <div className="max-w-3xl mx-auto mt-10 p-6">
      <h1 className="text-2xl font-bold mb-4">Review Results</h1>

      {/* --- NEW UPDATED SCORE & METRICS BLOCK --- */}
      <div className="mb-6">
        <div className="flex items-center gap-3 mb-2">
          <span className="text-3xl font-bold">{review?.overall_score ?? "N/A"}</span>
          <span className="text-gray-500">/ 100 Overall Score</span>
        </div>
        <p className="text-gray-600 mb-4">{review?.summary || "No summary available."}</p>

        {review?.complexity_metrics && !review.complexity_metrics.error && (
          <div className="border rounded p-4 bg-gray-50 mb-4">
            <h2 className="font-semibold mb-2">Complexity Metrics</h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-sm">
              <div>
                <span className="block text-gray-500">File Complexity</span>
                <span className="font-bold">{review.complexity_metrics.file_complexity}</span>
              </div>
              <div>
                <span className="block text-gray-500">Functions</span>
                <span className="font-bold">{review.complexity_metrics.number_of_functions}</span>
              </div>
              <div>
                <span className="block text-gray-500">Classes</span>
                <span className="font-bold">{review.complexity_metrics.number_of_classes}</span>
              </div>
              <div>
                <span className="block text-gray-500">Lines of Code</span>
                <span className="font-bold">{review.complexity_metrics.lines_of_code}</span>
              </div>
            </div>

            {review.complexity_metrics.function_complexity?.length > 0 && (
              <div className="mt-3">
                <span className="block text-gray-500 text-sm mb-1">Per-function complexity</span>
                <ul className="text-sm space-y-1">
                  {review.complexity_metrics.function_complexity.map((fn, i) => (
                    <li key={i} className="flex justify-between border-b border-gray-100 py-0.5">
                      <span>{fn.name}</span>
                      <span className={fn.complexity > 10 ? "text-red-600 font-bold" : "text-gray-700"}>
                        {fn.complexity}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
      {/* --- END OF METRICS BLOCK --- */}

      {/* --- FINDINGS LIST --- */}
      <h2 className="text-xl font-bold mb-3 mt-6">Code Findings</h2>
      {findings.length === 0 ? (
        <p className="text-green-600 font-medium">
          🎉 No issues found! Your code looks clean.
        </p>
      ) : (
        <div className="space-y-3">
          {findings.map((f) => (
            <div
              key={f.id}
              className={`border rounded p-4 ${severityColor[f.severity] || "bg-gray-100"}`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{f.issue}</span>
                <span className="text-xs font-bold uppercase">{f.severity}</span>
              </div>
              <p className="text-sm">{f.explanation}</p>
              {f.line_number && (
                <p className="text-xs mt-1 opacity-70">Line {f.line_number}</p>
              )}
              {f.suggested_fix && (
                <p className="text-sm mt-2 italic">Suggested fix: {f.suggested_fix}</p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}