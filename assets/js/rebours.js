// Ajoutons cette fonction pour démarrer le compte à rebours
function startCountdown(dateStr, heureStr) {
  const countdownEl = document.getElementById("countdown");

  // Fusionner date + heure en un seul objet Date
  const targetDate = new Date(`${dateStr}T${heureStr}:00`);

  function updateCountdown() {
    const now = new Date();
    const diff = targetDate - now;

    if (diff <= 0) {
      countdownEl.innerHTML = "<strong>🚀 C’est parti, la première soutenance commence !</strong>";
      clearInterval(timer);
      return;
    }

    const jours = Math.floor(diff / (1000 * 60 * 60 * 24));
    const heures = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const secondes = Math.floor((diff / 1000) % 60);

    countdownEl.innerHTML = `
      <span>${jours}j</span> :
      <span>${heures}h</span> :
      <span>${minutes}m</span> :
      <span>${secondes}s</span>
    `;
  }

  updateCountdown(); // Initialisation immédiate
  const timer = setInterval(updateCountdown, 1000);
}

// === Modification après chargement JSON ===
fetch("assets/data/etudiants.json")
  .then(response => response.json())
  .then(data => {
    allEtudiants = data;

    // 1) Trier par date et heure pour trouver la plus proche
    const sorted = [...allEtudiants].sort((a, b) => {
      return new Date(`${a.date}T${a.heure}`) - new Date(`${b.date}T${b.heure}`);
    });

    if (sorted.length > 0) {
      startCountdown(sorted[0].date, sorted[0].heure);
    }

    // 2) Afficher la liste des étudiants
    afficherEtudiants(allEtudiants);
  })
  .catch(error => {
    console.error("Erreur chargement JSON:", error);
    listeEtudiants.innerHTML = "<p>⚠️ Impossible de charger les étudiants.</p>";
  });
