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

// ビルド時に生成されたvideo-list.jsonから動画IDを取得する関数
export const getAvailableVideoIds = async (): Promise<string[]> => {
  try {
    // 生成されたvideo-list.jsonを読み取り
    const response = await fetch('./video-list.json');
    if (response.ok) {
      const videoList = await response.json();
      console.log('📄 Loaded video-list.json:', videoList.videos);
      return videoList.videos;
    } else {
      console.log('❌ Video list not found, using fallback');
      throw new Error('Video list not found');
    }
  } catch (error) {
    console.log('🔄 Falling back to manual detection');
    return await getAvailableVideoIdsFallback();
  }
};

// フォールバック用の手動検出関数
const getAvailableVideoIdsFallback = async (): Promise<string[]> => {
  // 既知の動画IDパターン（フォールバック用）- 作成日時順（新しい順）
  const knownVideoIds = [
    'mYVzme2fybU',
    'Gxad3-pmzqw',
    '_gBxYL2ihc0',
    'hWxS_xOa0Io',
    'wu-p5xrJ8-E',
    'CAi6HoyGaB8',
    'wHN03Y7ICq0',
    'motX94ztOzo',
    'DpQQi2scsHo',
    'UF8uR6Z6KLc',
    'FASMejN_5gs',
    'Pjq4FAfIPSg',
    'KypnjJSKi4o',
    'pT87zqXPw4w'
  ];
  
  // 最初に見つかった1個の動画のみを返す
  for (const videoId of knownVideoIds) {
    try {
      const wordResponse = await fetch(await getVideoWordsPathWithFallback(videoId));
      if (wordResponse.ok) {
        console.log(`🔄 Fallback: Found video ${videoId}`);
        return [videoId]; // 1個だけ返す
      }
    } catch (error) {
      // エラーは無視して続行
    }
  }
  
  console.log('🔄 Fallback: No videos found');
  return [];
};



// 動的に利用可能な動画を取得する関数（video-index.jsonに依存しない）
export const getAvailableVideos = async (): Promise<VideoData[]> => {
  try {
    // 利用可能な動画IDを直接スキャンで取得（順番を保持）
    const availableVideoIds = await getAvailableVideoIds();
    
    console.log('📋 Available video IDs (in order):', availableVideoIds);
    
    if (availableVideoIds.length === 0) {
      return videos;
    }
    
    const availableVideos: VideoData[] = [];
    
    // video-list.jsonの順番を保持して動画データを作成
    for (const videoId of availableVideoIds) {
      try {
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
        }

        availableVideos.push(videoData);
      } catch (error) {
        // エラーは無視して続行
      }
    }

    console.log('🎬 Final video order:', availableVideos.map(v => v.id));
    
    // video-list.jsonの順番を保持したまま返す（既にソート済み）
    return availableVideos;
  } catch (error) {
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
    // エラーは無視
  }

  return null;
}; 