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
    
    // JSONファイルの内容から更新日時を読み取り
    let jsonUpdateDate = null;
    try {
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      
      // video_infoから更新日時を取得
      if (jsonData[0] && jsonData[0].video_info && jsonData[0].video_info.updated_at) {
        jsonUpdateDate = new Date(jsonData[0].video_info.updated_at);
      }
    } catch (error) {
      console.log(`Warning: Could not read update date from ${file}: ${error.message}`);
    }
    
    // 優先順位: JSON内の更新日時 > ファイルシステムの作成日時
    const effectiveDate = jsonUpdateDate || stats.birthtime;
    
    return {
      file,
      videoId: file.replace('_words_with_meaning.json', ''),
      createdAt: stats.birthtime,
      modifiedAt: effectiveDate,
      jsonUpdateDate: jsonUpdateDate
    };
  });

  // 更新日時でソート（新しい順）
  fileInfos.sort((a, b) => b.modifiedAt - a.modifiedAt);

  // ビデオIDを抽出（ソート済み）
  const videoIds = fileInfos.map(info => info.videoId);

  // 結果をログ出力
  console.log(`✅ Found ${videoIds.length} video files (sorted by modification date, newest first):`);
  fileInfos.forEach(info => {
    const date = info.modifiedAt.toLocaleDateString('ja-JP');
    const source = info.jsonUpdateDate ? 'json' : 'filesystem';
    console.log(`  - ${info.videoId} (modified: ${date}, source: ${source})`);
  });

  // JSONファイルを生成（実際のファイル更新日時を使用）
  const videoList = {
    generatedAt: new Date().toISOString(),
    totalVideos: videoIds.length,
    videos: videoIds,
    videoDetails: fileInfos.map(info => ({
      videoId: info.videoId,
      createdAt: info.createdAt.toISOString(),
      modifiedAt: info.modifiedAt.toISOString(),
      createdDate: info.createdAt.toLocaleDateString('ja-JP'),
      modifiedDate: info.modifiedAt.toLocaleDateString('ja-JP')
    }))
  };

  // ファイルに書き込み
  fs.writeFileSync(outputPath, JSON.stringify(videoList, null, 2));
  
  console.log(`✅ Video list generated: ${outputPath}`);
  console.log(`📊 Total videos: ${videoIds.length}`);

} catch (error) {
  console.error('❌ Error generating video list:', error);
  process.exit(1);
} 