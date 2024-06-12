import React, { useState } from 'react';
import PartTimeCalendar from './components/PartTimeCalendar';
import PartCalendar from './components/PartCalendar';
import './styles/App.css';

const App = () => {
  const [name, setName] = useState(''); // ユーザーの名前を保持する状態
  const [role, setRole] = useState(''); // ユーザーの役職を保持する状態
  const [submitted, setSubmitted] = useState(false); // 提出が行われたかどうかを保持する状態
  const [availability, setAvailability] = useState({}); // アルバイトの出勤可能日と時間を保持する状態
  const [unavailableDates, setUnavailableDates] = useState([]); // パートの希望休日を保持する状態
  const [confirmation, setConfirmation] = useState(false); // 確認メッセージの表示状態を保持
  const [submissionSuccess, setSubmissionSuccess] = useState(false); // 提出成功メッセージの表示状態を保持

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

      console.log('従業員データが正常に保存されました');
      setConfirmation(false); // 確認メッセージを非表示
      setSubmissionSuccess(true); // 提出成功メッセージを表示
    } catch (error) {
      console.error('従業員データの保存エラー:', error);
    }
  };

  if (submissionSuccess) {
    return (
      <div className="submission-success-container">
        <h2>シフトを提出しました</h2>
      </div>
    );
  }

  if (submitted) {
    return role === 'partTime' 
      ? <PartTimeCalendar
          name={name}
          setAvailability={setAvailability}
          handleShiftSubmit={handleShiftSubmit}
          confirmation={confirmation}
          setConfirmation={setConfirmation}
        />
      : <PartCalendar
          name={name}
          setUnavailableDates={setUnavailableDates}
          handleShiftSubmit={handleShiftSubmit}
          confirmation={confirmation}
          setConfirmation={setConfirmation}
        />;
  }

  return (
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
  );
};

export default App;
