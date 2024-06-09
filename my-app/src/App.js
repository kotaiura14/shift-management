import React, { useState } from 'react'; // ReactとuseStateフックをインポート
import PartTimeCalendar from './components/PartTimeCalendar'; // PartTimeCalendarコンポーネントをインポート
import PartCalendar from './components/PartCalendar'; // PartCalendarコンポーネントをインポート
import './styles/App.css'; // CSSファイルをインポート

// アプリケーションのメインコンポーネント
const App = () => {
  // 名前と役割を管理するための状態と、フォームが提出されたかどうかの状態を定義
  const [name, setName] = useState(''); // 名前の状態を管理
  const [role, setRole] = useState(''); // 役割の状態を管理
  const [submitted, setSubmitted] = useState(false); // フォームが提出されたかどうかを管理

  // フォームの送信時に呼び出される関数
  const handleSubmit = (e) => {
    e.preventDefault(); // デフォルトのフォーム送信動作を防止
    setSubmitted(true); // フォームが提出されたことを設定
  };

  // フォームが提出された後の表示
  if (submitted) {
    // 役割に応じてカレンダーコンポーネントを表示
    return role === 'partTime' ? <PartTimeCalendar name={name} /> : <PartCalendar name={name} />;
  }

  // フォームの表示
  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>名前:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required // 必須入力
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

export default App; // Appコンポーネントをエクスポート
