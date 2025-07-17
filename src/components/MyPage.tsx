import React, { useEffect, useState } from 'react';
import { onAuthStateChange, getUserProfile, UserProfile, testFirestoreConnection, recalculateUserStats } from '../firebase/authService';
import { User } from 'firebase/auth';

const MyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [firestoreTest, setFirestoreTest] = useState<boolean | null>(null);

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
      
      console.log('Fetching profile for user:', user.uid);
      setError(null);
      
      // Firestore接続テスト
      const connectionTest = await testFirestoreConnection(user.uid);
      setFirestoreTest(connectionTest);
      
      try {
        const userProfile = await getUserProfile(user.uid);
        console.log('User profile fetched:', userProfile);
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

        {/* デバッグ情報 */}
        <div style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#f8f9fa',
          borderRadius: '8px',
          border: '1px solid #dee2e6'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#333' }}>デバッグ情報</h4>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
            <strong>ユーザーID:</strong> {user.uid}
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
            <strong>Firestore接続:</strong> {firestoreTest === null ? 'テスト中...' : firestoreTest ? '成功' : '失敗'}
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
            <strong>プロフィール取得状況:</strong> {profile ? '成功' : '失敗または未作成'}
          </p>
          {profile && (
            <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
              <strong>プロフィール詳細:</strong> {JSON.stringify(profile, null, 2)}
            </p>
          )}
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

        {/* 統計再計算ボタン */}
        <div style={{
          marginBottom: '2rem',
          padding: '1rem',
          backgroundColor: '#fff3cd',
          borderRadius: '8px',
          border: '1px solid #ffc107'
        }}>
          <h4 style={{ margin: '0 0 1rem 0', color: '#856404' }}>統計の修正</h4>
          <p style={{ margin: '0 0 1rem 0', fontSize: '0.9rem', color: '#856404' }}>
            統計が正しく表示されない場合は、以下のボタンをクリックして統計を再計算してください。
          </p>
          <button
            onClick={async () => {
              if (user) {
                await recalculateUserStats(user.uid);
                // プロフィールを再取得
                const updatedProfile = await getUserProfile(user.uid);
                setProfile(updatedProfile);
              }
            }}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#ffc107',
              color: '#856404',
              border: '1px solid #ffc107',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: '600'
            }}
          >
            統計を再計算
          </button>
        </div>

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