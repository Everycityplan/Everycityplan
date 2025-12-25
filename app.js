// Basic mock auth + data handling for the members-only experience.
const STORAGE_KEYS = {
  users: 'ecp_users',
  session: 'ecp_session',
};

const mockPlans = [
  {
    id: 'madrid-3d',
    city: 'Madrid',
    title: 'Madrid in 3 days',
    duration: '3 days',
    tags: ['Foodie', 'Art walks', 'Nightlife'],
    days: [
      {
        label: 'Day 1',
        summary: 'Gran Vía, tapas in La Latina, rooftop sunset.',
        bullets: [
          'Morning: Prado express highlights tour with skip-the-line entry',
          'Lunch: Mercado de San Miguel grazing with reserved stools',
          'Evening: Tapas crawl in La Latina + jazz bar nightcap',
        ],
      },
      {
        label: 'Day 2',
        summary: 'Retiro park, art deco cafés, Bernabéu lights.',
        bullets: [
          'Morning: Rowboats + picnic under the Retiro pines',
          'Afternoon: Barrio de Las Letras literary walk + cortado stop',
          'Night: Stadium tour with late dinner in Chamberí',
        ],
      },
      {
        label: 'Day 3',
        summary: 'Design shops and flamenco finale.',
        bullets: [
          'Brunch: Churros + hot chocolate at the classic spot we hold',
          'Shopping: Conde Duque design district with curated list',
          'Evening: Flamenco tablao with reserved premium seats',
        ],
      },
    ],
  },
  {
    id: 'paris-4d',
    city: 'Paris',
    title: 'Paris for four nights',
    duration: '4 days',
    tags: ['Design', 'Markets', 'Date-night'],
    days: [
      {
        label: 'Day 1',
        summary: 'Left Bank flânerie + Seine sunset.',
        bullets: [
          'Check-in concierge drop + café crème welcome',
          'Galeries Marché curated shopping trail',
          'Champ-de-Mars picnic timed for golden hour photos',
        ],
      },
      {
        label: 'Day 2',
        summary: 'Art + artichokes.',
        bullets: [
          'Louvre wing highlights with artist-led guide',
          'Lunch at a classic bistro (reservation held)',
          'Night walk through Passages + cocktail speakeasy',
        ],
      },
      {
        label: 'Day 3',
        summary: 'Montmartre textures.',
        bullets: [
          'Cable car to Sacré-Cœur with queue-skipping',
          'Studio visits with two emerging painters',
          'Moulin Rouge or jazz cave, depending on vibe',
        ],
      },
      {
        label: 'Day 4',
        summary: 'Markets + right bank drift.',
        bullets: [
          'Marché des Enfants Rouges tasting lane',
          'Canal Saint-Martin cycle with audio prompts',
          'Opera district dessert crawl',
        ],
      },
    ],
  },
  {
    id: 'kyoto-3d',
    city: 'Kyoto',
    title: 'Kyoto slow travel',
    duration: '3 days',
    tags: ['Culture', 'Calm', 'Tea'],
    days: [
      {
        label: 'Day 1',
        summary: 'Zen + machiya evening.',
        bullets: [
          'Sunrise at Fushimi Inari before tours arrive',
          'Tea ceremony with host we vetted',
          'Dinner in Gion with lantern stroll mapped out',
        ],
      },
      {
        label: 'Day 2',
        summary: 'Arashiyama greens.',
        bullets: [
          'Private bamboo grove entry timed to low foot traffic',
          'River boat drift and tofu lunch',
          'Onsen soak with reserved slot',
        ],
      },
      {
        label: 'Day 3',
        summary: 'Craft + kaiseki.',
        bullets: [
          'Nishiki market tasting list with prep notes',
          'Indigo dye workshop slot we hold for members',
          'Kaiseki dinner with dietary notes logged',
        ],
      },
    ],
  },
];

function readUsers() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.users)) || [];
  } catch (err) {
    return [];
  }
}

