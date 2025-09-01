const tableBody = document.querySelector("#programmeTable tbody");
const jourSelect = document.getElementById("jourSelect");
let allEtudiants = [];

// Charger le fichier JSON
fetch("assets/data/etudiants.json")
  .then(response => response.json())
  .then(data => {
    // Trier par date et heure
    allEtudiants = data.sort((a, b) => {
      return new Date(`${a.date}T${a.heure}`) - new Date(`${b.date}T${b.heure}`);
    });

    // Construire la liste des jours distincts
    const joursUniques = [...new Set(allEtudiants.map(e => e.date))];
    joursUniques.forEach(date => {
      const opt = document.createElement("option");
      opt.value = date;
      opt.textContent = new Date(date).toLocaleDateString("fr-FR", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
      });
      jourSelect.appendChild(opt);
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
    tableBody.innerHTML = `<tr><td colspan="7">Aucune soutenance prévue ce jour.</td></tr>`;
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

// Filtrer par jour
jourSelect.addEventListener("change", () => {
  const valeur = jourSelect.value;
  if (valeur === "all") {
    afficherProgramme(allEtudiants);
  } else {
    const filtres = allEtudiants.filter(e => e.date === valeur);
    afficherProgramme(filtres);
  }
});


const headers = document.querySelectorAll("#programmeTable th[data-col]");
let ordreTri = {}; // Pour garder l’état du tri (asc/desc)

// Charger le fichier JSON
fetch("assets/data/etudiants.json")
  .then(response => response.json())
  .then(data => {
    // Trier par date et heure par défaut
    allEtudiants = data.sort((a, b) => {
      return new Date(`${a.date}T${a.heure}`) - new Date(`${b.date}T${b.heure}`);
    });

    // Construire la liste des jours distincts
    const joursUniques = [...new Set(allEtudiants.map(e => e.date))];
    joursUniques.forEach(date => {
      const opt = document.createElement("option");
      opt.value = date;
      opt.textContent = new Date(date).toLocaleDateString("fr-FR", {
        weekday: "long", year: "numeric", month: "long", day: "numeric"
      });
      jourSelect.appendChild(opt);
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
    tableBody.innerHTML = `<tr><td colspan="7">Aucune soutenance prévue ce jour.</td></tr>`;
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

// Filtrer par jour
jourSelect.addEventListener("change", () => {
  const valeur = jourSelect.value;
  if (valeur === "all") {
    afficherProgramme(allEtudiants);
  } else {
    const filtres = allEtudiants.filter(e => e.date === valeur);
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

      // Gérer les dates et heures correctement
      if (col === "date") {
        valA = new Date(a.date);
        valB = new Date(b.date);
      }
      if (col === "heure") {
        valA = a.heure;
        valB = b.heure;
      }

      if (valA < valB) return ordreTri[col] === "asc" ? -1 : 1;
      if (valA > valB) return ordreTri[col] === "asc" ? 1 : -1;
      return 0;
    });

    afficherProgramme(sorted);

    // Mettre en évidence l’ordre du tri (flèche ↑ ou ↓)
    headers.forEach(h => h.textContent = h.textContent.replace("▲", "⬍").replace("▼", "⬍"));
    header.textContent = header.textContent.replace("⬍", ordreTri[col] === "asc" ? "▲" : "▼");
  });
});
