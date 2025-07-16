import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const LearningComplete: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const totalWords: number = location.state?.totalWords || 0;
  const learnedWords: number = location.state?.learnedWords || 0;
  const videoTitle: string = location.state?.videoTitle || '';
  const level: string = location.state?.level || '';
  const videoId: string = location.state?.videoId || '';

  const completionRate = Math.round((learnedWords / totalWords) * 100);

  return (
    <div className="container">
      <div className="card">
        <h1 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#333'
        }}>
          学習完了！
        </h1>

        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            fontSize: '4rem',
            fontWeight: 'bold',
            color: '#28a745',
            marginBottom: '1rem'
          }}>
            🎉
          </div>
          <h2 style={{
            color: '#28a745',
            marginBottom: '1rem'
          }}>
            お疲れさまでした！
          </h2>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '2rem'
          }}>
            {videoTitle && `${videoTitle} - `}レベル: {level}
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1.5rem',
          marginBottom: '3rem'
        }}>
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#d4edda',
            borderRadius: '12px',
            border: '2px solid #28a745'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#28a745',
              marginBottom: '0.5rem'
            }}>
              {learnedWords}
            </div>
            <div style={{
              fontSize: '1.1rem',
              color: '#155724',
              fontWeight: '600'
            }}>
              学習した単語
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#e2e3e5',
            borderRadius: '12px',
            border: '2px solid #6c757d'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#6c757d',
              marginBottom: '0.5rem'
            }}>
              {totalWords}
            </div>
            <div style={{
              fontSize: '1.1rem',
              color: '#495057',
              fontWeight: '600'
            }}>
              総単語数
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            padding: '2rem',
            backgroundColor: '#cce5ff',
            borderRadius: '12px',
            border: '2px solid #007bff'
          }}>
            <div style={{
              fontSize: '3rem',
              fontWeight: 'bold',
              color: '#007bff',
              marginBottom: '0.5rem'
            }}>
              {completionRate}%
            </div>
            <div style={{
              fontSize: '1.1rem',
              color: '#004085',
              fontWeight: '600'
            }}>
              完了率
            </div>
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginBottom: '2rem'
        }}>
          <div style={{
            padding: '1.5rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '8px',
            border: '2px solid #dee2e6'
          }}>
            <h3 style={{
              color: '#333',
              marginBottom: '1rem'
            }}>
              学習の振り返り
            </h3>
            <p style={{
              color: '#666',
              lineHeight: '1.6',
              margin: 0
            }}>
              {completionRate >= 80 ? (
                '素晴らしい学習でした！多くの単語を覚えることができましたね。'
              ) : completionRate >= 60 ? (
                'よく頑張りました！もう一度復習すると、さらに理解が深まりますよ。'
              ) : (
                '学習を始めることができました！継続することで、確実に力がついていきます。'
              )}
            </p>
          </div>
        </div>

        <div style={{
          display: 'flex',
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {videoId && (
            <button
              className="btn btn-success"
              onClick={() => window.open(`https://www.youtube.com/watch?v=${videoId}`, '_blank')}
              style={{
                fontSize: '1.1rem',
                padding: '12px 24px',
                backgroundColor: '#28a745',
                borderColor: '#28a745'
              }}
            >
              🎥 動画を見に行く
            </button>
          )}
          
          <button
            className="btn btn-primary"
            onClick={() => navigate('/youtube')}
            style={{
              fontSize: '1.1rem',
              padding: '12px 24px'
            }}
          >
            別の動画で学習
          </button>
          
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/')}
            style={{
              fontSize: '1.1rem',
              padding: '12px 24px'
            }}
          >
            ホームに戻る
          </button>
        </div>
      </div>
    </div>
  );
};

export default LearningComplete; 