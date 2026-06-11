"""
Script para ejecutar el servicio OCR en la Raspberry Pi.

Uso:
    python run.py

Variables de entorno opcionales:
    CAMERA_INDEX  - Índice de la cámara USB (default: 0)
    CAMERA_WIDTH  - Ancho de captura (default: 640)
    CAMERA_HEIGHT - Alto de captura (default: 480)
    OCR_PORT      - Puerto del servidor (default: 8084)
    OCR_HOST      - Host del servidor (default: 0.0.0.0)
"""
import uvicorn
import os

if __name__ == "__main__":
    port = int(os.getenv("OCR_PORT", "8084"))
    host = os.getenv("OCR_HOST", "0.0.0.0")

    print(f"")
    print(f"  ╔═══════════════════════════════════════════╗")
    print(f"  ║    🔧 SigMotos OCR Service                ║")
    print(f"  ║    Raspberry Pi Camera OCR                 ║")
    print(f"  ╠═══════════════════════════════════════════╣")
    print(f"  ║  Host: {host:<35}║")
    print(f"  ║  Port: {port:<35}║")
    print(f"  ║  Camera: {os.getenv('CAMERA_INDEX', '0'):<33}║")
    print(f"  ╚═══════════════════════════════════════════╝")
    print(f"")
    print(f"  Diagnóstico: http://{host}:{port}/ocr/status")
    print(f"  Video Feed:  http://{host}:{port}/ocr/video-feed")
    print(f"")

    uvicorn.run("app.main:app", host=host, port=port, reload=False)
