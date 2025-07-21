export interface WordData {
  word: string;
  level: string;
  definition_en: string;
  definition_ja?: string; // 旧形式との互換性のため
  meanings_ja?: string[]; // 新形式
  example?: string; // 新形式
}

export interface VideoData {
  id: string;
  title: string;
  url: string;
  channelTitle?: string;
  words: WordData[];
  originalIndex?: number; // video-list.jsonの順番を保持するためのインデックス
}

export interface TestQuestion {
  word: string;
  correctAnswer: string;
  options: string[];
  level: string;
}

export interface TestResult {
  score: number;
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  questions: TestQuestion[];
  userAnswers: string[];
}
