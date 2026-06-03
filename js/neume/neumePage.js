// Entry point for the page neume.html (detail of a single neume)

import { normalizePunctuation } from '../editorial/normalizePunctuation.js';

export async function initNeumePage() {
  const neumeId = new URLSearchParams(location.search).get('id');

  const [neumes, items, sources] = await Promise.all([
    fetch("json/neumes.json").then(r => r.json()),
    fetch("json/items.json").then(r => r.json()),
    fetch("json/sources.json").then(r => r.json())
  ]);
  const neume = neumes.find(neume => neume.id == neumeId);

  // Description
  document.getElementById('description').innerHTML = `
    <h3>${neume.description}</h3>
    <img src='neumes/svg/buranus${neume.id}.svg' style="width: 40px; height: auto;" />`;
  if (neume.total_count > 1) {
    document.getElementById('description').innerHTML += `<p>${neume.total_count} total occurrences</p>`;
  }
  else {
    document.getElementById('description').innerHTML += "<p>Only one occurrence</p>";
  }

  document.getElementById('svgDownload').href = `neumes/svg/buranus${neume.id}.svg`;
  document.getElementById('svgDownload').setAttribute('download', `${neume.description}.svg`);
  document.getElementById('epsDownload').href = `neumes/eps/buranus${neume.id}.svg`;
  document.getElementById('epsDownload').setAttribute('download', `${neume.description}.svg`);

  const container = document.getElementById('snippetsContainer')
  neume.locations.forEach(location => {
    container.appendChild(locationElement(neumeId, location, items, sources));
  })
}

function locationElement(neumeId, location, items, sources) {
  const itemId = location.file;
  const count = location.count;
  const item = items.find(i => i.id == itemId);
  const source = sources.find(s => s.id == item.source);

  const button = document.createElement('button');
  button.id = `showButton-${itemId}`;
  button.textContent = "▶";
  button.classList.add('toggleable', 'toggle-btn');

  const a = document.createElement('a');
  a.href = `item?id=${itemId}`;
  a.textContent = `${item.abstract_item} ${item.title} ${source.rism}`;

  const countSpan = document.createElement('span');
  countSpan.textContent = ` (${location.count})`;

  const titleDiv = document.createElement('div');
  titleDiv.append(button, a, countSpan);

  const snippetDiv = document.createElement('div');
  snippetDiv.id = `snippetDiv-${itemId}`;
  snippetDiv.classList.add('sand-border', 'editorial', 'hidden');

  setupToggle(button, snippetDiv, async (div) => {await fillSnippet(div, `${itemId}.tei`, neumeId); });

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

async function fillSnippet(div, file, neumeId) {
  div.textContent = "Loading...";

  const fragment = await transformTEI(file, "xsl/neume-detail.xsl", neumeId);

  div.innerHTML = '';
  div.appendChild(fragment);
  normalizePunctuation(div);
  div.querySelectorAll(".pc[data-resp='ms']").forEach(el => el.classList.add('hidden'));
}


async function transformTEI(file, xsltUrl, neumeId) {
  // fetch XML
  const xmlText = await fetch(`tei/${file}`).then(r => r.text());
  const xmlDoc = new DOMParser().parseFromString(xmlText, "text/xml");

  // fetch XSLT
  const xsltText = await fetch(xsltUrl).then(r => r.text());
  const xsltDoc = new DOMParser().parseFromString(xsltText, "text/xml");

  // create processor
  const processor = new XSLTProcessor();
  processor.importStylesheet(xsltDoc);

  // pass parameter (important!)
  processor.setParameter(null, "n", neumeId);

  // transform
  return processor.transformToFragment(xmlDoc, document);
}