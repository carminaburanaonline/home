#!/usr/bin/env python3

import json

with open("items.json", "r", encoding="utf-8") as f:
    data = json.load(f)

sorted_data = sorted(data, key=lambda x: (x["abstract_item"], x["file"]))

with open("sorted_items.json", "w", encoding="utf-8") as f:
    json.dump(sorted_data, f, indent=2, ensure_ascii=False)

print("Sorted file written to sorted.json")