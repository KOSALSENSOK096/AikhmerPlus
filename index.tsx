
import React from 'react';
import ReactDOM from 'react-dom/client';

// CRITICAL: Ensure this line and other local component imports use relative paths (e.g., './App', './components/Navbar').
// If you see an error like:
//   "Uncaught SyntaxError: The requested module '@/App' does not provide an export named 'default'"
//   "Uncaught SyntaxError: The requested module '@/components/Navbar' does not provide an export named 'default'"
//   (or similar errors involving an '@/' path for your local files)
// it almost certainly means an OLDER version of a file (e.g., this index.tsx, App.tsx, etc.) 
// that used an '@/' alias path is being served by your browser's cache or your development server.
//
// Your project setup (using <script type="module" src="/index.tsx"> and esm.sh for dependencies)
// typically expects relative paths for local modules, not '@/' aliases unless you have a specific
// build tool or server configuration to resolve them, which is not apparent here.
//
// TROUBLESHOOTING STEPS:
// 1. Hard refresh your browser (Ctrl+Shift+R or Cmd+Shift+R, or equivalent).
// 2. Clear your browser's cache completely for this site.
// 3. If using a development server, stop and restart it. Clear any build caches if applicable.
// 4. Verify that THIS version of the problematic file (e.g., App.tsx using './components/Navbar') 
//    is the one being loaded in your browser's developer tools (Sources tab).
//
// All local .tsx files (App.tsx, Navbar.tsx, etc.) DO provide default exports. 
// The issue is path resolution if an '@/' path is being attempted for local files.
import App from './App';

const rootElement = document.getElementById('root');
if (!rootElement) {
  throw new Error("Could not find root element to mount to");
}

const root = ReactDOM.createRoot(rootElement);
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);