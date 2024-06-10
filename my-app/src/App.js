import React, { useState } from 'react';
import PartTimeCalendar from './components/PartTimeCalendar';
import PartCalendar from './components/PartCalendar';
import './styles/App.css';

const App = () => {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [availability, setAvailability] = useState({});
  const [unavailableDates, setUnavailableDates] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitted(true);

    const newEmployee = {
      name: name,
      role: role,
      availability: role === 'partTime' ? availability : [],
      unavailableDates: role === 'part' ? unavailableDates : []
    };

    console.log('Submitting data:', newEmployee); // 送信データをログに出力

    try {
      const response = await fetch('http://localhost:4000/api/employees', { // ポート4000に変更
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newEmployee)
      });

      if (!response.ok) {
        throw new Error('Failed to save employee data');
      }

      console.log('Employee data saved successfully');
    } catch (error) {
      console.error('Error saving employee data:', error);
    }
  };

  if (submitted) {
    return role === 'partTime' 
      ? <PartTimeCalendar name={name} setAvailability={setAvailability} /> 
      : <PartCalendar name={name} setUnavailableDates={setUnavailableDates} />;
  }

  return (
    <div className="registration-container">
      <form onSubmit={handleSubmit} className="registration-form">
        <div className="form-group">
          <label>名前:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <label>役職:</label>
          <select value={role} onChange={(e) => setRole(e.target.value)} required>
            <option value="">選択してください</option>
            <option value="partTime">アルバイト</option>
            <option value="part">パート</option>
          </select>
        </div>
        <button type="submit" className="submit-button">次へ</button>
      </form>
    </div>
  );
};

export default App;
