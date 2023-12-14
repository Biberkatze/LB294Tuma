let rezepte = [];
const authServerUrl = "http://localhost:2941/auth";
const ressourceServerUrl = "http://localhost:2940/api/v1/entities";
const app_element = document.getElementById("app");
const app_el = document.getElementById("app");

// Event-Handler zum Hinzufügen eines Rezepts
const addRezept = function (event) {
  event.preventDefault();
  let title = document.querySelector("input[name='rezept']").value;
  let rezept = { title: title };

  fetch(ressourceServerUrl, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(rezept),
  })
    .then((response) => response.json())
    .then((json) => {
      if (json && json.id) {
        rezept.id = json.id;
        rezepte.push(rezept);
        updateList();

        fetch(ressourceServerUrl)
          .then((response) => response.json())
          .then((data) => {
            rezepte = data;
            updateList();
          })
          .catch((error) => console.error("Fehler beim Abrufen der Daten:", error));
      } else {
        console.error("Unerwartete Serverantwort:", json);
      }
    })
    .catch((error) => console.log(error));
};

// Erstelle ein Formular mit einem Eingabefeld und einem "Speichern"-Button
const createForm = function (parent) {
  const form_el = document.createElement("form");
  const input_el = document.createElement("input");
  input_el.setAttribute("type", "text");
  input_el.setAttribute("name", "rezept");
  const submit_el = document.createElement("input");
  submit_el.setAttribute("type", "submit");
  submit_el.setAttribute("value", "Speichern");

  form_el.appendChild(input_el);
  form_el.appendChild(submit_el);

  parent.appendChild(form_el);
};

// Erstelle eine Liste von Rezepten
const createList = function (parent) {
  const ul_el = document.createElement("ul");

  if (Array.isArray(rezepte)) {
    rezepte.forEach((rezept) => {
      addListElement(rezept, ul_el);
    });
  }

  parent.appendChild(ul_el);
};

// Füge ein Listenelement für ein Rezept hinzu
const addListElement = function (rezept, parent) {
  let li_el = document.createElement("li");
  li_el.classList.add("rezept");
  li_el.innerHTML = rezept.title;

  let deleteButton = document.createElement("button");
  deleteButton.innerText = "Löschen";
  deleteButton.addEventListener("click", () => deleteRezept(rezept.id));

  li_el.appendChild(deleteButton);
  parent.appendChild(li_el);
};

// Aktualisiere die Liste von Rezepten
const updateList = function () {
  const ul_el = document.querySelector("#app ul");
  ul_el.innerHTML = "";

  if (Array.isArray(rezepte)) {
    rezepte.forEach((rezept) => {
      addListElement(rezept, ul_el);
    });
  }
};

// Lösche ein Rezept anhand seiner ID
const deleteRezept = function (id) {
  fetch(`${ressourceServerUrl}/${id}`, {
    method: "DELETE",
  })
    .then(() => {
      rezepte = rezepte.filter((rezept) => rezept.id !== id);
      updateList();
    })
    .catch((error) => console.log(error));
};

// Formular und Liste beim Laden der Seite erstellen
createForm(app_el);
createList(app_el);

// Event-Listener für das Formular hinzufügen
const form_el = document.querySelector("#app form");
form_el.addEventListener("submit", addRezept);
