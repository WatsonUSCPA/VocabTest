import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { TestQuestion } from '../types';

const Test: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [learnedWords, setLearnedWords] = useState<number>(0);

  const questions: TestQuestion[] = location.state?.questions || [];
  const videoTitle: string = location.state?.videoTitle || '';
  const level: string = location.state?.level || '';
  const videoId: string = location.state?.videoId || '';

  const currentQuestion = questions[currentQuestionIndex];

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
              {videoTitle} - レベル: {level}
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
                fontStyle: 'italic'
              }}>
                レベル: {currentQuestion.level}
              </div>
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
          gap: '1rem',
          justifyContent: 'center',
          flexWrap: 'wrap'
        }}>
          {!showAnswer ? (
            <button
              className="btn btn-primary"
              onClick={handleShowAnswer}
              style={{
                fontSize: '1.2rem',
                padding: '15px 30px'
              }}
            >
              答えを見る
            </button>
          ) : (
            <>
              <button
                className="btn btn-secondary"
                onClick={handlePreviousQuestion}
                disabled={currentQuestionIndex === 0}
                style={{
                  fontSize: '1rem',
                  padding: '12px 24px'
                }}
              >
                前の単語
              </button>
              
              <button
                className="btn btn-primary"
                onClick={handleNextQuestion}
                style={{
                  fontSize: '1.2rem',
                  padding: '15px 30px'
                }}
              >
                {currentQuestionIndex < questions.length - 1 ? '次の単語' : '学習完了'}
              </button>
            </>
          )}
        </div>

        <div style={{
          textAlign: 'center',
          marginTop: '2rem'
        }}>
          <button
            className="btn btn-secondary"
            onClick={() => navigate('/youtube')}
            style={{
              fontSize: '1rem',
              padding: '10px 20px'
            }}
          >
            学習を中断
          </button>
        </div>
      </div>
    </div>
  );
};

export default Test; 