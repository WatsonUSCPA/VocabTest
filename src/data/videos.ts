import { VideoData } from '../types';

// 動画データの配列
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

// レベルに基づいて単語をフィルタリングする関数
export const filterWordsByLevel = (words: any[], level: string) => {
  if (level === 'all') {
    return words;
  }
  return words.filter(word => word.level === level);
};

// ランダムに単語を選択する関数
export const getRandomWords = (words: any[], count: number) => {
  const shuffled = [...words].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
}; 