export interface MusicTrack {
  id: string;
  title: string;
  artist: string;
  thumbnail: string;
  duration: string;
  source: 'youtube' | 'spotify' | 'mixcloud' | 'local';
  sourceUrl?: string;
}

export interface MusicSource {
  name: string;
  icon: string;
  color: string;
}

export interface SearchResult {
  tracks: MusicTrack[];
  nextPageToken?: string;
}

export const musicSources: MusicSource[] = [
  {
    name: 'Local',
    icon: 'M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v10.303m0 0v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 01-.99-3.467l2.31-.66A2.25 2.25 0 009 15.553z',
    color: 'bg-blue-500'
  },
  {
    name: 'Spotify',
    icon: 'M12 8.75a3.25 3.25 0 1 0 0 6.5 3.25 3.25 0 0 0 0-6.5ZM7.25 12a4.75 4.75 0 1 1 9.5 0 4.75 4.75 0 0 1-9.5 0Zm1.077-.573a.5.5 0 0 1 .223-.673C10.82 9.766 14.635 9.764 16.9 10.75a.5.5 0 1 1-.4.916c-2.017-.875-5.507-.873-7.951.085a.5.5 0 0 1-.673-.224Zm-.224 2.676a.5.5 0 0 1 .224-.672c1.657-.724 4.536-.727 6.197-.002a.5.5 0 0 1-.398.918c-1.353-.593-3.892-.59-5.35.084a.5.5 0 0 1-.673-.224Zm-1.8-4.597a.5.5 0 0 1 .224-.673c2.54-1.112 6.89-1.11 9.429.002a.5.5 0 0 1-.4.916c-2.27-.99-6.289-.992-8.58-.021a.5.5 0 0 1-.673-.224Z',
    color: 'bg-green-500'
  },
  {
    name: 'Mixcloud',
    icon: 'M8.5 4.5a3.5 3.5 0 1 1 7 0v9a3.5 3.5 0 1 1-7 0v-9ZM6 12a.75.75 0 0 1 .75-.75h.5a.75.75 0 0 1 0 1.5h-.5A.75.75 0 0 1 6 12Zm2.75-1.75a.75.75 0 0 0 0 1.5h.5a.75.75 0 0 0 0-1.5h-.5Z',
    color: 'bg-purple-500'
  },
  {
    name: 'YouTube',
    icon: 'M21.582,6.186c-0.23-0.86-0.908-1.538-1.768-1.768C18.254,4,12,4,12,4S5.746,4,4.186,4.418 c-0.86,0.23-1.538,0.908-1.768,1.768C2,7.746,2,12,2,12s0,4.254,0.418,5.814c0.23,0.86,0.908,1.538,1.768,1.768 C5.746,20,12,20,12,20s6.254,0,7.814-0.418c0.861-0.23,1.538-0.908,1.768-1.768C22,16.254,22,12,22,12S22,7.746,21.582,6.186z M10,15.464V8.536L16,12L10,15.464z',
    color: 'bg-red-500'
  }
]; 