import React, { useState } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import PartTimeCalendar from './components/PartTimeCalendar';
import PartCalendar from './components/PartCalendar';
import AdminPanel from './components/AdminPanel';
import './styles/App.css';
import './styles/Login.css'; // モーダル用のスタイルを追加

const App = () => {
  const [name, setName] = useState(''); // ユーザーの名前を保持する状態
  const [role, setRole] = useState(''); // ユーザーの役職を保持する状態
  const [submitted, setSubmitted] = useState(false); // 提出が行われたかどうかを保持する状態
  const [availability, setAvailability] = useState({}); // アルバイトの出勤可能日と時間を保持する状態
  const [unavailableDates, setUnavailableDates] = useState([]); // パートの希望休日を保持する状態
  const [confirmation, setConfirmation] = useState(false); // 確認メッセージの表示状態を保持
  const [submissionSuccess, setSubmissionSuccess] = useState(false); // 提出成功メッセージの表示状態を保持
  const [isAdmin, setIsAdmin] = useState(false); // 管理者モードの状態を保持する
  const [showPasswordModal, setShowPasswordModal] = useState(false); // パスワードモーダルの表示状態を保持
  const [password, setPassword] = useState(''); // パスワード入力の状態を保持
  const [error, setError] = useState(''); // エラーメッセージを保持

  // 管理者モードのトグル関数
  const toggleAdmin = () => {
    if (isAdmin) {
      setIsAdmin(false);
    } else {
      setShowPasswordModal(true);
    }
  };

  // パスワードモーダルの送信処理
  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: 'admin', password })
      });

      if (response.ok) {
        setIsAdmin(true);
        setShowPasswordModal(false);
        setPassword('');
        setError('');
      } else {
        setError('パスワードが無効です');
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      setError('エラーが発生しました。後でもう一度試してください。');
    }
  };

  // ユーザーがフォームを送信したときに呼ばれる関数
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // シフト提出時に呼ばれる関数
  const handleShiftSubmit = async () => {
    const newEmployee = {
      name: name,
      role: role,
      availability: role === 'partTime' ? Object.keys(availability).map(date => ({ date, availableHours: availability[date] })) : [],
      unavailableDates: role === 'part' ? unavailableDates : []
    };

    console.log('データを送信中:', newEmployee); // 送信データをログに出力

    try {
      const response = await fetch('http://localhost:4000/api/employees', { // ポート4000に変更
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmployee)
      });

      if (!response.ok) {
        throw new Error('従業員データの保存に失敗しました');
      }

      const data = await response.json();
      console.log('従業員データが正常に保存されました:', data);
      setConfirmation(false); // 確認メッセージを非表示
      setSubmissionSuccess(true); // 提出成功メッセージを表示
    } catch (error) {
      console.error('従業員データの保存エラー:', error);
      setSubmissionSuccess(false);
    }
  };

  // 提出成功メッセージを表示する
  if (submissionSuccess) {
    return (
      <div className="submission-success-container">
        <h2>シフトを提出しました</h2>
      </div>
    );
  }

  // フォームが提出された後、役職に応じてカレンダーコンポーネントを表示する
  if (submitted) {
    return role === 'partTime' 
      ? <PartTimeCalendar
          name={name}
          setAvailability={setAvailability}
          handleShiftSubmit={handleShiftSubmit}
          confirmation={confirmation}
          setConfirmation={setConfirmation}
          setSubmissionSuccess={setSubmissionSuccess} // 提出成功状態を渡す
        />
      : <PartCalendar
          name={name}
          setUnavailableDates={setUnavailableDates}
          handleShiftSubmit={handleShiftSubmit}
          confirmation={confirmation}
          setConfirmation={setConfirmation}
          setSubmissionSuccess={setSubmissionSuccess} // 提出成功状態を渡す
        />;
  }

  // パスワードモーダル
  const renderPasswordModal = () => (
    <div className="modal">
      <div className="modal-content">
        <h2>管理者パスワードを入力してください</h2>
        {error && <div className="error-message">{error}</div>}
        <form onSubmit={handlePasswordSubmit}>
          <div className="form-group">
            <label>パスワード:</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="submit-button">送信</button>
          <button type="button" className="cancel-button" onClick={() => setShowPasswordModal(false)}>キャンセル</button>
        </form>
      </div>
    </div>
  );

  // 初期画面（ユーザー登録フォーム）
  return (
    <Router>
      <div className="app">
        {showPasswordModal && renderPasswordModal()}
        <button onClick={toggleAdmin} className="toggle-admin-button">
          {isAdmin ? 'ユーザーモードに切り替え' : '管理者モードに切り替え'}
        </button>
        {isAdmin ? (
          <AdminPanel /> // 管理者モードが有効な場合、管理者パネルを表示する
        ) : (
          <div className="registration-container">
            <form onSubmit={handleSubmit} className="registration-form">
              <div className="form-group">
                <label>名前:</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
                <label>役職:</label>
                <select value={role} onChange={(e) => setRole(e.target.value)} required>
                  <option value="">選択してください</option>
                  <option value="partTime">アルバイト</option>
                  <option value="part">パート</option>
                </select>
              </div>
              <button type="submit" className="submit-button">次へ</button>
            </form>
          </div>
        )}
      </div>
    </Router>
  );
};

export default App;
