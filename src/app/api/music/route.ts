import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

interface MusicFile {
  title: string;
  type: string;
  duration: string;
  path: string;
  dateAdded: Date;
  artist?: string;
  imageUrl?: string;
}

interface Collection {
  title: string;
  count: number;
  description: string;
  category: string;
  gradient: string;
  songs: MusicFile[];
}

async function getYouTubeThumbnail(songTitle: string, artist?: string) {
  try {
    const searchQuery = encodeURIComponent(`${artist ? artist + ' - ' : ''}${songTitle} official`);
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${searchQuery}&type=video&maxResults=1&key=${process.env.YOUTUBE_API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error('YouTube API request failed');
    }

    const data = await response.json();
    if (data.items && data.items.length > 0) {
      const thumbnail = data.items[0].snippet.thumbnails;
      // Get the highest quality thumbnail available
      return thumbnail.maxres?.url || 
             thumbnail.high?.url || 
             thumbnail.medium?.url || 
             thumbnail.default?.url;
    }
    return null;
  } catch (error) {
    console.error('Error fetching YouTube thumbnail:', error);
    return null;
  }
}

export async function GET() {
  try {
    const musicDir = path.join(process.cwd(), 'public', 'Music');
    const files = await fs.readdir(musicDir);
    
    const musicFiles: MusicFile[] = await Promise.all(
      files
        .filter(file => file.toLowerCase().endsWith('.mp3'))
        .map(async (file) => {
          const filePath = path.join(musicDir, file);
          const stats = await fs.stat(filePath);
          
          // Extract artist name and title from file name
          let artist: string | undefined;
          let title: string;
          
          if (file.includes(' - ')) {
            [artist, title] = file.replace('.mp3', '').split(' - ').map(s => s.trim());
          } else {
            title = file.replace('.mp3', '').trim();
          }

          // Try to find a matching image file
          let imageUrl: string | undefined;
          const coversDir = path.join(musicDir, 'covers');
          
          try {
            await fs.access(coversDir);
          } catch {
            // If covers directory doesn't exist, create it
            await fs.mkdir(coversDir);
          }

          // Check for song-specific cover image
          const imageExts = ['.jpg', '.jpeg', '.png', '.webp'];
          const imageBaseName = artist ? `${artist} - ${title}` : title;
          
          for (const ext of imageExts) {
            const imagePath = path.join(coversDir, imageBaseName + ext);
            try {
              await fs.access(imagePath);
              imageUrl = `/Music/covers/${imageBaseName}${ext}`;
              break;
            } catch {
              continue;
            }
          }

          // If no song-specific image, try artist image
          if (!imageUrl && artist) {
            for (const ext of imageExts) {
              const artistImagePath = path.join(coversDir, artist + ext);
              try {
                await fs.access(artistImagePath);
                imageUrl = `/Music/covers/${artist}${ext}`;
                break;
              } catch {
                continue;
              }
            }
          }

          // If no local image found, try to get YouTube thumbnail
          if (!imageUrl && process.env.YOUTUBE_API_KEY) {
            const youtubeThumbnail = await getYouTubeThumbnail(title, artist);
            if (youtubeThumbnail) {
              // Download and save the thumbnail
              try {
                const response = await fetch(youtubeThumbnail);
                const buffer = await response.arrayBuffer();
                const thumbnailPath = path.join(coversDir, `${imageBaseName}.jpg`);
                await fs.writeFile(thumbnailPath, Buffer.from(buffer));
                imageUrl = `/Music/covers/${imageBaseName}.jpg`;
              } catch (error) {
                console.error('Error saving YouTube thumbnail:', error);
              }
            }
          }

          // If still no image, try default cover for the song type
          if (!imageUrl) {
            const defaultCovers: { [key: string]: string } = {
              'pop': 'default-pop.jpg',
              'rock': 'default-rock.jpg',
              'jazz': 'default-jazz.jpg',
              'classical': 'default-classical.jpg',
              'electronic': 'default-electronic.jpg',
            };

            const songType = getSongType(title.toLowerCase());
            const defaultCover = defaultCovers[songType] || 'default-music.jpg';
            const defaultCoverPath = path.join(coversDir, defaultCover);

            try {
              await fs.access(defaultCoverPath);
              imageUrl = `/Music/covers/${defaultCover}`;
            } catch {
              // If default cover doesn't exist, leave imageUrl undefined
            }
          }

          return {
            title,
            artist,
            type: getSongType(title.toLowerCase()),
            duration: "0:00", // We'll update this client-side
            path: `/Music/${file}`,
            dateAdded: stats.mtime,
            imageUrl
          };
        })
    );

    // Sort by date added, newest first
    musicFiles.sort((a, b) => b.dateAdded.getTime() - a.dateAdded.getTime());

    // Group into collections
    const collections: Collection[] = [
      {
        title: 'Recent Additions',
        count: Math.min(musicFiles.length, 6),
        description: 'Recently added songs to your library',
        category: 'recent',
        gradient: 'from-purple-500 to-blue-500',
        songs: musicFiles.slice(0, 6)
      },
      {
        title: 'Popular Songs',
        count: Math.min(musicFiles.length, 8),
        description: 'Most played songs in your library',
        category: 'popular',
        gradient: 'from-pink-500 to-rose-500',
        songs: [...musicFiles].sort(() => Math.random() - 0.5).slice(0, 8) // Randomly selected for now
      },
      {
        title: 'All Songs',
        count: musicFiles.length,
        description: 'All songs in your library',
        category: 'all',
        gradient: 'from-green-500 to-emerald-500',
        songs: musicFiles
      }
    ];

    return NextResponse.json({
      success: true,
      collections
    });
  } catch (error) {
    console.error('Error reading music files:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to read music files'
    });
  }
}

function getSongType(title: string): string {
  const types = {
    pop: ['pop', 'dance', 'disco'],
    rock: ['rock', 'metal', 'punk', 'guitar'],
    jazz: ['jazz', 'blues', 'swing'],
    classical: ['classical', 'orchestra', 'symphony', 'piano'],
    electronic: ['electronic', 'edm', 'techno', 'house', 'remix'],
    hiphop: ['hip hop', 'rap', 'trap'],
    acoustic: ['acoustic', 'unplugged'],
    indie: ['indie', 'alternative'],
    rnb: ['rnb', 'r&b', 'soul'],
    kpop: ['kpop', 'k-pop'],
    jpop: ['jpop', 'j-pop'],
  };

  for (const [type, keywords] of Object.entries(types)) {
    if (keywords.some(keyword => title.includes(keyword))) {
      return type;
    }
  }

  return 'Other';
} 