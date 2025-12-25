const demoUser = {
  email: "traveler@everycityplan.com",
  password: "demo123",
};

const plans = {
  "New York": {
    intro: "48 hours of architecture, skyline views, and local eats.",
    days: [
      {
        title: "Day 1 – Midtown Icons",
        badge: "Skylines",
        stops: [
          "Sunrise at Top of the Rock; book timed entry.",
          "Walk Fifth Avenue to Bryant Park espresso stop.",
          "Lunch at Urbanspace food hall; rotate cuisines.",
          "Grand Central whispering gallery and market pick-up.",
          "Evening show in Broadway's Theater District.",
        ],
      },
      {
        title: "Day 2 – Downtown Art & Waterfront",
        badge: "Culture",
        stops: [
          "SoHo galleries before 11am for quiet viewing.",
          "9/11 Memorial; reserve museum ahead.",
          "Oculus + Brookfield Place for design and dining.",
          "Sunset walk on the Brooklyn Bridge ending in DUMBO pizza.",
        ],
      },
    ],
    notes: [
      "Use the 7-day MetroCard for unlimited subway rides.",
      "Book observation decks 2 weeks out for best slots.",
    ],
  },
  Paris: {
    intro: "Romantic right-bank walks, café culture, and sunset views.",
    days: [
      {
        title: "Day 1 – Louvre to Left Bank",
        badge: "Art",
        stops: [
          "Enter Louvre via Carrousel entrance to skip lines.",
          "Picnic lunch in Tuileries gardens.",
          "Cross Pont des Arts toward Saint-Germain jazz bars.",
        ],
      },
      {
        title: "Day 2 – Montmartre & Seine",
        badge: "Views",
        stops: [
          "Sunrise steps at Sacré-Cœur before crowds.",
          "Atelier visit along Rue des Martyrs for pastries + art.",
          "Golden hour cruise on the Seine; upper deck seating.",
        ],
      },
    ],
    notes: [
      "Cafés expect you to linger; no rush on seating.",
      "Metro Line 14 is fastest crosstown route.",
    ],
  },
  Tokyo: {
    intro: "Design-forward neighborhoods with food stops every block.",
    days: [
      {
        title: "Day 1 – Shibuya & Omotesandō",
        badge: "Fashion",
        stops: [
          "Shibuya Sky for morning cityscape.",
          "Cat Street indie boutiques and coffee at Omotesandō Koffee.",
          "Harajuku crepes en route to Meiji Shrine's forest walk.",
        ],
      },
      {
        title: "Day 2 – Asakusa & Sumida",
        badge: "Heritage",
        stops: [
          "Senso-ji at 7am; photograph Nakamise before shops open.",
          "Riverside cycle along Sumida with Skytree views.",
          "Chef's counter ramen at midday to avoid queues.",
        ],
      },
    ],
    notes: [
      "Suica/PASMO IC cards work on most trains and kiosks.",
      "Carry cash for small ramen shops; cards not always accepted.",
    ],
  },
};

let sessionInterval = null;
let sessionSeconds = 0;
let activeEmail = "";

const loginForm = document.getElementById("login-form");
const statusEl = document.getElementById("status");
const viewer = document.getElementById("viewer");
const welcomeEl = document.getElementById("welcome");
const citySelect = document.getElementById("city-select");
const dayNav = document.getElementById("day-nav");
const planContent = document.getElementById("plan-content");
const sessionTimer = document.getElementById("session-timer");
const overlay = document.getElementById("overlay");
const watermark = document.getElementById("watermark");
const reactivateBtn = document.getElementById("reactivate");
const restartSessionBtn = document.getElementById("restart-session");
const plan = document.getElementById("plan");
const cityTitle = document.getElementById("city-title");

function formatSeconds(secs) {
  const m = Math.floor(secs / 60)
    .toString()
    .padStart(2, "0");
  const s = Math.floor(secs % 60)
    .toString()
    .padStart(2, "0");
  return `${m}:${s}`;
}

