import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

// 日曜日から土曜日までの日を表す配列
const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

// PartCalendar コンポーネントの定義。propsには名前、シフト提出のための関数、確認状態のセット関数が含まれる
const PartCalendar = ({ name, setUnavailableDates, handleShiftSubmit, confirmation, setConfirmation }) => {
  // ステートフックを使って年、月、日付配列、利用不可の日付配列、テーマ、エラーメッセージ、提出成功状態を管理
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dates, setDates] = useState([]);
  const [unavailableDates, setInternalUnavailableDates] = useState([]);
  const [theme, setTheme] = useState('theme1');
  const [error, setError] = useState('');
  const [submissionSuccess, setSubmissionSuccess] = useState(false);

  // 年や月が変更されたときにカレンダーを生成する
  useEffect(() => {
    generateCalendar(year, month);
  }, [year, month]);

  // テーマが変更されたときに、bodyのクラスを更新する
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // カレンダーを生成する関数
  const generateCalendar = (year, month) => {
    const start = new Date(year, month - 1, 21); // 開始日を設定
    const end = new Date(year, month, 20); // 終了日を設定

    let dateArray = [];
    let currentDate = start;

    const startDay = start.getDay();

    // カレンダーの最初の行を空白で埋める
    for (let i = 0; i < startDay; i++) {
      dateArray.push(null);
    }

    // カレンダーの日付を配列に追加
    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // カレンダーを35日から42日の範囲に調整
    while (dateArray.length > 35 && dateArray.length < 42) {
      dateArray.push(null);
    }

    while (dateArray.length < 35) {
      dateArray.push(null);
    }
    if (dateArray.length > 35 && dateArray.length < 42) {
      while (dateArray.length < 42) {
        dateArray.push(null);
      }
    }

    setDates(dateArray);
  };

  // 休み希望の日付を管理する関数
  const handleMarkUnavailable = (date) => {
    setInternalUnavailableDates((prevUnavailableDates) => {
      if (prevUnavailableDates.includes(date)) {
        // 既に休み希望に含まれている場合は削除
        return prevUnavailableDates.filter(d => d !== date);
      } else {
        // 含まれていない場合は追加
        return [...prevUnavailableDates, date];
      }
    });
  };

  // シフト提出ボタンが押されたときの処理
  const handleSubmit = (e) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (year !== currentYear || month !== currentMonth) {
      setError('シフト表は現在の月のものである必要があります。'); // エラーメッセージを設定
    } else {
      setError(''); // エラーメッセージをクリア
      setUnavailableDates(unavailableDates); // ここでステートを親に渡す
      setConfirmation(true); // 確認状態を設定
    }
  };

  // 確認ボタンが押されたときの処理
  const handleConfirm = () => {
    setConfirmation(false);
    setSubmissionSuccess(true); // 提出成功状態を設定
    handleShiftSubmit(); // シフト提出の処理を呼び出し
  };

  // 一週間分の日付をレンダリングする関数
  const renderWeek = (weekDates) => (
    <div className="calendar-week">
      {weekDates.map((date, index) => (
        <div key={index} className="calendar-day">
          {date ? (
            <>
              <div onClick={() => handleMarkUnavailable(date.toDateString())}>
                {unavailableDates.includes(date.toDateString()) ? '休み' : date.getDate()}
              </div>
            </>
          ) : (
            <div>&nbsp;</div>
          )}
        </div>
      ))}
    </div>
  );

  // 週ごとに分けた日付を格納する配列
  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  if (submissionSuccess) {
    return (
      <div className="submission-success-container">
        <h2>シフトを提出しました</h2>
      </div>
    );
  }

  return (
    <div className={confirmation ? "blur" : ""}>
      <div className="theme-selector">
        <label>テーマ選択:</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="theme1">テーマ1</option>
          <option value="theme2">テーマ2</option>
        </select>
      </div>
      {confirmation && (
        <div className="confirmation-container">
          <h2>シフト提出の確認</h2>
          <p>シフトを提出してよろしいですか？</p>
          <div className="confirmation-buttons">
            <button onClick={handleConfirm}>はい</button>
            <button onClick={() => setConfirmation(false)}>いいえ</button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit}>
        <div className="calendar-controls">
          <label>
            年:
            <input
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              min="2000"
              max="2100"
            />
          </label>
          <label>
            月:
            <input
              type="number"
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              min="1"
              max="12"
            />
          </label>
        </div>
        {error && <div className="error-message">{error}</div>}
        <div className="calendar">
          <div className="calendar-header">
            {daysOfWeek.map((day, index) => (
              <div key={index} className="calendar-day-header">
                {day}
              </div>
            ))}
          </div>
          {weeks.map((week, index) => (
            <React.Fragment key={index}>
              {renderWeek(week)}
            </React.Fragment>
          ))}
        </div>
        <button type="submit">休み希望を提出</button>
      </form>
    </div>
  );
};

export default PartCalendar;
