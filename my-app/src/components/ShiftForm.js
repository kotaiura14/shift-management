import React, { useState } from 'react';

const ShiftForm = ({ addShift }) => {
  const [shift, setShift] = useState({ date: '', time: '', employee: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addShift(shift);
    setShift({ date: '', time: '', employee: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="ShiftForm">
      <input
        type="date"
        value={shift.date}
        onChange={(e) => setShift({ ...shift, date: e.target.value })}
      />
      <input
        type="time"
        value={shift.time}
        onChange={(e) => setShift({ ...shift, time: e.target.value })}
      />
      <input
        type="text"
        value={shift.employee}
        onChange={(e) => setShift({ ...shift, employee: e.target.value })}
        placeholder="Employee Name"
      />
      <button type="submit">Add Shift</button>
    </form>
  );
};

export default ShiftForm;
