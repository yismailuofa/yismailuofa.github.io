import { RESOURCES } from "./resources.js";

const tbody = document.getElementById("link-tdbody");

RESOURCES.forEach(({ name, link, author, type }, i) => {
  const tr = document.createElement("tr");
  const cbID = `cb-${i}`;
  tr.innerHTML = `
    <td><input type="checkbox" id="${cbID}" /></td>
    <td><a href="${link}" target="_blank">${name}</a></td>
    <td>${type}</td>
    <td>${author}</td>
  `;

  tbody.appendChild(tr);

  const checkbox = document.getElementById(cbID);
  const savedState = localStorage.getItem(cbID) || false;

  checkbox.checked = savedState;
  checkbox.addEventListener("change", function () {
    this.checked
      ? localStorage.setItem(cbID, true)
      : localStorage.removeItem(cbID);
  });
});
