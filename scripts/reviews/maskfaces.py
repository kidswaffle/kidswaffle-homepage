"""Cover faces in review photos with an emoji.

usage: python3 maskfaces.py IMAGE [IMAGE ...]            detect faces and mask them in place
       python3 maskfaces.py --boxes x,y,w,h;x,y,w,h IMAGE   mask exactly these boxes (manual fix)
Prints one JSON line per image: {"file":..., "faces": n}. Exit code 2 if an image could not be processed.
Detection (OpenCV YuNet, 4 rotations, 2 scales) is good but not perfect: profile, hooded or
turned-away faces can be missed, so a person must look at the result before it is published.
"""
import json, math, os, sys
import cv2
import numpy as np
from PIL import Image, ImageDraw

MODEL = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'models', 'face_detection_yunet_2023mar.onnx')
SCORE = 0.5


def detect(bgr):
    H, W = bgr.shape[:2]
    found = []
    for rot in (0, 90, 180, 270):
        img = {0: bgr, 90: cv2.rotate(bgr, cv2.ROTATE_90_CLOCKWISE), 180: cv2.rotate(bgr, cv2.ROTATE_180),
               270: cv2.rotate(bgr, cv2.ROTATE_90_COUNTERCLOCKWISE)}[rot]
        for scale in (1.0, 1.6):
            r = img if scale == 1.0 else cv2.resize(img, None, fx=scale, fy=scale)
            det = cv2.FaceDetectorYN.create(MODEL, '', (r.shape[1], r.shape[0]), SCORE if rot == 0 else 0.75, 0.3, 5000)
            _, faces = det.detect(r)
            for f in ([] if faces is None else faces):
                x1, y1, x2, y2 = f[0] / scale, f[1] / scale, (f[0] + f[2]) / scale, (f[1] + f[3]) / scale
                if rot == 0: box = (x1, y1, x2, y2)
                elif rot == 90: box = (y1, H - 1 - x2, y2, H - 1 - x1)
                elif rot == 180: box = (W - 1 - x2, H - 1 - y2, W - 1 - x1, H - 1 - y1)
                else: box = (W - 1 - y2, x1, W - 1 - y1, x2)
                found.append((float(f[14]), box))
    found.sort(key=lambda t: -t[0])
    keep = []
    for s, b in found:  # non-maximum suppression across rotations and scales
        if all(overlap(b, k) < 0.3 for _, k in keep): keep.append((s, b))
    return [(b[0], b[1], b[2] - b[0], b[3] - b[1]) for _, b in keep]


def overlap(a, b):
    """Shared area as a share of the smaller box, so a box inside another counts as the same face."""
    ix = max(0, min(a[2], b[2]) - max(a[0], b[0])); iy = max(0, min(a[3], b[3]) - max(a[1], b[1]))
    return ix * iy / (min((a[2] - a[0]) * (a[3] - a[1]), (b[2] - b[0]) * (b[3] - b[1])) + 1e-9)


def iou(a, b):
    ix = max(0, min(a[2], b[2]) - max(a[0], b[0])); iy = max(0, min(a[3], b[3]) - max(a[1], b[1]))
    inter = ix * iy
    return inter / ((a[2] - a[0]) * (a[3] - a[1]) + (b[2] - b[0]) * (b[3] - b[1]) - inter + 1e-9)


def emoji(size, kind):
    """A smiley drawn large and shrunk, so it stays crisp. Every pixel is fully opaque."""
    S = 512
    im = Image.new('RGBA', (S, S), (0, 0, 0, 0))
    d = ImageDraw.Draw(im)
    d.ellipse([4, 4, S - 4, S - 4], fill=(255, 205, 64, 255), outline=(235, 160, 40, 255), width=10)
    d.ellipse([60, 40, S - 120, S - 250], fill=(255, 222, 118, 255))  # opaque: nothing may show through
    ink = (80, 52, 30, 255)
    if kind == 0:  # happy: closed smiling eyes + open smile
        for cx in (S * 0.33, S * 0.67):
            d.arc([cx - 45, S * 0.30, cx + 45, S * 0.52], 200, 340, fill=ink, width=20)
        d.pieslice([S * 0.27, S * 0.46, S * 0.73, S * 0.84], 0, 180, fill=ink)
        d.ellipse([S * 0.38, S * 0.69, S * 0.62, S * 0.83], fill=(255, 120, 110, 255))
    else:  # sweet: round eyes + gentle smile + hearts' blush
        for cx in (S * 0.33, S * 0.67):
            d.ellipse([cx - 24, S * 0.36, cx + 24, S * 0.36 + 56], fill=ink)
            d.ellipse([cx - 8, S * 0.38, cx + 4, S * 0.38 + 14], fill=(255, 255, 255, 255))
        d.arc([S * 0.30, S * 0.50, S * 0.70, S * 0.78], 20, 160, fill=ink, width=18)
    for cx in (S * 0.20, S * 0.80):
        d.ellipse([cx - 40, S * 0.56, cx + 40, S * 0.56 + 52], fill=(255, 150, 135, 255))
    return im.resize((size, size), Image.LANCZOS)


def mask(path, boxes):
    im = Image.open(path).convert('RGB')
    for i, (x, y, w, h) in enumerate(boxes):
        side = int(max(w, h) * 1.75)  # covers forehead, ears and chin, not just the detected core
        cx, cy = x + w / 2, y + h / 2 - h * 0.05
        e = emoji(side, i % 2)
        im.paste(e, (int(cx - side / 2), int(cy - side / 2)), e)
    ext = os.path.splitext(path)[1].lower()
    im.save(path, 'WEBP', quality=80) if ext == '.webp' else im.save(path, quality=88)


def main(argv):
    manual = None
    if argv and argv[0] == '--boxes':
        manual = [tuple(float(v) for v in b.split(',')) for b in argv[1].split(';') if b]
        argv = argv[2:]
    code = 0
    for path in argv:
        try:
            if manual is not None: boxes = manual
            else:
                bgr = cv2.cvtColor(np.array(Image.open(path).convert('RGB')), cv2.COLOR_RGB2BGR)
                boxes = detect(bgr)
            mask(path, boxes)
            print(json.dumps({'file': os.path.basename(path), 'faces': len(boxes), 'boxes': [[round(v) for v in b] for b in boxes]}))
        except Exception as e:  # never leave an unmasked photo behind
            print(json.dumps({'file': os.path.basename(path), 'error': str(e)})); code = 2
    return code


if __name__ == '__main__':
    sys.exit(main(sys.argv[1:]))
