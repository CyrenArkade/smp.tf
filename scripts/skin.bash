#!/usr/bin/env bash

magick $1 \
  -write mpr:skin +delete -filter point \
  \( mpr:skin -crop 8x8+8+8 +repage -resize 64x64 -page +4+4 \) \
  \( mpr:skin -crop 8x8+40+8 +repage -resize 72x72 \) \
  -background none -layers merge \
  $1

