#!/usr/bin/env python3

import lxml.etree as ET
import os
import json


def update_locations(neumes, locator):
	for neume in neumes:
		n = neume['n']
		locations = locator[f"{n}"]

	# Group by file

def locator_tei(N):
	filenames = [file for file in os.listdir("../tei") if file.endswith(".tei")]
	filenames = [name for name in filenames if not name.endswith("_PB.tei")]

	locator = {}
	for n in range(1, N + 1):
		locator[f"{n}"] = []

	for name in filenames:
		local_list = {}
		local_counter = {f"{n}": 0 for n in range(1, N + 1)}

		tei_file = open("../tei/" + name, 'r')
		tree = ET.parse(tei_file)
		tei_file.close()
		neumes = tree.findall(".//neume")
		for neume in neumes:
			n = neume.attrib["glyph.num"]
			if n != '0':
				local_counter[n] += 1
				location = neume.xpath(".//ancestor::l|.//ancestor::p")
				assert len(location) == 1, f"Location wrong in file {name}, neume number {n}"
				id = location[0].attrib['{http://www.w3.org/XML/1998/namespace}id']
				if n in local_list.keys():
					if id != local_list[n][-1]:
						local_list[n].append(id)
				else:
					local_list[n] = [id]

		for n in local_list.keys():
			locator[n].append({'file': name[:-4], 'count': local_counter[n], 'ids': local_list[n]})

	for n in locator.keys():
		locator[n].sort(key=lambda x: x['count'], reverse=True)
	return locator


with open("neumes.json", "r", encoding="utf-8") as f:
	neumes = json.load(f)

locator = locator_tei(len(neumes))

for neume in neumes:
	neume['locations'] = locator[f"{neume['n']}"]

with open("neumes.json", "w", encoding="utf-8") as f:
	json.dump(neumes, f, indent=2, ensure_ascii=False)
