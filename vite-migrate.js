const fs = require('fs');
const path = require('path');

const webDir = path.join(__dirname, 'apps/web');
const srcDir = path.join(webDir, 'src');
const pagesDir = path.join(srcDir, 'pages');

if (!fs.existsSync(pagesDir)) fs.mkdirSync(pagesDir, { recursive: true });

// Move pages
const moves = [
  { from: 'app/page.jsx', to: 'pages/Home.jsx' },
  { from: 'app/admin/page.jsx', to: 'pages/Admin.jsx' },
  { from: 'app/rider/page.jsx', to: 'pages/Rider.jsx' },
  { from: 'app/order/[id]/page.jsx', to: 'pages/OrderTracking.jsx' }
];

moves.forEach(({from, to}) => {
  const fromPath = path.join(srcDir, from);
  const toPath = path.join(srcDir, to);
  if (fs.existsSync(fromPath)) {
    let content = fs.readFileSync(fromPath, 'utf8');
    // Remove "use client"
    content = content.replace(/['"]use client['"];?\n?/g, '');
    // Next dynamic to React lazy
    content = content.replace(/import dynamic from ['"]next\/dynamic['"];?/g, 'import { lazy, Suspense } from "react";');
    content = content.replace(/dynamic\(\(\) => import\((.*?)\), .*?\)/g, 'lazy(() => import($1))');
    // You might need a Suspense wrapper where MapComponent is used, but React 18 handles it if we wrap App in Suspense
    fs.writeFileSync(toPath, content);
  }
});

// Create index.html
fs.writeFileSync(path.join(webDir, 'index.html'), `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Spice Route Restaurant</title>
    <link rel="manifest" href="/manifest.json" />
    <meta name="theme-color" content="#ff5200" />
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>`);

// Create vite.config.js
fs.writeFileSync(path.join(webDir, 'vite.config.js'), `import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  server: {
    port: 3000
  }
});`);

// Create main.jsx
fs.writeFileSync(path.join(srcDir, 'main.jsx'), `import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './app/globals.css';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);`);

// Create App.jsx (React Router setup)
fs.writeFileSync(path.join(srcDir, 'App.jsx'), `import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AppProvider } from '@/context/AppContext.jsx';
import ChatWidget from '@/components/ChatWidget.jsx';
import Home from '@/pages/Home.jsx';
import Admin from '@/pages/Admin.jsx';
import Rider from '@/pages/Rider.jsx';
import OrderTracking from '@/pages/OrderTracking.jsx';
import { Suspense } from 'react';

// Wrapper for route params to match Next.js props.params
const OrderTrackingWrapper = () => {
  import('react-router-dom').then(); // dummy for imports
  const { useParams } = require('react-router-dom');
  const params = useParams();
  return <OrderTracking params={params} />;
};

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Suspense fallback={<div>Loading map...</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/admin" element={<Admin />} />
            <Route path="/rider" element={<Rider />} />
            <Route path="/order/:id" element={<OrderTrackingWrapper />} />
          </Routes>
        </Suspense>
      </BrowserRouter>
      <ChatWidget />
    </AppProvider>
  );
}`);

// Fix MapComponent dynamic import in order tracking
const orderTrackingPath = path.join(srcDir, 'pages/OrderTracking.jsx');
if (fs.existsSync(orderTrackingPath)) {
  let content = fs.readFileSync(orderTrackingPath, 'utf8');
  content = content.replace(/import MapComponent from ['"]@\/components\/MapComponent(\.jsx)?['"];?/g, 'const MapComponent = lazy(() => import("@/components/MapComponent.jsx"));');
  fs.writeFileSync(orderTrackingPath, content);
}

console.log("Migration files generated.");
