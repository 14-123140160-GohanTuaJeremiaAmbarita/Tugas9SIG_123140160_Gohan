import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import api from '../config/api';

// Perbaikan bug default penanda Leaflet pada framework React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png'
});

function MapView() {
  const [geojsonData, setGeojsonData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSpatialData = async () => {
      try {
        // Menembak rute GeoJSON backend teranyar kita yang sudah bersih
        const response = await api.get('/fasilitas/geojson');
        setGeojsonData(response.data);
      } catch (error) {
        console.error('Gagal memuat data fitur spasial GeoJSON:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchSpatialData();
  }, []);

  // 1. Fungsi menentukan pewarnaan dinamis berdasarkan kategori/jenis
  const getDynamicStyle = (feature) => {
    const jenis = feature.properties.jenis;
    let markerColor = '#666666'; // Abu-abu jika tidak cocok

    if (jenis === 'Masjid') markerColor = '#2e7d32';      // Hijau
    else if (jenis === 'Sekolah') markerColor = '#1565c0'; // Biru
    else if (jenis === 'Puskesmas') markerColor = '#c62828'; // Merah
    else if (jenis === 'Minimarket') markerColor = '#f57c00'; // Oranye

    return {
      fillColor: markerColor,
      color: '#ffffff', // Garis tepi putih standar
      weight: 1.5,
      opacity: 1,
      fillOpacity: 0.85
    };
  };

  // 2. MENGAKTIFKAN MARKER LINGKARAN INTERAKTIF (Solusi Utama Masalah Anda)
  const pointToLayerConverter = (feature, latlng) => {
    const style = getDynamicStyle(feature);
    return L.circleMarker(latlng, {
      radius: 10,
      fillColor: style.fillColor,
      color: style.color,
      weight: style.weight,
      opacity: style.opacity,
      fillOpacity: style.fillOpacity,
      interactive: true,              // WAJIB: Menyalakan fungsi penangkap aksi mouse
      className: 'leaflet-interactive' // WAJIB: Mengubah bentuk kursor panah biasa menjadi kursor jari pointer
    });
  };

  // 3. Menangani penambahan Popup, Efek Hover Highlight, dan Klik Zoom
  const handleEachFeatureInteraction = (feature, layer) => {
    const { nama, jenis, alamat } = feature.properties;
    
    layer.bindPopup(`
      <div style="font-family: sans-serif; padding: 2px; min-width: 150px;">
        <h4 style="margin: 0 0 4px 0; color: #1565c0;">${nama}</h4>
        <p style="margin: 2px 0; font-size: 0.85rem;"><b>Kategori:</b> ${jenis}</p>
        <p style="margin: 2px 0; font-size: 0.85rem;"><b>Alamat:</b> ${alamat || '-'}</p>
      </div>
    `);

    layer.on({
      // EFEK HOVER MASUK: Lingkaran menebal dan berubah warna menjadi kuning emas
      mouseover: (e) => {
        const targetLayer = e.target;
        targetLayer.setStyle({
          weight: 4,
          fillOpacity: 0.95,
          color: '#ffd54f' 
        });
      },
      // EFEK HOVER KELUAR: Mengembalikan visual penanda ke kondisi semula
      mouseout: (e) => {
        const targetLayer = e.target;
        targetLayer.setStyle(getDynamicStyle(feature));
      },
      // INTERAKSI KLIK: Otomatis bergeser mulus memusatkan titik target (flyTo)
      click: (e) => {
        const activeMapInstance = e.target._map;
        activeMapInstance.flyTo(e.latlng, 16, { duration: 1.2 });
      }
    });
  };

  if (loading) {
    return (
      <div style={{ padding: '20px', fontFamily: 'sans-serif', textAlign: 'center' }}>
        <h3>Menghubungkan ke API Spasial PostGIS...</h3>
      </div>
    );
  }

  return (
    <MapContainer 
      center={[-5.3650, 105.3150]} // Koordinat fokus tengah tepat di wilayah kampus ITERA
      zoom={14} 
      style={{ height: 'calc(100vh - 70px)', width: '100%' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; OpenStreetMap contributors'
      />
      {geojsonData && (
        <GeoJSON 
          data={geojsonData} 
          style={getDynamicStyle}
          pointToLayer={pointToLayerConverter}
          onEachFeature={handleEachFeatureInteraction}
        />
      )}
    </MapContainer>
  );
}

export default MapView;