import React from 'react';
import ReactDOM from 'react-dom/client'; // createRootを使用するために変更
import { Provider } from 'react-redux';
import store from './store';
import App from './App';
import './styles/App.css';

// createRootを使用してレンダリングするように変更
const container = document.getElementById('root');
const root = ReactDOM.createRoot(container);

root.render(
  <Provider store={store}>
    <App />
  </Provider>
);
