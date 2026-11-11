"""Inline the site (CSS, JS, images) into one HTML file for the preview and the claude.ai page."""
import base64
import os
import re

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site") + "/"
OUT = os.path.dirname(os.path.abspath(__file__)) + "/"

h = open(SITE + "index.html", encoding="utf-8").read()
# the one-file preview inlines its scripts, which the site's security policy would block
h = re.sub(r'<meta http-equiv="Content-Security-Policy"[^>]*>\n', "", h)


def read(name):
    return open(SITE + "assets/" + name, encoding="utf-8").read()


h = h.replace('<link rel="stylesheet" href="assets/style.css">', "<style>\n" + read("style.css") + "\n</style>")
h = h.replace('<link rel="stylesheet" href="assets/tw.css">', "<style>\n" + read("tw.css") + "\n</style>")
app_js = re.sub(r"^// Refuse to run inside.*\n.*\n", "", read("app.js"))  # the preview is shown inside a frame
h = h.replace('<script src="assets/app.js"></script>', "<script>\n" + app_js + "\n</script>")
h = h.replace('<script src="assets/doodle.js" defer></script>', "<script>\n" + read("doodle.js").replace("</script", "<\\/script") + "\n</script>")
fonts_css = read("fonts.css")
for ff in sorted(set(re.findall(r"url\(fonts/([^)]+)\)", fonts_css))):
    fb = base64.b64encode(open(SITE + "assets/fonts/" + ff, "rb").read()).decode()
    fonts_css = fonts_css.replace("url(fonts/" + ff + ")", "url(data:font/woff2;base64," + fb + ")")
h = h.replace('<link rel="stylesheet" href="assets/fonts.css">', "<style>\n" + fonts_css + "\n</style>")
for f in ["logo-mark.webp", "logo-mark-sm.webp", "photo-nails.webp", "photo-color.webp", "photo-master.webp", "photo-desk.webp", "photo-brows.webp"]:
    b = base64.b64encode(open(SITE + "assets/" + f, "rb").read()).decode()
    h = h.replace("assets/" + f, "data:image/webp;base64," + b)
left = re.findall(r'(?:src|href)="assets/[^"]+"', h)
assert not left, left
open(OUT + "sakura-preview.html", "w", encoding="utf-8").write(h)

a = h.replace("<!doctype html>\n", "")
a = re.sub(r"<html[^>]*>\n?", "", a).replace("<head>\n", "").replace("</head>\n", "")
a = re.sub(r"<body>\n?", "", a).replace("</body>\n", "").replace("</html>", "")
a = a.replace('<meta charset="utf-8">\n', "").replace('<meta name="viewport" content="width=device-width,initial-scale=1">\n', "")
open(OUT + "sakura-artifact.html", "w", encoding="utf-8").write(a.strip() + "\n")
print("artifact bytes", len(a))
