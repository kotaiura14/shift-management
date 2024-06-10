import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

const daysOfWeek = ['日', '月', '火', '水', '木', '金', '土'];

const PartCalendar = ({ name, setUnavailableDates }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dates, setDates] = useState([]);
  const [unavailableDates, setInternalUnavailableDates] = useState([]);
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

  const handleMarkUnavailable = (date) => {
    setInternalUnavailableDates((prevUnavailableDates) => {
      if (prevUnavailableDates.includes(date)) {
        return prevUnavailableDates.filter(d => d !== date);
      } else {
        return [...prevUnavailableDates, date];
      }
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    if (year !== currentYear || month !== currentMonth) {
      setError('シフト表は現在の月のものである必要があります。');
    } else {
      setError('');
      setUnavailableDates(unavailableDates);
    }
  };

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

  return (
    <div>
      <div className="theme-selector">
        <label>テーマ選択:</label>
        <select value={theme} onChange={(e) => setTheme(e.target.value)}>
          <option value="theme1">テーマ1</option>
          <option value="theme2">テーマ2</option>
        </select>
      </div>
      <p className="notice">希望休日をクリックしてください</p>
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
