IMAGES
======

Both files below were generated from the original you supplied
(adam_b.jpg, 800 x 800, in the project root).

  adam-bocev.jpg            800 x 800  - full frame, the original square
  adam-bocev-portrait.jpg   600 x 600  - head-and-shoulders crop

Where each one is used:

  adam-bocev.jpg
    - about.html  -> Founder's message, large portrait
      (keeps the full "speaking at an event" composition, which suits
       the letter alongside it)

  adam-bocev-portrait.jpg
    - index.html  -> Founder's note, round avatar
    - about.html  -> Team grid card
      (in the original, his head sits in the upper-left, so a circular
       or small square crop of the full frame would have put him
       noticeably off-centre; this crop re-centres him)

Regenerating the crop
---------------------
If you replace the original, recreate the crop with:

    python -c "from PIL import Image; im=Image.open('adam_b.jpg').convert('RGB'); \
    im.crop((46,0,546,500)).resize((600,600), Image.LANCZOS).save(\
    'assets/img/adam-bocev-portrait.jpg','JPEG',quality=88,optimize=True,progressive=True)"

Adjust the crop box (left, top, right, bottom) to suit the new framing.

Swapping in a different photo
-----------------------------
Keep the same two filenames and everything keeps working. Requirements:
square crop, 800 x 800 px or larger, .jpg. If you use .png or .webp,
update the three <img src="..."> references to match.

If an image file is ever missing, each slot falls back automatically to
a styled "AB" monogram rather than showing a broken image.

Note: the original adam_b.jpg in the project root is not referenced by
the site. It is kept as the master copy - safe to delete before you
deploy, or keep it for regenerating crops later.
