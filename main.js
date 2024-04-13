const RESOURCES = "resources.json";

fetch(RESOURCES)
  .then((response) => response.json())
  .then((data) => createRows(data))
  .catch((error) => alert(error));

function createRows(items) {
  const tbody = document.getElementById("link-tdbody");

  items.forEach(({ name, url, author, type }) => {
    const tr = document.createElement("tr");
    const tdTitle = document.createElement("td");
    const tdAuthor = document.createElement("td");
    const tdType = document.createElement("td");

    tdTitle.innerHTML = `<a href="${url}" target="_blank">${name}</a>`;
    tdAuthor.innerText = author;
    tdType.innerText = type;

    tr.appendChild(tdTitle);
    tr.appendChild(tdType);
    tr.appendChild(tdAuthor);

    tbody.appendChild(tr);
  });

  return tbody;
}
