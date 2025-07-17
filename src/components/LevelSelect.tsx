import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { filterWordsByLevel, getRandomWords } from '../data/videos';
import { WordData, TestQuestion } from '../types';
import { getVideoWordsPathWithFallback } from '../utils/pathUtils';

const LevelSelect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedWordCount, setSelectedWordCount] = useState(10); // 選択可能に変更
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);

  const videoId: string = location.state?.videoId || '';
  const videoTitle: string = location.state?.videoTitle || '';

  // 単語数オプション
  const wordCountOptions = [5, 10, 15, 20, 25, 30, 50];

  // 初期化時に単語データを設定
  useEffect(() => {
    console.log('LevelSelect component mounted');
    console.log('Video ID:', videoId);
    console.log('Video Title:', videoTitle);
    
    const initialWords: WordData[] = location.state?.words || [];
    console.log('Initial words received:', initialWords);
    console.log('Initial words length:', initialWords.length);
    
    if (initialWords.length > 0) {
      setWords(initialWords);
    } else if (videoId) {
      // 単語データが渡されていない場合は再読み込み
      loadVideoWords(videoId);
    }
  }, [videoId, videoTitle, location.state?.words]);

  // 単語データを再読み込み
  const loadVideoWords = async (videoId: string) => {
    console.log(`Reloading words for video: ${videoId}`);
    setLoading(true);
    
    try {
      const url = await getVideoWordsPathWithFallback(videoId);
      const response = await fetch(url);
      
      if (response.ok) {
        const loadedWords = await response.json();
        console.log(`Reloaded ${loadedWords.length} words for video ${videoId}`);
        setWords(loadedWords);
      } else {
        console.error('Failed to reload video words');
        setWords([]);
      }
    } catch (error) {
      console.error('Error reloading video words:', error);
      setWords([]);
    }
    
    setLoading(false);
  };

  // レベル別の単語数を計算
  const getLevelStats = () => {
    const levelCounts: { [key: string]: number } = {};
    const total = words.length;
    
    console.log('Calculating level stats for', total, 'words');
    
    words.forEach(word => {
      levelCounts[word.level] = (levelCounts[word.level] || 0) + 1;
    });

    const stats = Object.entries(levelCounts).map(([level, count]) => ({
      level,
      count,
      percentage: Math.round((count / total) * 100)
    })).sort((a, b) => a.level.localeCompare(b.level));

    console.log('Level stats:', stats);
    return stats;
  };

  const levelStats = getLevelStats();

  // 選択されたレベルで利用可能な単語数を取得
  const getAvailableWordCount = () => {
    const filteredWords = filterWordsByLevel(words, selectedLevel);
    return filteredWords.length;
  };

  // 単語の日本語意味を取得（新形式と旧形式に対応）
  const getJapaneseMeaning = (word: WordData): string => {
    if (word.meanings_ja && word.meanings_ja.length > 0) {
      return word.meanings_ja.join('、');
    }
    return word.definition_ja || '意味が見つかりません';
  };

  const startLearning = () => {
    console.log('Starting learning with level:', selectedLevel, 'word count:', selectedWordCount);
    const filteredWords = filterWordsByLevel(words, selectedLevel);
    console.log('Filtered words:', filteredWords.length);
    
    if (filteredWords.length === 0) {
      alert('選択したレベルに単語がありません');
      return;
    }

    // 学習用の単語を生成
    const learningWords = getRandomWords(filteredWords, Math.min(selectedWordCount, filteredWords.length));
    const questions: TestQuestion[] = learningWords.map(word => {
      return {
        word: word.word,
        correctAnswer: getJapaneseMeaning(word),
        options: [], // 学習形式では選択肢は不要
        level: word.level
      };
    });

    console.log('Generated learning words:', questions.length);

    // 学習ページに遷移
    navigate('/test', {
      state: {
        questions,
        videoTitle,
        level: selectedLevel,
        videoId,
        originalWords: learningWords // 元の単語データも渡す
      }
    });
  };

  const getLevelColor = (level: string) => {
    const colors: { [key: string]: string } = {
      'A1': '#28a745',
      'A2': '#20c997',
      'B1': '#17a2b8',
      'B2': '#007bff',
      'C1': '#6f42c1',
      'C2': '#e83e8c'
    };
    return colors[level] || '#6c757d';
  };

  const availableWordCount = getAvailableWordCount();

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <div style={{
            textAlign: 'center',
            padding: '3rem',
            color: '#666'
          }}>
            単語データを読み込み中...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <h1 style={{
          textAlign: 'center',
          marginBottom: '1rem',
          color: '#333'
        }}>
          学習設定
        </h1>

        <div style={{
          textAlign: 'center',
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          {videoTitle && (
            <h3 style={{
              color: '#007bff',
              marginBottom: '0.5rem'
            }}>
              {videoTitle}
            </h3>
          )}
          <p style={{ margin: 0, color: '#666' }}>
            総単語数: {words.length}語
          </p>
        </div>

        {/* レベル選択 */}
        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3 style={{
            marginBottom: '1rem',
            color: '#333'
          }}>
            レベル別単語数
          </h3>
          {/* レベル別統計（クリック可能なカード） */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '1rem'
          }}>
            {/* すべてのレベルカード */}
            <div
              onClick={() => setSelectedLevel('all')}
              style={{
                padding: '1rem',
                backgroundColor: selectedLevel === 'all' ? '#007bff' : 'white',
                borderRadius: '8px',
                border: selectedLevel === 'all' ? '3px solid #007bff' : '2px solid #dee2e6',
                textAlign: 'center',
                boxShadow: selectedLevel === 'all' ? '0 4px 8px rgba(0,123,255,0.3)' : '0 2px 4px rgba(0,0,0,0.1)',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              onMouseEnter={(e) => {
                if (selectedLevel !== 'all') {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                }
              }}
              onMouseLeave={(e) => {
                if (selectedLevel !== 'all') {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                }
              }}
            >
              <div style={{
                fontSize: '1.5rem',
                fontWeight: 'bold',
                color: selectedLevel === 'all' ? 'white' : '#007bff',
                marginBottom: '0.5rem'
              }}>
                すべて
              </div>
              <div style={{
                fontSize: '1.2rem',
                color: selectedLevel === 'all' ? 'white' : '#333',
                marginBottom: '0.25rem',
                fontWeight: '600'
              }}>
                {words.length}語
              </div>
              <div style={{
                fontSize: '0.9rem',
                color: selectedLevel === 'all' ? 'rgba(255,255,255,0.8)' : '#666',
                backgroundColor: selectedLevel === 'all' ? 'rgba(255,255,255,0.2)' : '#f8f9fa',
                padding: '0.25rem 0.5rem',
                borderRadius: '4px',
                display: 'inline-block'
              }}>
                100%
              </div>
            </div>

            {levelStats.map(stat => (
              <div
                key={stat.level}
                onClick={() => setSelectedLevel(stat.level)}
                style={{
                  padding: '1rem',
                  backgroundColor: selectedLevel === stat.level ? getLevelColor(stat.level) : 'white',
                  borderRadius: '8px',
                  border: selectedLevel === stat.level ? `3px solid ${getLevelColor(stat.level)}` : `2px solid ${getLevelColor(stat.level)}`,
                  textAlign: 'center',
                  boxShadow: selectedLevel === stat.level ? `0 4px ${getLevelColor(stat.level)}40` : '0 2px 4px rgba(0,0,0,0.1)',
                  transition: 'all 0.2s ease',
                  cursor: 'pointer'
                }}
                onMouseEnter={(e) => {
                  if (selectedLevel !== stat.level) {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 4px 8px rgba(0,0,0,0.15)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedLevel !== stat.level) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }
                }}
              >
                <div style={{
                  fontSize: '1.5rem',
                  fontWeight: 'bold',
                  color: selectedLevel === stat.level ? 'white' : getLevelColor(stat.level),
                  marginBottom: '0.5rem'
                }}>
                  {stat.level}
                </div>
                <div style={{
                  fontSize: '1.2rem',
                  color: selectedLevel === stat.level ? 'white' : '#333',
                  marginBottom: '0.25rem',
                  fontWeight: '600'
                }}>
                  {stat.count}語
                </div>
                <div style={{
                  fontSize: '0.9rem',
                  color: selectedLevel === stat.level ? 'rgba(255,255,255,0.8)' : '#666',
                  backgroundColor: selectedLevel === stat.level ? 'rgba(255,255,255,0.2)' : '#f8f9fa',
                  padding: '0.25rem 0.5rem',
                  borderRadius: '4px',
                  display: 'inline-block'
                }}>
                  {stat.percentage}%
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* 単語数選択 */}
        <div style={{
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px'
        }}>
          <h3 style={{
            marginBottom: '1rem',
            color: '#333'
          }}>
            学習する単語数
          </h3>
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '0.5rem',
            justifyContent: 'center'
          }}>
            {wordCountOptions.map(count => (
              <button
                key={count}
                onClick={() => setSelectedWordCount(count)}
                style={{
                  padding: '0.75rem 1.5rem',
                  backgroundColor: selectedWordCount === count ? '#007bff' : 'white',
                  color: selectedWordCount === count ? 'white' : '#007bff',
                  border: selectedWordCount === count ? '2px solid #007bff' : '2px solid #dee2e6',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '1rem',
                  fontWeight: '600',
                  transition: 'all 0.2s ease',
                  minWidth: '60px'
                }}
                onMouseEnter={(e) => {
                  if (selectedWordCount !== count) {
                    e.currentTarget.style.transform = 'translateY(-1px)';
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.1)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedWordCount !== count) {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = 'none';
                  }
                }}
              >
                {count}語
              </button>
            ))}
          </div>
          <p style={{
            textAlign: 'center',
            marginTop: '1rem',
            color: '#666',
            fontSize: '0.9rem'
          }}>
            選択したレベル: {selectedLevel === 'all' ? 'すべて' : selectedLevel} | 
            利用可能: {availableWordCount}語 | 
            学習予定: {Math.min(selectedWordCount, availableWordCount)}語
          </p>
        </div>

        {/* 学習開始ボタン */}
        <div style={{
          textAlign: 'center',
          padding: '1rem'
        }}>
          <button
            className="btn btn-primary"
            onClick={startLearning}
            disabled={availableWordCount === 0}
            style={{
              fontSize: '1.2rem',
              padding: '15px 40px',
              opacity: availableWordCount === 0 ? 0.6 : 1
            }}
          >
            {availableWordCount > 0 
              ? `${Math.min(selectedWordCount, availableWordCount)}語で学習開始` 
              : '利用可能な単語がありません'
            }
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect; 