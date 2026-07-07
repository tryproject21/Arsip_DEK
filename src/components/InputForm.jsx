import { useState } from 'react';
import { FaCloudUploadAlt, FaTimes, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// Ganti ini dengan URL Web App dari Google Apps Script setelah di-deploy
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbwbWotkx-WhfE8UhME8Jmrl2PPCWTysoTb-p5VnY0NhWxpXdyd1KQfzieZQW8hY6yXWJg/exec';

function InputForm() {
  const [formData, setFormData] = useState({
    namaBarang: '',
    kategori: 'Elektronik/IT',
    merek: '',
    nomorSeri: '',
    kodeInventaris: '',
    kondisi: 'Baru',
    lokasi: '',
    penanggungJawab: '',
    catatan: ''
  });

  const [photoFile, setPhotoFile] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);

  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, type: '', message: '' });

  const showToast = (type, message) => {
    setToast({ show: true, type, message });
    setTimeout(() => setToast({ show: false, type: '', message: '' }), 5000);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (SCRIPT_URL === 'GANTI_DENGAN_URL_WEB_APP_ANDA') {
        setTimeout(() => {
          setLoading(false);
          showToast('success', 'Data berhasil disimpan! (Mode Simulasi)');
          handleReset();
        }, 1500);
        return;
      }

      const submitData = { ...formData };

      if (photoPreview) {
        submitData.fotoBase64 = photoPreview;
        submitData.fotoName = photoFile.name;
        submitData.fotoMimeType = photoFile.type;
      }

      const response = await fetch(SCRIPT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'text/plain;charset=utf-8', // Plain text to avoid CORS preflight issues with Google Apps Script
        },
        body: JSON.stringify(submitData)
      });

      const result = await response.json();

      if (result.status === 'success') {
        showToast('success', 'Data arsip berhasil ditambahkan!');
        handleReset();
      } else {
        showToast('error', 'Gagal: ' + result.message);
      }
    } catch (error) {
      console.error(error);
      showToast('error', 'Terjadi kesalahan saat mengirim data.');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setFormData({
      namaBarang: '',
      kategori: 'Elektronik/IT',
      merek: '',
      nomorSeri: '',
      kodeInventaris: '',
      kondisi: 'Baru',
      lokasi: '',
      penanggungJawab: '',
      catatan: ''
    });
    removePhoto();
  };

  return (
    <div className="form-container glass-panel">
      <h2 className="page-title">Tambah Arsip Baru</h2>

      <form onSubmit={handleSubmit} className="form-grid">

        {/* Nama Barang */}
        <div className="form-group form-group-full">
          <label className="form-label">Nama Barang / Dokumen <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            className="form-control"
            name="namaBarang"
            value={formData.namaBarang}
            onChange={handleInputChange}
            required
            placeholder="Contoh: Laptop ThinkPad T490"
          />
        </div>

        {/* Kategori */}
        <div className="form-group">
          <label className="form-label">Kategori <span style={{ color: 'red' }}>*</span></label>
          <select
            className="form-control"
            name="kategori"
            value={formData.kategori}
            onChange={handleInputChange}
            required
          >
            <option value="Elektronik/IT">Elektronik/IT</option>
            <option value="Furnitur">Furnitur</option>
            <option value="ATK">ATK</option>
            <option value="Peralatan Kebersihan">Peralatan Kebersihan</option>
            <option value="Dokumen">Dokumen</option>
          </select>
        </div>

        {/* Merek / Tipe */}
        <div className="form-group">
          <label className="form-label">Merek / Tipe</label>
          <input
            type="text"
            className="form-control"
            name="merek"
            value={formData.merek}
            onChange={handleInputChange}
            placeholder="Contoh: Lenovo / Brosur"
          />
        </div>

        {/* Nomor Seri */}
        <div className="form-group">
          <label className="form-label">Nomor Seri</label>
          <input
            type="text"
            className="form-control"
            name="nomorSeri"
            value={formData.nomorSeri}
            onChange={handleInputChange}
            placeholder="Contoh: PF2Y1ABC"
          />
        </div>

        {/* Kode Inventaris */}
        <div className="form-group">
          <label className="form-label">Kode Inventaris</label>
          <input
            type="text"
            className="form-control"
            name="kodeInventaris"
            value={formData.kodeInventaris}
            onChange={handleInputChange}
            placeholder="Contoh: IT-LP-2026-01"
          />
        </div>

        {/* Kondisi */}
        <div className="form-group">
          <label className="form-label">Kondisi <span style={{ color: 'red' }}>*</span></label>
          <select
            className="form-control"
            name="kondisi"
            value={formData.kondisi}
            onChange={handleInputChange}
            required
          >
            <option value="Baru">Baru</option>
            <option value="Berfungsi Baik">Berfungsi Baik</option>
            <option value="Rusak Ringan">Rusak Ringan</option>
            <option value="Rusak Berat">Rusak Berat</option>
            <option value="Hilang">Hilang</option>
          </select>
        </div>

        {/* Lokasi */}
        <div className="form-group">
          <label className="form-label">Lokasi Penempatan <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            className="form-control"
            name="lokasi"
            value={formData.lokasi}
            onChange={handleInputChange}
            required
            placeholder="Contoh: Ruang Rapat Lt 2"
          />
        </div>

        {/* Penanggung Jawab */}
        <div className="form-group">
          <label className="form-label">Penanggung Jawab <span style={{ color: 'red' }}>*</span></label>
          <input
            type="text"
            className="form-control"
            name="penanggungJawab"
            value={formData.penanggungJawab}
            onChange={handleInputChange}
            required
            placeholder="Contoh: Budi Santoso"
          />
        </div>

        {/* Catatan Tambahan */}
        <div className="form-group form-group-full">
          <label className="form-label">Catatan Tambahan</label>
          <textarea
            className="form-control"
            name="catatan"
            value={formData.catatan}
            onChange={handleInputChange}
            placeholder="Tuliskan keterangan tambahan jika ada..."
          ></textarea>
        </div>

        {/* Upload Foto */}
        <div className="form-group form-group-full">
          <label className="form-label">Foto / Bukti Fisik</label>

          {!photoPreview ? (
            <div className="file-input-wrapper">
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
              />
              <div className="file-input-btn">
                <FaCloudUploadAlt size={40} />
                <span>Klik atau seret foto ke sini (Maks 5MB)</span>
              </div>
            </div>
          ) : (
            <div className="image-preview-container">
              <img src={photoPreview} alt="Preview" className="image-preview" />
              <button type="button" className="btn-remove-image" onClick={removePhoto}>
                <FaTimes />
              </button>
            </div>
          )}
        </div>

        {/* Submit Actions */}
        <div className="form-group-full" style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
          <button type="submit" className="btn btn-primary" style={{ flex: 2 }} disabled={loading}>
            {loading ? 'Menyimpan Data...' : 'Simpan Arsip'}
          </button>
          <button type="button" className="btn btn-secondary" style={{ flex: 1 }} onClick={handleReset} disabled={loading}>
            Reset Form
          </button>
        </div>
      </form>

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

export default InputForm;