function setWatermark(text) {
  const svg = `<svg xmlns='http://www.w3.org/2000/svg' width='320' height='200' viewBox='0 0 320 200'>` +
    `<text x='0' y='30' fill='rgba(12,20,47,0.25)' font-size='18' transform='rotate(-20 60 60)'>${text}</text>` +
    `</svg>`;
  const encoded = encodeURIComponent(svg);
  watermark.style.backgroundImage = `url("data:image/svg+xml,${encoded}")`;
}

function populateCities() {
  Object.keys(plans).forEach((city) => {
    const opt = document.createElement("option");
    opt.value = city;
    opt.textContent = city;
    citySelect.appendChild(opt);
  });
}

function renderDayNav(city) {
  dayNav.innerHTML = "";
  plans[city].days.forEach((day, index) => {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.textContent = day.title;
    btn.setAttribute("aria-pressed", index === 0 ? "true" : "false");
    btn.addEventListener("click", () => {
      Array.from(dayNav.children).forEach((child) => child.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");
      renderPlan(city, index);
    });
    const li = document.createElement("li");
    li.appendChild(btn);
    dayNav.appendChild(li);
  });
}

function renderPlan(city, dayIndex = 0) {
  const data = plans[city];
  const day = data.days[dayIndex];
  cityTitle.textContent = `${city} plan`;
  planContent.innerHTML = `
    <div>
      <span class="badge">${day.badge}</span>
      <h3>${day.title}</h3>
      <p>${data.intro}</p>
      <ul>
        ${day.stops.map((stop) => `<li>${stop}</li>`).join("")}
      </ul>
    </div>
    <div>
      <h3>Traveler tips</h3>
      <ul>
        ${data.notes.map((note) => `<li>${note}</li>`).join("")}
      </ul>
    </div>
  `;
}

function startSession() {
  clearInterval(sessionInterval);
  sessionSeconds = 5 * 60;
  sessionTimer.textContent = `Session time: ${formatSeconds(sessionSeconds)} remaining`;
  overlay.hidden = true;
  planContent.classList.remove("locked");
  sessionInterval = setInterval(() => {
    sessionSeconds -= 1;
    sessionTimer.textContent = `Session time: ${formatSeconds(Math.max(sessionSeconds, 0))} remaining`;
    if (sessionSeconds <= 0) {
      endSession();
    }
  }, 1000);
}

function endSession() {
  clearInterval(sessionInterval);
  overlay.hidden = false;
  planContent.classList.add("locked");
}

function authenticate(email, password) {
  const trimmed = email.trim().toLowerCase();
  if ((trimmed === demoUser.email && password === demoUser.password) || (trimmed && password)) {
    return { email: trimmed };
  }
  return null;
}

function displayWelcome(email) {
  welcomeEl.textContent = `Signed in as ${email}`;
  setWatermark(`${email} · Every City Plan`);
}

function disableInteractions() {
  document.addEventListener("contextmenu", (event) => event.preventDefault());
  document.addEventListener("copy", (event) => {
    event.preventDefault();
    statusEl.textContent = "Copying is disabled in secure view.";
  });
  document.addEventListener("keydown", (event) => {
    const combo = event.ctrlKey || event.metaKey;
    if (combo && ["s", "p", "c"].includes(event.key.toLowerCase())) {
      event.preventDefault();
      statusEl.textContent = "Downloading, printing, and copying are disabled.";
    }
  });
  window.onbeforeprint = () => {
    return "Printing is disabled for this secure plan.";
  };
}

disableInteractions();
populateCities();
renderDayNav(citySelect.value || "New York");
renderPlan(citySelect.value || "New York");

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();
  const email = loginForm.email.value;
  const password = loginForm.password.value;
  const user = authenticate(email, password);

  if (!user) {
    statusEl.textContent = "Invalid credentials. Try the demo details.";
    return;
  }

  activeEmail = user.email;
  statusEl.textContent = "Access granted. Viewer unlocked.";
  viewer.hidden = false;
  displayWelcome(user.email);
  plan.focus({ preventScroll: false });
  startSession();
});

citySelect.addEventListener("change", () => {
  const city = citySelect.value;
  renderDayNav(city);
  renderPlan(city);
});

reactivateBtn.addEventListener("click", startSession);
restartSessionBtn.addEventListener("click", startSession);
