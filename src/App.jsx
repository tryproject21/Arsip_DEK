import { useState, useEffect } from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import { FaArchive, FaPlus, FaList, FaMoon, FaSun } from 'react-icons/fa';
import Dashboard from './components/Dashboard';
import InputForm from './components/InputForm';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true' || false;
  });

  useEffect(() => {
    if (isDarkMode) {
      document.body.classList.add('dark-theme');
    } else {
      document.body.classList.remove('dark-theme');
    }
    localStorage.setItem('darkMode', isDarkMode);
  }, [isDarkMode]);

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  };

  return (
    <div className="app-container">
      <header className="app-header glass-panel">
        <Link to="/" className="logo-section">
          <div className="logo-icon">
            <FaArchive />
          </div>
          <div className="logo-text">
            <h1>Arsip DEK</h1>
            <p>Sistem Manajemen Peralatan & Dokumen</p>
          </div>
        </Link>
        
        <nav className="nav-links">
          <button 
            className="btn-icon" 
            onClick={toggleDarkMode} 
            title="Toggle Dark Mode" 
            style={{ 
              marginRight: '0.5rem', 
              background: isDarkMode ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)' 
            }}
          >
            {isDarkMode ? <FaSun style={{color: '#FFC107'}}/> : <FaMoon />}
          </button>
          <Link to="/" className="btn btn-secondary">
            <FaList /> Dasbor
          </Link>
          <Link to="/tambah" className="btn btn-primary">
            <FaPlus /> Tambah Arsip
          </Link>
        </nav>
      </header>

      <main>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/tambah" element={<InputForm />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
