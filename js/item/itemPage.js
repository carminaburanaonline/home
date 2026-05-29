// Entry point for the page item.html

import { renderItemMetadata } from './itemMetadata.js';
import { SVGitemCoreView, itemCoreView } from './itemCoreView.js';
import { initItemSiblings } from './itemSiblings.js';
import { initTabs } from '../ui/tabs.js';
import { initResizer } from '../ui/resizer.js';
import { initMirador } from './initMirador.js';
import { XSLtransform } from '../xml/xslRenderer.js';
import { normalizeVerseNumbers } from '../editorial/verseNumbers.js';
import { exportSvgToPdf } from './svgPdf.js';
import { exportDivToPdf } from './exportDivToPdf.js';
import { indentVersesFromDataIndent } from '../editorial/indentVerses.js'

export async function initItemPage() {
  const itemId = new URLSearchParams(location.search).get('id');

  const [items, sources] = await Promise.all([
    fetch("json/items.json").then(r => r.json()),
    fetch("json/sources.json").then(r => r.json())
  ]);

  const item = items.find(i => i.file == itemId);
  const source = sources.find(s => s.pk == item.source);

  // Item metadata
  renderItemMetadata(document.getElementById('metadata'), item, source);

  // Main item tab
  if (item.SVGfiles) {
    SVGitemCoreView(document.getElementById('itemLeft'), item);
  } else {
    itemCoreView(document.getElementById('itemLeft'), item);
  }

  // Create table of items on the right tab
  initItemSiblings({
    tableContainer: document.getElementById('itemsTable'),
    titleContainer: document.getElementById('itemRightTitleDiv'),
    selectedContainer: document.getElementById('selectedItemRight'),
    itemId,
    openItem: item => itemCoreView(document.getElementById('selectedItemRight'), item)
  });

  // Restore itemRightTable when itemRightButton is clicked
  document.getElementById('itemRightButton').addEventListener('click', e => {
    document.getElementById('itemRightTitleDiv').style.display = 'none';
    document.getElementById('selectedItemRight').style.display = 'none';
    document.getElementById('itemsTable').style.display = 'block';
  });

  initResizer({ resizerId: 'dragResizer' });

  initTabs({
    tabSelector: '.tablinks',
    panelSelector: '.tabcontent.right',
    defaultTabId: 'defaultOpenRight'
  });

  // Mirador tab
  initMirador(item, source);

  // French translation
  const container = document.getElementById("translation")
  container.append(await XSLtransform(`tei/${itemId}_PB.tei`, "xsl/french-translation.xsl"));
  indentVersesFromDataIndent(container);
  normalizeVerseNumbers(container, 5);

  // Setting filename and path for download options
  document.getElementById("tei-download").setAttribute("href", `tei/${itemId}.tei`);
  document.getElementById("tei-download").setAttribute("download", `${itemId}.tei`);
  document.getElementById("html-download").setAttribute("href", `html/${itemId}.html`);
  document.getElementById("html-download").setAttribute("download", `${itemId}.html`);
  document.getElementById("tei-download-french").setAttribute("href", `tei/${itemId}_PB.tei`);
  document.getElementById("tei-download-french").setAttribute("download", `${itemId}_french.tei`);
  document.getElementById("html-download-french").setAttribute("href", `html/${itemId}_PB.html`);
  document.getElementById("html-download-french").setAttribute("download", `${itemId}_french.html`);

  // PDF download for the main item
  if (item.SVGfiles) {
    document.getElementById("pdf-download").addEventListener("click", () => {
      exportSvgToPdf(itemId);
    });
  } else {
    document.getElementById("pdf-download").addEventListener("click", () => {
      exportDivToPdf(document.querySelector(`#mainContainer-${itemId}`), `${itemId}.pdf`);
    });
  }

  // PDF download for the french translation
  document.getElementById("pdf-download-french").addEventListener("click", () => {
      exportDivToPdf(document.querySelector("#translation"), `${itemId}-french.pdf`);
    });
}
