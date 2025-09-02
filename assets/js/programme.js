const tableBody = document.querySelector("#programmeTable tbody");
const directeurSelect = document.getElementById("directeurSelect");
const headers = document.querySelectorAll("#programmeTable th[data-col]");

let allEtudiants = [];
let ordreTri = {}; // état du tri (asc/desc)

// Charger le fichier JSON
fetch("assets/data/etudiants.json")
  .then(response => response.json())
  .then(data => {
    // Trier par date et heure par défaut
    allEtudiants = data.sort((a, b) => {
      return new Date(`${a.date}T${a.heure}`) - new Date(`${b.date}T${b.heure}`);
    });

    // Construire la liste des directeurs distincts
    const directeursUniques = [...new Set(allEtudiants.map(e => e.directeur))];
    directeursUniques.forEach(directeur => {
      const opt = document.createElement("option");
      opt.value = directeur;
      opt.textContent = directeur;
      directeurSelect.appendChild(opt);
    });

    afficherProgramme(allEtudiants);
  })
  .catch(error => {
    console.error("Erreur chargement JSON:", error);
    tableBody.innerHTML = `<tr><td colspan="7">⚠️ Impossible de charger le programme.</td></tr>`;
  });

// Fonction pour afficher le programme
function afficherProgramme(etudiants) {
  tableBody.innerHTML = "";

  if (etudiants.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="7">Aucune soutenance prévue.</td></tr>`;
    return;
  }

  etudiants.forEach(e => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${e.nom}</td>
      <td>${e.titre}</td>
      <td>${e.directeur}</td>
      <td>${new Date(e.date).toLocaleDateString("fr-FR")}</td>
      <td>${e.heure}</td>
      <td>${e.salle}</td>
      <td><a href="etudiant.html?id=${e.id}">Voir</a></td>
    `;
    tableBody.appendChild(tr);
  });
}

// Filtrer par directeur
directeurSelect.addEventListener("change", () => {
  const valeur = directeurSelect.value;
  if (valeur === "all") {
    afficherProgramme(allEtudiants);
  } else {
    const filtres = allEtudiants.filter(e => e.directeur === valeur);
    afficherProgramme(filtres);
  }
});

// ===== Tri dynamique =====
headers.forEach(header => {
  header.addEventListener("click", () => {
    const col = header.dataset.col;

    // Inverser ordre si déjà trié
    ordreTri[col] = ordreTri[col] === "asc" ? "desc" : "asc";

    let sorted = [...allEtudiants].sort((a, b) => {
      let valA = a[col];
      let valB = b[col];

      if (col === "date") {
        valA = new Date(a.date);
        valB = new Date(b.date);
      }

      if (valA < valB) return ordreTri[col] === "asc" ? -1 : 1;
      if (valA > valB) return ordreTri[col] === "asc" ? 1 : -1;
      return 0;
    });

    afficherProgramme(sorted);

    // Indiquer visuellement le tri
    headers.forEach(h => h.textContent = h.textContent.replace("▲", "⬍").replace("▼", "⬍"));
    header.textContent = header.textContent.replace("⬍", ordreTri[col] === "asc" ? "▲" : "▼");
  });
});
