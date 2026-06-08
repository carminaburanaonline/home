// Entry point for the page neumes.html (list of neumes)

export async function renderNeumesPage() {
  const neumes = await fetch("json/neumes.json").then(r => r.json());
  neumes.sort(function(a, b) {return b.total_count - a.total_count});

  const table = document.getElementById('neumesTable');

  neumes.forEach(neume => table.appendChild(createRow(neume)));
}

function createRow(neume) {
  const tr = document.createElement('tr');
  const link = `neume?id=${neume.id}`;

  const td1 = document.createElement('td');
  td1.textContent = neume.total_count;

  const td2 = document.createElement('td');
  const imgLink = document.createElement('a');
  imgLink.href = link;
  const img = document.createElement('img');
  img.src = `neumes/svg/buranus${neume.id}.svg`;
  imgLink.append(img);
  td2.append(imgLink);

  const td3 = document.createElement('td');
  const textLink = document.createElement('a');
  textLink.href = link;
  textLink.textContent = neume.description;
  td3.append(textLink);

  tr.append(td1, td2, td3);
  return tr;
}