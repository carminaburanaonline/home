export async function exportSvgToPdf(itemId) {
  const { jsPDF } = window.jspdf;

  const container = document.querySelector(`#svg-${itemId}`);
  if (!container) {
    console.error("SVG container not found");
    return;
  }

  const svgs = container.querySelectorAll("svg");

  if (!svgs.length) {
    console.warn("No SVG elements found");
    return;
  }

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  const pageWidth = pdf.internal.pageSize.getWidth();
  const pageHeight = pdf.internal.pageSize.getHeight();

  const DPI_SCALE = 2;   // adjust (3–6 recommended)

  for (let i = 0; i < svgs.length; i++) {
    const originalSvg = svgs[i];

    // Clone SVG so we don't affect UI
    const svg = originalSvg.cloneNode(true);

    // Remove problematic responsive sizing
    svg.removeAttribute("width");
    svg.removeAttribute("height");

    // Serialize SVG
    const svgData = new XMLSerializer().serializeToString(svg);

    const blob = new Blob([svgData], { type: "image/svg+xml;charset=utf-8" });
    const url = URL.createObjectURL(blob);

    const img = new Image();

    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
      img.src = url;
    });

    // High-resolution canvas
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");

    const width = img.width;
    const height = img.height;

    canvas.width = width * DPI_SCALE;
    canvas.height = height * DPI_SCALE;

    ctx.scale(DPI_SCALE, DPI_SCALE);

    // White background (important!)
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.drawImage(img, 0, 0, width, height);

    const imgData = canvas.toDataURL("image/jpeg", 1.0);

    // Fit to PDF page
    const imgRatio = width / height;
    const pageRatio = pageWidth / pageHeight;

    let renderWidth, renderHeight;

    if (imgRatio > pageRatio) {
      renderWidth = pageWidth;
      renderHeight = pageWidth / imgRatio;
    } else {
      renderHeight = pageHeight;
      renderWidth = pageHeight * imgRatio;
    }

    const x = (pageWidth - renderWidth) / 2;
    const y = (pageHeight - renderHeight) / 2;

    if (i > 0) pdf.addPage();

    pdf.addImage(imgData, "JPEG", x, y, renderWidth, renderHeight);

    URL.revokeObjectURL(url);
  }

  pdf.save(`${itemId}.pdf`);
}
``