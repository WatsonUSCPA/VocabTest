import { VideoData } from '../types';

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

// 動的に利用可能な動画を取得する関数
export const getAvailableVideos = async (): Promise<VideoData[]> => {
  try {
    console.log('Starting getAvailableVideos function');
    
    // フロントエンドのみで自動取得（サーバー不要）
    const availableVideos: VideoData[] = [];
    
    // 既知の動画IDパターン（手動で追加が必要）
    const knownVideoIds = [
      'FASMejN_5gs', // 現在存在する動画
      'DpQQi2scsHo', // 新しく追加された動画
      'UF8uR6Z6KLc', // 新しく追加された動画
      'pT87zqXPw4w', // 新しく追加された動画
      'Pjq4FAfIPSg', // 新しく追加された動画
      'KypnjJSKi4o', // 新しく追加された動画
    ];
    
    // 動的に生成される可能性のある動画IDパターン
    const dynamicPatterns: string[] = [
      // 実際に存在する動画IDのみ
      // 必要に応じて追加
    ];
    
    const allPatterns = [...knownVideoIds, ...dynamicPatterns];
    
    console.log('Checking for videos with patterns:', allPatterns);
    
    // 各動画IDパターンをチェック
    for (const videoId of allPatterns) {
      try {
        console.log(`Checking video ${videoId}...`);
        const wordResponse = await fetch(`./CaptionData/Youtube/${videoId}_words_with_meaning.json`);
        
        if (wordResponse.ok) {
          console.log(`Video ${videoId} is available, adding to list`);
          // 動画データが存在する場合、基本情報を作成
          const videoData: VideoData = {
            id: videoId,
            title: '', // タイトルは空白（後でAPIまたは手動で設定可能）
            url: `https://www.youtube.com/watch?v=${videoId}`,
            channelTitle: '', // チャンネル名も空白
            words: []
          };

          // 既存の静的データからタイトルとチャンネル名を取得
          const existingVideo = videos.find(v => v.id === videoId);
          if (existingVideo) {
            videoData.title = existingVideo.title;
            videoData.channelTitle = existingVideo.channelTitle;
            console.log(`Found existing data for ${videoId}:`, videoData.title);
          } else {
            console.log(`No existing data for ${videoId}, using empty title`);
          }

          availableVideos.push(videoData);
        } else {
          // 404エラーの場合は静かにスキップ（ログを出力しない）
          if (wordResponse.status !== 404) {
            console.log(`Video ${videoId} not found (status: ${wordResponse.status})`);
          }
        }
      } catch (error) {
        // ネットワークエラーの場合のみログを出力
        console.log(`Network error checking video ${videoId}:`, error);
      }
    }

    console.log('Final available videos:', availableVideos);
    
    // 利用可能な動画が見つかった場合はそれを返す、そうでなければ静的データを返す
    if (availableVideos.length > 0) {
      return availableVideos;
    } else {
      console.log('No videos found, using static videos');
      return videos;
    }
  } catch (error) {
    console.error('Error getting available videos:', error);
    return videos; // エラーの場合は静的データを返す
  }
};

// 動画IDから動画情報を取得する関数
export const getVideoById = async (videoId: string): Promise<VideoData | null> => {
  try {
    const wordResponse = await fetch(`./CaptionData/Youtube/${videoId}_words_with_meaning.json`);
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