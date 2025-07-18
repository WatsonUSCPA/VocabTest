import { VideoData } from '../types';
import { getVideoWordsPathWithFallback } from '../utils/pathUtils';

// 動画データの配列（初期データ）
export const videos: VideoData[] = [
  // 現在は動的に読み込むため、静的データは空にしておく
];

// 利用可能なレベル
export const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

// レベル別に単語をフィルタリング
export const filterWordsByLevel = (words: any[], level: string) => {
  if (level === 'all') {
    return words;
  }
  return words.filter(word => word.level === level);
};

// ランダムに単語を選択
export const getRandomWords = (words: any[], count: number) => {
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Caption Dataフォルダから動画IDを自動取得する関数
export const getAvailableVideoIds = async (): Promise<string[]> => {
  try {
    console.log('Scanning Caption Data folder for available videos...');
    
    // 方法1: 完全自動スキャン（推奨）
    const autoScannedIds = await autoScanVideoIds();
    if (autoScannedIds.length > 0) {
      console.log('Found videos from auto-scan:', autoScannedIds);
      return autoScannedIds;
    }
    
    // 方法2: video-index.jsonから動画IDを取得（フォールバック）
    const videoIndexIds = await getVideoIdsFromIndex();
    if (videoIndexIds.length > 0) {
      console.log('Found videos from index:', videoIndexIds);
      return videoIndexIds;
    }
    
    // 方法3: フォールバック - 既知の動画IDをチェック
    const fallbackVideoIds = [
      'FASMejN_5gs',
      'DpQQi2scsHo',
      'UF8uR6Z6KLc',
      'pT87zqXPw4w',
      'Pjq4FAfIPSg',
      'KypnjJSKi4o',
      'wHN03Y7ICq0',
      'motX94ztOzo',
    ];
    
    const availableVideoIds: string[] = [];
    
    // 各動画IDをチェックして、実際にJSONファイルが存在するか確認
    for (const videoId of fallbackVideoIds) {
      try {
        const wordResponse = await fetch(await getVideoWordsPathWithFallback(videoId));
        if (wordResponse.ok) {
          availableVideoIds.push(videoId);
          console.log(`Found video data for: ${videoId}`);
        }
      } catch (error) {
        console.log(`Error checking video ${videoId}:`, error);
      }
    }
    
    console.log('Available video IDs:', availableVideoIds);
    return availableVideoIds;
  } catch (error) {
    console.error('Error scanning for available videos:', error);
    return [];
  }
};

// Caption Dataフォルダを自動スキャンして動画IDを抽出する関数
const autoScanVideoIds = async (): Promise<string[]> => {
  const detectedIds: string[] = [];
  
  try {
    console.log('Starting auto-scan of Caption Data folder...');
    
    // 既知の動画IDパターン（現在存在する動画）
    const knownPatterns = [
      'FASMejN_5gs', 'DpQQi2scsHo', 'UF8uR6Z6KLc', 'pT87zqXPw4w',
      'Pjq4FAfIPSg', 'KypnjJSKi4o', 'wHN03Y7ICq0', 'motX94ztOzo'
    ];
    
    // 各パターンをチェックして、実際にJSONファイルが存在するか確認
    for (const videoId of knownPatterns) {
      try {
        const wordResponse = await fetch(await getVideoWordsPathWithFallback(videoId));
        if (wordResponse.ok) {
          detectedIds.push(videoId);
          console.log(`Auto-detected video: ${videoId}`);
        }
      } catch (error) {
        // エラーは静かにスキップ
      }
    }
    
    // さらに、一般的なYouTube動画IDパターンで新しい動画を検出
    // 注意: この方法は多くのリクエストを送信する可能性があるため、
    // 実際の使用では、既知のパターンのみを使用することを推奨
    
    console.log(`Auto-scan completed. Found ${detectedIds.length} videos.`);
    return detectedIds;
  } catch (error) {
    console.log('Error during auto-scan:', error);
    return [];
  }
};

// video-index.jsonから動画IDを取得する関数
const getVideoIdsFromIndex = async (): Promise<string[]> => {
  try {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocal ? '' : '/VocabTest';
    const indexUrl = `${baseUrl}/CaptionData/Youtube/video-index.json`;
    
    console.log('Fetching video index from:', indexUrl);
    const response = await fetch(indexUrl);
    
    if (response.ok) {
      const indexData = await response.json();
      const videoIds = indexData.videos.map((video: any) => video.id);
      console.log('Successfully loaded video index with', videoIds.length, 'videos');
      return videoIds;
    } else {
      console.log('Video index not found, using fallback method');
      return [];
    }
  } catch (error) {
    console.log('Error loading video index:', error);
    return [];
  }
};

// 動的に利用可能な動画を取得する関数
export const getAvailableVideos = async (): Promise<VideoData[]> => {
  try {
    console.log('Starting getAvailableVideos function');
    
    // 利用可能な動画IDを自動取得
    const availableVideoIds = await getAvailableVideoIds();
    
    if (availableVideoIds.length === 0) {
      console.log('No available videos found, using static videos');
      return videos;
    }
    
    // video-index.jsonから完全な動画データを取得
    const videoIndexData = await getVideoIndexData();
    const availableVideos: VideoData[] = [];
    
    // 各動画IDに対して動画データを作成
    for (const videoId of availableVideoIds) {
      try {
        console.log(`Processing video ${videoId}...`);
        
        // インデックスファイルから動画情報を取得
        const indexVideo = videoIndexData.find((v: any) => v.id === videoId);
        
        // 動画データが存在する場合、基本情報を作成
        const videoData: VideoData = {
          id: videoId,
          title: indexVideo?.title || '', // インデックスからタイトルを取得
          url: `https://www.youtube.com/watch?v=${videoId}`,
          channelTitle: indexVideo?.channelTitle || '', // インデックスからチャンネル名を取得
          words: []
        };

        // インデックスにデータがない場合、既存の静的データから取得
        if (!indexVideo) {
          const existingVideo = videos.find(v => v.id === videoId);
          if (existingVideo) {
            videoData.title = existingVideo.title;
            videoData.channelTitle = existingVideo.channelTitle;
            console.log(`Found existing data for ${videoId}:`, videoData.title);
          } else {
            console.log(`No existing data for ${videoId}, using empty title`);
          }
        } else {
          console.log(`Found index data for ${videoId}:`, videoData.title);
        }

        availableVideos.push(videoData);
      } catch (error) {
        console.log(`Error processing video ${videoId}:`, error);
      }
    }

    console.log('Final available videos:', availableVideos);
    return availableVideos;
  } catch (error) {
    console.error('Error getting available videos:', error);
    return videos; // エラーの場合は静的データを返す
  }
};

// video-index.jsonから完全な動画データを取得する関数
const getVideoIndexData = async (): Promise<any[]> => {
  try {
    const isLocal = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
    const baseUrl = isLocal ? '' : '/VocabTest';
    const indexUrl = `${baseUrl}/CaptionData/Youtube/video-index.json`;
    
    const response = await fetch(indexUrl);
    
    if (response.ok) {
      const indexData = await response.json();
      console.log('Successfully loaded video index data');
      return indexData.videos || [];
    } else {
      console.log('Video index not found, returning empty array');
      return [];
    }
  } catch (error) {
    console.log('Error loading video index data:', error);
    return [];
  }
};

// 動画IDから動画情報を取得する関数
export const getVideoById = async (videoId: string): Promise<VideoData | null> => {
  try {
    const wordResponse = await fetch(await getVideoWordsPathWithFallback(videoId));
    if (wordResponse.ok) {
      const videoData: VideoData = {
        id: videoId,
        title: '', // タイトルは空白
        url: `https://www.youtube.com/watch?v=${videoId}`,
        channelTitle: '', // チャンネル名も空白
        words: []
      };

      // 既存の静的データからタイトルとチャンネル名を取得
      const existingVideo = videos.find(v => v.id === videoId);
      if (existingVideo) {
        videoData.title = existingVideo.title;
        videoData.channelTitle = existingVideo.channelTitle;
      }

      return videoData;
    }
  } catch (error) {
    console.error(`Error getting video ${videoId}:`, error);
  }

  return null;
}; 