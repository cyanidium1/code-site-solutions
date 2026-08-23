"""Повторная свёртка после правок: сравнение с sweep.json (до)."""
import json, time
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path
import requests
from bs4 import BeautifulSoup

BASE = Path(__file__).resolve().parent
UA = "Mozilla/5.0 (compatible; SEO-Audit/1.0; +https://www.code-site.art)"
urls = [u.strip() for u in (BASE / "all-urls.txt").read_text(encoding="utf-8").splitlines() if u.strip()]

def probe(url):
    row = {"url": url}
    try:
        r = requests.get(url, headers={"User-Agent": UA}, timeout=30)
    except Exception as exc:
        row["error"] = f"{type(exc).__name__}: {exc}"
        return row
    row["status"] = r.status_code
    row["vercel_cache"] = r.headers.get("X-Vercel-Cache")
    row["prerender"] = bool(r.headers.get("X-Nextjs-Prerender"))
    row["sec_headers"] = sum(
        1 for h in ("X-Content-Type-Options", "Referrer-Policy", "X-Frame-Options", "Permissions-Policy")
        if r.headers.get(h)
    )
    if r.status_code != 200:
        return row
    s = BeautifulSoup(r.text, "lxml")
    og = s.find("meta", attrs={"property": "og:image"})
    row["og_image"] = bool(og and og.get("content"))
    types = []
    for tag in s.find_all("script", attrs={"type": "application/ld+json"}):
        try:
            data = json.loads(tag.string or "{}")
        except Exception:
            types.append("<INVALID>"); continue
        for node in data if isinstance(data, list) else [data]:
            if isinstance(node, dict):
                g = node.get("@graph")
                if isinstance(g, list):
                    types += [x.get("@type") for x in g if isinstance(x, dict)]
                elif node.get("@type"):
                    types.append(node["@type"])
    row["jsonld_types"] = [t for t in types if isinstance(t, str)]
    time.sleep(0.25)
    return row

with ThreadPoolExecutor(max_workers=5) as pool:
    rows = list(pool.map(probe, urls))
(BASE / "resweep.json").write_text(json.dumps(rows, ensure_ascii=False, indent=1), encoding="utf-8")

ok = [r for r in rows if r.get("status") == 200]
print(f"URL: {len(rows)} | 200 OK: {len(ok)}")
print(f"без og:image: {sum(1 for r in ok if not r.get('og_image'))}  (было 102)")
print(f"prerender=1: {sum(1 for r in ok if r.get('prerender'))} / {len(ok)}")
print(f"кэш MISS: {sum(1 for r in ok if r.get('vercel_cache')=='MISS')}")
print(f"страниц с 4 заголовками безопасности: {sum(1 for r in ok if r.get('sec_headers')==4)}")
from collections import Counter
c = Counter(t for r in ok for t in r.get("jsonld_types", []))
print("HowTo:", c.get("HowTo", 0), "| FAQPage:", c.get("FAQPage", 0), "| битых JSON:", c.get("<INVALID>", 0))