async function hashPassword(password) {
  // Use Web Crypto when available; fall back to a simple hash so the mock auth works on file:// too.
  if (crypto?.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }

  let hash = 0;
  for (let i = 0; i < password.length; i += 1) {
    hash = (hash << 5) - hash + password.charCodeAt(i);
    hash |= 0; // keep as 32-bit int
  }
  return `fallback-${Math.abs(hash)}`;
}

async function signup({ name, email, password }) {
  const users = readUsers();
  if (users.some((u) => u.email === email)) {
    throw new Error('That email is already registered.');
  }
  const hashed = await hashPassword(password);
  const nextUsers = [...users, { name, email, hashed }];
  localStorage.setItem(STORAGE_KEYS.users, JSON.stringify(nextUsers));
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ name, email }));
  return { name, email };
}

async function login({ email, password }) {
  const users = readUsers();
  const user = users.find((u) => u.email === email);
  if (!user) throw new Error('Account not found. Try signing up.');
  const hashed = await hashPassword(password);
  if (hashed !== user.hashed) throw new Error('Incorrect password.');
  localStorage.setItem(STORAGE_KEYS.session, JSON.stringify({ name: user.name, email }));
  return { name: user.name, email };
}

function getSession() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEYS.session));
  } catch (err) {
    return null;
  }
}

function logout() {
  localStorage.removeItem(STORAGE_KEYS.session);
}

function requireAuth(redirect = 'login.html') {
  const session = getSession();
  if (!session) {
    const target = `${redirect}?next=${encodeURIComponent(window.location.pathname + window.location.search)}`;
    window.location.replace(target);
    return null;
  }
  return session;
}

function renderPlansList(container) {
  container.innerHTML = '';
  mockPlans.forEach((plan) => {
    const card = document.createElement('article');
    card.className = 'dashboard-card';
    card.innerHTML = `
      <div class="pill">${plan.city}</div>
      <h3>${plan.title}</h3>
      <p class="lede">${plan.duration}</p>
      <div class="tags">${plan.tags
        .map((tag) => `<span class="tag">${tag}</span>`)
        .join('')}</div>
      <a class="button" href="plan.html?id=${plan.id}">Open plan</a>
    `;
    container.appendChild(card);
  });
}

function renderTeasers(container) {
  container.innerHTML = '';
  mockPlans.slice(0, 3).forEach((plan) => {
    const card = document.createElement('article');
    card.className = 'plan-card';
    card.innerHTML = `
      <img src="https://source.unsplash.com/featured/?${plan.city},city" alt="${plan.city}" />
      <div class="plan-card__body">
        <div class="pill">${plan.duration}</div>
        <h3>${plan.title}</h3>
        <div class="tags">${plan.tags.map((tag) => `<span class="tag">${tag}</span>`).join('')}</div>
        <div class="preview-blur">${plan.days[0].bullets.slice(0, 2).join(' · ')}<div class="preview-overlay"></div></div>
        <div class="inline-actions">
          <a class="button" href="login.html">See example plan (login required)</a>
          <a class="ghost" href="signup.html">Create my account</a>
        </div>
      </div>
    `;
    container.appendChild(card);
  });
}

