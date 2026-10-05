const sidebarToggle = document.getElementById("sidebarToggle");
const sidebar = document.getElementById("appSidebar");
const sidebarOverlay = document.getElementById("sidebarOverlay");
const SIDEBAR_STATE_KEY = "restaurantSidebarExpanded";

function setSidebarState(expanded) {
  if (!sidebar) return;
  sidebar.classList.toggle("collapsed", !expanded);
  document.body.classList.toggle("sidebar-expanded", expanded);
  localStorage.setItem(SIDEBAR_STATE_KEY, String(expanded));
  if (sidebarToggle) {
    sidebarToggle.setAttribute("aria-expanded", String(expanded));
    sidebarToggle.setAttribute("aria-label", expanded ? "Collapse navigation" : "Expand navigation");
  }
}

function closeMobileSidebar() {
  if (!sidebar) return;
  sidebar.classList.remove("mobile-open");
  if (sidebarOverlay) sidebarOverlay.classList.remove("visible");
}

function initSidebar() {
  if (!sidebar) return;

  const savedState = localStorage.getItem(SIDEBAR_STATE_KEY);
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  setSidebarState(savedState === null ? !isMobile : savedState === "true");

  const currentPage = window.location.pathname.split("/").pop() || "index.html";
  sidebar.querySelectorAll(".sidebar-link").forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === currentPage);
  });

  sidebarToggle?.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 760px)").matches) {
      sidebar.classList.toggle("mobile-open");
      sidebarOverlay?.classList.toggle("visible", sidebar.classList.contains("mobile-open"));
      return;
    }
    setSidebarState(sidebar.classList.contains("collapsed"));
  });

  sidebarOverlay?.addEventListener("click", closeMobileSidebar);

  sidebar.querySelectorAll(".sidebar-link").forEach((link) => {
    link.addEventListener("click", closeMobileSidebar);
  });

  window.addEventListener("resize", () => {
    if (!window.matchMedia("(max-width: 760px)").matches) {
      closeMobileSidebar();
      const expanded = localStorage.getItem(SIDEBAR_STATE_KEY);
      setSidebarState(expanded !== "false");
    }
  });
}

initSidebar();
