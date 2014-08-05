#!/bin/bash

set -eu

echo "I will convert Adobe-swf_icon.png to IAB compatible images. Continue ?"
read

# see http://www.iab.net/guidelines/508676/508767/displayguidelines
for format in 728x90 468x60 234x60 120x600 160x600 200x200 250x250 300x250 336x280 180x150 300x600 ; do
  convert Adobe-swf_icon.png -resize ${format} -background none -gravity center -extent ${format} Adobe-swf_icon_${format}.png
done
