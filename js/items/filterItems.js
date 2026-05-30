// Making the search input work

function filterItems() {
  let filter = document
    .getElementById("searchInput")
    .value.toLowerCase();

  document.querySelectorAll("tr:not(.head)").forEach(tr => {
    const txt = Array.from(tr.querySelectorAll("td")).map(td => td.textContent).join("|").toLowerCase();
    tr.classList.toggle("hidden", !txt.includes(filter));
  });
}