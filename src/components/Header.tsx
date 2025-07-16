import React from 'react';
import { Link } from 'react-router-dom';

const Header: React.FC = () => {
  return (
    <header style={{
      backgroundColor: '#fff',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      padding: '1rem 0',
      marginBottom: '2rem'
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <Link to="/" style={{
            textDecoration: 'none',
            color: '#333'
          }}>
            <h1 style={{
              margin: 0,
              fontSize: '2rem',
              fontWeight: 'bold',
              color: '#007bff'
            }}>
              動画で学ぶ英単語
            </h1>
          </Link>
          <nav>
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              gap: '2rem'
            }}>
              <li>
                <Link to="/" style={{
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  ホーム
                </Link>
              </li>
              <li>
                <Link to="/youtube" style={{
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  YouTubeから学ぶ
                </Link>
              </li>
              <li>
                <Link to="/other" style={{
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: '600'
                }}>
                  その他から学ぶ
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 