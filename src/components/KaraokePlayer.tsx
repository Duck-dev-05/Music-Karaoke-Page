'use client';

import { useState, useRef, useEffect } from 'react';
import { PlayIcon, PauseIcon, SpeakerWaveIcon, SpeakerXMarkIcon } from '@heroicons/react/24/solid';

interface KaraokePlayerProps {
  videoId?: string;
}

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function KaraokePlayer({ videoId }: KaraokePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(100);
  
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = 'https://www.youtube.com/iframe_api';
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Initialize player when API is ready
    window.onYouTubeIframeAPIReady = () => {
      if (playerContainerRef.current && videoId) {
        playerRef.current = new window.YT.Player(playerContainerRef.current, {
          height: '360',
          width: '640',
          videoId: videoId,
          playerVars: {
            controls: 0,
            disablekb: 1,
            fs: 0,
            rel: 0,
          },
          events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
          },
        });
      }
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videoId]);

  const onPlayerReady = (event: any) => {
    setDuration(event.target.getDuration());
    updateTime();
  };

  const onPlayerStateChange = (event: any) => {
    setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
  };

  const updateTime = () => {
    if (playerRef.current) {
      setCurrentTime(playerRef.current.getCurrentTime());
      requestAnimationFrame(updateTime);
    }
  };

  const togglePlay = () => {
    if (playerRef.current) {
      if (isPlaying) {
        playerRef.current.pauseVideo();
      } else {
        playerRef.current.playVideo();
      }
    }
  };

  const toggleMute = () => {
    if (playerRef.current) {
      if (isMuted) {
        playerRef.current.unMute();
        playerRef.current.setVolume(volume);
      } else {
        playerRef.current.mute();
      }
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseInt(e.target.value);
    setVolume(newVolume);
    if (playerRef.current) {
      playerRef.current.setVolume(newVolume);
    }
  };

  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (playerRef.current && duration > 0) {
      const rect = e.currentTarget.getBoundingClientRect();
      const percent = (e.clientX - rect.left) / rect.width;
      const newTime = percent * duration;
      playerRef.current.seekTo(newTime);
      setCurrentTime(newTime);
    }
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!videoId) {
    return (
      <div className="bg-darkest rounded-lg p-6 mb-6 text-center">
        <p className="text-light">Select a karaoke song to start singing</p>
      </div>
    );
  }

  return (
    <div className="bg-darkest rounded-lg p-6 mb-6">
      {/* Video player */}
      <div className="aspect-video bg-black rounded-lg mb-4">
        <div ref={playerContainerRef} />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Progress bar */}
        <div
          className="h-2 bg-secondary rounded-full cursor-pointer"
          onClick={handleProgressBarClick}
        >
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${(currentTime / duration) * 100}%` }}
          />
        </div>

        {/* Time display */}
        <div className="flex justify-between text-sm text-light">
          <span>{formatTime(currentTime)}</span>
          <span>{formatTime(duration)}</span>
        </div>

        {/* Control buttons */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={togglePlay}
              className="p-2 rounded-full hover:bg-secondary transition"
            >
              {isPlaying ? (
                <PauseIcon className="w-8 h-8" />
              ) : (
                <PlayIcon className="w-8 h-8" />
              )}
            </button>

            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="p-2 rounded-full hover:bg-secondary transition"
              >
                {isMuted ? (
                  <SpeakerXMarkIcon className="w-6 h-6" />
                ) : (
                  <SpeakerWaveIcon className="w-6 h-6" />
                )}
              </button>
              <input
                type="range"
                min="0"
                max="100"
                value={volume}
                onChange={handleVolumeChange}
                className="w-24"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 