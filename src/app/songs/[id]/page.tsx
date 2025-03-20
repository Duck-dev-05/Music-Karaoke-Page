'use client';

import { useState, useEffect, useRef } from 'react';
import { Howl } from 'howler';

// Sample song data - replace with actual data from API
const sampleSong = {
  id: 1,
  title: 'Bohemian Rhapsody',
  artist: 'Queen',
  audioUrl: '/songs/bohemian-rhapsody.mp3',
  lyrics: [
    { time: 0, text: 'Is this the real life?' },
    { time: 3, text: 'Is this just fantasy?' },
    { time: 6, text: 'Caught in a landslide' },
    { time: 9, text: 'No escape from reality' },
    // Add more lyrics as needed
  ],
};

export default function SongPage({ params }: { params: { id: string } }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [currentLyricIndex, setCurrentLyricIndex] = useState(0);
  const [volume, setVolume] = useState(1);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    // Initialize Howler.js sound object
    soundRef.current = new Howl({
      src: [sampleSong.audioUrl],
      html5: true,
      onplay: () => setIsPlaying(true),
      onpause: () => setIsPlaying(false),
      onend: () => {
        setIsPlaying(false);
        setCurrentTime(0);
        setCurrentLyricIndex(0);
      },
    });

    // Update current time
    const interval = setInterval(() => {
      if (soundRef.current) {
        setCurrentTime(soundRef.current.seek() as number);
        
        // Update current lyric
        const newIndex = sampleSong.lyrics.findIndex(
          (lyric, index) => {
            const nextLyric = sampleSong.lyrics[index + 1];
            return currentTime >= lyric.time && (!nextLyric || currentTime < nextLyric.time);
          }
        );
        if (newIndex !== -1) {
          setCurrentLyricIndex(newIndex);
        }
      }
    }, 100);

    return () => {
      clearInterval(interval);
      if (soundRef.current) {
        soundRef.current.unload();
      }
    };
  }, []);

  const togglePlay = () => {
    if (soundRef.current) {
      if (isPlaying) {
        soundRef.current.pause();
      } else {
        soundRef.current.play();
      }
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (soundRef.current) {
      soundRef.current.volume(newVolume);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-2">{sampleSong.title}</h1>
        <p className="text-xl text-gray-600">{sampleSong.artist}</p>
      </div>

      {/* Lyrics Display */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center mb-8">
          <p className="text-2xl font-semibold text-indigo-600">
            {sampleSong.lyrics[currentLyricIndex]?.text}
          </p>
        </div>
        <div className="space-y-4">
          {sampleSong.lyrics.map((lyric, index) => (
            <p
              key={index}
              className={`text-center ${
                index === currentLyricIndex
                  ? 'text-indigo-600 font-semibold text-lg'
                  : 'text-gray-600'
              }`}
            >
              {lyric.text}
            </p>
          ))}
        </div>
      </div>

      {/* Audio Controls */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="flex items-center justify-center space-x-4">
          <button
            onClick={togglePlay}
            className="p-3 rounded-full bg-indigo-600 text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            {isPlaying ? (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            )}
          </button>
          <div className="flex-1">
            <div className="h-1 bg-gray-200 rounded-full">
              <div
                className="h-full bg-indigo-600 rounded-full"
                style={{
                  width: `${(currentTime / (soundRef.current?.duration() || 1)) * 100}%`,
                }}
              />
            </div>
            <div className="flex justify-between text-sm text-gray-500 mt-1">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(soundRef.current?.duration() || 0)}</span>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15.536a5 5 0 001.414 1.414m2.828-9.9a9 9 0 012.828 2.828" />
            </svg>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={volume}
              onChange={handleVolumeChange}
              className="w-24"
            />
          </div>
        </div>
      </div>
    </div>
  );
} 