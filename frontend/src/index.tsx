import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { DynamicProvider } from './providers/dynamic';
import { LocalHistoryProvider } from './providers/LocalHistoryProvider';
import { BrowserRouter } from 'react-router-dom'
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  <React.StrictMode>
    <DynamicProvider>
      <LocalHistoryProvider>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </LocalHistoryProvider>
    </DynamicProvider>
  </React.StrictMode>
);
