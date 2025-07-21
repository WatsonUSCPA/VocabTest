import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAvailableVideos } from '../data/videos';
import { WordData, VideoData } from '../types';
import { 
  getYouTubeThumbnail, 
  getStandardThumbnail, 
  getMediumThumbnail,
  getDefaultThumbnail,
  getYouTubeInfo,
  YouTubeInfo
} from '../utils/youtube';
import { getVideoWordsPathWithFallback } from '../utils/pathUtils';

// 並び替えオプションの型定義
type SortOption = 'date' | 'alphabetical' | 'views' | 'title';

const YouTubeLearning: React.FC = () => {
  const [videoWords, setVideoWords] = useState<{ [key: string]: WordData[] }>({});
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [pendingNavigation, setPendingNavigation] = useState<string | null>(null);
  const [thumbnailErrors, setThumbnailErrors] = useState<{ [key: string]: number }>({});
  const [youtubeInfo, setYoutubeInfo] = useState<{ [key: string]: YouTubeInfo }>({});
  const [availableVideos, setAvailableVideos] = useState<VideoData[]>([]);
  const [videosLoading, setVideosLoading] = useState(true);
  const [sortOption, setSortOption] = useState<SortOption>('date');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const navigate = useNavigate();

  // 利用可能な動画を動的に読み込む
  useEffect(() => {
    const loadAvailableVideos = async () => {
      setVideosLoading(true);
      try {
        const videos = await getAvailableVideos();
        console.log('Available videos loaded:', videos);
        setAvailableVideos(videos);
      } catch (error) {
        console.error('Error loading available videos:', error);
        setAvailableVideos([]);
      }
      setVideosLoading(false);
    };

    loadAvailableVideos();
  }, []);

  // 動画を並び替える関数
  const sortVideos = useCallback((videos: VideoData[], option: SortOption, direction: 'asc' | 'desc'): VideoData[] => {
    const sortedVideos = [...videos];
    
    switch (option) {
      case 'date':
        // 作成日時順（video-list.jsonの順番を保持）
        // 既にソート済みなのでそのまま返す
        return direction === 'desc' ? sortedVideos : sortedVideos.reverse();
        
      case 'alphabetical':
        // 動画IDのアルファベット順
        sortedVideos.sort((a, b) => {
          const comparison = a.id.localeCompare(b.id);
          return direction === 'desc' ? -comparison : comparison;
        });
        break;
        
      case 'views':
        // 視聴回数順
        sortedVideos.sort((a, b) => {
          const viewsA = youtubeInfo[a.id]?.viewCount ? parseInt(youtubeInfo[a.id].viewCount || '0') : 0;
          const viewsB = youtubeInfo[b.id]?.viewCount ? parseInt(youtubeInfo[b.id].viewCount || '0') : 0;
          return direction === 'desc' ? viewsB - viewsA : viewsA - viewsB;
        });
        break;
        
      case 'title':
        // タイトル順
        sortedVideos.sort((a, b) => {
          const titleA = youtubeInfo[a.id]?.title || a.title || '';
          const titleB = youtubeInfo[b.id]?.title || b.title || '';
          const comparison = titleA.localeCompare(titleB);
          return direction === 'desc' ? -comparison : comparison;
        });
        break;
    }
    
    return sortedVideos;
  }, [youtubeInfo]);

  // 並び替えられた動画リスト
  const sortedVideos = sortVideos(availableVideos, sortOption, sortDirection);

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
    const video = availableVideos.find(v => v.id === videoId);
    const videoTitle = info?.title || video?.title || '';
    
    navigate('/youtube/level-select', { 
      state: { 
        videoId,
        videoTitle,
        words: videoWords[videoId] || []
      }
    });
  }, [videoWords, youtubeInfo, availableVideos, navigate]);

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
    const videoIds = availableVideos.map(video => video.id);
    videoIds.forEach(videoId => {
      if (!youtubeInfo[videoId]) {
        loadYouTubeInfo(videoId);
      }
    });
  }, [availableVideos, youtubeInfo, loadYouTubeInfo]);

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
      const url = await getVideoWordsPathWithFallback(videoId);
      console.log(`Fetching from: ${url}`);
      console.log(`Full URL: ${window.location.origin}${url}`);
      
      // まずファイルの存在確認
      const headResponse = await fetch(url, { method: 'HEAD' });
      console.log(`HEAD response status: ${headResponse.status}`);
      
      if (!headResponse.ok) {
        throw new Error(`File not found: ${headResponse.status} ${headResponse.statusText}`);
      }
      
      const response = await fetch(url);
      console.log(`GET response status: ${response.status}`);
      console.log(`Response ok: ${response.ok}`);
      
      if (response.ok) {
        const text = await response.text();
        console.log(`Response text preview: ${text.substring(0, 200)}...`);
        
        try {
          const words = JSON.parse(text);
          console.log(`Loaded ${words.length} words for video ${videoId}`);
          console.log('Sample words:', words.slice(0, 3));
          setVideoWords(prev => ({ ...prev, [videoId]: words }));
        } catch (parseError) {
          console.error('JSON parse error:', parseError);
          console.error('Response text:', text);
          throw new Error(`Invalid JSON format: ${parseError instanceof Error ? parseError.message : 'Unknown parse error'}`);
        }
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
      console.error('Error details:', {
        videoId,
        url: `/CaptionData/Youtube/${videoId}_words_with_meaning.json`,
        error: error instanceof Error ? error.message : error
      });
      setVideoWords(prev => ({ ...prev, [videoId]: [] }));
      setPendingNavigation(null);
      alert(`単語データの読み込み中にエラーが発生しました: ${error instanceof Error ? error.message : '不明なエラー'}`);
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

  if (videosLoading) {
    return (
      <div className="container">
        <div style={{
          textAlign: 'center',
          padding: '3rem',
          color: '#666'
        }}>
          動画データを読み込み中...
        </div>
      </div>
    );
  }

  if (availableVideos.length === 0) {
    return (
      <div className="container">
        <div className="card">
          <h2>利用可能な動画が見つかりません</h2>
          <p>CaptionDataディレクトリに動画データが存在することを確認してください。</p>
        </div>
      </div>
    );
  }

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
        color: '#666',
        marginBottom: '1rem',
        fontSize: '0.9rem'
      }}>
        動画をクリックして学習を開始してください
      </p>

      {/* 並び替えコントロール */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        gap: '1rem',
        marginBottom: '1.5rem',
        flexWrap: 'wrap',
        padding: '0 1rem'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <label style={{
            fontSize: '0.9rem',
            color: '#333',
            fontWeight: '500'
          }}>
            並び替え:
          </label>
          <select
            value={sortOption}
            onChange={(e) => setSortOption(e.target.value as SortOption)}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '0.9rem',
              backgroundColor: 'white',
              minWidth: '120px'
            }}
          >
            <option value="date">作成日時順</option>
            <option value="alphabetical">アルファベット順</option>
            <option value="views">視聴回数順</option>
            <option value="title">タイトル順</option>
          </select>
        </div>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.5rem',
          flexWrap: 'wrap',
          justifyContent: 'center'
        }}>
          <label style={{
            fontSize: '0.9rem',
            color: '#333',
            fontWeight: '500'
          }}>
            順序:
          </label>
          <select
            value={sortDirection}
            onChange={(e) => setSortDirection(e.target.value as 'asc' | 'desc')}
            style={{
              padding: '0.5rem',
              borderRadius: '4px',
              border: '1px solid #ddd',
              fontSize: '0.9rem',
              backgroundColor: 'white',
              minWidth: '120px'
            }}
          >
            <option value="desc">降順（新しい順）</option>
            <option value="asc">昇順（古い順）</option>
          </select>
        </div>

        <div style={{
          fontSize: '0.8rem',
          color: '#666',
          backgroundColor: '#f8f9fa',
          padding: '0.5rem',
          borderRadius: '4px',
          border: '1px solid #e9ecef',
          textAlign: 'center'
        }}>
          📊 {sortedVideos.length}件の動画
        </div>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1rem',
        maxHeight: '70vh',
        overflowY: 'auto',
        padding: '0.5rem'
      }}>
        {sortedVideos.map(video => {
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
                overflow: 'hidden',
                maxWidth: '100%'
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
                height: '180px',
                backgroundColor: '#f8f9fa',
                borderRadius: '8px',
                overflow: 'hidden',
                marginBottom: '1rem'
              }}>
                <img
                  src={thumbnailUrl}
                  alt={info?.title || video.title || `Video ${video.id}`}
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
                  fontSize: '0.7rem'
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
                  fontSize: '0.7rem',
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
                  fontSize: '0.8rem',
                  marginBottom: '0.5rem',
                  fontStyle: 'italic',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  whiteSpace: 'nowrap'
                }}>
                  📺 {info?.channelTitle || video.channelTitle}
                </p>
              )}

              {/* 視聴回数 */}
              {info?.viewCount && (
                <p style={{
                  color: '#888',
                  fontSize: '0.7rem',
                  marginBottom: '1rem'
                }}>
                  👁️ {parseInt(info.viewCount).toLocaleString()} 回視聴
                </p>
              )}

              {isLoading ? (
                <div style={{
                  textAlign: 'center',
                  padding: '1.5rem',
                  color: '#666'
                }}>
                  単語データを読み込み中...
                </div>
              ) : (
                <>
                  {/* 動画タイトル */}
                  <h3 style={{
                    fontSize: '1rem',
                    marginBottom: '1rem',
                    color: '#333',
                    minHeight: '2.2rem',
                    lineHeight: '1.3',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical'
                  }}>
                    {info?.title || video.title || (
                      <span style={{ color: '#999', fontStyle: 'italic' }}>
                        タイトル未設定
                      </span>
                    )}
                  </h3>

                  {/* レベル別統計 */}
                  {words.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <h4 style={{
                        fontSize: '0.8rem',
                        color: '#666',
                        marginBottom: '0.5rem'
                      }}>
                        レベル別単語数 ({words.length}語)
                      </h4>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.3rem'
                      }}>
                        {levelStats.map(stat => (
                          <span
                            key={stat.level}
                            style={{
                              backgroundColor: '#e9ecef',
                              color: '#495057',
                              padding: '0.2rem 0.4rem',
                              borderRadius: '0.25rem',
                              fontSize: '0.7rem'
                            }}
                          >
                            {stat.level}: {stat.count}語 ({stat.percentage}%)
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* 学習ボタン */}
                  <div style={{
                    textAlign: 'center',
                    marginTop: '1rem'
                  }}>
                    <button
                      className="btn btn-primary"
                      style={{
                        width: '100%',
                        fontSize: '0.9rem',
                        padding: '0.75rem'
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        loadVideoWords(video.id);
                      }}
                    >
                      {words.length > 0 ? 'この動画で学習' : '学習を開始'}
                    </button>
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default YouTubeLearning;