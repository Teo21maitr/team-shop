import { BrowserRouter, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import ListView from './pages/ListView';

/**
 * App Component - Main Application
 * Responsive design with React Router
 */
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/list/:listId" element={<ListView />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
