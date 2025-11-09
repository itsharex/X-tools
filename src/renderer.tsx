/**
 * This file will automatically be loaded by vite and run in the "renderer" context.
 */

import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { App } from './App';

// 创建根节点并渲染应用
const root = ReactDOM.createRoot(
  document.getElementById('root') || document.body
);

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);

console.log('React 应用已启动!');

