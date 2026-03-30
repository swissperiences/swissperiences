#!/usr/bin/env python3
"""
Generate the Swiss Insider Guide PDF v3 for Swissperiences.
1080x1920 vertical pages, dark luxury design, brand voice: "A pause — designed."
"""

import os
from fpdf import FPDF
from PIL import Image, ImageDraw

# --- Paths ---
BASE = "/Users/cv/Documents/MeusProjetos/swissperiences"
IMG_DIR = os.path.join(BASE, "public/images")
CAROUSEL_DIR = os.path.join(BASE, "tools/carousel-images")
OUTPUT = os.path.join(BASE, "public/insider-guide.pdf")
LOGO_PATH = os.path.join(IMG_DIR, "logo-dark.png")

# --- Design tokens ---
BG = (10, 15, 15)          # #0a0f0f
WHITE = (255, 255, 255)
TEAL = (46, 144, 144)      # #2E9090
SWISS_RED = (197, 27, 27)  # #C51B1B
GREY = (160, 170, 170)
LIGHT_TEXT = (220, 225, 225)
DIM_TEXT = (120, 130, 130)

# Page size in mm (1080x1920 px at ~3x)
PW = 91.44
PH = 162.56

_img_counter = 0


def _clean(text):
    """Replace Unicode chars that Helvetica can't render."""
    return (text
        .replace("\u2014", " -- ")
        .replace("\u2013", "-")
        .replace("\u2018", "'")
        .replace("\u2019", "'")
        .replace("\u201c", '"')
        .replace("\u201d", '"')
        .replace("\u00b0", " degrees")
        .replace("\u2026", "...")
        .replace("\u00e8", "e")   # e-grave (Caueh)
        .replace("\u00fc", "u")   # u-umlaut (Graubunden)
        .replace("\u00e9", "e")   # e-acute
        .replace("\u00e0", "a")   # a-grave
    )


