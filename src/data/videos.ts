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
      return videoList.videos;
    } else {
      throw new Error('Video list not found');
    }
  } catch (error) {
    return await getAvailableVideoIdsFallback();
  }
};

// フォールバック用の手動検出関数
const getAvailableVideoIdsFallback = async (): Promise<string[]> => {
  // 既知の動画IDパターン（フォールバック用）
  const knownVideoIds = [
    'CAi6HoyGaB8',
    'DpQQi2scsHo',
    'FASMejN_5gs',
    'hWxS_xOa0Io',
    'KypnjJSKi4o',
    'motX94ztOzo',
    'Pjq4FAfIPSg',
    'pT87zqXPw4w',
    'UF8uR6Z6KLc',
    'wHN03Y7ICq0',
    'wu-p5xrJ8-E'
  ];
  
  const detectedIds: string[] = [];
  
  // 各動画IDをチェックして、実際にJSONファイルが存在するか確認
  for (const videoId of knownVideoIds) {
    try {
      const wordResponse = await fetch(await getVideoWordsPathWithFallback(videoId));
      if (wordResponse.ok) {
        detectedIds.push(videoId);
      }
    } catch (error) {
      // エラーは無視して続行
    }
  }
  
  return detectedIds;
};



// 動的に利用可能な動画を取得する関数（video-index.jsonに依存しない）
export const getAvailableVideos = async (): Promise<VideoData[]> => {
  try {
    // 利用可能な動画IDを直接スキャンで取得
    const availableVideoIds = await getAvailableVideoIds();
    
    if (availableVideoIds.length === 0) {
      return videos;
    }
    
    const availableVideos: VideoData[] = [];
    
    // 各動画IDに対して動画データを作成
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