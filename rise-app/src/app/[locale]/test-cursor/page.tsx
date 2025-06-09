'use client';

import Link from 'next/link';

export default function TestCursor() {

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-center">
            Cursor Test Page
          </h1>

          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Navigation Test</h2>
              <p className="mb-4">
                This page tests if the enhanced cursor works across route changes.
              </p>
              <Link
                href="/"
                data-cursor="link"
                className="inline-block bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
              >
                ← Back to Home
              </Link>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Interactive Elements Test</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                <button
                  data-cursor="button"
                  className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded transition-colors"
                >
                  Test Button
                </button>

                <div
                  data-cursor="card"
                  className="bg-purple-600/20 border border-purple-500/30 p-4 rounded cursor-pointer hover:bg-purple-600/30 transition-colors"
                >
                  Hover Card
                </div>

                <input
                  type="text"
                  data-cursor="text"
                  placeholder="Type here..."
                  className="bg-white/10 border border-white/20 px-4 py-2 rounded text-white placeholder-gray-400"
                />

                <div
                  data-cursor="hover"
                  className="bg-green-600/20 border border-green-500/30 p-4 rounded cursor-pointer hover:bg-green-600/30 transition-colors"
                >
                  Special Hover Effect
                </div>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Link Tests</h2>
              <div className="space-y-4">
                <Link
                  href="/test-email"
                  data-cursor="link"
                  className="block text-blue-400 hover:text-blue-300 underline"
                >
                  Test Email Page
                </Link>

                <a
                  href="https://example.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-cursor="link"
                  className="block text-green-400 hover:text-green-300 underline"
                >
                  External Link
                </a>
              </div>
            </div>

            <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
              <h2 className="text-2xl font-semibold mb-4">Image and Media Test</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  data-cursor="image"
                  className="bg-yellow-600/20 border border-yellow-500/30 p-8 rounded text-center cursor-pointer hover:bg-yellow-600/30 transition-colors"
                >
                  📸 Fake Image Element
                </div>

                <div
                  data-cursor="video"
                  className="bg-pink-600/20 border border-pink-500/30 p-8 rounded text-center cursor-pointer hover:bg-pink-600/30 transition-colors"
                >
                  ▶️ Fake Video Element
                </div>
              </div>
            </div>

            <div className="text-center">
              <p className="text-gray-400">
                Move your mouse around to test the enhanced cursor functionality.
                The cursor should remain visible and interactive on this page.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
