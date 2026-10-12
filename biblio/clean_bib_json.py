import json
import re
import unicodedata
from collections import defaultdict


ARTICLES = {
    # English
    "a", "an", "the",

    # French
    "le", "la", "les", "un", "une", "des", "du",
    "de", "de la", "de l",

    # German
    "der", "die", "das",
    "ein", "eine", "einer",

    # Italian
    "il", "lo", "la", "gli", "le",
    "un", "uno", "una",

    # Spanish / Catalan
    "el", "los", "las",
    "l", "els", "les"
}


def normalize_token(text):
    if not text:
        return ""

    # remove accents
    text = unicodedata.normalize("NFKD", text)
    text = "".join(
        c for c in text
        if not unicodedata.combining(c)
    )

    # keep only letters/numbers/spaces
    text = re.sub(r"[^A-Za-z0-9 ]", "", text)

    return text.strip()


def first_year(entry):
    issued = entry.get("issued", {})
    date_parts = issued.get("date-parts")

    if not date_parts:
        return "0000"

    return str(date_parts[0][0])


def first_author(entry):
    for field in ["author", "editor"]:
        people = entry.get(field)

        if not people:
            continue

        family = people[0].get("family")

        if family:
            return normalize_token(family)

    print("No author or editor: " + entry.get("title"))
    return "Anon"


def first_short_title_word(entry):

    title = (
        entry.get("title-short")
        or entry.get("shortTitle")
        or entry.get("title")
        or ""
    )

    title = normalize_token(title)

    if not title:
        return ""

    words = title.split()

    # skip initial articles
    while words and words[0].lower() in ARTICLES:
        words.pop(0)

    if not words:
        return ""

    return words[0]


with open("CBO_bib.json", encoding="utf-8") as f:
    entries = json.load(f)

ids_seen = defaultdict(list)

for entry in entries:

    citation_id = (
        first_author(entry)
        + first_year(entry)
        + first_short_title_word(entry)
    )

    entry["id"] = citation_id

    title = entry.get("title", "")
    ids_seen[citation_id].append(title)

with open("CBO_bib_normalized.json",
    "w",
    encoding="utf-8"
) as f:
    json.dump(
        entries,
        f,
        ensure_ascii=False,
        indent=2
    )

# collision report
print("\n=== COLLISIONS ===\n")

collision_count = 0

for key, titles in ids_seen.items():
    if len(titles) > 1:

        collision_count += 1

        print(f"\nID: {key}")

        for title in titles:
            print(f"  - {title}")

if collision_count == 0:
    print("No collisions found.")
else:
    print(
        f"\nFound {collision_count} distinct collision groups."
    )