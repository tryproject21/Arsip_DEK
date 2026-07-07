import { useState, useEffect } from 'react';
import { 
  FaSearch, FaBoxOpen, FaSync, FaEdit, FaTimes, 
  FaCloudUploadAlt, FaCheckCircle, FaExclamationCircle, 
  FaTrash, FaClipboardList, FaCheck, FaWrench, FaExclamationTriangle
} from 'react-icons/fa';

// Ganti ini dengan URL Web App dari Google Apps Script setelah di-deploy
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwbWotkx-WhfE8UhME8Jmrl2PPCWTysoTb-p5VnY0NhWxpXdyd1KQfzieZQW8hY6yXWJg/exec';

function Dashboard() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Filter & Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [kategoriFilter, setKategoriFilter] = useState('Semua');
  const [kondisiFilter, setKondisiFilter] = useState('Semua');

  // Edit Modal states
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [editLoading, setEditLoading] = useState(false);
  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 5000);
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      if (SCRIPT_URL === 'GANTI_DENGAN_URL_WEB_APP_ANDA') {
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
    
    let matchesKondisi = true;
    if (kondisiFilter === 'Baik') {
      matchesKondisi = item.kondisi === 'Baru' || item.kondisi === 'Berfungsi Baik';
    } else if (kondisiFilter === 'Rusak') {
      matchesKondisi = item.kondisi === 'Rusak Ringan' || item.kondisi === 'Rusak Berat';
    } else if (kondisiFilter === 'Hilang') {
      matchesKondisi = item.kondisi === 'Hilang';
    }

    const matchesSearch = 
      item.namaBarang.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.nomorSeri.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kodeInventaris.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesCategory && matchesKondisi && matchesSearch;
  });

  // Calculate Statistics
  const totalItems = data.length;
  const goodCondition = data.filter(item => item.kondisi === 'Baru' || item.kondisi === 'Berfungsi Baik').length;
  const damagedCondition = data.filter(item => item.kondisi === 'Rusak Ringan' || item.kondisi === 'Rusak Berat').length;
  const missingCondition = data.filter(item => item.kondisi === 'Hilang').length;

  // Modal Handlers
  const openEditModal = (item) => {
    setEditingItem({ ...item });
    setPhotoPreview(item.photoUrl && item.photoUrl !== '' && !item.photoUrl.startsWith('Error') ? item.photoUrl : null);
    setPhotoFile(null);
    setIsModalOpen(true);
  };

  const closeEditModal = () => {
    setIsModalOpen(false);
    setEditingItem(null);
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleEditInputChange = (e) => {
    const { name, value } = e.target;
    setEditingItem({ ...editingItem, [name]: value });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        showToast('error', 'Ukuran foto maksimal 5MB');
        return;
      }
      setPhotoFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removePhoto = () => {
    setPhotoFile(null);
    setPhotoPreview(null);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setEditLoading(true);

    try {
      if (SCRIPT_URL === 'GANTI_DENGAN_URL_WEB_APP_ANDA') {
        setTimeout(() => {
          setEditLoading(false);
          showToast('success', 'Perubahan disimpan! (Mode Simulasi)');
          closeEditModal();
        }, 1500);
        return;
      }

      const submitData = { ...editingItem, action: 'edit' };

      if (photoFile && photoPreview) {
        submitData.fotoBase64 = photoPreview;
        submitData.fotoName = photoFile.name;
        submitData.fotoMimeType = photoFile.type;
      }

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        showToast('success', 'Data berhasil diperbarui!');
        closeEditModal();
        fetchData();
      } else {
        showToast('error', 'Gagal: ' + result.message);
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Terjadi kesalahan jaringan.');
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm(`Apakah Anda YAKIN ingin menghapus permanen data "${item.namaBarang}"?`)) {
      return;
    }

    try {
      if (SCRIPT_URL === 'GANTI_DENGAN_URL_WEB_APP_ANDA') {
        showToast('success', 'Data dihapus! (Mode Simulasi)');
        return;
      }

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'text/plain;charset=utf-8' },
        body: JSON.stringify({ action: 'delete', id: item.id })
      });

      const result = await response.json();
      
      if (result.status === 'success') {
        showToast('success', 'Data berhasil dihapus!');
        fetchData();
      } else {
        showToast('error', 'Gagal menghapus: ' + result.message);
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Terjadi kesalahan jaringan.');
    }
  };

  return (
    <div className="glass-panel dashboard-panel">
      <h2 className="page-title">Dasbor Arsip</h2>
      
      {/* Analytics Cards */}
      <div className="stats-grid">
        <div 
          className={`stat-card ${kondisiFilter === 'Semua' ? 'active-filter' : ''}`}
          onClick={() => setKondisiFilter('Semua')}
          title="Tampilkan Semua"
        >
          <FaClipboardList className="stat-icon-bg" />
          <div className="stat-icon-wrapper stat-icon-primary"><FaBoxOpen /></div>
          <div className="stat-info">
            <div className="stat-value">{totalItems}</div>
            <div className="stat-label">Total Arsip</div>
          </div>
        </div>
        
        <div 
          className={`stat-card ${kondisiFilter === 'Baik' ? 'active-filter' : ''}`}
          onClick={() => setKondisiFilter('Baik')}
          title="Filter: Kondisi Baik"
        >
          <FaCheck className="stat-icon-bg" style={{color: '#2E7D32'}} />
          <div className="stat-icon-wrapper stat-icon-success"><FaCheck /></div>
          <div className="stat-info">
            <div className="stat-value">{goodCondition}</div>
            <div className="stat-label">Kondisi Baik</div>
          </div>
        </div>
        
        <div 
          className={`stat-card ${kondisiFilter === 'Rusak' ? 'active-filter' : ''}`}
          onClick={() => setKondisiFilter('Rusak')}
          title="Filter: Barang Rusak"
        >
          <FaWrench className="stat-icon-bg" style={{color: '#EF6C00'}} />
          <div className="stat-icon-wrapper stat-icon-warning"><FaWrench /></div>
          <div className="stat-info">
            <div className="stat-value">{damagedCondition}</div>
            <div className="stat-label">Barang Rusak</div>
          </div>
        </div>
        
        <div 
          className={`stat-card ${kondisiFilter === 'Hilang' ? 'active-filter' : ''}`}
          onClick={() => setKondisiFilter('Hilang')}
          title="Filter: Barang Hilang"
        >
          <FaExclamationTriangle className="stat-icon-bg" style={{color: '#C62828'}} />
          <div className="stat-icon-wrapper stat-icon-danger"><FaExclamationTriangle /></div>
          <div className="stat-info">
            <div className="stat-value">{missingCondition}</div>
            <div className="stat-label">Barang Hilang</div>
          </div>
        </div>
      </div>

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

          <select 
            className="form-control" 
            value={kondisiFilter}
            onChange={(e) => setKondisiFilter(e.target.value)}
          >
            <option value="Semua">Semua Kondisi</option>
            <option value="Baik">Kondisi Baik</option>
            <option value="Rusak">Barang Rusak</option>
            <option value="Hilang">Barang Hilang</option>
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
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.map((item, index) => (
                <tr key={item.id || index}>
                  <td className="photo-cell" data-label="Foto">
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
                  <td data-label="Nama / Dokumen">
                    <strong>{item.namaBarang}</strong>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>{item.merek}</div>
                  </td>
                  <td data-label="Kategori">{item.kategori}</td>
                  <td data-label="Kode / SN">
                    <div>{item.kodeInventaris}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-text-light)' }}>SN: {item.nomorSeri}</div>
                  </td>
                  <td data-label="Kondisi"><span className={`status-badge ${getStatusClass(item.kondisi)}`}>{item.kondisi}</span></td>
                  <td data-label="Lokasi">{item.lokasi}</td>
                  <td data-label="PJ">{item.penanggungJawab}</td>
                  <td data-label="Aksi">
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                      <button className="btn-icon" onClick={() => openEditModal(item)} title="Edit">
                        <FaEdit />
                      </button>
                      <button className="btn-icon btn-danger" onClick={() => handleDelete(item)} title="Hapus">
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL EDIT */}
      {isModalOpen && editingItem && (
        <div className="modal-overlay" onClick={closeEditModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3 style={{ margin: 0, color: 'var(--color-primary)' }}>Edit Arsip</h3>
              <button className="modal-close" onClick={closeEditModal}><FaTimes /></button>
            </div>
            
            <form onSubmit={handleEditSubmit} className="form-grid">
              <div className="form-group form-group-full">
                <label className="form-label">Nama Barang / Dokumen <span style={{color:'red'}}>*</span></label>
                <input type="text" className="form-control" name="namaBarang" value={editingItem.namaBarang} onChange={handleEditInputChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Kategori <span style={{color:'red'}}>*</span></label>
                <select className="form-control" name="kategori" value={editingItem.kategori} onChange={handleEditInputChange} required>
                  <option value="Elektronik/IT">Elektronik/IT</option>
                  <option value="Furnitur">Furnitur</option>
                  <option value="ATK">ATK</option>
                  <option value="Peralatan Kebersihan">Peralatan Kebersihan</option>
                  <option value="Dokumen">Dokumen</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Merek / Tipe</label>
                <input type="text" className="form-control" name="merek" value={editingItem.merek} onChange={handleEditInputChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Nomor Seri</label>
                <input type="text" className="form-control" name="nomorSeri" value={editingItem.nomorSeri} onChange={handleEditInputChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Kode Inventaris</label>
                <input type="text" className="form-control" name="kodeInventaris" value={editingItem.kodeInventaris} onChange={handleEditInputChange} />
              </div>

              <div className="form-group">
                <label className="form-label">Kondisi <span style={{color:'red'}}>*</span></label>
                <select className="form-control" name="kondisi" value={editingItem.kondisi} onChange={handleEditInputChange} required>
                  <option value="Baru">Baru</option>
                  <option value="Berfungsi Baik">Berfungsi Baik</option>
                  <option value="Rusak Ringan">Rusak Ringan</option>
                  <option value="Rusak Berat">Rusak Berat</option>
                  <option value="Hilang">Hilang</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label">Lokasi Penempatan <span style={{color:'red'}}>*</span></label>
                <input type="text" className="form-control" name="lokasi" value={editingItem.lokasi} onChange={handleEditInputChange} required />
              </div>

              <div className="form-group">
                <label className="form-label">Penanggung Jawab <span style={{color:'red'}}>*</span></label>
                <input type="text" className="form-control" name="penanggungJawab" value={editingItem.penanggungJawab} onChange={handleEditInputChange} required />
              </div>

              <div className="form-group form-group-full">
                <label className="form-label">Catatan Tambahan</label>
                <textarea className="form-control" name="catatan" value={editingItem.catatan} onChange={handleEditInputChange}></textarea>
              </div>

              {/* Upload Foto */}
              <div className="form-group form-group-full">
                <label className="form-label">Foto / Bukti Fisik (Kosongkan jika tidak ingin mengubah foto)</label>
                
                {!photoPreview ? (
                  <div className="file-input-wrapper">
                    <input type="file" accept="image/*" onChange={handleFileChange} />
                    <div className="file-input-btn">
                      <FaCloudUploadAlt size={40} />
                      <span>Ganti foto (Opsional, Maks 5MB)</span>
                    </div>
                  </div>
                ) : (
                  <div className="image-preview-container">
                    <img src={photoPreview} alt="Preview" className="image-preview" />
                    <button type="button" className="btn-remove-image" onClick={removePhoto}><FaTimes /></button>
                  </div>
                )}
              </div>

              {/* Submit Actions */}
              <div className="form-group-full" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={closeEditModal} disabled={editLoading}>Batal</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={editLoading}>
                  {editLoading ? 'Menyimpan...' : 'Simpan Perubahan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Toast Notification */}
      {toast.show && (
        <div className={`toast ${toast.type}`}>
          {toast.type === 'success' ? <FaCheckCircle style={{ color: 'var(--color-success)' }} size={24} /> : <FaExclamationCircle style={{ color: 'var(--color-danger)' }} size={24} />}
          <div>
            <h4 style={{ margin: 0, fontSize: '1rem' }}>{toast.type === 'success' ? 'Berhasil' : 'Kesalahan'}</h4>
            <p style={{ margin: 0, fontSize: '0.85rem' }}>{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
