import { VideoData } from '../types';

// 動画データの配列（初期データ）
export const videos: VideoData[] = [
  {
    id: 'pT87zqXPw4w',
    title: 'Learn English with TV Series: Friends - How to Speak English Like a Native',
    url: 'https://www.youtube.com/watch?v=pT87zqXPw4w',
    channelTitle: 'Learn English With TV Series',
    words: [] // 後でJSONファイルから読み込む
  },
  {
    id: 'KypnjJSKi4o',
    title: 'Learn English with Movies: The Avengers - English Vocabulary & Phrases',
    url: 'https://www.youtube.com/watch?v=KypnjJSKi4o',
    channelTitle: 'Learn English With Movies',
    words: [] // 後でJSONファイルから読み込む
  }
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
    
    // CaptionDataディレクトリの内容を取得（これは失敗する可能性が高い）
    try {
      const response = await fetch('./CaptionData/Youtube/');
      if (!response.ok) {
        console.log('CaptionData directory not accessible, will check known video IDs');
      }
    } catch (error) {
      console.log('CaptionData directory access failed, will check known video IDs');
    }

    // 既知の動画IDリスト（新しい動画IDをここに追加）
    const knownVideoIds = [
      'pT87zqXPw4w', 
      'KypnjJSKi4o', 
      'FASMejN_5gs', 
      'Pjq4FAfIPSg'
    ];
    
    console.log('Checking for videos with IDs:', knownVideoIds);
    const availableVideos: VideoData[] = [];

    for (const videoId of knownVideoIds) {
      try {
        console.log(`Checking video ${videoId}...`);
        const wordResponse = await fetch(`./CaptionData/Youtube/${videoId}_words_with_meaning.json`);
        console.log(`Response for ${videoId}:`, wordResponse.status, wordResponse.ok);
        
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
          console.log(`Video ${videoId} not found (status: ${wordResponse.status})`);
        }
      } catch (error) {
        console.log(`Error checking video ${videoId}:`, error);
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