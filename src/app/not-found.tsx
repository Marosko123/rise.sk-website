import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';

export const metadata: Metadata = {
  title: '404 - Page Not Found | Rise.sk',
  description: 'The page you are looking for could not be found. Explore our software development services, programming teams, and IT solutions.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto px-6">
        {/* Logo */}
        <div className="mb-8">
          <Image
            src="/rise/bronze/Rise_logo_circle.png"
            alt="Rise.sk"
            width={80}
            height={80}
            className="w-20 h-20 mx-auto rounded-full"
          />
        </div>

        {/* Error Code */}
        <h1 className="text-8xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500 mb-4">
          404
        </h1>

        {/* Error Message */}
        <h2 className="text-3xl font-bold mb-4">
          Page Not Found
        </h2>

        <p className="text-lg text-gray-300 mb-8">
          The page you are looking for might have been moved, deleted, or doesn&apos;t exist.
          Let&apos;s get you back on track with our professional software development services.
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/en"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            🏠 Go Home
          </Link>
          <Link
            href="/en/development"
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            💻 Development Services
          </Link>
          <Link
            href="/en/services"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            ⚙️ IT Services
          </Link>
          <Link
            href="/en/contact"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            📞 Contact Us
          </Link>
        </div>

        {/* Search Suggestions */}
        <div className="text-left bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Looking for something specific?
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/en/development" className="hover:text-yellow-400 transition-colors">
                → Custom Software Development
              </Link>
            </li>
            <li>
              <Link href="/en/services" className="hover:text-yellow-400 transition-colors">
                → Web & Mobile App Development
              </Link>
            </li>
            <li>
              <Link href="/en/portfolio" className="hover:text-yellow-400 transition-colors">
                → Portfolio & Case Studies
              </Link>
            </li>
            <li>
              <Link href="/sk" className="hover:text-yellow-400 transition-colors">
                → Slovenská verzia / Slovak Version
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-gray-400">
          <p>Need immediate assistance?</p>
          <p className="font-semibold text-white">
            📧 rise@rise.sk | 📞 +421-911-670-188
          </p>
        </div>
      </div>
    </div>
  );
}
