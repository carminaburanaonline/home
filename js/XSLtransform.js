function loadXMLDoc(filename) {
  xhttp = new XMLHttpRequest();
  xhttp.open("GET", filename, false);
  xhttp.send("");
  return xhttp.responseXML;
}

function XSLtransform(xml_file, xsl_file) {
  xml = loadXMLDoc(xml_file);
  xsl = loadXMLDoc(xsl_file);
  xsltProcessor = new XSLTProcessor();
  xsltProcessor.importStylesheet(xsl);
  return xsltProcessor.transformToFragment(xml, document);
}