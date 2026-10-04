import os
from PIL import Image, ImageDraw, ImageFont

os.makedirs('assets', exist_ok=True)

font_reg = "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf"
font_bld = "/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf"
font_mn = "/usr/share/fonts/truetype/dejavu/DejaVuSansMono.ttf"

def get_font(size, bold=False, mono=False):
    path = font_bld if bold else (font_mn if mono else font_reg)
    return ImageFont.truetype(path, size)

W, H = 1400, 920

def base_canvas(title="mitfloww.com/s/nordic-campaign", status="256-Bit Protected"):
    img = Image.new("RGBA", (W, H), (15, 23, 42, 255))
    draw = ImageDraw.Draw(img)
    # Window Header
    draw.rectangle([0, 0, W, 56], fill="#1e293b")
    draw.line([0, 56, W, 56], fill="#334155", width=1)
    # Window controls
    draw.ellipse([24, 22, 36, 34], fill="#ef4444")
    draw.ellipse([46, 22, 58, 34], fill="#f59e0b")
    draw.ellipse([68, 22, 80, 34], fill="#10b981")
    # URL address box
    draw.rounded_rectangle([W//2 - 240, 12, W//2 + 240, 44], radius=6, fill="#0f172a", outline="#334155")
    draw.text((W//2 - 220, 20), "https://" + title, font=get_font(13, mono=True), fill="#94a3b8")
    # Status Tag
    draw.rounded_rectangle([W - 190, 14, W - 24, 42], radius=6, fill="#005bdd")
    draw.text((W - 176, 20), status, font=get_font(12, bold=True), fill="#ffffff")
    return img, draw

# ==========================================
# 1. STAGE 1: PREPARE & ENCRYPT
# ==========================================
img1, draw1 = base_canvas("mitfloww.com/p/nordic-brand-system/upload", "Stage: 01 / Prepare")
draw1.rectangle([0, 57, 280, H], fill="#131d31")
draw1.line([280, 57, 280, H], fill="#1e293b", width=1)

draw1.text((32, 88), "PROJECT FILES", font=get_font(11, bold=True, mono=True), fill="#64748b")
draw1.rounded_rectangle([20, 120, 260, 164], radius=8, fill="#005bdd")
draw1.text((36, 134), "Master Deliverables", font=get_font(14, bold=True), fill="#ffffff")

draw1.rounded_rectangle([20, 176, 260, 220], radius=8, fill="#1e293b")
draw1.text((36, 190), "Raw Source Archives", font=get_font(14), fill="#94a3b8")

draw1.rounded_rectangle([20, 232, 260, 276], radius=8, fill="#1e293b")
draw1.text((36, 246), "Client Stream Proxy", font=get_font(14), fill="#94a3b8")

draw1.rounded_rectangle([20, H - 120, 260, H - 30], radius=10, fill="#1e293b", outline="#334155")
draw1.text((36, H - 105), "VAULT STORAGE (ENCRYPTED)", font=get_font(10, bold=True, mono=True), fill="#64748b")
draw1.text((36, H - 85), "4.82 GB / 50 GB Used", font=get_font(13, bold=True), fill="#f8fafc")
draw1.rounded_rectangle([36, H - 60, 244, H - 52], radius=4, fill="#334155")
draw1.rounded_rectangle([36, H - 60, 90, H - 52], radius=4, fill="#005bdd")

draw1.text((320, 90), "Prepare Deliverables & Set Custody Rules", font=get_font(24, bold=True), fill="#ffffff")
draw1.text((320, 126), "Raw files are encrypted with ephemeral keys. Only stream-only watermarked proxies will be shown.", font=get_font(14), fill="#94a3b8")

draw1.rounded_rectangle([320, 160, W - 40, 310], radius=12, fill="#162238", outline="#005bdd", width=2)
draw1.ellipse([W//2 + 40, 200, W//2 + 100, 260], fill="#005bdd")
draw1.text((W//2 + 63, 218), "^", font=get_font(30, bold=True), fill="#ffffff")
draw1.text((W//2 - 60, 275), "Drag new master revisions here to encrypt at rest", font=get_font(15, bold=True), fill="#f8fafc")

files = [
    ("Nordic_Campaign_Master_ProRes422HQ.mov", "3.8 GB", "Video Master", "AES-256 Encrypted", "#10b981"),
    ("Brand_Identity_Vector_Source.ai", "184 MB", "Design Master", "AES-256 Encrypted", "#10b981"),
    ("Typography_Licensing_Suite.zip", "42 MB", "Asset Package", "AES-256 Encrypted", "#10b981"),
    ("Final_Color_Grading_LUTs.cube", "16 MB", "Color Asset", "Ready for Review", "#38bdf8")
]

y_pos = 340
for name, size, ftype, status, col in files:
    draw1.rounded_rectangle([320, y_pos, W - 40, y_pos + 70], radius=10, fill="#1e293b", outline="#334155")
    draw1.rounded_rectangle([336, y_pos + 12, 382, y_pos + 58], radius=8, fill="#0f172a")
    draw1.text((350, y_pos + 24), "MF", font=get_font(14, bold=True), fill="#005bdd")
    draw1.text((400, y_pos + 16), name, font=get_font(15, bold=True), fill="#f8fafc")
    draw1.text((400, y_pos + 40), f"{size} | {ftype} | Stream watermark proxy generated", font=get_font(12), fill="#64748b")
    draw1.rounded_rectangle([W - 240, y_pos + 20, W - 60, y_pos + 50], radius=6, fill="#0f172a", outline=col)
    draw1.text((W - 225, y_pos + 26), f"[LOCKED] {status}", font=get_font(11, bold=True), fill=col)
    y_pos += 84

draw1.rounded_rectangle([320, H - 74, W - 40, H - 24], radius=8, fill="#005bdd")
draw1.text((344, H - 56), "Custody Locked: Raw masters cannot be downloaded until payment escrow webhook triggers.", font=get_font(13, bold=True), fill="#ffffff")

img1.save("assets/ui-stage-prepare.webp", "WEBP", quality=92)
print("Saved assets/ui-stage-prepare.webp")

# ==========================================
# 2. STAGE 2: IN-CANVAS REVIEW WITH ANNOTATIONS
# ==========================================
img2, draw2 = base_canvas("mitfloww.com/s/nordic-campaign/review", "Stage: 02 / In-Canvas Review")
draw2.rectangle([0, 57, W - 380, H - 60], fill="#080c14")

draw2.rectangle([40, 90, W - 420, H - 120], fill="#1e2433", outline="#334155")
for wx in range(80, W - 440, 260):
    for wy in range(140, H - 140, 160):
        draw2.text((wx, wy), "MITFLOWW PROTECTED PREVIEW", font=get_font(13, bold=True, mono=True), fill=(255, 255, 255, 45))

draw2.text((70, 120), "Brand Film - Frame 00:01:24:18 (1080p Stream Proxy)", font=get_font(14, bold=True), fill="#94a3b8")

draw2.ellipse([420, 280, 460, 320], fill="#005bdd", outline="#ffffff", width=2)
draw2.text((435, 292), "1", font=get_font(16, bold=True), fill="#ffffff")

draw2.ellipse([700, 380, 740, 420], fill="#ef4444", outline="#ffffff", width=2)
draw2.text((715, 392), "2", font=get_font(16, bold=True), fill="#ffffff")

draw2.rounded_rectangle([720, 430, 980, 550], radius=10, fill="#1e293b", outline="#3b82f6", width=2)
draw2.text((740, 448), "mac@nordicbrand.com", font=get_font(13, bold=True), fill="#f8fafc")
draw2.text((740, 472), '"Adjust lower-third typography opacity', font=get_font(13), fill="#cbd5e1")
draw2.text((740, 494), 'and sync brand reveal with audio hit."', font=get_font(13), fill="#cbd5e1")
draw2.text((740, 524), "Revision 1/3 Requested - Timestamp 01:24:18", font=get_font(11, mono=True), fill="#38bdf8")

draw2.rectangle([40, H - 110, W - 420, H - 80], fill="#111827")
draw2.rectangle([40, H - 96, 380, H - 94], fill="#005bdd")
draw2.ellipse([375, H - 100, 385, H - 90], fill="#ffffff")
draw2.text((50, H - 72), "Play: 01:24 / 03:15 | 24.00 fps | Watermarked 1080p Stream Proxy", font=get_font(12, mono=True), fill="#64748b")

draw2.rectangle([W - 380, 57, W, H], fill="#131d31")
draw2.line([W - 380, 57, W - 380, H], fill="#1e293b", width=1)

draw2.text((W - 355, 88), "REVISION BOUNDS", font=get_font(11, bold=True, mono=True), fill="#64748b")
draw2.rounded_rectangle([W - 355, 115, W - 25, 175], radius=8, fill="#1e293b", outline="#334155")
draw2.text((W - 340, 130), "REVISIONS REMAINING", font=get_font(10, mono=True), fill="#94a3b8")
draw2.text((W - 340, 148), "2 of 3 Rounds Left", font=get_font(18, bold=True), fill="#10b981")

draw2.text((W - 355, 205), "CLIENT FEEDBACK (2)", font=get_font(11, bold=True, mono=True), fill="#64748b")

draw2.rounded_rectangle([W - 355, 230, W - 25, 310], radius=8, fill="#1e293b")
draw2.text((W - 340, 244), "1. Logo Margin Alignment", font=get_font(14, bold=True), fill="#f8fafc")
draw2.text((W - 340, 268), "Approved & marked resolved", font=get_font(12), fill="#10b981")

draw2.rounded_rectangle([W - 355, 325, W - 25, 415], radius=8, fill="#1e293b", outline="#ef4444")
draw2.text((W - 340, 339), "2. Lower-Third Opacity", font=get_font(14, bold=True), fill="#f8fafc")
draw2.text((W - 340, 363), "In progress by creator...", font=get_font(12), fill="#f59e0b")

draw2.rounded_rectangle([W - 355, H - 100, W - 25, H - 46], radius=8, fill="#005bdd")
draw2.text((W - 305, H - 80), "Approve Milestone ->", font=get_font(14, bold=True), fill="#ffffff")

img2.save("assets/ui-stage-review.webp", "WEBP", quality=92)
print("Saved assets/ui-stage-review.webp")

# ==========================================
# 3. STAGE 3: ESCROW SETTLEMENT & CHECKOUT
# ==========================================
img3, draw3 = base_canvas("mitfloww.com/s/nordic-campaign/payment", "Stage: 03 / Escrow Payment")
mx, my, mw, mh = W//2 - 340, 90, 680, 750
draw3.rounded_rectangle([mx, my, mx + mw, my + mh], radius=16, fill="#1e293b", outline="#005bdd", width=2)

draw3.rectangle([mx, my, mx + mw, my + 80], fill="#131d31")
draw3.line([mx, my + 80, mx + mw, my + 80], fill="#334155", width=1)
draw3.text((mx + 36, my + 24), "Milestone 02: Final Deliverables Release", font=get_font(18, bold=True), fill="#ffffff")
draw3.text((mx + 36, my + 50), "MitFloww Verified Escrow Handoff", font=get_font(13), fill="#60a5fa")

draw3.rounded_rectangle([mx + 36, my + 110, mx + mw - 36, my + 210], radius=10, fill="#0f172a", outline="#334155")
draw3.text((mx + 60, my + 130), "AMOUNT DUE BEFORE DECRYPTION", font=get_font(11, bold=True, mono=True), fill="#64748b")
draw3.text((mx + 60, my + 155), "$2,850.00 USD", font=get_font(36, bold=True), fill="#10b981")
draw3.text((mx + mw - 220, my + 165), "[Escrow Protected]", font=get_font(13, bold=True), fill="#38bdf8")

draw3.text((mx + 36, my + 235), "DELIVERABLES INCLUDED IN SETTLEMENT", font=get_font(11, bold=True, mono=True), fill="#94a3b8")
items = [
    ("4K ProRes Master Film (All 3 cuts)", "$1,800.00"),
    ("Vector Source Suite (.AI, .EPS, .SVG)", "$750.00"),
    ("Sound Design Stems & Commercial License", "$300.00")
]
iy = my + 265
for item_name, item_price in items:
    draw3.text((mx + 40, iy), "* " + item_name, font=get_font(14), fill="#cbd5e1")
    draw3.text((mx + mw - 140, iy), item_price, font=get_font(14, bold=True, mono=True), fill="#f8fafc")
    iy += 32

draw3.text((mx + 36, my + 385), "SELECT PAYMENT METHOD", font=get_font(11, bold=True, mono=True), fill="#94a3b8")
draw3.rounded_rectangle([mx + 36, my + 410, mx + mw - 36, my + 470], radius=8, fill="#0f172a", outline="#005bdd", width=2)
draw3.text((mx + 60, my + 430), "Stripe Connect (Credit / Debit / Apple Pay)", font=get_font(14, bold=True), fill="#ffffff")
draw3.text((mx + mw - 100, my + 432), "INSTANT", font=get_font(11, bold=True), fill="#10b981")

draw3.rounded_rectangle([mx + 36, my + 485, mx + mw - 36, my + 545], radius=8, fill="#0f172a", outline="#334155")
draw3.text((mx + 60, my + 505), "Direct Bank Wire / ACH Escrow Transfer", font=get_font(14), fill="#cbd5e1")
draw3.text((mx + mw - 110, my + 507), "1-2 DAYS", font=get_font(11, mono=True), fill="#64748b")

draw3.rounded_rectangle([mx + 36, my + 565, mx + mw - 36, my + 630], radius=8, fill="#162e24", outline="#10b981")
draw3.text((mx + 56, my + 580), "MitFloww Escrow Guarantee:", font=get_font(12, bold=True), fill="#10b981")
draw3.text((mx + 56, my + 602), "Funds are locked in escrow. Master decryption keys release automatically the instant settlement completes.", font=get_font(12), fill="#d1fae5")

draw3.rounded_rectangle([mx + 36, my + 655, mx + mw - 36, my + 715], radius=8, fill="#005bdd")
draw3.text((mx + mw//2 - 130, my + 678), "Pay $2,850.00 & Unlock Master Files ->", font=get_font(15, bold=True), fill="#ffffff")

img3.save("assets/ui-stage-payment.webp", "WEBP", quality=92)
print("Saved assets/ui-stage-payment.webp")

# ==========================================
# 4. STAGE 4: MASTER DECRYPTION & RELEASE
# ==========================================
img4, draw4 = base_canvas("mitfloww.com/s/nordic-campaign/downloads", "Stage: 04 / Unsealed Master Release")
draw4.rounded_rectangle([80, 80, W - 80, 180], radius=12, fill="#064e3b", outline="#10b981", width=2)
draw4.ellipse([115, 105, 165, 155], fill="#10b981")
draw4.text((130, 115), "V", font=get_font(32, bold=True), fill="#ffffff")
draw4.text((190, 106), "SETTLEMENT CONFIRMED - ALL MASTERS UNSEALED", font=get_font(20, bold=True), fill="#ffffff")
draw4.text((190, 140), "Payment Receipt #MF-9842 ($2,850.00 USD) cleared via Stripe Connect. Decryption keys active.", font=get_font(13), fill="#a7f3d0")

draw4.text((80, 215), "DECRYPTED PRODUCTION MASTERS", font=get_font(12, bold=True, mono=True), fill="#94a3b8")

unlocked_files = [
    ("Nordic_Campaign_Master_ProRes422HQ.mov", "3.8 GB", "Raw 4K Master Video (Clean, No Watermark)", "SHA-256 Verified"),
    ("Brand_Identity_Vector_Source_Package.zip", "482 MB", "Complete Illustrator & Figma Master Files", "SHA-256 Verified"),
    ("Typography_Font_Licenses_Commercial.zip", "38 MB", "Web & Desktop Font License Bundles", "SHA-256 Verified"),
    ("MitFloww_Proof_of_Delivery_Receipt.pdf", "1.2 MB", "Legally binding immutable handoff confirmation", "Cryptographically Signed")
]

uy = 245
for uname, usize, udesc, uhash in unlocked_files:
    draw4.rounded_rectangle([80, uy, W - 80, uy + 80], radius=10, fill="#1e293b", outline="#334155")
    draw4.rounded_rectangle([100, uy + 14, 150, uy + 66], radius=8, fill="#0f172a")
    draw4.text((115, uy + 26), "DL", font=get_font(18, bold=True), fill="#10b981")
    draw4.text((170, uy + 18), uname, font=get_font(15, bold=True), fill="#f8fafc")
    draw4.text((170, uy + 44), f"{usize} | {udesc} | {uhash}", font=get_font(12), fill="#64748b")
    draw4.rounded_rectangle([W - 270, uy + 18, W - 100, uy + 62], radius=6, fill="#005bdd")
    draw4.text((W - 240, uy + 30), "Download Master", font=get_font(13, bold=True), fill="#ffffff")
    uy += 94

draw4.rounded_rectangle([80, H - 90, W - 80, H - 35], radius=8, fill="#1e293b", outline="#334155")
draw4.text((105, H - 70), "Time-Limited Signed URLs: Download access is cryptographically signed and valid for 72 hours. Payouts initiated.", font=get_font(12, mono=True), fill="#94a3b8")

img4.save("assets/ui-stage-release.webp", "WEBP", quality=92)
print("Saved assets/ui-stage-release.webp")

# ==========================================
# 5. CAPABILITY: DESIGNERS (Vector & Identity)
# ==========================================
img5, draw5 = base_canvas("mitfloww.com/p/design-vector-escrow", "Discipline: Brand Designers")
draw5.rectangle([0, 57, W - 420, H], fill="#0a0f1d")

draw5.rounded_rectangle([40, 90, W - 460, 480], radius=12, fill="#ffffff", outline="#e2e8f0")
draw5.text((70, 120), "NORDIC STUDIO - BRAND GUIDELINES", font=get_font(22, bold=True), fill="#0f172a")
draw5.text((70, 160), "Primary Color Palette (Pantone & CMYK Verified)", font=get_font(13, bold=True), fill="#64748b")

colors = ["#005bdd", "#0f172a", "#10b981", "#f59e0b", "#e2e8f0"]
cx = 70
for c in colors:
    draw5.rounded_rectangle([cx, 190, cx + 80, 270], radius=8, fill=c)
    draw5.text((cx + 10, 280), c, font=get_font(11, mono=True), fill="#475569")
    cx += 105

draw5.text((120, 350), "MITFLOWW WATERMARKED VECTOR PREVIEW", font=get_font(20, bold=True, mono=True), fill=(0, 91, 221, 60))

draw5.rounded_rectangle([40, 520, W - 460, H - 40], radius=12, fill="#1e293b", outline="#334155")
draw5.text((70, 545), "PROTECTED SOURCE FILES", font=get_font(12, bold=True, mono=True), fill="#64748b")
draw5.text((70, 575), "[LOCKED] Identity_Master_Vector.ai (Vector curves, live typography, Pantone specs)", font=get_font(14, bold=True), fill="#f8fafc")
draw5.text((70, 610), "[LOCKED] Brand_Guidelines_Book_Print.pdf (Press-ready 300DPI with bleed & crop marks)", font=get_font(14), fill="#cbd5e1")
draw5.text((70, 645), "[LOCKED] Proprietary_Typography_WebFonts.woff2 (Commercial web license files)", font=get_font(14), fill="#cbd5e1")

draw5.rectangle([W - 420, 57, W, H], fill="#131d31")
draw5.line([W - 420, 57, W - 420, H], fill="#1e293b", width=1)
draw5.text((W - 390, 90), "DESIGN PROTECTION MODE", font=get_font(12, bold=True, mono=True), fill="#60a5fa")
draw5.text((W - 390, 125), "Vector Custody Protocol", font=get_font(20, bold=True), fill="#ffffff")
draw5.text((W - 390, 160), "Never send raw editable vectors (.AI / .EPS) before invoice settlement. MitFloww converts layers into high-res watermarked review sheets.", font=get_font(13), fill="#94a3b8")

draw5.rounded_rectangle([W - 390, 260, W - 30, 360], radius=10, fill="#1e293b", outline="#334155")
draw5.text((W - 370, 280), "Vector Lock Active", font=get_font(14, bold=True), fill="#10b981")
draw5.text((W - 370, 310), "Source curves and font files stay encrypted until payment escrow settles.", font=get_font(12), fill="#cbd5e1")

img5.save("assets/ui-design-vector.webp", "WEBP", quality=92)
print("Saved assets/ui-design-vector.webp")

# ==========================================
# 6. CAPABILITY: VIDEO EDITORS (4K Timeline)
# ==========================================
img6, draw6 = base_canvas("mitfloww.com/p/video-editor-suite", "Discipline: Video Editors")
draw6.rectangle([0, 57, W, H], fill="#0c101b")

draw6.rectangle([40, 80, W - 40, 500], fill="#141c2e", outline="#334155")
draw6.text((W//2 - 180, 240), "4K DCI Stream Proxy (100 Mbps)", font=get_font(18, bold=True), fill="#64748b")
draw6.text((W//2 - 240, 280), "MITFLOWW FRAME-ACCURATE TIMECODE WATERMARK", font=get_font(14, mono=True), fill=(255, 255, 255, 70))
draw6.rounded_rectangle([60, 100, 220, 140], radius=6, fill="#0f172a", outline="#005bdd")
draw6.text((75, 112), "TC 00:02:14:08", font=get_font(14, bold=True, mono=True), fill="#38bdf8")

draw6.rounded_rectangle([40, 520, W - 40, H - 40], radius=10, fill="#161f33", outline="#334155")
draw6.text((60, 538), "TIMELINE TRACKS & AUDIO STEMS", font=get_font(11, bold=True, mono=True), fill="#64748b")

draw6.rounded_rectangle([60, 565, W - 60, 620], radius=6, fill="#1e293b", outline="#005bdd")
draw6.text((80, 584), "V1: Master Color Grade Cut (ProRes 422HQ)", font=get_font(13, bold=True), fill="#ffffff")

draw6.rounded_rectangle([60, 630, W - 60, 680], radius=6, fill="#1a253a")
draw6.text((80, 646), "A1-A2: Dialogue & Foley Stems (24-bit 48kHz WAV)", font=get_font(13), fill="#94a3b8")

draw6.rounded_rectangle([60, 690, W - 60, 740], radius=6, fill="#1a253a")
draw6.text((80, 706), "A3-A4: Licensed Commercial Soundtrack", font=get_font(13), fill="#94a3b8")

draw6.line([540, 520, 540, 760], fill="#ef4444", width=2)
draw6.polygon([(535, 520), (545, 520), (540, 530)], fill="#ef4444")

draw6.rounded_rectangle([555, 570, 780, 615], radius=6, fill="#ef4444")
draw6.text((565, 584), "Pin: Trim cut 4 frames earlier", font=get_font(11, bold=True), fill="#ffffff")

draw6.text((60, H - 75), "4K Video Protection: Clients review smooth stream-only proxies. 50GB ProRes masters stay safe.", font=get_font(12, mono=True), fill="#10b981")

img6.save("assets/ui-video-timeline.webp", "WEBP", quality=92)
print("Saved assets/ui-video-timeline.webp")

# ==========================================
# 7. CAPABILITY: DEVELOPERS (Sandbox & Git)
# ==========================================
img7, draw7 = base_canvas("mitfloww.com/p/dev-staging-escrow", "Discipline: Software Engineers")
draw7.rectangle([0, 57, W, H], fill="#080c14")

draw7.rounded_rectangle([40, 80, W//2 - 20, H - 50], radius=12, fill="#111827", outline="#334155")
draw7.text((64, 105), "SOURCE REPOSITORY ESCROW", font=get_font(12, bold=True, mono=True), fill="#60a5fa")

draw7.rounded_rectangle([64, 135, W//2 - 44, 215], radius=8, fill="#1f2937", outline="#374151")
draw7.text((84, 152), "github.com/client-org/private-app.git", font=get_font(13, bold=True, mono=True), fill="#f8fafc")
draw7.text((84, 178), "Private Repository Transfer: Locked behind verified milestone escrow.", font=get_font(12), fill="#9ca3af")

draw7.text((64, 240), "ENVIRONMENT SECRETS & CREDENTIALS", font=get_font(11, bold=True, mono=True), fill="#6b7280")
draw7.rounded_rectangle([64, 265, W//2 - 44, 390], radius=8, fill="#0f172a", outline="#374151")
draw7.text((84, 285), "* DATABASE_URL: ************************ (Encrypted)", font=get_font(12, mono=True), fill="#ef4444")
draw7.text((84, 315), "* STRIPE_SECRET_KEY: ******************* (Encrypted)", font=get_font(12, mono=True), fill="#ef4444")
draw7.text((84, 345), "* AWS_DEPLOY_ARN: ********************** (Encrypted)", font=get_font(12, mono=True), fill="#ef4444")

draw7.rounded_rectangle([W//2 + 20, 80, W - 40, H - 50], radius=12, fill="#111827", outline="#10b981", width=2)
draw7.text((W//2 + 44, 105), "ACTIVE SANDBOXED STAGING PREVIEW (CLIENT QA)", font=get_font(12, bold=True, mono=True), fill="#10b981")
draw7.rounded_rectangle([W//2 + 44, 135, W - 64, 185], radius=6, fill="#0f172a", outline="#374151")
draw7.text((W//2 + 60, 150), "staging-sandbox-preview.mitfloww.dev", font=get_font(13, mono=True), fill="#38bdf8")

draw7.rounded_rectangle([W//2 + 44, 205, W - 64, H - 70], radius=8, fill="#030712")
logs = [
    "[OK] Next.js 15 production build compiled successfully in 3.4s",
    "[OK] Database migrations applied to isolated sandbox DB",
    "[OK] Client QA session active - testing payment gateways & auth",
    "[LOCKED] Production DNS & GitHub ownership release queued for payment",
    "[ACTIVE] Webhook listener armed: Waiting for Stripe milestone $3,500.00"
]
ly = 230
for log in logs:
    draw7.text((W//2 + 60, ly), log, font=get_font(12, mono=True), fill="#a7f3d0" if "[OK]" in log else ("#f87171" if "[LOCKED]" in log else "#38bdf8"))
    ly += 34

img7.save("assets/ui-dev-sandbox.webp", "WEBP", quality=92)
print("Saved assets/ui-dev-sandbox.webp")
print("ALL 7 ASSETS GENERATED SUCCESSFULLY!")
