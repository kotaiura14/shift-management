import React, { useState } from 'react';
import PartTimeCalendar from './components/PartTimeCalendar';
import PartCalendar from './components/PartCalendar';
import './styles/App.css';

const App = () => {
  // ステートフックを使って名前、役職、提出状態、利用可能日、利用不可日、確認状態、提出成功状態を管理
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [availability, setAvailability] = useState({});
  const [unavailableDates, setUnavailableDates] = useState([]);
  const [confirmation, setConfirmation] = useState(false);
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // フォームが提出されたときの処理
  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  // シフト提出ボタンが押されたときの処理
  const handleShiftSubmit = async () => {
    const newEmployee = {
      name: name,
      role: role,
      availability: role === 'partTime' ? Object.keys(availability).map(date => ({ date, availableHours: availability[date] })) : [],
      unavailableDates: role === 'part' ? unavailableDates : []
    };

    console.log('Submitting data:', newEmployee); // 送信データをログに出力

    try {
      const response = await fetch('http://localhost:4000/api/employees', { // ポート4000に変更
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmployee)
      });

      if (!response.ok) {
        throw new Error('Failed to save employee data');
      }

      console.log('Employee data saved successfully');
      setConfirmation(false);
      setSubmissionSuccess(true);
    } catch (error) {
      console.error('Error saving employee data:', error);
    }
  };

  // 提出後の表示を役職に応じて切り替える
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

  // 登録フォームの表示
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
