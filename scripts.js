(function () {
  const toggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');
  const galleryForm = document.getElementById('gallery-form');
  const galleryGrid = document.getElementById('gallery-grid');
  const galleryInput = document.getElementById('gallery-image');
  const galleryTitle = document.getElementById('gallery-title');
  const galleryDescription = document.getElementById('gallery-description');
  const galleryKey = 'portfolio-gallery-items';

  const defaultGallery = [
    {
      id: 'sample-profile',
      title: 'Profile shot',
      description: 'A professional portrait and personal brand image for the portfolio.',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%230f172a'/%3E%3Ccircle cx='400' cy='215' r='110' fill='%23e2e8f0'/%3E%3Cpath d='M250 470c22-108 112-162 150-162s128 54 150 162' fill='%23e2e8f0'/%3E%3Ctext x='400' y='548' text-anchor='middle' font-family='Arial' font-size='44' fill='%230f172a'%3EAT%3C/text%3E%3C/svg%3E"
    },
    {
      id: 'sample-work',
      title: 'Project activity',
      description: 'Working on governance, reporting, and automation transformation initiatives.',
      image: "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%230b1120'/%3E%3Crect x='80' y='120' width='640' height='290' rx='18' fill='%232b3a55'/%3E%3Crect x='130' y='180' width='160' height='18' rx='9' fill='%2393c5fd'/%3E%3Crect x='130' y='230' width='440' height='18' rx='9' fill='%23dbeafe'/%3E%3Crect x='130' y='270' width='360' height='18' rx='9' fill='%23dbeafe'/%3E%3Crect x='130' y='330' width='200' height='18' rx='9' fill='%2393c5fd'/%3E%3Cpath d='M540 420l80-80v110h-80z' fill='%236ee7b7'/%3E%3C/svg%3E"
    }
  ];

  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  const savedTheme = localStorage.getItem('theme');
  if (savedTheme) {
    document.documentElement.setAttribute('data-theme', savedTheme);
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      const currentTheme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', nextTheme);
      localStorage.setItem('theme', nextTheme);
      toggle.textContent = nextTheme === 'dark' ? '☀️' : '🌙';
    });
    toggle.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  }

  document.querySelectorAll('.nav-tab').forEach((tab) => {
    tab.addEventListener('click', () => {
      const target = tab.dataset.target;
      document.querySelectorAll('.nav-tab').forEach((item) => item.classList.toggle('is-active', item === tab));
      document.querySelectorAll('.tab-panel').forEach((panel) => {
        panel.classList.toggle('is-active', panel.id === target);
      });
    });
  });

  const contactForm = document.getElementById('contact-form');
  const status = document.getElementById('form-status');

  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      const data = new FormData(contactForm);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      if (!email || !message) {
        if (status) status.textContent = 'Please include your email and a short message.';
        return;
      }

      const to = 'abhaytripaathi.work@gmail.com';
      const subject = encodeURIComponent(`Portfolio contact from ${name || 'Website Visitor'}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      if (status) status.textContent = 'Opening your mail client…';
    });
  }

  function loadGallery() {
    const savedItems = localStorage.getItem(galleryKey);
    if (!savedItems) {
      localStorage.setItem(galleryKey, JSON.stringify(defaultGallery));
      return defaultGallery;
    }

    try {
      const parsed = JSON.parse(savedItems);
      return Array.isArray(parsed) && parsed.length ? parsed : defaultGallery;
    } catch (error) {
      return defaultGallery;
    }
  }

  function saveGallery(items) {
    localStorage.setItem(galleryKey, JSON.stringify(items));
  }

  function renderGallery() {
    const items = loadGallery();
    if (!galleryGrid) return;

    galleryGrid.innerHTML = '';

    items.forEach((item) => {
      const card = document.createElement('article');
      card.className = 'gallery-item';
      card.innerHTML = `
        <img src="${item.image}" alt="${item.title || 'Gallery item'}" class="gallery-image">
        <div class="gallery-content">
          <h3>${item.title || 'Untitled picture'}</h3>
          <p>${item.description || 'No description added yet.'}</p>
          <label>
            <span>Update description</span>
            <textarea class="gallery-edit" rows="3" data-id="${item.id}">${item.description || ''}</textarea>
          </label>
          <div class="gallery-actions">
            <button type="button" class="btn primary update-description" data-id="${item.id}">Update</button>
            <button type="button" class="btn danger delete-item" data-id="${item.id}">Delete</button>
          </div>
        </div>
      `;
      galleryGrid.appendChild(card);
    });

    galleryGrid.querySelectorAll('.update-description').forEach((button) => {
      button.addEventListener('click', () => {
        const itemId = button.dataset.id;
        const textarea = galleryGrid.querySelector(`textarea[data-id="${itemId}"]`);
        const current = loadGallery();
        const updated = current.map((item) => {
          if (item.id === itemId) {
            return { ...item, description: (textarea ? textarea.value.trim() : item.description) || 'No description added yet.' };
          }
          return item;
        });
        saveGallery(updated);
        renderGallery();
      });
    });

    galleryGrid.querySelectorAll('.delete-item').forEach((button) => {
      button.addEventListener('click', () => {
        const itemId = button.dataset.id;
        const current = loadGallery().filter((item) => item.id !== itemId);
        saveGallery(current.length ? current : defaultGallery);
        renderGallery();
      });
    });
  }

  if (galleryForm) {
    galleryForm.addEventListener('submit', (event) => {
      event.preventDefault();

      const items = loadGallery();
      const uploadedFile = galleryInput && galleryInput.files && galleryInput.files[0];
      const title = (galleryTitle && galleryTitle.value || '').trim() || 'New photo';
      const description = (galleryDescription && galleryDescription.value || '').trim() || 'No description added yet.';

      if (!uploadedFile) {
        const placeholder = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='600' viewBox='0 0 800 600'%3E%3Crect width='800' height='600' fill='%230f172a'/%3E%3Crect x='80' y='120' width='640' height='290' rx='18' fill='%232b3a55'/%3E%3Ccircle cx='400' cy='220' r='70' fill='%23cbd5e1'/%3E%3Cpath d='M255 420c26-120 125-170 145-170s119 50 145 170' fill='%23e2e8f0'/%3E%3C/svg%3E";
        items.unshift({ id: `item-${Date.now()}`, title, description, image: placeholder });
      } else {
        const reader = new FileReader();
        reader.onload = () => {
          items.unshift({ id: `item-${Date.now()}`, title, description, image: String(reader.result) });
          saveGallery(items);
          renderGallery();
        };
        reader.readAsDataURL(uploadedFile);
      }

      saveGallery(items);
      renderGallery();
      galleryForm.reset();
    });
  }

  renderGallery();
})();