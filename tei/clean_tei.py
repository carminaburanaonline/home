#!/usr/bin/env python3

# Generic program to handle large corrections/updates/modifications of TEI files

import lxml.etree as ET
import itertools

import os
import argparse

if __name__ == "__main__":
	parser = argparse.ArgumentParser()
	parser.add_argument('--f', nargs='+')
	parser.add_argument('--all', action='store_true', default=False)
	args = parser.parse_args()

	filenames = []

	if args.all:
		filenames = [file for file in os.listdir(".") if file.endswith(".tei")]
	else:
		filenames = [name + ".tei" for name in args.f]

	for name in filenames:
		tei_file = open(name, 'r')
		tree = ET.parse(tei_file)
		tei_file.close()

		# Add core code modifying the tree here!
		#####
		#####

		for poem in tree.findall(".//div[@type='poem']"):
			poem_met = poem.get("met")
			if poem_met is not None:
				for lg in poem.findall('./lg'):
					if "met" not in lg.attrib:
						lg.set("met", poem_met)
			poem_rhyme = poem.get("rhyme")
			if poem_rhyme is not None:
				for lg in poem.findall('./lg'):
					if "rhyme" not in lg.attrib:
						lg.set("rhyme", poem_met)

		#####
		#####

		tree.write(name)
		#tree.write("test_" + name)
