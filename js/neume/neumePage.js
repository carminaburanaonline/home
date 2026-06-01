// Entry point for the page neume.html (detail of a single neume)

import { normalizePunctuation } from '../editorial/normalizePunctuation.js';

export async function initNeumePage() {
  const n = new URLSearchParams(location.search).get('n');

  const [neumes, items, sources] = await Promise.all([
    fetch("json/neumes.json").then(r => r.json()),
    fetch("json/items.json").then(r => r.json()),
    fetch("json/sources.json").then(r => r.json())
  ]);
  const neume = neumes.find(neume => neume.n == n);

  // Description
  document.getElementById('description').innerHTML = `
    <h3>${neume.description}</h3>
    <img src='neumes/svg/buranus${neume.n}.svg' style="width: 40px; height: auto;" />`;
  if (neume.total_count > 1) {
    document.getElementById('description').innerHTML += `<p>${neume.total_count} total occurrences</p>`;
  }
  else {
    document.getElementById('description').innerHTML += "<p>Only one occurrence</p>";
  }


  document.getElementById('svgDownload').href = `neumes/svg/buranus${neume.n}.svg`;
  document.getElementById('svgDownload').setAttribute('download', `${neume.description}.svg`);
  document.getElementById('epsDownload').href = `neumes/eps/buranus${neume.n}.svg`;
  document.getElementById('epsDownload').setAttribute('download', `${neume.description}.svg`);

  const container = document.getElementById('snippetsContainer')
  neume.locations.forEach(location => {
    container.appendChild(locationElement(n, location, items, sources));
  })
}

function locationElement(n, location, items, sources) {
  const itemId = location.file;
  const count = location.count;
  const item = items.find(i => i.file == itemId);
  const source = sources.find(s => s.pk == item.source);

  const a = document.createElement('a');
  a.href = `item?id=${itemId}`;
  a.textContent = `${item.abstract_item} ${item.title} ${source.bib_id}`;
  const button = document.createElement('button');
  button.id = `showButton-${itemId}`;
  button.classList.add('toggleable');
  button.textContent = "↓";
  const titleDiv = document.createElement('div');
  titleDiv.append(a)
  titleDiv.innerHTML += ` (${location.count}) `;
  titleDiv.append(button);

  const snippetDiv = document.createElement('div');
  snippetDiv.id = `snippetDiv-${itemId}`;
  snippetDiv.classList.add('sand-border', 'editorial');
  snippetDiv.classList.toggle('hidden');

  setupToggle(button, snippetDiv, async (div) => {await fillSnippet(div, `${itemId}.tei`, n); });

  const res = document.createElement('div');
  res.append(titleDiv, snippetDiv);

  return res;
}

function setupToggle(button, snippetDiv, onFirstShow) {
  let loaded = false;

  button.textContent = "↓"; // initial state

  button.addEventListener('click', async () => {
    const isHidden = snippetDiv.classList.contains('hidden');

    if (isHidden) {
      snippetDiv.classList.remove('hidden');
      button.textContent = "↑";  // expanded

      if (!loaded) {
        await onFirstShow(snippetDiv);
        loaded = true;
      }

    } else {
      snippetDiv.classList.add('hidden');
      button.textContent = "↓";  // collapsed
    }
  });
}

async function fillSnippet(div, file, n) {
  div.textContent = "Loading...";

  const fragment = await transformTEI(file, "xsl/neume-detail.xsl", n);
  console.log(fragment);

  div.innerHTML = '';
  div.appendChild(fragment);
  normalizePunctuation(div);
  div.querySelectorAll(".pc[data-resp='ms']").forEach(el => el.classList.add('hidden'));
}


async function transformTEI(file, xsltUrl, n) {
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
  processor.setParameter(null, "n", n);

  // transform
  return processor.transformToFragment(xmlDoc, document);
}