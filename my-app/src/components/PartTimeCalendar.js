import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

// 曜日の配列
const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

// 勤務可能時間の配列を生成
const workingHours = Array.from({ length: 19 }, (_, i) => {
  const hour = String(Math.floor(i / 2) + 9).padStart(2, '0');
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minutes}`;
}).concat('いつでも出勤可能');

const PartTimeCalendar = ({ name, setAvailability, handleShiftSubmit, confirmation, setConfirmation }) => {
  const [year, setYear] = useState(new Date().getFullYear()); // 年を保持する状態
  const [month, setMonth] = useState(new Date().getMonth() + 1); // 月を保持する状態
  const [dates, setDates] = useState([]); // 日付を保持する状態
  const [availability, setInternalAvailability] = useState({}); // 出勤可能日と時間を保持する内部状態
  const [theme, setTheme] = useState('theme1'); // テーマを保持する状態
  const [error, setError] = useState(''); // エラーメッセージを保持する状態
  const [submissionSuccess, setSubmissionSuccess] = useState(false); // 提出成功メッセージを表示する状態

  // カレンダーを生成
  useEffect(() => {
    generateCalendar(year, month);
  }, [year, month]);

  // テーマを設定
  useEffect(() => {
    document.body.className = theme;
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

  // 勤務可能時間の変更を処理する関数
  const handleInputChange = (date, value) => {
    setInternalAvailability((prevAvailability) => {
      const newAvailability = { ...prevAvailability };
      if (newAvailability[date]) {
        if (newAvailability[date].includes(value)) {
          newAvailability[date] = newAvailability[date].filter(time => time !== value);
          if (newAvailability[date].length === 0) {
            delete newAvailability[date];
          }
        } else {
          newAvailability[date].push(value);
        }
      } else {
        newAvailability[date] = [value];
      }
      return newAvailability;
    });
  };

  // 出勤不可日をマークする関数
  const handleMarkUnavailable = (date) => {
    setInternalAvailability((prevAvailability) => {
      const newAvailability = { ...prevAvailability };
      if (newAvailability[date] && newAvailability[date][0] === '×') {
        delete newAvailability[date];
      } else {
        newAvailability[date] = ['×'];
      }
      return newAvailability;
    });
  };

  // 指定した曜日全てを出勤不可にし、再度押すと元に戻す関数
  const toggleDayAvailability = (day) => {
    setInternalAvailability((prevAvailability) => {
      const newAvailability = { ...prevAvailability };
      let allMarked = true;
      dates.forEach(date => {
        if (date && date.getDay() === day) {
          if (!newAvailability[date.toDateString()] || newAvailability[date.toDateString()][0] !== '×') {
            allMarked = false;
          }
        }
      });

      dates.forEach(date => {
        if (date && date.getDay() === day) {
          if (allMarked) {
            delete newAvailability[date.toDateString()];
          } else {
            newAvailability[date.toDateString()] = ['×'];
          }
        }
      });

      return newAvailability;
    });
  };

  // 勤務可能時間を取り消す関数
  const handleRemoveTime = (date) => {
    setInternalAvailability((prevAvailability) => {
      const newAvailability = { ...prevAvailability };
      delete newAvailability[date];
      return newAvailability;
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
      const allDatesFilled = dates.every(date => date === null || availability[date.toDateString()]);
      if (!allDatesFilled) {
        setError('すべての日付に勤務可能時間を設定してください。');
      } else {
        setError('');
        setAvailability(availability);
        setConfirmation(true);
      }
    }
  };

  // 確認メッセージの「はい」ボタンを押したときの処理
  const handleConfirm = () => {
    setConfirmation(false);
    handleShiftSubmit();
    setSubmissionSuccess(true); // 提出成功メッセージを表示する状態を設定
  };

  // カレンダーの1週間をレンダリングする関数
  const renderWeek = (weekDates) => (
    <div className="calendar-week">
      {weekDates.map((date, index) => (
        <div key={index} className="calendar-day">
          {date ? (
            <>
              <div>{date.getDate()}</div>
              {availability[date.toDateString()] && availability[date.toDateString()][0] === '×' ? (
                <div
                  className="unavailable"
                  onClick={() => handleMarkUnavailable(date.toDateString())}
                >
                  ×
                </div>
              ) : availability[date.toDateString()] ? (
                <div
                  className="selected-time"
                  onClick={() => handleRemoveTime(date.toDateString())}
                >
                  {availability[date.toDateString()].join(', ')}
                  <button type="button" onClick={() => handleRemoveTime(date.toDateString())} className="remove-time-button">
                    取り消し
                  </button>
                </div>
              ) : (
                <>
                  <select
                    value=""
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

  const weeks = [];
  for (let i = 0; i < dates.length; i += 7) {
    weeks.push(dates.slice(i, i + 7));
  }

  if (confirmation) {
    return (
      <div className="confirmation-container">
        <h2>シフト提出の確認</h2>
        <p>シフトを提出してよろしいですか？</p>
        <div className="confirmation-buttons">
          <button onClick={handleConfirm}>はい</button>
          <button onClick={() => setConfirmation(false)}>いいえ</button>
        </div>
      </div>
    );
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
                <button key={index} className="calendar-day-header" onClick={() => toggleDayAvailability(index)}>
                  {day}
                </button>
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

export default PartTimeCalendar;
