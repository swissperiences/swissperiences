#!/usr/bin/env python3
"""
Generate the Swiss Insider Guide PDF for Swissperiences.
1080x1920 vertical pages, dark luxury design, mixed project + Pexels photos.
"""

import os
from fpdf import FPDF
from PIL import Image

# --- Paths ---
BASE = "/Users/cv/Documents/MeusProjetos/swissperiences"
IMG_DIR = os.path.join(BASE, "public/images")
CAROUSEL_DIR = os.path.join(BASE, "tools/carousel-images")
OUTPUT = os.path.join(BASE, "public/insider-guide.pdf")

# --- Design tokens ---
BG = (10, 15, 15)        # #0a0f0f
WHITE = (255, 255, 255)
TEAL = (46, 144, 144)    # #2E9090
TEAL_DIM = (30, 95, 95)
GREY = (160, 170, 170)
DARK_OVERLAY = (10, 15, 15)

# Page size in mm (1080x1920 px at ~3x = 91.44 x 162.56 mm — let's use clean numbers)
PW = 91.44
PH = 162.56


def _clean(text):
    """Replace Unicode chars that Helvetica can't render."""
    return (text
        .replace("\u2014", " - ")   # em dash
        .replace("\u2013", "-")     # en dash
        .replace("\u2018", "'")     # left single quote
        .replace("\u2019", "'")     # right single quote
        .replace("\u201c", '"')     # left double quote
        .replace("\u201d", '"')     # right double quote
        .replace("\u00b0", " degrees")  # degree symbol
        .replace("\u2026", "...")   # ellipsis
    )


_img_counter = 0

class InsiderGuidePDF(FPDF):
    def __init__(self):
        super().__init__(unit="mm", format=(PW, PH))
        self.set_auto_page_break(auto=False)
        self.set_margins(0, 0, 0)

    def dark_page(self):
        """Fill current page with dark background."""
        self.set_fill_color(*BG)
        self.rect(0, 0, PW, PH, "F")

    def draw_image_cover(self, img_path, opacity_overlay=0.55):
        """Draw image filling the page with dark overlay baked into the image."""
        global _img_counter
        if not os.path.exists(img_path):
            self.dark_page()
            return
        _img_counter += 1
        tmp_path = f"/tmp/insider_guide_{_img_counter:02d}.jpg"
        self._crop_and_darken(img_path, tmp_path, 9, 16, opacity_overlay)
        self.image(tmp_path, x=0, y=0, w=PW, h=PH)

    def _crop_and_darken(self, src, dst, rw, rh, overlay_opacity=0.55):
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

        # Bake gradient overlay into the image
        # Darker at top (text area) and bottom (tip box), lighter in middle (photo visible)
        from PIL import ImageDraw
        overlay = Image.new("RGBA", (1080, 1920), (0, 0, 0, 0))
        draw = ImageDraw.Draw(overlay)
        for y in range(1920):
            frac = y / 1920
            if frac < 0.08:
                # Very top: strong overlay for brand header
                a = 0.80
            elif frac < 0.35:
                # Upper: strong overlay for title text
                a = 0.70 - (frac - 0.08) * 0.8
            elif frac < 0.60:
                # Middle: let photo show through
                a = overlay_opacity * 0.55
            elif frac < 0.75:
                # Lower-middle: transition
                a = overlay_opacity * 0.55 + (frac - 0.60) * 1.5
            else:
                # Bottom: strong overlay for tip box
                a = 0.72 + (frac - 0.75) * 0.6
            a = min(max(a, 0.15), 0.90)
            alpha = int(a * 255)
            draw.line([(0, y), (1079, y)], fill=(10, 15, 15, alpha))

        img = img.convert("RGBA")
        img = Image.alpha_composite(img, overlay)
        img = img.convert("RGB")
        img.save(dst, "JPEG", quality=88)

    def brand_header(self):
        """Draw SWISSPERIENCES brand at top."""
        with self.local_context():
            self.set_font("Helvetica", "B", 7)
            self.set_text_color(*TEAL)
            self.set_xy(0, 5)
            self.cell(PW, 4, "S W I S S P E R I E N C E S", align="C")

    def page_footer(self):
        """Draw swissperiences.ch at bottom."""
        with self.local_context():
            self.set_font("Helvetica", "", 5.5)
            self.set_text_color(*GREY)
            self.set_xy(0, PH - 8)
            self.cell(PW, 4, "swissperiences.ch", align="C")

    def teal_line(self, x, y, w):
        """Draw a thin teal accent line."""
        self.set_draw_color(*TEAL)
        self.set_line_width(0.4)
        self.line(x, y, x + w, y)

    def draw_tip_box(self, y, tip_text):
        """Draw an insider tip box with teal accent."""
        margin = 7
        box_w = PW - margin * 2
        box_x = margin
        # Teal left border
        with self.local_context():
            # Box background
            with self.local_context(fill_opacity=0.25):
                self.set_fill_color(20, 50, 50)
                self.rect(box_x, y, box_w, 18, "F")
            # Left accent bar
            self.set_fill_color(*TEAL)
            self.rect(box_x, y, 0.8, 18, "F")
            # Label
            self.set_font("Helvetica", "B", 5.5)
            self.set_text_color(*TEAL)
            self.set_xy(box_x + 3, y + 1.5)
            self.cell(box_w - 6, 3.5, "INSIDER TIP")
            # Tip text
            self.set_font("Helvetica", "", 5.5)
            self.set_text_color(220, 225, 225)
            self.set_xy(box_x + 3, y + 5.5)
            self.multi_cell(box_w - 6, 3, tip_text)


