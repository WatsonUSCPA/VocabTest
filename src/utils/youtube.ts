export interface YouTubeInfo {
  title: string;
  thumbnail: string;
  description: string;
  duration?: string;
  channelTitle?: string;
  publishedAt?: string;
  viewCount?: string;
}

// YouTube Data API v3を使用して動画情報を取得
export const getYouTubeInfo = async (videoId: string): Promise<YouTubeInfo | null> => {
  console.log(`Fetching YouTube info for video: ${videoId}`);
  
  // APIキーが必要な場合は環境変数から取得
  const API_KEY = process.env.REACT_APP_YOUTUBE_API_KEY;
  
  if (!API_KEY) {
    console.log('No YouTube API key found, using fallback method');
    return null;
  }
  
  try {
    const url = `https://www.googleapis.com/youtube/v3/videos?id=${videoId}&key=${API_KEY}&part=snippet,statistics`;
    console.log(`Fetching from YouTube Data API: ${url}`);
    
    const response = await fetch(url);
    console.log(`Response status: ${response.status}`);
    console.log(`Response ok: ${response.ok}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('YouTube Data API response:', data);
      
      if (data.items && data.items.length > 0) {
        const video = data.items[0];
        const snippet = video.snippet;
        const statistics = video.statistics;
        
        const info: YouTubeInfo = {
          title: snippet.title,
          thumbnail: snippet.thumbnails?.maxres?.url || snippet.thumbnails?.high?.url || snippet.thumbnails?.medium?.url || snippet.thumbnails?.default?.url || '',
          description: snippet.channelTitle || '',
          channelTitle: snippet.channelTitle,
          publishedAt: snippet.publishedAt,
          viewCount: statistics?.viewCount
        };
        
        console.log('Processed YouTube info:', info);
        return info;
      } else {
        console.log('No video found with this ID');
      }
    } else {
      console.error('YouTube API response not ok:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching YouTube info:', error);
  }
  
  return null;
};

// YouTube oEmbed APIを使用して動画情報を取得（CORS問題のため使用しない）
export const getYouTubeInfoOEmbed = async (videoId: string): Promise<YouTubeInfo | null> => {
  console.log(`Fetching YouTube info via oEmbed for video: ${videoId}`);
  
  try {
    const url = `https://www.youtube.com/oembed?url=https://www.youtube.com/watch?v=${videoId}&format=json`;
    console.log(`Fetching from: ${url}`);
    
    const response = await fetch(url);
    console.log(`Response status: ${response.status}`);
    console.log(`Response ok: ${response.ok}`);
    
    if (response.ok) {
      const data = await response.json();
      console.log('YouTube oEmbed data received:', data);
      
      const info = {
        title: data.title,
        thumbnail: data.thumbnail_url,
        description: data.author_name || '',
      };
      
      console.log('Processed YouTube oEmbed info:', info);
      return info;
    } else {
      console.error('YouTube oEmbed API response not ok:', response.status, response.statusText);
    }
  } catch (error) {
    console.error('Error fetching YouTube oEmbed info:', error);
  }
  
  return null;
};

// 直接YouTubeサムネイルURLを生成（CORS問題を回避）
export const getYouTubeThumbnail = (videoId: string): string => {
  // 高解像度サムネイルを優先、失敗時は標準解像度にフォールバック
  return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
};

// 標準解像度サムネイルURL
export const getStandardThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
};

// 中解像度サムネイルURL
export const getMediumThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`;
};

// 低解像度サムネイルURL
export const getLowThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/sddefault.jpg`;
};

// デフォルトサムネイルURL（最も確実）
export const getDefaultThumbnail = (videoId: string): string => {
  return `https://img.youtube.com/vi/${videoId}/default.jpg`;
};

// サムネイルURLを高解像度に変換
export const getHighResThumbnail = (thumbnailUrl: string): string => {
  // デフォルトのサムネイルURLを高解像度版に変換
  return thumbnailUrl.replace('default.jpg', 'maxresdefault.jpg');
};

// フォールバック用のサムネイルURLを生成
export const getFallbackThumbnail = (videoId: string): string => {
  const fallbackUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  console.log(`Using fallback thumbnail: ${fallbackUrl}`);
  return fallbackUrl;
}; 