#!/usr/bin/env python3

import json
import re
import unicodedata
from html import unescape

INPUT_FILE = "bibliography.json"
OUTPUT_FILE = "bibliography.json"


def normalize(text):
    """Normalize text for sorting/search."""

    if not text:
        return ""

    text = unicodedata.normalize("NFKD", text)
    text = "".join(
        c for c in text
        if not unicodedata.combining(c)
    )

    text = text.lower()
    text = re.sub(r"[^\w\s]", " ", text)
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def strip_html(html):
    """Convert formattedHTML to plain text."""

    if not html:
        return ""

    text = re.sub(r"<[^>]+>", " ", html)
    text = unescape(text)
    text = re.sub(r"\s+", " ", text)

    return text.strip()


def get_search_text(item):

    html = item.get("formattedHTML", "")

    return normalize(
        strip_html(html)
    )


# --------------------------------------------------
# processing
# --------------------------------------------------

with open(INPUT_FILE, encoding="utf-8") as f:
    bibliography = json.load(f)

bibliography.sort(key=lambda x: x['id'])

for item in bibliography:
    item["searchText"] = get_search_text(item)

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        bibliography,
        f,
        ensure_ascii=False,
        indent=2
    )

print(
    f"Processed {len(bibliography)} entries "
    f"-> {OUTPUT_FILE}"
)