class InsiderGuidePDF(FPDF):
    def __init__(self):
        super().__init__(unit="mm", format=(PW, PH))
        self.set_auto_page_break(auto=False)
        self.set_margins(0, 0, 0)

    def dark_page(self):
        self.set_fill_color(*BG)
        self.rect(0, 0, PW, PH, "F")

    def draw_image_cover(self, img_path, opacity_overlay=0.55, gradient_style="default"):
        """Draw image filling page with gradient overlay baked in."""
        global _img_counter
        if not os.path.exists(img_path):
            self.dark_page()
            return
        _img_counter += 1
        tmp_path = f"/tmp/insider_guide_v3_{_img_counter:02d}.jpg"
        self._crop_and_darken(img_path, tmp_path, 9, 16, opacity_overlay, gradient_style)
        self.image(tmp_path, x=0, y=0, w=PW, h=PH)

    def _crop_and_darken(self, src, dst, rw, rh, overlay_opacity=0.55, gradient_style="default"):
        """Crop to ratio, apply gradient overlay, save as JPEG."""
        img = Image.open(src)
        if img.mode in ("RGBA", "P", "LA"):
            img = img.convert("RGB")
        w, h = img.size
        target_ratio = rw / rh
        current_ratio = w / h
        if current_ratio > target_ratio:
            new_w = int(h * target_ratio)
            left = (w - new_w) // 2
            img = img.crop((left, 0, left + new_w, h))
        else:
            new_h = int(w / target_ratio)
            top = (h - new_h) // 2
            img = img.crop((0, top, w, top + new_h))
        img = img.resize((1080, 1920), Image.LANCZOS)

        overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)

        for y in range(1920):
            frac = y / 1920
            if gradient_style == "cover":
                # Cover: strong top for logo/title, lighter middle for photo, strong bottom
                if frac < 0.05:
                    a = 0.75
                elif frac < 0.25:
                    a = 0.75 - (frac - 0.05) * 1.5
                elif frac < 0.55:
                    a = overlay_opacity * 0.45
                elif frac < 0.70:
                    a = overlay_opacity * 0.45 + (frac - 0.55) * 2.0
                else:
                    a = 0.70 + (frac - 0.70) * 0.5
            elif gradient_style == "letter":
                # Letter from founder: heavier overlay for readability
                if frac < 0.08:
                    a = 0.80
                elif frac < 0.90:
                    a = 0.72
                else:
                    a = 0.80
            elif gradient_style == "sanctuary":
                # Sanctuary: moody, heavy overlay
                if frac < 0.10:
                    a = 0.82
                elif frac < 0.80:
                    a = 0.70
                else:
                    a = 0.80
            elif gradient_style == "cta":
                # CTA: very dark for text focus
                if frac < 0.10:
                    a = 0.85
                elif frac < 0.85:
                    a = 0.78
                else:
                    a = 0.85
            else:
                # Default: gem pages
                if frac < 0.08:
                    a = 0.80
                elif frac < 0.35:
                    a = 0.70 - (frac - 0.08) * 0.8
                elif frac < 0.60:
                    a = overlay_opacity * 0.55
                elif frac < 0.75:
                    a = overlay_opacity * 0.55 + (frac - 0.60) * 1.5
                else:
                    a = 0.72 + (frac - 0.75) * 0.6

            a = min(max(a, 0.15), 0.92)
            alpha = int(a * 255)
            draw.line([(0, y), (1079, y)], fill=(10, 15, 15, alpha))

        img = img.convert("RGBA")
        img = Image.alpha_composite(img, overlay)
        img = img.convert("RGB")
        img.save(dst, "JPEG", quality=88)

    def brand_header(self):
        """Draw S W I S S P E R I E N C E S at top of every page."""
        with self.local_context():
            self.set_font("Helvetica", "B", 6)
            self.set_text_color(*TEAL)
            self.set_xy(0, 4.5)
            self.cell(PW, 3.5, "S W I S S P E R I E N C E S", align="C")

    def page_footer_text(self, text="swissperiences.ch"):
        with self.local_context():
            self.set_font("Helvetica", "", 5)
            self.set_text_color(*GREY)
            self.set_xy(0, PH - 7)
            self.cell(PW, 3.5, text, align="C")

    def teal_line(self, x, y, w):
        self.set_draw_color(*TEAL)
        self.set_line_width(0.35)
        self.line(x, y, x + w, y)

    def swiss_cross(self, cx, cy, size=3.5):
        """Draw a small Swiss cross at position."""
        with self.local_context():
            self.set_fill_color(*SWISS_RED)
            arm_w = size * 0.3
            arm_l = size
            # Horizontal bar
            self.rect(cx - arm_l / 2, cy - arm_w / 2, arm_l, arm_w, "F")
            # Vertical bar
            self.rect(cx - arm_w / 2, cy - arm_l / 2, arm_w, arm_l, "F")

    def draw_tip_box(self, y, tip_text, height=20):
        """Draw insider tip box with teal accent."""
        margin = 7
        box_w = PW - margin * 2
        box_x = margin
        with self.local_context():
            with self.local_context(fill_opacity=0.25):
                self.set_fill_color(20, 50, 50)
                self.rect(box_x, y, box_w, height, "F")
            # Left accent bar
            self.set_fill_color(*TEAL)
            self.rect(box_x, y, 0.7, height, "F")
            # Label
            self.set_font("Helvetica", "B", 5)
            self.set_text_color(*TEAL)
            self.set_xy(box_x + 3, y + 1.5)
            self.cell(box_w - 6, 3, "INSIDER TIP")
            # Tip text
            self.set_font("Helvetica", "", 5.5)
            self.set_text_color(*LIGHT_TEXT)
            self.set_xy(box_x + 3, y + 5)
            self.multi_cell(box_w - 6, 2.8, tip_text)


# --- Content Data ---

