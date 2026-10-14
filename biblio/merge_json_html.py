#!/usr/bin/env python3

import json
import re
import urllib.parse
from bs4 import BeautifulSoup


# --------------------------------------------------
# configuration
# --------------------------------------------------

JSON_FILE = "bibliography_merged.json"
HTML_FILE = "CBO_bib_french.html"
OUTPUT_FILE = "bibliography_merged.json"

ARTICLES = {
    "a", "an", "the",
    "le", "la", "les",
    "un", "une", "des",
    "der", "die", "das",
    "ein", "eine"
}


# --------------------------------------------------
# helpers
# --------------------------------------------------

def normalize_text(text):
    if not text:
        return ""

    text = text.lower()
    text = re.sub(r"<[^>]+>", "", text)
    text = re.sub(r"[^a-z0-9 ]+", " ", text)
    text = re.sub(r"\s+", " ", text)
    return text.strip()


def first_significant_word(title):
    words = normalize_text(title).split()

    while words and words[0] in ARTICLES:
        words.pop(0)

    return words[0] if words else ""


def first_author_family(item):
    creators = (
        item.get("author")
        or item.get("editor")
        or []
    )

    if not creators:
        print(item.get("title"))
        return ""

    first = creators[0]

    if "family" in first:
        return normalize_text(first["family"])

    if "literal" in first:
        return normalize_text(first["literal"])

    return ""


def first_year(item):
    dp = item.get("issued", {}).get("date-parts")

    if not dp:
        return ""

    try:
        return str(dp[0][0])
    except Exception:
        print("NO YEAR: ", item.get("title"))
        return ""


def build_json_key(item):

    author = first_author_family(item)
    year = first_year(item)
    title = item.get("title", "")

    if not title:
        print(item.get("id"))

    return f"{author}|{year}|{normalize_text(title)}", f"{author}|{normalize_text(title)}"


# --------------------------------------------------
# Z3988 processing
# --------------------------------------------------

def extract_metadata(z3988_span):

    title_attr = z3988_span.get("title", "")

    parsed = urllib.parse.parse_qs(title_attr)

    def get(field):
        values = parsed.get(field)
        return values[0] if values else ""

    author = get("rft.aulast")

    date = get("rft.date")

    year_match = re.search(r"\d{4}", date)
    year = year_match.group(0) if year_match else ""

    title = (
        get("rft.atitle")
        or get("rft.btitle")
        or get("rft.title")
    )

    return {
        "author": author,
        "year": year,
        "title": title,
    }


def build_html_key(meta):

    author = normalize_text(meta["author"])
    year = meta["year"]
    title = meta["title"]

    if year:
        return f"{author}|{year}|{normalize_text(title)}"
    else:
        return f"{author}|{normalize_text(title)}"


# --------------------------------------------------
# load JSON
# --------------------------------------------------

with open(JSON_FILE, encoding="utf-8") as f:
    records = json.load(f)

json_lookup_1 = {}
json_lookup_2 = {}
json_collisions_1 = []
json_collisions_2 = []

for item in records:

    key_1, key_2 = build_json_key(item)

    if key_1 in json_lookup_1:
        json_collisions_1.append(key_1)

    if key_2 in json_lookup_2:
        json_collisions_2.append(key_2)

    json_lookup_1[key_1] = item
    json_lookup_2[key_2] = item

# --------------------------------------------------
# parse HTML
# --------------------------------------------------

with open(HTML_FILE, encoding="utf-8") as f:
    soup = BeautifulSoup(f, "html.parser")

entries = soup.select("div.csl-entry")

matched = 0
unmatched_1 = []
unmatched_2 = []

for entry in entries:

    z3988 = entry.find_next_sibling("span")

    if not z3988:
        continue

    classes = z3988.get("class", [])

    if "Z3988" not in classes:
        continue

    meta = extract_metadata(z3988)

    key = build_html_key(meta)

    if key not in json_lookup_1:
        unmatched_1.append({"key": key, "author": meta["author"], "year": meta["year"], "title": meta["title"]})
        if key not in json_lookup_2:
            unmatched_2.append({"key": key, "author": meta["author"], "year": meta["year"], "title": meta["title"]})
        else:
            json_lookup_2[key]["formattedHTML"] += str(entry)
            matched += 1
    else:
        json_lookup_1[key]["formattedHTML"] += str(entry)
        matched += 1

# --------------------------------------------------
# reporting
# --------------------------------------------------

print()
print("JSON entries:", len(records))
print("HTML entries:", len(entries))
print("Matched:", matched)
print("Unmatched:", len(unmatched_1), len(unmatched_2))
print("JSON key collisions:", len(json_collisions_1), len(json_collisions_2))
print()

if json_collisions_1:
    print("JSON collisions (first round):")
    for key in json_collisions_1:
        print("  ", key)

if json_collisions_2:
    print("JSON collisions (second round):")
    for key in json_collisions_2:
        print("  ", key)

if unmatched_1:
    print("\nUnmatched HTML entries (first round):")
    for item in unmatched_1:
        print(
            item["author"],
            item["year"],
            item["title"]
        )

if unmatched_2:
    print("\nUnmatched HTML entries (second round):")
    for item in unmatched_2:
        print(
            item["author"],
            item["year"],
            item["title"]
        )

# --------------------------------------------------
# save
# --------------------------------------------------

with open(
    OUTPUT_FILE,
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        records,
        f,
        ensure_ascii=False,
        indent=2
    )

print(f"\nWritten: {OUTPUT_FILE}")