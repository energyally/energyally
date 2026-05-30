const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
      }
    });
  },
  {
    threshold: 0.15,
  }
);

document.querySelectorAll(".reveal").forEach((node, index) => {
  node.style.transitionDelay = `${index * 90}ms`;
  observer.observe(node);
});

const glow = document.querySelector(".cursor-glow");
window.addEventListener("mousemove", (event) => {
  if (!glow) {
    return;
  }

  glow.style.left = `${event.clientX}px`;
  glow.style.top = `${event.clientY}px`;
});

const counters = document.querySelectorAll("[data-counter]");
const numberFormatter = new Intl.NumberFormat("en-IN");
const startCounter = (element) => {
  const target = Number(element.dataset.counter || 0);
  const suffix = element.dataset.suffix || "";
  const duration = 1300;
  const start = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const value = Math.round(progress * target);
    element.textContent = `${numberFormatter.format(value)}${suffix}`;

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const counterObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !entry.target.dataset.started) {
        entry.target.dataset.started = "true";
        startCounter(entry.target);
      }
    });
  },
  { threshold: 0.6 }
);

counters.forEach((counter) => counterObserver.observe(counter));

const sectors = {
  lpg: {
    title: "LPG distribution workflow",
    copy:
      "Cylinder-first stock logic, refill routes, priority household delivery, and register reconciliation built for day-end closure.",
    meta: ["Proprietor", "Cylinder", "Refill delivery"],
  },
  petroleum: {
    title: "Petroleum dealer workflow",
    copy:
      "Forecourt stock movement, tanker receipt tracking, and shift-wise reconciliation designed for high-frequency transactions.",
    meta: ["Dealer", "Kilolitre", "Tanker delivery"],
  },
  solar: {
    title: "Solar partner workflow",
    copy:
      "Installation pipeline, site visit scheduling, and service callbacks under one operational timeline.",
    meta: ["Partner", "kWh / Panel", "Installation job"],
  },
  water: {
    title: "Water route workflow",
    copy:
      "Can and litre inventory, recurring route optimization, and delivery proof tracking for dense route clusters.",
    meta: ["Partner", "Litre / Can", "Route delivery"],
  },
};

const tabButtons = document.querySelectorAll(".sector-tab");
const panel = document.querySelector("#sector-panel");
const panelTitle = panel ? panel.querySelector(".sector-title") : null;
const panelCopy = panel ? panel.querySelector(".sector-copy") : null;
const panelMeta = panel ? panel.querySelector(".sector-meta") : null;

const renderSector = (sectorKey) => {
  if (!panelTitle || !panelCopy || !panelMeta || !sectors[sectorKey]) {
    return;
  }

  const data = sectors[sectorKey];
  panelTitle.textContent = data.title;
  panelCopy.textContent = data.copy;
  panelMeta.innerHTML = `
    <span><strong>Admin role:</strong> ${data.meta[0]}</span>
    <span><strong>Stock unit:</strong> ${data.meta[1]}</span>
    <span><strong>Delivery model:</strong> ${data.meta[2]}</span>
  `;
};

tabButtons.forEach((button) => {
  button.addEventListener("click", () => {
    tabButtons.forEach((tab) => tab.classList.remove("is-active"));
    button.classList.add("is-active");
    const sector = button.dataset.sector;
    renderSector(sector);
    if (sectorProfiles[sector]) {
      activeSector = sector;
      metricState = {
        routes: sectorProfiles[sector].routes.base,
        orders: sectorProfiles[sector].orders.base,
        variance: sectorProfiles[sector].variance.base,
        complaints: sectorProfiles[sector].complaints.base,
      };
      paintOps(true);
    }
  });
});

const billingButtons = document.querySelectorAll(".toggle-btn");
const priceElements = document.querySelectorAll(".price[data-monthly][data-annual]");
const currency = new Intl.NumberFormat("en-IN");

const updateBilling = (mode) => {
  priceElements.forEach((price) => {
    const value = Number(mode === "annual" ? price.dataset.annual : price.dataset.monthly);
    const cadence = mode === "annual" ? "/month billed annually" : "/month";
    price.innerHTML = `INR ${currency.format(value)}<span>${cadence}</span>`;
  });
};

billingButtons.forEach((button) => {
  button.addEventListener("click", () => {
    billingButtons.forEach((node) => node.classList.remove("active"));
    button.classList.add("active");
    updateBilling(button.dataset.billing);
  });
});

const sectorProfiles = {
  lpg: {
    routes: { base: 22, swing: 5, min: 12, max: 32 },
    orders: { base: 96, swing: 18, min: 42, max: 140 },
    variance: { base: 3, swing: 2, min: 0, max: 8 },
    complaints: { base: 7, swing: 3, min: 2, max: 14 },
  },
  petroleum: {
    routes: { base: 12, swing: 3, min: 6, max: 20 },
    orders: { base: 68, swing: 14, min: 30, max: 110 },
    variance: { base: 2, swing: 1, min: 0, max: 5 },
    complaints: { base: 5, swing: 2, min: 1, max: 10 },
  },
  solar: {
    routes: { base: 8, swing: 2, min: 3, max: 14 },
    orders: { base: 24, swing: 6, min: 10, max: 44 },
    variance: { base: 1, swing: 1, min: 0, max: 3 },
    complaints: { base: 4, swing: 2, min: 1, max: 8 },
  },
  water: {
    routes: { base: 26, swing: 6, min: 14, max: 38 },
    orders: { base: 132, swing: 24, min: 70, max: 190 },
    variance: { base: 4, swing: 2, min: 1, max: 9 },
    complaints: { base: 8, swing: 3, min: 3, max: 16 },
  },
};

