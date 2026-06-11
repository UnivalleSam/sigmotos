import cv2
import pytesseract
from PIL import Image
import threading
import time
import os
import platform
import logging

# Configurar logging detallado
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("ocr-service")

# Detectar sistema operativo para Tesseract
if platform.system() == "Linux":
    pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"
else:
    # Windows - ajustar la ruta si es necesario
    pytesseract.pytesseract.tesseract_cmd = r"C:\Program Files\Tesseract-OCR\tesseract.exe"

# Configuración de cámara vía variables de entorno
CAMERA_INDEX = int(os.getenv("CAMERA_INDEX", "0"))
CAMERA_WIDTH = int(os.getenv("CAMERA_WIDTH", "640"))
CAMERA_HEIGHT = int(os.getenv("CAMERA_HEIGHT", "480"))


def _open_camera(index: int):
    """
    Intenta abrir la cámara con el backend adecuado según el SO.
    En Linux (Raspberry Pi) usa V4L2, en Windows usa DSHOW.
    """
    system = platform.system()
    cap = None

    if system == "Linux":
        # --- Intentar V4L2 primero (nativo de Linux) ---
        logger.info(f"[CAMERA] Intentando abrir cámara {index} con V4L2 (Linux)...")
        cap = cv2.VideoCapture(index, cv2.CAP_V4L2)
        if cap.isOpened():
            logger.info(f"[CAMERA] ✅ Cámara {index} abierta con V4L2")
            return cap
        cap.release()

        # --- Intentar ruta de dispositivo directa ---
        device_path = f"/dev/video{index}"
        logger.info(f"[CAMERA] Intentando abrir {device_path} con V4L2...")
        cap = cv2.VideoCapture(device_path, cv2.CAP_V4L2)
        if cap.isOpened():
            logger.info(f"[CAMERA] ✅ Cámara {device_path} abierta con V4L2")
            return cap
        cap.release()

        # --- Fallback: sin backend específico ---
        logger.info(f"[CAMERA] Intentando abrir cámara {index} sin backend...")
        cap = cv2.VideoCapture(index)
        if cap.isOpened():
            logger.info(f"[CAMERA] ✅ Cámara {index} abierta (sin backend)")
            return cap
        cap.release()

    else:
        # Windows o Mac
        logger.info(f"[CAMERA] Intentando abrir cámara {index} con DSHOW (Windows)...")
        cap = cv2.VideoCapture(index, cv2.CAP_DSHOW)
        if cap.isOpened():
            logger.info(f"[CAMERA] ✅ Cámara {index} abierta con DSHOW")
            return cap
        cap.release()

        cap = cv2.VideoCapture(index)
        if cap.isOpened():
            logger.info(f"[CAMERA] ✅ Cámara {index} abierta (sin backend)")
            return cap
        cap.release()

    logger.error(f"[CAMERA] ❌ No se pudo abrir cámara en índice {index}")
    return None


def _find_camera():
    """
    Busca una cámara disponible probando múltiples índices.
    Primero intenta con CAMERA_INDEX (env), luego indices 0-4.
    """
    # Primero probar el índice configurado
    cap = _open_camera(CAMERA_INDEX)
    if cap:
        return cap

    # Luego probar otros índices
    for idx in range(5):
        if idx == CAMERA_INDEX:
            continue
        logger.info(f"[CAMERA] Buscando cámara en índice {idx}...")
        cap = _open_camera(idx)
        if cap:
            return cap

    logger.error("[CAMERA] ❌ No se encontró ninguna cámara disponible")
    return None


class CameraManager:
    def __init__(self):
        self.cap = None
        self.lock = threading.Lock()
        self.last_frame = None
        self.is_running = False
        self.thread = None
        self.active_clients = 0
        self._consecutive_fails = 0

    def start(self):
        with self.lock:
            if self.is_running:
                return True

            logger.info("[CAMERA] Iniciando CameraManager...")
            self.cap = _find_camera()

            if self.cap is None:
                logger.error("[CAMERA] ❌ No se pudo encontrar una cámara.")
                return False

            # Configurar resolución
            self.cap.set(cv2.CAP_PROP_FRAME_WIDTH, CAMERA_WIDTH)
            self.cap.set(cv2.CAP_PROP_FRAME_HEIGHT, CAMERA_HEIGHT)

            # Leer un frame de prueba
            ret, test_frame = self.cap.read()
            if not ret or test_frame is None:
                logger.error("[CAMERA] ❌ Cámara abierta pero no se pudo leer un frame de prueba.")
                self.cap.release()
                self.cap = None
                return False

            logger.info(f"[CAMERA] ✅ Frame de prueba capturado: {test_frame.shape}")
            self.is_running = True
            self._consecutive_fails = 0
            self.thread = threading.Thread(target=self._update_loop, daemon=True)
            self.thread.start()
            return True

    def _update_loop(self):
        MAX_CONSECUTIVE_FAILS = 30
        while self.is_running:
            if self.cap and self.cap.isOpened():
                ret, frame = self.cap.read()
                if ret and frame is not None:
                    with self.lock:
                        self.last_frame = frame
                    self._consecutive_fails = 0
                else:
                    self._consecutive_fails += 1
                    if self._consecutive_fails >= MAX_CONSECUTIVE_FAILS:
                        logger.error(f"[CAMERA] ❌ {MAX_CONSECUTIVE_FAILS} fallos consecutivos. Deteniendo cámara.")
                        self.stop()
                        break
                    time.sleep(0.05)
            else:
                time.sleep(0.1)
        logger.info("[CAMERA] Hilo de actualización detenido.")

    def get_frame(self):
        with self.lock:
            if self.last_frame is not None:
                return self.last_frame.copy()
            return None

    def stop(self):
        with self.lock:
            self.is_running = False
            if self.cap:
                self.cap.release()
                self.cap = None
            self.last_frame = None
        logger.info("[CAMERA] CameraManager detenido.")


