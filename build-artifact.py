"""Inline the site (CSS, JS, images) into one HTML file for the preview and the claude.ai page."""
import base64
import os
import re

SITE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "site") + "/"
OUT = os.path.dirname(os.path.abspath(__file__)) + "/"

h = open(SITE + "index.html", encoding="utf-8").read()


def read(name):
    return open(SITE + "assets/" + name, encoding="utf-8").read()


h = h.replace('<link rel="stylesheet" href="assets/style.css">', "<style>\n" + read("style.css") + "\n</style>")
h = h.replace('<link rel="stylesheet" href="assets/tw.css">', "<style>\n" + read("tw.css") + "\n</style>")
h = h.replace('<link rel="stylesheet" href="assets/doodle.css">', "<style>\n" + read("doodle.css") + "\n</style>")
h = h.replace('<script src="assets/app.js"></script>', "<script>\n" + read("app.js") + "\n</script>")
h = h.replace('<script src="assets/doodle.js" defer></script>', "<script>\n" + read("doodle.js").replace("</script", "<\\/script") + "\n</script>")
for f in ["logo-mark.png", "logo-mark-sm.png", "photo-nails.jpg", "photo-color.jpg", "photo-master.jpg", "photo-desk.jpg", "photo-brows.jpg"]:
    b = base64.b64encode(open(SITE + "assets/" + f, "rb").read()).decode()
    h = h.replace("assets/" + f, ("data:image/png;base64," if f.endswith(".png") else "data:image/jpeg;base64,") + b)
left = re.findall(r'(?:src|href)="assets/[^"]+"', h)
assert not left, left
open(OUT + "sakura-preview.html", "w", encoding="utf-8").write(h)

a = h.replace("<!doctype html>\n", "")
a = re.sub(r"<html[^>]*>\n?", "", a).replace("<head>\n", "").replace("</head>\n", "")
a = re.sub(r"<body>\n?", "", a).replace("</body>\n", "").replace("</html>", "")
a = a.replace('<meta charset="utf-8">\n', "").replace('<meta name="viewport" content="width=device-width,initial-scale=1">\n', "")
open(OUT + "sakura-artifact.html", "w", encoding="utf-8").write(a.strip() + "\n")
print("artifact bytes", len(a))
