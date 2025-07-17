import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { User } from 'firebase/auth';
import { signInWithGoogle, signOutUser, onAuthStateChange } from '../firebase/authService';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    await signInWithGoogle();
  };

  const handleLogout = async () => {
    await signOutUser();
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header style={{
      backgroundColor: '#fff',
      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
      position: 'sticky',
      top: 0,
      zIndex: 1000
    }}>
      <div className="container">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          padding: '12px 0'
        }}>
          <Link to="/" style={{
            textDecoration: 'none',
            color: '#333'
          }}>
            <h1 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#007bff'
            }}>
              動画で学ぶ英単語
            </h1>
          </Link>
          
          {/* デスクトップメニュー */}
          <nav style={{ display: 'none' }}>
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              gap: '24px',
              alignItems: 'center'
            }}>
              <li>
                <Link to="/" style={{
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  ホーム
                </Link>
              </li>
              <li>
                <Link to="/youtube" style={{
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  YouTubeから学ぶ
                </Link>
              </li>
              <li>
                <Link to="/other" style={{
                  textDecoration: 'none',
                  color: '#333',
                  fontWeight: '600',
                  fontSize: '16px'
                }}>
                  その他から学ぶ
                </Link>
              </li>
              {user && (
                <li>
                  <Link to="/mypage" style={{
                    textDecoration: 'none',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '16px'
                  }}>
                    マイページ
                  </Link>
                </li>
              )}
              <li>
                {user ? (
                  <button onClick={handleLogout} style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    background: '#f8f9fa',
                    border: '1px solid #dee2e6',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    color: '#495057'
                  }}>
                    ログアウト
                  </button>
                ) : (
                  <button onClick={handleLogin} style={{
                    padding: '8px 16px',
                    fontSize: '14px',
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}>
                    ログイン
                  </button>
                )}
              </li>
            </ul>
          </nav>

          {/* モバイルメニューボタン */}
          <button
            onClick={toggleMenu}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '24px',
              cursor: 'pointer',
              padding: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            ☰
          </button>
        </div>

        {/* モバイルメニュー */}
        {isMenuOpen && (
          <nav style={{
            borderTop: '1px solid #e9ecef',
            paddingTop: '16px',
            paddingBottom: '16px'
          }}>
            <ul style={{
              listStyle: 'none',
              margin: 0,
              padding: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '16px'
            }}>
              <li>
                <Link 
                  to="/" 
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '16px',
                    padding: '12px 0',
                    display: 'block'
                  }}
                >
                  ホーム
                </Link>
              </li>
              <li>
                <Link 
                  to="/youtube" 
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '16px',
                    padding: '12px 0',
                    display: 'block'
                  }}
                >
                  YouTubeから学ぶ
                </Link>
              </li>
              <li>
                <Link 
                  to="/other" 
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    textDecoration: 'none',
                    color: '#333',
                    fontWeight: '600',
                    fontSize: '16px',
                    padding: '12px 0',
                    display: 'block'
                  }}
                >
                  その他から学ぶ
                </Link>
              </li>
              {user && (
                <li>
                  <Link 
                    to="/mypage" 
                    onClick={() => setIsMenuOpen(false)}
                    style={{
                      textDecoration: 'none',
                      color: '#333',
                      fontWeight: '600',
                      fontSize: '16px',
                      padding: '12px 0',
                      display: 'block'
                    }}
                  >
                    マイページ
                  </Link>
                </li>
              )}
              <li>
                {user ? (
                  <button 
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      background: '#f8f9fa',
                      border: '1px solid #dee2e6',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      color: '#495057',
                      textAlign: 'left'
                    }}
                  >
                    ログアウト（{user.displayName || 'ユーザー'}）
                  </button>
                ) : (
                  <button 
                    onClick={() => {
                      handleLogin();
                      setIsMenuOpen(false);
                    }}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      fontSize: '16px',
                      background: '#007bff',
                      color: '#fff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '600'
                    }}
                  >
                    ログイン
                  </button>
                )}
              </li>
            </ul>
          </nav>
        )}
      </div>

      {/* デスクトップ用のスタイル */}
      <style>{`
        @media (min-width: 768px) {
          nav:first-of-type {
            display: block !important;
          }
          button[onClick*="toggleMenu"] {
            display: none !important;
          }
        }
      `}</style>
    </header>
  );
};

export default Header; 