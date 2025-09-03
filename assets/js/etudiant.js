// Récupérer l'ID de l'étudiant depuis l'URL (ex: etudiant.html?id=etu02)
const params = new URLSearchParams(window.location.search);
const etuId = params.get("id");

// Sélecteur de la zone d'affichage
const container = document.getElementById("etudiant-detail");

// Charger le fichier JSON
fetch("assets/data/etudiants.json")
  .then(response => {
    if (!response.ok) {
      throw new Error("Erreur HTTP " + response.status);
    }
    return response.json();
  })
  .then(data => {
    // Trouver l'étudiant correspondant
    const etudiant = data.find(e => e.id === etuId);

    if (!etudiant) {
      container.innerHTML = "<p>⚠️ Étudiant introuvable.</p>";
      return;
    }

    // Image de fallback si manquante
    const photo = etudiant.photo && etudiant.photo.trim() !== "" 
      ? etudiant.photo 
      : "assets/img/default-profile.png";

    // Construire le HTML
    container.innerHTML = `
      <div class="fiche-etudiant">
        <img src="${photo}" alt="Photo de ${etudiant.nom}" class="photo-etudiant">
        <h2>${etudiant.nom}</h2>
        <h3>${etudiant.titre || "Titre non renseigné"}</h3>
        <p><strong>Directeur :</strong> ${etudiant.directeur || "Non renseigné"}</p>
        <p><strong>Date :</strong> ${etudiant.date || "—"} ${etudiant.heure ? "à " + etudiant.heure : ""}</p>
        <p><strong>Salle :</strong> ${etudiant.salle || "Non précisée"}</p>
        <div class="resume">
          <h4>Résumé</h4>
          <p>${etudiant.resume && etudiant.resume.trim() !== "" ? etudiant.resume : "Résumé non disponible."}</p>
        </div>
        <a href="index.html" class="btn-retour">← Retour à la liste</a>
      </div>
    `;
  })
  .catch(error => {
    console.error("Erreur chargement JSON:", error);
    container.innerHTML = "<p>⚠️ Impossible de charger les données.</p>";
  });
