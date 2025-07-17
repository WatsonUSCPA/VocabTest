// 環境に応じてパスを動的に調整するユーティリティ

/**
 * 現在の環境に応じて適切なパスを生成する
 * @param relativePath 相対パス（例: "CaptionData/Youtube/videoId_words_with_meaning.json"）
 * @returns 環境に応じた完全なパス
 */
export const getAssetPath = (relativePath: string): string => {
  // 開発環境（localhost）の場合
  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return `/${relativePath}`;
  }
  
  // デプロイ環境（GitHub Pages）の場合
  // homepageが "https://watsonuscpa.github.io/VocabTest" に設定されているため
  return `./${relativePath}`;
};

/**
 * YouTube動画の単語データファイルパスを取得
 * @param videoId YouTube動画ID
 * @returns 単語データファイルのパス
 */
export const getVideoWordsPath = (videoId: string): string => {
  return getAssetPath(`CaptionData/Youtube/${videoId}_words_with_meaning.json`);
}; 