#!/usr/bin/env python3
"""
Generate the Swiss Insider Guide PDF for Swissperiences.
Uses original Swissperiences photos + Pexels stock for missing locations.
"""

import os
from reportlab.lib.pagesizes import A4
from reportlab.lib.units import mm
from reportlab.lib.colors import HexColor, white, Color
from reportlab.pdfgen import canvas
from reportlab.lib.utils import ImageReader
from PIL import Image

# --- Config ---
W, H = A4  # 210 x 297 mm
OUTPUT = os.path.join(os.path.dirname(__file__), '..', 'public', 'insider-guide.pdf')
IMG_DIR = os.path.join(os.path.dirname(__file__), '..', 'public', 'images')
PEXELS_DIR = os.path.join(os.path.dirname(__file__), 'carousel-images')

TEAL = HexColor('#2E9090')
DARK_BG = HexColor('#0d1414')
WHITE = white


def draw_full_bg(c, color):
    c.setFillColor(color)
    c.rect(0, 0, W, H, fill=1, stroke=0)


def draw_image_cover(c, img_path):
    try:
        img = Image.open(img_path)
        iw, ih = img.size
        page_ratio = W / H
        img_ratio = iw / ih
        if img_ratio > page_ratio:
            new_h = ih
            new_w = int(ih * page_ratio)
            left = (iw - new_w) // 2
            img = img.crop((left, 0, left + new_w, ih))
        else:
            new_w = iw
            new_h = int(iw / page_ratio)
            top = (ih - new_h) // 2
            img = img.crop((0, top, iw, top + new_h))
        c.drawImage(ImageReader(img), 0, 0, W, H, preserveAspectRatio=False, mask='auto')
    except Exception as e:
        print(f"  Warning: Could not load image {img_path}: {e}")


def draw_gradient_overlay(c, start_alpha=0.0, end_alpha=0.85):
    steps = 60
    for i in range(steps):
        t = i / steps
        alpha = start_alpha + (end_alpha - start_alpha) * (t ** 1.5)
        y = H * (1 - t) - H / steps
        c.setFillColor(Color(0, 0, 0, alpha))
        c.rect(0, y, W, H / steps + 1, fill=1, stroke=0)


def draw_teal_line(c, x, y, length=14):
    c.setStrokeColor(TEAL)
    c.setLineWidth(2.5)
    c.line(x, y, x + length * mm, y)


def safe_img(*paths):
    for p in paths:
        if p and os.path.exists(p):
            return p
    return None


def wrap_text(c, text, font, size, max_w):
    lines = []
    words = text.split()
    line = ""
    for word in words:
        test = line + " " + word if line else word
        if c.stringWidth(test, font, size) < max_w:
            line = test
        else:
            lines.append(line)
            line = word
    if line:
        lines.append(line)
    return lines


