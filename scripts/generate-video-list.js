const fs = require('fs');
const path = require('path');

// CaptionDataフォルダのパス
const captionDataPath = path.join(__dirname, '../public/CaptionData/Youtube');
const outputPath = path.join(__dirname, '../public/video-list.json');

console.log('🔍 Scanning CaptionData folder for video files...');

try {
  // フォルダが存在するかチェック
  if (!fs.existsSync(captionDataPath)) {
    console.log('❌ CaptionData folder not found:', captionDataPath);
    process.exit(1);
  }

  // フォルダ内のファイルを読み取り
  const files = fs.readdirSync(captionDataPath);
  
  // JSONファイルのみをフィルタリング
  const jsonFiles = files.filter(file => 
    file.endsWith('_words_with_meaning.json')
  );

  // ファイル情報を取得（作成日時付き）
  const fileInfos = jsonFiles.map(file => {
    const filePath = path.join(captionDataPath, file);
    const stats = fs.statSync(filePath);
    return {
      file,
      videoId: file.replace('_words_with_meaning.json', ''),
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime
    };
  });

  // 作成日時でソート（新しい順）
  fileInfos.sort((a, b) => b.createdAt - a.createdAt);

  // ビデオIDを抽出（ソート済み）
  const videoIds = fileInfos.map(info => info.videoId);

  // 結果をログ出力
  console.log(`✅ Found ${videoIds.length} video files (sorted by creation date, newest first):`);
  fileInfos.forEach(info => {
    const date = info.createdAt.toLocaleDateString('ja-JP');
    console.log(`  - ${info.videoId} (created: ${date})`);
  });

  // JSONファイルを生成
  const videoList = {
    generatedAt: new Date().toISOString(),
    totalVideos: videoIds.length,
    videos: videoIds
  };

  // ファイルに書き込み
  fs.writeFileSync(outputPath, JSON.stringify(videoList, null, 2));
  
  console.log(`✅ Video list generated: ${outputPath}`);
  console.log(`📊 Total videos: ${videoIds.length}`);

} catch (error) {
  console.error('❌ Error generating video list:', error);
  process.exit(1);
} 