let activeSector = "lpg";
let metricState = {
  routes: sectorProfiles.lpg.routes.base,
  orders: sectorProfiles.lpg.orders.base,
  variance: sectorProfiles.lpg.variance.base,
  complaints: sectorProfiles.lpg.complaints.base,
};

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));

const upsertDeltaTag = (valueNode, delta) => {
  if (!valueNode || !valueNode.parentElement) {
    return;
  }

  let changeNode = valueNode.parentElement.querySelector(".ops-change");
  if (!changeNode) {
    changeNode = document.createElement("p");
    changeNode.className = "ops-change";
    valueNode.insertAdjacentElement("afterend", changeNode);
  }

  const sign = delta >= 0 ? "+" : "";
  changeNode.textContent = `${sign}${delta} vs previous refresh`;
};

const paintOps = (reset = false) => {
  const profile = sectorProfiles[activeSector];
  if (!profile) {
    return;
  }

  ["routes", "orders", "variance", "complaints"].forEach((key) => {
    const config = profile[key];
    const valueNode = document.querySelector(`#ops-${key}`);
    const barNode = document.querySelector(`#ops-${key}-bar`);

    if (!valueNode || !barNode) {
      return;
    }

    const prev = metricState[key] ?? config.base;
    let next = config.base;

    if (!reset) {
      const delta = Math.round((Math.random() * 2 - 1) * config.swing);
      next = clamp(prev + delta, config.min, config.max);
    }

    metricState[key] = next;
    valueNode.textContent = String(next);
    upsertDeltaTag(valueNode, next - prev);

    const widthPercent = ((next - config.min) / (config.max - config.min)) * 100;
    barNode.style.width = `${Math.max(8, widthPercent)}%`;
  });
};

paintOps(true);
window.setInterval(() => paintOps(false), 2800);

const openModalBtn = document.querySelector("#open-demo-modal");
const closeModalBtn = document.querySelector("#close-demo-modal");
const modal = document.querySelector("#demo-modal");
const form = document.querySelector("#demo-form");
const formMessage = document.querySelector("#demo-form-message");

const LEAD_CONFIG = {
  appsScriptUrl: "https://script.google.com/macros/s/AKfycbzE-bGp6TpHnUHdaaIe0MlZycJct5LVePIGh7rcV7EkIYm1Fl7k8sFO4E8DAhjcC3_Bbw/exec",
  notifyEmail: "tech.energyally@gmail.com",
};

const openModal = () => {
  if (!modal) {
    return;
  }

  modal.classList.add("open");
  modal.setAttribute("aria-hidden", "false");
};

const closeModal = () => {
  if (!modal) {
    return;
  }

  modal.classList.remove("open");
  modal.setAttribute("aria-hidden", "true");
};

if (openModalBtn) {
  openModalBtn.addEventListener("click", openModal);
}

if (closeModalBtn) {
  closeModalBtn.addEventListener("click", closeModal);
}

if (modal) {
  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });
}

window.addEventListener("keydown", (event) => {
  if (event.key === "Escape") {
    closeModal();
  }
});

if (form) {
  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    if (!formMessage) {
      return;
    }

    const data = new FormData(form);
    const payload = {
      name: String(data.get("name") || ""),
      phone: String(data.get("phone") || ""),
      email: String(data.get("email") || ""),
      sector: String(data.get("sector") || ""),
      teamSize: String(data.get("teamSize") || ""),
      notes: String(data.get("notes") || ""),
      requestedAt: new Date().toISOString(),
      source: "energyally-website",
    };

    if (!payload.name.trim()) {
      formMessage.textContent = "Please enter your name.";
      return;
    }

    if (!payload.phone.trim() && !payload.email.trim()) {
      formMessage.textContent = "Please provide at least one contact method: email or mobile.";
      return;
    }

    formMessage.textContent = "Submitting your request...";

    try {
      if (LEAD_CONFIG.appsScriptUrl) {
        const response = await fetch(LEAD_CONFIG.appsScriptUrl, {
          method: "POST",
          mode: "cors",
          redirect: "follow",
          // text/plain keeps this a simple CORS request and avoids preflight issues.
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body: JSON.stringify(payload),
        });

        if (!response.ok) {
          throw new Error(`Lead endpoint returned ${response.status}`);
        }

        try {
          const result = await response.json();
          if (result && result.ok === false) {
            throw new Error("Lead endpoint reported failure");
          }
        } catch {
          // Some deployments may not return JSON; HTTP 2xx is treated as success.
        }
      }
      formMessage.textContent = "Request captured. Our team will contact you shortly.";
      form.reset();
      setTimeout(() => closeModal(), 900);
    } catch (error) {
      formMessage.textContent = "Submission failed. Please try again in a moment.";
    }
  });
}
