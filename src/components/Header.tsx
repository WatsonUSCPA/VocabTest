import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { onAuthStateChanged, signInWithPopup, GoogleAuthProvider, signOut, User } from 'firebase/auth';

const Header: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

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
              gap: '2rem',
              alignItems: 'center'
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
              {user && (
                <li>
                  <Link to="/mypage" style={{
                    textDecoration: 'none',
                    color: '#333',
                    fontWeight: '600'
                  }}>
                    マイページ
                  </Link>
                </li>
              )}
              <li>
                {user ? (
                  <button onClick={handleLogout} style={{
                    padding: '6px 16px',
                    fontSize: '1rem',
                    background: '#eee',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    ログアウト（{user.displayName || 'ユーザー'}）
                  </button>
                ) : (
                  <button onClick={handleLogin} style={{
                    padding: '6px 16px',
                    fontSize: '1rem',
                    background: '#007bff',
                    color: '#fff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontWeight: 'bold'
                  }}>
                    ログイン
                  </button>
                )}
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header; 