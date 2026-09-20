(function () {
  const toggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');

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
    contactForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const data = new FormData(contactForm);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();

      if (!email || !message) {
        if (status) status.textContent = 'Please include your email and a short message.';
        return;
      }

      if (status) status.textContent = 'Sending your message...';

      try {
        const response = await fetch(contactForm.action, {
          method: 'POST',
          body: data,
          headers: {
            Accept: 'application/json'
          }
        });

        if (response.ok) {
          if (status) status.textContent = `Thanks${name ? `, ${name}` : ''}! Your message has been sent successfully.`;
          contactForm.reset();
          return;
        }

        const errorData = await response.json().catch(() => ({}));
        const errorMessage = errorData?.errors?.[0]?.message || 'Something went wrong while sending your message. Please try again.';
        if (status) status.textContent = errorMessage;
      } catch (error) {
        if (status) status.textContent = 'There was a connection issue. Please try again or contact me directly.';
      }
    });
  }

})();