const fs = require('fs');
const path = require('path');

// CaptionDataフォルダのパス
const captionDataPath = path.join(__dirname, '../public/CaptionData/Youtube');

console.log('🔍 Adding update dates to JSON files...');

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

  console.log(`📄 Found ${jsonFiles.length} JSON files to process`);

  // 各ファイルに更新日時を追加
  jsonFiles.forEach(file => {
    const filePath = path.join(captionDataPath, file);
    
    try {
      // ファイルを読み取り
      const fileContent = fs.readFileSync(filePath, 'utf8');
      const jsonData = JSON.parse(fileContent);
      
      // 既に更新日時があるかチェック
      if (jsonData[0] && jsonData[0].video_info && jsonData[0].video_info.updated_at) {
        console.log(`✅ ${file}: Update date already exists`);
        return;
      }
      
      // 更新日時を追加
      if (jsonData[0] && jsonData[0].video_info) {
        jsonData[0].video_info.updated_at = new Date().toISOString();
        console.log(`📝 ${file}: Added update date`);
      } else {
        console.log(`⚠️  ${file}: No video_info found, skipping`);
        return;
      }
      
      // ファイルに書き戻し
      fs.writeFileSync(filePath, JSON.stringify(jsonData, null, 2));
      console.log(`💾 ${file}: Saved successfully`);
      
    } catch (error) {
      console.error(`❌ Error processing ${file}:`, error.message);
    }
  });

  console.log('✅ Finished adding update dates');

} catch (error) {
  console.error('❌ Error:', error);
  process.exit(1);
} 