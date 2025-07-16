import React from 'react';

const OtherLearning: React.FC = () => {
  return (
    <div className="container">
      <div className="card">
        <h1 style={{
          textAlign: 'center',
          marginBottom: '2rem',
          color: '#333'
        }}>
          その他から学ぶ
        </h1>
        
        <div style={{
          textAlign: 'center',
          padding: '3rem 0'
        }}>
          <p style={{
            fontSize: '1.2rem',
            color: '#666',
            marginBottom: '2rem'
          }}>
            この機能は現在開発中です。
          </p>
          <p style={{
            color: '#666'
          }}>
            今後、様々なコンテンツから英単語を学習できる機能を追加予定です。
          </p>
        </div>
      </div>
    </div>
  );
};

export default OtherLearning; 