# --- Content ---
gems = [
    {
        "number": "01", "region": "Bern Region",
        "title": "Blausee", "subtitle": "The Blue Lake",
        "body": "A crystal-clear alpine lake hidden in the Kander Valley. The water is so transparent you can see 15 meters to the bottom. Most visitors rush past on the way to Interlaken \u2014 but this is where the magic actually is.",
        "tip": "Visit in autumn when the surrounding forest turns golden and the crowds disappear completely.",
        "img": safe_img(os.path.join(IMG_DIR, 'drone', 'blausee-autumn-aerial.jpg'), os.path.join(PEXELS_DIR, '02-blausee.jpg')),
    },
    {
        "number": "02", "region": "Valais",
        "title": "Bisse de Clavau", "subtitle": "Vineyard Trail",
        "body": "An ancient water channel trail winding through the UNESCO-protected terraced vineyards of Sion. Panoramic views of the Rh\u00f4ne Valley with zero tourists. End the walk at a local cave for wine tasting.",
        "tip": "Go at sunset. The light on the vineyards is unreal \u2014 and most caves stay open until 7pm.",
        "img": safe_img(os.path.join(IMG_DIR, 'lake-geneva', 'lavaux-vineyards-sunset.jpeg'), os.path.join(PEXELS_DIR, '03-bisse-clavau.jpg')),
    },
    {
        "number": "03", "region": "Central Switzerland",
        "title": "Seelisberg", "subtitle": "R\u00fctli Meadow",
        "body": "The birthplace of Switzerland, accessible only by boat or foot. A sacred meadow overlooking Lake Lucerne where the Swiss Confederation was born in 1291. No roads, no cars, no crowds \u2014 just history and silence.",
        "tip": "Take the boat from Brunnen. The approach by water is the way the original Swiss did it.",
        "img": safe_img(os.path.join(IMG_DIR, 'lucerne-chapel-bridge.jpg'), os.path.join(PEXELS_DIR, '04-seelisberg.jpg')),
    },
    {
        "number": "04", "region": "Geneva",
        "title": "Carouge", "subtitle": "Little Italy",
        "body": "A bohemian neighborhood 10 minutes from Geneva center that feels like Turin transplanted into Switzerland. Artisan workshops, independent boutiques, the best aperitivo in the country \u2014 and not a single tour group.",
        "tip": "Wednesday and Saturday mornings have an incredible market in Place du March\u00e9. Arrive before 10am.",
        "img": safe_img(os.path.join(PEXELS_DIR, '05-carouge.jpg')),
    },
    {
        "number": "05", "region": "Graub\u00fcnden",
        "title": "Caumasee", "subtitle": "The Floating Lake",
        "body": "A turquoise lake surrounded by forest near Flims \u2014 fed entirely by underground springs, giving it an otherworldly color. Locals swim here in summer. In winter, it freezes into a natural ice rink.",
        "tip": "Walk from Flims through the forest trail instead of taking the elevator. The reveal when you first see the water is worth it.",
        "img": safe_img(os.path.join(PEXELS_DIR, '06-caumasee.jpg')),
    },
    {
        "number": "06", "region": "Ticino",
        "title": "Corippo", "subtitle": "Switzerland's Smallest Village",
        "body": "Population: 12 people. A medieval stone village clinging to a mountainside in the Verzasca Valley. The entire village has been converted into a single albergo diffuso \u2014 a scattered hotel across the old stone houses.",
        "tip": "Combine with a swim in the emerald Verzasca River pools. The James Bond dam (GoldenEye) is 20 minutes away.",
        "img": safe_img(os.path.join(PEXELS_DIR, '07-corippo.jpg')),
    },
    {
        "number": "07", "region": "Vaud / Neuch\u00e2tel",
        "title": "Creux du Van", "subtitle": "The Swiss Grand Canyon",
        "body": "A 160-meter vertical rock amphitheater in the Jura mountains. Wild ibex roam the cliff edges. A 2-hour hike through forest leads to a viewpoint that rivals anything in the Alps \u2014 with a fraction of the people.",
        "tip": "Start from Noiraigue station. Pack a fondue kit and eat at the edge \u2014 the Swiss way.",
        "img": safe_img(os.path.join(PEXELS_DIR, '08-creux-du-van.jpg')),
    },
    {
        "number": "08", "region": "Z\u00fcrich",
        "title": "H\u00fcrlimann Spa", "subtitle": "Rooftop Thermal Pool",
        "body": "A rooftop infinity thermal pool in a converted 19th-century brewery, overlooking the Z\u00fcrich skyline. Thermal water at 36\u00b0C while the city lights up below you. The ultimate way to end a Swiss day.",
        "tip": "Book the Monday evening slot \u2014 it's the least crowded. Pair it with dinner at Clouds (same building, 35th floor).",
        "img": safe_img(os.path.join(IMG_DIR, 'villars', 'thermal-pool-alps.jpeg'), os.path.join(PEXELS_DIR, '09-hurlimann-spa.jpg')),
    },
    {
        "number": "09", "region": "Bern Region",
        "title": "Oeschinensee", "subtitle": "The Hidden Alpine Mirror",
        "body": "A jaw-dropping turquoise lake sitting at 1,578m altitude, surrounded by towering cliffs and waterfalls. Take the gondola up from Kandersteg, then walk 20 minutes through alpine meadows for the reveal of a lifetime.",
        "tip": "Rent a rowboat and paddle to the far end. The echo off the cliffs is magical \u2014 and you'll have the whole lake to yourself.",
        "img": safe_img(os.path.join(IMG_DIR, 'oeschinensee.jpg'), os.path.join(IMG_DIR, 'oeschinen-lake.jpg')),
    },
    {
        "number": "10", "region": "Bern Region",
        "title": "Lauterbrunnen", "subtitle": "Valley of 72 Waterfalls",
        "body": "A glacial valley so dramatic it inspired Tolkien's Rivendell. Sheer cliffs on both sides, with 72 waterfalls cascading from above. Staubbach Falls drops 297m right into the village \u2014 the tallest free-falling waterfall in Switzerland.",
        "tip": "Skip the crowded Staubbach viewpoint. Walk 15 minutes to Trummelbach Falls instead \u2014 10 glacier waterfalls inside the mountain, accessible by tunnel lift.",
        "img": safe_img(os.path.join(IMG_DIR, 'lauterbrunnen-valley.jpg'), os.path.join(IMG_DIR, 'lauterbrunnen-staubbach.jpg')),
    },
    {
        "number": "11", "region": "Vaud",
        "title": "Lausanne", "subtitle": "The Olympic Capital",
        "body": "Switzerland's most underrated city. A stunning old town cascading down a hillside to Lake Geneva, home to the Olympic Museum and some of the best nightlife in the country. The anti-Z\u00fcrich \u2014 vibrant, youthful, full of surprises.",
        "tip": "Take the M2 metro (the steepest metro in the world) from Ouchy on the lake up to the cathedral for a jaw-dropping panorama.",
        "img": safe_img(os.path.join(IMG_DIR, 'lausanne-cathedral.jpg')),
    },
    {
        "number": "12", "region": "Bern Region",
        "title": "Grindelwald", "subtitle": "Gateway to the Eiger",
        "body": "The village sitting at the foot of the Eiger's infamous North Face. The new Eiger Express gondola shoots you up to Jungfraujoch (3,454m) \u2014 the Top of Europe \u2014 in just 45 minutes. The First Cliff Walk will test your nerves.",
        "tip": "Skip the expensive Jungfraujoch ticket. Instead, hike the free Eiger Trail from Eigergletscher to Alpiglen \u2014 you're literally walking under the North Face.",
        "img": safe_img(os.path.join(IMG_DIR, 'grindelwald-eiger.jpg')),
    },
]