SECRETS = [
    {
        "num": "01",
        "region": "VALAIS",
        "title": "The Wine Trail Nobody Rushes",
        "location": "Bisse de Clavau",
        "text": (
            "Above Sion, an ancient irrigation channel carved into cliffs leads through "
            "UNESCO terraced vineyards. The path is flat -- the views are vertical. On one "
            "side, 800-year-old vines descend toward the Rhone. On the other, a sheer drop "
            "into silence. Walk it one hour before sunset. End at a cave de degustation -- "
            "ask for the Petite Arvine, not the Fendant. The locals will know you belong."
        ),
        "insider": (
            "September harvest season. The vineyards glow amber. Most caves close at 7pm "
            "but Cave du Vieux-Moulin in Sion stays open later if you call ahead."
        ),
        "image": os.path.join(IMG_DIR, "lake-geneva/lavaux-vineyards-sunset.jpeg"),
        "gyg_label": "Lavaux Wine Tour",
        "gyg_url": "https://www.getyourguide.com/montreux-l32355/wine-tour-in-the-canton-of-vaud-lavaux-vineyards-t718850/?partner_id=XJZ4DP0&utm_medium=online_publisher&utm_source=swissperiences&cmp=bisse-clavau",
    },
    {
        "num": "02",
        "region": "TICINO",
        "title": "Population: 12",
        "location": "Corippo",
        "text": (
            "In the Verzasca Valley, a medieval stone village clings to a cliff face. "
            "Twelve people live here. The entire hamlet has been converted into an albergo "
            "diffuso -- a scattered hotel where each ancient house is a room. No reception "
            "desk. No lobby. Just stone walls, wooden beams, and the sound of the river below. "
            "Below the village, emerald pools carved into granite invite you to swim where "
            "James Bond once jumped."
        ),
        "insider": (
            "Book the room with the terrace facing south. Drive 10 minutes to Ponte dei Salti "
            "in Lavertezzo -- arrive before 9am for the pools entirely to yourself."
        ),
        "image": os.path.join(CAROUSEL_DIR, "07-corippo.jpg"),
        "gyg_label": "Verzasca Valley Day Trip",
        "gyg_url": "https://www.getyourguide.com/lugano-l922/from-lugano-verzasca-valley-day-trip-t438942/?partner_id=XJZ4DP0&utm_medium=online_publisher&utm_source=swissperiences&cmp=corippo",
    },
    {
        "num": "03",
        "region": "ZURICH",
        "title": "36 Degrees Above the City",
        "location": "The Thermal Rooftop",
        "text": (
            "A 19th-century brewery, gutted and reimagined. Below, vaulted stone cellars "
            "house saunas and an Irish-Roman bathing ritual. Above, an infinity pool heated "
            "to 36 degrees overlooks the Zurich skyline and, on clear days, the distant Alps. "
            "The water is thermal -- drawn from the same springs the brewers used. The city "
            "glows beneath you. Nobody speaks above a whisper."
        ),
        "insider": (
            "Monday evenings are the least crowded. Skip the 2-hour package -- the 3-hour "
            "circuit is the sweet spot. Pair it with dinner at Clouds on the 35th floor of "
            "the same building."
        ),
        "image": os.path.join(IMG_DIR, "villars/bains-outdoor-alps.jpeg"),
        "gyg_label": "Zurich City Tour & Lake Cruise",
        "gyg_url": "https://www.getyourguide.com/zurich-l58/zurich-best-of-zurich-city-tour-with-lake-cruise-t72032/?partner_id=XJZ4DP0&utm_medium=online_publisher&utm_source=swissperiences&cmp=hurlimann-spa",
    },
    {
        "num": "04",
        "region": "JURA",
        "title": "The Amphitheatre",
        "location": "Creux du Van",
        "text": (
            "One hundred and sixty metres of vertical rock, carved by glaciers into a perfect "
            "horseshoe. Wild ibex stand motionless at the edge, silhouetted against sunrise. "
            "This is the Jura -- Switzerland's forgotten mountain range. No cable cars. No "
            "tourist trains. Just a 90-minute hike through beech forest, then the earth opens. "
            "Most Swiss have never been here. The ones who have, come back."
        ),
        "insider": (
            "Start from Noiraigue station on the first train. Pack cheese, bread, and a knife "
            "-- eat at the rim. On the way back, stop at Ferme Robert for their Jura fondue. "
            "It's not on Google Maps."
        ),
        "image": os.path.join(CAROUSEL_DIR, "08-creux-du-van.jpg"),
        "gyg_label": "Mt. Pilatus Golden Round Trip",
        "gyg_url": "https://www.getyourguide.com/lucerne-l867/mt-pilatus-cable-car-cog-rail-lake-cruise-from-lucerne-t123611/?partner_id=XJZ4DP0&utm_medium=online_publisher&utm_source=swissperiences&cmp=creux-du-van",
    },
    {
        "num": "05",
        "region": "BERN",
        "title": "Fifteen Metres of Clarity",
        "location": "Blausee",
        "text": (
            "Hidden in primeval forest near Kandersteg, this small alpine lake is so transparent "
            "you can count the trout gliding over blue-green stones at the bottom. Most visitors "
            "drive past on the motorway to Interlaken, oblivious. In October, golden beech leaves "
            "frame the water like a painting nobody hung. There's a trout farm on-site. The fish "
            "you eat for lunch was swimming an hour ago."
        ),
        "insider": (
            "October is the month. Arrive before 9am -- you'll have the lake to yourself and "
            "the forest in full gold. The restaurant's trout with almonds is the only dish "
            "worth ordering."
        ),
        "image": os.path.join(IMG_DIR, "drone/blausee-autumn-aerial.jpg"),
        "gyg_label": "Jungfraujoch Day Trip",
        "gyg_url": "https://www.getyourguide.com/interlaken-l793/from-interlaken-day-trip-to-jungfraujoch-t111106/?partner_id=XJZ4DP0&utm_medium=online_publisher&utm_source=swissperiences&cmp=blausee",
    },
    {
        "num": "06",
        "region": "GENEVA",
        "title": "Turin, Transplanted",
        "location": "Carouge",
        "text": (
            "Ten minutes from Geneva's watch boutiques, a neighbourhood built by the King of "
            "Sardinia to rival the city across the river. Pastel facades, hidden courtyards, "
            "ceramics studios that have been here longer than Switzerland itself. No chain stores. "
            "No tourists. Just artisans, aperitivo, and the best market in the country on Saturday "
            "mornings. If Geneva is the suit, Carouge is the person wearing it."
        ),
        "insider": (
            "Place du Marche, Wednesday and Saturday before 10am. For dinner, skip the main "
            "street -- the courtyard restaurants off Rue Saint-Joseph are where locals eat. "
            "Order the burrata."
        ),
        "image": os.path.join(CAROUSEL_DIR, "05-carouge.jpg"),
        "gyg_label": "Geneva Old Town & Chocolate Tour",
        "gyg_url": "https://www.getyourguide.com/geneva-l54/geneva-old-town-chocolate-lake-guided-walking-tour-t1033020/?partner_id=XJZ4DP0&utm_medium=online_publisher&utm_source=swissperiences&cmp=carouge",
    },
    {
        "num": "07",
        "region": "CENTRAL SWITZERLAND",
        "title": "Where It All Began",
        "location": "Seelisberg & Rutli",
        "text": (
            "In 1291, representatives from three cantons crossed Lake Lucerne by boat and swore "
            "an oath on a meadow. Switzerland was born. Today, Rutli is still reachable only by "
            "water -- the same approach the founders took 735 years ago. No roads. No cars. Just "
            "the sound of the lake against the hull, then silence, then history under your feet. "
            "Most Swiss learn about this place in school. Almost none have stood on it."
        ),
        "insider": (
            "Take the boat from Brunnen, not Lucerne -- shorter crossing, more dramatic approach. "
            "Combine with the funicular to Seelisberg village for the panoramic view that makes "
            "you understand why they chose this place."
        ),
        "image": os.path.join(IMG_DIR, "drone/lake-brienz-aerial.jpg"),
        "gyg_label": "Lake Lucerne Cruise",
        "gyg_url": "https://www.getyourguide.com/lucerne-l867/lucerne-lake-lucerne-1-hour-discovery-cruise-t1168411/?partner_id=XJZ4DP0&utm_medium=online_publisher&utm_source=swissperiences&cmp=seelisberg",
    },
    {
        "num": "08",
        "region": "GRAUBUNDEN",
        "title": "The Lake That Floats",
        "location": "Caumasee",
        "text": (
            "Fed entirely by underground springs, Lake Cauma near Flims glows an impossible "
            "turquoise -- the kind of colour you'd adjust in a photo but here exists without "
            "filters. The water is warm enough to swim in summer. In winter, it freezes into a "
            "natural rink. There's an elevator from Flims, but don't take it. The 20-minute "
            "forest path builds anticipation -- and the moment the turquoise appears through "
            "the trees is worth every step."
        ),
        "insider": (
            "Arrive before noon in summer -- the wooden deck fills fast. Pack a picnic and a "
            "book. This is a place for staying, not visiting. The chairlift exists but robs "
            "you of the reveal."
        ),
        "image": os.path.join(IMG_DIR, "oeschinensee.jpg"),
        "gyg_label": "First Cliff Walk",
        "gyg_url": "https://www.getyourguide.com/grindelwald-l1613/attraction-ticket-grindelwald-first-cableway-cliff-walk-t468583/?partner_id=XJZ4DP0&utm_medium=online_publisher&utm_source=swissperiences&cmp=caumasee",
    },
]


