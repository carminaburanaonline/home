#!/usr/bin/env python3

# Generate xml:id in a systematic way for the TEI files

import lxml.etree as ET
import itertools

import os
import argparse

if __name__ == "__main__":
	filenames = [file for file in os.listdir(".") if file.endswith(".tei")]

	for name in filenames:
		tei_file = open(name, 'r')
		tree = ET.parse(tei_file)
		tei_file.close()

		# Add core code modifying the tree here!
		#####
		#####

		tags = ['lg', 'l', 'p', 'sp', 'stage']

		for tag in tags:
			for k, element in enumerate(tree.findall(".//" + tag)):
				id = "-".join([name[:-4], tag, f"{k + 1}"])
				element.set("{http://www.w3.org/XML/1998/namespace}id", id)

		#####
		#####

		tree.write(name)
		#tree.write("test_" + name)
