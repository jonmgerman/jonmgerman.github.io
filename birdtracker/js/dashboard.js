    // ---------------------------
    // Load dashboard after login
    // ---------------------------
    function loadDashboard() {
      document.getElementById("dashboard-locked").style.display = "none";
      document.getElementById("sample-data-section").style.display = "none";
      document.getElementById("dashboard").style.display = "block";

      fetchDashboardData();
    }
// ---------------------------
    // Dashboard Rendering
    // ---------------------------
    const mockAPI = {
      activity: [
        { species: "Cardinal", sightings: 40, days: 14 },
        { species: "Blue Jay", sightings: 22, days: 9 },
        { species: "Goldfinch", sightings: 13, days: 6 },
        { species: "Downy Woodpecker", sightings: 5, days: 3 }
      ],
      rare: [
        { species: "Scarlet Tanager", rarity: 95 },
        { species: "Snow Bunting", rarity: 93 },
        { species: "Evening Grosbeak", rarity: 88 },
        { species: "Pine Siskin", rarity: 85 },
        { species: "Red Crossbill", rarity: 82 }
      ],
      visitsOverTime: {
        labels: ["2025-01-01","2025-01-02","2025-01-03","2025-01-04"],
        visits: [12, 16, 10, 20],
        species: [3, 4, 3, 5]
      },
      timeOfDay: {
        labels: ["6am","9am","12pm","3pm","6pm"],
        visits: [5, 12, 9, 14, 7],
        species: [2, 3, 3, 4, 2]
      }
    };

    function populateDashboard(data) {
      renderActivityTable(data.activity);
      renderRareSpecies(data.rare);
      renderSpeciesDropdown(data.activity);
      renderCharts(data);
    }

    function renderActivityTable(activity) {
      const table = document.getElementById("bird-activity-table");
      table.innerHTML = "<tr><th>Species</th><th>Sightings</th><th>Days With Visits</th></tr>";
      activity.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${item.species}</td><td>${item.sightings}</td><td>${item.days}</td>`;
        table.appendChild(row);
      });
    }

    function renderRareSpecies(rare=mockAPI.rare) {
      const limit = Number(document.getElementById("rare-limit").value);
      const table = document.getElementById("rare-table");
      table.innerHTML = "<tr><th>Species</th><th>Rarity Score</th></tr>";
      rare.slice(0, limit).forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `<td>${item.species}</td><td>${item.rarity}</td>`;
        table.appendChild(row);
      });
    }

    function renderSpeciesDropdown(activity=mockAPI.activity) {
      const select = document.getElementById("species-filter");
      select.innerHTML = '<option value="">All species</option>';
      activity.forEach(item => {
        const opt = document.createElement("option");
        opt.value = item.species;
        opt.innerText = item.species;
        select.appendChild(opt);
      });
    }

    function renderCharts(data=mockAPI) {
      new Chart(document.getElementById("visitsOverTime"), {type:'line', data:{labels:data.visitsOverTime.labels, datasets:[{label:'Visits', data:data.visitsOverTime.visits}] }});
      new Chart(document.getElementById("speciesOverTime"), {type:'line', data:{labels:data.visitsOverTime.labels, datasets:[{label:'Species Count', data:data.visitsOverTime.species}] }});
      new Chart(document.getElementById("visitsByTime"), {type:'line', data:{labels:data.timeOfDay.labels, datasets:[{label:'Visits', data:data.timeOfDay.visits}] }});
      new Chart(document.getElementById("speciesByTime"), {type:'line', data:{labels:data.timeOfDay.labels, datasets:[{label:'Species Count', data:data.timeOfDay.species}] }});
    }
