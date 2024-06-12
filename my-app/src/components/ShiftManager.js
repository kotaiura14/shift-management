import React, { useState, useEffect } from 'react';
import '../styles/ShiftManager.css';

const ShiftManagement = () => {
  const [employees, setEmployees] = useState([]); // 従業員データを保持する状態

  // 初回レンダリング時に従業員データをサーバーから取得する
  useEffect(() => {
    fetch('http://localhost:4000/api/employees')
      .then(response => response.json())
      .then(data => {
        console.log('従業員データ:', data); // デバッグ用のログ
        setEmployees(data);
      })
      .catch(error => console.error('従業員データの取得エラー:', error));
  }, []);

  // 21日から20日までの日付を生成
  const generateDates = () => {
    const dates = [];
    const currentMonth = new Date().getMonth();
    const year = new Date().getFullYear();
    const startDate = new Date(year, currentMonth, 21);
    const endDate = new Date(year, currentMonth + 1, 20);
    
    let date = startDate;
    while (date <= endDate) {
      dates.push(new Date(date));
      date.setDate(date.getDate() + 1);
    }

    return dates;
  };

  const dates = generateDates();

  // 日付をフォーマットする関数
  const formatDate = (date) => {
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    return `${month}/${day}`;
  };

  // 特定の日付のシフトを取得する関数
  const getShiftForDate = (availability, unavailableDates, date) => {
    const shift = availability.find(avail => new Date(avail.date).toDateString() === date.toDateString());
    if (shift) {
      return `${shift.availableHours[0]} - ${shift.availableHours[shift.availableHours.length - 1]}`;
    }
    const formattedDate = date.toISOString().split('T')[0];
    if (unavailableDates.some(unavailableDate => unavailableDate.split('T')[0] === formattedDate)) {
      return '×';
    }
    return '';
  };

  return (
    <div className="shift-management">
      <h2>シフト管理</h2>
      <table>
        <thead>
          <tr>
            <th>名前</th>
            <th>役職</th>
            {dates.map(date => (
              <th key={date}>{formatDate(date)}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {employees.map(employee => (
            <tr key={employee.name}>
              <td>{employee.name}</td>
              <td>{employee.role === 'partTime' ? 'アルバイト' : 'パート'}</td>
              {dates.map(date => (
                <td key={date}>
                  {getShiftForDate(employee.availability, employee.unavailableDates, date)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ShiftManagement;
