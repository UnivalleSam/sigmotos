from fastapi import APIRouter, UploadFile, File
from fastapi.responses import StreamingResponse, JSONResponse
import numpy as np
import cv2
import platform
import os
from app.services.ocr_service import (
    process_camera, gen_frames, run_ocr_on_frame,
    camera_manager, _find_camera
)

router = APIRouter(
    prefix="/ocr",
    tags=["OCR"]
)


@router.get("/status")
async def ocr_status():
    """
    Endpoint de diagnóstico: verifica cámara, Tesseract, 
    y devuelve información del sistema.
    """
    status = {
        "system": platform.system(),
        "platform": platform.platform(),
        "camera_running": camera_manager.is_running,
        "camera_clients": camera_manager.active_clients,
        "opencv_version": cv2.__version__,
        "camera_index": int(os.getenv("CAMERA_INDEX", "0")),
    }

    # Verificar Tesseract
    try:
        import pytesseract
        tess_version = pytesseract.get_tesseract_version()
        status["tesseract_version"] = str(tess_version)
        status["tesseract_ok"] = True
    except Exception as e:
        status["tesseract_ok"] = False
        status["tesseract_error"] = str(e)

    # Verificar si hay dispositivos de video disponibles (solo Linux)
    if platform.system() == "Linux":
        video_devices = []
        for i in range(10):
            dev = f"/dev/video{i}"
            if os.path.exists(dev):
                video_devices.append(dev)
        status["video_devices"] = video_devices

    # Probar si la cámara se puede abrir
    if not camera_manager.is_running:
        cap = _find_camera()
        if cap:
            status["camera_available"] = True
            ret, frame = cap.read()
            if ret and frame is not None:
                status["test_frame_shape"] = list(frame.shape)
            cap.release()
        else:
            status["camera_available"] = False
    else:
        status["camera_available"] = True

    return JSONResponse(content=status)


@router.get("/scan-camera")
async def scan_camera():
    placa = process_camera()
    return {
        "placa_detectada": placa
    }


@router.get("/video-feed")
async def video_feed():
    return StreamingResponse(gen_frames(), media_type="multipart/x-mixed-replace; boundary=frame")


@router.post("/read-plate")
async def read_plate(file: UploadFile = File(...)):
    contents = await file.read()
    nparr = np.frombuffer(contents, np.uint8)
    frame = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
    if frame is None:
        return {"placa_detectada": "", "error": "No se pudo decodificar la imagen"}
    
    placa = run_ocr_on_frame(frame)
    return {
        "placa_detectada": placa
    }