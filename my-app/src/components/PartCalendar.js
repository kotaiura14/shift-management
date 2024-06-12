import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土']; // 曜日の配列

const PartCalendar = ({ name, setUnavailableDates, handleShiftSubmit, confirmation, setConfirmation }) => {
  const [year, setYear] = useState(new Date().getFullYear()); // 年を保持する状態
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 月を保持する状態
  const [dates, setDates] = useState([]); // 日付を保持する状態
  const [unavailableDates, setInternalUnavailableDates] = useState([]); // 出勤不可日を保持する内部状態
  const [theme, setTheme] = useState('theme1'); // テーマを保持する状態
  const [error, setError] = useState(''); // エラーメッセージを保持する状態
  const [submissionSuccess, setSubmissionSuccess] = useState(false); // 提出成功メッセージの表示状態を保持

  useEffect(() => {
    generateCalendar(year, month); // カレンダーを生成
  }, [year, month]);

  useEffect(() => {
    document.body.className = theme; // テーマを設定
  }, [theme]);

  // カレンダーを生成する関数
  const generateCalendar = (year, month) => {
    const start = new Date(year, month - 1, 21);
    const end = new Date(year, month, 20);

    let dateArray = [];
    let currentDate = start;

    const startDay = start.getDay();

    for (let i = 0; i < startDay; i++) {
      dateArray.push(null);
    }

    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

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

  // 出勤不可日をマークする関数
  const handleMarkUnavailable = (date) => {
    setInternalUnavailableDates((prevUnavailableDates) => {
      if (prevUnavailableDates.includes(date)) {
        return prevUnavailableDates.filter(d => d !== date);
      } else {
        return [...prevUnavailableDates, date];
      }
    });
  };

  // シフト提出ボタンを押したときの処理
  const handleSubmit = (e) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (year !== currentYear || month !== currentMonth) {
      setError('シフト表は現在の月のものである必要があります。');
    } else {
      setError('');
      setUnavailableDates(unavailableDates); // 親にステートを渡す
      setConfirmation(true); // 確認メッセージを表示
    }
  };

  // 確認メッセージの「はい」ボタンを押したときの処理
  const handleConfirm = () => {
    setConfirmation(false);
    setSubmissionSuccess(true);
    handleShiftSubmit();
  };

  // カレンダーの1週間をレンダリングする関数
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
    <div className="calendar-container">
      <div className={`calendar-content ${confirmation ? 'blur' : ''}`}>
        <div className="theme-selector">
          <label>テーマ選択:</label>
          <select value={theme} onChange={(e) => setTheme(e.target.value)}>
            <option value="theme1">テーマ1</option>
            <option value="theme2">テーマ2</option>
          </select>
        </div>
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
    </div>
  );
};

export default PartCalendar;
