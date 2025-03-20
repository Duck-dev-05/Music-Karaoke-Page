import React from 'react';
import Navbar from './components/Navbar';
import './page.css';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const Page = () => {
  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="text-center py-20 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg">
        <h1 className="text-4xl md:text-6xl font-bold mb-6">
          Welcome to Music Karaoke
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Sing along to your favorite songs with synchronized lyrics
        </p>
        <Link
          href="/songs"
          className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-gray-100 transition-colors"
        >
          Start Singing
        </Link>
      </section>

      {/* Featured Songs Section */}
      <section>
        <h2 className="text-3xl font-bold mb-8">Featured Songs</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sample featured songs - replace with actual data */}
          {[1, 2, 3].map((song) => (
            <div
              key={song}
              className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="aspect-w-16 aspect-h-9 bg-gray-200"></div>
              <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">Song Title {song}</h3>
                <p className="text-gray-600 mb-4">Artist Name</p>
                <Link
                  href={`/songs/${song}`}
                  className="inline-block bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
                >
                  Sing Now
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Features Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🎵</div>
          <h3 className="text-xl font-semibold mb-2">Large Song Library</h3>
          <p className="text-gray-600">
            Access thousands of songs with synchronized lyrics
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">📱</div>
          <h3 className="text-xl font-semibold mb-2">Create Playlists</h3>
          <p className="text-gray-600">
            Save your favorite songs and create custom playlists
          </p>
        </div>
        <div className="text-center p-6 bg-white rounded-lg shadow-md">
          <div className="text-4xl mb-4">🎤</div>
          <h3 className="text-xl font-semibold mb-2">Karaoke Mode</h3>
          <p className="text-gray-600">
            Follow along with highlighted lyrics as you sing
          </p>
        </div>
      </section>
    </div>
  );
};

export default Page;
