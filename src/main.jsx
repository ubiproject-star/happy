import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'

// GLOBAL ERROR HANDLER FOR DEBUGGING DEPLOYMENT
window.onerror = function (msg, url, line, col, error) {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.top = '0';
  div.style.left = '0';
  div.style.width = '100%';
  div.style.backgroundColor = 'red';
  div.style.color = 'white';
  div.style.padding = '20px';
  div.style.zIndex = '9999';
  div.innerHTML = `<h3>Global Error</h3><p>${msg}</p><p>${url}:${line}:${col}</p><pre>${error?.stack}</pre>`;
  document.body.appendChild(div);
};
window.onunhandledrejection = function (event) {
  const div = document.createElement('div');
  div.style.position = 'fixed';
  div.style.bottom = '0';
  div.style.left = '0';
  div.style.width = '100%';
  div.style.backgroundColor = 'orange';
  div.style.color = 'black';
  div.style.padding = '20px';
  div.style.zIndex = '9999';
  div.innerHTML = `<h3>Unhandled Promise</h3><p>${event.reason}</p>`;
  document.body.appendChild(div);
};
import { ErrorBoundary } from "react-error-boundary";
import { ErrorFallback } from "./components/ErrorFallback";
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallback}>
      <App />
    </ErrorBoundary>
  </StrictMode>,
)
