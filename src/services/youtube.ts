const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const YOUTUBE_API_URL = 'https://www.googleapis.com/youtube/v3';

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnail: string;
  channelTitle: string;
  duration: string;
}

export async function searchKaraokeVideos(query: string): Promise<YouTubeVideo[]> {
  try {
    // First, search for videos
    const searchResponse = await fetch(
      `${YOUTUBE_API_URL}/search?part=snippet&q=${encodeURIComponent(
        query + ' karaoke'
      )}&type=video&videoCategoryId=10&maxResults=10&key=${YOUTUBE_API_KEY}`
    );

    if (!searchResponse.ok) {
      throw new Error('Failed to fetch videos');
    }

    const searchData = await searchResponse.json();
    const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

    // Then, get video details including duration
    const detailsResponse = await fetch(
      `${YOUTUBE_API_URL}/videos?part=contentDetails,snippet&id=${videoIds}&key=${YOUTUBE_API_KEY}`
    );

    if (!detailsResponse.ok) {
      throw new Error('Failed to fetch video details');
    }

    const detailsData = await detailsResponse.json();

    return detailsData.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      thumbnail: item.snippet.thumbnails.medium.url,
      channelTitle: item.snippet.channelTitle,
      duration: formatDuration(item.contentDetails.duration),
    }));
  } catch (error) {
    console.error('Error searching YouTube videos:', error);
    return [];
  }
}

function formatDuration(duration: string): string {
  const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
  
  const hours = (match[1] || '').replace('H', '');
  const minutes = (match[2] || '').replace('M', '');
  const seconds = (match[3] || '').replace('S', '');

  const parts = [];
  
  if (hours) parts.push(hours.padStart(2, '0'));
  parts.push((minutes || '0').padStart(2, '0'));
  parts.push((seconds || '0').padStart(2, '0'));

  return parts.join(':');
} 