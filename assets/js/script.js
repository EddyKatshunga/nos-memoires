// Sélecteurs
const listeEtudiants = document.getElementById("liste-etudiants");
const searchInput = document.getElementById("searchInput");

// Charger le fichier JSON
let allEtudiants = [];

fetch("assets/data/etudiants.json")
  .then(response => response.json())
  .then(data => {
    allEtudiants = data;
    afficherEtudiants(allEtudiants);
  })
  .catch(error => {
    console.error("Erreur chargement JSON:", error);
    listeEtudiants.innerHTML = "<p>⚠️ Impossible de charger les étudiants.</p>";
  });

// Fonction pour afficher la liste
function afficherEtudiants(etudiants) {
  listeEtudiants.innerHTML = ""; // Reset

  if (etudiants.length === 0) {
    listeEtudiants.innerHTML = "<p>Aucun étudiant trouvé.</p>";
    return;
  }

  etudiants.forEach(etudiant => {
    const card = document.createElement("div");
    card.classList.add("carte-etudiant");

    card.innerHTML = `
      <img src="${etudiant.photo}" alt="Photo de ${etudiant.nom}">
      <h3>${etudiant.nom}</h3>
      <p class="titre">${etudiant.titre}</p>
      <a href="etudiant.html?id=${etudiant.id}" class="btn-detail">Voir la fiche</a>
    `;

    listeEtudiants.appendChild(card);
  });
}

// Filtrage en temps réel
searchInput.addEventListener("input", () => {
  const valeur = searchInput.value.toLowerCase();
  const filtres = allEtudiants.filter(e =>
    e.nom.toLowerCase().includes(valeur) ||
    e.titre.toLowerCase().includes(valeur)
  );
  afficherEtudiants(filtres);
});
