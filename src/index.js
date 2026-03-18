import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Landing from './Landing';
import Reporte from './Reporte';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/reporte" element={<Reporte />} />
        <Route path="/finbroker" element={<Reporte />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);
