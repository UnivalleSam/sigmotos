import cv2
import pytesseract
from PIL import Image

pytesseract.pytesseract.tesseract_cmd = "/usr/bin/tesseract"


def process_camera():

    cap = cv2.VideoCapture(0)

    if not cap.isOpened():
        return "No se pudo abrir la cámara"

    ret, frame = cap.read()

    cap.release()

    if not ret:
        return "No se pudo capturar imagen"

    # Guardar original
    cv2.imwrite("original.jpg", frame)

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

    # Si no detecta placa
    if plate is None:

        roi = gray

    else:

        x, y, w, h = cv2.boundingRect(plate)

        roi = gray[y:y + h, x:x + w]

    # Mejorar imagen
    roi = cv2.threshold(
        roi,
        0,
        255,
        cv2.THRESH_BINARY + cv2.THRESH_OTSU
    )[1]

    # Agrandar para OCR
    roi = cv2.resize(
        roi,
        None,
        fx=3,
        fy=3,
        interpolation=cv2.INTER_CUBIC
    )

    # Guardar debug
    cv2.imwrite("placa_detectada.jpg", roi)

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

    return text