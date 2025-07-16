import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { filterWordsByLevel, getRandomWords } from '../data/videos';
import { WordData, TestQuestion } from '../types';

const LevelSelect: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [selectedLevel, setSelectedLevel] = useState('all');
  const [selectedWordCount, setSelectedWordCount] = useState(10);
  const [words, setWords] = useState<WordData[]>([]);
  const [loading, setLoading] = useState(false);

  const videoId: string = location.state?.videoId || '';
  const videoTitle: string = location.state?.videoTitle || '';
  const initialWords: WordData[] = location.state?.words || [];

  // 問題数の選択肢
  const wordCountOptions = [5, 10, 15, 20, 25, 30];

  // 初期化時に単語データを設定
  useEffect(() => {
    console.log('LevelSelect component mounted');
    console.log('Video ID:', videoId);
    console.log('Video Title:', videoTitle);
    console.log('Initial words received:', initialWords);
    console.log('Initial words length:', initialWords.length);
    
    if (initialWords.length > 0) {
      setWords(initialWords);
    } else if (videoId) {
      // 単語データが渡されていない場合は再読み込み
      loadVideoWords(videoId);
    }
  }, [videoId, videoTitle, initialWords]);

  // 単語データを再読み込み
  const loadVideoWords = async (videoId: string) => {
    console.log(`Reloading words for video: ${videoId}`);
    setLoading(true);
    
    try {
      const url = `/CaptionData/Youtube/${videoId}_words_with_meaning.json`;
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
        correctAnswer: word.definition_ja,
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
        videoId
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
          <h3 style={{
            color: '#007bff',
            marginBottom: '0.5rem'
          }}>
            {videoTitle}
          </h3>
          <p style={{ margin: 0, color: '#666' }}>
            総単語数: {words.length}語
          </p>
        </div>

        {/* 問題数選択 */}
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
            学習する単語数を選択
          </h3>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(80px, 1fr))',
            gap: '0.5rem'
          }}>
            {wordCountOptions.map(count => (
              <button
                key={count}
                className="btn"
                style={{
                  backgroundColor: selectedWordCount === count ? '#007bff' : '#fff',
                  color: selectedWordCount === count ? '#fff' : '#333',
                  border: '2px solid #007bff',
                  fontSize: '1rem',
                  padding: '0.5rem',
                  cursor: 'pointer'
                }}
                onClick={() => setSelectedWordCount(count)}
                disabled={count > availableWordCount}
              >
                {count}語
              </button>
            ))}
          </div>
          <p style={{
            marginTop: '0.5rem',
            fontSize: '0.9rem',
            color: '#666'
          }}>
            選択したレベルで利用可能: {availableWordCount}語
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          {/* すべてのレベル */}
          <div 
            className="card"
            style={{
              cursor: 'pointer',
              border: selectedLevel === 'all' ? '3px solid #007bff' : '2px solid #ddd',
              transition: 'all 0.2s ease'
            }}
            onClick={() => setSelectedLevel('all')}
          >
            <h3 style={{
              color: '#007bff',
              marginBottom: '1rem',
              textAlign: 'center'
            }}>
              すべてのレベル
            </h3>
            <div style={{
              textAlign: 'center',
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#007bff',
              marginBottom: '0.5rem'
            }}>
              {words.length}語
            </div>
            <div style={{
              textAlign: 'center',
              color: '#666'
            }}>
              全レベルから出題
            </div>
          </div>

          {/* 各レベル */}
          {levelStats.map(stat => (
            <div 
              key={stat.level}
              className="card"
              style={{
                cursor: 'pointer',
                border: selectedLevel === stat.level ? '3px solid #007bff' : '2px solid #ddd',
                transition: 'all 0.2s ease'
              }}
              onClick={() => setSelectedLevel(stat.level)}
            >
              <h3 style={{
                color: getLevelColor(stat.level),
                marginBottom: '1rem',
                textAlign: 'center'
              }}>
                レベル {stat.level}
              </h3>
              <div style={{
                textAlign: 'center',
                fontSize: '2rem',
                fontWeight: 'bold',
                color: getLevelColor(stat.level),
                marginBottom: '0.5rem'
              }}>
                {stat.count}語
              </div>
              <div style={{
                textAlign: 'center',
                color: '#666',
                marginBottom: '0.5rem'
              }}>
                {stat.percentage}%
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                backgroundColor: '#e9ecef',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <div style={{
                  width: `${stat.percentage}%`,
                  height: '100%',
                  backgroundColor: getLevelColor(stat.level),
                  transition: 'width 0.3s ease'
                }} />
              </div>
            </div>
          ))}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <button
            className="btn btn-primary"
            onClick={startLearning}
            disabled={!selectedLevel || words.length === 0 || selectedWordCount > availableWordCount}
            style={{
              fontSize: '1.2rem',
              padding: '15px 40px'
            }}
          >
            {selectedWordCount}語で学習を開始
          </button>
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '1rem'
        }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/youtube')}
            style={{
              fontSize: '1rem',
              padding: '10px 20px'
            }}
          >
            動画選択に戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default LevelSelect; 