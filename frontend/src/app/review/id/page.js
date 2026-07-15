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
       fetchReview();
     }, [id]);

     const fetchReview = async () => {
       try {
         const res = await fetch(`http://localhost:5000/api/reviews/project/${id}`);
         const data = await res.json();
         if (!res.ok) throw new Error(data.error);
         setReview(data.review);
         setFindings(data.findings);
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
         <h1 className="text-2xl font-bold mb-2">Review Results</h1>
         <p className="text-gray-500 mb-6">{review.summary}</p>

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