"""Generate every Brit Ready icon from the native pixel-art master.

assets/guard-icon.png is the guard at its real resolution (42x42, one pixel
per cell). Icons are full-bleed squares: no rounded corners, no inner tile;
whoever displays an icon applies its own shape. Cells only ever scale by a
whole number with nearest-neighbour; any gap is filled by repeating the edge
cells (background on three sides, the tunic at the bottom), then centre-cropped.
Maskable icons keep the guard inside the 80% safe zone.

Run: npm run icons
"""
from pathlib import Path

from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
MASTER = Image.open(ROOT / "assets/guard-icon.png").convert("RGB")
CELLS = MASTER.width


def edge_pad(img: Image.Image, cells: int) -> Image.Image:
    w, h = img.size
    px = img.load()
    out = Image.new("RGB", (w + 2 * cells, h + 2 * cells))
    po = out.load()
    for y in range(h + 2 * cells):
        for x in range(w + 2 * cells):
            sx = min(max(x - cells, 0), w - 1)
            sy = min(max(y - cells, 0), h - 1)
            po[x, y] = px[sx, sy]
    return out


def render(size: int, scale: int) -> Image.Image:
    """Scale by a whole number, pad edge cells until it covers `size`, then
    centre-crop to `size`."""
    cells = 0
    while (CELLS + 2 * cells) * scale < size:
        cells += 1
    grid = edge_pad(MASTER, cells) if cells else MASTER
    big = grid.resize((grid.width * scale, grid.height * scale), Image.NEAREST)
    off = (big.width - size) // 2
    return big.crop((off, off, off + size, off + size))


def any_icon(size: int) -> Image.Image:
    return render(size, max(1, round(size / CELLS)))


def maskable(size: int) -> Image.Image:
    # At 9/512 per cell the whole guard, hat included, sits inside the
    # 0.4-radius safe circle.
    return render(size, max(1, size * 9 // 512))


def write(img: Image.Image, rel: str) -> None:
    img.save(ROOT / rel, optimize=True)
    print(f"{rel} {img.width}x{img.height}")


write(any_icon(512), "public/icons/icon-512.png")
write(any_icon(192), "public/icons/icon-192.png")
write(maskable(512), "public/icons/maskable-512.png")
write(any_icon(180), "src/app/apple-icon.png")
write(any_icon(256), "src/app/icon.png")

# favicon.ico: whole-cell crops of the face and hat at 1:1 for 16 and 32,
# the full guard for 48 and 256.
fav32 = MASTER.crop((5, 2, 37, 34))
fav16 = MASTER.crop((13, 12, 29, 28))
fav48 = render(48, 1)
fav256 = any_icon(256)
fav256.save(ROOT / "src/app/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48), (256, 256)],
            append_images=[fav16, fav32, fav48])
print("src/app/favicon.ico 16/32/48/256")
