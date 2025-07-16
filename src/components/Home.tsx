import React from 'react';
import { Link } from 'react-router-dom';

const Home: React.FC = () => {
  return (
    <div className="container">
      <div style={{
        textAlign: 'center',
        padding: '4rem 0'
      }}>
        <h1 style={{
          fontSize: '3rem',
          marginBottom: '2rem',
          color: '#333'
        }}>
          動画で学ぶ英単語
        </h1>
        <p style={{
          fontSize: '1.2rem',
          marginBottom: '3rem',
          color: '#666',
          maxWidth: '600px',
          margin: '0 auto 3rem'
        }}>
          楽しく効率的に英単語を学習しましょう。YouTube動画やその他のコンテンツから、
          あなたのレベルに合わせた英単語テストを受けることができます。
        </p>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          marginTop: '3rem'
        }}>
          <div className="card" style={{
            textAlign: 'center',
            padding: '2rem'
          }}>
            <h2 style={{
              color: '#007bff',
              marginBottom: '1rem'
            }}>
              YouTubeから学ぶ
            </h2>
            <p style={{
              marginBottom: '2rem',
              color: '#666'
            }}>
              YouTube動画から英単語を学習し、テストを受けることができます。
            </p>
            <Link to="/youtube" className="btn btn-primary">
              学習を始める
            </Link>
          </div>
          
          <div className="card" style={{
            textAlign: 'center',
            padding: '2rem'
          }}>
            <h2 style={{
              color: '#28a745',
              marginBottom: '1rem'
            }}>
              その他から学ぶ
            </h2>
            <p style={{
              marginBottom: '2rem',
              color: '#666'
            }}>
              様々なコンテンツから英単語を学習できます。
            </p>
            <Link to="/other" className="btn btn-secondary">
              学習を始める
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home; 