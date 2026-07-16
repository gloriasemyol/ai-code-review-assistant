'use client';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function ReviewDetailsPage() {
  const params = useParams();
  const [code, setCode] = useState('');
  const [analysis, setAnalysis] = useState(null);

  useEffect(() => {
    if (params.id) {
      const savedCode = localStorage.getItem(`review_code_${params.id}`) || '';
      setCode(savedCode);
      analyzeCode(savedCode);
    }
  }, [params.id]);

  // Simple, smart rule-based code analyzer!
  const analyzeCode = (sourceCode) => {
    if (!sourceCode.trim()) {
      setAnalysis({
        status: 'clean',
        message: 'No code provided to analyze.'
      });
      return;
    }

    const issues = [];

    // Rule 1: Check for single quotes template strings
    if (sourceCode.includes('${') && (sourceCode.includes("'") || sourceCode.includes('"')) && !sourceCode.includes('`')) {
      issues.push({
        type: 'syntax',
        severity: 'critical',
        title: 'Template Literal Error',
        detail: "You are using '${variable}' syntax inside single or double quotes. JavaScript variables only interpolate inside backticks (\` \`).",
        fix: "Replace the outer single/double quotes with backticks."
      });
    }

    // Rule 2: Check for scope leak of let variables
    if (sourceCode.includes('let isActive') && sourceCode.includes('if (true)') && sourceCode.lastIndexOf('isActive') > sourceCode.indexOf('}')) {
      issues.push({
        type: 'scope',
        severity: 'warning',
        title: 'Block Scope Issue',
        detail: "Variable 'isActive' is defined using 'let' inside an 'if' block, but you are trying to access it outside of that block.",
        fix: "Use 'var' instead of 'let' if you want block variables to leak out, or declare 'let isActive' globally outside the if wrapper."
      });
    }

    // Rule 3: Check for missing await on fetch .json()
    if (sourceCode.includes('fetch(') && sourceCode.includes('.json()') && !sourceCode.includes('await data.json()') && !sourceCode.includes('await response.json()') && sourceCode.includes('const json =')) {
      issues.push({
        type: 'async',
        severity: 'critical',
        title: 'Missing await on Promise',
        detail: "response.json() returns a Promise. Missing 'await' will cause your function to return a Pending Promise instead of the actual data.",
        fix: "Change 'const json = data.json()' to 'const json = await data.json()'."
      });
    }

    // Rule 4: Check for missing return or accumulator in array reduce
    if (sourceCode.includes('.reduce(') && !sourceCode.includes('return') && !sourceCode.includes('=>')) {
      issues.push({
        type: 'logic',
        severity: 'warning',
        title: 'Reduce Accumulator Risk',
        detail: "Ensure your .reduce() callback function returns the accumulator value on every iteration.",
        fix: "Verify that total + num is implicitly or explicitly returned."
      });
    }

    if (issues.length > 0) {
      setAnalysis({ status: 'issues', list: issues });
    } else {
      setAnalysis({
        status: 'clean',
        title: '✨ Code is Clean!',
        detail: 'We found absolutely no syntax errors, block-scope leaks, or promise tracking mistakes in this snippet. Fantastic job!',
        tip: 'Best Practice: Keep writing modular, well-commented functions to maintain high code readability.'
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Review Details</h1>
        <Link href="/dashboard" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition">
          Return to Dashboard
        </Link>
      </div>

      <p className="text-gray-500 mb-6">Analysis Results for Review Session: <strong className="text-gray-800">#{params.id}</strong></p>

      {/* Show Analyzed Code Snippet */}
      {code && (
        <div className="mb-6">
          <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wider mb-2">Submitted Code:</h3>
          <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-xs max-h-48">
            <code>{code}</code>
          </pre>
        </div>
      )}

      {/* Dynamic Results Display */}
      {analysis && (
        <div className="bg-white p-6 rounded-lg shadow border border-gray-200 space-y-6">
          {analysis.status === 'clean' ? (
            <div className="space-y-4">
              <h3 className="font-semibold text-xl text-green-600 flex items-center gap-2">
                {analysis.title}
              </h3>
              <p className="text-gray-700">{analysis.detail}</p>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                <span className="font-semibold text-green-800 text-sm">💡 Code Reviewer Tip: </span>
                <span className="text-green-700 text-sm">{analysis.tip}</span>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="font-semibold text-xl text-red-600">
                ⚠️ Found {analysis.list.length} Issue(s):
              </h3>
              {analysis.list.map((issue, idx) => (
                <div key={idx} className="border-b border-gray-100 pb-6 last:border-b-0 last:pb-0 space-y-3">
                  <h4 className="font-bold text-gray-800 text-md flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-red-500"></span>
                    {issue.title}
                  </h4>
                  <div className="bg-red-50 border-l-4 border-red-500 p-4 font-mono text-sm text-red-800 rounded">
                    {issue.detail}
                  </div>
                  <div>
                    <h5 className="font-semibold text-sm text-green-700">💡 Recommended Fix:</h5>
                    <p className="text-gray-700 text-sm mt-1">{issue.fix}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}