document.addEventListener("DOMContentLoaded", () => {
  const leadersGrid = document.getElementById("leadersGrid");
  if (!leadersGrid) return;

  const searchBar = document.getElementById("searchBar");
  const clearSearch = document.getElementById("clearSearch");
  const filterNav = document.getElementById("filterNav");
  const sortSelect = document.getElementById("sortSelect");
  const favoritesToggle = document.getElementById("favoritesToggle");
  const resetFilters = document.getElementById("resetFilters");
  const resultCount = document.getElementById("resultCount");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  let allLeaders = [];
  let activeCategory = "all";
  let favoritesOnly = false;
  let favorites = JSON.parse(localStorage.getItem("leaderFavorites") || "[]");

  fetch("js/data.json")
    .then(response => {
      if (!response.ok) throw new Error(`Unable to load leader data (${response.status})`);
      return response.json();
    })
    .then(data => {
      allLeaders = data;
      renderLeaders();
      setupListeners();
    })
    .catch(error => {
      console.error("Error fetching leader data:", error);
      resultCount.textContent = "Leader data could not be loaded.";
      leadersGrid.innerHTML = '<p class="empty-state">Please refresh the page or check the local data file.</p>';
    });

  function getVisibleLeaders() {
    const searchTerm = searchBar.value.trim().toLowerCase();
    let visible = allLeaders.filter(leader => {
      const searchableText = `${leader.name} ${leader.category} ${leader.bio}`.toLowerCase();
      const matchesSearch = !searchTerm || searchableText.includes(searchTerm);
      const matchesCategory = activeCategory === "all" || leader.category === activeCategory;
      const matchesFavorites = !favoritesOnly || favorites.includes(leader.id);
      return matchesSearch && matchesCategory && matchesFavorites;
    });

    if (sortSelect.value === "name") {
      visible.sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortSelect.value === "oldest") {
      visible.sort((a, b) => Number(a.period.slice(0, 4)) - Number(b.period.slice(0, 4)));
    } else if (sortSelect.value === "favorites") {
      visible.sort((a, b) => Number(favorites.includes(b.id)) - Number(favorites.includes(a.id)));
    }
    return visible;
  }

  function renderLeaders() {
    const visibleLeaders = getVisibleLeaders();
    resultCount.textContent = `Showing ${visibleLeaders.length} of ${allLeaders.length} leaders`;
    leadersGrid.innerHTML = "";

    if (visibleLeaders.length === 0) {
      leadersGrid.innerHTML = '<p class="empty-state">No leaders match your filters. Try a different search.</p>';
      return;
    }

    visibleLeaders.forEach((leader, index) => {
      const card = document.createElement("article");
      card.className = "leader-card";
      card.style.animationDelay = `${Math.min(index * 45, 350)}ms`;
      const isFavorite = favorites.includes(leader.id);
      card.innerHTML = `
        <button class="favorite-btn ${isFavorite ? "active" : ""}" data-favorite-id="${leader.id}" type="button" aria-label="${isFavorite ? "Remove" : "Add"} ${leader.name} ${isFavorite ? "from" : "to"} favorites">${isFavorite ? "♥" : "♡"}</button>
        <img src="images/${leader.image}" alt="${leader.name}" loading="lazy">
        <h3>${leader.name}</h3>
        <p>${leader.period}</p>
        <span class="category-badge">${leader.category}</span>
        <button class="btn" data-id="${leader.id}" type="button">View Details <span>→</span></button>
      `;
      leadersGrid.appendChild(card);
    });
  }

  function setupListeners() {
    searchBar.addEventListener("input", renderLeaders);
    clearSearch.addEventListener("click", () => {
      searchBar.value = "";
      searchBar.focus();
      renderLeaders();
    });

    filterNav.addEventListener("click", event => {
      const button = event.target.closest(".filter-btn");
      if (!button) return;
      activeCategory = button.dataset.category;
      filterNav.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("active"));
      button.classList.add("active");
      renderLeaders();
    });

    sortSelect.addEventListener("change", renderLeaders);
    favoritesToggle.addEventListener("click", () => {
      favoritesOnly = !favoritesOnly;
      favoritesToggle.classList.toggle("active", favoritesOnly);
      favoritesToggle.textContent = favoritesOnly ? "♥ Favorites only" : "♡ Favorites only";
      renderLeaders();
    });

    resetFilters.addEventListener("click", resetAllFilters);

    leadersGrid.addEventListener("click", event => {
      const favoriteButton = event.target.closest("[data-favorite-id]");
      if (favoriteButton) {
        toggleFavorite(favoriteButton.dataset.favoriteId);
        return;
      }
      const detailsButton = event.target.closest("[data-id]");
      if (detailsButton) {
        const leader = allLeaders.find(item => item.id === detailsButton.dataset.id);
        if (leader) openModal(leader);
      }
    });

    modalClose.addEventListener("click", closeModal);
    modalOverlay.addEventListener("click", event => {
      if (event.target === modalOverlay) closeModal();
    });
    document.addEventListener("keydown", event => {
      if (event.key === "Escape" && modalOverlay.classList.contains("active")) closeModal();
    });
  }

  function toggleFavorite(id) {
    favorites = favorites.includes(id) ? favorites.filter(item => item !== id) : [...favorites, id];
    localStorage.setItem("leaderFavorites", JSON.stringify(favorites));
    renderLeaders();
  }

  function resetAllFilters() {
    searchBar.value = "";
    activeCategory = "all";
    favoritesOnly = false;
    sortSelect.value = "default";
    favoritesToggle.classList.remove("active");
    favoritesToggle.textContent = "♡ Favorites only";
    filterNav.querySelectorAll(".filter-btn").forEach(item => item.classList.remove("active"));
    filterNav.querySelector('[data-category="all"]').classList.add("active");
    renderLeaders();
  }

  function openModal(leader) {
    const events = leader.events?.length
      ? leader.events.map(event => `
        <a href="${event.link}" target="_blank" rel="noopener noreferrer" class="event-link">
          <li class="event-item">
            <img src="images/${event.image}" alt="${event.name}" class="event-image" loading="lazy">
            <p>${event.name}</p>
          </li>
        </a>`).join("")
      : "<p>No notable events listed.</p>";
    const development = leader.development?.length
      ? leader.development.map(item => `<li>${item}</li>`).join("")
      : "<li>No notable development works listed.</li>";

    modalBody.innerHTML = `
      <img src="images/${leader.image}" alt="${leader.name}" class="modal-portrait">
      <p class="eyebrow">${leader.category}</p>
      <h2>${leader.name}</h2>
      <p><strong>Period:</strong> ${leader.period}</p>
      <p class="bio">${leader.bio}</p>
      <blockquote class="quote">"${leader.quote}"</blockquote>
      <h3>Major Events</h3>
      <ul class="event-list">${events}</ul>
      <h3>Development Works</h3>
      <ul>${development}</ul>
      <a href="${leader.wikiLink}" class="btn wiki-btn" target="_blank" rel="noopener noreferrer">Read More on Wikipedia <span>↗</span></a>
    `;
    modalOverlay.classList.add("active");
    modalClose.focus();
  }

  function closeModal() {
    modalOverlay.classList.remove("active");
  }
});
