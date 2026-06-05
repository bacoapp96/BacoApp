(function () {
  const storageKey = "bacoapp_theme";
  const fallbackTheme = "dark";
  const validThemes = ["dark", "gold", "neon", "minimal"];

  function getTheme() {
    const savedTheme = localStorage.getItem(storageKey);
    return validThemes.includes(savedTheme) ? savedTheme : fallbackTheme;
  }

  function applyTheme(theme) {
    const nextTheme = validThemes.includes(theme) ? theme : fallbackTheme;
    document.documentElement.dataset.theme = nextTheme;
    localStorage.setItem(storageKey, nextTheme);
    document.dispatchEvent(new CustomEvent("bacoapp:themechange", { detail: { theme: nextTheme } }));
  }

  window.BacoTheme = {
    get: getTheme,
    set: applyTheme,
    themes: validThemes
  };

  applyTheme(getTheme());

  window.addEventListener("storage", (event) => {
    if (event.key === storageKey) {
      applyTheme(getTheme());
    }
  });
})();
