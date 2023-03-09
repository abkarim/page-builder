import { Routes, Route } from 'react-router-dom';

import Home from './pages/home';
import NewPage from './pages/NewPage';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/create-new-page" element={<NewPage />} />
    </Routes>
  );
}
