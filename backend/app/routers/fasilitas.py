from fastapi import APIRouter, HTTPException, status
from typing import Optional
import json

from ..database import get_pool
from ..models.fasilitas import FasilitasCreate

router = APIRouter(prefix="/api/fasilitas", tags=["fasilitas"])

# 1. READ: Mengambil seluruh data dari tabel fasilitas_publik
@router.get("/geojson")
async def get_fasilitas_geojson():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nama, jenis, alamat, 
                   ST_AsGeoJSON(geom) as geom 
            FROM fasilitas_publik
            LIMIT 100
        """)
        
        features = []
        for row in rows:
            features.append({
                "type": "Feature",
                "geometry": json.loads(row["geom"]),
                "properties": {
                    "id": row["id"],
                    "nama": row["nama"],
                    "jenis": row["jenis"],
                    "alamat": row.get("alamat")
                }
            })
        return {"type": "FeatureCollection", "features": features}

# 2. CREATE: Tambah Data Baru (Bypass Auth untuk Simulasi Dokumentasi)
@router.post("/", status_code=201)
async def create_fasilitas(data: FasilitasCreate):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            INSERT INTO fasilitas_publik (nama, jenis, alamat, geom)
            VALUES ($1, $2, $3, ST_SetSRID(ST_Point($4, $5), 4326))
            RETURNING id, nama, jenis
        """, data.nama, data.jenis, data.alamat, data.longitude, data.latitude)
        return dict(row)

# 3. UPDATE: Perbarui Data (Bypass Auth)
@router.put("/{id}")
async def update_fasilitas(id: int, data: FasilitasCreate):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            UPDATE fasilitas_publik SET
                nama = $2, jenis = $3, alamat = $4,
                geom = ST_SetSRID(ST_Point($5, $6), 4326)
            WHERE id = $1
            RETURNING id, nama, jenis
        """, id, data.nama, data.jenis, data.alamat, data.longitude, data.latitude)
        
        if not row:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        return dict(row)

# 4. DELETE: Hapus Data Spasial (Bypass Auth)
@router.delete("/{id}", status_code=204)
async def delete_fasilitas(id: int):
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute("DELETE FROM fasilitas_publik WHERE id = $1", id)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Data tidak ditemukan")
        return None