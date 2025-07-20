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

  // ビデオIDを抽出
  const videoIds = jsonFiles.map(file => 
    file.replace('_words_with_meaning.json', '')
  );

  // 結果をログ出力
  console.log(`✅ Found ${videoIds.length} video files:`);
  videoIds.forEach(id => console.log(`  - ${id}`));

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