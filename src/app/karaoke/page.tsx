'use client';

import { useState } from 'react';
import { searchKaraokeVideos, YouTubeVideo } from '@/services/youtube';
import KaraokePlayer from '@/components/KaraokePlayer';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

export default function KaraokePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    try {
      const results = await searchKaraokeVideos(searchQuery);
      setVideos(results);
    } catch (error) {
      console.error('Error searching videos:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark text-white">
      <div className="container mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left sidebar */}
          <div className="lg:col-span-3 space-y-4">
            <form onSubmit={handleSearch} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Tìm bài hát karaoke..."
                className="w-full bg-secondary text-white rounded-full py-2 pl-10 pr-4 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-light" />
              <button
                type="submit"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-primary text-white px-4 py-1 rounded-full text-sm hover:bg-primary/90"
              >
                Search
              </button>
            </form>

            <nav className="space-y-2">
              <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary transition">
                Tìm kiếm
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary transition">
                Đề xuất/Lịch sử
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary transition">
                Đã chọn (0)
              </button>
              <button className="w-full text-left px-4 py-2 rounded hover:bg-secondary transition">
                Cài đặt
              </button>
            </nav>
          </div>

          {/* Main content */}
          <div className="lg:col-span-9">
            <KaraokePlayer videoId={selectedVideo} />

            {/* Video list */}
            <div className="bg-darkest rounded-lg p-4">
              <h2 className="text-xl font-bold mb-4">Kết quả tìm kiếm</h2>
              {isLoading ? (
                <div className="text-center py-4">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {videos.map((video) => (
                    <div
                      key={video.id}
                      className="flex space-x-4 p-3 rounded-lg hover:bg-secondary transition cursor-pointer"
                      onClick={() => setSelectedVideo(video.id)}
                    >
                      <div className="relative w-40 h-24 flex-shrink-0">
                        <img
                          src={video.thumbnail}
                          alt={video.title}
                          className="w-full h-full object-cover rounded"
                        />
                        <div className="absolute bottom-1 right-1 bg-black bg-opacity-75 text-xs px-1 rounded">
                          {video.duration}
                        </div>
                      </div>
                      <div className="flex-grow">
                        <h3 className="font-semibold line-clamp-2">{video.title}</h3>
                        <p className="text-sm text-light mt-1">{video.channelTitle}</p>
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