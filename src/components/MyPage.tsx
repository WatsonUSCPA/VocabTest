import React, { useEffect, useState } from 'react';
import { onAuthStateChange, getUserProfile, UserProfile } from '../firebase/authService';
import { User } from 'firebase/auth';

const MyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) {
        setLoading(false);
        return;
      }
      
      setError(null);
      
      try {
        const userProfile = await getUserProfile(user.uid);
        setProfile(userProfile);
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        setError(error instanceof Error ? error.message : 'プロフィールの取得に失敗しました');
      }
      setLoading(false);
    };

    if (user) {
      fetchProfile();
    }
  }, [user]);

  if (!user) {
    return (
      <div className="container">
        <div className="card">
          <h2>マイページ</h2>
          <p>ログインしてください。</p>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="container">
        <div className="card">
          <h2>マイページ</h2>
          <p>読み込み中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <div className="card">
          <h2>マイページ</h2>
          <p style={{ color: 'red' }}>エラー: {error}</p>
          <button 
            onClick={() => window.location.reload()} 
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#007bff',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            再試行
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 800, margin: '2rem auto', padding: '2rem' }}>
        <h2 style={{ marginBottom: '2rem', color: '#333' }}>マイページ</h2>
        
        {/* ユーザー情報 */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          marginBottom: '2rem',
          padding: '1.5rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '12px'
        }}>
          {user.photoURL && (
            <img
              src={user.photoURL}
              alt="Profile"
              style={{
                width: '80px',
                height: '80px',
                borderRadius: '50%',
                marginRight: '1.5rem',
                border: '3px solid #007bff'
              }}
            />
          )}
          <div>
            <h3 style={{ margin: '0 0 0.5rem 0', color: '#333' }}>
              {user.displayName || 'ユーザー'}
            </h3>
            <p style={{ margin: '0 0 0.5rem 0', color: '#666' }}>
              {user.email}
            </p>
            {profile && (
              <p style={{ margin: 0, color: '#888', fontSize: '0.9rem' }}>
                登録日: {profile.createdAt instanceof Date ? profile.createdAt.toLocaleDateString('ja-JP') : '不明'}
              </p>
            )}
          </div>
        </div>

        {/* 統計情報 */}
        {profile && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem',
            marginBottom: '2rem'
          }}>
            <div style={{
              padding: '1.5rem',
              backgroundColor: '#d4edda',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #28a745'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#155724' }}>
                学習済み単語
              </h4>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#155724'
              }}>
                {profile.totalWordsLearned || 0}
              </div>
              <p style={{ margin: '0.5rem 0 0 0', color: '#155724', fontSize: '0.9rem' }}>
                語
              </p>
            </div>

            <div style={{
              padding: '1.5rem',
              backgroundColor: '#fff3cd',
              borderRadius: '12px',
              textAlign: 'center',
              border: '2px solid #ffc107'
            }}>
              <h4 style={{ margin: '0 0 0.5rem 0', color: '#856404' }}>
                未知の単語
              </h4>
              <div style={{
                fontSize: '2rem',
                fontWeight: 'bold',
                color: '#856404'
              }}>
                {profile.totalUnknownWords || 0}
              </div>
              <p style={{ margin: '0.5rem 0 0 0', color: '#856404', fontSize: '0.9rem' }}>
                語
              </p>
            </div>
          </div>
        )}

        {/* アクション */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '1rem'
        }}>
          <a
            href="./unknown-words"
            style={{
              display: 'block',
              padding: '1rem 1.5rem',
              backgroundColor: '#007bff',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}
          >
            知らない単語リストを見る
          </a>
          
          <a
            href="./youtube"
            style={{
              display: 'block',
              padding: '1rem 1.5rem',
              backgroundColor: '#28a745',
              color: '#fff',
              textDecoration: 'none',
              borderRadius: '8px',
              textAlign: 'center',
              fontWeight: '600',
              fontSize: '1.1rem'
            }}
          >
            YouTube学習を始める
          </a>
        </div>
      </div>
    </div>
  );
};

export default MyPage; 