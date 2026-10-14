import json
import re
import unicodedata
from collections import defaultdict

def clean_title(s):
    if s.startswith('\"'):
        return s[1:]
    else:
        return s


with open("items.json", encoding="utf-8") as f:
    entries = json.load(f)

entries.sort(key=lambda x: clean_title(x.get("title")))

with open("sorted_items.json", "w", encoding="utf-8") as f:
    json.dump(entries, f, ensure_ascii=False, indent=2)
