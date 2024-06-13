import React, { useState } from 'react';
import '../styles/Login.css';

const Login = ({ setLoggedIn }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:4000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username, password })
      });

      if (response.ok) {
        setLoggedIn(true);
      } else {
        setError('ユーザー名またはパスワードが無効です');
      }
    } catch (error) {
      console.error('ログインエラー:', error);
      setError('エラーが発生しました。後でもう一度試してください。');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleSubmit} className="login-form">
        <h2>管理者ログイン</h2>
        {error && <div className="error-message">{error}</div>}
        <div className="form-group">
          <label>ユーザー名:</label>
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label>パスワード:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="submit-button">ログイン</button>
      </form>
    </div>
  );
};

export default Login;
