// Entry point for the page neume.html (detail of a single neume)

export async function initNeumePage() {
  const n = new URLSearchParams(location.search).get('n');

  const [neumes, items] = await Promise.all([
    fetch("json/neumes.json").then(r => r.json()),
    fetch("json/items.json").then(r => r.json())
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


  document.getElementById('svg-download').href = `neumes/svg/buranus${neume.n}.svg`;
  document.getElementById('svg-download').setAttribute('download', `${neume.description}.svg`);
  document.getElementById('eps-download').href = `neumes/eps/buranus${neume.n}.svg`;
  document.getElementById('eps-download').setAttribute('download', `${neume.description}.svg`);

  //TODO: find and display matching items

}