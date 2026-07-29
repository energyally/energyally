  // Theme: light by default, with the visitor's explicit choice remembered.
  const root = document.documentElement;
  const themeToggle = document.querySelector('.theme-toggle');
  const themeMeta = document.querySelector('meta[name="theme-color"]');
  const savedTheme = localStorage.getItem('energyally-theme');
  const initialTheme = savedTheme === 'dark' ? 'dark' : 'light';

  function setTheme(theme){
    const isDark = theme === 'dark';
    root.dataset.theme = theme;
    themeToggle.setAttribute('aria-pressed', String(isDark));
    themeToggle.setAttribute('aria-label', isDark ? 'Switch to light theme' : 'Switch to dark theme');
    themeMeta.setAttribute('content', isDark ? '#071536' : '#F7FBFC');
  }

  setTheme(initialTheme);
  themeToggle.addEventListener('click', ()=>{
    const nextTheme = root.dataset.theme === 'dark' ? 'light' : 'dark';
    setTheme(nextTheme);
    localStorage.setItem('energyally-theme', nextTheme);
  });

  // Scrollspy — underline nav link for section currently in view
  const navLinks = document.querySelectorAll('.navlinks a');
  const spySections = Array.from(navLinks)
    .map(link => document.querySelector(link.getAttribute('href')))
    .filter(Boolean);
  const spyIO = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      const id = '#' + entry.target.id;
      const link = document.querySelector('.navlinks a[href="' + id + '"]');
      if(!link) return;
      if(entry.isIntersecting){
        navLinks.forEach(l=>l.classList.remove('active'));
        link.classList.add('active');
      }
    });
  }, {rootMargin:'-45% 0px -50% 0px', threshold:0});
  spySections.forEach(sec=>spyIO.observe(sec));

  // Reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  }, {threshold:.15});
  revealEls.forEach(el=>io.observe(el));

  // Gauge needle + arc animation
  const gauges = document.querySelectorAll('[data-gauge]');
  const gaugeIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        const val = parseFloat(el.dataset.value);
        const angle = -90 + (val/100)*180;
        const needle = el.querySelector('.needle');
        const arc = el.querySelector('.fill-arc');
        const dash = 157 - (val/100)*157;
        requestAnimationFrame(()=>{
          needle.style.transform = 'rotate(' + angle + 'deg)';
          needle.setAttribute('transform','');
          needle.style.transformOrigin = '60px 60px';
          arc.style.transition = 'stroke-dashoffset 1.4s cubic-bezier(.2,.8,.2,1)';
          arc.style.strokeDashoffset = dash;
        });
        gaugeIO.unobserve(el);
      }
    });
  }, {threshold:.4});
  gauges.forEach(g=>gaugeIO.observe(g));

  // Ledger counters
  const counters = document.querySelectorAll('[data-count]');
  const countIO = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el = e.target;
        const target = parseInt(el.dataset.count,10);
        const flag = el.querySelector('.flag');
        let cur = 0;
        const step = Math.max(1, Math.round(target/30));
        const iv = setInterval(()=>{
          cur += step;
          if(cur >= target){ cur = target; clearInterval(iv); }
          el.childNodes[0].nodeValue = cur;
        }, 30);
        countIO.unobserve(el);
      }
    });
  }, {threshold:.5});
  counters.forEach(c=>countIO.observe(c));

  // Vertical switcher
  const vertData = {
    lpg:{ title:'LPG distribution workflow', desc:"Cylinder-first stock logic, refill routes, priority household delivery, and register reconciliation built for day-end closure.", admin:'Proprietor', unit:'Cylinder', delivery:'Refill delivery' },
    petroleum:{ title:'Petroleum distribution workflow', desc:"Tanker unloading logs, dip-stock reconciliation, and station-wise delivery scheduling with fuel-grade tracking.", admin:'Dealer', unit:'Kilolitre', delivery:'Tanker dispatch' },
    solar:{ title:'Solar installation & service workflow', desc:"Installation pipeline tracking, equipment stock by SKU, and site-visit scheduling for maintenance teams.", admin:'Franchise owner', unit:'Equipment SKU', delivery:'Site visit' },
    water:{ title:'Water distribution workflow', desc:"Jar and can stock cycles, subscription-based delivery routes, and empties-return reconciliation.", admin:'Plant owner', unit:'Jar / Can', delivery:'Subscription route' }
  };
  document.querySelectorAll('.vswitch-btn').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.vswitch-btn').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const d = vertData[btn.dataset.vert];
      document.getElementById('vert-title').textContent = d.title;
      document.getElementById('vert-desc').textContent = d.desc;
      document.getElementById('vert-admin').textContent = d.admin;
      document.getElementById('vert-unit').textContent = d.unit;
      document.getElementById('vert-delivery').textContent = d.delivery;
    });
  });

  // Pricing cycle toggle
  document.querySelectorAll('.price-toggle button').forEach(btn=>{
    btn.addEventListener('click', ()=>{
      document.querySelectorAll('.price-toggle button').forEach(b=>b.classList.remove('active'));
      btn.classList.add('active');
      const cycle = btn.dataset.cycle;
      document.querySelectorAll('.amt').forEach(amt=>{
        amt.textContent = '₹' + amt.dataset[cycle];
      });
      document.querySelectorAll('.per').forEach(per=>{
        per.textContent = per.dataset[cycle + 'Per'];
      });
      document.querySelectorAll('.full-price').forEach(fp=>{
        if(cycle === 'yearly'){ fp.classList.remove('hide'); }
        else{ fp.classList.add('hide'); }
      });
      document.querySelectorAll('.plan-save').forEach(ps=>{
        ps.textContent = ps.dataset[cycle + 'Save'];
      });
    });
  });
