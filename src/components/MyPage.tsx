import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth } from '../firebase/config';
import { onAuthStateChanged, User } from 'firebase/auth';

const MyPage: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      if (!firebaseUser) {
        navigate('/');
      }
    });
    return () => unsubscribe();
  }, [navigate]);

  if (!user) return null;

  return (
    <div className="container">
      <div className="card" style={{ maxWidth: 500, margin: '2rem auto', padding: '2rem' }}>
        <h2>マイページ</h2>
        <p>こんにちは、{user.displayName || 'ユーザー'} さん</p>
        <p>メールアドレス: {user.email}</p>
        <Link to="/unknown-words" className="btn btn-primary" style={{ marginTop: '1rem' }}>
          知らない単語一覧を見る
        </Link>
      </div>
    </div>
  );
};

export default MyPage; 