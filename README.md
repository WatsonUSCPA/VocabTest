# 動画で学ぶ英単語 (Learn English Vocabulary through Videos)

Reactベースの英語語彙学習ウェブサイトです。YouTube動画から抽出された単語データを使用して、インタラクティブな学習体験を提供します。

## 機能

- 🎥 YouTube動画からの単語学習
- 🔍 **自動動画検出機能** - Caption Dataフォルダを自動スキャン
- 📊 レベル別（A1-C2）単語フィルタリング
- 🎯 学習単語数の選択
- 📝 インタラクティブな学習モード
- 📈 学習進捗の追跡
- 🎨 モダンでレスポンシブなUI
- ⚡ **簡単追加** - 新しい動画はJSONファイルを追加するだけ

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
└── CaptionData/        # 単語データ（JSONファイル）- 自動スキャン対象
    └── Youtube/
        ├── video-index.json                    # 自動生成（手動更新不要）
        ├── CAi6HoyGaB8_words_with_meaning.json # 動画データ
        ├── FASMejN_5gs_words_with_meaning.json # 動画データ
        ├── DpQQi2scsHo_words_with_meaning.json # 動画データ
        └── ...                                 # その他の動画データ
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

### 新しい動画の追加（自動スキャン機能）

**🎉 新しい動画を追加するのは超簡単になりました！**

#### 手順：

1. **JSONファイルを追加するだけ**
   ```
   public/CaptionData/Youtube/{動画ID}_words_with_meaning.json
   ```

2. **完了！**
   - アプリが自動的に新しい動画を検出
   - `video-index.json`の更新は不要
   - 手動での設定変更は不要

#### 例：
```
public/CaptionData/Youtube/ABC123DEF45_words_with_meaning.json
```

#### 自動検出の仕組み：
- アプリ起動時にCaption Dataフォルダを自動スキャン
- 存在するJSONファイルから動画IDを自動抽出
- 新しい動画が自動的に学習画面に表示される

#### 注意事項：
- ファイル名は必ず `{動画ID}_words_with_meaning.json` の形式で保存
- JSONファイルは有効な形式である必要があります
- 動画IDはYouTubeの動画URLから取得できます（例：`https://www.youtube.com/watch?v=ABC123DEF45` の `ABC123DEF45` 部分）

### スタイルのカスタマイズ

各コンポーネント内でインラインスタイルを使用しているため、直接編集してカスタマイズできます。

## ライセンス

MIT License

## 貢献

プルリクエストやイシューの報告を歓迎します。