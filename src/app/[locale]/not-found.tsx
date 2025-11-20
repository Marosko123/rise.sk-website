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

        {/* Error Message - Bilingual */}
        <h2 className="text-3xl font-bold mb-2">
          Stránka nenájdená
        </h2>
        <h3 className="text-xl text-gray-500 mb-6">
          Page Not Found
        </h3>

        <p className="text-lg text-gray-300 mb-8">
          Stránka, ktorú hľadáte, mohla byť presunutá, odstránená alebo neexistuje.
          <br />
          <span className="text-sm text-gray-500 mt-2 block">
            The page you are looking for might have been moved, deleted, or doesn&apos;t exist.
          </span>
        </p>

        {/* Quick Links */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <Link
            href="/"
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            🏠 Domov / Home
          </Link>
          <Link
            href="/sluzby"
            className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-700 hover:to-teal-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            💻 Služby / Services
          </Link>
          <Link
            href="/portfolio"
            className="bg-gradient-to-r from-orange-600 to-red-600 hover:from-orange-700 hover:to-red-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            ⚙️ Portfólio
          </Link>
          <Link
            href="/kontakt"
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-6 py-3 rounded-lg font-semibold transition-all duration-200 transform hover:scale-105"
          >
            📞 Kontakt / Contact
          </Link>
        </div>

        {/* Search Suggestions */}
        <div className="text-left bg-gray-900 rounded-lg p-6">
          <h3 className="text-xl font-semibold mb-4 text-center">
            Hľadáte niečo konkrétne?
          </h3>
          <ul className="space-y-2 text-gray-300">
            <li>
              <Link href="/sluzby/softver-na-mieru" className="hover:text-yellow-400 transition-colors">
                → Vývoj softvéru na mieru
              </Link>
            </li>
            <li>
              <Link href="/sluzby/tvorba-web-stranok" className="hover:text-yellow-400 transition-colors">
                → Tvorba web stránok
              </Link>
            </li>
            <li>
              <Link href="/sluzby/vyvoj-mobilnych-aplikacii" className="hover:text-yellow-400 transition-colors">
                → Mobilné aplikácie
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Info */}
        <div className="mt-8 pt-6 border-t border-gray-700 text-gray-400">
          <p>Potrebujete pomoc? / Need help?</p>
          <p className="font-semibold text-white">
            📧 rise@rise.sk | 📞 +421-911-670-188
          </p>
        </div>
      </div>
    </div>
  );
}
