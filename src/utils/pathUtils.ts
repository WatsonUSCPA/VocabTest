// 環境に応じてパスを動的に調整するユーティリティ

/**
 * ファイルの存在確認を行う
 * @param url 確認するURL
 * @returns ファイルが存在するかどうか
 */
const checkFileExists = async (url: string): Promise<boolean> => {
  try {
    const response = await fetch(url, { method: 'HEAD' });
    return response.ok;
  } catch {
    return false;
  }
};

/**
 * 現在の環境に応じて適切なパスを生成する
 * @param relativePath 相対パス（例: "CaptionData/Youtube/videoId_words_with_meaning.json"）
 * @returns 環境に応じた完全なパス
 */
export const getAssetPath = (relativePath: string): string => {
  const hostname = window.location.hostname;
  const port = window.location.port;
  const pathname = window.location.pathname;
  
  // より確実な環境判定
  const isLocalhost = hostname === 'localhost' || hostname === '127.0.0.1';
  const isDevelopment = isLocalhost || port === '3000';
  const isGitHubPages = hostname.includes('github.io') || pathname.includes('/VocabTest');
  
  console.log('Environment detection:', {
    hostname,
    port,
    pathname,
    isLocalhost,
    isDevelopment,
    isGitHubPages
  });
  
  // ローカル開発環境の場合
  if (isDevelopment) {
    const path = `/${relativePath}`;
    console.log('Using development path:', path);
    return path;
  }
  
  // GitHub Pages環境の場合
  if (isGitHubPages) {
    const path = `./${relativePath}`;
    console.log('Using GitHub Pages path:', path);
    return path;
  }
  
  // その他の環境（フォールバック）
  const path = `./${relativePath}`;
  console.log('Using fallback path:', path);
  return path;
};

/**
 * YouTube動画の単語データファイルパスを取得（複数パスを試行）
 * @param videoId YouTube動画ID
 * @returns 単語データファイルのパス
 */
export const getVideoWordsPath = (videoId: string): string => {
  return getAssetPath(`CaptionData/Youtube/${videoId}_words_with_meaning.json`);
};

/**
 * 複数のパスを試行して、存在するファイルのパスを取得
 * @param videoId YouTube動画ID
 * @returns 存在するファイルのパス、またはデフォルトパス
 */
export const getVideoWordsPathWithFallback = async (videoId: string): Promise<string> => {
  const paths = [
    `/${videoId}_words_with_meaning.json`, // ローカル開発用
    `./CaptionData/Youtube/${videoId}_words_with_meaning.json`, // GitHub Pages用
    `/CaptionData/Youtube/${videoId}_words_with_meaning.json`, // 絶対パス
  ];
  
  for (const path of paths) {
    const exists = await checkFileExists(path);
    if (exists) {
      console.log(`Found file at: ${path}`);
      return path;
    }
  }
  
  // デフォルトパスを返す
  const defaultPath = getVideoWordsPath(videoId);
  console.log(`Using default path: ${defaultPath}`);
  return defaultPath;
}; 