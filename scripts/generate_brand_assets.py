from pathlib import Path
from PIL import Image, ImageDraw, ImageFont

ROOT = Path('/Users/danknauss/Developer/GitHub/wp-bibliography-block')
ASSETS = ROOT / '.wordpress-org'
SOURCE = ASSETS / 'source'

BG = '#F5F3EF'
CHARCOAL = '#2D3136'
EDGE = '#23272B'
SLATE = '#7B8FA1'
SHELF = '#9B9EA3'
ACCENT = '#C4973E'
SUBTITLE = '#7B8FA1'
LABEL = (255, 255, 255, 217)
FONT = '/System/Library/Fonts/Supplemental/Baskerville.ttc'


def rounded(draw, xy, radius, fill):
    draw.rounded_rectangle(xy, radius=radius, fill=fill)


def draw_bookshelf_mark(size, background=BG):
    image = Image.new('RGBA', size, background)
    draw = ImageDraw.Draw(image)
    sx = size[0] / 140
    sy = size[1] / 175

    rounded(draw, (0, int(168 * sy), size[0], int(175 * sy)), max(1, int(1 * min(sx, sy))), SHELF)

    # left book on a rotated layer
    layer = Image.new('RGBA', size, (0, 0, 0, 0))
    ld = ImageDraw.Draw(layer)
    x0, y0 = 0, int(8 * sy)
    w, h = int(38 * sx), int(160 * sy)
    rounded(ld, (x0, y0, x0 + w, y0 + h), max(2, int(2 * min(sx, sy))), CHARCOAL)
    rounded(ld, (x0, y0, x0 + max(3, int(5 * sx)), y0 + h), max(1, int(1 * min(sx, sy))), EDGE)
    rounded(ld, (int(11 * sx), int(78 * sy), int(29 * sx), int(85 * sy)), max(1, int(1.5 * min(sx, sy))), LABEL)
    layer = layer.rotate(-4, center=(int(42 * sx), int(148 * sy)), resample=Image.Resampling.BICUBIC)
    image.alpha_composite(layer)

    # center book
    draw = ImageDraw.Draw(image)
    x = int(40 * sx)
    rounded(draw, (x, 0, x + int(12 * sx), int(168 * sy)), max(1, int(1 * min(sx, sy))), SLATE)
    rounded(draw, (x + int(8 * sx), 0, x + int(46 * sx), int(168 * sy)), max(2, int(2 * min(sx, sy))), CHARCOAL)
    rounded(draw, (x + int(8 * sx), 0, x + int(13 * sx), int(168 * sy)), max(1, int(1 * min(sx, sy))), EDGE)
    rounded(draw, (x + int(20 * sx), int(78 * sy), x + int(38 * sx), int(85 * sy)), max(1, int(1.5 * min(sx, sy))), LABEL)

    # right book
    x = int(84 * sx)
    y = int(12 * sy)
    rounded(draw, (x, y, x + int(38 * sx), y + int(156 * sy)), max(2, int(2 * min(sx, sy))), CHARCOAL)
    rounded(draw, (x, y, x + max(3, int(5 * sx)), y + int(156 * sy)), max(1, int(1 * min(sx, sy))), EDGE)
    rounded(draw, (x + int(11 * sx), y + int(72 * sy), x + int(29 * sx), y + int(79 * sy)), max(1, int(1.5 * min(sx, sy))), LABEL)

    return image


def fit_font(text, max_width, start_size, min_size=12):
    dummy = Image.new('RGB', (10, 10))
    d = ImageDraw.Draw(dummy)
    for size in range(start_size, min_size - 1, -1):
        font = ImageFont.truetype(FONT, size)
        bbox = d.textbbox((0, 0), text, font=font)
        if bbox[2] - bbox[0] <= max_width:
            return font
    return ImageFont.truetype(FONT, min_size)


def draw_banner(width, height, path):
    image = Image.new('RGBA', (width, height), BG)
    draw = ImageDraw.Draw(image)

    scale = min(width / 960, height / 280)
    content_w = int(960 * scale)
    content_h = int(280 * scale)
    offset_x = (width - content_w) // 2
    offset_y = (height - content_h) // 2

    mark = draw_bookshelf_mark((int(140 * scale), int(175 * scale)))
    image.alpha_composite(mark, (offset_x + int(100 * scale), offset_y + int(50 * scale)))

    title = 'Bibliography'
    subtitle = 'Scholarly references for WordPress'
    title_x = offset_x + int(360 * scale)
    title_y = offset_y + int(40 * scale)
    title_font = fit_font(title, int(520 * scale), int(72 * scale), min_size=max(24, int(32 * scale)))
    subtitle_font = ImageFont.truetype(FONT, max(14, int(24 * scale)))

    draw.text((title_x, title_y), title, font=title_font, fill=CHARCOAL)
    bbox = draw.textbbox((title_x, title_y), title, font=title_font)
    sub_y = offset_y + int(178 * scale) - (draw.textbbox((0,0), subtitle, font=subtitle_font)[3] // 2)
    draw.text((offset_x + int(362 * scale), sub_y), subtitle, font=subtitle_font, fill=SUBTITLE)
    draw.rounded_rectangle((offset_x + int(362 * scale), offset_y + int(192 * scale), offset_x + int(562 * scale), offset_y + int(196 * scale)), radius=max(1, int(2 * scale)), fill=ACCENT)

    image.save(path)


def main():
    ASSETS.mkdir(exist_ok=True)
    SOURCE.mkdir(exist_ok=True)
    draw_banner(1544, 500, ASSETS / 'banner-1544x500.png')
    draw_banner(772, 250, ASSETS / 'banner-772x250.png')
    draw_bookshelf_mark((256, 256)).save(ASSETS / 'icon-256x256.png')
    draw_bookshelf_mark((128, 128)).save(ASSETS / 'icon-128x128.png')
    (SOURCE / 'brand-notes.md').write_text(
        '# Brand notes\n\nBanner and icon assets based on the approved 960×280 SVG concept with a three-book shelf mark, Baskerville-style wordmark, slate subtitle, and gold underline rule. Generated via `/Users/danknauss/Developer/GitHub/wp-bibliography-block/scripts/generate_brand_assets.py`.\n'
    )

if __name__ == '__main__':
    main()
