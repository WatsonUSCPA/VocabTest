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
    console.log('🔍 Starting automatic scan of Caption Data folder...');
    
    // フォルダ内のファイル一覧を取得する方法を試行
    const methods = [
      // 方法1: 複数のパスでディレクトリリスティングを試行
      async () => {
        const paths = [
          '/CaptionData/Youtube/',
          './CaptionData/Youtube/',
          '/CaptionData/Youtube/index.html',
          './CaptionData/Youtube/index.html'
        ];
        
        for (const path of paths) {
          try {
            console.log(`🔍 Trying directory listing at: ${path}`);
            const response = await fetch(path);
            if (response.ok) {
              const html = await response.text();
              const detectedIds: string[] = [];
              const jsonFilePattern = /([A-Za-z0-9_-]+)_words_with_meaning\.json/g;
              let match;
              while ((match = jsonFilePattern.exec(html)) !== null) {
                detectedIds.push(match[1]);
              }
              if (detectedIds.length > 0) {
                console.log(`✅ Directory listing successful at ${path}, found ${detectedIds.length} files`);
                return detectedIds;
              }
            }
          } catch (error) {
            console.log(`❌ Failed to access ${path}:`, error);
          }
                }
        return null;
      },
      // 方法2: 一般的なYouTube動画IDパターンを試行（フォールバック）
           async () => {
             const commonPatterns = [
               'CAi6HoyGaB8', 'FASMejN_5gs', 'DpQQi2scsHo', 'UF8uR6Z6KLc', 'pT87zqXPw4w',
               'Pjq4FAfIPSg', 'KypnjJSKi4o', 'wHN03Y7ICq0', 'motX94ztOzo', 'wu-p5xrJ8-E',
               'hWxS_xOallo'
             ];
             console.log('🔍 Method 2: Checking fallback patterns:', commonPatterns);
           const detectedIds: string[] = [];
           
           for (const videoId of commonPatterns) {
             console.log(`🔍 Checking video: ${videoId}`);
             try {
               const wordResponse = await fetch(await getVideoWordsPathWithFallback(videoId));
               if (wordResponse.ok) {
                 detectedIds.push(videoId);
                 console.log(`✅ Found video data for: ${videoId}`);
               } else {
                 console.log(`❌ No data found for: ${videoId} (status: ${wordResponse.status})`);
               }
             } catch (error) {
               console.log(`⚠️ Error checking video ${videoId}:`, error);
             }
           }
           console.log(`🎯 Method 2 completed. Found ${detectedIds.length} videos:`, detectedIds);
           return detectedIds;
         }
    ];
    
    // 各方法を順番に試行
    for (let i = 0; i < methods.length; i++) {
      try {
        console.log(`🔍 Trying method ${i + 1}...`);
        const result = await methods[i]();
        if (result && result.length > 0) {
          console.log(`🎯 Method ${i + 1} successful. Found ${result.length} videos:`, result);
          return result;
        }
      } catch (error) {
        console.log(`❌ Method ${i + 1} failed:`, error);
      }
    }
    
    console.log('❌ All methods failed, using fallback');
    return await getAvailableVideoIdsFallback();
  } catch (error) {
    console.error('❌ Error during automatic scan:', error);
    console.log('🔄 Falling back to manual method...');
    return await getAvailableVideoIdsFallback();
  }
};

// フォールバック用の手動検出関数
const getAvailableVideoIdsFallback = async (): Promise<string[]> => {
  console.log('🔍 Using fallback method...');
  
  // 既知の動画IDパターン（フォールバック用 - 1個のみ）
  const knownVideoIds = [
    'CAi6HoyGaB8'
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
  
  return detectedIds;
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