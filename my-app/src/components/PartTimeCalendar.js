import React, { useState, useEffect } from 'react'; // ReactとuseState、useEffectフックをインポート
import '../styles/Calendar.css'; // CSSファイルをインポート

const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土']; // 曜日のリストを定義
const workingHours = Array.from({ length: 19 }, (_, i) => { // 勤務時間のリストを定義
  const hour = String(Math.floor(i / 2) + 9).padStart(2, '0');
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minutes}`;
});

// PartTimeCalendarコンポーネント
const PartTimeCalendar = ({ name }) => {
  // 年、月、日付、出勤状況、テーマ、エラーメッセージを管理する状態を定義
  const [year, setYear] = useState(new Date().getFullYear()); // 年の状態を管理
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 月の状態を管理
  const [dates, setDates] = useState([]); // 日付のリストを管理
  const [availability, setAvailability] = useState({}); // 出勤状況を管理
  const [theme, setTheme] = useState('theme1'); // テーマの状態を管理
  const [error, setError] = useState(''); // エラーメッセージを管理

  // 年と月が変更されたときにカレンダーを生成
  useEffect(() => {
    generateCalendar(year, month);
  }, [year, month]);

  // テーマが変更されたときに適用
  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

  // カレンダーを生成する関数
  const generateCalendar = (year, month) => {
    const start = new Date(year, month - 1, 21); // 開始日を21日に設定
    const end = new Date(year, month, 20); // 終了日を翌月の20日に設定

    let dateArray = [];
    let currentDate = start;

    const startDay = start.getDay(); // 開始日の曜日を取得

    // 空のセルを追加
    for (let i = 0; i < startDay; i++) {
      dateArray.push(null);
    }

    // 日付を追加
    while (currentDate <= end) {
      dateArray.push(new Date(currentDate));
      currentDate.setDate(currentDate.getDate() + 1);
    }

    // 35日以上42日未満のとき、空のセルを追加
    while (dateArray.length > 35 && dateArray.length < 42) {
      dateArray.push(null);
    }

    // 35日未満のとき、空のセルを追加
    while (dateArray.length < 35) {
      dateArray.push(null);
    }
    if (dateArray.length > 35 && dateArray.length < 42) {
      while (dateArray.length < 42) {
        dateArray.push(null);
      }
    }

    setDates(dateArray); // 日付のリストを設定
  };

  // 出勤状況を更新する関数
  const handleInputChange = (date, value) => {
    setAvailability((prevAvailability) => {
      const newAvailability = { ...prevAvailability };
      if (newAvailability[date] === value) {
        delete newAvailability[date];
      } else {
        newAvailability[date] = value;
      }
      return newAvailability;
    });
  };

  // 出勤不可の日付をマークする関数
  const handleMarkUnavailable = (date) => {
    setAvailability((prevAvailability) => ({
      ...prevAvailability,
      [date]: prevAvailability[date] === '×' ? '' : '×'
    }));
  };

  // フォームの送信時に呼び出される関数
  const handleSubmit = (e) => {
    e.preventDefault(); // デフォルトのフォーム送信動作を防止
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (year !== currentYear || month !== currentMonth) {
      setError('シフト表は現在の月のものである必要があります。');
    } else {
      setError('');
      console.log('Availability:', availability);
      // ここで必要な処理を行います
    }
  };

  // 週ごとの日付を表示する関数
  const renderWeek = (weekDates) => (
    <div className="calendar-week">
      {weekDates.map((date, index) => (
        <div key={index} className="calendar-day">
          {date ? (
            <>
              <div>{date.getDate()}</div>
              {availability[date.toDateString()] === '×' ? (
                <div
                  className="unavailable"
                  onClick={() => handleMarkUnavailable(date.toDateString())}
                >
                  ×
                </div>
              ) : availability[date.toDateString()] ? (
                <div
                  className="selected-time"
                  onClick={() => handleInputChange(date.toDateString(), '')}
                >
                  {availability[date.toDateString()]}
                </div>
              ) : (
                <>
                  <select
                    value={availability[date.toDateString()] || ''}
                    onChange={(e) => handleInputChange(date.toDateString(), e.target.value)}
                    className="calendar-select"
                  >
                    <option value="">勤務時間を選択</option>
                    {workingHours.map((hour) => (
                      <option key={hour} value={hour}>{hour}</option>
                    ))}
                  </select>
                  <button type="button" onClick={() => handleMarkUnavailable(date.toDateString())} className="calendar-button">
                    ×
                  </button>
                </>
              )}
            </>
          ) : (
            <div>&nbsp;</div>
          )}
        </div>
      ))}
    </div>
  );

  // 日付を週ごとに分割
  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  return (
    <div>
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
        <button type="submit">勤務可能時間を提出</button>
      </form>
    </div>
  );
};

export default PartTimeCalendar; // PartTimeCalendarコンポーネントをエクスポート
