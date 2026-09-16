"""Put a real screenshot into the green screen of a generated scene.

usage: python composite.py scene.png screenshot.png out.webp [--rotate N] [--width W]
Corners of the green quad are found from the mask extremes; the screenshot is
perspective-warped onto them and the green mask (feathered, despilled) is the
alpha, so rounded screen corners come out right.
--rotate N: rotate which detected corner counts as the screenshot's top-left
(0..3, clockwise) when the device lies the other way round.
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

args = sys.argv[1:]
scene_p, shot_p, out_p = args[:3]
rot = int(args[args.index('--rotate') + 1]) if '--rotate' in args else 0
out_w = int(args[args.index('--width') + 1]) if '--width' in args else None

scene = Image.open(scene_p).convert('RGB')
a = np.asarray(scene).astype(np.int16)
r, g, b = a[..., 0], a[..., 1], a[..., 2]
mask = (g > 150) & (g - r > 80) & (g - b > 80)
ys, xs = np.nonzero(mask)
s = xs + ys
d = xs - ys
tl = (xs[s.argmin()], ys[s.argmin()])
br = (xs[s.argmax()], ys[s.argmax()])
tr = (xs[d.argmax()], ys[d.argmax()])
bl = (xs[d.argmin()], ys[d.argmin()])
corners = [tl, tr, br, bl]
corners = corners[rot:] + corners[:rot]
print('corners', corners, 'pixels', mask.sum())

# expand quad slightly outward from its centre so rounded corners are covered
cx = np.mean([c[0] for c in corners]); cy = np.mean([c[1] for c in corners])
corners = [(cx + (x - cx) * 1.04, cy + (y - cy) * 1.04) for x, y in corners]

shot = Image.open(shot_p).convert('RGB')
sw, sh = shot.size
src = [(0, 0), (sw, 0), (sw, sh), (0, sh)]


def coeffs(dst, src):
    # maps output (dst) points to input (src) points
    A, B = [], []
    for (x, y), (u, v) in zip(dst, src):
        A.append([x, y, 1, 0, 0, 0, -u * x, -u * y]); B.append(u)
        A.append([0, 0, 0, x, y, 1, -v * x, -v * y]); B.append(v)
    return np.linalg.solve(np.array(A, float), np.array(B, float)).tolist()


warped = shot.transform(scene.size, Image.PERSPECTIVE, coeffs(corners, src), Image.BICUBIC)
# alpha = green mask grown by 1px and softened
alpha = Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(3)).filter(ImageFilter.GaussianBlur(0.8))
out = scene.copy()
out.paste(warped, (0, 0), alpha)
# despill: pull residual green on the rim toward neutral
o = np.asarray(out).astype(np.int16)
rim = (np.asarray(alpha) > 0) & (np.asarray(alpha) < 255)
near = np.asarray(Image.fromarray((mask * 255).astype(np.uint8)).filter(ImageFilter.MaxFilter(9))) > 0
spill = near & ~mask | rim
gmax = np.maximum(o[..., 0], o[..., 2])
o[..., 1] = np.where(spill & (o[..., 1] > gmax), gmax, o[..., 1])
out = Image.fromarray(o.clip(0, 255).astype(np.uint8))
if out_w:
    out = out.resize((out_w, round(out.height * out_w / out.width)), Image.LANCZOS)
out.save(out_p, quality=82)
print('saved', out_p, out.size)
