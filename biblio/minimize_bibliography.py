#!/usr/bin/env python3

import json
import re
import unicodedata
from html import unescape

INPUT_FILE = "bibliography_normalized.json"
OUTPUT_FILE = "bibliography.json"

ARTICLES = {
    # English
    "a", "an", "the",

    # German
    "der", "die", "das", "den", "dem", "des",
    "ein", "eine", "einer", "einem", "einen",

    # French
    "le", "la", "les", "un", "une", "des",
    "du", "de", "de la", "de l",

    # Italian
    "il", "lo", "la", "i", "gli", "le", "un",
    "uno", "una", "l"
}


# --------------------------------------------------
# normalization helpers
# --------------------------------------------------

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


# --------------------------------------------------
# sort fields
# --------------------------------------------------

def get_sort_author(item):

    creators = (
        item.get("author")
        or item.get("editor")
        or []
    )

    if not creators:
        return ""

    first = creators[0]

    value = (
        first.get("family")
        or first.get("literal")
        or ""
    )

    return normalize(value)


def get_sort_year(item):

    dp = (
        item.get("issued", {})
            .get("date-parts", [])
    )

    if not dp:
        return 9999

    try:
        return int(dp[0][0])
    except Exception:
        return 9999


def get_sort_title(item):

    return normalize(item.get("title", ""))


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

minimized_bibliography = []

for item in bibliography:
    minimized_item = {"id": item["id"], "formattedHTML": item["formattedHTML"]}
    minimized_item["sortAuthor"] = get_sort_author(item)
    minimized_item["sortYear"] = get_sort_year(item)
    minimized_item["sortTitle"] = get_sort_title(item)
    minimized_item["searchText"] = get_search_text(item)
    minimized_bibliography.append(minimized_item)

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        minimized_bibliography,
        f,
        ensure_ascii=False,
        indent=2
    )

print(
    f"Processed {len(bibliography)} entries "
    f"-> {OUTPUT_FILE}"
)
