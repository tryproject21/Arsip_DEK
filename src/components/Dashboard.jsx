import { useState, useEffect } from 'react';
import { FaSearch, FaBoxOpen, FaSync } from 'react-icons/fa';

// Ganti ini dengan URL Web App dari Google Apps Script setelah di-deploy
const SCRIPT_URL = 'GANTI_DENGAN_URL_WEB_APP_ANDA';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (SCRIPT_URL === 'https://arsip-dek.vercel.app/') {
        // Mock data if URL is not set yet for demonstration
        setData([
          { id: 1, namaBarang: "Laptop ThinkPad", kategori: "Elektronik/IT", merek: "Lenovo", nomorSeri: "SN12345", kodeInventaris: "INV-001", kondisi: "Berfungsi Baik", lokasi: "Ruang Rapat", penanggungJawab: "Budi", photoUrl: "" },
          { id: 2, namaBarang: "Meja Kerja", kategori: "Furnitur", merek: "IKEA", nomorSeri: "-", kodeInventaris: "INV-002", kondisi: "Baru", lokasi: "Ruang Staf", penanggungJawab: "Siti", photoUrl: "" },
        ]);
        setLoading(false);
        return;
      }

      const response = await fetch(SCRIPT_URL);
      const result = await response.json();

      if (result.status === 'success') {
        setData(result.data);
      } else {
        setError('Gagal memuat data: ' + result.message);
      }
    } catch (err) {
      setError('Terjadi kesalahan jaringan saat memuat data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusClass = (kondisi) => {
    switch (kondisi) {
      case 'Baru': return 'status-baru';
      case 'Berfungsi Baik': return 'status-baik';
      case 'Rusak Ringan': return 'status-rusak-ringan';
      case 'Rusak Berat': return 'status-rusak-berat';
      case 'Hilang': return 'status-hilang';
      default: return '';
    }
  };

  const filteredData = data.filter(item => {
    const matchesCategory = kategoriFilter === 'Semua' || item.kategori === kategoriFilter;
    const matchesSearch =
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorSeri.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeInventaris.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="glass-panel" style={{ padding: '2rem' }}>
      <h2 className="page-title">Dasbor Arsip</h2>

      <div className="toolbar">
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="form-control"
            placeholder="Cari nama, No. Seri, atau Kode..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <select
            className="form-control"
            value={kategoriFilter}
            onChange={(e) => setKategoriFilter(e.target.value)}
          >
            <option value="Semua">Semua Kategori</option>
            <option value="Elektronik/IT">Elektronik/IT</option>
            <option value="Furnitur">Furnitur</option>
            <option value="ATK">ATK</option>
            <option value="Peralatan Kebersihan">Peralatan Kebersihan</option>
            <option value="Dokumen">Dokumen</option>
          </select>

          <button className="btn btn-secondary" onClick={fetchData} title="Muat Ulang">
            <FaSync />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="loader"></div>
      ) : error ? (
        <div className="empty-state">
          <p style={{ color: 'var(--color-danger)' }}>{error}</p>
        </div>
      ) : filteredData.length === 0 ? (
        <div className="empty-state">
          <FaBoxOpen />
          <h3>Tidak ada data ditemukan</h3>
          <p>Belum ada arsip yang sesuai dengan pencarian Anda.</p>
        </div>
      ) : (
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Foto</th>
                <th>Nama / Dokumen</th>
                <th>Kategori</th>
                <th>Kode / SN</th>
                <th>Kondisi</th>
                <th>Lokasi</th>
                <th>PJ</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="photo-cell">
                    {item.photoUrl && item.photoUrl !== '' && !item.photoUrl.startsWith('Error') ? (
                      <a href={item.photoUrl} target="_blank" rel="noopener noreferrer">
                        <img src={item.photoUrl} alt="Preview" />
                      </a>
                    ) : (
                      <div style={{ width: '50px', height: '50px', background: '#eee', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#999', fontSize: '0.8rem' }}>
                        N/A
                      </div>
                    )}
                  </td>
                  <td>
                    <strong>{item.namaBarang}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{item.merek}</div>
                  </td>
                  <td>{item.kategori}</td>
                  <td>
                    <div>{item.kodeInventaris}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>SN: {item.nomorSeri}</div>
                  </td>
                  <td><span className={`status-badge ${getStatusClass(item.kondisi)}`}>{item.kondisi}</span></td>
                  <td>{item.lokasi}</td>
                  <td>{item.penanggungJawab}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
