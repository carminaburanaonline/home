// Entry point for the page neumes.html (list of neumes)

export async function initSourcesPage() {
  const sources = await fetch("json/sources_normalized.json").then(r => r.json());

}