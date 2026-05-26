import cv2


def capture_image():

    cam = cv2.VideoCapture(0)

    if not cam.isOpened():
        return None

    ret, frame = cam.read()

    if not ret:
        cam.release()
        return None

    image_path = "captura.jpg"

    cv2.imwrite(image_path, frame)

    cam.release()

    return image_path