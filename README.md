# 動画で学ぶ英単語 (Learn English Vocabulary through Videos)

Reactベースの英語語彙学習ウェブサイトです。YouTube動画から抽出された単語データを使用して、インタラクティブな学習体験を提供します。

## 機能

- 🎥 YouTube動画からの単語学習
- 📊 レベル別（A1-C2）単語フィルタリング
- 🎯 学習単語数の選択
- 📝 インタラクティブな学習モード
- 📈 学習進捗の追跡
- 🎨 モダンでレスポンシブなUI

## セットアップ

### 1. 依存関係のインストール

```bash
npm install
```

### 2. YouTube Data API v3の設定（オプション）

動画のタイトル、チャンネル名、視聴回数などの詳細情報を取得するには、YouTube Data API v3のAPIキーが必要です。

#### APIキーの取得方法：

1. [Google Cloud Console](https://console.cloud.google.com/) にアクセス
2. 新しいプロジェクトを作成または既存のプロジェクトを選択
3. YouTube Data API v3を有効化
4. 認証情報でAPIキーを作成
5. `env.example`ファイルを`.env`にコピーしてAPIキーを設定

```bash
cp env.example .env
```

`.env`ファイルを編集：
```
REACT_APP_YOUTUBE_API_KEY=your_youtube_api_key_here
```

**注意**: APIキーが設定されていない場合でも、アプリケーションは正常に動作します。その場合は、手動で設定された動画タイトルとチャンネル名が表示されます。

### 3. アプリケーションの起動

```bash
npm start
```

ブラウザで [http://localhost:3000](http://localhost:3000) を開いてアプリケーションにアクセスできます。

## 使用方法

1. **ホーム画面**: 「YouTubeから学ぶ」または「その他から学ぶ」を選択
2. **動画選択**: 学習したいYouTube動画を選択
3. **レベル選択**: 学習したい単語レベル（A1-C2）と単語数を選択
4. **学習開始**: 単語を一つずつ学習し、意味を確認
5. **完了**: 学習完了後に統計情報を確認

## プロジェクト構造

```
src/
├── components/          # Reactコンポーネント
│   ├── Header.tsx      # ヘッダーコンポーネント
│   ├── Home.tsx        # ホーム画面
│   ├── YouTubeLearning.tsx # YouTube学習画面
│   ├── LevelSelect.tsx # レベル選択画面
│   ├── Test.tsx        # 学習画面
│   ├── OtherLearning.tsx # その他学習画面
│   └── LearningComplete.tsx # 学習完了画面
├── data/               # データファイル
│   └── videos.ts       # 動画データ
├── types/              # TypeScript型定義
│   └── index.ts        # 型定義
├── utils/              # ユーティリティ関数
│   └── youtube.ts      # YouTube関連機能
└── App.tsx             # メインアプリケーション

public/
└── CaptionData/        # 単語データ（JSONファイル）
    └── Youtube/
        ├── pT87zqXPw4w_words_with_meaning.json
        └── KypnjJSKi4o_words_with_meaning.json
```

## 技術スタック

- **React 18** - UIライブラリ
- **TypeScript** - 型安全性
- **React Router** - ルーティング
- **CSS-in-JS** - スタイリング

## 単語データ形式

JSONファイルは以下の形式で保存されています：

```json
[
  {
    "word": "example",
    "level": "B1",
    "definition_en": "A thing characteristic of its kind",
    "definition_ja": "例、実例"
  }
]
```

## デプロイ

### GitHub Pagesでの公開

このプロジェクトはGitHub Pagesで簡単に公開できます。

#### 1. GitHubリポジトリの準備

1. GitHubで新しいリポジトリを作成（例：`EnglishVocabWebsite`）
2. ローカルリポジトリをGitHubにプッシュ

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/[YOUR_USERNAME]/EnglishVocabWebsite.git
git push -u origin main
```

#### 2. package.jsonの設定

`package.json`の`homepage`フィールドを自分のGitHubユーザー名に変更：

```json
{
  "homepage": "https://[YOUR_GITHUB_USERNAME].github.io/EnglishVocabWebsite"
}
```

#### 3. 自動デプロイの設定

GitHubリポジトリの設定で：

1. **Settings** → **Pages** に移動
2. **Source** で **GitHub Actions** を選択
3. メインブランチにプッシュすると自動的にデプロイされます

#### 4. 手動デプロイ（オプション）

```bash
npm run deploy
```

### その他のホスティングサービス

- **Netlify**: `npm run build`でビルド後、`build`フォルダをデプロイ
- **Vercel**: GitHubリポジトリを接続して自動デプロイ
- **Firebase Hosting**: Firebase CLIを使用してデプロイ

## 開発

### 新しい動画の追加

1. `src/data/videos.ts`に動画情報を追加
2. `public/CaptionData/Youtube/`に単語データのJSONファイルを配置
3. ファイル名は`{videoId}_words_with_meaning.json`の形式

### スタイルのカスタマイズ

各コンポーネント内でインラインスタイルを使用しているため、直接編集してカスタマイズできます。

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。