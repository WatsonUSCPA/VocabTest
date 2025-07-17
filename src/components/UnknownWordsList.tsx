import React, { useEffect, useState } from 'react';
import { onAuthStateChange, getUserUnknownWords, UnknownWord } from '../firebase/authService';

const UnknownWordsList: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [words, setWords] = useState<UnknownWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchWords = async () => {
      if (!user) return;
      setLoading(true);
      setError(null);
      
      console.log('Fetching unknown words for user:', user.uid);
      
      try {
        const words = await getUserUnknownWords(user.uid);
        console.log('Fetched words:', words);
        setWords(words);
      } catch (error) {
        console.error('Failed to fetch unknown words:', error);
        setError(error instanceof Error ? error.message : '単語の取得に失敗しました');
      }
      setLoading(false);
    };
    if (user) fetchWords();
  }, [user]);

  if (!user) return <div className="container"><p>ログインしてください。</p></div>;
  if (loading) return <div className="container"><p>読み込み中...</p></div>;
  if (error) return <div className="container"><p style={{ color: 'red' }}>エラー: {error}</p></div>;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 700, margin: '2rem auto', padding: '2rem' }}>
        <h2>知らない単語一覧</h2>
        
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
            <strong>取得された単語数:</strong> {words.length}
          </p>
          <p style={{ margin: '0.5rem 0', fontSize: '0.9rem' }}>
            <strong>単語データ:</strong> {JSON.stringify(words, null, 2)}
          </p>
        </div>
        
        {words.length === 0 ? (
          <p>まだ単語が登録されていません。</p>
        ) : (
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {words.map(word => (
              <li key={word.id} style={{ borderBottom: '1px solid #eee', padding: '1rem 0' }}>
                <strong style={{ fontSize: '1.2rem', color: '#007bff' }}>{word.word}</strong>（{word.meaning}）
                <span style={{ marginLeft: 8, color: '#888', fontSize: '0.9rem' }}>レベル: {word.level}</span>
                {word.videoTitle && <div style={{ color: '#666', fontSize: '0.9rem' }}>動画: {word.videoTitle}</div>}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default UnknownWordsList; 