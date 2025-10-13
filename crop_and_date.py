"""Reads PNG files in a folder,
    crops them to square dimensions,
    and writes timestamp in lower-left corner."""
import os
from datetime import datetime
from glob import glob

from PIL import Image
from PIL import ImageFont
from PIL import ImageDraw

for file in glob('*.png'):
    output_folder = 'output'
    img = Image.open(file)
    width, height = img.size

    # Calculate new dimensions
    top = 0
    bottom = height
    left = (width-height)/2
    right = height + ((width-height)/2)
    print(file)
    print('\t' + str(left) + ' x ' + str(right))
    img_new = img.crop((left, top, right, bottom))

    # Draw timestamp
    draw = ImageDraw.Draw(img_new)
    font = ImageFont.truetype("Helvetica LT Ultra Compressed.ttf", 150)
    stats = os.stat(file)
    date_epoch = stats.st_birthtime
    date_object = datetime.fromtimestamp(date_epoch)
    print('\t' + str(date_object) + '\n')

    if str(date_object).find('.') > 0:
        caption = str(date_object)[:str(date_object).find('.')]
    else:
        caption = str(date_object)
    draw.text(
        (25, 2000),
        caption,
        fill=(255, 204, 51),
        font=font,
        stroke_width=3,
        stroke_fill='black'
    )

    if not os.path.exists(output_folder):
        os.makedirs(output_folder)
    img_new.save(output_folder + '/' + file)
