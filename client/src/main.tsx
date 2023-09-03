import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.tsx';
import { DojoProvider } from './DojoContext';
import { setup } from './dojo/setup';
import './index.css';

async function init() {
  const rootElement = document.getElementById('root');
  if (!rootElement) throw new Error('React root not found');
  const root = ReactDOM.createRoot(rootElement as HTMLElement);

  const setupResult = await setup();
  root.render(
    <React.StrictMode>
      <DojoProvider value={setupResult}>
        <App />
      </DojoProvider>
    </React.StrictMode>
  );
}

init();
