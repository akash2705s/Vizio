import 'abortcontroller-polyfill/dist/abortcontroller-polyfill-only';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './routes/app.route';
import { SettingsProvider } from './context/SettingsContext';
// import './theme/global.css';

// Initialize the app
const root = ReactDOM.createRoot(document.getElementById('root'));

const App = () => (
  <SettingsProvider>
    <AppRoutes />
  </SettingsProvider>
);

export default App;

root.render(<App />);