def pick_image(gem_key, carousel_key, fallback_project=None):
    """Pick best image: carousel Pexels JPG, or project fallback."""
    carousel = os.path.join(CAROUSEL_DIR, carousel_key)
    if os.path.exists(carousel):
        return carousel
    if fallback_project:
        fp = os.path.join(IMG_DIR, fallback_project)
        if os.path.exists(fp):
            return fp
    return None


# --- GYG Affiliate ---
GYG_PARTNER = "XJZ4DP0"
def gyg(path, cmp):
    return f"https://www.getyourguide.com{path}?partner_id={GYG_PARTNER}&utm_medium=online_publisher&utm_source=swissperiences&cmp={cmp}"

# --- Content ---
GEMS = [
    {
        "num": "01",
        "region": "BERN",
        "title": "Blausee",
        "subtitle": "The Blue Lake",
        "desc": (
            "Hidden in a primeval forest near Kandersteg, Blausee is a small alpine lake "
            "of surreal clarity. The water is so transparent you can see 15 metres "
            "to the bottom, where trout glide over blue-green stones. In autumn, "
            "golden beech leaves frame the lake like a painting."
        ),
        "tip": "Visit in October for peak autumn colours. Arrive before 9 AM to have the lake almost to yourself. The on-site trout farm serves the freshest fish lunch in the Oberland.",
        "image": pick_image("blausee", "02-blausee.jpg", "drone/blausee-autumn-aerial.jpg"),
        "gyg_label": "Jungfraujoch Day Trip from Interlaken",
        "gyg_url": gyg("/interlaken-l793/from-interlaken-day-trip-to-jungfraujoch-t111106/", "blausee"),
    },
    {
        "num": "02",
        "region": "VALAIS",
        "title": "Bisse de Clavau",
        "subtitle": "The Vineyard Trail",
        "desc": (
            "An ancient irrigation channel carved into the cliffs above Sion, the Bisse de Clavau "
            "winds through UNESCO-listed vineyard terraces with staggering views of the Rhone Valley. "
            "The path is flat, easy, and utterly cinematic — vines on one side, a 200-metre drop on the other."
        ),
        "tip": "Walk the trail one hour before sunset, then finish at a cave de degustation in Sion for a Petite Arvine tasting. September is harvest season — the vineyards glow amber.",
        "image": pick_image("bisse", "03-bisse-clavau.jpg", "lake-geneva/lavaux-vineyards-sunset.jpeg"),
        "gyg_label": "Lavaux Wine Tour",
        "gyg_url": gyg("/montreux-l32355/wine-tour-in-the-canton-of-vaud-lavaux-vineyards-t718850/", "bisse-clavau"),
    },
    {
        "num": "03",
        "region": "CENTRAL SWITZERLAND",
        "title": "Seelisberg",
        "subtitle": "Rutli Meadow",
        "desc": (
            "The birthplace of Switzerland. In 1291, representatives from three cantons "
            "swore an oath of allegiance on this lakeside meadow, founding the Confederation. "
            "Today, Rutli is reachable only by boat from Brunnen or Treib — a pilgrimage "
            "through misty waters to the soul of a nation."
        ),
        "tip": "Take the boat from Brunnen on Lake Lucerne. Combine with a funicular ride to Seelisberg village for panoramic views of the lake and the Uri Alps.",
        "image": pick_image("seelisberg", "04-seelisberg.jpg", "oeschinen-lake.jpg"),
        "gyg_label": "Lake Lucerne Discovery Cruise",
        "gyg_url": gyg("/lucerne-l867/lucerne-lake-lucerne-1-hour-discovery-cruise-t1168411/", "seelisberg"),
    },
    {
        "num": "04",
        "region": "GENEVA",
        "title": "Carouge",
        "subtitle": "Little Italy of Geneva",
        "desc": (
            "Built by the King of Sardinia to rival Geneva, Carouge is a bohemian quarter "
            "of pastel facades, artisan workshops, and hidden courtyards. It feels more "
            "Turin than Zurich — intimate piazzas, ceramics studios, independent cinemas, "
            "and some of Geneva's best aperitivo spots."
        ),
        "tip": "Visit on Wednesday or Saturday morning for the Carouge market (Place du Marche). For dinner, skip the tourist strip and find the courtyard restaurants off Rue Saint-Joseph.",
        "image": pick_image("carouge", "05-carouge.jpg", "geneva-jet.jpg"),
        "gyg_label": "Geneva Old Town & Chocolate Tour",
        "gyg_url": gyg("/geneva-l54/geneva-old-town-chocolate-lake-guided-walking-tour-t1033020/", "carouge"),
    },
    {
        "num": "05",
        "region": "GRAUBUNDEN",
        "title": "Caumasee",
        "subtitle": "The Floating Lake",
        "desc": (
            "Fed entirely by underground springs, Lake Cauma near Flims glows an impossible "
            "turquoise. The water is warm enough to swim in summer, surrounded by dense forest "
            "and limestone cliffs. It feels like a cenote transplanted to the Alps."
        ),
        "tip": "Walk 20 minutes from Flims Waldhaus (skip the chairlift — the forest path is magical). Pack a picnic. The wooden deck fills up by noon in summer, so arrive early.",
        "image": os.path.join(IMG_DIR, "oeschinen-lake.jpg"),  # Turquoise alpine lake, better than reusing Blausee
        "gyg_label": "First Cliff Walk & Cable Car",
        "gyg_url": gyg("/grindelwald-l1613/attraction-ticket-grindelwald-first-cableway-cliff-walk-t468583/", "caumasee"),
    },
    {
        "num": "06",
        "region": "TICINO",
        "title": "Corippo",
        "subtitle": "The Smallest Village",
        "desc": (
            "Population: 12. Corippo is a vertical hamlet of stone houses clinging to a cliff "
            "in the Verzasca Valley. Recently converted into an albergo diffuso — a 'scattered hotel' — "
            "the entire village is the accommodation. Below, the emerald pools of the Verzasca River "
            "offer wild swimming among smooth granite boulders."
        ),
        "tip": "Book a room in the albergo diffuso for the full experience. Drive 10 minutes south to the Ponte dei Salti in Lavertezzo for the most photogenic river pools in Switzerland.",
        "image": pick_image("corippo", "07-corippo.jpg", "villars/manifesto-village-aerial.jpeg"),
        "gyg_label": "Verzasca Valley Day Trip",
        "gyg_url": gyg("/lugano-l922/from-lugano-verzasca-valley-day-trip-t438942/", "corippo"),
    },
    {
        "num": "07",
        "region": "JURA",
        "title": "Creux du Van",
        "subtitle": "The Swiss Grand Canyon",
        "desc": (
            "A 160-metre vertical rock amphitheatre carved by glaciers in the Jura mountains. "
            "The rim trail offers vertigo-inducing views into the abyss, and wild ibex graze "
            "fearlessly along the cliff edge. It feels prehistoric, vast, and untouched — "
            "and most tourists have never heard of it."
        ),
        "tip": "Hike from Noiraigue (1.5 hours to the rim). Go early morning for the best chance of seeing ibex silhouetted against the sunrise. The Ferme Robert serves rustic Jura cheese fondue on the way back.",
        "image": pick_image("creux", "08-creux-du-van.jpg", "grindelwald-eiger.jpg"),
        "gyg_label": "Mt. Pilatus Golden Round Trip",
        "gyg_url": gyg("/lucerne-l867/mt-pilatus-cable-car-cog-rail-lake-cruise-from-lucerne-t123611/", "creux-du-van"),
    },
    {
        "num": "08",
        "region": "ZURICH",
        "title": "Hurlimann Spa",
        "subtitle": "Rooftop Thermal Pool",
        "desc": (
            "A 19th-century brewery transformed into a thermal spa in the heart of Zurich. "
            "The rooftop infinity pool, heated to 36 degrees C, offers panoramic views of "
            "the city skyline and the distant Alps. Below, the vaulted cellars house saunas, "
            "steam baths, and an Irish-Roman ritual circuit."
        ),
        "tip": "Book the rooftop pool at dusk — the city lights reflecting in the warm water are unforgettable. Weekdays are significantly less crowded. The 3-hour thermal circuit is the sweet spot.",
        "image": os.path.join(IMG_DIR, "villars/thermal-pool-alps.jpeg"),  # Skip Pexels (shows KL not Zurich)
        "gyg_label": "Zurich City Tour & Lake Cruise",
        "gyg_url": gyg("/zurich-l58/zurich-best-of-zurich-city-tour-with-lake-cruise-t72032/", "hurlimann-spa"),
    },
]


