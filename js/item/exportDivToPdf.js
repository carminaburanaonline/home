export function exportDivToPdf(div, filename) {
  var opt = {
    margin: [17, 15, 16, 15],
    filename: filename,
    pagebreak: { mode: 'css', avoid: '.lg-heading' },
    image: { type: 'jpeg', quality: 1 },
    html2canvas: { scrollY: 0, y: 0, scale: 4, letterRendering: true }
  };
  //html2pdf().set(headOpt).from(pdfHead).toPdf().get('pdf').then(function (pdf) {
  //  pdf.addPage();
  //}).set(opt).from(div).toContainer().toCanvas().toPdf().save();
  html2pdf().set(opt).from(div).toContainer().toCanvas().toPdf().save();
}
