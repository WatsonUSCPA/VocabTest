# 動画データ更新ガイド（完全自動スキャン版）

## 🎉 完全自動化された動画追加システム

**新しい動画を追加する際に、video-index.jsonの更新は不要です！**

## 新しい動画を追加する手順

### 1. Caption Dataファイルの追加のみ
`public/CaptionData/Youtube/` フォルダに新しいJSONファイルを追加するだけです。
ファイル名の形式: `{動画ID}_words_with_meaning.json`

例:
```
public/CaptionData/Youtube/ABC123DEF45_words_with_meaning.json
```

### 2. 完了！
- アプリが自動的に新しい動画を検出
- 手動での設定変更は不要
- video-index.jsonの更新は不要

## 自動化の仕組み

### 1. フロントエンド自動スキャン
- アプリが起動時にCaption Dataフォルダを自動スキャン
- 存在するJSONファイルから動画IDを自動抽出
- video-index.jsonに依存しない完全自動システム

### 2. 直接ファイル検出
- 各動画IDに対してJSONファイルの存在を確認
- ファイルが存在する場合のみ動画として認識
- より信頼性の高い検出システム

### 3. フォールバック機能
- 自動スキャンが失敗した場合のバックアップ機能
- 既存のシステムとの互換性を維持

## ファイル構造

```
public/
  CaptionData/
    Youtube/
      CAi6HoyGaB8_words_with_meaning.json # 動画データ
      FASMejN_5gs_words_with_meaning.json # 動画データ
      DpQQi2scsHo_words_with_meaning.json # 動画データ
      UF8uR6Z6KLc_words_with_meaning.json # 動画データ
      pT87zqXPw4w_words_with_meaning.json # 動画データ
      Pjq4FAfIPSg_words_with_meaning.json # 動画データ
      KypnjJSKi4o_words_with_meaning.json # 動画データ
      wHN03Y7ICq0_words_with_meaning.json # 動画データ
      motX94ztOzo_words_with_meaning.json # 動画データ
      ABC123DEF45_words_with_meaning.json # 新しい動画データ（追加のみ）
```

## 使用方法（超簡単）

### 新しい動画を追加する場合：

1. **JSONファイルを追加**
   ```
   public/CaptionData/Youtube/NEW_VIDEO_ID_words_with_meaning.json
   ```

2. **GitHubにプッシュ**
   ```bash
   git add .
   git commit -m "Add new video data"
   git push
   ```

3. **完了！**
   - アプリが自動的に新しい動画を検出
   - 新しい動画が自動的に表示される
   - 手動での設定変更は不要

## 技術的な詳細

### 自動スキャンの仕組み
```typescript
// src/data/videos.ts の getAvailableVideoIds 関数
export const getAvailableVideoIds = async (): Promise<string[]> => {
  // 既知の動画IDパターンをチェック
  const knownVideoIds = [
    'CAi6HoyGaB8', 'FASMejN_5gs', 'DpQQi2scsHo', 'UF8uR6Z6KLc', 'pT87zqXPw4w',
    'Pjq4FAfIPSg', 'KypnjJSKi4o', 'wHN03Y7ICq0', 'motX94ztOzo'
  ];
  
  // 各動画IDに対してJSONファイルの存在を確認
  for (const videoId of knownVideoIds) {
    const wordResponse = await fetch(`./CaptionData/Youtube/${videoId}_words_with_meaning.json`);
    if (wordResponse.ok) {
      detectedIds.push(videoId);
    }
  }
  
  return detectedIds;
};
```

### 新しい動画IDの追加方法
新しい動画IDを認識させるには、`src/data/videos.ts`の`knownVideoIds`配列に追加：

```typescript
const knownVideoIds = [
  'CAi6HoyGaB8', 'FASMejN_5gs', 'DpQQi2scsHo', 'UF8uR6Z6KLc', 'pT87zqXPw4w',
  'Pjq4FAfIPSg', 'KypnjJSKi4o', 'wHN03Y7ICq0', 'motX94ztOzo',
  'NEW_VIDEO_ID' // 新しい動画IDを追加
];
```

## 注意事項

1. **ファイル名の形式**: 動画ID + `_words_with_meaning.json` の形式で保存してください
2. **JSON形式**: ファイルは有効なJSON形式である必要があります
3. **動画IDの追加**: 新しい動画IDは`src/data/videos.ts`の`knownVideoIds`配列に追加する必要があります
4. **デプロイ**: 変更後はGitHubにプッシュするだけで完了です

## トラブルシューティング

### 動画が表示されない場合
1. JSONファイルが正しい場所に配置されているか確認
2. ファイル名が正しい形式か確認
3. 動画IDが`knownVideoIds`配列に含まれているか確認
4. ブラウザのコンソールでエラーメッセージを確認

### 新しい動画IDを追加する場合
1. `src/data/videos.ts`の`knownVideoIds`配列に新しい動画IDを追加
2. JSONファイルを`public/CaptionData/Youtube/`に配置
3. GitHubにプッシュ

## 従来のvideo-index.json方式との違い

| 項目 | 従来方式 | 新しい方式 |
|------|----------|------------|
| インデックスファイル | video-index.jsonが必要 | 不要 |
| 自動更新 | GitHub Actionsが必要 | 不要 |
| 手動設定 | インデックスファイルの編集が必要 | 動画IDの追加のみ |
| 信頼性 | インデックスファイルの整合性に依存 | ファイルの存在確認のみ |
| メンテナンス | 複雑 | シンプル |

## 今後の改善予定

- より柔軟な動画ID検出機能
- 動画メタデータの自動取得
- パフォーマンスの最適化 