import { VideoData } from '../types';
import { getVideoWordsPathWithFallback } from '../utils/pathUtils';

// 動画データの配列（初期データ）
export const videos: VideoData[] = [
  // 現在は動的に読み込むため、静的データは空にしておく
];

// 単語をレベルでフィルタリングする関数
export const filterWordsByLevel = (words: any[], level: string) => {
  if (level === 'all') return words;
  return words.filter(word => word.level === level);
};

// ランダムに単語を選択する関数
export const getRandomWords = (words: any[], count: number) => {
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Caption Dataフォルダを直接スキャンして動画IDを自動検出する関数
export const getAvailableVideoIds = async (): Promise<string[]> => {
  try {
    console.log('🔍 Starting direct scan of Caption Data folder...');
    
    // 既知の動画IDパターン（現在存在する動画）
    const knownVideoIds = [
      'CAi6HoyGaB8', 'FASMejN_5gs', 'DpQQi2scsHo', 'UF8uR6Z6KLc', 'pT87zqXPw4w',
      'Pjq4FAfIPSg', 'KypnjJSKi4o', 'wHN03Y7ICq0', 'motX94ztOzo'
    ];
    
    const detectedIds: string[] = [];
    
    // 各動画IDをチェックして、実際にJSONファイルが存在するか確認
    for (const videoId of knownVideoIds) {
      try {
        const wordResponse = await fetch(await getVideoWordsPathWithFallback(videoId));
        if (wordResponse.ok) {
          detectedIds.push(videoId);
          console.log(`✅ Found video data for: ${videoId}`);
        } else {
          console.log(`❌ No data found for: ${videoId}`);
        }
      } catch (error) {
        console.log(`⚠️ Error checking video ${videoId}:`, error);
      }
    }
    
    // 新しい動画を自動検出する機能（オプション）
    // 注意: この機能は多くのリクエストを送信する可能性があるため、
    // 必要に応じて有効/無効を切り替え可能
    const enableAutoDetection = false; // 自動検出を無効化（パフォーマンスのため）
    
    if (enableAutoDetection) {
      console.log('🔍 Starting auto-detection for new videos...');
      const newVideos = await detectNewVideos(detectedIds);
      detectedIds.push(...newVideos);
    }
    
    console.log(`🎯 Direct scan completed. Found ${detectedIds.length} videos:`, detectedIds);
    return detectedIds;
  } catch (error) {
    console.error('❌ Error during direct scan:', error);
    return [];
  }
};

// 新しい動画を自動検出する関数（オプション機能）
const detectNewVideos = async (existingIds: string[]): Promise<string[]> => {
  const newVideos: string[] = [];
  
  try {
    // 一般的なYouTube動画IDパターンを生成してテスト
    // 注意: この方法は多くのリクエストを送信するため、慎重に使用
    const testPatterns = generateTestPatterns();
    
    for (const pattern of testPatterns) {
      if (existingIds.includes(pattern)) continue; // 既に検出済みはスキップ
      
      try {
        const wordResponse = await fetch(await getVideoWordsPathWithFallback(pattern));
        if (wordResponse.ok) {
          newVideos.push(pattern);
          console.log(`🆕 Auto-detected new video: ${pattern}`);
        }
      } catch (error) {
        // エラーは静かにスキップ
      }
    }
  } catch (error) {
    console.log('⚠️ Error during auto-detection:', error);
  }
  
  return newVideos;
};

// テスト用のパターンを生成する関数（オプション）
const generateTestPatterns = (): string[] => {
  // 実際の使用では、より賢いパターン生成ロジックを実装
  // 現在は空の配列を返して、自動検出を無効化
  return [];
};

// 動的に利用可能な動画を取得する関数（video-index.jsonに依存しない）
export const getAvailableVideos = async (): Promise<VideoData[]> => {
  try {
    console.log('🚀 Starting getAvailableVideos function (direct scan mode)');
    
    // 利用可能な動画IDを直接スキャンで取得
    const availableVideoIds = await getAvailableVideoIds();
    
    if (availableVideoIds.length === 0) {
      console.log('⚠️ No available videos found, using static videos');
      return videos;
    }
    
    const availableVideos: VideoData[] = [];
    
    // 各動画IDに対して動画データを作成
    for (const videoId of availableVideoIds) {
      try {
        console.log(`📹 Processing video ${videoId}...`);
        
        // 動画データが存在する場合、基本情報を作成
        const videoData: VideoData = {
          id: videoId,
          title: `English Learning Video - ${videoId}`, // デフォルトタイトル
          url: `https://www.youtube.com/watch?v=${videoId}`,
          channelTitle: 'English Channel', // デフォルトチャンネル名
          words: []
        };

        // 既存の静的データからタイトルとチャンネル名を取得（もしあれば）
        const existingVideo = videos.find(v => v.id === videoId);
        if (existingVideo) {
          videoData.title = existingVideo.title;
          videoData.channelTitle = existingVideo.channelTitle;
          console.log(`📝 Found existing data for ${videoId}:`, videoData.title);
        } else {
          console.log(`🆕 New video detected: ${videoId}, using default title`);
        }

        availableVideos.push(videoData);
      } catch (error) {
        console.log(`❌ Error processing video ${videoId}:`, error);
      }
    }

    console.log('🎉 Final available videos:', availableVideos);
    return availableVideos;
  } catch (error) {
    console.error('❌ Error getting available videos:', error);
    return videos; // エラーの場合は静的データを返す
  }
};

// 動画IDから動画情報を取得する関数
export const getVideoById = async (videoId: string): Promise<VideoData | null> => {
  try {
    const wordResponse = await fetch(await getVideoWordsPathWithFallback(videoId));
    if (wordResponse.ok) {
      const videoData: VideoData = {
        id: videoId,
        title: `English Learning Video - ${videoId}`, // デフォルトタイトル
        url: `https://www.youtube.com/watch?v=${videoId}`,
        channelTitle: 'English Channel', // デフォルトチャンネル名
        words: []
      };

      // 既存の静的データからタイトルとチャンネル名を取得（もしあれば）
      const existingVideo = videos.find(v => v.id === videoId);
      if (existingVideo) {
        videoData.title = existingVideo.title;
        videoData.channelTitle = existingVideo.channelTitle;
      }

      return videoData;
    }
  } catch (error) {
    console.error(`❌ Error getting video ${videoId}:`, error);
  }

  return null;
}; 