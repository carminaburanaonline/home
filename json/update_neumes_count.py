#!/usr/bin/env python3

import lxml.etree as ET
import os
import json


def counter_tei(N):
    filenames = [file for file in os.listdir("../tei") if file.endswith(".tei")]
    filenames = [name for name in filenames if not name.endswith("_PB.tei")]

    counter = {}
    for n in range(1, N + 1):
        counter[f"{n}"] = 0

    for name in filenames:
        tei_file = open("../tei/" + name, 'r')
        tree = ET.parse(tei_file)
        tei_file.close()
        neumes = tree.findall(".//neume")
        for neume in neumes:
            n = neume.attrib["glyph.num"]
            if n != '0':
                counter[n] += 1

    return counter


def update_neumes_count(neumes):
    counter = counter_tei(len(neumes))

    for neume in neumes:
        neume['count'] = counter[f"{neume['n']}"]
    return neumes


with open("neumes.json", "r", encoding="utf-8") as f:
    neumes = json.load(f)

updated_neumes = update_neumes_count(neumes)

with open("neumes.json", "w", encoding="utf-8") as f:
    json.dump(updated_neumes, f, indent=2, ensure_ascii=False)
