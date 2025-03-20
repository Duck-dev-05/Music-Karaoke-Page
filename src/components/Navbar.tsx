'use client';

import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useState } from 'react';

export default function Navbar() {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex">
            <Link href="/" className="flex items-center">
              <span className="text-xl font-bold text-indigo-600">Music Karaoke</span>
            </Link>
            <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
              <Link href="/karaoke" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500">
                Karaoke
              </Link>
              <Link href="/songs" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500">
                Songs
              </Link>
              <Link href="/playlists" className="text-gray-900 inline-flex items-center px-1 pt-1 border-b-2 border-transparent hover:border-indigo-500">
                Playlists
              </Link>
            </div>
          </div>
          <div className="hidden sm:ml-6 sm:flex sm:items-center">
            {session ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">{session.user?.email}</span>
                <button
                  onClick={() => signOut()}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sign Out
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  href="/login"
                  className="text-gray-700 hover:text-indigo-600"
                >
                  Login
                </Link>
                <Link
                  href="/register"
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Register
                </Link>
              </div>
            )}
          </div>
          <div className="flex items-center sm:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? 'hidden' : 'block'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
              <svg
                className={`${isMenuOpen ? 'block' : 'hidden'} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? 'block' : 'hidden'} sm:hidden`}>
        <div className="pt-2 pb-3 space-y-1">
          <Link
            href="/karaoke"
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-indigo-500"
          >
            Karaoke
          </Link>
          <Link
            href="/songs"
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-indigo-500"
          >
            Songs
          </Link>
          <Link
            href="/playlists"
            className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-indigo-500"
          >
            Playlists
          </Link>
          {session ? (
            <>
              <div className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700">
                {session.user?.email}
              </div>
              <button
                onClick={() => signOut()}
                className="block w-full text-left pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-indigo-500"
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-indigo-500"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="block pl-3 pr-4 py-2 border-l-4 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 hover:border-indigo-500"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
} 