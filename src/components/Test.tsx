import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TestQuestion, WordData } from '../types';
import { onAuthStateChange, addUnknownWord } from '../firebase/authService';

const Test: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [learnedWords, setLearnedWords] = useState<number>(0);
  const [showExample, setShowExample] = useState(false);
  const [user, setUser] = useState<any>(null);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChange((firebaseUser) => {
      setUser(firebaseUser);
    });
    return () => unsubscribe();
  }, []);

  const questions: TestQuestion[] = location.state?.questions || [];
  const videoTitle: string = location.state?.videoTitle || '';
  const level: string = location.state?.level || '';
  const videoId: string = location.state?.videoId || '';
  const originalWords: WordData[] = location.state?.originalWords || [];

  const currentQuestion = questions[currentQuestionIndex];
  const currentOriginalWord = originalWords.find(word => word.word === currentQuestion.word);

  const handleShowAnswer = () => {
    setShowAnswer(true);
  };

  const handleNextQuestion = () => {
    if (showAnswer) {
      setLearnedWords(prev => prev + 1);
    }
    
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setShowAnswer(false);
      setShowExample(false);
    } else {
      // 学習完了
      navigate('/learning-complete', {
        state: {
          totalWords: questions.length,
          learnedWords: learnedWords + (showAnswer ? 1 : 0),
          videoTitle,
          level,
          videoId
        }
      });
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setShowAnswer(false);
      setShowExample(false);
    }
  };

  // 知らない単語追加
  const handleAddUnknownWord = async () => {
    if (!user) {
      alert('単語を保存するにはログインが必要です');
      return;
    }
    try {
      await addUnknownWord({
        uid: user.uid,
        word: currentQuestion.word,
        meaning: currentQuestion.correctAnswer,
        level: currentQuestion.level,
        videoTitle,
        videoId,
      });
      alert('知らない単語リストに追加しました');
    } catch (e) {
      alert('保存に失敗しました');
    }
  };

  if (questions.length === 0) {
    return (
      <div className="container">
        <div className="card">
          <h2>エラー</h2>
          <p>学習データが見つかりません。</p>
          <button className="btn btn-primary" onClick={() => navigate('/youtube')}>
            YouTube学習に戻る
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="card">
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '2rem'
        }}>
          <div>
            <h2 style={{ margin: 0, color: '#333' }}>
              単語 {currentQuestionIndex + 1} / {questions.length}
            </h2>
            <p style={{ margin: '0.5rem 0 0 0', color: '#666' }}>
              {videoTitle && `${videoTitle} - `}レベル: {level}
            </p>
          </div>
          <div style={{
            textAlign: 'center',
            padding: '0.5rem 1rem',
            backgroundColor: '#e9ecef',
            borderRadius: '8px',
            fontSize: '0.9rem'
          }}>
            学習済み: {learnedWords}語
          </div>
        </div>

        <div style={{
          textAlign: 'center',
          marginBottom: '3rem'
        }}>
          <div style={{
            fontSize: '3rem',
            fontWeight: 'bold',
            color: '#007bff',
            marginBottom: '1rem',
            padding: '2rem',
            backgroundColor: '#f8f9fa',
            borderRadius: '12px',
            border: '3px solid #007bff'
          }}>
            {currentQuestion.word}
          </div>
          
          {showAnswer ? (
            <div style={{
              marginTop: '2rem',
              padding: '2rem',
              backgroundColor: '#d4edda',
              borderRadius: '12px',
              border: '2px solid #28a745'
            }}>
              <h3 style={{
                color: '#155724',
                marginBottom: '1rem'
              }}>
                意味
              </h3>
              <div style={{
                fontSize: '1.5rem',
                color: '#155724',
                fontWeight: '600',
                marginBottom: '1rem'
              }}>
                {currentQuestion.correctAnswer}
              </div>
              <div style={{
                fontSize: '1rem',
                color: '#666',
                fontStyle: 'italic',
                marginBottom: '1rem'
              }}>
                レベル: {currentQuestion.level}
              </div>
              
              {/* 例文表示ボタン */}
              {currentOriginalWord?.example && (
                <button
                  className="btn btn-outline-success"
                  onClick={() => setShowExample(!showExample)}
                  style={{
                    marginBottom: '1rem',
                    fontSize: '1rem',
                    padding: '8px 16px'
                  }}
                >
                  {showExample ? '例文を隠す' : '例文を見る'}
                </button>
              )}
              
              {/* 例文表示 */}
              {showExample && currentOriginalWord?.example && (
                <div style={{
                  padding: '1rem',
                  backgroundColor: '#f8f9fa',
                  borderRadius: '8px',
                  border: '1px solid #dee2e6',
                  marginTop: '1rem'
                }}>
                  <h4 style={{
                    color: '#155724',
                    marginBottom: '0.5rem',
                    fontSize: '1rem'
                  }}>
                    例文
                  </h4>
                  <div style={{
                    fontSize: '1.1rem',
                    color: '#333',
                    lineHeight: '1.6'
                  }}>
                    {currentOriginalWord.example}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div style={{
              marginTop: '2rem',
              padding: '2rem',
              backgroundColor: '#fff3cd',
              borderRadius: '12px',
              border: '2px solid #ffc107'
            }}>
              <p style={{
                color: '#856404',
                fontSize: '1.1rem',
                margin: 0
              }}>
                この単語の意味を考えてから、答えを見てみましょう
              </p>
            </div>
          )}
        </div>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          justifyContent: 'center',
          alignItems: 'stretch'
        }}>
          {!showAnswer ? (
            <button
              className="btn btn-primary"
              onClick={handleShowAnswer}
              style={{
                fontSize: '18px',
                padding: '16px 24px',
                width: '100%'
              }}
            >
              答えを見る
            </button>
          ) : (
            <div className="btn-group">
              <button
                className="btn btn-secondary"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                style={{
                  fontSize: '16px',
                  padding: '14px 20px'
                }}
              >
                前の単語
              </button>
              
              <button
                className="btn btn-outline-danger"
                onClick={handleAddUnknownWord}
                style={{
                  fontSize: '16px',
                  padding: '14px 20px'
                }}
              >
                知らない単語に追加
              </button>
              
              <button
                className="btn btn-primary"
                onClick={handleNextQuestion}
                style={{
                  fontSize: '18px',
                  padding: '16px 24px'
                }}
              >
                {currentQuestionIndex < questions.length - 1 ? '次の単語' : '学習完了'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Test; 