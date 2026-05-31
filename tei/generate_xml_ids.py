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

		for k, lg in enumerate(tree.findall(".//lg")):
			id = "-".join([name[:-4], "lg", f"{k + 1}"])
			lg.set("{http://www.w3.org/XML/1998/namespace}id", id)
		for k, l in enumerate(tree.findall(".//l")):
			id = "-".join([name[:-4], "l", f"{k + 1}"])
			l.set("{http://www.w3.org/XML/1998/namespace}id", id)
		for k, p in enumerate(tree.findall(".//p")):
			id = "-".join([name[:-4], "p", f"{k + 1}"])
			p.set("{http://www.w3.org/XML/1998/namespace}id", id)

		#####
		#####

		tree.write(name)
		#tree.write("test_" + name)
