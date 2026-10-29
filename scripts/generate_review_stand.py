import os
import math
from PIL import Image, ImageDraw, ImageFont
import qrcode

def create_review_stand():
    W, H = 1200, 1800
    base = Image.new("RGBA", (W, H), (11, 14, 34, 255))
    draw = ImageDraw.Draw(base)

    # Vertical gradient from royal navy to deep amethyst purple
    for y in range(H):
        ratio = y / H
        # top: #0e1630 (14, 22, 48), mid: #1f113a (31, 17, 58), bottom: #0a0b1a (10, 11, 26)
        if ratio < 0.6:
            r1 = ratio / 0.6
            r = int(14 + (34 - 14) * r1)
            g = int(22 + (17 - 22) * r1)
            b = int(48 + (65 - 48) * r1)
        else:
            r1 = (ratio - 0.6) / 0.4
            r = int(34 + (10 - 34) * r1)
            g = int(17 + (11 - 17) * r1)
            b = int(65 + (26 - 65) * r1)
        draw.line([(0, y), (W, y)], fill=(r, g, b, 255))

    # Decorative tech / constellation lines
    tech_color = (212, 175, 55, 30)
    # left side geometry
    draw.line([(0, 200), (220, 380), (140, 560), (0, 700)], fill=tech_color, width=2)
    draw.line([(220, 380), (320, 380)], fill=tech_color, width=2)
    draw.line([(0, 1200), (180, 1350), (100, 1500), (0, 1600)], fill=tech_color, width=2)
    draw.line([(180, 1350), (280, 1350)], fill=tech_color, width=2)

    # right side geometry
    draw.line([(W, 200), (W - 220, 380), (W - 140, 560), (W, 700)], fill=tech_color, width=2)
    draw.line([(W - 220, 380), (W - 320, 380)], fill=tech_color, width=2)
    draw.line([(W, 1200), (W - 180, 1350), (W - 100, 1500), (W, 1600)], fill=tech_color, width=2)
    draw.line([(W - 180, 1350), (W - 280, 1350)], fill=tech_color, width=2)

    # Nodes
    for pt in [(220, 380), (140, 560), (320, 380), (180, 1350), (100, 1500), (280, 1350),
               (W - 220, 380), (W - 140, 560), (W - 320, 380), (W - 180, 1350), (W - 100, 1500), (W - 280, 1350)]:
        draw.ellipse([pt[0] - 4, pt[1] - 4, pt[0] + 4, pt[1] + 4], fill=(245, 215, 120, 90))

    # Elegant double gold border around the stand
    draw.rectangle([36, 36, W - 36, H - 36], outline=(197, 160, 89, 140), width=2)
    draw.rectangle([46, 46, W - 46, H - 46], outline=(245, 215, 120, 230), width=3)
    draw.rectangle([54, 54, W - 54, H - 54], outline=(160, 125, 60, 100), width=1)

    # Corner corner flourishes
    for cx, cy in [(46, 46), (W - 46, 46), (46, H - 46), (W - 46, H - 46)]:
        draw.rectangle([cx - 14, cy - 14, cx + 14, cy + 14], fill=(212, 175, 55, 255))
        draw.rectangle([cx - 10, cy - 10, cx + 10, cy + 10], fill=(20, 22, 45, 255))
        draw.ellipse([cx - 4, cy - 4, cx + 4, cy + 4], fill=(245, 215, 120, 255))

    # Load system fonts
    font_bold = "C:/Windows/Fonts/arialbd.ttf"
    font_reg = "C:/Windows/Fonts/arial.ttf"
    font_serif = "C:/Windows/Fonts/georgiab.ttf"
    font_serif_i = "C:/Windows/Fonts/georgiai.ttf"

    f_title = ImageFont.truetype(font_bold, 62)
    f_sub = ImageFont.truetype(font_serif, 34)
    f_desc = ImageFont.truetype(font_reg, 25)
    f_rev = ImageFont.truetype(font_bold, 54)
    f_matter = ImageFont.truetype(font_serif_i, 30)
    f_hotel = ImageFont.truetype(font_bold, 34)
    f_info = ImageFont.truetype(font_reg, 24)
    f_thanks = ImageFont.truetype(font_bold, 36)

    # 1. Top Logo Emblem
    logo_path = "d:/Jasil/TPM_Group/Logo folder/TPM_Residency_Google_Business_Logo_Navy_1080x1080.png"
    if os.path.exists(logo_path):
        logo_img = Image.open(logo_path).convert("RGBA")
        logo_size = 140
        logo_img = logo_img.resize((logo_size, logo_size), Image.LANCZOS)
        
        # Circular mask
        mask = Image.new("L", (logo_size, logo_size), 0)
        draw_mask = ImageDraw.Draw(mask)
        draw_mask.ellipse((0, 0, logo_size, logo_size), fill=255)

        lx = (W - logo_size) // 2
        ly = 85
        # Gold glow behind logo
        draw.ellipse([lx - 8, ly - 8, lx + logo_size + 8, ly + logo_size + 8], fill=(212, 175, 55, 60))
        draw.ellipse([lx - 4, ly - 4, lx + logo_size + 4, ly + logo_size + 4], outline=(245, 215, 120, 255), width=3)
        base.paste(logo_img, (lx, ly), mask)

    # 2. SCAN HERE Header
    title_text = "SCAN HERE"
    tb = draw.textbbox((0, 0), title_text, font=f_title)
    tw = tb[2] - tb[0]
    draw.text(((W - tw) // 2, 250), title_text, fill=(245, 215, 120, 255), font=f_title)

    sub_text = "TO REVIEW TPM RESIDENCY"
    tb = draw.textbbox((0, 0), sub_text, font=f_sub)
    tw = tb[2] - tb[0]
    draw.text(((W - tw) // 2, 330), sub_text, fill=(255, 255, 255, 255), font=f_sub)

    desc_line1 = "Open your phone camera & point it at the QR code."
    tb = draw.textbbox((0, 0), desc_line1, font=f_desc)
    tw = tb[2] - tb[0]
    draw.text(((W - tw) // 2, 385), desc_line1, fill=(210, 215, 230, 230), font=f_desc)

    desc_line2 = "Tap the link that appears on screen to rate your stay."
    tb = draw.textbbox((0, 0), desc_line2, font=f_desc)
    tw = tb[2] - tb[0]
    draw.text(((W - tw) // 2, 420), desc_line2, fill=(210, 215, 230, 230), font=f_desc)

    # 3. QR Code Plaque Frame
    qr_box_size = 540
    qx = (W - qr_box_size) // 2
    qy = 475

    # Outer ornate plaque
    draw.rectangle([qx - 18, qy - 18, qx + qr_box_size + 18, qy + qr_box_size + 18], fill=(18, 16, 42, 255))
    draw.rectangle([qx - 14, qy - 14, qx + qr_box_size + 14, qy + qr_box_size + 14], outline=(245, 215, 120, 240), width=4)
    draw.rectangle([qx - 6, qy - 6, qx + qr_box_size + 6, qy + qr_box_size + 6], outline=(160, 125, 60, 180), width=2)
    # White background for QR
    draw.rectangle([qx, qy, qx + qr_box_size, qy + qr_box_size], fill=(255, 255, 255, 255))

    # Corner studs on frame
    for sx, sy in [(qx - 14, qy - 14), (qx + qr_box_size + 14, qy - 14),
                   (qx - 14, qy + qr_box_size + 14), (qx + qr_box_size + 14, qy + qr_box_size + 14)]:
        draw.ellipse([sx - 6, sy - 6, sx + 6, sy + 6], fill=(245, 215, 120, 255))

    # Generate exact review QR code at high-res
    review_url = "https://g.page/r/Ca7Um1hXkk3iEBM/review?utm_source=gbp&utm_medium=reviews&utm_campaign=qr"
    qr = qrcode.QRCode(
        version=None,
        error_correction=qrcode.constants.ERROR_CORRECT_H,
        box_size=12,
        border=2,
    )
    qr.add_data(review_url)
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color="#07111c", back_color="#ffffff").convert("RGBA")
    
    # Resize to fit inner white box nicely (480x480)
    qr_render_size = 490
    qr_img = qr_img.resize((qr_render_size, qr_render_size), Image.LANCZOS)
    q_inner_x = qx + (qr_box_size - qr_render_size) // 2
    q_inner_y = qy + (qr_box_size - qr_render_size) // 2
    base.paste(qr_img, (q_inner_x, q_inner_y), qr_img)

    # 4. REVIEW US! Section
    rev_y = 1060
    rev_text = "REVIEW US!"
    tb = draw.textbbox((0, 0), rev_text, font=f_rev)
    tw = tb[2] - tb[0]
    draw.text(((W - tw) // 2, rev_y), rev_text, fill=(245, 215, 120, 255), font=f_rev)

    # 5 Gold Stars
    star_y = rev_y + 70
    star_size = 46
    star_gap = 14
    total_stars_w = 5 * star_size + 4 * star_gap
    start_star_x = (W - total_stars_w) // 2

    def draw_star(center_x, center_y, outer_r, inner_r):
        points = []
        for i in range(10):
            r = outer_r if i % 2 == 0 else inner_r
            angle = i * math.pi / 5 - math.pi / 2
            x = center_x + r * math.cos(angle)
            y = center_y + r * math.sin(angle)
            points.append((x, y))
        draw.polygon(points, fill=(245, 215, 120, 255), outline=(212, 175, 55, 255))

    for s_idx in range(5):
        cx = start_star_x + s_idx * (star_size + star_gap) + star_size // 2
        cy = star_y + star_size // 2
        draw_star(cx, cy, 24, 11)

    # "Your opinion matters!"
    matters_text = "Your opinion matters to us!"
    tb = draw.textbbox((0, 0), matters_text, font=f_matter)
    tw = tb[2] - tb[0]
    draw.text(((W - tw) // 2, star_y + 65), matters_text, fill=(255, 255, 255, 240), font=f_matter)

    # Divider bar
    div_y = star_y + 120
    draw.line([(250, div_y), (W - 250, div_y)], fill=(212, 175, 55, 120), width=2)
    draw.ellipse([(W // 2) - 4, div_y - 4, (W // 2) + 4, div_y + 4], fill=(245, 215, 120, 255))

    # Social icons / contact info
    soc_y = div_y + 30
    hotel_info = "Google Reviews  |  Instagram: @residencytpm  |  tpmresidency.com"
    tb = draw.textbbox((0, 0), hotel_info, font=f_info)
    tw = tb[2] - tb[0]
    draw.text(((W - tw) // 2, soc_y), hotel_info, fill=(200, 210, 230, 220), font=f_info)

    # Phone / Reception Desk ID
    desk_info = "Reception Desk: +91 79028 88990  /  +91 73064 24954"
    tb = draw.textbbox((0, 0), desk_info, font=f_info)
    tw = tb[2] - tb[0]
    draw.text(((W - tw) // 2, soc_y + 40), desk_info, fill=(245, 215, 120, 240), font=f_info)

    # THANK YOU
    thanks_y = soc_y + 110
    th_text = "THANK YOU"
    tb = draw.textbbox((0, 0), th_text, font=f_thanks)
    tw = tb[2] - tb[0]
    draw.text(((W - tw) // 2, thanks_y), th_text, fill=(245, 215, 120, 255), font=f_thanks)

    # Footer hotel address
    foot_text = "TPM RESIDENCY  *  PAZHAYANGADI, KONDOTTY, MALAPPURAM"
    f_small = ImageFont.truetype(font_reg, 19)
    tb = draw.textbbox((0, 0), foot_text, font=f_small)
    tw = tb[2] - tb[0]
    draw.text(((W - tw) // 2, thanks_y + 60), foot_text, fill=(160, 170, 195, 180), font=f_small)

    out_path = "d:/Jasil/TPM_Group/assets/tpm-review-desk-stand.png"
    base.convert("RGB").save(out_path, quality=95)
    print("Saved high-res stand to:", out_path)

if __name__ == "__main__":
    create_review_stand()
