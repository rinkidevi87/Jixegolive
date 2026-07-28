(function () {
  "use strict";

  const channelUrl = window.JIXEGO_CONFIG.CHANNEL_URL;
  const page = document.body.dataset.page || "home";
  let siteData = null;

  const icons = {
    play: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M8 5v14l11-7z"/></svg>',
    youtube: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.6 12 3.6 12 3.6s-7.5 0-9.4.5A3 3 0 0 0 .5 6.2 31 31 0 0 0 0 12a31 31 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.5 9.4.5 9.4.5s7.5 0 9.4-.5a3 3 0 0 0 2.1-2.1A31 31 0 0 0 24 12a31 31 0 0 0-.5-5.8ZM9.6 15.6V8.4L15.8 12l-6.2 3.6Z"/></svg>',
    search: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m21 20-4.7-4.7a7.5 7.5 0 1 0-1 1L20 21l1-1ZM5 10.5a5.5 5.5 0 1 1 11 0 5.5 5.5 0 0 1-11 0Z"/></svg>',
    menu: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 6h18v2H3V6Zm0 5h18v2H3v-2Zm0 5h18v2H3v-2Z"/></svg>',
    close: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m6.4 5 5.6 5.6L17.6 5 19 6.4 13.4 12l5.6 5.6-1.4 1.4-5.6-5.6L6.4 19 5 17.6l5.6-5.6L5 6.4 6.4 5Z"/></svg>',
    arrow: '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m12 4 8 8-1.4 1.4-5.6-5.6V21h-2V7.8l-5.6 5.6L4 12l8-8Z"/></svg>'
  };

  function navigation() {
    const links = [["home", "Home", "index.html"], ["videos", "Videos", "videos.html"], ["shorts", "Shorts", "shorts.html"], ["about", "About", "about.html"], ["contact", "Contact", "contact.html"]];
    return `
      <header class="site-header" id="site-header">
        <a class="brand" href="index.html" aria-label="JixeGo Live home">
          <span class="brand-mark">${icons.play}</span><span>JixeGo <b>Live</b></span>
        </a>
        <nav class="desktop-nav" aria-label="Primary navigation">
          ${links.map(([id, label, href]) => `<a href="${href}" ${page === id ? 'aria-current="page"' : ""}>${label}</a>`).join("")}
        </nav>
        <div class="nav-actions">
          <a class="icon-button search-link" href="videos.html#search" aria-label="Search videos">${icons.search}</a>
          <a class="button button-small" href="${channelUrl}?sub_confirmation=1" target="_blank" rel="noopener">Subscribe</a>
          <button class="icon-button menu-toggle" type="button" aria-label="Open menu" aria-expanded="false">${icons.menu}</button>
        </div>
      </header>
      <div class="mobile-menu" aria-hidden="true">
        <div class="mobile-menu-top"><span>Explore</span><button class="icon-button menu-close" aria-label="Close menu">${icons.close}</button></div>
        ${links.map(([id, label, href], index) => `<a href="${href}" style="--menu-index:${index}" ${page === id ? 'aria-current="page"' : ""}>${String(index + 1).padStart(2, "0")} <span>${label}</span></a>`).join("")}
      </div>`;
  }

  function footer() {
    return `
      <footer class="site-footer">
        <div class="footer-main">
          <div><a class="brand footer-brand" href="index.html"><span class="brand-mark">${icons.play}</span><span>JixeGo <b>Live</b></span></a><p>Fresh uploads, quick Shorts, and every new moment from JixeGo Live.</p></div>
          <div class="footer-links"><span>Explore</span><a href="videos.html">Videos</a><a href="shorts.html">Shorts</a><a href="about.html">About</a></div>
          <div class="footer-links"><span>Legal</span><a href="privacy.html">Privacy</a><a href="terms.html">Terms</a><a href="contact.html">Contact</a></div>
          <div class="footer-social"><span>Follow</span><a href="${channelUrl}" target="_blank" rel="noopener">${icons.youtube} YouTube</a><a href="${channelUrl}/videos" target="_blank" rel="noopener">Latest uploads</a></div>
        </div>
        <div class="footer-bottom"><span>© <span data-year></span> JixeGo Live</span><span>Made for the next upload.</span></div>
      </footer>
      <button class="back-to-top" aria-label="Back to top">${icons.arrow}</button>
      <div class="player-modal" role="dialog" aria-modal="true" aria-label="Video player" aria-hidden="true">
        <button class="player-close" aria-label="Close video">${icons.close}</button>
        <div class="player-frame"><iframe title="JixeGo Live video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe></div>
      </div>`;
  }

  function formatNumber(value) {
    return new Intl.NumberFormat("en", { notation: "compact", maximumFractionDigits: 1 }).format(value || 0);
  }

  function formatDate(value) {
    if (!value) return "Recent upload";
    return new Intl.DateTimeFormat("en", { month: "short", day: "numeric", year: "numeric" }).format(new Date(value));
  }

  function videoCard(video, short = false) {
    return `<article class="video-card ${short ? "short-card" : ""}" data-video-id="${video.id}" data-title="${escapeHtml(video.title)}" data-category="${escapeHtml(video.category)}">
      <button class="video-thumb play-video" aria-label="Play ${escapeHtml(video.title)}">
        <img src="${video.thumbnail}" alt="${escapeHtml(video.title)}" loading="lazy" width="640" height="360">
        <span class="duration">${video.duration}</span><span class="play-badge">${icons.play}</span>
      </button>
      <div class="video-copy"><span class="video-kicker">${video.category}</span><h3>${escapeHtml(video.title)}</h3>
        <div class="video-meta"><span>${formatNumber(video.views)} views</span><span>${formatDate(video.publishedAt)}</span></div>
        <a class="watch-link" href="https://www.youtube.com/watch?v=${video.id}" target="_blank" rel="noopener">Watch on YouTube <span>↗</span></a>
      </div>
    </article>`;
  }

  function escapeHtml(value = "") {
    return value.replace(/[&<>'"]/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;" }[char]));
  }

  function skeletons(count = 4, short = false) {
    return Array.from({ length: count }, () => `<div class="video-card skeleton ${short ? "short-card" : ""}"><div class="video-thumb"></div><div class="video-copy"><span></span><h3></h3><p></p></div></div>`).join("");
  }

  function setupRequired(target) {
    target.innerHTML = `<div class="setup-card"><span class="eyebrow">One-time setup</span><h2>Connect the channel feed</h2><p>Open <code>assets/js/config.js</code>, paste a browser-restricted YouTube Data API v3 key into <code>YOUTUBE_API_KEY</code>, then deploy. Channel branding, statistics, uploads, Shorts, and future videos load automatically.</p><a class="button" href="https://console.cloud.google.com/apis/library/youtube.googleapis.com" target="_blank" rel="noopener">Open Google Cloud</a></div>`;
  }

  function renderError(target, error) {
    target.innerHTML = `<div class="setup-card error-card"><span class="eyebrow">Feed unavailable</span><h2>YouTube took a timeout</h2><p>${escapeHtml(error.message)}</p><button class="button retry-button" type="button">Try again</button></div>`;
    target.querySelector(".retry-button")?.addEventListener("click", () => location.reload());
  }

  function applyChannel(channel) {
    document.querySelectorAll("[data-channel-name]").forEach((node) => node.textContent = channel.title);
    document.querySelectorAll("[data-channel-description]").forEach((node) => node.textContent = channel.description);
    document.querySelectorAll("[data-channel-logo]").forEach((image) => { image.src = channel.logo; image.alt = `${channel.title} channel logo`; });
    document.querySelectorAll("[data-stat-subscribers]").forEach((node) => node.textContent = formatNumber(channel.subscribers));
    document.querySelectorAll("[data-stat-videos]").forEach((node) => node.textContent = formatNumber(channel.videos));
    document.querySelectorAll("[data-stat-views]").forEach((node) => node.textContent = formatNumber(channel.views));
    if (channel.banner) document.querySelectorAll("[data-channel-banner]").forEach((node) => node.style.backgroundImage = `linear-gradient(90deg, rgba(10,10,12,.94) 0%, rgba(10,10,12,.56) 55%, rgba(10,10,12,.24) 100%), url('${channel.banner}')`);
  }

  function renderHome(data) {
    applyChannel(data.channel);
    const featured = data.videos[0] || data.uploads[0];
    const featuredTarget = document.querySelector("[data-featured]");
    if (featured && featuredTarget) featuredTarget.innerHTML = `<button class="featured-media play-video" data-video-id="${featured.id}" aria-label="Play ${escapeHtml(featured.title)}"><img src="${featured.thumbnail}" alt="${escapeHtml(featured.title)}" width="1280" height="720"><span class="featured-play">${icons.play}</span><span class="duration">${featured.duration}</span></button><div class="featured-copy"><span class="eyebrow">Newest release</span><h2>${escapeHtml(featured.title)}</h2><p>${escapeHtml(featured.description.slice(0, 180))}${featured.description.length > 180 ? "…" : ""}</p><div class="featured-actions"><button class="button play-video" data-video-id="${featured.id}">${icons.play} Play video</button><a class="button button-ghost" href="https://www.youtube.com/watch?v=${featured.id}" target="_blank" rel="noopener">Watch on YouTube</a></div></div>`;
    renderCards("[data-latest-grid]", data.videos.slice(0, 6));
    renderCards("[data-shorts-grid]", data.shorts.slice(0, 6), true);
    renderCards("[data-popular-grid]", data.popular.slice(0, 6));
  }

  function renderCards(selector, videos, short = false) {
    const target = document.querySelector(selector);
    if (!target) return;
    target.innerHTML = videos.length ? videos.map((video) => videoCard(video, short)).join("") : `<div class="empty-state"><span>No videos here yet.</span><p>New uploads appear automatically.</p></div>`;
  }

  function renderArchive(data, type) {
    applyChannel(data.channel);
    const all = type === "shorts" ? data.shorts : data.videos;
    const grid = document.querySelector("[data-archive-grid]");
    const resultCount = document.querySelector("[data-result-count]");
    const search = document.querySelector("[data-video-search]");
    const categoryBar = document.querySelector("[data-categories]");
    let activeCategory = "All";

    const categories = ["All", ...new Set(all.map((video) => video.category))];
    categoryBar.innerHTML = categories.map((category) => `<button class="category-chip ${category === "All" ? "active" : ""}" data-category-filter="${escapeHtml(category)}">${escapeHtml(category)}</button>`).join("");

    const update = () => {
      const query = search.value.trim().toLowerCase();
      const filtered = all.filter((video) => (activeCategory === "All" || video.category === activeCategory) && (!query || `${video.title} ${video.description}`.toLowerCase().includes(query)));
      grid.innerHTML = filtered.length ? filtered.map((video) => videoCard(video, type === "shorts")).join("") : `<div class="empty-state"><span>No matching videos.</span><p>Try a different search or category.</p></div>`;
      resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "result" : "results"}`;
    };
    search.addEventListener("input", update);
    categoryBar.addEventListener("click", (event) => {
      const button = event.target.closest("[data-category-filter]");
      if (!button) return;
      activeCategory = button.dataset.categoryFilter;
      categoryBar.querySelectorAll("button").forEach((chip) => chip.classList.toggle("active", chip === button));
      update();
    });
    update();
  }

  function openPlayer(videoId) {
    const modal = document.querySelector(".player-modal");
    const frame = modal.querySelector("iframe");
    frame.src = `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`;
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
  }

  function closePlayer() {
    const modal = document.querySelector(".player-modal");
    modal.classList.remove("open");
    modal.setAttribute("aria-hidden", "true");
    modal.querySelector("iframe").src = "";
    document.body.classList.remove("modal-open");
  }

  function setupInteractions() {
    const menu = document.querySelector(".mobile-menu");
    const toggle = document.querySelector(".menu-toggle");
    const setMenu = (open) => {
      menu.classList.toggle("open", open); menu.setAttribute("aria-hidden", String(!open)); toggle.setAttribute("aria-expanded", String(open)); document.body.classList.toggle("menu-open", open);
    };
    toggle.addEventListener("click", () => setMenu(true));
    document.querySelector(".menu-close").addEventListener("click", () => setMenu(false));
    document.addEventListener("click", (event) => {
      const trigger = event.target.closest(".play-video");
      if (!trigger) return;
      const id = trigger.dataset.videoId || trigger.closest("[data-video-id]")?.dataset.videoId;
      if (id) openPlayer(id);
    });
    document.querySelector(".player-close").addEventListener("click", closePlayer);
    document.querySelector(".player-modal").addEventListener("click", (event) => { if (event.target.classList.contains("player-modal")) closePlayer(); });
    document.addEventListener("keydown", (event) => { if (event.key === "Escape") { closePlayer(); setMenu(false); } });
    const topButton = document.querySelector(".back-to-top");
    window.addEventListener("scroll", () => { topButton.classList.toggle("visible", scrollY > 600); document.querySelector(".site-header").classList.toggle("scrolled", scrollY > 20); }, { passive: true });
    topButton.addEventListener("click", () => scrollTo({ top: 0, behavior: "smooth" }));
    document.querySelectorAll("[data-year]").forEach((node) => node.textContent = new Date().getFullYear());
  }

  async function initData() {
    const dataRoot = document.querySelector("[data-api-root]");
    if (!dataRoot) return;
    if (page === "videos" || page === "shorts") {
      const archive = document.querySelector("[data-archive-grid]");
      if (archive) archive.innerHTML = skeletons(page === "shorts" ? 10 : 8, page === "shorts");
    }
    if (page === "home") {
      const shorts = document.querySelector("[data-shorts-grid]");
      const popular = document.querySelector("[data-popular-grid]");
      if (shorts) shorts.innerHTML = skeletons(6, true);
      if (popular) popular.innerHTML = skeletons(3);
    }
    try {
      siteData = await window.JixeGoYouTube.load();
      if (page === "home") renderHome(siteData);
      if (page === "videos" || page === "shorts") renderArchive(siteData, page);
      if (page === "about") applyChannel(siteData.channel);
      document.body.classList.add("data-ready");
    } catch (error) {
      if (error.message === "API_KEY_MISSING") setupRequired(dataRoot);
      else renderError(dataRoot, error);
    }
  }

  document.body.insertAdjacentHTML("afterbegin", navigation());
  document.body.insertAdjacentHTML("beforeend", footer());
  setupInteractions();
  initData();
  if ("serviceWorker" in navigator) window.addEventListener("load", () => navigator.serviceWorker.register("/service-worker.js"));
})();
