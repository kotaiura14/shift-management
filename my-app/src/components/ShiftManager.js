import React from 'react';
import { useDispatch } from 'react-redux';
import Calendar from './Calendar';
import { addShift } from '../store/actions'; // アクションクリエーターをインポート

const ShiftManager = () => {
  const dispatch = useDispatch();

  const handleSubmit = (availability) => {
    Object.keys(availability).forEach(date => {
      const time = availability[date];
      if (time !== '×') {
        dispatch(addShift({ date, time, employee: 'Employee Name' })); // 出勤できる日付と時間を追加
      }
    });
  };

  return (
    <div className="ShiftManager">
      <h1>Shift Manager</h1>
      <Calendar onSubmit={handleSubmit} />
    </div>
  );
};

export default ShiftManager;
