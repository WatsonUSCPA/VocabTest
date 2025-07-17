import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container">
      <div style={{
        textAlign: 'center',
        padding: '2rem 0'
      }}>
        <h1 style={{
          fontSize: '28px',
          marginBottom: '1.5rem',
          color: '#333',
          fontWeight: 'bold'
        }}>
          動画で学ぶ英単語
        </h1>
        <p style={{
          fontSize: '16px',
          marginBottom: '2rem',
          color: '#666',
          lineHeight: '1.6',
          padding: '0 16px'
        }}>
          楽しく効率的に英単語を学習しましょう。YouTube動画やその他のコンテンツから、
          あなたのレベルに合わせた英単語テストを受けることができます。
        </p>
        
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
          marginTop: '2rem'
        }}>
          <div className="card" style={{
            textAlign: 'center',
            padding: '24px'
          }}>
            <h2 style={{
              color: '#007bff',
              marginBottom: '12px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              YouTubeから学ぶ
            </h2>
            <p style={{
              marginBottom: '20px',
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              YouTube動画から英単語を学習し、テストを受けることができます。
            </p>
            <Link to="/youtube" className="btn btn-primary" style={{ width: '100%' }}>
              学習を始める
            </Link>
          </div>
          
          <div className="card" style={{
            textAlign: 'center',
            padding: '24px'
          }}>
            <h2 style={{
              color: '#28a745',
              marginBottom: '12px',
              fontSize: '20px',
              fontWeight: 'bold'
            }}>
              その他から学ぶ
            </h2>
            <p style={{
              marginBottom: '20px',
              color: '#666',
              fontSize: '16px',
              lineHeight: '1.5'
            }}>
              様々なコンテンツから英単語を学習できます。
            </p>
            <Link to="/other" className="btn btn-secondary" style={{ width: '100%' }}>
              学習を始める
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 