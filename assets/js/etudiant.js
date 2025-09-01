// Récupérer l'ID de l'étudiant depuis l'URL (ex: etudiant.html?id=etu02)
const params = new URLSearchParams(window.location.search);
const etuId = params.get("id");

// Sélecteur de la zone d'affichage
const container = document.getElementById("etudiant-detail");

// Charger le fichier JSON
fetch("assets/data/etudiants.json")
  .then(response => response.json())
  .then(data => {
    // Trouver l'étudiant correspondant
    const etudiant = data.find(e => e.id === etuId);

    if (!etudiant) {
      container.innerHTML = "<p>⚠️ Étudiant introuvable.</p>";
      return;
    }

    // Construire le HTML
    container.innerHTML = `
      <div class="fiche-etudiant">
        <img src="${etudiant.photo}" alt="Photo de ${etudiant.nom}" class="photo-etudiant">
        <h2>${etudiant.nom}</h2>
        <h3>${etudiant.titre}</h3>
        <p><strong>Directeur :</strong> ${etudiant.directeur}</p>
        <p><strong>Date :</strong> ${etudiant.date} à ${etudiant.heure}</p>
        <p><strong>Salle :</strong> ${etudiant.salle}</p>
        <div class="resume">
          <h4>Résumé</h4>
          <p>${etudiant.resume}</p>
        </div>
        <a href="index.html" class="btn-retour">← Retour à la liste</a>
      </div>
    `;
  })
  .catch(error => {
    console.error("Erreur chargement JSON:", error);
    container.innerHTML = "<p>⚠️ Impossible de charger les données.</p>";
  });
