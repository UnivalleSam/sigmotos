from fastapi import APIRouter
from app.services.ocr_service import process_camera

router = APIRouter(
    prefix="/ocr",
    tags=["OCR"]
)

@router.get("/scan-camera")
async def scan_camera():

    placa = process_camera()

    return {
        "placa_detectada": placa
    }