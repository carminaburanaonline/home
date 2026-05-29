export async function initMirador(item, source) {

  const msImage = document.getElementById("msImage");
  if (!msImage) {
    console.error("msImage container not found");
    return;
  }

  // If no manifest: link to images, or images not available

  if (!source.IIIF_manifest.length) {
    if (item.alternative_img_link.length) {

      const wrapper = document.createElement("span");
      wrapper.innerHTML = `
        Unable to display manuscript images due to copyright restrictions.
        <a target="_blank" href="${item.alternative_img_link}">
          <i class="fa fa-arrow-right" style="margin-right: 5px;"></i>
          Open external website.
        </a>
      `;
      msImage.appendChild(wrapper);

    } else {
      msImage.appendChild(
        document.createTextNode("Manuscript images not available for this item.")
      );
    }

    return; // No Mirador init if no manifest
  }

  // Create Mirador container
  const div = document.createElement("div");
  div.id = "mirador";
  div.style.position = "relative";
  div.style.width = "100%";
  div.style.height = "1000px";
  msImage.appendChild(div);

  // MIRADOR LOGIC

  var source_manifest = source.IIIF_manifest;
  var canvasIndex = item.IIIF_canvasIndex;
  var canvasId = item.IIIF_canvasId;
  var mirador_windows = [];

  if (canvasIndex.length) {
    mirador_windows = [
      {
        manifestId: source_manifest,
        canvasIndex: canvasIndex
      }
    ];
  } else {
    mirador_windows = [
      {
        manifestId: source_manifest,
        canvasId: canvasId
      }
    ];
  }

  Mirador.viewer({
    id: "mirador",
    selectedTheme: 'light',
    window: {
      defaultView: "single",
      views: [
        { key: "single", behaviors: ["individuals", "paged"] },
        { key: "book", behaviors: ["individuals"] },
        { key: "scroll", behaviors: ["continuous"] },
        { key: "gallery" }
      ]
    },
    windows: mirador_windows
  });
}
``