import React, { useState, useEffect } from 'react';
import '../styles/Calendar.css';

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const Calendar = ({ onSubmit }) => {
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [dates, setDates] = useState([]);
  const [availability, setAvailability] = useState({});

  useEffect(() => {
    generateCalendar(year, month);
  }, [year, month]);

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

    setDates(dateArray);
  };

  const handleInputChange = (date, value) => {
    setAvailability({ ...availability, [date]: value });
  };

  const handleMarkUnavailable = (date) => {
    setAvailability({ ...availability, [date]: '×' });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(availability);
  };

  const renderWeek = (weekDates) => (
    <div className="calendar-week">
      {weekDates.map((date, index) => (
        <div key={index} className="calendar-day">
          {date ? (
            <>
              <div>{date.getDate()}</div>
              <input
                type="time"
                step="900"
                min={date.getMonth() === 0 && date.getDate() === 1 ? "08:30" : "08:30"}
                max={date.getMonth() === 0 && date.getDate() === 1 ? "19:00" : "20:15"}
                value={availability[date.toDateString()] || ''}
                onChange={(e) => handleInputChange(date.toDateString(), e.target.value)}
                disabled={availability[date.toDateString()] === '×'}
              />
              <button type="button" onClick={() => handleMarkUnavailable(date.toDateString())}>
                ×
              </button>
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
    <form onSubmit={handleSubmit}>
      <div className="calendar-controls">
        <label>
          Year:
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            min="2000"
            max="2100"
          />
        </label>
        <label>
          Month:
          <input
            type="number"
            value={month}
            onChange={(e) => setMonth(e.target.value)}
            min="1"
            max="12"
          />
        </label>
      </div>
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
      <button type="submit">Submit Availability</button>
    </form>
  );
};

export default Calendar;
