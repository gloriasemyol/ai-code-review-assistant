import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-3xl mx-auto mt-16 px-6 text-center">
      <h1 className="text-4xl font-bold mb-4">AI Code Review Assistant</h1>
      <p className="text-lg text-gray-600 mb-8">
        Get instant, detailed feedback on your code — bugs, complexity, best practices,
        and auto-generated documentation, powered by static analysis and AI.
      </p>
      <div className="flex justify-center gap-4">
        <Link
          href="/signup"
          className="bg-blue-600 text-white px-6 py-3 rounded font-semibold hover:bg-blue-700"
        >
          Get Started
        </Link>
        <Link
          href="/login"
          className="border border-blue-600 text-blue-600 px-6 py-3 rounded font-semibold hover:bg-blue-50"
        >
          Login
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 text-left">
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-1">Static + AI Analysis</h3>
          <p className="text-sm text-gray-500">ESLint catches syntax issues; AI catches everything else.</p>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-1">Complexity Metrics</h3>
          <p className="text-sm text-gray-500">Cyclomatic complexity, function counts, and more.</p>
        </div>
        <div className="border rounded p-4">
          <h3 className="font-semibold mb-1">Auto Documentation</h3>
          <p className="text-sm text-gray-500">Get clean docs generated for every submission.</p>
        </div>
      </div>
    </div>
  );
}