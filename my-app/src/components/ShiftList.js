import React from 'react';

const ShiftList = ({ shifts }) => (
  <ul className="ShiftList">
    {shifts.map((shift, index) => (
      <li key={index}>
        {shift.date} - {shift.time} - {shift.employee}
      </li>
    ))}
  </ul>
);

export default ShiftList;
