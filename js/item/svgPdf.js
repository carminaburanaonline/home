/*export async function exportSvgToPdf(itemId) {
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
}*/

const { jsPDF } = window.jspdf;

export async function exportSvgToPdf(itemId, n) {
  const svgFiles = [];
  if (n == 1) {
    svgFiles.push(`img/mzsc/${itemId}.svg`);
  }
  else {
    for (let i = 1; i <= n; i++) {
      svgFiles.push(`img/mzsc/${itemId}-${i}.svg`);
    }
  }

  console.log(svgFiles.length);

  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4"
  });

  for (let i = 0; i < svgFiles.length; i++) {
    if (i > 0) pdf.addPage();

    const response = await fetch(svgFiles[i]);
    if (!response.ok) {
      throw new Error(`Could not load ${svgFiles[i]}`);
    }

    const svgText = await response.text();
    const parsed = new DOMParser().parseFromString(
      svgText, "image/svg+xml"
    );

    if (parsed.querySelector("parsererror")) {
      throw new Error(`Invalid SVG: ${svgFiles[i]}`);
    }

    const svg = parsed.documentElement;
    const vb = svg.viewBox.baseVal;

    if (!vb.width || !vb.height) {
      throw new Error(`SVG needs a valid viewBox: ${svgFiles[i]}`);
    }

    const scale = Math.min(190 / vb.width, 277 / vb.height);
    const width = vb.width * scale;
    const height = vb.height * scale;

    await pdf.svg(svg, {
      x: (210 - width) / 2,
      y: (297 - height) / 2,
      width,
      height
    });
  }

  pdf.save(`${itemId}.pdf`);
}