bonus_gems = [
    {"name": "Appenzell", "region": "Eastern Switzerland", "desc": "Switzerland's most traditional region. Rolling green hills, ornate painted houses, and a living tradition of direct democracy where citizens still vote by show of hands."},
    {"name": "Aletsch Glacier", "region": "Valais", "desc": "The longest glacier in the Alps (23km). Hike along its edge from Bettmerhorn for a perspective that makes you feel like you're on another planet."},
    {"name": "Gstaad", "region": "Bern Region", "desc": "Not the clich\u00e9 billionaire ski resort. The surrounding Saanenland is full of quiet alpine trails, farm-to-table mountain restaurants, and some of the best cheese in the world."},
    {"name": "Zermatt", "region": "Valais", "desc": "No cars allowed \u2014 only electric taxis and horse-drawn carriages. The Matterhorn views are everywhere, but the real gem is the Gornergrat railway at sunrise."},
    {"name": "Rhine Falls", "region": "Schaffhausen", "desc": "Europe's largest waterfall by volume. Take the boat to the rock in the middle. It's chaos, it's wet, it's loud \u2014 and it's unforgettable."},
    {"name": "Bern Old Town", "region": "Bern", "desc": "A UNESCO World Heritage Site most tourists skip. The 6km of covered arcades (Lauben) house hidden cellars, boutiques, and the best fondue spots in the capital."},
    {"name": "Via Ferrata M\u00fcrren", "region": "Bern Region", "desc": "A via ferrata bolted into the cliff face above the Lauterbrunnen Valley. Not for the faint of heart, but the views are the reward of a lifetime."},
    {"name": "Lago di Lugano", "region": "Ticino", "desc": "The Mediterranean side of Switzerland. Palm trees, gelato, lakeside promenades, and Monte San Salvatore for a 360-degree panorama."},
    {"name": "Glacier Express", "region": "Multi-region", "desc": "The 'slowest express train in the world' \u2014 8 hours from Zermatt to St. Moritz through 91 tunnels and over 291 bridges. The panoramic windows are extraordinary."},
    {"name": "Chaplin's World", "region": "Vaud", "desc": "Charlie Chaplin's lakeside mansion in Corsier-sur-Vevey, now a world-class museum. Surprisingly moving and beautifully curated."},
    {"name": "Fondation Beyeler", "region": "Basel", "desc": "A Renzo Piano-designed museum housing one of the finest private art collections in Europe. Monet, Picasso, Warhol \u2014 in a building that is itself a work of art."},
    {"name": "Kapellbr\u00fccke", "region": "Central Switzerland", "desc": "Lucerne's 14th-century covered wooden bridge \u2014 the oldest in Europe. Walk across at dusk when the swans are out and the town glows pink."},
    {"name": "Br\u00fcnig Pass", "region": "Bern / Central", "desc": "A scenic drive connecting Interlaken to Lucerne. Stop at Lungern for an absurdly turquoise lake that looks photoshopped."},
    {"name": "Val Bavona", "region": "Ticino", "desc": "A wild valley with no permanent electricity. Stone houses tucked under giant boulders, waterfalls everywhere, and seasonal grotti serving polenta and local salami."},
    {"name": "Swiss National Park", "region": "Graub\u00fcnden", "desc": "Switzerland's only national park, one of the oldest in Europe. Ibex, marmots, golden eagles \u2014 and strictly maintained trails that let nature remain wild."},
    {"name": "Emmental Valley", "region": "Bern Region", "desc": "Where the cheese comes from. Rolling green hills, traditional farmhouses, and the Emmental Show Dairy where you can watch (and taste) the cheese being made."},
    {"name": "Lavaux Wine Region", "region": "Vaud", "desc": "UNESCO-protected vineyard terraces overlooking Lake Geneva. Walk the 10km trail from Lutry to Saint-Saphorin, stopping at cave after cave for tastings."},
    {"name": "Stockalper Palace", "region": "Valais", "desc": "The largest private palace in Switzerland, in the tiny town of Brig. Built by a 17th-century merchant prince. Most Swiss people have never heard of it."},
]


