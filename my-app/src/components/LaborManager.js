import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

const LaborManager = () => {
  const laborHours = useSelector((state) => state.labor);
  const dispatch = useDispatch();

  const addLaborHours = (newHours) => {
    dispatch({ type: 'ADD_LABOR_HOURS', payload: newHours });
  };

  return (
    <div className="LaborManager">
      <h1>Labor Manager</h1>
      <LaborForm addLaborHours={addLaborHours} />
      <LaborList laborHours={laborHours} />
    </div>
  );
};

const LaborForm = ({ addLaborHours }) => {
  const [hours, setHours] = React.useState({ date: '', hours: 0 });

  const handleSubmit = (e) => {
    e.preventDefault();
    addLaborHours(hours);
    setHours({ date: '', hours: 0 });
  };

  return (
    <form onSubmit={handleSubmit} className="LaborForm">
      <input
        type="date"
        value={hours.date}
        onChange={(e) => setHours({ ...hours, date: e.target.value })}
      />
      <input
        type="number"
        value={hours.hours}
        onChange={(e) => setHours({ ...hours, hours: parseInt(e.target.value) })}
        placeholder="Hours"
      />
      <button type="submit">Add Hours</button>
    </form>
  );
};

const LaborList = ({ laborHours }) => (
  <ul className="LaborList">
    {laborHours.map((hours, index) => (
      <li key={index}>
        {hours.date} - {hours.hours} hours
      </li>
    ))}
  </ul>
);

export default LaborManager;