def build_pdf():
    # Clean all text
    for s in SECRETS:
        for key in ("title", "location", "text", "insider", "region", "gyg_label"):
            if key in s and s[key]:
                s[key] = _clean(s[key])

    pdf = InsiderGuidePDF()

    # ================================================================
    # PAGE 1: COVER
    # ================================================================
    pdf.add_page()
    cover_img = os.path.join(IMG_DIR, "lake-geneva/lavaux-vineyards-sunset.jpeg")
    pdf.draw_image_cover(cover_img, opacity_overlay=0.50, gradient_style="cover")

    pdf.brand_header()

    with pdf.local_context():
        # Logo
        if os.path.exists(LOGO_PATH):
            logo_w = 22
            logo_x = (PW - logo_w) / 2
            pdf.image(LOGO_PATH, x=logo_x, y=18, w=logo_w)

        # Swiss cross accent
        pdf.swiss_cross(PW / 2, 48, size=3)

        # Title
        pdf.set_font("Helvetica", "B", 14)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(6, 55)
        pdf.cell(PW - 12, 8, "The Swiss Insider Guide", align="C")

        pdf.teal_line(PW * 0.28, 65, PW * 0.44)

        # Subtitle
        pdf.set_font("Helvetica", "", 7)
        pdf.set_text_color(*TEAL)
        pdf.set_xy(6, 68)
        pdf.cell(PW - 12, 5, "Places we keep to ourselves.", align="C")

        # Tagline
        pdf.set_font("Helvetica", "", 5)
        pdf.set_text_color(*GREY)
        pdf.set_xy(6, 78)
        pdf.cell(PW - 12, 3.5, "A pause -- designed.", align="C")

        # Attribution
        pdf.set_font("Helvetica", "", 5)
        pdf.set_text_color(*DIM_TEXT)
        pdf.set_xy(6, 86)
        pdf.cell(PW - 12, 3.5, "by Swissperiences  --  swissperiences.ch", align="C")

    pdf.page_footer_text()

    # ================================================================
    # PAGE 2: LETTER FROM THE FOUNDER
    # ================================================================
    pdf.add_page()
    founder_img = os.path.join(IMG_DIR, "villars/caueh-swiss-chalet.jpeg")
    pdf.draw_image_cover(founder_img, opacity_overlay=0.65, gradient_style="letter")

    pdf.brand_header()

    with pdf.local_context():
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(8, 18)
        pdf.cell(PW - 16, 6, "A Letter from the Founder", align="L")

        pdf.teal_line(8, 26, 20)

        letter = _clean(
            "I came to Switzerland looking for silence. I found it at 1,300 meters.\n\n"
            "This guide isn't a list of places to visit. It's an invitation to see "
            "Switzerland the way locals protect it -- quietly, intentionally, without rush.\n\n"
            "These are the places I take friends. Not clients. Friends. The spots where "
            "the phone stays in the pocket and the only schedule is the sunset.\n\n"
            "Some are famous if you know where to look. Most aren't famous at all. "
            "That's the point.\n\n"
            "Welcome to the inside."
        )

        pdf.set_font("Helvetica", "", 5.8)
        pdf.set_text_color(*LIGHT_TEXT)
        pdf.set_xy(8, 30)
        pdf.multi_cell(PW - 16, 3.3, letter)

        # Signature
        pdf.set_font("Helvetica", "B", 6)
        pdf.set_text_color(*TEAL)
        pdf.set_xy(8, 80)
        pdf.cell(PW - 16, 4, "Caueh Vidal", align="L")

        pdf.set_font("Helvetica", "", 5)
        pdf.set_text_color(*GREY)
        pdf.set_xy(8, 84.5)
        pdf.cell(PW - 16, 3.5, "Founder, Swissperiences", align="L")
        pdf.set_xy(8, 88.5)
        pdf.cell(PW - 16, 3.5, "Villars-sur-Ollon, 1,300m", align="L")

    pdf.page_footer_text()

    # ================================================================
    # PAGES 3-10: EIGHT SECRETS
    # ================================================================
    for secret in SECRETS:
        pdf.add_page()

        if secret["image"] and os.path.exists(secret["image"]):
            pdf.draw_image_cover(secret["image"], opacity_overlay=0.55)
        else:
            pdf.dark_page()

        pdf.brand_header()

        with pdf.local_context():
            # Number watermark
            pdf.set_font("Helvetica", "B", 22)
            pdf.set_text_color(*TEAL)
            with pdf.local_context(fill_opacity=0.25):
                pdf.set_xy(7, 12)
                pdf.cell(15, 10, secret["num"])

            # Region badge
            region_text = secret["region"]
            pdf.set_font("Helvetica", "B", 4.5)
            pdf.set_text_color(*TEAL)
            badge_w = pdf.get_string_width(region_text) + 4
            badge_x = PW - 7 - badge_w
            with pdf.local_context(fill_opacity=0.3):
                pdf.set_fill_color(30, 60, 60)
                pdf.set_xy(badge_x, 14)
                pdf.cell(badge_w, 4, region_text, align="C", fill=True)

            # Location
            pdf.set_font("Helvetica", "", 5.5)
            pdf.set_text_color(*TEAL)
            pdf.set_xy(7, 25)
            pdf.cell(PW - 14, 3.5, secret["location"], align="L")

            # Title
            pdf.set_font("Helvetica", "B", 13)
            pdf.set_text_color(*WHITE)
            pdf.set_xy(7, 30)
            pdf.multi_cell(PW - 14, 6.5, secret["title"])

            y_after_title = pdf.get_y()
            pdf.teal_line(7, y_after_title + 1, 20)

            # Description
            pdf.set_font("Helvetica", "", 5.8)
            pdf.set_text_color(*LIGHT_TEXT)
            pdf.set_xy(7, y_after_title + 4)
            pdf.multi_cell(PW - 14, 3.2, secret["text"])

            # Insider tip box
            pdf.draw_tip_box(PH - 40, secret["insider"], height=22)

            # GYG affiliate link
            if secret.get("gyg_url"):
                gyg_y = PH - 15
                gyg_label = secret.get("gyg_label", "Explore nearby")
                btn_text = f">> {gyg_label}"
                pdf.set_font("Helvetica", "B", 4.5)
                text_w = pdf.get_string_width(btn_text) + 6
                btn_x = 7
                with pdf.local_context(fill_opacity=0.4):
                    pdf.set_fill_color(25, 70, 70)
                    pdf.rect(btn_x, gyg_y, text_w, 4.5, "F")
                pdf.set_text_color(*TEAL)
                pdf.set_xy(btn_x + 3, gyg_y + 0.5)
                pdf.cell(text_w - 6, 3.5, btn_text)
                pdf.link(btn_x, gyg_y, text_w, 4.5, secret["gyg_url"])

        pdf.page_footer_text()

    # ================================================================
    # PAGE 11: THE SANCTUARY
    # ================================================================
    pdf.add_page()
    sanctuary_img = os.path.join(IMG_DIR, "villars/loft-fireplace-evening.jpeg")
    pdf.draw_image_cover(sanctuary_img, opacity_overlay=0.60, gradient_style="sanctuary")

    pdf.brand_header()

    with pdf.local_context():
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(8, 24)
        pdf.cell(PW - 16, 6, "Where Insiders Stay", align="L")

        pdf.teal_line(8, 32, 20)

        sanctuary_text = _clean(
            "The Villars Loft sits at 1,300 metres in the Vaud Alps. A private sanctuary "
            "with fireplace, panoramic balcony, and views that change with every hour of "
            "light.\n\n"
            "This is where our members stay -- not a hotel, but a home. Personally hosted "
            "by our founder. No front desk. No checkout time. Just the mountains, the "
            "silence, and the feeling of being exactly where you should be."
        )

        pdf.set_font("Helvetica", "", 5.8)
        pdf.set_text_color(*LIGHT_TEXT)
        pdf.set_xy(8, 36)
        pdf.multi_cell(PW - 16, 3.3, sanctuary_text)

        # Membership note
        pdf.set_font("Helvetica", "", 5)
        pdf.set_text_color(*TEAL)
        pdf.set_xy(8, 72)
        pdf.cell(PW - 16, 3.5, "Currently accepting members by application.", align="L")

    pdf.page_footer_text()

    # ================================================================
    # PAGE 12: GUEST VOICES
    # ================================================================
    pdf.add_page()
    voices_img = os.path.join(IMG_DIR, "villars/dawn-fog-chalets.jpeg")
    pdf.draw_image_cover(voices_img, opacity_overlay=0.65, gradient_style="sanctuary")

    pdf.brand_header()

    with pdf.local_context():
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(8, 22)
        pdf.cell(PW - 16, 6, "Guest Voices", align="L")

        pdf.teal_line(8, 30, 20)

        quotes = [
            ("One weekend. A lifetime of memories.", "Wagner"),
            ("What stood out most was the silence.", "Ale & Alex"),
            ("The mountains don't change. You do.", "Leo"),
        ]

        y_pos = 38
        for quote_text, quote_author in quotes:
            # Opening quote mark
            pdf.set_font("Helvetica", "B", 16)
            pdf.set_text_color(*TEAL)
            with pdf.local_context(fill_opacity=0.3):
                pdf.set_xy(8, y_pos - 2)
                pdf.cell(8, 8, '"')

            # Quote text
            pdf.set_font("Helvetica", "", 7)
            pdf.set_text_color(*WHITE)
            pdf.set_xy(14, y_pos + 1)
            pdf.cell(PW - 22, 5, _clean(quote_text), align="L")

            # Author
            pdf.set_font("Helvetica", "", 5)
            pdf.set_text_color(*TEAL)
            pdf.set_xy(14, y_pos + 7)
            pdf.cell(PW - 22, 3.5, _clean(f"-- {quote_author}"), align="L")

            y_pos += 20

        # Journal link
        pdf.set_font("Helvetica", "", 5)
        pdf.set_text_color(*GREY)
        pdf.set_xy(8, y_pos + 8)
        pdf.cell(PW - 16, 3.5, "Real stories from our guest journals", align="L")
        pdf.set_text_color(*TEAL)
        pdf.set_xy(8, y_pos + 12)
        journal_link_text = "swissperiences.ch/journals"
        pdf.cell(PW - 16, 3.5, journal_link_text, align="L")
        link_w = pdf.get_string_width(journal_link_text)
        pdf.link(8, y_pos + 12, link_w, 3.5, "https://swissperiences.ch/journals")

    pdf.page_footer_text()

    # ================================================================
    # PAGE 13: CTA
    # ================================================================
    pdf.add_page()
    cta_img = os.path.join(IMG_DIR, "villars/morning-peak-sun.jpeg")
    pdf.draw_image_cover(cta_img, opacity_overlay=0.80, gradient_style="cta")

    pdf.brand_header()

    with pdf.local_context():
        # Title
        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(8, 30)
        pdf.multi_cell(PW - 16, 5.5, "This guide is a door.\nNot the room.", align="C")

        pdf.teal_line(PW * 0.25, 45, PW * 0.5)

        # Body
        pdf.set_font("Helvetica", "", 5.8)
        pdf.set_text_color(*LIGHT_TEXT)
        pdf.set_xy(10, 50)
        pdf.multi_cell(PW - 20, 3.3, _clean(
            "Swissperiences members get curated itineraries, private transfers, "
            "insider dining, and a sanctuary in the Swiss Alps.\n\n"
            "No crowds. No generic tours.\n"
            "Just Switzerland, done properly."
        ), align="C")

        # CTA button
        btn_w = 44
        btn_h = 7
        btn_x = (PW - btn_w) / 2
        btn_y = 76

        pdf.set_fill_color(*TEAL)
        pdf.rect(btn_x, btn_y, btn_w, btn_h, "F")

        pdf.set_font("Helvetica", "B", 5.5)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(btn_x, btn_y + 1)
        pdf.cell(btn_w, btn_h - 2, "REQUEST ACCESS", align="C")
        pdf.link(btn_x, btn_y, btn_w, btn_h, "https://swissperiences.ch/request-access")

        # Social / URL
        pdf.set_font("Helvetica", "", 5)
        pdf.set_text_color(*GREY)
        pdf.set_xy(8, 90)
        pdf.cell(PW - 16, 3.5, "@swissperiences", align="C")

        pdf.set_xy(8, 94.5)
        pdf.cell(PW - 16, 3.5, "swissperiences.ch", align="C")
        pdf.link(8, 94.5, PW - 16, 3.5, "https://swissperiences.ch")

        # Closing line
        pdf.set_font("Helvetica", "B", 5.5)
        pdf.set_text_color(*TEAL)
        pdf.set_xy(8, 104)
        pdf.cell(PW - 16, 3.5, "Find us.", align="C")

    pdf.page_footer_text()

    # ================================================================
    # OUTPUT
    # ================================================================
    pdf.output(OUTPUT)
    print(f"PDF generated: {OUTPUT}")
    print(f"Pages: {pdf.pages_count}")
    file_size = os.path.getsize(OUTPUT) / (1024 * 1024)
    print(f"File size: {file_size:.1f} MB")


if __name__ == "__main__":
    build_pdf()
