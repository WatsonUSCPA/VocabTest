import React, { useEffect, useState } from 'react';
import { onAuthStateChange, getUserUnknownWords, updateUnknownWord, deleteUnknownWord, UnknownWord } from '../firebase/authService';

const UnknownWordsList: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [words, setWords] = useState<UnknownWord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingWord, setEditingWord] = useState<string | null>(null);
  const [selectedWord, setSelectedWord] = useState<UnknownWord | null>(null);
  const [editForm, setEditForm] = useState({
    word: '',
    meaning: '',
    level: ''
  });

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

  const handleEditClick = (word: UnknownWord) => {
    setEditingWord(word.id);
    setEditForm({
      word: word.word,
      meaning: word.meaning,
      level: word.level
    });
  };

  const handleSaveEdit = async (wordId: string) => {
    try {
      await updateUnknownWord(wordId, editForm);
      
      // ローカル状態を更新
      setWords(words.map(word => 
        word.id === wordId 
          ? { ...word, ...editForm }
          : word
      ));
      
      setEditingWord(null);
    } catch (error) {
      console.error('Failed to update word:', error);
      alert('単語の更新に失敗しました');
    }
  };

  const handleCancelEdit = () => {
    setEditingWord(null);
  };

  const handleDeleteWord = async (wordId: string) => {
    if (!confirm('この単語を削除しますか？')) return;
    
    try {
      await deleteUnknownWord(wordId, user.uid);
      
      // ローカル状態を更新
      setWords(words.filter(word => word.id !== wordId));
      
      if (selectedWord?.id === wordId) {
        setSelectedWord(null);
      }
    } catch (error) {
      console.error('Failed to delete word:', error);
      alert('単語の削除に失敗しました');
    }
  };

  const handleWordClick = (word: UnknownWord) => {
    setSelectedWord(selectedWord?.id === word.id ? null : word);
  };

  if (!user) return <div className="container"><p>ログインしてください。</p></div>;
  if (loading) return <div className="container"><p>読み込み中...</p></div>;
  if (error) return <div className="container"><p style={{ color: 'red' }}>エラー: {error}</p></div>;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 800, margin: '2rem auto', padding: '2rem' }}>
        <h2>知らない単語一覧</h2>
        
        {words.length === 0 ? (
          <p>まだ単語が登録されていません。</p>
        ) : (
          <div>
            <ul style={{ listStyle: 'none', padding: 0 }}>
              {words.map(word => (
                <li key={word.id} style={{ 
                  borderBottom: '1px solid #eee', 
                  padding: '1rem 0',
                  cursor: 'pointer',
                  backgroundColor: selectedWord?.id === word.id ? '#f8f9fa' : 'transparent'
                }}>
                  {editingWord === word.id ? (
                    // 編集モード
                    <div style={{ padding: '1rem', backgroundColor: '#fff3cd', borderRadius: '8px' }}>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                          単語:
                        </label>
                        <input
                          type="text"
                          value={editForm.word}
                          onChange={(e) => setEditForm({ ...editForm, word: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                          意味:
                        </label>
                        <input
                          type="text"
                          value={editForm.meaning}
                          onChange={(e) => setEditForm({ ...editForm, meaning: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '1rem'
                          }}
                        />
                      </div>
                      <div style={{ marginBottom: '1rem' }}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
                          レベル:
                        </label>
                        <select
                          value={editForm.level}
                          onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                          style={{
                            width: '100%',
                            padding: '0.5rem',
                            border: '1px solid #ddd',
                            borderRadius: '4px',
                            fontSize: '1rem'
                          }}
                        >
                          <option value="初級">初級</option>
                          <option value="中級">中級</option>
                          <option value="上級">上級</option>
                        </select>
                      </div>
                      <div style={{ display: 'flex', gap: '1rem' }}>
                        <button
                          onClick={() => handleSaveEdit(word.id)}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#28a745',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          保存
                        </button>
                        <button
                          onClick={handleCancelEdit}
                          style={{
                            padding: '0.5rem 1rem',
                            backgroundColor: '#6c757d',
                            color: 'white',
                            border: 'none',
                            borderRadius: '4px',
                            cursor: 'pointer'
                          }}
                        >
                          キャンセル
                        </button>
                      </div>
                    </div>
                  ) : (
                    // 表示モード
                    <div onClick={() => handleWordClick(word)}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <div>
                          <strong style={{ fontSize: '1.2rem', color: '#007bff' }}>{word.word}</strong>
                          <span style={{ marginLeft: 8, color: '#888', fontSize: '0.9rem' }}>レベル: {word.level}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditClick(word);
                            }}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#ffc107',
                              color: '#212529',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            編集
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteWord(word.id);
                            }}
                            style={{
                              padding: '0.25rem 0.5rem',
                              backgroundColor: '#dc3545',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                              fontSize: '0.8rem'
                            }}
                          >
                            削除
                          </button>
                        </div>
                      </div>
                      <div style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                        意味: {word.meaning}
                      </div>
                      {word.videoTitle && (
                        <div style={{ color: '#666', fontSize: '0.9rem' }}>
                          動画: {word.videoTitle}
                        </div>
                      )}
                      <div style={{ color: '#999', fontSize: '0.8rem', marginTop: '0.5rem' }}>
                        追加日: {word.createdAt instanceof Date 
                          ? word.createdAt.toLocaleDateString('ja-JP')
                          : new Date(word.createdAt).toLocaleDateString('ja-JP')
                        }
                      </div>
                    </div>
                  )}
                </li>
              ))}
            </ul>
            
            {/* 選択された単語の詳細表示 */}
            {selectedWord && (
              <div style={{
                marginTop: '2rem',
                padding: '1.5rem',
                backgroundColor: '#e9ecef',
                borderRadius: '8px',
                border: '2px solid #007bff'
              }}>
                <h3 style={{ margin: '0 0 1rem 0', color: '#007bff' }}>
                  {selectedWord.word} の詳細
                </h3>
                <div style={{ display: 'grid', gap: '1rem' }}>
                  <div>
                    <strong>意味:</strong> {selectedWord.meaning}
                  </div>
                  <div>
                    <strong>レベル:</strong> {selectedWord.level}
                  </div>
                  {selectedWord.videoTitle && (
                    <div>
                      <strong>動画タイトル:</strong> {selectedWord.videoTitle}
                    </div>
                  )}
                  {selectedWord.videoId && (
                    <div>
                      <strong>動画ID:</strong> {selectedWord.videoId}
                    </div>
                  )}
                  <div>
                    <strong>追加日:</strong> {selectedWord.createdAt instanceof Date 
                      ? selectedWord.createdAt.toLocaleString('ja-JP')
                      : new Date(selectedWord.createdAt).toLocaleString('ja-JP')
                    }
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default UnknownWordsList; 