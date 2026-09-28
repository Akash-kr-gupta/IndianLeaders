// Wait for the DOM to be fully loaded before running the script
document.addEventListener("DOMContentLoaded", () => {
  
  // --- 1. GET DOM ELEMENTS ---
  const leadersGrid = document.getElementById("leadersGrid");
  const searchBar = document.getElementById("searchBar");
  const filterNav = document.getElementById("filterNav");
  const modalOverlay = document.getElementById("modalOverlay");
  const modalBody = document.getElementById("modalBody");
  const modalClose = document.getElementById("modalClose");

  let allLeaders = []; // This array will store all leader data once fetched

  // --- 2. FETCH DATA ---
  // Fetch leader data from the JSON file
  fetch("js/data.json")
    .then(response => response.json()) // Convert the response to JSON
    .then(data => {
      allLeaders = data; // Store the data in our global array
      renderLeaders(allLeaders); // Initial render of all leaders
      setupListeners(); // Set up all event listeners after data is loaded
    })
    .catch(error => console.error("Error fetching leader data:", error));

  
  // --- 3. RENDER FUNCTION ---
  // Function to display leaders in the grid
  function renderLeaders(leadersToRender) {
    leadersGrid.innerHTML = ""; // Clear the grid first

    if (leadersToRender.length === 0) {
      leadersGrid.innerHTML = "<p>No leaders found.</p>";
      return;
    }

    leadersToRender.forEach(leader => {
      const card = document.createElement("div");
      card.className = "leader-card";
      
      // We use a button with a data-id attribute for the modal
      card.innerHTML = `
        <img src="images/${leader.image}" alt="${leader.name}">
        <h3>${leader.name}</h3>
        <p>${leader.period}</p>
        <button class="btn" data-id="${leader.id}">View Details</button>
      `;
      leadersGrid.appendChild(card);
    });
  }

  // --- 4. SET UP EVENT LISTENERS ---
  function setupListeners() {
    
    // Search Bar Listener
    if (searchBar) {
      searchBar.addEventListener("keyup", () => {
        const searchTerm = searchBar.value.toLowerCase();
        const filteredLeaders = allLeaders.filter(leader =>
          leader.name.toLowerCase().includes(searchTerm)
        );
        renderLeaders(filteredLeaders);
      });
    }

    // Filter Buttons Listener (using event delegation)
    if (filterNav) {
      filterNav.addEventListener("click", e => {
        // Only act if a button was clicked
        if (e.target.tagName === "BUTTON") {
          // Remove 'active' class from all buttons
          filterNav.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
          // Add 'active' class to the clicked button
          e.target.classList.add('active');

          const category = e.target.dataset.category;

          if (category === "all") {
            renderLeaders(allLeaders);
          } else {
            const filteredLeaders = allLeaders.filter(leader => leader.category === category);
            renderLeaders(filteredLeaders);
          }
        }
      });
    }

    // Grid Listener for "View Details" (using event delegation)
    if (leadersGrid) {
      leadersGrid.addEventListener("click", e => {
        const button = e.target.closest(".btn"); // Find the closest .btn that was clicked
        if (button) {
          const leaderId = button.dataset.id;
          const leader = allLeaders.find(l => l.id === leaderId);
          if (leader) {
            openModal(leader);
          }
        }
      });
    }
    
    // Modal Close Listeners
    if (modalClose) {
      modalClose.addEventListener("click", closeModal);
    }

    if (modalOverlay) {
      // Close modal if user clicks on the dark overlay area
      modalOverlay.addEventListener("click", e => {
        if (e.target === modalOverlay) {
          closeModal();
        }
      });
    }
  }
  // --- 5. MODAL FUNCTIONS ---
  // Function to open and populate the modal
  function openModal(leader) {
    // Helper function to create the events list
    function createEventsList(events) {
      if (!events || events.length === 0) return "<p>No notable events listed.</p>";
      
      // THIS IS THE FIX: The <a> tag wraps the <li>
      return events.map(event => `
        <a href="${event.link}" target="_blank" class="event-link">
          <li class="event-item">
            <img src="images/${event.image}" alt="${event.name}" class="event-image">
            <p>${event.name}</p>
          </li>
        </a>
      `).join('');
    }

    // Helper function to create the development list
    function createDevList(devs) {
      if (!devs || devs.length === 0) return "<p>No notable development works listed.</p>";
      return devs.map(d => `<li>${d}</li>`).join('');
    }

    modalBody.innerHTML = `
      <img src="images/${leader.image}" alt="${leader.name}" class="modal-portrait">
      <h2>${leader.name}</h2>
      <p><strong>Period:</strong> ${leader.period}</p>
      
      <p class="bio">${leader.bio}</p>
      <blockquote class="quote">"${leader.quote}"</blockquote>

      <h3>Major Events</h3>
      <ul class="event-list">
        ${createEventsList(leader.events)}
      </ul>
      
      <h3>Development Works</h3>
      <ul>
        ${createDevList(leader.development)}
      </ul>

      <a href="${leader.wikiLink}" class="btn wiki-btn" target="_blank">Read More on Wikipedia</a>
    `;
    modalOverlay.classList.add("active");
  }

  // Function to close the modal
  function closeModal() {
    modalOverlay.classList.remove("active");
  }
});