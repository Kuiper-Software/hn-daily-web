import { Episode } from '../types';

export interface RSSChannel {
  title: string;
  description: string;
  episodes: Episode[];
  image: string;
}

export function parseRSSFeed(xmlText: string): RSSChannel {
  try {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
    
    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error('Invalid XML format');
    }

    const channel = xmlDoc.querySelector('channel');
    if (!channel) {
      throw new Error('Invalid RSS feed: No channel element found');
    }

    const title = getElementText(channel, 'title') || 'Unknown Podcast';
    const description = getElementText(channel, 'description') || '';
    const image = getElementText(channel, 'itunes:image') || getElementText(channel, 'image') || '';
    const items = Array.from(channel.querySelectorAll('item'));
    const episodes: Episode[] = items.map((item, index) => parseEpisode(item, index, image));

    return {
      title,
      description,
      image,
      episodes: episodes.filter(episode => episode.audioUrl), // Only include episodes with audio
    };
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
    throw new Error('Failed to parse RSS feed');
  }
}

function parseEpisode(item: Element, index: number, backupImage: string): Episode {
  console.log(item)
  const title = getElementText(item, 'title') || `Episode ${index + 1}`;
  const description = getElementText(item, 'description') || getElementText(item, 'itunes:summary') || '';
  const pubDate = getElementText(item, 'pubDate');
  // Get audio URL from enclosure or media:content
  let audioUrl = '';
  const enclosure = item.querySelector('enclosure[type*="audio"]');
  if (enclosure) {
    audioUrl = enclosure.getAttribute('url') || '';
  } else {
    const mediaContent = item.querySelector('media\\:content[type*="audio"], content[type*="audio"]');
    if (mediaContent) {
      audioUrl = mediaContent.getAttribute('url') || '';
    }
  }

  // Get duration from iTunes or other sources
  let duration = 0;
  let itunesDuration = ""
  try {
    itunesDuration = getElementText(item, 'itunes:duration');
  } catch (error) {
    console.error('Error parsing duration:', error);
  }
  if (itunesDuration) {
    duration = parseDuration(itunesDuration);
  }

  // Get thumbnail/artwork
  let thumbnail = '';
  const itunesImage = item.querySelector('itunes\\:image, image');

  if (itunesImage) {
    thumbnail = itunesImage.getAttribute('href') || itunesImage.getAttribute('url') || '';
  }
  if(!thumbnail) {
    thumbnail = backupImage;
  }
  // Parse episode number if available
  const episodeNumber = parseInt(getElementText(item, 'itunes:episode') || '0', 10) || undefined;
  const season = parseInt(getElementText(item, 'itunes:season') || '0', 10) || undefined;
  console.log(thumbnail);
  return {
    id: generateEpisodeId(title, pubDate),
    title: cleanText(title),
    description: cleanText(description),
    audioUrl,
    duration,
    publishDate: parseDate(pubDate),
    thumbnail,
    episodeNumber,
    season,
  };
}

function getElementText(parent: Element, tagName: string): string {
  
  let element:Element | null = null
  try {
    element = parent.querySelector(tagName);
  } catch (error) {
    console.error('Error parsing element:', error);
  }

  if(!element) {
    try {
      element = parent.getElementsByTagName(tagName).item(0);
    } catch (error) {
      console.error('Error parsing element:', error);
    }
  }
  let text = element?.textContent?.trim() || '';
  if(!text && element) {
    text = element.getAttribute('href') || text;
  }
  return text;
}


function cleanText(text: string): string {
  // Remove HTML tags and decode entities
  const div = document.createElement('div');
  div.innerHTML = text;
  return div.textContent || div.innerText || '';
}

function parseDate(dateString: string): Date {
  if (!dateString) return new Date();
  
  const date = new Date(dateString);
  return isNaN(date.getTime()) ? new Date() : date;
}

function parseDuration(durationString: string): number {
  if (!durationString) return 0;
  
  // Handle HH:MM:SS or MM:SS format
  const parts = durationString.split(':').map(part => parseInt(part, 10));
  
  if (parts.length === 3) {
    // HH:MM:SS
    return parts[0] * 3600 + parts[1] * 60 + parts[2];
  } else if (parts.length === 2) {
    // MM:SS
    return parts[0] * 60 + parts[1];
  } else if (parts.length === 1) {
    // Just seconds
    return parts[0];
  }
  
  return 0;
}

function generateEpisodeId(title: string, pubDate: string): string {
  // Create a simple hash-like ID from title and publish date
  const combined = `${title}-${pubDate}`;
  let hash = 0;
  for (let i = 0; i < combined.length; i++) {
    const char = combined.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

export async function fetchRSSFeed(url: string): Promise<RSSChannel> {
  try {
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch RSS feed: ${response.statusText}`);
    }
    
    const xmlText = await response.text();
    console.log(xmlText);
    if (!xmlText) {
      throw new Error('Empty RSS feed response');
    }
    
    return parseRSSFeed(xmlText);
  } catch (error) {
    console.error('Error fetching RSS feed:', error);
    throw new Error('Failed to fetch RSS feed. Please check the URL and try again.');
  }
} 