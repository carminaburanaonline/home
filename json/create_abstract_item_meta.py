#!/usr/bin/env python3

import json

with open("items.json", "r", encoding="utf-8") as f:
    items = json.load(f)

for item in items:
    a = item['abstract_item']
    file = open(f'../html/abstract_items_meta/{a}.html', 'w')
    file.close()
