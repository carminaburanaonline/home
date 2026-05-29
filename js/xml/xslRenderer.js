// Native browser XSLT rendering (async, cached)

const xmlCache = new Map();
const xslCache = new Map();

async function loadXML(url) {
  if (xmlCache.has(url)) return xmlCache.get(url);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Cannot load XML: ${url}`);

  const text = await response.text();
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  xmlCache.set(url, doc);
  return doc;
}

async function loadXSL(url) {
  if (xslCache.has(url)) return xslCache.get(url);

  const response = await fetch(url);
  if (!response.ok) throw new Error(`Cannot load XSL: ${url}`);

  const text = await response.text();
  const doc = new DOMParser().parseFromString(text, 'application/xml');
  xslCache.set(url, doc);
  return doc;
}

export async function XSLtransform(xmlUrl, xslUrl) {
  const [xml, xsl] = await Promise.all([
    loadXML(xmlUrl),
    loadXSL(xslUrl)
  ]);

  const processor = new XSLTProcessor();
  processor.importStylesheet(xsl);
  return processor.transformToFragment(xml, document);
}
