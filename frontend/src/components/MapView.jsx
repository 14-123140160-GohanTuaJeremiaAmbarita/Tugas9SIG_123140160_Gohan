import { useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import { useAuth } from '../context/authcontext';

// MENGGUNAKAN URL GAMBAR RED PIN ONLINE YANG DIJAMIN ANTI-PECAH DAN PASTI MUNCUL
const customMarkerUrl = 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-red.png';
const customShadowUrl = 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png';

const createCustomIcon = (width = 10, height = 10) => {
  return new L.Icon({
    iconUrl: customMarkerUrl,
    shadowUrl: customShadowUrl,
    iconSize: [width, height],            // Ukuran dimensi ikon penanda [lebar, tinggi]
    iconAnchor: [width / 2, height],      // Titik tumpu bawah penanda nempel di peta
    popupAnchor: [1, -34],                // Posisi munculnya gelembung teks popup
    shadowSize: [10, 10]
  });
};

export default function MapView() {
  const { user } = useAuth();
  const [facilities, setFacilities] = useState([
    { id: 1, nama: 'RS Abdul Moeloek', jenis: 'Puskesmas', alamat: 'Jl. Dr. Rivai No.6', lat: -5.4294, lng: 105.2618 },
    { id: 2, nama: 'Masjid ITERA', jenis: 'Masjid', alamat: 'Kampus ITERA', lat: -5.3650, lng: 105.3150 },
    { id: 3, nama: 'SMAN 1 Bandar Lampung', jenis: 'Sekolah', alamat: 'Jl. Jend. Sudirman', lat: -5.4194, lng: 105.2518 }
  ]);

  const [formData, setFormData] = useState({ id: null, nama: '', jenis: 'Masjid', alamat: '', lat: '', lng: '' });
  const [showForm, setShowForm] = useState(false);
  const [validationError, setValidationError] = useState('');

  // State untuk melacak ID marker mana yang sedang di-hover
  const [hoveredMarkerId, setHoveredMarkerId] = useState(null);

  function MapClickHandler() {
    useMapEvents({
      click(e) {
        if (!user) return;
        setFormData({ id: null, nama: '', jenis: 'Masjid', alamat: '', lat: e.latlng.lat.toFixed(6), lng: e.latlng.lng.toFixed(6) });
        setShowForm(true);
        setValidationError('');
      },
    });
    return null;
  }

  const handleSave = (e) => {
    e.preventDefault();
    if (formData.nama.trim().length < 3) {
      setValidationError('Validasi Gagal: Nama fasilitas minimal harus 3 karakter!');
      return;
    }
    const newFacility = formData.id 
      ? facilities.map(f => f.id === formData.id ? { ...formData, lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) } : f)
      : [...facilities, { ...formData, id: Date.now(), lat: parseFloat(formData.lat), lng: parseFloat(formData.lng) }];
    
    setFacilities(newFacility);
    setShowForm(false);
    setFormData({ id: null, nama: '', jenis: 'Masjid', alamat: '', lat: '', lng: '' });
  };

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 70px)', width: '100%' }}>
      <div style={{ flex: showForm ? '3' : '4', position: 'relative' }}>
        <MapContainer center={[-5.3650, 105.3150]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution='&copy; OpenStreetMap contributors' />
          <MapClickHandler />
          
          {facilities.map(f => {
            // EFEK HOVER VISUAL: Membesar jika di-hover kursor mouse
            const isHovered = hoveredMarkerId === f.id;
            const markerIcon = createCustomIcon(isHovered ? 35 : 25, isHovered ? 57 : 41);

            return (
              <Marker 
                key={f.id} 
                position={[f.lat, f.lng]}
                icon={markerIcon}
                eventHandlers={{
                  mouseover: () => setHoveredMarkerId(f.id),
                  mouseout: () => setHoveredMarkerId(null)
                }}
              >
                <Popup>
                  <div style={{ minWidth: '160px', fontFamily: 'sans-serif' }}>
                    <h4 style={{ margin: '0 0 5px 0', color: '#008CBA' }}>{f.nama}</h4>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><b>Kategori:</b> {f.jenis}</p>
                    <p style={{ margin: '2px 0', fontSize: '13px' }}><b>Alamat:</b> {f.alamat || '-'}</p>
                    {user && (
                      <div style={{ display: 'flex', gap: '5px', marginTop: '10px' }}>
                        <button onClick={() => { setFormData({ ...f, lat: f.lat.toString(), lng: f.lng.toString() }); setShowForm(true); }} style={{ flex: 1, padding: '4px', background: '#f0ad4e', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>Edit</button>
                        <button onClick={() => { if (window.confirm('Hapus?')) setFacilities(facilities.filter(fac => fac.id !== f.id)); }} style={{ flex: 1, padding: '4px', background: '#d9534f', color: 'white', border: 'none', cursor: 'pointer', borderRadius: '3px' }}>Hapus</button>
                      </div>
                    )}
                  </div>
                </Popup>
              </Marker>
            );
          })}
        </MapContainer>
      </div>

      {showForm && user && (
        <div style={{ flex: '1', minWidth: '320px', background: '#f9f9f9', padding: '20px', boxSizing: 'border-box', borderLeft: '2px solid #ccc', fontFamily: 'sans-serif' }}>
          <h3>{formData.id ? 'Edit Fasilitas' : 'Tambah Fasilitas Baru'}</h3>
          {validationError && <p style={{ color: 'red', fontWeight: 'bold' }}>{validationError}</p>}
          <form onSubmit={handleSave}>
            <div style={{ marginBottom: '12px' }}><label>Nama Tempat:</label><input type="text" value={formData.nama} onChange={e => setFormData({ ...formData, nama: e.target.value })} required style={{ width: '100%', padding: '6px' }} /></div>
            <div style={{ marginBottom: '12px' }}><label>Kategori:</label><select value={formData.jenis} onChange={e => setFormData({ ...formData, jenis: e.target.value })} style={{ width: '100%', padding: '6px' }}><option value="Masjid">Masjid</option><option value="Sekolah">Sekolah</option><option value="Puskesmas">Puskesmas</option></select></div>
            <div style={{ marginBottom: '12px' }}><label>Alamat:</label><textarea value={formData.alamat} onChange={e => setFormData({ ...formData, alamat: e.target.value })} style={{ width: '100%', padding: '6px' }} /></div>
            <div style={{ marginBottom: '12px' }}><label>Latitude:</label><input type="number" step="any" value={formData.lat} onChange={e => setFormData({ ...formData, lat: e.target.value })} required style={{ width: '100%', padding: '6px' }} /></div>
            <div style={{ marginBottom: '20px' }}><label>Longitude:</label><input type="number" step="any" value={formData.lng} onChange={e => setFormData({ ...formData, lng: e.target.value })} required style={{ width: '100%', padding: '6px' }} /></div>
            <button type="submit" style={{ padding: '10px 20px', background: '#5cb85c', color: 'white', border: 'none', cursor: 'pointer' }}>Simpan</button>
            <button type="button" onClick={() => setShowForm(false)} style={{ padding: '10px 20px', marginLeft: '10px' }}>Batal</button>
          </form>
        </div>
      )}
    </div>
  );
}