def build_pdf():
    c = canvas.Canvas(OUTPUT, pagesize=A4)
    c.setTitle("The Swiss Insider Guide")
    c.setAuthor("Swissperiences")
    c.setSubject("30+ Hidden Gems in Switzerland")

    # ========== PAGE 1: COVER ==========
    cover_img = safe_img(
        os.path.join(IMG_DIR, 'drone', 'villars-autumn-sunset.jpg'),
        os.path.join(PEXELS_DIR, '01-cover.jpg')
    )
    if cover_img:
        draw_image_cover(c, cover_img)
    draw_gradient_overlay(c, 0.0, 0.88)

    # Badge
    c.setFillColor(Color(1, 1, 1, 0.08))
    c.setStrokeColor(Color(1, 1, 1, 0.3))
    c.setLineWidth(0.8)
    c.roundRect(30*mm, 58*mm, 55*mm, 9*mm, 4.5*mm, fill=1, stroke=1)
    c.setFillColor(Color(1, 1, 1, 0.8))
    c.setFont("Helvetica", 8)
    c.drawString(35*mm, 61.5*mm, "S W I S S P E R I E N C E S")

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 42)
    c.drawString(30*mm, 47*mm, "The Swiss")
    c.drawString(30*mm, 33*mm, "Insider Guide")

    c.setFillColor(Color(1, 1, 1, 0.65))
    c.setFont("Helvetica", 14)
    c.drawString(30*mm, 24*mm, "30+ Hidden Gems Most Tourists Will Never Find")

    draw_teal_line(c, 30*mm, 20*mm)

    c.setFillColor(Color(1, 1, 1, 0.4))
    c.setFont("Helvetica", 9)
    c.drawString(30*mm, 14*mm, "swissperiences.ch")
    c.showPage()

    # ========== PAGE 2: INTRO ==========
    draw_full_bg(c, DARK_BG)
    c.setStrokeColor(TEAL)
    c.setLineWidth(3)
    c.line(0, H - 2, W * 0.3, H - 2)

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 28)
    c.drawString(30*mm, H - 40*mm, "Welcome to")
    c.setFillColor(TEAL)
    c.drawString(30*mm, H - 52*mm, "the inside.")
    draw_teal_line(c, 30*mm, H - 58*mm)

    c.setFillColor(Color(1, 1, 1, 0.7))
    c.setFont("Helvetica", 11)
    y = H - 70*mm
    for line in [
        "Switzerland is one of the most visited countries in the world.",
        "But most travelers only scratch the surface \u2014 the same viewpoints,",
        "the same Instagram spots, the same tourist traps.",
        "",
        "This guide is different.",
        "",
        "We've curated 30+ places that even most Swiss locals don't know",
        "about. From crystal-clear lakes hidden in alpine valleys to medieval",
        "villages with a population of 12, from underground thermal pools to",
        "cliff-edge trails with views that rival the Grand Canyon.",
        "",
        "These are the places we take our own members.",
        "Now they're yours.",
        "",
    ]:
        c.drawString(30*mm, y, line)
        y -= 6*mm

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 11)
    c.drawString(30*mm, y, "Cau\u00eah Vidal")
    y -= 5.5*mm
    c.setFillColor(Color(1, 1, 1, 0.5))
    c.setFont("Helvetica", 10)
    c.drawString(30*mm, y, "Founder, Swissperiences")

    c.setFillColor(Color(1, 1, 1, 0.2))
    c.setFont("Helvetica", 8)
    c.drawString(30*mm, 12*mm, "swissperiences.ch")
    c.drawRightString(W - 30*mm, 12*mm, "2")
    c.showPage()

    # ========== GEM PAGES ==========
    for i, gem in enumerate(gems):
        page_num = i + 3

        if gem["img"]:
            draw_image_cover(c, gem["img"])
            draw_gradient_overlay(c, 0.05, 0.94)
        else:
            draw_full_bg(c, DARK_BG)

        # Number badge
        c.setFillColor(TEAL)
        c.circle(38*mm, H - 18*mm, 8*mm, fill=1, stroke=0)
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 12)
        c.drawCentredString(38*mm, H - 21*mm, gem["number"])

        # Region pill
        c.setFillColor(Color(0, 0, 0, 0.5))
        region_w = c.stringWidth(gem["region"].upper(), "Helvetica", 8) + 14*mm
        c.roundRect(W - 30*mm - region_w, H - 24*mm, region_w, 12*mm, 6*mm, fill=1, stroke=0)
        c.setFillColor(Color(1, 1, 1, 0.75))
        c.setFont("Helvetica", 8)
        c.drawRightString(W - 37*mm, H - 19.5*mm, gem["region"].upper())

        # Title + subtitle
        c.setFillColor(WHITE)
        c.setFont("Helvetica-Bold", 32)
        c.drawString(25*mm, 92*mm, gem["title"])
        c.setFillColor(Color(1, 1, 1, 0.7))
        c.setFont("Helvetica", 16)
        c.drawString(25*mm, 83*mm, gem["subtitle"])
        draw_teal_line(c, 25*mm, 78*mm)

        # Body
        max_w = W - 55*mm
        c.setFillColor(Color(1, 1, 1, 0.8))
        c.setFont("Helvetica", 10.5)
        y = 72*mm
        for line in wrap_text(c, gem["body"], "Helvetica", 10.5, max_w):
            c.drawString(25*mm, y, line)
            y -= 5*mm

        # Insider tip box
        y -= 4*mm
        tip_lines = wrap_text(c, gem["tip"], "Helvetica", 9.5, max_w - 16*mm)
        tip_h = len(tip_lines) * 4.5*mm + 10*mm
        tip_y = y - tip_h

        c.setFillColor(Color(0.18, 0.56, 0.56, 0.15))
        c.roundRect(25*mm, tip_y, W - 55*mm, tip_h, 3*mm, fill=1, stroke=0)
        c.setFillColor(TEAL)
        c.rect(25*mm, tip_y, 2.5, tip_h, fill=1, stroke=0)

        c.setFillColor(TEAL)
        c.setFont("Helvetica-Bold", 9.5)
        ty = tip_y + tip_h - 7*mm
        c.drawString(30*mm, ty, "Insider tip:")
        c.setFillColor(Color(1, 1, 1, 0.75))
        c.setFont("Helvetica", 9.5)
        for tl in tip_lines:
            ty -= 4.5*mm
            c.drawString(30*mm, ty, tl)

        # Footer
        c.setFillColor(Color(1, 1, 1, 0.25))
        c.setFont("Helvetica", 7.5)
        c.drawString(25*mm, 10*mm, "S W I S S P E R I E N C E S")
        c.drawRightString(W - 25*mm, 10*mm, str(page_num))
        c.showPage()

    # ========== BONUS GEMS ==========
    gems_per_page = 6
    for page_start in range(0, len(bonus_gems), gems_per_page):
        page_gems = bonus_gems[page_start:page_start + gems_per_page]
        page_num = len(gems) + 3 + (page_start // gems_per_page)

        draw_full_bg(c, DARK_BG)

        if page_start == 0:
            c.setStrokeColor(TEAL)
            c.setLineWidth(3)
            c.line(0, H - 2, W * 0.3, H - 2)
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 24)
            c.drawString(25*mm, H - 32*mm, "18 More Gems")
            c.setFillColor(TEAL)
            c.setFont("Helvetica", 14)
            c.drawString(25*mm, H - 42*mm, "Because 12 wasn't enough.")
            draw_teal_line(c, 25*mm, H - 48*mm)
            y = H - 60*mm
        else:
            y = H - 30*mm

        for bg in page_gems:
            gem_num = bonus_gems.index(bg) + 13
            c.setFillColor(TEAL)
            c.setFont("Helvetica-Bold", 11)
            c.drawString(25*mm, y, f"{gem_num}.")
            c.setFillColor(WHITE)
            c.setFont("Helvetica-Bold", 13)
            c.drawString(35*mm, y, bg["name"])
            c.setFillColor(Color(1, 1, 1, 0.45))
            c.setFont("Helvetica", 9)
            c.drawString(35*mm, y - 5.5*mm, bg["region"])

            c.setFillColor(Color(1, 1, 1, 0.7))
            c.setFont("Helvetica", 10)
            y -= 13*mm
            max_w = W - 60*mm
            for line in wrap_text(c, bg["desc"], "Helvetica", 10, max_w):
                c.drawString(35*mm, y, line)
                y -= 4.8*mm
            y -= 8*mm

        c.setFillColor(Color(1, 1, 1, 0.25))
        c.setFont("Helvetica", 7.5)
        c.drawString(25*mm, 10*mm, "S W I S S P E R I E N C E S")
        c.drawRightString(W - 25*mm, 10*mm, str(page_num))
        c.showPage()

    # ========== LAST PAGE: CTA ==========
    cta_img = safe_img(
        os.path.join(IMG_DIR, 'villars', 'morning-peak-sun.jpeg'),
        os.path.join(PEXELS_DIR, '10-cta.jpg')
    )
    if cta_img:
        draw_image_cover(c, cta_img)
    draw_gradient_overlay(c, 0.5, 0.92)

    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 30)
    c.drawCentredString(W/2, H/2 + 30*mm, "Ready to Experience")
    c.drawCentredString(W/2, H/2 + 16*mm, "Switzerland Like This?")
    draw_teal_line(c, W/2 - 7*mm, H/2 + 8*mm)

    c.setFillColor(Color(1, 1, 1, 0.65))
    c.setFont("Helvetica", 12)
    c.drawCentredString(W/2, H/2 - 2*mm, "Swissperiences is a membership-based travel platform")
    c.drawCentredString(W/2, H/2 - 9*mm, "for travelers who want the real Switzerland.")
    c.drawCentredString(W/2, H/2 - 16*mm, "Curated packages. Local knowledge. Insider access.")

    box_w = 70*mm
    box_h = 16*mm
    box_x = W/2 - box_w/2
    box_y = H/2 - 38*mm
    c.setStrokeColor(TEAL)
    c.setLineWidth(1.5)
    c.setFillColor(Color(0.18, 0.56, 0.56, 0.12))
    c.roundRect(box_x, box_y, box_w, box_h, 3*mm, fill=1, stroke=1)
    c.setFillColor(WHITE)
    c.setFont("Helvetica-Bold", 14)
    c.drawCentredString(W/2, box_y + 5.5*mm, "swissperiences.ch")

    c.setFillColor(Color(1, 1, 1, 0.4))
    c.setFont("Helvetica", 10)
    c.drawCentredString(W/2, box_y - 12*mm, "@swissperiences  |  hello@swissperiences.ch")

    c.setFillColor(Color(1, 1, 1, 0.25))
    c.setFont("Helvetica", 7.5)
    c.drawCentredString(W/2, 10*mm, "\u00a9 Swissperiences 2026. All rights reserved.")
    c.showPage()

    c.save()
    total_pages = len(gems) + 3 + -(-len(bonus_gems) // gems_per_page) + 1
    print(f"\nPDF generated: {os.path.abspath(OUTPUT)}")
    print(f"Total pages: {total_pages}")
    print(f"  - Cover + Intro: 2 pages")
    print(f"  - Featured gems: {len(gems)} pages (with photos)")
    print(f"  - Bonus gems: {-(-len(bonus_gems) // gems_per_page)} pages (text)")
    print(f"  - CTA: 1 page")


if __name__ == "__main__":
    build_pdf()