camera_manager = CameraManager()


def run_ocr_on_frame(frame):
    """Ejecuta OCR sobre un frame de la cámara para detectar placas."""
    if frame is None:
        return "No hay imagen disponible"

    try:
        # Redimensionar
        frame = cv2.resize(frame, (1280, 720))

        # Escala de grises
        gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

        # Reducir ruido
        blur = cv2.bilateralFilter(gray, 11, 17, 17)

        # Detectar bordes
        edged = cv2.Canny(blur, 30, 200)

        # Buscar contornos
        contours, _ = cv2.findContours(
            edged.copy(),
            cv2.RETR_TREE,
            cv2.CHAIN_APPROX_SIMPLE
        )

        contours = sorted(
            contours,
            key=cv2.contourArea,
            reverse=True
        )[:10]

        plate = None

        # Buscar rectángulo tipo placa
        for contour in contours:
            peri = cv2.arcLength(contour, True)
            approx = cv2.approxPolyDP(
                contour,
                0.018 * peri,
                True
            )
            if len(approx) == 4:
                plate = approx
                break

        # Si no detecta placa, usar imagen completa
        if plate is None:
            roi = gray
            logger.info("[OCR] No se detectó contorno de placa, usando imagen completa")
        else:
            x, y, w, h = cv2.boundingRect(plate)
            roi = gray[y:y + h, x:x + w]
            logger.info(f"[OCR] Placa detectada en posición: x={x}, y={y}, w={w}, h={h}")

        # Mejorar imagen con threshold
        roi = cv2.threshold(
            roi,
            0,
            255,
            cv2.THRESH_BINARY + cv2.THRESH_OTSU
        )[1]

        # Agrandar para mejor OCR
        roi = cv2.resize(
            roi,
            None,
            fx=3,
            fy=3,
            interpolation=cv2.INTER_CUBIC
        )

        pil_image = Image.fromarray(roi)

        custom_config = r'--oem 3 --psm 7 -c tessedit_char_whitelist=ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'

        text = pytesseract.image_to_string(
            pil_image,
            config=custom_config,
            lang='eng'
        )

        # Limpiar resultado
        text = ''.join(
            filter(str.isalnum, text)
        )

        logger.info(f"[OCR] Texto reconocido: '{text}'")
        return text

    except Exception as e:
        logger.error(f"[OCR] Error procesando frame: {e}")
        return f"Error procesando imagen: {str(e)}"


def process_camera():
    """Captura un frame y ejecuta OCR."""
    # Si la cámara ya está corriendo, usar el último frame
    if camera_manager.is_running:
        frame = camera_manager.get_frame()
        if frame is not None:
            return run_ocr_on_frame(frame)

    # Si no, intentar abrir cámara temporalmente
    cap = _find_camera()
    if cap is None:
        return "No se pudo abrir la cámara"

    ret, frame = cap.read()
    cap.release()

    if not ret or frame is None:
        return "No se pudo capturar imagen"

    return run_ocr_on_frame(frame)


def gen_frames():
    """Genera frames MJPEG para streaming al frontend."""
    if not camera_manager.start():
        # Enviar un frame de error
        error_frame = _create_error_frame("NO SE PUDO ABRIR LA CAMARA")
        ret, buffer = cv2.imencode('.jpg', error_frame)
        if ret:
            yield (b'--frame\r\n'
                   b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
        return

    camera_manager.active_clients += 1
    try:
        while camera_manager.is_running:
            frame = camera_manager.get_frame()
            if frame is not None:
                # Dibujar una guía visual en el centro del frame
                h, w = frame.shape[:2]
                rw, rh = min(400, w - 40), min(150, h - 40)
                rx = (w - rw) // 2
                ry = (h - rh) // 2
                cv2.rectangle(frame, (rx, ry), (rx + rw, ry + rh), (0, 255, 0), 2)
                cv2.putText(frame, "ALINEE LA PLACA AQUI", (rx, ry - 15),
                            cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 255, 0), 2)

                ret, buffer = cv2.imencode('.jpg', frame)
                if ret:
                    yield (b'--frame\r\n'
                           b'Content-Type: image/jpeg\r\n\r\n' + buffer.tobytes() + b'\r\n')
            time.sleep(0.05)
    finally:
        camera_manager.active_clients -= 1
        if camera_manager.active_clients <= 0:
            camera_manager.stop()


def _create_error_frame(message: str):
    """Crea un frame negro con un mensaje de error."""
    import numpy as np
    frame = np.zeros((480, 640, 3), dtype=np.uint8)
    # Poner texto centrado
    font = cv2.FONT_HERSHEY_SIMPLEX
    text_size = cv2.getTextSize(message, font, 0.7, 2)[0]
    text_x = (640 - text_size[0]) // 2
    text_y = (480 + text_size[1]) // 2
    cv2.putText(frame, message, (text_x, text_y), font, 0.7, (0, 0, 255), 2)
    return frame