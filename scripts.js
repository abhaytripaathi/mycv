// Simple interactions: theme toggle, smooth scroll, basic contact form handling
(function(){
  const root = document.documentElement;
  const toggle = document.getElementById('theme-toggle');
  const yearEl = document.getElementById('year');

  // set year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // theme from localStorage
  const saved = localStorage.getItem('theme');
  if (saved) document.documentElement.setAttribute('data-theme', saved);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const cur = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
      const next = cur === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      toggle.textContent = next === 'dark' ? '☀️' : '🌙';
    });
    // initial toggle icon
    toggle.textContent = document.documentElement.getAttribute('data-theme') === 'dark' ? '☀️' : '🌙';
  }

  // Smooth scroll for internal links
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', (e)=>{
      const href = a.getAttribute('href');
      if (href === '#' || href === '#0') return;
      const el = document.querySelector(href);
      if (el){
        e.preventDefault();
        el.scrollIntoView({behavior:'smooth', block:'start'});
      }
    });
  });

  // Basic contact form handling - opens mail client with message
  const form = document.getElementById('contact-form');
  const status = document.getElementById('form-status');
  if (form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      const data = new FormData(form);
      const name = (data.get('name') || '').toString().trim();
      const email = (data.get('email') || '').toString().trim();
      const message = (data.get('message') || '').toString().trim();
      if(!email || !message){
        if (status) status.textContent = 'Please include your email and a short message.';
        return;
      }
      // Use mailto as a quick fallback
      const to = 'abhaytripaathi.work@gmail.com';
      const subject = encodeURIComponent(`Portfolio contact from ${name || 'Website Visitor'}`);
      const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
      window.location.href = `mailto:${to}?subject=${subject}&body=${body}`;
      if (status) status.textContent = 'Opening your mail client…';
    });
  }
})();