def build_pdf():
    # Clean all text in gems
    for gem in GEMS:
        for key in ("title", "subtitle", "desc", "tip", "region"):
            if key in gem and gem[key]:
                gem[key] = _clean(gem[key])

    pdf = InsiderGuidePDF()

    # ========================
    # COVER PAGE
    # ========================
    pdf.add_page()
    cover_img = pick_image("cover", "01-cover.jpg", "villars/sea-of-clouds-hero.jpeg")
    if cover_img:
        pdf.draw_image_cover(cover_img, opacity_overlay=0.5)

    pdf.brand_header()

    # Title
    with pdf.local_context():
        # Decorative thin line
        pdf.teal_line(PW * 0.25, 48, PW * 0.5)

        pdf.set_font("Helvetica", "B", 16)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(6, 52)
        pdf.cell(PW - 12, 10, "THE SWISS", align="C")

        pdf.set_font("Helvetica", "B", 22)
        pdf.set_xy(6, 62)
        pdf.cell(PW - 12, 12, "INSIDER GUIDE", align="C")

        pdf.teal_line(PW * 0.25, 76, PW * 0.5)

        # Subtitle
        pdf.set_font("Helvetica", "", 7)
        pdf.set_text_color(*TEAL)
        pdf.set_xy(6, 82)
        pdf.cell(PW - 12, 5, "8  HIDDEN GEMS  IN  SWITZERLAND", align="C")

        # Tagline
        pdf.set_font("Helvetica", "", 5.5)
        pdf.set_text_color(*GREY)
        pdf.set_xy(6, 92)
        pdf.multi_cell(PW - 12, 3.2, _clean(
            "The places Swiss locals whisper about.\n"
            "No tourist crowds. No guidebook cliches.\n"
            "Just the real Switzerland."
        ), align="C")

        # Brand
        pdf.set_font("Helvetica", "", 5)
        pdf.set_text_color(120, 130, 130)
        pdf.set_xy(6, 108)
        pdf.cell(PW - 12, 4, "by  S W I S S P E R I E N C E S", align="C")

    pdf.page_footer()

    # ========================
    # INTRO PAGE
    # ========================
    pdf.add_page()
    intro_img = os.path.join(IMG_DIR, "drone/cinematic-alpine-road.jpeg")
    if os.path.exists(intro_img):
        pdf.draw_image_cover(intro_img, opacity_overlay=0.6)
    else:
        pdf.dark_page()

    pdf.brand_header()

    with pdf.local_context():
        pdf.set_font("Helvetica", "B", 10)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(8, 30)
        pdf.cell(PW - 16, 6, "Welcome, Insider.", align="L")

        pdf.teal_line(8, 38, 18)

        pdf.set_font("Helvetica", "", 5.8)
        pdf.set_text_color(210, 215, 215)
        pdf.set_xy(8, 42)
        pdf.multi_cell(PW - 16, 3.5, _clean(
            "Switzerland has a public face -- the postcard peaks, the chocolate shops, "
            "the watch boutiques. Beautiful, yes. But predictable.\n\n"
            "This guide is about the other Switzerland. The places that don't appear in "
            "search results. The villages with populations smaller than a dinner party. "
            "The trails where the only footprints are yours.\n\n"
            "These 8 hidden gems were handpicked from years of living in, exploring, "
            "and falling in love with this country. Each one comes with an insider tip -- "
            "the kind of detail you'd only know if a local friend told you over coffee.\n\n"
            "Consider this your invitation to see Switzerland the way it deserves to be seen."
        ))

        pdf.set_font("Helvetica", "B", 5.5)
        pdf.set_text_color(*TEAL)
        pdf.set_xy(8, 90)
        pdf.cell(PW - 16, 4, "Caueh Vidal", align="L")

        pdf.set_font("Helvetica", "", 5)
        pdf.set_text_color(*GREY)
        pdf.set_xy(8, 94)
        pdf.cell(PW - 16, 3.5, "Founder, Swissperiences", align="L")

    pdf.page_footer()

    # ========================
    # GEM PAGES
    # ========================
    for gem in GEMS:
        pdf.add_page()

        # Background image
        if gem["image"] and os.path.exists(gem["image"]):
            pdf.draw_image_cover(gem["image"], opacity_overlay=0.55)
        else:
            pdf.dark_page()

        pdf.brand_header()

        with pdf.local_context():
            # Number + region tag
            pdf.set_font("Helvetica", "B", 20)
            pdf.set_text_color(46, 144, 144)
            with pdf.local_context(fill_opacity=0.3):
                pdf.set_xy(8, 14)
                pdf.cell(20, 10, gem["num"])

            pdf.set_font("Helvetica", "B", 5)
            pdf.set_text_color(*TEAL)
            # Region badge
            region_text = gem["region"]
            pdf.set_xy(PW - 8 - pdf.get_string_width(region_text) - 4, 15)
            with pdf.local_context(fill_opacity=0.3):
                self_w = pdf.get_string_width(region_text) + 4
                pdf.set_fill_color(30, 60, 60)
                pdf.cell(self_w, 4.5, region_text, align="C", fill=True)

            # Title
            pdf.set_font("Helvetica", "B", 14)
            pdf.set_text_color(*WHITE)
            pdf.set_xy(8, 28)
            pdf.cell(PW - 16, 8, gem["title"], align="L")

            # Subtitle
            pdf.set_font("Helvetica", "", 7)
            pdf.set_text_color(*TEAL)
            pdf.set_xy(8, 36.5)
            pdf.cell(PW - 16, 5, gem["subtitle"], align="L")

            pdf.teal_line(8, 43, 22)

            # Description
            pdf.set_font("Helvetica", "", 5.8)
            pdf.set_text_color(220, 225, 225)
            pdf.set_xy(8, 47)
            pdf.multi_cell(PW - 16, 3.3, gem["desc"])

            # Insider tip box
            pdf.draw_tip_box(PH - 38, gem["tip"])

            # GYG affiliate link
            if gem.get("gyg_url"):
                gyg_y = PH - 16
                gyg_label = _clean(gem.get("gyg_label", "Explore nearby experiences"))
                btn_text = f">> {gyg_label}"
                pdf.set_font("Helvetica", "B", 5)
                text_w = pdf.get_string_width(btn_text) + 6
                btn_x = 7
                # Teal pill button
                pdf.set_fill_color(30, 80, 80)
                pdf.rect(btn_x, gyg_y, text_w, 5, "F")
                pdf.set_text_color(*TEAL)
                pdf.set_xy(btn_x + 3, gyg_y + 0.5)
                pdf.cell(text_w - 6, 4, btn_text)
                # Clickable link
                pdf.link(btn_x, gyg_y, text_w, 5, gem["gyg_url"])

        pdf.page_footer()

    # ========================
    # CTA PAGE
    # ========================
    pdf.add_page()
    cta_img = os.path.join(IMG_DIR, "villars/sea-of-clouds-sunset.jpeg")
    if os.path.exists(cta_img):
        pdf.draw_image_cover(cta_img, opacity_overlay=0.95)
    else:
        pdf.dark_page()

    pdf.brand_header()

    with pdf.local_context():
        pdf.teal_line(PW * 0.2, 45, PW * 0.6)

        pdf.set_font("Helvetica", "B", 9)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(8, 50)
        pdf.cell(PW - 16, 6, "Want the Full Experience?", align="C")

        pdf.set_font("Helvetica", "", 5.8)
        pdf.set_text_color(210, 215, 215)
        pdf.set_xy(10, 60)
        pdf.multi_cell(PW - 20, 3.5, (
            "This guide is just the beginning. Swissperiences members get "
            "access to curated itineraries, private transfers, insider dining "
            "reservations, and a luxury alpine loft in Villars-sur-Ollon.\n\n"
            "No crowds. No generic tours.\n"
            "Just Switzerland, done properly."
        ), align="C")

        # CTA button
        btn_w = 46
        btn_h = 7
        btn_x = (PW - btn_w) / 2
        btn_y = 88

        pdf.set_fill_color(*TEAL)
        pdf.rect(btn_x, btn_y, btn_w, btn_h, "F")

        pdf.set_font("Helvetica", "B", 5.5)
        pdf.set_text_color(*WHITE)
        pdf.set_xy(btn_x, btn_y + 1)
        pdf.cell(btn_w, btn_h - 2, "JOIN THE COMMUNITY", align="C")

        # URL
        pdf.set_font("Helvetica", "", 5)
        pdf.set_text_color(*GREY)
        pdf.set_xy(8, 100)
        pdf.cell(PW - 16, 4, "swissperiences.ch/request-access", align="C")

        # Make the button + URL clickable
        pdf.link(btn_x, btn_y, btn_w, btn_h, "https://swissperiences.ch/request-access")
        pdf.link(8, 100, PW - 16, 4, "https://swissperiences.ch/request-access")

        # Social
        pdf.set_font("Helvetica", "", 4.5)
        pdf.set_text_color(100, 110, 110)
        pdf.set_xy(8, 110)
        pdf.cell(PW - 16, 3.5, "Instagram: @swissperiences", align="C")

    pdf.page_footer()

    # ========================
    # OUTPUT
    # ========================
    pdf.output(OUTPUT)
    print(f"PDF generated: {OUTPUT}")
    print(f"Pages: {pdf.pages_count}")
    file_size = os.path.getsize(OUTPUT) / (1024 * 1024)
    print(f"File size: {file_size:.1f} MB")


if __name__ == "__main__":
    build_pdf()
