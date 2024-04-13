import { RESOURCES } from "./resources.js";

const tbody = document.getElementById("link-tdbody");

RESOURCES.forEach(({ name, link, author, type }) => {
  const tr = document.createElement("tr");
  const tdTitle = document.createElement("td");
  const tdAuthor = document.createElement("td");
  const tdType = document.createElement("td");

  tdTitle.innerHTML = `<a href="${link}" target="_blank">${name}</a>`;
  tdAuthor.innerText = author;
  tdType.innerText = type;

  tr.appendChild(tdTitle);
  tr.appendChild(tdType);
  tr.appendChild(tdAuthor);

  tbody.appendChild(tr);
});
