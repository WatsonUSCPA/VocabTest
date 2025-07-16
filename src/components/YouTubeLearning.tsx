import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { videos } from '../data/videos';
import { WordData } from '../types';
import { 
  getYouTubeThumbnail, 
  getStandardThumbnail, 
  getMediumThumbnail,
  getDefaultThumbnail,
  getYouTubeInfo,
  YouTubeInfo
} from '../utils/youtube';

const YouTubeLearning: React.FC = () => {
  const [videoWords, setVideoWords] = useState<{ [key: string]: WordData[] }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [thumbnailErrors, setThumbnailErrors] = useState<{ [key: string]: number }>({});
  const [youtubeInfo, setYoutubeInfo] = useState<{ [key: string]: YouTubeInfo }>({});
  const navigate = useNavigate();

  // YouTube情報を取得
  const loadYouTubeInfo = useCallback(async (videoId: string) => {
    if (youtubeInfo[videoId]) {
      console.log(`YouTube info already loaded for ${videoId}`);
      return;
    }

    console.log(`Loading YouTube info for ${videoId}`);
    try {
      const info = await getYouTubeInfo(videoId);
      if (info) {
        console.log(`Successfully loaded YouTube info for ${videoId}:`, info);
        setYoutubeInfo(prev => ({ ...prev, [videoId]: info }));
      } else {
        console.log(`Failed to load YouTube info for ${videoId}, using fallback`);
      }
    } catch (error) {
      console.error('Error loading YouTube info:', error);
    }
  }, [youtubeInfo]);

  const handleVideoSelect = useCallback((videoId: string) => {
    console.log(`Video selected: ${videoId}`);
    console.log(`Words for this video:`, videoWords[videoId]);
    
    const info = youtubeInfo[videoId];
    const videoTitle = info?.title || videos.find(v => v.id === videoId)?.title || '';
    
    navigate('/youtube/level-select', { 
      state: { 
        videoId,
        videoTitle,
        words: videoWords[videoId] || []
      }
    });
  }, [videoWords, youtubeInfo, navigate]);

  // 状態の変更を監視して遷移を処理
  useEffect(() => {
    if (pendingNavigation && videoWords[pendingNavigation] && videoWords[pendingNavigation].length > 0) {
      console.log(`Navigating to level select with ${videoWords[pendingNavigation].length} words`);
      handleVideoSelect(pendingNavigation);
      setPendingNavigation(null);
    }
  }, [videoWords, pendingNavigation, handleVideoSelect]);

  // 動画IDの配列を監視してYouTube情報を読み込み
  useEffect(() => {
    const videoIds = videos.map(video => video.id);
    videoIds.forEach(videoId => {
      if (!youtubeInfo[videoId]) {
        loadYouTubeInfo(videoId);
      }
    });
  }, [youtubeInfo, loadYouTubeInfo]);

  // サムネイルURLを取得（フォールバック付き）
  const getThumbnailUrl = (videoId: string): string => {
    const errorCount = thumbnailErrors[videoId] || 0;
    
    switch (errorCount) {
      case 0:
        return getYouTubeThumbnail(videoId); // maxresdefault.jpg
      case 1:
        return getStandardThumbnail(videoId); // hqdefault.jpg
      case 2:
        return getMediumThumbnail(videoId); // mqdefault.jpg
      case 3:
        return getDefaultThumbnail(videoId); // default.jpg
      default:
        return getDefaultThumbnail(videoId); // 最終フォールバック
    }
  };

  // サムネイルエラーハンドラー
  const handleThumbnailError = (videoId: string) => {
    const currentErrors = thumbnailErrors[videoId] || 0;
    const nextErrorCount = currentErrors + 1;
    
    console.log(`Thumbnail error for ${videoId}, trying fallback ${nextErrorCount}`);
    setThumbnailErrors(prev => ({ ...prev, [videoId]: nextErrorCount }));
  };

  // 動画の単語データを読み込む
  const loadVideoWords = async (videoId: string) => {
    if (videoWords[videoId] && videoWords[videoId].length > 0) {
      // 既に読み込み済みの場合は直接遷移
      handleVideoSelect(videoId);
      return;
    }

    console.log(`Loading words for video: ${videoId}`);
    setLoading(prev => ({ ...prev, [videoId]: true }));
    setPendingNavigation(videoId);
    
    try {
      const url = `./CaptionData/Youtube/${videoId}_words_with_meaning.json`;
      console.log(`Fetching from: ${url}`);
      
      const response = await fetch(url);
      console.log(`Response status: ${response.status}`);
      console.log(`Response ok: ${response.ok}`);
      
      if (response.ok) {
        const words = await response.json();
        console.log(`Loaded ${words.length} words for video ${videoId}`);
        console.log('Sample words:', words.slice(0, 3));
        setVideoWords(prev => ({ ...prev, [videoId]: words }));
      } else {
        console.error('Failed to load video words');
        console.error('Response status:', response.status);
        console.error('Response status text:', response.statusText);
        setVideoWords(prev => ({ ...prev, [videoId]: [] }));
        setPendingNavigation(null);
        alert('単語データの読み込みに失敗しました');
      }
    } catch (error) {
      console.error('Error loading video words:', error);
      setVideoWords(prev => ({ ...prev, [videoId]: [] }));
      setPendingNavigation(null);
      alert('単語データの読み込み中にエラーが発生しました');
    }
    setLoading(prev => ({ ...prev, [videoId]: false }));
  };

  // レベル別の単語数を計算
  const getLevelStats = (words: WordData[]) => {
    const levelCounts: { [key: string]: number } = {};
    const total = words.length;
    
    words.forEach(word => {
      levelCounts[word.level] = (levelCounts[word.level] || 0) + 1;
    });

    return Object.entries(levelCounts).map(([level, count]) => ({
      level,
      count,
      percentage: Math.round((count / total) * 100)
    })).sort((a, b) => a.level.localeCompare(b.level));
  };

  return (
    <div className="container">
      <h1 style={{
        textAlign: 'center',
        marginBottom: '2rem',
        color: '#333'
      }}>
        YouTubeから学ぶ
      </h1>

      <p style={{
        textAlign: 'center',
        fontSize: '1.1rem',
        color: '#666',
        marginBottom: '3rem'
      }}>
        学習したいYouTube動画を選択してください
      </p>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(400px, 1fr))',
        gap: '2rem',
        maxHeight: '70vh',
        overflowY: 'auto',
        padding: '1rem'
      }}>
        {videos.map(video => {
          const words = videoWords[video.id] || [];
          const levelStats = getLevelStats(words);
          const isLoading = loading[video.id];
          const thumbnailUrl = getThumbnailUrl(video.id);
          const info = youtubeInfo[video.id];

          return (
            <div 
              key={video.id}
              className="card"
              style={{
                cursor: 'pointer',
                transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                border: '2px solid transparent',
                overflow: 'hidden'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
                e.currentTarget.style.borderColor = '#007bff';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.1)';
                e.currentTarget.style.borderColor = 'transparent';
              }}
              onClick={() => {
                loadVideoWords(video.id);
              }}
            >
              {/* YouTubeサムネイル */}
              <div style={{
                position: 'relative',
                width: '100%',
                height: '200px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '1rem'
              }}>
                <img
                  src={thumbnailUrl}
                  alt={info?.title || video.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover'
                  }}
                  onLoad={() => {
                    console.log(`Thumbnail loaded successfully for ${video.id}: ${thumbnailUrl}`);
                  }}
                  onError={() => {
                    handleThumbnailError(video.id);
                  }}
                />
                <div style={{
                  position: 'absolute',
                  top: '10px',
                  right: '10px',
                  backgroundColor: 'rgba(0,0,0,0.7)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem'
                }}>
                  {video.id}
                </div>
                {/* YouTubeリンク */}
                <div style={{
                  position: 'absolute',
                  bottom: '10px',
                  left: '10px',
                  backgroundColor: 'rgba(255,0,0,0.8)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '4px',
                  fontSize: '0.8rem',
                  cursor: 'pointer'
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank');
                }}
                >
                  YouTubeで見る
                </div>
              </div>

              {/* チャンネル名 */}
              {(info?.channelTitle || video.channelTitle) && (
                <p style={{
                  color: '#666',
                  fontSize: '0.9rem',
                  marginBottom: '0.5rem',
                  fontStyle: 'italic'
                }}>
                  📺 {info?.channelTitle || video.channelTitle}
                </p>
              )}

              {/* 視聴回数 */}
              {info?.viewCount && (
                <p style={{
                  color: '#888',
                  fontSize: '0.8rem',
                  marginBottom: '1rem'
                }}>
                  👁️ {parseInt(info.viewCount).toLocaleString()} 回視聴
                </p>
              )}

              {isLoading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#666'
                }}>
                  単語データを読み込み中...
                </div>
              ) : words.length > 0 ? (
                <div>
                  <div style={{
                    marginBottom: '1rem',
                    padding: '0.5rem',
                    backgroundColor: '#f8f9fa',
                    borderRadius: '6px'
                  }}>
                    <strong>総単語数: {words.length}語</strong>
                  </div>
                  
                  <div style={{ marginBottom: '1rem' }}>
                    <h4 style={{
                      fontSize: '1rem',
                      marginBottom: '0.5rem',
                      color: '#333'
                    }}>
                      レベル別分布:
                    </h4>
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: 'repeat(2, 1fr)',
                      gap: '0.5rem'
                    }}>
                      {levelStats.map(stat => (
                        <div key={stat.level} style={{
                          display: 'flex',
                          justifyContent: 'space-between',
                          padding: '0.25rem 0.5rem',
                          backgroundColor: '#e9ecef',
                          borderRadius: '4px',
                          fontSize: '0.9rem'
                        }}>
                          <span style={{ fontWeight: 'bold' }}>{stat.level}:</span>
                          <span>{stat.count}語 ({stat.percentage}%)</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{
                  textAlign: 'center',
                  padding: '1rem',
                  color: '#666'
                }}>
                  クリックして単語データを読み込み
                </div>
              )}

              <div style={{
                textAlign: 'center',
                marginTop: '1rem'
              }}>
                <button
                  className="btn btn-primary"
                  style={{
                    width: '100%',
                    fontSize: '1rem'
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    loadVideoWords(video.id);
                  }}
                >
                  {words.length > 0 ? 'この動画で学習' : '学習を開始'}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YouTubeLearning;