#!/usr/bin/env bash

magick $1 \
  -write mpr:skin +delete -filter point \
  \( mpr:skin -crop 8x8+8+8 +repage -resize 128x128 -page +4+4 \) \
  \( mpr:skin -crop 8x8+40+8 +repage -resize 136x136 \) \
  -background none -layers merge \
  $1

