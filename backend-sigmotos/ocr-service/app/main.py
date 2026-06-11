import os
import sys

# Ajustar sys.path para permitir importaciones correctas
# si se ejecuta directamente desde dentro de la carpeta 'app' o fuera de ella.
current_dir = os.path.dirname(os.path.abspath(__file__))
parent_dir = os.path.dirname(current_dir)
if parent_dir not in sys.path:
    sys.path.insert(0, parent_dir)
if current_dir not in sys.path:
    sys.path.insert(0, current_dir)

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.ocr_routes import router as ocr_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(ocr_router)

if __name__ == "__main__":
    import uvicorn
    # Escuchar en 0.0.0.0 es crucial para que otros dispositivos (como tu PC) se conecten
    uvicorn.run(app, host="0.0.0.0", port=8084)
