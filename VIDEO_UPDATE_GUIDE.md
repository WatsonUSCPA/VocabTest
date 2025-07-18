# 動画データ更新ガイド（完全自動化版）

## 🎉 完全自動化された動画追加システム

**新しい動画を追加する際に、手動でindex.jsonを更新する必要はありません！**

## 新しい動画を追加する手順

### 1. Caption Dataファイルの追加のみ
`public/CaptionData/Youtube/` フォルダに新しいJSONファイルを追加するだけです。
ファイル名の形式: `{動画ID}_words_with_meaning.json`

例:
```
public/CaptionData/Youtube/ABC123DEF45_words_with_meaning.json
```

### 2. GitHubにプッシュ
変更をGitHubにプッシュすると、以下の処理が自動的に実行されます：

1. **GitHub Actionsが自動検出**: Caption Dataフォルダの変更を検出
2. **video-index.json自動生成**: 新しい動画IDを自動的に検出してインデックスを更新
3. **アプリ自動デプロイ**: 更新されたアプリが自動的にデプロイされる

## 自動化の仕組み

### 1. フロントエンド自動スキャン
- アプリが起動時にCaption Dataフォルダを自動スキャン
- 存在するJSONファイルから動画IDを自動抽出
- `video-index.json`がなくても動作

### 2. GitHub Actions自動更新
- Caption Dataフォルダに新しいJSONファイルが追加されると自動検出
- `video-index.json`を自動生成・更新
- 変更を自動的にコミット・プッシュ

### 3. フォールバック機能
- 自動スキャンが失敗した場合のバックアップ機能
- 既存のシステムとの互換性を維持

## ファイル構造

```
public/
  CaptionData/
    Youtube/
      video-index.json                    # 自動生成（手動更新不要）
      FASMejN_5gs_words_with_meaning.json # 既存の動画データ
      DpQQi2scsHo_words_with_meaning.json # 既存の動画データ
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
   - GitHub Actionsが自動的にvideo-index.jsonを更新
   - アプリが自動的にデプロイ
   - 新しい動画が自動的に表示される

## 注意事項

1. **ファイル名の形式**: 動画ID + `_words_with_meaning.json` の形式で保存してください
2. **JSON形式**: ファイルは有効なJSON形式である必要があります
3. **自動処理**: video-index.jsonは自動生成されるため、手動で編集しないでください
4. **デプロイ**: 変更後はGitHubにプッシュするだけで完了です

## トラブルシューティング

### 動画が表示されない場合
1. JSONファイルが正しい場所に配置されているか確認
2. ファイル名が正しい形式か確認
3. GitHub Actionsの実行ログを確認
4. ブラウザのコンソールでエラーメッセージを確認

### GitHub Actionsが失敗する場合
1. ファイル名に特殊文字が含まれていないか確認
2. JSONファイルが有効な形式か確認
3. GitHubのActionsタブでエラーログを確認

## 従来の手動更新方法（非推奨）

もし何らかの理由で自動化が機能しない場合：

1. `public/CaptionData/Youtube/video-index.json` を手動で編集
2. 新しい動画の情報を追加
3. 手動でコミット・プッシュ

ただし、通常は自動化システムが正常に動作するため、手動更新は不要です。 