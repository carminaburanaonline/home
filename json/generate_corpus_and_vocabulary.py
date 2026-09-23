from pathlib import Path
from lxml import etree
import json


def inside_excluded_element(word):
    """
    Exclude words inside apparatus notes or rejected readings.
    """
    for ancestor in word.iterancestors():
        tag = ancestor.tag

        if tag in {"note", "rdg"}:
            return True

    return False


def extract_word(word):
    """
    Reconstruct a word from either:
    <w>veris</w>

    or

    <w>
      <seg type="syll">ve</seg>
      <seg type="syll">ris</seg>
    </w>
    """

    segs = word.xpath(".//seg[@type='syll']")
    segs = [seg for seg in segs if not inside_excluded_element(seg)]

    if segs:
        return "".join((seg.text or "") for seg in segs).strip()

    return "".join(word.itertext()).strip()


def convert_tei(item):
    tei_file = open(f"../tei/{item['id']}.tei", 'r')
    tree = etree.parse(tei_file)
    tei_file.close()

    root = tree.getroot()

    result = {
        "abstract_item": item["abstract_item"],
        "source": item["source"],
        "title": item["title"],
        "foliation": item["foliation"],
        "id": item["id"],
        "segments": []
    }

    segment_counter = 1

    for element in root.xpath(".//lg|.//stage|.//p"):

        xml_id = element.get("{http://www.w3.org/XML/1998/namespace}id")

        met = ""

        if element.get("met"):
            met = element.get("met").replace("/", " ")

        words = []

        for w in element.xpath(".//w"):

            if inside_excluded_element(w):
                continue

            txt = extract_word(w)

            if txt:
                words.append(txt.lower())

        segment_obj = {
            "xml_id": xml_id,
            "text": " ".join(words),
            "metre": met,
        }

        result["segments"].append(segment_obj)

        segment_counter += 1

    return result


###  Generate corpus.json  ###

corpus = []

f = open("../json/items.json", "r")
items = json.load(f)
f.close()

for item in items:
    corpus.append(convert_tei(item))

with open("../json/corpus.json", "w", encoding="utf-8") as f:
    json.dump(
        corpus,
        f,
        ensure_ascii=False,
        indent=2
    )


###  Generate vocabulary.json  ###

words = set()
metres = set()

for item in corpus:

    for segment in item.get("segments", []):
        for word in segment.get("text", []).split(" "):
            words.add(word.lower())

        # metres
        metre = segment.get("metre")
        if metre:
            for m in metre.split(" "):
                metres.add(m)

vocabulary = {
    "words": sorted(words),
    "metres": sorted(metres)
}

with open("vocabulary.json", "w", encoding="utf-8") as f:
    json.dump(
        vocabulary,
        f,
        ensure_ascii=False,
        indent=2
    )

print(f"Words : {len(words)}")
print(f"Metres: {len(metres)}")