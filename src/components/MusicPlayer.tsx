import { useEffect, useRef, useState } from 'react';
import { Card } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import {
  PlayIcon,
  PauseIcon,
  SpeakerWaveIcon,
  SpeakerXMarkIcon,
  ForwardIcon,
  BackwardIcon,
} from '@heroicons/react/24/outline';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface MusicPlayerProps {
  currentSong: {
    title: string;
    path: string;
    artist?: string;
  } | null;
  onClose: () => void;
  autoPlay?: boolean;
  onDurationChange?: (duration: string) => void;
}

export function MusicPlayer({ currentSong, onClose, autoPlay = false, onDurationChange }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [isMuted, setIsMuted] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const fadeInterval = useRef<NodeJS.Timeout>();

  // Handle autoplay when song changes
  useEffect(() => {
    if (currentSong && autoPlay) {
      setIsLoading(true);
      if (audioRef.current) {
        // Fade out current audio if playing
        if (isPlaying) {
          handleFadeOut();
        }
        
        audioRef.current.src = currentSong.path;
        audioRef.current.volume = 0;
        
        // Start loading the audio
        audioRef.current.load();
        const playPromise = audioRef.current.play();
        
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
              handleFadeIn();
              setIsLoading(false);
            })
            .catch((error) => {
              console.error('Error playing audio:', error);
              setIsLoading(false);
            });
        }
      }
    }
  }, [currentSong, autoPlay]);

  // Smooth visibility transition
  useEffect(() => {
    if (currentSong) {
      setIsVisible(true);
    } else {
      handleFadeOut();
    }
  }, [currentSong]);

  // Handle volume changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  const handleFadeIn = () => {
    if (audioRef.current) {
      let currentVol = 0;
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      
      fadeInterval.current = setInterval(() => {
        currentVol = Math.min(currentVol + 0.1, volume);
        if (audioRef.current) {
          audioRef.current.volume = currentVol;
        }
        if (currentVol >= volume) {
          if (fadeInterval.current) clearInterval(fadeInterval.current);
        }
      }, 50);
    }
  };

  const handleFadeOut = () => {
    if (audioRef.current) {
      let currentVol = audioRef.current.volume;
      if (fadeInterval.current) clearInterval(fadeInterval.current);
      
      fadeInterval.current = setInterval(() => {
        currentVol = Math.max(currentVol - 0.1, 0);
        if (audioRef.current) {
          audioRef.current.volume = currentVol;
        }
        if (currentVol <= 0) {
          if (fadeInterval.current) clearInterval(fadeInterval.current);
          if (audioRef.current) {
            audioRef.current.pause();
          }
          setIsPlaying(false);
          if (!currentSong) {
            setIsVisible(false);
            setTimeout(onClose, 300); // Wait for fade out animation
          }
        }
      }, 50);
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration);
      audio.volume = 0; // Start at 0 volume for fade in
      if (onDurationChange) {
        onDurationChange(formatTime(audio.duration));
      }
    };

    const handleEnded = () => {
      handleFadeOut();
      setTimeout(onClose, 500); // Close after fade out
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [onClose, onDurationChange]);

  const togglePlay = async () => {
    if (audioRef.current) {
      if (isPlaying) {
        handleFadeOut();
      } else {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          handleFadeIn();
        } catch (error) {
          console.error('Error playing audio:', error);
        }
      }
    }
  };

  const handleProgressChange = (value: number[]) => {
    if (audioRef.current) {
      const newTime = value[0];
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (value: number[]) => {
    const newVolume = value[0];
    setVolume(newVolume);
    setIsMuted(newVolume === 0);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const seek = (seconds: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = Math.max(0, Math.min(audioRef.current.currentTime + seconds, duration));
    }
  };

  if (!currentSong) return null;

  return (
    <Card 
      className={cn(
        "fixed bottom-0 left-0 right-0 p-4 bg-background/95 backdrop-blur-sm border-t z-50 transition-all duration-300",
        isVisible ? "translate-y-0 opacity-100" : "translate-y-full opacity-0"
      )}
    >
      <audio ref={audioRef} preload="auto" />
      <div className="container mx-auto flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-medium truncate">{currentSong.title}</h3>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => seek(-10)}
              >
                <BackwardIcon className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={togglePlay}
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="h-4 w-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                ) : isPlaying ? (
                  <PauseIcon className="h-5 w-5" />
                ) : (
                  <PlayIcon className="h-5 w-5" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => seek(10)}
              >
                <ForwardIcon className="h-4 w-4" />
              </Button>
            </div>
            <div className="flex-1 flex items-center gap-2">
              <span className="text-sm text-muted-foreground min-w-[40px]">
                {formatTime(currentTime)}
              </span>
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleProgressChange}
                className="flex-1"
              />
              <span className="text-sm text-muted-foreground min-w-[40px]">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2 min-w-[140px]">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8"
            onClick={toggleMute}
          >
            {isMuted || volume === 0 ? (
              <SpeakerXMarkIcon className="h-5 w-5" />
            ) : (
              <SpeakerWaveIcon className="h-5 w-5" />
            )}
          </Button>
          <Slider
            value={[isMuted ? 0 : volume]}
            max={1}
            step={0.01}
            onValueChange={handleVolumeChange}
            className="w-24"
          />
        </div>
      </div>
    </Card>
  );
} 