function setWatermark(element, session) {
  if (!element || !session) return;
  const text = `everycityplan · ${session.email}`;
  const svg = encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="220" height="220" viewBox="0 0 220 220">
      <text x="0" y="40" fill="rgba(255,255,255,0.18)" font-size="18" transform="rotate(-25 20 20)">${text}</text>
    </svg>`
  );
  element.style.setProperty('--watermark', `url("data:image/svg+xml,${svg}")`);
  element.style.backgroundImage = `var(--watermark)`;
  element.querySelector('.plan-watermark')?.style.setProperty('background-image', `var(--watermark)`);
}

function initAccordion(root) {
  const items = root.querySelectorAll('.accordion-item');
  const maxOpen = 2;
  items.forEach((item) => {
    const header = item.querySelector('.accordion-header');
    const body = item.querySelector('.accordion-body');
    if (item.classList.contains('open')) {
      body.classList.add('open');
      body.style.maxHeight = `${body.scrollHeight}px`;
    }
    header.addEventListener('click', () => {
      const currentlyOpen = Array.from(items).filter((i) => i.classList.contains('open'));
      if (!item.classList.contains('open') && currentlyOpen.length >= maxOpen) {
        const oldest = currentlyOpen[0];
        oldest.classList.remove('open');
        oldest.querySelector('.accordion-body').style.maxHeight = null;
        oldest.querySelector('.accordion-body').classList.remove('open');
      }
      const isOpen = item.classList.toggle('open');
      body.classList.toggle('open', isOpen);
      body.style.maxHeight = isOpen ? `${body.scrollHeight}px` : null;
    });
  });
}

function showTooltip(message) {
  let tooltip = document.querySelector('.tooltip');
  if (!tooltip) {
    tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    document.body.appendChild(tooltip);
  }
  tooltip.textContent = message;
  tooltip.classList.add('show');
  setTimeout(() => tooltip.classList.remove('show'), 1600);
}

function discourageScreenshots() {
  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    showTooltip('Screenshotting is discouraged to protect this custom content.');
  });
}

// Page bootstrapping
window.addEventListener('DOMContentLoaded', () => {
  const session = getSession();

  const teaserContainer = document.querySelector('[data-teasers]');
  if (teaserContainer) renderTeasers(teaserContainer);

  const plansList = document.querySelector('[data-plans-list]');
  if (plansList) renderPlansList(plansList);

  const signupForm = document.querySelector('#signup-form');
  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const errorBox = form.querySelector('.error');
      const name = form.name.value.trim();
      const email = form.email.value.trim().toLowerCase();
      const password = form.password.value;
      if (!name || !email || !password) {
        errorBox.textContent = 'All fields are required.';
        return;
      }
      if (password.length < 6) {
        errorBox.textContent = 'Use at least 6 characters for your password.';
        return;
      }
      try {
        await signup({ name, email, password });
        window.location.href = 'dashboard.html';
      } catch (err) {
        errorBox.textContent = err.message;
      }
    });
  }

  const loginForm = document.querySelector('#login-form');
  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const form = e.currentTarget;
      const errorBox = form.querySelector('.error');
      const email = form.email.value.trim().toLowerCase();
      const password = form.password.value;
      if (!email || !password) {
        errorBox.textContent = 'Email and password are required.';
        return;
      }
      try {
        await login({ email, password });
        const params = new URLSearchParams(window.location.search);
        const next = params.get('next') || 'dashboard.html';
        window.location.href = next;
      } catch (err) {
        errorBox.textContent = err.message;
      }
    });
  }

  const dashboard = document.querySelector('.dashboard');
  if (dashboard) {
    const current = requireAuth('login.html');
    if (!current) return;
    const welcome = document.querySelector('[data-username]');
    if (welcome) welcome.textContent = current?.name || 'Traveler';
    const logoutBtn = document.querySelector('[data-logout]');
    logoutBtn?.addEventListener('click', () => {
      logout();
      window.location.href = 'login.html';
    });
  }

  const planPage = document.querySelector('.plan-viewer');
  if (planPage) {
    const current = requireAuth('login.html');
    if (!current) return;
    discourageScreenshots();
    const params = new URLSearchParams(window.location.search);
    const planId = params.get('id');
    const plan = mockPlans.find((p) => p.id === planId) || mockPlans[0];
    document.querySelector('[data-plan-title]').textContent = plan.title;
    document.querySelector('[data-plan-city]').textContent = plan.city;
    document.querySelector('[data-plan-days]').textContent = plan.duration;
    document.querySelector('[data-plan-owner]').textContent = current?.name || 'Member';
    const accordion = document.querySelector('[data-accordion]');
    plan.days.forEach((day, index) => {
      const item = document.createElement('div');
      item.className = `accordion-item ${index < 2 ? 'open' : ''}`;
      item.innerHTML = `
        <button class="accordion-header">
          <span>${day.label}</span>
          <span class="pill">${day.summary}</span>
        </button>
        <div class="accordion-body ${index < 2 ? 'open' : ''}">
          ${day.bullets.map((b) => `<p>${b}</p>`).join('')}
        </div>
      `;
      accordion.appendChild(item);
    });
    initAccordion(accordion);
    setWatermark(planPage, current);
  }
});
