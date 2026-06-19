from fastapi import APIRouter, Depends, HTTPException, status
from typing import Optional
import json

from ..database import get_pool
from ..models.fasilitas import FasilitasCreate
from ..utils.auth import get_current_user

router = APIRouter(prefix="/api/fasilitas", tags=["fasilitas"])

@router.get("/geojson")
async def get_fasilitas_geojson():
    pool = await get_pool()
    async with pool.acquire() as conn:
        rows = await conn.fetch("""
            SELECT id, nama, jenis, alamat, 
                   ST_AsGeoJSON(geom) as geom 
            FROM fasilitas
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

@router.post("/", status_code=201)
async def create_fasilitas(data: FasilitasCreate, current_user: str = Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            INSERT INTO fasilitas (nama, jenis, alamat, geom)
            VALUES ($1, $2, $3, ST_SetSRID(ST_Point($4, $5), 4326))
            RETURNING id, nama, jenis
        """, data.nama, data.jenis, data.alamat, data.longitude, data.latitude)
        return dict(row)

@router.put("/{id}")
async def update_fasilitas(id: int, data: FasilitasCreate, current_user: str = Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        row = await conn.fetchrow("""
            UPDATE fasilitas SET
                nama = $2, jenis = $3, alamat = $4,
                geom = ST_SetSRID(ST_Point($5, $6), 4326)
            WHERE id = $1
            RETURNING id, nama, jenis
        """, id, data.nama, data.jenis, data.alamat, data.longitude, data.latitude)
        
        if not row:
            raise HTTPException(status_code=404, detail="Data tidak ditemukan.")
        return dict(row)

@router.delete("/{id}", status_code=204)
async def delete_fasilitas(id: int, current_user: str = Depends(get_current_user)):
    pool = await get_pool()
    async with pool.acquire() as conn:
        result = await conn.execute("DELETE FROM fasilitas WHERE id = $1", id)
        if result == "DELETE 0":
            raise HTTPException(status_code=404, detail="Data tidak ditemukan.")
        return None