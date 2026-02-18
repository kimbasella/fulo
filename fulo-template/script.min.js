const root = document.documentElement;
const toggle = document.getElementById("themeToggle");
const label = toggle?.querySelector(".toggle-label");
const icon = toggle?.querySelector("[data-icon]");
const themeMeta = document.getElementById("theme-color");
const navToggle = document.getElementById("navToggle");
const mobileNav = document.getElementById("mobileNav");

const themeColors = {
  dark: "#0b1220",
  light: "#f8fafc",
};

function setTheme(theme) {
  root.setAttribute("data-theme", theme);
  toggle?.setAttribute("aria-pressed", theme === "dark");
  if (label) label.textContent = theme === "dark" ? "Dark" : "Light";
  if (icon) icon.textContent = theme === "dark" ? "🌙" : "☀️";
  if (themeMeta) themeMeta.setAttribute("content", themeColors[theme]);
  localStorage.setItem("theme", theme);
}

const storedTheme = localStorage.getItem("theme");
setTheme(storedTheme || "dark");

toggle?.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  setTheme(next);
});

if (navToggle && mobileNav) {
  navToggle.addEventListener("click", () => {
    const isOpen = mobileNav.classList.toggle("open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
  });

  mobileNav.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      mobileNav.classList.remove("open");
      navToggle.setAttribute("aria-expanded", "false");
    });
  });
}

const yearEl = document.getElementById("year");
if (yearEl) yearEl.textContent = new Date().getFullYear();
