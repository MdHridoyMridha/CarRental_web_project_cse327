import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
// @ts-ignore: allow CSS side-effect import without type declarations
import './index.css';
import { AuthProvider } from './AuthContext';
import { ThemeProvider } from './services/ThemeContext';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </StrictMode>,
);
