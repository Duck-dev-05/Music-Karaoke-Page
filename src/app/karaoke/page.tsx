'use client';

import { useState, useRef, useEffect } from 'react';
import { searchKaraokeVideos } from '@/services/youtube';
import { searchSpotifyTracks } from '@/services/spotify';
import { searchMixcloudTracks } from '@/services/mixcloud';
import { searchLocalFiles, addLocalFile } from '@/services/local';
import KaraokePlayer from '@/components/KaraokePlayer';
import MusicSourceSelector from '@/components/MusicSourceSelector';
import { MusicTrack } from '@/services/music-sources';
import { MagnifyingGlassIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline';

export default function KaraokePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSource, setSelectedSource] = useState<string>('youtube');
  const [tracks, setTracks] = useState<MusicTrack[]>([]);
  const [selectedTrack, setSelectedTrack] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    // Optional: Add any initialization logic if needed
  }, []);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      let results: MusicTrack[] = [];

      switch (selectedSource) {
        case 'youtube':
          const youtubeResults = await searchKaraokeVideos(searchQuery);
          results = youtubeResults.map((video: any) => ({
            id: video.id,
            title: video.title,
            artist: video.channelTitle,
            thumbnail: video.thumbnail,
            duration: video.duration,
            source: 'youtube',
            sourceUrl: `https://www.youtube.com/watch?v=${video.id}`
          }));
          break;

        case 'spotify':
          results = await searchSpotifyTracks(searchQuery);
          break;

        case 'mixcloud':
          results = await searchMixcloudTracks(searchQuery);
          break;

        case 'local':
          results = searchLocalFiles(searchQuery);
          break;
      }

      setTracks(results);
    } catch (error) {
      console.error('Error searching tracks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files?.length) return;

    setIsLoading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        await addLocalFile(files[i]);
      }
      // Refresh local file search results
      if (selectedSource === 'local') {
        const results = searchLocalFiles(searchQuery);
        setTracks(results);
      }
    } catch (error) {
      console.error('Error uploading files:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <MusicSourceSelector
              selectedSource={selectedSource}
              onSourceChange={setSelectedSource}
            />

            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài hát karaoke..."
                className="w-full bg-gray-800 text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-full text-sm hover:bg-blue-500"
              >
                Search
              </button>
            </form>

            {selectedSource === 'local' && (
              <div className="text-center">
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept="audio/*"
                  multiple
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-full px-4 py-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition"
                >
                  <ArrowUpTrayIcon className="w-5 h-5 mr-2" />
                  Upload Music Files
                </button>
              </div>
            )}

            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition">
                Tìm kiếm
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition">
                Đề xuất/Lịch sử
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition">
                Đã chọn (0)
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-gray-700 transition">
                Cài đặt
              </button>
            </nav>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            <KaraokePlayer videoId={selectedTrack} />

            {/* Track list */}
            <div className="bg-gray-800 rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Kết quả tìm kiếm</h2>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tracks.map((track) => (
                    <div
                      key={track.id}
                      className="flex space-x-4 p-3 rounded-lg hover:bg-gray-700 transition cursor-pointer"
                      onClick={() => setSelectedTrack(track.id)}
                    >
                      <div className="relative w-40 h-24 flex-shrink-0">
                        <img
                          src={track.thumbnail}
                          alt={track.title}
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-xs px-1 rounded">
                          {track.duration}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold line-clamp-2">{track.title}</h3>
                        <p className="text-sm text-gray-400 mt-1">{track.artist}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 