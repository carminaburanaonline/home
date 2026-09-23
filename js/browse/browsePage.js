import { XSLtransformById } from '../xml/xslRenderer.js';
import { normalizePunctuation } from '../editorial/normalizePunctuation.js';

export async function renderBrowsePage() {
  const [items, sources, corpus, vocab] = await Promise.all([
    fetch("json/items.json").then(r => r.json()),
    fetch("json/sources.json").then(r => r.json()),
    fetch("json/corpus.json").then(r => r.json()),
    fetch("json/vocabulary.json").then(r => r.json())
  ]);

  /* const wordVocabulary = document.getElementById("word-vocabulary");
  const metreVocabulary = document.getElementById("metre-vocabulary");

  metreVocabulary.replaceChildren();

  for (const metre of vocab.metres) {
    const option = document.createElement("option");
    option.value = metre;
    metreVocabulary.appendChild(option);
  } */

  document.getElementById("search-button").addEventListener("click", () => performSearch(corpus, sources));
}

function getMode(field) {
  return document.querySelector(`input[name="${field}-mode"]:checked`).value;
}

function performSearch(corpus, sources) {
  const results = document.getElementById("search-results");
  results.replaceChildren();
  const xslUrl = "xsl/select_by_id.xsl";

  const queryWord =
    document.getElementById("search-word")
      .value
      .trim()
      .toLowerCase();

  const queryMetre =
    document.getElementById("search-metre")
      .value
      .trim();

  const [wordMode, metreMode] = [getMode("word"), getMode("metre")];
  const singleWords = queryWord.length ? queryWord.split(/\s+/) : [];
  const singleMetres = queryMetre.length ? queryMetre.split(/\s+/) : [];

  for (const item of corpus) {
    const xmlUrl = `tei/${item.id}.tei`;
    const match_ids = [];
    for (const segment of item.segments) {
      let wordMatch = true;
      let text = segment.text;

      if (singleWords.length) {
        switch (wordMode) {
          case "or": wordMatch = singleWords.some(word => text.includes(word)); break;
          case "and": wordMatch = singleWords.every(word => text.includes(word)); break;
          case "phrase": wordMatch = text.includes(queryWord); break;
        }
      }

      let metreMatch = true;
      let metre = segment.metre;

      if (singleMetres.length) {
        switch (metreMode) {
          case "or": metreMatch = singleMetres.some(pattern => metre.includes(pattern)); break;
          case "and": metreMatch = singleMetres.every(pattern => metre.includes(pattern)); break;
          case "phrase": metreMatch = metre.includes(queryMetre); break;
        }
      }

      if (wordMatch && metreMatch) {
        match_ids.push(segment.xml_id);
      }
    }
    if (match_ids.length > 0) {
      results.append(matchElement(item, sources, match_ids));
    }
  }
}

function matchElement(item, sources, match_ids) {
  const itemId = item.id;
  const source = sources.find(s => s.id === item.source);

  const button = document.createElement('button');
  button.id = `showButton-${itemId}`;
  button.textContent = "▶";
  button.classList.add('toggleable', 'toggle-btn');

  const a = document.createElement('a');
  a.href = `item?id=${itemId}`;
  a.textContent = `${item.abstract_item} ${item.title} ${source.rism}`;

  const titleDiv = document.createElement('div');
  titleDiv.append(button, a);

  const snippetDiv = document.createElement('div');
  snippetDiv.id = `snippetDiv-${itemId}`;
  snippetDiv.classList.add('sand-border', 'editorial', 'hidden');

  setupToggle(button, snippetDiv, async (div) => {await fillSnippet(div, `tei/${itemId}.tei`, match_ids); });

  const res = document.createElement('div');
  res.append(titleDiv, snippetDiv);

  return res;
}

function setupToggle(button, snippetDiv, onFirstShow) {
  let loaded = false;

  button.textContent = "▶"; // initial state

  button.addEventListener('click', async () => {
    const isHidden = snippetDiv.classList.contains('hidden');
    snippetDiv.classList.toggle('hidden');

    if (isHidden) {
      button.textContent = "▼";  // expanded

      if (!loaded) {
        await onFirstShow(snippetDiv);
        loaded = true;
      }

    } else {
      button.textContent = "▶";  // collapsed
    }
  });
}

async function fillSnippet(div, xmlUrl, ids) {
  div.textContent = "Loading...";

  const fragments = await Promise.all(
    ids.map(xmlId => XSLtransformById(xmlUrl, "xsl/select_by_id.xsl", xmlId))
  );

  div.innerHTML = '';
  for (const fragment of fragments) {
    div.appendChild(fragment);
  }
  normalizePunctuation(div);
  div.querySelectorAll(".pc[data-resp='ms']").forEach(el => el.classList.add('hidden'));
}