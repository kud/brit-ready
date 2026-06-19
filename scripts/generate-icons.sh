#!/usr/bin/env zsh
# Generate PWA icons from the pixel-guard source image.
# Centre-crops to a square (no distortion), then scales to each required size.
set -e

src="assets/guard-source.png"
square="/tmp/brit-ready-guard-square.png"

if [[ ! -f "$src" ]]; then
  print "Source image not found: $src" >&2
  exit 1
fi

# Crop to the largest centred square the image allows (height is the limit).
size=$(sips -g pixelHeight "$src" | awk '/pixelHeight/{print $2}')
sips -c "$size" "$size" "$src" --out "$square" >/dev/null

sips -z 512 512 "$square" --out public/icons/icon-512.png >/dev/null
sips -z 512 512 "$square" --out public/icons/maskable-512.png >/dev/null
sips -z 192 192 "$square" --out public/icons/icon-192.png >/dev/null
sips -z 180 180 "$square" --out src/app/apple-icon.png >/dev/null
sips -z 256 256 "$square" --out src/app/icon.png >/dev/null

print "Icons generated from $src"
