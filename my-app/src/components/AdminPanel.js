import React, { useState } from 'react';
import ShiftManagement from './ShiftManager';
import LaborManagement from './LaborManager';
import '../styles/AdminPanel.css';

const AdminPanel = () => {
  const [view, setView] = useState('shift');

  return (
    <div className="admin-panel">
      <h1>管理者パネル</h1>
      <div className="admin-nav">
        <button onClick={() => setView('shift')}>シフト管理</button>
        <button onClick={() => setView('labor')}>レイバー管理</button>
      </div>
      <div className="admin-content">
        {view === 'shift' ? <ShiftManagement /> : <LaborManagement />}
      </div>
    </div>
  );
};

export default AdminPanel;
