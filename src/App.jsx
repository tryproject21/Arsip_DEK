import { Routes, Route, Link } from 'react-router-dom';
import { FaArchive, FaPlus, FaList } from 'react-icons/fa';
import Dashboard from './components/Dashboard';
import InputForm from './components/InputForm';

function App() {
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
