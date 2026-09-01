import React from 'react';
import ReactDOM from 'react-dom/client';
import { App } from './App.js';
import { LanguageProvider } from './context/LanguageContext.js';
import { VoiceProvider } from './context/VoiceContext.js';
import { AppStateProvider } from './context/AppStateContext.js';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <LanguageProvider>
      <VoiceProvider>
        <AppStateProvider>
          <App />
        </AppStateProvider>
      </VoiceProvider>
    </LanguageProvider>
  </React.StrictMode>
);
