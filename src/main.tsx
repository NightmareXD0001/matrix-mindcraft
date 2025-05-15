
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'

// Log important environment details
console.log('Matrix Protocol initialized');
if (import.meta.env.DEV) {
  console.log('Running in development mode');
} else {
  console.log('Running in production mode');
}

createRoot(document.getElementById("root")!).render(<App />);
