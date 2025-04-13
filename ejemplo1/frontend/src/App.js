import { Routes, Route } from 'react-router-dom';
import ConsolePage from './consolePage';
import Report from './Report';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<ConsolePage />} />
      <Route path="/reportes" element={<Report />} />
    </Routes>
  );
}
