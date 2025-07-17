import { auth, db } from './config';
import { 
  signInWithPopup, 
  GoogleAuthProvider, 
  signOut, 
  onAuthStateChanged,
  User 
} from 'firebase/auth';
import { 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  query, 
  where, 
  getDocs,
  orderBy,
  addDoc,
  deleteDoc 
} from 'firebase/firestore';

// ユーザープロフィールの型定義
export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  photoURL: string;
  createdAt: Date;
  lastLoginAt: Date;
  totalWordsLearned: number;
  totalUnknownWords: number;
}

// 未知の単語の型定義
export interface UnknownWord {
  id: string;
  uid: string;
  word: string;
  meaning: string;
  level: string;
  videoTitle?: string;
  videoId?: string;
  createdAt: Date;
}

// Googleログイン
export const signInWithGoogle = async (): Promise<User> => {
  const provider = new GoogleAuthProvider();
  const result = await signInWithPopup(auth, provider);
  
  // ユーザー情報をFirestoreに保存
  await saveUserProfile(result.user);
  
  return result.user;
};

// ログアウト
export const signOutUser = async (): Promise<void> => {
  await signOut(auth);
};

// ユーザープロフィールをFirestoreに保存
export const saveUserProfile = async (user: User): Promise<void> => {
  const userRef = doc(db, 'users', user.uid);
  const userSnap = await getDoc(userRef);
  
  const userData: Partial<UserProfile> = {
    uid: user.uid,
    email: user.email || '',
    displayName: user.displayName || '',
    photoURL: user.photoURL || '',
    lastLoginAt: new Date(),
  };

  if (!userSnap.exists()) {
    // 新規ユーザーの場合
    userData.createdAt = new Date();
    userData.totalWordsLearned = 0;
    userData.totalUnknownWords = 0;
  }

  await setDoc(userRef, userData, { merge: true });
};

// ユーザープロフィールを取得
export const getUserProfile = async (uid: string): Promise<UserProfile | null> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    return userSnap.data() as UserProfile;
  }
  return null;
};

// 未知の単語を追加
export const addUnknownWord = async (wordData: Omit<UnknownWord, 'id' | 'createdAt'>): Promise<string> => {
  const docRef = await addDoc(collection(db, 'unknownWords'), {
    ...wordData,
    createdAt: new Date(),
  });
  
  // ユーザーの未知単語数を更新
  await updateUserStats(wordData.uid, 'totalUnknownWords', 1);
  
  return docRef.id;
};

// 未知の単語を削除
export const deleteUnknownWord = async (wordId: string, uid: string): Promise<void> => {
  await deleteDoc(doc(db, 'unknownWords', wordId));
  
  // ユーザーの未知単語数を更新
  await updateUserStats(uid, 'totalUnknownWords', -1);
};

// ユーザーの未知単語リストを取得
export const getUserUnknownWords = async (uid: string): Promise<UnknownWord[]> => {
  const q = query(
    collection(db, 'unknownWords'),
    where('uid', '==', uid),
    orderBy('createdAt', 'desc')
  );
  
  const querySnapshot = await getDocs(q);
  const words: UnknownWord[] = [];
  
  querySnapshot.forEach((doc) => {
    words.push({ id: doc.id, ...doc.data() } as UnknownWord);
  });
  
  return words;
};

// ユーザー統計を更新
export const updateUserStats = async (uid: string, field: 'totalWordsLearned' | 'totalUnknownWords', increment: number): Promise<void> => {
  const userRef = doc(db, 'users', uid);
  const userSnap = await getDoc(userRef);
  
  if (userSnap.exists()) {
    const currentValue = userSnap.data()[field] || 0;
    await setDoc(userRef, { [field]: currentValue + increment }, { merge: true });
  }
};

// 認証状態の監視
export const onAuthStateChange = (callback: (user: User | null) => void) => {
  return onAuthStateChanged(auth, callback);
};

// Firestore接続テスト
export const testFirestoreConnection = async (uid: string): Promise<boolean> => {
  try {
    console.log('Testing Firestore connection for user:', uid);
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    console.log('Firestore test result:', userSnap.exists());
    return true;
  } catch (error) {
    console.error('Firestore connection test failed:', error);
    return false;
  }
};

// 統計を実際のデータから再計算
export const recalculateUserStats = async (uid: string): Promise<void> => {
  try {
    console.log('Recalculating stats for user:', uid);
    
    // 未知の単語数を実際のデータから計算
    const unknownWords = await getUserUnknownWords(uid);
    const actualUnknownWordsCount = unknownWords.length;
    
    // ユーザープロフィールを更新
    const userRef = doc(db, 'users', uid);
    await setDoc(userRef, { 
      totalUnknownWords: actualUnknownWordsCount 
    }, { merge: true });
    
    console.log('Stats recalculated. Unknown words:', actualUnknownWordsCount);
  } catch (error) {
    console.error('Failed to recalculate stats:', error);
  }
}; 