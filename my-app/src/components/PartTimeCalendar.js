import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];
const workingHours = Array.from({ length: 19 }, (_, i) => {
  const hour = String(Math.floor(i / 2) + 9).padStart(2, '0');
  const minutes = i % 2 === 0 ? '00' : '30';
  return `${hour}:${minutes}`;
});

const PartTimeCalendar = ({ name, setAvailability }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dates, setDates] = useState([]);
  const [availability, setInternalAvailability] = useState({});
  const [theme, setTheme] = useState('theme1');
  const [error, setError] = useState('');

  useEffect(() => {
    generateCalendar(year, month);
  }, [year, month]);

  useEffect(() => {
    document.body.className = theme;
  }, [theme]);

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

  const handleInputChange = (date, value) => {
    setInternalAvailability((prevAvailability) => {
      const newAvailability = { ...prevAvailability };
      if (newAvailability[date] === value) {
        delete newAvailability[date];
      } else {
        newAvailability[date] = value;
      }
      return newAvailability;
    });
  };

  const handleMarkUnavailable = (date) => {
    setInternalAvailability((prevAvailability) => ({
      ...prevAvailability,
      [date]: prevAvailability[date] === '×' ? '' : '×'
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (year !== currentYear || month !== currentMonth) {
      setError('シフト表は現在の月のものである必要があります。');
    } else {
      setError('');
      setAvailability(availability);
    }
  };

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

export default PartTimeCalendar;
